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
 	 region = "ap-south-1" 
 	 role = "SYSADMIN"
}

resource "snowflake_account" "ser1" {
}
 
resource "" "sd" {
}
 
