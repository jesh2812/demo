provider "aws" { 
 	 region = "ap-south-1" 
}

resource "snowflake_external_table" "lsq" {
  column {
	  name = "jh"
	}
	  database = "jhb"
  file_format = "jh"
  location = "bj"
  name = "h"
  schema = "hn"
}
 
