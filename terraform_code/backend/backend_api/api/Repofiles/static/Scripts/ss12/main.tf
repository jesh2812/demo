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
 	 region = ap-southeast-1 
 	 role = "SYSADMIN"
}

resource "snowflake_account_grant" "ser1" {
  enable_multiple_grants = "kshd"
}
 
