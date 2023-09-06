#!/bin/bash
export TF_LOG=INFO
export TF_LOG_PATH="/home/ec2-user/react-flask-app/api/Logs/terraform.log"
terraform init -reconfigure
terraform plan
terraform apply -auto-approve

