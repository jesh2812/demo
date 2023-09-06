provider "aws" { 
 	 region = "ap-south-1" 
}

resource "snowflake_external_table" "ser1" {
  column {
		}
	  database = "csc"
  file_format = "cdd"
  location = "cx"
  name = "csz"
  schema = "zxcz"
}
 
