provider "aws" { 
 	 region = "ap-south-1" 
}

resource "snowflake_external_table" "ser1" {
  column {
	  as = "jb"
  name = "nnb"
  type = "hb"
	}
	  database = "kjb"
  file_format = "nb"
  location = "hb"
  name = "nb"
  schema = "mn"
}
 
