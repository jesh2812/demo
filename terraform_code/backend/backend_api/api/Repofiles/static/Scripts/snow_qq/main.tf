terraform {
 	 required_providers{
 	 snowflake ={
 	 source="application/terraform" 
 version="0.15.0"
}
}
} 
provider "snowflake" { 
 	 role = "SYSADMIN" 
	 project="terraform"
}

resource "snowflake_account" "ser1" {
  admin_name = "aa11"
  edition = "aa11"
  email = "aa"
  name = "aa"
}
 
