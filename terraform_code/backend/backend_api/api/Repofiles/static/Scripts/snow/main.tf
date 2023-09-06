provider "aws" { 
 	 region = "ap-south-1" 
}

resource "snowflake_external_table" "ser1" {
  column {
	  name = "hggf"
  type = "jhg"
	}
	  file_format = "dkjcb"
  location = "bd"
  name = "kbd"
  schema = "nd"
}
 
