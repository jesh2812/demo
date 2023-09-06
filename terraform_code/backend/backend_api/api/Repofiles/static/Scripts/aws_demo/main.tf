provider "aws" { 
 	 region = "ap-south-1" 
}

resource "aws_iam_group" "ser1" {
  name = "customgroup"
}
 
resource "aws_iam_group_policy" "sd" {
  policy = "jsonencode({     		Version = "2012-10-17"     		Statement = [       		{         		Effect = "Allow"         		Action = [           		"ec2:Describe*",           		"ec2:CreateVpc",           		"ec2:CreateSubnet",           		"ec2:CreateInternetGateway",           		"ec2:CreateRouteTable",           		"ec2:AssociateRouteTable",           		"ec2:CreateNatGateway",           		"ec2:AllocateAddress",           		"ec2:AssociateAddress",           		"ec2:CreateSecurityGroup",           		"ec2:AuthorizeSecurityGroupIngress",           		"ec2:CreateNetworkInterface",           		"ec2:AttachNetworkInterface",         		]         		Resource = "*"       		},       		{         			Effect = "Allow"         			Action = "ec2:RunInstances"         			Resource = "*"       		},     		]   		})"
  group = "aws_iam_group.example.name"
  name = "grouppolicy1"
}
 
