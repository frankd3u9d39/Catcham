# Navigation Architecture

CATCHAM's navigation adapts dynamically according to the authenticated user's organization, role, and assigned permissions.

---

## 1. Global Navigation Schemas

### 1.1 Public Citizen & Whistleblower Navigation
```text
[ CATCHAM Logo ]                  [ Report Incident ]  [ Track Report ]  [ Agency Login ]
```

### 1.2 Enterprise Authenticated Navigation (Sidebar + Topbar)

```text
+------------------------------------------------------------------------------------+
|  [Logo] CATCHAM  |  [Agency: EFCC - Zonal Abuja v]  |  [Search ⌘K]  |  (Bell) (User)|
+------------------------------------------------------------------------------------+
| SIDEBAR                 | MAIN CONTENT CANVAS                                      |
|                         |                                                          |
| PRIMARY WORKSPACE       | [Breadcrumb: Investigations / CAS-2026-0042]             |
| * Dashboard             |                                                          |
| * Reports Ledger        |                                                          |
| * Investigations        |                                                          |
| * Evidence Vault        |                                                          |
|                         |                                                          |
| AGENCY MANAGEMENT       |                                                          |
| * Organization & Offices|                                                          |
| * Personnel & Users     |                                                          |
| * Jurisdiction Map      |                                                          |
|                         |                                                          |
| GOVERNANCE              |                                                          |
| * Workflow Config       |                                                          |
| * Business Rules        |                                                          |
| * SLA & Analytics       |                                                          |
| * Audit Trail           |                                                          |
+-------------------------+----------------------------------------------------------+
```

---

## 2. Breadcrumb Standard
Every inner page must provide hierarchical breadcrumbs:
- E.g.: `Investigations` / `CAS-2026-0042` / `Evidence` / `EVI-892104`
- Breadcrumb links allow immediate backward navigation without relying on browser history.
