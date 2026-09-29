# UX Architecture: CATCHAM Sovereign Experience

---

## 1. Mental Models by User Persona

### 1.1 The Citizen / Whistleblower
- **Emotional State**: Apprehensive, concerned about reprisal, seeking reassurance.
- **Mental Model**: "Will I get in trouble? Is this truly anonymous? Will anyone take action?"
- **UX Response**:
  - Clear explanations at every step of why data is requested.
  - Transparent distinction between anonymous and identified reporting.
  - Immediate receipt of a private, non-identifying tracking secret.
  - No intrusive requirements (e.g. No mandatory phone number or signup).

### 1.2 The Field Investigator
- **Emotional State**: Focused, under pressure to meet investigative deadlines, managing evidence integrity.
- **Mental Model**: "What cases are assigned to me? What evidence is available? What tasks are pending?"
- **UX Response**:
  - Action-oriented workspace: tasks, notes, evidence previews, and case status pinned in clear view.
  - One-click copy for case numbers and evidence hashes.
  - Clear alerts for pending supervisor reviews or SLA deadlines.

### 1.3 The Supervisor & Agency Head
- **Emotional State**: Accountable for team performance, institutional compliance, and inter-agency collaboration.
- **Mental Model**: "Are cases moving forward? Are there escalations? Are any cases stalled?"
- **UX Response**:
  - Filterable case queues by priority, agency department, and duration.
  - Prominent approval/rejection banners on workflow transition requests.
  - High-level KPI indicators (Resolution time, SLA compliance rate).

---

## 2. Information Flow Architecture
```text
Citizen Input                  Triage & Routing                Investigation Cycle              Disposition
+-------------------+          +-------------------+          +-------------------+          +-------------------+
| Guided Report     |  ====>   | Triage Officer    |  ====>   | Assigned Case     |  ====>   | Case Resolution   |
| Intake (8 Steps)  |          | PostGIS Auto-Route|          | Investigator Team |          | Supervisor Signoff|
| Evidence Hash Calc|          | Lead Agency Assign|          | Evidence + Tasks  |          | Archival & Audit  |
+-------------------+          +-------------------+          +-------------------+          +-------------------+
```
