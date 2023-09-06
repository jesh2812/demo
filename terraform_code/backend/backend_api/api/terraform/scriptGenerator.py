from terraform.ExecuteScript import ExecuteScript
from terraform.Mongo.DbConnection import app
from terraform.Validation import get_module
from io import BytesIO
import os,json ,pandas as pd,shutil,zipfile,subprocess
from github import Github


Base_dir="Repofiles/static/Scripts/"

def prepareoutput(attribute_list, resource, objectname):
    if len(attribute_list) == 1:
        attdat = "${" + resource + "." + objectname + "." + attribute_list[0] + "}"
    else:
        att_list = ["${" + resource + "." + objectname + "." + a + "}" for a in attribute_list ]
        attdat = '[' + ','.join(att_list) + ']'
    return attdat


def main_script(data, provid,template_name,custom,custom_data,edges,ismodule,lang,region,snowflakeId):
    prov=get_provider(provid,lang,region,snowflakeId)
    df=get_dataframe(data,edges,ismodule)
    if lang=='json':
        json_syntax(prov,df,custom,custom_data,template_name,lang)
    else:
        hcl_syntax(df.to_dict(orient='records'),prov,template_name)

def json_syntax(prov,df,custom,custom_data,template_name,lang):
    script_list= [];variable_list=[]
    script_list.append(prov)
    for service in df['object_name'].tolist():
        rtype = 'resource' if df[(df["object_name"] == service)]['Resource_Type'].to_string(
            index=False) == "Resource" else 'data'
        resource = df[(df["object_name"] == service)]['resource'].to_list()
        arg_dict, var_list = get_arguments(df[(df["object_name"] == service)]['Arguments'].tolist()[0])
        script_list.append({rtype: {resource[0]: {service: arg_dict}}})
        variable_list.extend(var_list) if var_list else None 
        attribute_list = df[(df["object_name"] == service)]['Attributes'].to_list()[0]
        if attribute_list:
            attrdat = prepareoutput(attribute_list, resource[0], service)
            script_list.append({"output": {service: {"value": attrdat}}})
    if custom:
        script_list.append(custom_data)
    terraform_script('main.tf.json', template_name, script_list,lang)
    variable_script(variable_list,template_name,lang) if variable_list else None    

def variable_script(variable_list,template_name,lang):
    if lang!='json':
        var_str=''
        for c in variable_list:
            var_str += f'variable "{c}"{{ \n \t}}\n'
        terraform_script('variable.tf',template_name,var_str)
    else:        
        final_dict = {"variable": {variable: {} for variable in variable_list}}
        terraform_script('variable.tf.json', template_name, final_dict)


def terraform_script(file_name, template_name, data):
    os.mkdir(Base_dir+template_name) if not os.path.exists(Base_dir+template_name) else None
    with open(Base_dir+template_name+'/' + file_name, "w") as outfile:
        json.dump(data, outfile, indent=4) if 'json' in file_name else outfile.write(data)

def delete_script(template_name):
    shutil.rmtree(Base_dir+template_name) if os.path.exists(Base_dir+template_name) else None        


def get_arguments(arg_dict):
    vars_dict = {};vars_list = []
    for key, value in arg_dict.items():
        if not 'is_variable' in value.keys():
            vars_dict[key],child_list = get_arguments(value)
            vars_list.extend(child_list) if child_list else None
        else:
            vars_dict[key] = '${var.' + value['value'] + '}' if value['is_variable'] else value['value']
            vars_list.append(value['value']) if value['is_variable'] else None

    return vars_dict, vars_list

def generate_vars_scripts(vars_dict,template_name):
    vars_str = '{\n'
    for k, v in vars_dict.items():
        vars_str += f'{k} = "{v}"\n'
    terraform_script('terraform.tfvars',template_name,vars_str+'}')    

def writescript(template_name,vars_dict,lang):
    try:
        if vars_dict :
            terraform_script('terraform.tfvars.json', template_name, vars_dict) if lang=='json' else generate_vars_scripts(vars_dict,template_name)

        #ExecuteScript(template_name+'.tf.json')    
        return "Success"
    except Exception as e:
        app.logger.error(str(e.args))
        raise e.args

def download_script(template_name):        

    memory_file = BytesIO()
    with zipfile.ZipFile(memory_file, 'w', zipfile.ZIP_DEFLATED) as zf:
        for folderName, subfolders, filenames in os.walk(Base_dir+template_name):
            for filename in filenames:
                filePath = os.path.join(folderName, filename)
                zf.write(filePath, os.path.basename(filePath))
    memory_file.seek(0)

    return memory_file 

def gitcommit(token, repo_name, commit_message, template_name, branch_name="main"):
    g = Github(token)
    repo = g.get_user().get_repo(repo_name)
    all_files = check_file(repo, template_name)
    for fileName in [f for f in os.listdir(Base_dir+template_name)]:
        with open(Base_dir+template_name + '/' + fileName, 'r') as file:
            content = file.read()
        if all_files:
            if template_name + '/' + fileName in all_files:
                contents = repo.get_contents(template_name + '/' + fileName)
                repo.update_file(template_name + '/' + fileName, commit_message, content, contents.sha)
        else:
            repo.create_file(template_name + '/' + fileName, commit_message, content, branch=branch_name)
    return "Success"


def check_file(repo, template_name):
    all_files = []
    try:
        contents = repo.get_contents(template_name)
        while contents:
            file_content = contents.pop(0)
            if file_content.type == "dir":
                contents.extend(repo.get_contents(file_content.path))
            else:
                all_files.append(str(file_content).replace('ContentFile(path="', '').replace('")', ''))
    except Exception as e:
        return []
    return all_files

def get_dataframe(data,edges,modules): 
    if data and edges:      
        df=pd.read_json(json.dumps(data))
        df['object_name']=pd.Categorical(df['object_name'],get_order(edges),ordered=True)
        df.sort_values('object_name',inplace=True)
    elif modules: 
        module_data=modules_to_dataframe(get_order(edges))
        df=pd.read_json(json.dumps(module_data))
    else:
         df=pd.read_json(json.dumps(data))      
    return df 

def get_order(edges):
    node_order = {}
    for i, edge in enumerate(edges):
        node_order[edge['source']] = i
        node_order[edge['target']] = i + 1    
    return list(node_order.keys())

def modules_to_dataframe(module_list):
    module_data=[]
    for module in module_list:
        mdata,custom=get_module(module)
        for data in mdata['data']:
            module_data.append(data)
    return module_data        

def hcl_syntax(tdic,output,template_name):
    var_dic,finaloutv = [],''
    for resource in tdic:
        resource_block = f'{resource["Resource_Type"].lower()} "{resource["resource"]}" "{resource["object_name"]}" {{\n'
        hasi_block = get_block(resource["Arguments"], resource_block)
        variable = get_variables(resource["Arguments"])
        var_dic.extend(variable) if variable else None
        finaloutv += hcl_output_variables(resource["resource"], resource["object_name"], resource['Attributes'],
                                          finaloutv) if resource['Attributes'] else ''
        hasi_block += "}\n"
        output += f'{hasi_block} \n'
    terraform_script('main.tf',template_name,output)
    variable_script(var_dic,template_name,'hcl')  if var_dic else None
    terraform_script('output.tf',template_name,finaloutv) if finaloutv !='' else None

def get_block(prop, hasi):
    for key, value in prop.items():
        if 'value' not in value.keys():
            hasi += f'  {key} {{\n\t{get_block(value, "")}\t}}\n\t'
        else:
            if isinstance(value["value"], str):
                hasi += f'  {key} = var.{value["value"]}\n' if value[
                    'is_variable'] else f'  {key} = "{value["value"]}"\n'
            elif isinstance(value["value"], bool):
                hasi += f'  {key} = {str(value["value"]).lower()}\n'
            elif isinstance(value["value"], int) or isinstance(value["value"], float):
                hasi += f'  {key} = {value["value"]}\n'
            elif isinstance(value["value"], list):
                hasi += f'  {key} = {json.dumps(value["value"])}\n'
    return hasi

def get_provider(service,lang,region,snowflakeId):
    # if service=='aws':
    #     provider = {"provider": {'aws': {
    #    "region": 'ap-south-1'
    # }}}
    #     if lang == 'json':
    #         provider = {"provider": {'snowflake': {"role": 'SYSADMIN'}}} 
    #     else:
    #         terraform = {"required_providers": {
    #         "snowflake": {
    #             "source": "chanzuckerberg/snowflake",
    #             "version": "0.15.0"
    #         }
    #     }
    # }
    # print(service)
    # print(lang)
    # provider = {"provider": {service: {
    #    "region": 'ap-south-1'
    # }}} if lang=='json' else f'provider "aws" {{ \n \t region = "ap-south-1" \n}}\n\n'
    # if service=='azure':
    #     provider = {"provider": {'azurerm': {
    #    "region": 'ap-south-1'
    # }}} if lang=='json' else f'provider "azurerm" {{ \n \t region = "ap-south-1" \n}}\n\n'
    # if service=='gcp':
    #     provider = {"provider": {"google": {
    #         "project":"terraform",
    #         "region": "us-central1",
    #         "zone":"us-central1-c"
    #     }}} if lang=='json' else f'provider "aws" {{ \n \t region = "us-central1" \n\t project="terraform"\n}}\n\n'
    # if service=='snowflake':
    #     provider = {"required_providers":{
    #         "snowflake":{
    #             "source" : {"application/terraform"},
    #             "version" : {"0.15.0"}
    #         }
    #     }} if lang == 'json' else f'provider "snowflake" {{ \n \t region = "ap-south-1" \n\t project="terraform"\n}}\n\n'
    # return provider
    provider = {"provider": {service: {
       "region": 'ap-south-1'
    }}} if lang=='json' else f'provider "aws" {{ \n \t region = "ap-south-1" \n}}\n\n'
    if service=='azure':
        provider = {"provider": {'azurerm': {
       "region": 'ap-south-1'
    }}} if lang=='json' else f'provider "azurerm" {{ \n \t region = "ap-south-1" \n}}\n\n'
    if service=='gcp':
        provider = {"provider": {"google": {
            "project":"terraform",
            "region": "us-central1",
            "zone":"us-central1-c"
        }}} if lang=='json' else f'provider "aws" {{ \n \t region = "us-central1" \n\t project="terraform"\n}}\n\n'
    if service=='snowflake':
        provider = {"required_providers":{
            "snowflake":{
                "source" : {"application/terraform"},
                "version" : {"0.15.0"}
            }
        }} if lang == 'json' else f'terraform {{\n \t required_providers{{\n \t snowflake ={{\n \t source="Snowflake-Labs/snowflake" \n version="0.36.0"\n}}\n}}\n}} \nprovider "snowflake" {{ \n \t account = "{snowflakeId}" \n \t region = "{region}" \n \t role = "SYSADMIN"\n}}\n\n'
    return provider    

def get_variables(prop):
    vars_list = []
    for value in prop.values():
        vars_list.extend(get_variables(value)) if not 'is_variable' in value.keys() else (
            vars_list.append(value['value']) if value['is_variable'] else None)
    return vars_list

def checkov(template_name):
    try:
        out_path=os.path.join(os.getcwd(),Base_dir,'result.txt')
        with open(out_path, 'w') as t:
          subprocess.run(f'checkov --directory {Base_dir+template_name}', stdout=t, text=True, shell=True)
        return out_path
    except Exception as e:
        print(e)

def hcl_output_variables(resource, obj, attributes, outv):
    for att in attributes:
        outv += f'output "{obj}_{att}" {{ \n value = {resource}.{obj}.{att} \n }} \n\n'
    return outv