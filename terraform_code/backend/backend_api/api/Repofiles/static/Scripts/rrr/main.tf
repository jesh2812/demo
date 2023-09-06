provider "aws" { 
 	 region = "ap-south-1" 
}

resource "aws_acm_certificate" "dkjj" {
  domain_name = "vd"
  validation_method = "db"
  private_key = "dg"
  certificate_body = "d"
  certificate_authority_arn = "db"
}
 
