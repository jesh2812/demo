import subprocess
import os
from subprocess import PIPE
from terraform.Mongo.DbConnection import app

def ExecuteScript(template_name):
    app.logger.info("Script executing started")
    subprocess.check_call(['chmod','+x',template_name])
    os.chdir(f'Repofiles/static/Scripts/{template_name}')
    app.logger.info(os.getcwd())
    print(os.getcwd())
    session = subprocess.Popen(['bash','../Execute.sh'], stdout=PIPE, stderr=PIPE)
    #session =subprocess.Popen('/../hello.bat', shell=True, stdout = subprocess.PIPE)
    app.logger.info('executing')
    stdout, stderr = session.communicate()
    app.logger.info(str(stdout))
    if stderr:
        app.logger.error(str(stderr))