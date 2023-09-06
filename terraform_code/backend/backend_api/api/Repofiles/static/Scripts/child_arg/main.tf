provider "aws" { 
 	 region = "ap-south-1" 
}

resource "snowflake_external_table" "ser1" {
  column {
	  type = "shdb"
	}
	  database = "ah"
  file_format = "ahsb"
  location = "skjb"
  name = "sb"
  schema = "sdn"
}
 
