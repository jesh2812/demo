provider "aws" { 
 	 region = "ap-south-1" 
}

resource "aws_acm_certificate" "ser1" {
  domain_name = "sg"
  validation_method = "jhvs"
  private_key = "djhg"
  certificate_body = "hdg"
  certificate_authority_arn = "hd"
}
 
