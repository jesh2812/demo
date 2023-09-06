provider "aws" { 
 	 region = "ap-south-1" 
}

resource "aws_acm_certificate_validation" "ser1" {
  certificate_arn = "igy"
}
 
