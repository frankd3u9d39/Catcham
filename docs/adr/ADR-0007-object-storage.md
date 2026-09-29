# ADR-0007: S3-Compatible Object Storage for Digital Evidence
## Status: Accepted
## Context
Large media files (photos, video, audio) should not bloat the primary database.
## Decision
Use S3-compatible storage (MinIO for dev/local, AWS S3/Ceph for production) with presigned URLs.
