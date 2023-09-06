from flask_restful import Resource
from flask import request,jsonify,send_file
import json
from flask.views import MethodView
from terraform.Repodata import module,listarguments,listresource,read,listattributes
from terraform.scriptGenerator import writescript,main_script,delete_script,download_script,gitcommit,checkov
from terraform.Mongo.DbConnection import Template,app,Users,CustomTemplate,Modules,Project
from terraform.Validation import get_template,validate_templatename,list_templates,get_projects,get_module,list_modules


class ListRepoData(Resource):
    def post(self):
        try:
            data = request.get_json()
            app.logger.info(str(data))
            if data["id"] == "resource":
                app.logger.info(str(data))
                output = listresource(read(data['provider']), data["modulename"],data["type"])
            elif data["id"] == "module":
                output = module(read(data['provider']))
            elif data["id"] == "attributes":
                output = listattributes(read(data['provider']),data['resourcename'],data["type"])    
            elif data["id"] == "arguments":
                output = listarguments(read(data['provider']),data['resourcename'],data["type"])
            response = jsonify(output)
            app.logger.info(data["id"]+" got executed ")
            return response   
        except Exception as e:
            app.logger.error(str(e))
            return jsonify(e)


class GenerateScript(Resource):

    def post(self):
        try:
            data = request.get_json()
            app.logger.info(str(data))
            output=writescript(data["template_name"],data['variables'],data['language'],data['region'],data['snowflakeId'])
            return jsonify(output)
        except Exception as e:
            app.logger.error(str(e.args))
            return jsonify(e.args)   

class Validation(Resource):

    def post(self):
        try:
            data = request.get_json()
            app.logger.info(str(data))
            output= validate_templatename(data["template_name"])
            return jsonify(output)
        except Exception as e:
            app.logger.error(str(e.args))
            return jsonify(e.args)

class GetTemplate(Resource):

    def post(self):
        try:
            data = request.get_json()
            app.logger.info(str(data))
            output=get_template(data["template_name"])
            return jsonify(output)
        except Exception as e:
            app.logger.error(str(e.args))
            return jsonify(e.args)

class ListTemplates(Resource):

    def post(self):
        try:
            project=request.get_json()["project"]
            templates=list_templates(project)
            return jsonify(templates)
        except Exception as e:
            app.logger.error(str(e.args))
            return jsonify(e.args)    


# class  SaveTemplate(Resource):

#     def post(self):
#         try:
#             body = request.get_json()
#             app.logger.info(str(body))
#             Template(provider=body['provider'],template_name=body['template_name'],template_desc=body['template_desc'],data=body['data'],custom=body['custom'],nodes=["nodes"],edges=["edges"],project=body["project"]).save()
#             if body["custom"]:
#                 CustomTemplate(template_name=body['template_name'],custom_data=body['custom_data']).save()
#             app.logger.info("template save with id "+str(body))
#             main_script(body['data'],body['provider'],body['template_name'],body["custom"],body["custom_data"])
#             return jsonify("saved")
#         except Exception as e:
#             app.logger.error(str(e.args))
#             return jsonify(e.args) 

class EditTemplate(Resource):               

    def post(self):
        try:
            body=request.get_json()
            has_custom = Template.objects.get(template_name=body["template_name"]).custom_data
            Template.objects.get(template_name=body["template_name"]).update(provider=body['provider'],template_name=body['template_name'],template_desc=body['template_desc'],data=body['data'],nodes=body['nodes'],edges=body['edges'])
            if body["custom"] and has_custom:
                CustomTemplate.objects.get(template_name=body['template_name']).update(template_name=body['template_name'], custom_data=body['custom_data'])
            elif body['custom']:
                CustomTemplate(template_name=body['template_name'], custom_data=body['custom_data']).save()    
            app.logger.info(str(body))
            main_script(body['data'],body['provider'],body['template_name'],body["custom"],body["custom_data"],body['edges'],body['modules_save'],body['language'],body['region'],body['snowflakeId'])
            return jsonify("Saved")
        except Exception as e:
            app.logger.error(str(e))
            return jsonify(e.args)

class DeleteTemplate(Resource):

    def post(self):
        try:
            data=request.get_json()
            Template.objects.get(template_name=data["template_name"]).delete()
            delete_script(data["template_name"])
            app.logger.info("Template Deleted"+data["template_name"])
            return jsonify("deleted")
        except Exception as e:
            app.logger.error(str(e))
            return jsonify(e.args) 

class Signup(Resource):

    def post(self):
        body = request.get_json()
        user = Users(**body)
        user.hash_password()
        user.save()
        return jsonify("success") 


class Login(Resource):


    def post(self):
        body = request.get_json()
        app.logger.info(body)
        user = Users.objects.get(email=body.get('email'))
        print(user)
        print("loginnnnn")
        authorized = user.check_password(body.get('password'))
        role=user.role
        # for obj in Users.objects.all():
        #         if(obj['email']==user.email):
        #             role=obj['role']
        print(role+"loginn")
        if not authorized:
            return jsonify('Email or password invalid')
        return jsonify({'message':'Success','role':role})   


class Export(Resource):

    def post(self):
        body=request.get_json()
        return send_file(download_script(body['template_name']),download_name='test.zip',as_attachment=True)

class GetProjects(Resource):
    def get(self):
        try:
            projects = get_projects()
            return jsonify(projects)
        except Exception as e:
            return e

class CreateProject(Resource):
    def post(self):
        try:
            data = request.get_json()
            name = data['name']
            desc = data['description']
            Project(name=name,project_desc=desc).save()

            return jsonify("Success")
        except Exception as e:
            return e.args

class  SaveModule(Resource):

    def post(self):
        try:
            body = request.get_json()
            module=Modules(provider=body['provider'],module_name=body['template_name'],module_desc=body['template_desc'],data=body['data'],custom_data=body['custom'],nodes=body['nodes'],edges=body['edges']).save()
            
            if body["custom"]:
                CustomTemplate(template_name=body['template_name'],custom_data=body['custom_data']).save()

            app.logger.info("template save with id "+str(module.id))
            
            return jsonify("saved")
        except Exception as e:
            app.logger.error(str(e))
            return jsonify(e.args)   

class ListModules(Resource):

    def get(self):
        try:
            modules=list_modules()
            return jsonify(modules)
            
        except Exception as e:
            app.logger.error(str(e.args))
            return jsonify(e.args) 

class GetModule(Resource):

    def post(self):
        try:
            data = request.get_json()
            app.logger.info(str(data))
            output=get_module(data["module_name"])
            return jsonify(output)
        except Exception as e:
            app.logger.error(str(e.args))
            return jsonify(e.args)

class  SaveTemplate(Resource):

    def post(self):
        try:
            
            body = request.get_json()
            
            project = str(Project.objects.get(name=body['project']).id)
            template=Template(provider=body['provider'],template_name=body['template_name'],template_desc=body['template_desc'],data=body['data'],custom_data=body['custom'],nodes=body['nodes'],edges=body['edges'],project=project).save()
            
            if body["custom"]:
                CustomTemplate(template_name=body['template_name'],custom_data=body['custom_data']).save()

            app.logger.info("template save with id "+str(template.id))
            main_script(body['data'],body['provider'],body['template_name'],body["custom"],body["custom_data"],body['edges'],body['modules_save'],body['language'],body['region'],body['snowflakeId'])
            return jsonify("saved")
        except Exception as e:
            app.logger.error(str(e.args))
            return jsonify(e.args) 
        

class Gitcommit(Resource):

    def post(self):
        try:
            body=request.get_json()
            gitcommit(token=body['token'],repo_name=body['reponame'],template_name=body['templatename'],commit_message=body['message'],branch_name=body['branch'])
            return jsonify("success")
        except Exception as e:
            return jsonify(e) 

class EditModule(Resource):

    def post(self):
        try:
            body=request.get_json()
            Modules.objects.get(module_name=body["module_name"]).update(provider=body['provider'], module_name=body['module_name'], module_desc=body['module_desc'], data=body['data'], nodes=body['nodes'], edges=body['edges'])  
            return jsonify('Saved')
        except Exception as e:
            app.logger.error(e)
            return e.args


class CheckovDownload(Resource):

    def post(self):
        try:
            body=request.get_json()
            return send_file(checkov(body['templatename']),download_name='checkov.txt',as_attachment=True)
        except Exception as e:
            app.logger.error(e)
            return e.args 
        
class UserList(MethodView):

    def get(self):
        usersList = []
        for obj in Users.objects.all():
            usersList.append({'name':obj['email'].split('@')[0],'email':obj['email'],'role':obj['role']})
            print(obj['email'])
        return usersList, 200
    
    
# code added by jesh for reading arguments
class ArgumentAPI:
    def __init__(self, repo_path):
        self.repo_path = repo_path

    def get_arguments(self):
        with open(self.repo_path) as repo_file:
            data = json.load(repo_file)
            arguments = []

            for item in data:
                if 'Argument_Reference' in item:
                    for arg in item['Argument_Reference']:
                        arguments.append(arg)

            return arguments







    
# class GetUserRoleView(MethodView):
#     def post(self):
#         print("ran success")
#         data = request.json
#         role=""
#         print(data)
#         if "eemail" in data:
#             email = data["eemail"]
#             print(email)
#             # Perform a database lookup based on the email (replace this with your actual database query)
#             for obj in Users.objects.all():
#                 if(obj['email']==email):
#                     role=obj['role']
#         print(role)
#         return role
    
    #print(updated_list+"updatedlist")
        #print(data['list']+"datalist")
        # Process and save the updated list as needed
        # For example, you can store it in a database or a file
        #response_data = {'message': 'List saved successfully'}
             

