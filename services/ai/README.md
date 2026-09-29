# CATCHAM AI Evidence Intelligence & Analysis Service

Decoupled Python / FastAPI Microservice providing:
- **Optical Character Recognition (OCR)** on document evidence (receipts, official documents, statements).
- **Audio/Video Speech-to-Text (STT)** transcription for whistleblowing voice notes and recorded interviews.
- **Natural Language Entity Extraction (NER)** identifying dates, agency names, monetary figures, and Nigerian locations.
- **Duplicate & Correlation Detection** identifying recurring incidents across multi-agency jurisdictions.
- **Automated Triage Suggestions**: Category and agency recommendation (advisory only).

### Architectural Boundary Rules
- **ZERO Direct Database Writes**: The AI service never accesses or mutates the core PostgreSQL database.
- **Asynchronous Workers**: Heavy inference operations are processed via Redis message queues.
- **Non-Destructive Outputs**: Insights and metadata are emitted as review annotations; original digital evidence is strictly immutable.
