# Comprehensive Screen Inventory

The CATCHAM frontend consists of 42 distinct, interconnected screens structured cleanly across public and role-aware routes.

---

## 1. Public & Whistleblower Module (`/(public)`)
1. **PUB-01: Public Landing Page** (`/`) - Sovereign introduction, primary actions [Submit Report], [Track Report].
2. **PUB-02: Guided Incident Intake Wizard** (`/report`) - 8-step structured reporting workflow.
3. **PUB-03: Anonymous Submission Confirmation** (`/report/confirmation`) - Provides secret reference code and private tracking token.
4. **PUB-04: Report Tracking Portal** (`/track`) - Public reference inquiry portal.
5. **PUB-05: Incident Timeline View** (`/track/[reference]`) - Public safe progress stepper (non-confidential milestones only).
6. **PUB-06: Citizen Help & Whistleblower Rights** (`/help`) - Legal protections, security guidelines, agency jurisdictional overviews.

---

## 2. Authentication & Access Control (`/(auth)`)
7. **AUTH-01: Agency Officer Login** (`/login`) - Official credentials, email/ID, password.
8. **AUTH-02: MFA Verification** (`/mfa`) - Time-based OTP / Security key token intake.
9. **AUTH-03: Forgot Password / Account Recovery** (`/forgot-password`) - Multi-step recovery.
10. **AUTH-04: Security Session Lockout** (`/locked`) - Explains account lockout after failed attempts with helpdesk contact.

---

## 3. Core Enterprise Dashboard & Triage
11. **DASH-01: Role-Aware Executive Dashboard** (`/dashboard`) - Operational summary tailored to officer's role.
12. **REP-01: Reports Ledger** (`/reports`) - Filterable table of incoming whistleblower and incident reports.
13. **REP-02: Report Triage Detail View** (`/reports/[id]`) - Initial report inspection, GPS map verification, and agency routing trigger.
14. **REP-03: Routing & Jurisdiction Resolution** (`/reports/[id]/route`) - Multi-agency jurisdiction assignment dialog.

---

## 4. Investigation Case Management
15. **INV-01: Investigations Ledger** (`/investigations`) - Filterable list of active, pending, and closed cases.
16. **INV-02: Investigation Workspace - Overview** (`/investigations/[id]`) - Case dashboard with milestones, timeline, summary.
17. **INV-03: Investigation Workspace - Evidence** (`/investigations/[id]/evidence`) - Vault of attached physical/digital evidence.
18. **INV-04: Investigation Workspace - Tasks** (`/investigations/[id]/tasks`) - Checklist of investigator assignments and milestones.
19. **INV-05: Investigation Workspace - Notes & Logs** (`/investigations/[id]/notes`) - Confidential investigative case notes.
20. **INV-06: Investigation Workspace - Escalations** (`/investigations/[id]/escalations`) - Supervisor alerts and inter-agency collaboration requests.
21. **INV-07: Investigation Workspace - Workflow Actions** (`/investigations/[id]/workflow`) - State transition trigger and supervisor sign-offs.

---

## 5. Evidence Management & Digital Chain of Custody
22. **EVI-01: Evidence Vault Ledger** (`/evidence`) - Master catalog of evidence items across assigned cases.
23. **EVI-02: Evidence Detail Inspector** (`/evidence/[id]`) - SHA-256 integrity details, preview, classification controls.
24. **EVI-03: Digital Chain of Custody Explorer** (`/evidence/[id]/custody`) - Immutable chronological custody timeline.
25. **EVI-04: AI Intelligence & Annotation Inspector** (`/evidence/[id]/ai-analysis`) - Non-destructive OCR and audio transcripts.
26. **EVI-05: Secure Evidence Transfer Modal** (`/evidence/[id]/transfer`) - Controlled custodial handoff form with mandatory reason.

---

## 6. Organization & Jurisdiction Administration
27. **ORG-01: Multi-Agency Directory** (`/organizations`) - Tree view of participating Nigerian agencies.
28. **ORG-02: Agency Detail & Department Management** (`/organizations/[id]`) - Department and zonal office structure.
29. **ORG-03: Zonal & Field Office Directory** (`/organizations/offices`) - Physical offices across states and LGAs.
30. **GIS-01: Sovereign Jurisdiction Map Explorer** (`/jurisdictions`) - MapLibre boundary visualizer.
31. **GIS-02: Jurisdiction Editor** (`/jurisdictions/[id]`) - Polygon boundary inspector and sectoral jurisdiction rules.

---

## 7. Governance, Workflows & Policy Rules
32. **WF-01: Workflow State Machine Builder** (`/workflows`) - Visual state transition catalog and editor.
33. **WF-02: Workflow Definition Detail** (`/workflows/[id]`) - Transition requirements, required roles, condition gates.
34. **RUL-01: Business Rules Engine Interface** (`/rules`) - Declarative routing and escalation policy builder.
35. **RUL-02: Rule Builder Studio** (`/rules/new`) - Intuitive `WHEN condition THEN action` builder for non-programmers.

---

## 8. Compliance, SLA & Platform Oversight
36. **ANL-01: Sovereign Analytics Dashboard** (`/analytics`) - Case resolution times, agency workload, hotspot maps.
37. **ANL-02: Agency Performance & SLA Reports** (`/analytics/slas`) - Turnaround times and bottleneck identification.
38. **AUD-01: Append-Only Audit Ledger** (`/audit`) - Comprehensive tamper-evident compliance audit trail.
39. **AUD-02: Audit Event Inspector** (`/audit/[id]`) - Detailed metadata, IP, user actor, and cryptographic signature.
40. **USR-01: User & Personnel Directory** (`/users`) - Official personnel management, badge assignment, and roles.
41. **USR-02: User Profile & Security Settings** (`/profile`) - Officer credentials, MFA settings, activity history.
42. **SYS-01: Platform System Health & Configuration** (`/settings`) - Infrastructure status, storage capacity, queue latency.
