terraform {
 	 required_providers{
 	 snowflake ={
 	 source="Snowflake-Labs/snowflake" 
 version="0.36.0"
}
}
} 
provider "snowflake" { 
 	 role = "SYSADMIN"
}

resource "snowflake_table_column_masking_policy_application" "ser1" {
  column = ["hd", "jhd"]
}
 
resource "snowflake_database_role" "sd" {
  name = "cjhss"
}
 
resource "snowflake_external_table" "scs" {
  auto_refresh = "hfg"
  aws_sns_topic = "ppprr"
  column {
	  as = "sd"
  name = "as"
  type = "vfds"
	}
	  database = "fds144"
  file_format = "dcvds"
  location = "fs"
  name = "xc"
  schema = "vs"
}
 
