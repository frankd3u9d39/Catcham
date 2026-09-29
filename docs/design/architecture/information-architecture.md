# Information Architecture & Sitemap

---

## 1. Top-Level Structural Domains

```text
CATCHAM Root
│
├── [PUBLIC DOMAIN]
│   ├── / (Landing Page)
│   ├── /report (Multi-step Incident Reporting Wizard)
│   ├── /track (Incident Reference Tracker)
│   ├── /help (Whistleblower Protection Rights & FAQs)
│   └── /privacy (Data Sovereignty & Anonymity Policy)
│
├── [AUTH DOMAIN]
│   ├── /login (Agency Officer Sign In)
│   ├── /mfa (Multi-Factor Verification)
│   └── /forgot-password
│
└── [AUTHENTICATED WORKSPACE] (Protected by RBAC & Organization Context)
    ├── /dashboard (Role-Tailored Operational Overview)
    │
    ├── /reports (Reports Ledger & Triage Queue)
    │   └── /[id] (Report Triage & Jurisdictional Routing)
    │
    ├── /investigations (Active Case Management)
    │   └── /[id] (Case Workspace: Overview, Evidence, Tasks, Notes, Escalations, Workflow)
    │
    ├── /evidence (Digital Evidence Vault)
    │   └── /[id] (Evidence Details, SHA-256 Inspection, Custody Trail, AI Analysis)
    │
    ├── /organizations (Agency & Zonal Office Directory)
    │   └── /[id] (Agency Departments & Personnel)
    │
    ├── /jurisdictions (PostGIS Geographic & Sectoral Territory Maps)
    │
    ├── /workflows (State Machine Lifecycle Definitions)
    │
    ├── /rules (Business Rules & Routing Engine Builder)
    │
    ├── /analytics (Operational SLAs & Hotspot Metrics)
    │
    ├── /audit (Append-Only Judicial Compliance Trail)
    │
    ├── /users (Personnel Management & Access Delegation)
    │
    └── /settings (System Infrastructure & Security Governance)
```
