# Critical User Flows

---

## 1. Flow A: Citizen Incident Intake (The 8-Step Wizard)

```mermaid
graph TD
    A[Start: Report Incident] --> B[Step 1: Category & Title]
    B --> C[Step 2: Location - Map Pin / Address / GPS]
    C --> D[Step 3: Incident Date & Time]
    D --> E[Step 4: Evidence Upload - Photo/Video/Audio/Doc]
    E --> F[Step 5: Narrative Description & Involved Parties]
    F --> G[Step 6: Anonymity Preference: Anonymous vs Identified]
    G --> H[Step 7: Final Review & Confirmation]
    H --> I[Step 8: Submission Complete & Tracking Secret Issued]
```

---

## 2. Flow B: Case Triage & Jurisdiction Routing

```mermaid
graph TD
    A[New Report Arrives] --> B[Triage Officer Opens Report REP-02]
    B --> C{GIS Rule Check}
    C -->|Single Clear Jurisdiction| D[Auto-suggest Primary Agency]
    C -->|Cross-Border / Multi-Agency| E[Manual Multi-Agency Assignment]
    D --> F[Confirm Routing]
    E --> F
    F --> G[Initialize Case CAS-2026-XXXX]
    G --> H[Notify Agency Supervisor via Email/SMS/In-App]
```

---

## 3. Flow C: Evidence Intake & Custodial Transfer

```mermaid
graph TD
    A[Officer Uploads Digital File] --> B[Client-Side SHA-256 Computed]
    B --> C[Presigned S3/MinIO Upload]
    C --> D[Backend Confirms Integrity Match]
    D --> E[Record INTAKE in Immutable Custody Ledger]
    E --> F[Dispatch Asynchronous AI Analysis Worker]
    F --> G[Officer Views Chain of Custody Timeline]
```
