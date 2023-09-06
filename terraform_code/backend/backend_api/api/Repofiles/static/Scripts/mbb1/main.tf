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

resource "snowflake_database" "ser1" {
  name = "fjjf"
}
 
resource "snowflake_warehouse" "sd" {
  name = "asdad"
}
 
