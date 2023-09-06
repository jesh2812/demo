provider "aws" { 
 	 region = "ap-south-1" 
}

resource "aws_iam_policy" "ser1" {
  policy = "jsonencode({     Version = "2012-10-17"     Statement = [       {         Effect   = "Allow"         Action   = [           "s3:GetObject",           "s3:PutObject",iam         ]         Resource = "arn:aws:s3:::example-bucket/*"       },       {         Effect   = "Allow"         Action   = [           "ec2:DescribeInstances",           "ec2:StartInstances",           "ec2:StopInstances",         ]         Resource = "*"       },     ]   })"
  name = "CustomPolicy"
  description = "Custom IAM policy for account-specific requirements"
}
 
resource "aws_iam_role" "sd" {
  assume_role_policy = "jsonencode({     Version = "2012-10-17"     Statement = [       {         Effect    = "Allow"         Principal = {           Service = "ec2.amazonaws.com"         }         Action = "sts:AssumeRole"       }     ]   })"
  name = "CustomRole"
}
 
resource "aws_iam_policy_attachment" "cs" {
  name = "customattachment"
  policy_arn = "aws_iam_policy.custom_policy.arn"
}
 
