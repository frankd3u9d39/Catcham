# Role & Permission Access Matrix

The CATCHAM frontend adapts dynamically based on five primary sovereign roles.

---

| Feature / Workspace Area | Citizen (Public) | Field Investigator | Investigation Supervisor | Agency Administrator | Platform Super Admin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Submit Public Report** | Allowed | Allowed | Allowed | Allowed | Allowed |
| **Track Public Report by Secret** | Allowed | Allowed | Allowed | Allowed | Allowed |
| **View Assigned Investigations** | Denied | **Full Access** | **Full Access** | Full Access | Full Access |
| **Add Investigative Case Notes** | Denied | **Allowed** | **Allowed** | Read-Only | Read-Only |
| **Reassign Lead Investigator** | Denied | Denied | **Allowed** | **Allowed** | **Allowed** |
| **Approve Workflow Transitions** | Denied | Denied | **Allowed** | **Allowed** | **Allowed** |
| **View Raw Evidence & Download** | Denied | **Assigned Cases** | **Assigned Cases** | Agency Scope | Global Scope |
| **Initiate Custodial Transfer** | Denied | **Allowed** | **Allowed** | **Allowed** | **Allowed** |
| **Manage Agency Personnel & Offices** | Denied | Denied | Denied | **Full Access** | **Full Access** |
| **Configure Workflow State Machines** | Denied | Denied | Denied | Agency Specific | **Global Config** |
| **Configure Business Rules Engine** | Denied | Denied | Denied | Agency Specific | **Global Config** |
| **Inspect System Audit Logs** | Denied | Denied | Own Agency | Own Agency | **Complete Trail** |
| **Platform Infrastructure Health** | Denied | Denied | Denied | Denied | **Full Access** |
