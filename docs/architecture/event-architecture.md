# Event-Driven Architecture

All inter-module communication is asynchronous and loosely coupled:
- `ReportSubmittedEvent` -> Trigger routing, notify triage officers.
- `InvestigationAssignedEvent` -> Notify investigator, dispatch email/SMS.
- `EvidenceUploadedEvent` -> Enqueue AI analysis in BullMQ.
- `CustodyTransferredEvent` -> Log immutable audit record.
