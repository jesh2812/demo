terraform {
 	 required_providers{
 	 snowflake ={
 	 source="Snowflake-Labs/snowflake" 
 version="0.36.0"
}
}
} 
provider "snowflake" { 
 	 account = "ID2421" 
 	 region = "ap-south-1" 
 	 role = "SYSADMIN"
}

resource "snowflake_database" "ser1" {
  name = "SF_final"
}
 
resource "snowflake_warehouse" "sd" {
  name = "SF_warehouse"
  warehouse_size = "large"
  auto_suspend = "60"
}
 
