from flask import Flask
from flask_mongoengine import MongoEngine
import logging
from flask_bcrypt import generate_password_hash, check_password_hash

app = Flask(__name__)

logging.basicConfig(filename='Template.log', level=logging.DEBUG,
                    format=f'%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')

app.config['MONGODB_SETTINGS'] = {
    "db": "terraform",
    "host": "localhost",
    "username": "tiger",
    "password": "terra@123",
    "authentication_source": "admin"
}

db = MongoEngine(app)

class Project(db.Document):
    name = db.StringField(required=True, unique=True)
    project_desc = db.StringField(required=False, unique=False)

class Template(db.Document):
    provider = db.StringField(required=True, unique=False)
    template_name = db.StringField(required=True, unique=True)
    template_desc = db.StringField(required=True, unique=False)
    data = db.ListField(required=False)
    custom_data = db.BooleanField(required=True,unique=False)
    nodes = db.ListField(required=False)
    edges = db.ListField(required=False)
    project = db.ReferenceField(Project, required=True, reverse_delete_rule=db.CASCADE)

class CustomTemplate(db.Document):
    template_name = db.StringField(required=True, unique=True)
    custom_data = db.ListField(required=True)

class Users(db.Document):
    email = db.EmailField(required=True)
    password = db.StringField(required=True)
    role = db.StringField(required=True)

    def hash_password(self):
        self.password = generate_password_hash(self.password).decode('utf8')

    def check_password(self, password):
        return check_password_hash(self.password, password)   


class Modules(db.Document):
    provider = db.StringField(required=True, unique=False)
    module_name = db.StringField(required=True, unique=True)
    module_desc = db.StringField(required=True, unique=False)
    data = db.ListField(required=False)
    custom_data = db.BooleanField(required=True,unique=False)
    nodes = db.ListField(required=False)
    edges = db.ListField(required=False)    
