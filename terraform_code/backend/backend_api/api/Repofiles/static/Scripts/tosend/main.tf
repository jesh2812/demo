resource "aws_glue_catalog_table" "sample_table" {
    name          = "MyCatalogTable"
    database_name = "MyCatalogDatabase"
    table_type = "EXTERNAL_TABLE"
    owner         = "hadoop"
    catalog_id = 123

    parameters = {
    EXTERNAL              = "TRUE"
    "parquet.compression" = "SNAPPY"
    }

    retention = 5
    view_original_text = NULL
    view_expanded_text = NULL
    partition_keys {
      comment = "Any Message"
      name = "Sample"
      type = Dict
    }
    partition_index {
      index_name = x1
      keys = "dfguhnmv787tbamnsfh"
    }
    storage_descriptor {
      bucket_columns = [1,2]
      compressed                = false
      input_format              = "com.amazon.emr.cloudtrail.CloudTrailInputFormat"
      location                  = "s3://${local.trails_bucket}/${var.trail["s3_key_prefix"]}/AWSLogs/${data.aws_caller_identity.current.account_id}/CloudTrail"
      number_of_buckets         = -1
      output_format             = "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat"
      parameters                = {1:a,2:b}
      stored_as_sub_directories = false
      columns {
      name = "useridentity"
      type = "struct<type:string,principalId:string,arn:string,accountId:string,invokedBy:string,accessKeyId:string,userName:string,sessionContext:struct<attributes:struct<mfaAuthenticated:string,creationDate:string>,sessionIssuer:struct<type:string,principalId:string,arn:string,accountId:string,userName:string>>>"
      comment = "Column_created"
      parameters = {key:value}
    }
    schema_reference {
      schema_version_id = 12
      schema_version_number = 1
      schema_id {
        registry_name = "sample"
        schema_arn = "s3:hkuhdf.arn"
        schema_name = "Abcd"
        }
    }
    ser_de_info {
        name = "abcd"
      parameters = {
        "serialization.format" = "1"
      }
      serialization_library = "com.amazon.emr.hive.serde.CloudTrailSerde"
    }
    skewed_info {
      skewed_column_names               = []
      skewed_column_value_location_maps = {}
      skewed_column_values              = []
    }
    sort_columns {
      column = "col_name"
      sort_order = 1
    }
    }
    target_table {
      catalog_id = 1234
      database_name ="mydb"
      name = "Table_name"    
      }

}