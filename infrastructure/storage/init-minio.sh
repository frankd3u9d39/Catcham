#!/bin/sh
# Initializes sovereign S3 buckets on MinIO
mc alias set local http://localhost:9000 minioadmin minioadmin
mc mb --ignore-existing local/catcham-evidence
mc mb --ignore-existing local/catcham-uploads
mc anonymous set none local/catcham-evidence
echo "Storage buckets initialized."
