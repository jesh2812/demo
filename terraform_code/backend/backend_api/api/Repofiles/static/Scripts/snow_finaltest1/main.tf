terraform {
 	 required_providers{
 	 snowflake ={
 	 source="Snowflake-Labs/snowflake" 
 version="0.36.0"
}
}
} 
provider "snowflake" { 
 	 account = "FC77656" 
 	 region = "ap-southeast-1" 
 	 role = "SYSADMIN"
}

resource "snowflake_database" "ser1" {
  name = "SFnew"
}
 
resource "snowflake_warehouse" "sd" {
  name = "SFnew"
  warehouse_size = "large"
  auto_suspend = "90"
}
 
