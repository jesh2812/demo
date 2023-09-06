provider "aws" { 
 	 region = "ap-south-1" 
}

resource "aws_iam_role" "dh" {
  assume_role_policy = "hjx"
}
 
resource "aws_iam_group_policy" "ser1" {
  policy = "djg"
  group = "gsd"
}
 
resource "aws_iam_policy" "cs" {
  policy = "jsgh"
}
 
resource "aws_iam_role_policy_attachment" "random2" {
  role = var.djh
  policy_arn = "djhf"
}
 
resource "aws_iam_role_policy" "scs" {
  policy = var.djhbj
  role = var.shgd
}
 
