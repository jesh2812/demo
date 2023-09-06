provider "aws" { 
 	 region = "ap-south-1" 
}

resource "aws_iam_policy_attachment" "ser1" {
  name = "gf"
  policy_arn = "b"
}
 
data source "aws_iam_policy_document" "sd" {
  statement {
	  actions = "KLM"
  condition = "hv"
  effect = "jb"
  not_actions = "nm"
  not_principals = "mnb "
  not_resources = "mn "
  principals = "  jn"
  resources = "mnb"
  sid = "nn"
	}
	}
 
