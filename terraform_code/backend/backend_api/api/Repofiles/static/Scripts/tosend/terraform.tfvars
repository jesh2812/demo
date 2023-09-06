name = "spark-app"
region = "ap-south-1"
#subnet_id = "subnet-02c8b125416d2d6fe"
vpc_id = "vpc-058c3e57abbc95a7b"
key_name = "pinkalkey"
ingress_cidr_blocks = "0.0.0.0/0"
release_label = "emr-5.16.0"
applications = ["Spark"]

# Master node configurations
master_instance_type = "m5.xlarge"
master_ebs_size = "10"

# Slave nodes configurations#
core_instance_type = "m5.xlarge"
#core_ebs_size = "10"