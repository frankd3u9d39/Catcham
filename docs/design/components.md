# Component Architecture & Specifications

Every UI component in CATCHAM conforms to the design tokens and serves a defined operational purpose.

---

## 1. Navigation Components

### 1.1 AppSidebar
- **Structure**: Collapsible vertical bar (width: `260px` expanded, `72px` collapsed).
- **Color**: Dark obsidian slate (`#111111`) with subtle border (`rgba(255,255,255,0.08)`).
- **Items**: Icon (`20px`) + Label (`14px Medium`).
- **Active State**: `#006B3C` left border (3px) + white text + `rgba(0,107,60,0.15)` background fill.
- **Role Awareness**: Only displays navigation items permitted by the active membership context.

### 1.2 Topbar
- **Height**: `64px`, white background with bottom border (`#E2E8F0`).
- **Contains**: Organization selector badge, quick search trigger (`⌘K`), notification bell with unread badge, user profile menu with sovereign role indicator.

---

## 2. Core Business Components

### 2.1 WorkflowStepper
- Visualizes the multi-step lifecycle of a report or investigation.
- States: `Completed` (Green checkmark), `Current` (Green ring + pulse dot), `Upcoming` (Neutral grey ring).
- Displays timestamps and actor names underneath completed transitions.

### 2.2 CaseWorkspaceHeader
- Pinned case banner providing permanent context regardless of active tab:
  - Case Number (`CAS-2026-0042`) with one-click copy button.
  - Priority badge (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
  - Workflow State badge (`UNDER_INVESTIGATION`).
  - Lead Agency and Lead Investigator name.
  - Quick action toolbar: [Assign Investigator], [Add Note], [Escalate], [Advance Workflow].

### 2.3 EvidenceCard & Inspector
- Displays original file name, MIME type icon, and exact file size.
- **SHA-256 Verification Badge**: Green shield with tooltip showing full 64-character hash.
- **Classification Banner**: Public, Confidential, Restricted, or Top Secret.
- Distinguishes clearly between "Original Immutable Asset" and "Derived AI OCR/Transcription".

### 2.4 DigitalChainOfCustodyTimeline
- Immutable vertical event log showing chronological transfers, downloads, AI evaluations, and reviews.
- Each entry displays: Timestamp, Actor, Organization, Action, Reason, and Client IP.

### 2.5 JurisdictionGeoMap
- Powered by MapLibre GL with clean sovereign map styling (vector tiles).
- Visualizes LGA/State polygon boundary, incident point coordinate, and neighboring agency command posts.

---

## 3. Data Presentation & Forms

### 3.1 SovereignDataTable
- Fixed header with sorting indicators on sortable columns.
- Integrated search, multi-filter dropdown, date range picker, and CSV/PDF export.
- Empty states featuring contextual vector illustrations and explicit guidance (e.g. "No cases matching 'Bayelsa'").

### 3.2 FileDropzoneWithIntegrityCheck
- Drag-and-drop file upload target supporting photos, video, audio, and documents.
- Automatic client-side SHA-256 calculation progress bar before upload initiation.
- Immediate malicious file extension rejection with warning banner.
