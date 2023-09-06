terraform {
 	 required_providers{
 	 snowflake ={
 	 source="Snowflake-Labs/snowflake" 
 version="0.36.0"
}
}
} 
provider "snowflake" { 
 	 account = aaa123 
 	 region =  
 	 role = "SYSADMIN"
}

resource "snowflake_account" "ser1" {
  admin_name = "a"
  edition = "a"
  email = "a"
  name = "a"
}
 
