provider "aws" { 
 	 region = "ap-south-1" 
}

resource "snowflake_external_oauth_integration" "ser1" {
  enabled = "dbc"
  issuer = "db"
  name = "dbc"
  snowflake_user_mapping_attribute = ["jdh", "sbjk"]
  token_user_mapping_claims = ["kjdh", "dh"]
  type = "hdbch"
}
 
