import pandas as pd
from terraform.Mongo.DbConnection import app

def read(provider):
    try:
        provider=provider.lower() if provider.isupper() else provider
        filename ='aws_repo.json' if provider=='aws' else 'azure_repo.json' if provider=='azure' else 'gcp_repo.json' if provider=='gcp' else 'snowflake_repo.json'
        app.logger.info(filename)
        config_df = pd.read_json('Repofiles/static/repo/'+filename).drop('version', axis=1).dropna()
        return config_df
    except ValueError as e:
        raise "File not found" 

def module(df):
    mod_df = df["Module"].drop_duplicates().tolist()
    return mod_df


def listresource(df, module,resourcetype):
    res_df = df[(df["Module"] == module) & (df["Resource_Type"] == resourcetype)]["Resource"].tolist()
    return res_df

def listattributes(df,resourcename,resourcetype):
    att_df = df[(df["Resource"] == resourcename) & (df["Resource_Type"] == resourcetype)]["Attribute_Reference"].tolist()
    return att_df    


def listarguments(df,resourcename,resourcetype):
    final_df = df[(df["Resource"] == resourcename) & (df["Resource_Type"] == resourcetype)]["Argument_Reference"].tolist()
    return final_df
