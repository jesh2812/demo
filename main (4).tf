provider "aws" { 
 	 region = "us-central1" 
	 project="terraform"
}

resource "google_bigquery_dataset" "BigQueryDataSet1" {
  dataset_id = "DS_id_1"
  project = "DemoProject"
  location = "us-central1-c"
}
 
resource "google_bigquery_table" "BigQueryTable1" {
  dataset_id = "DS_id_1"
  table_id = "table_id_1"
  project = "currentProject"
}
 
resource "google_bigquery_dataset_iam" "DS_iam_binding" {
  dataset_id = "DS_id_1"
  member/members = "terraform@tigeranalytics.com"
  role = "GCP_role"
}
 
resource "google_bigquery_table_iam" "BQ_table_iam" {
  member/members = "terraform@tigeranalytics.com"
  role = "GCP_role"
}
 
