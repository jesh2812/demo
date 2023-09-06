terraform {
 	 required_providers{
 	 snowflake ={
 	 source="Snowflake-Labs/snowflake" 
 version="0.36.0"
}
}
} 
provider "snowflake" { 
 	 account = "ID1234" 
 	 region = "ap-southeast-1" 
 	 role = "SYSADMIN"
}

resource "snowflake_database" "ser1" {
  name = "djfj"
}
 
resource "snowflake_warehouse" "cs" {
  name = "kkk"
  warehouse_size = "large"
  auto_suspend = "90"
}
 
