output "id" {
  value = module.emr.id
}

output "name" {
  value = module.emr.name
}

output "master_public_dns" {
  value = module.emr.master_public_dns
}

output "instance-id" {
  value=module.ec2.instance-id
}
