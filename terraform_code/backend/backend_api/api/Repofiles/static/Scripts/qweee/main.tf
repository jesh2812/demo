provider "aws" { 
 	 region = "us-central1" 
	 project="terraform"
}

resource "snowflake_account" "sd" {
  admin_name = "sdjhgs"
  edition = "sd"
  email = "sdh"
  name = "sdhb"
}
 
