from flask_cors import CORS
from flask_restful import Api
from flask_bcrypt import Bcrypt
from terraform.Mongo.DbConnection import app
from terraform.routes import *
cors = CORS(app)
api=Api(app)
bcrypt=Bcrypt(app)


   

api.add_resource(ListRepoData, '/api/template')
api.add_resource(GenerateScript,'/api/script')
api.add_resource(Validation,'/api/validation')
api.add_resource(ListTemplates,'/api/listtemplates')
api.add_resource(GetTemplate,'/api/gettemplate')
api.add_resource(SaveTemplate,'/api/savetemplate')
api.add_resource(EditTemplate,'/api/edittemplate')
api.add_resource(DeleteTemplate,'/api/deletetemplate')
api.add_resource(Login,'/api/login')
api.add_resource(Signup,'/api/signup')
api.add_resource(Export,'/api/download')
api.add_resource(GetProjects,'/api/listProjects')
api.add_resource(ListModules,'/api/listModules')
api.add_resource(CreateProject,'/api/createProject')
api.add_resource(GetModule,'/api/getmodule')
api.add_resource(SaveModule,'/api/saveModule')
api.add_resource(Gitcommit,'/api/commit')
api.add_resource(EditModule,'/api/editmodule')
api.add_resource(CheckovDownload, '/api/checkov')
api.add_resource(UserList, '/api/userlist')
# api.add_resource(GetUserRoleView, '/api/get_user_role')

if __name__=="__main__":
    app.run(port=5000,host='0.0.0.0')    
