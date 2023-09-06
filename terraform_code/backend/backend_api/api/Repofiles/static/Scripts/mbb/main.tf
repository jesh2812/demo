terraform {
 	 required_providers{
 	 snowflake ={
 	 source="Snowflake-Labs/snowflake" 
 version="0.36.0"
}
}
} 
provider "snowflake" { 
 	 account = "KKKK" 
 	 region = "ap-southeast-1" 
 	 role = "SYSADMIN"
}

resource "snowflake_account" "ser1" {
  admin_name = "dfd"
  edition = "sfd"
  email = "dfd"
  name = "fdfd"
}
 
