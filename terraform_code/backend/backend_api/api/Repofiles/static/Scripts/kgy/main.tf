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

resource "snowflake_account" "ser1" {
  admin_name = "g"
  edition = "jhg"
  email = "kg"
  name = "hjgy"
}
 
