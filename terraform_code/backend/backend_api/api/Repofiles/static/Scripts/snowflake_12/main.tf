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

resource "snowflake_database" "ser1" {
  name = "jhds"
}
 
resource "snowflake_warehouse" "sd" {
  name = "sdhs"
}
 
