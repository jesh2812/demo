provider "aws" { 
 	 region = "ap-south-1" 
}

resource "snowflake_external_table" "ser1" {
  column {
		}
	  database = "dhb"
  file_format = "bcd"
  location = "dsbh"
  name = "db"
  schema = "db"
}
 
