# Data Flow: Incident Intake to Case Disposition

1. **Citizen or Whistleblower** enters an incident report (anonymous or authenticated).
2. Report captures GPS coordinates (if permitted) and uploads initial media attachments.
3. Media is validated by **Core Upload Validator** and stored in S3/MinIO.
4. SHA-256 hash is computed and recorded in **Evidence Module**.
5. **GIS Module** determines the administrative state, LGA, and territorial jurisdiction.
6. **Rules Engine** evaluates which agency has primary jurisdiction.
7. **Reporting Module** generates a reference number and fires `ReportSubmittedEvent`.
8. Lead Agency triage officer reviews report; **Workflow Engine** initializes the investigation state machine.
9. **Investigation Module** assigns case number, lead investigators, and tasks.
10. All actions write an append-only log in the **Audit Module**.
