from terraform.Mongo.DbConnection import CustomTemplate, Template,app, Modules, Project

def get_projects():
    try:
        projects = []
        for obj in Project.objects.all():
            projects.append(obj.name)
        app.logger.info("Project list executed "+str(projects))
        return projects

    except Exception as e:
        app.logger.error(str(e.args))
        raise e.args

def list_modules():
    try:
        modules = []
        for module in Modules.objects():
            modules.append({
                    'provider':module.provider,
                    'module_name':module.module_name,
                    'module_desc':module.module_desc
                })
        
        return modules
    except Exception as e:
        app.logger.error(str(e.args))
        return e.args

def list_templates(project):
    try:
        template_list=[]

        project_id = str(Project.objects.get(name=project).id)
        templates = Template.objects.filter(project=project_id)

        if templates:
            for template in templates:
                template_list.append({
                    'provider':template.provider,
                    'template_name':template.template_name,
                    'template_desc':template.template_desc
                })

        app.logger.info("template list executed" + str(template_list))
        return template_list

    except Exception as e:
        app.logger.error(str(e.args))
        raise e.args    

def validate_templatename(name):
    try:
        response="Success"
        app.logger.info(name)
        template=Template.objects()._collection.find({}, {"template_name": 1, "_id": 0})
        temp_list = [name["template_name"] for name in template]
        app.logger.info(str(temp_list))  
        if name in temp_list:
            response="Failed"
        app.logger.info("template validation executed" + response)    
        return response
    except Exception as e:
        app.log_exception(str(e.args))
        raise e.args     

def get_template(template_name):
    try:
        query = {"template_name": template_name}
        data = list(Template.objects()._collection.find(query, {"_id": 0}))
        if data[0]['custom_data']:
            custom_data = CustomTemplate.objects()._collection.find(query, {"_id": 0})[0]
        else:
            custom_data = []

        project_name = Project.objects.get(id=data[0]['project']).name
        for item in data:
            item['project'] = project_name

        app.logger.info("get template executed" + str(data[0]))

        return (data[0], custom_data)

    except Exception as e:
        app.logger.error(str(e.args))
        raise e.args

def get_module(module_name):
    try:
        query = {"module_name": module_name}
        data = Modules.objects()._collection.find(query, {"_id": 0})
        if data[0]['custom_data']:
            custom_data = CustomTemplate.objects()._collection.find(query, {"_id": 0})[0]
        else:
            custom_data = []

        app.logger.info("get module executed" + str(data[0]))
        return (data[0], custom_data)

    except Exception as e:
        app.logger.error(str(e.args))
        raise e.args




