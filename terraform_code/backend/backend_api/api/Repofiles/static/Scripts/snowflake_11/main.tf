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
  admin_name = "jdh"
  edition = "dh"
  email = "sd"
  name = "dhgh"
}
 
