provider "snowflake" { 
 	 region = "ap-south-1" 
	 project="terraform"
}

resource "snowflake_account" "ser1" {
  admin_name = "zx"
  edition = "xz"
  email = "zz"
  name = "gyuhlll"
}
 
