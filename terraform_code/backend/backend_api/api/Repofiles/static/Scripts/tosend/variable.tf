variable "access_key"{
    description = "Enter your provider access-key"
}

variable "secret_key" {
    description = "Enter your provider secret-key"
  
}

variable "name" {
  description = "Enter name of the Cluster"
}

variable "region" {
  description = "Enter name of the Region"
}

/*variable "subnet_id" {
  description = "Enter your subnet id"
}*/
variable "vpc_id" {
  description = "Enter your vpc id"
}
variable "key_name" {
  description = "Enter your Key Name"
}
variable "release_label" {
  description = "Enter your Spark Cluster release label"
}
variable "applications" {
  #type = "list"
  description = "Enter your Spark Cluster Application Type"
}
variable "master_instance_type" {
  description = "Enter your Spark Cluster Master Instance Type"
}
variable "master_ebs_size" {
  description = "Enter your Spark Cluster Master Ebs Volume"
}
variable "core_instance_type" {
  description = "Enter your Spark Cluster Core Instance Type"
}
variable "core_instance_count" {
  description = "Enter your Spark Cluster Core Instance Count"
}
variable "core_ebs_size" {
  description = "Enter your Spark Cluster Core Instance ebs volume"
}
variable "ingress_cidr_blocks" {
  description = "Enter the cidr blocks range"
}
variable "source-name" {
  description = "Enter the source bucket name"
}
variable "destination-name" {
  description = "Enter the destination bucket name"
}
variable "glue-bucket" {
  description = "Enter the Glue bucket name"
}
variable "athena-bucket" {
  description = "Enter the athena bucket name"
}
/*variable "service" {
  description = "Enter the service name you want to create"
}
*/
variable "ami_id" {
  type=string
  description = "Enter AMI-ID"
}
variable "instance_type" {
  type=string
  description = "Enter the type of instance"
}