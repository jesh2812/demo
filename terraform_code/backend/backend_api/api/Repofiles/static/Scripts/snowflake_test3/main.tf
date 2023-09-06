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

resource "snowflake_database" "test1" {
  name = "db_test"
}
 
resource "snowflake_warehouse" "test2" {
  name = "warehouse_test"
  warehouse_size = "large"
  auto_suspend = "90"
}
 
