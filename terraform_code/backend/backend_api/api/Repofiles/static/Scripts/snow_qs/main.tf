terraform {
 	 required_providers{
 	 snowflake ={
 	 source="Snowflake-Labs/snowflake" 
 version="0.36.0"
}
}
} 
provider "snowflake" { 
 	 account = ID1233 
 	 region = ap-southeast-1 
 	 role = "SYSADMIN"
}

resource "snowflake_database" "sd" {
  name = "hsdghsv"
  comment = "sjhgah"
  from_database = "yes"
}
 
