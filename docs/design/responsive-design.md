# Responsive Design & Breakpoint Architecture

The CATCHAM interface is engineered mobile-first for citizen reporting and responsive-adaptive for enterprise dashboards.

---

## 1. Standard Breakpoints

| Breakpoint | Prefix | Width | Primary Device Target |
| :--- | :--- | :--- | :--- |
| **Mobile** | Default | `< 640px` | Smartphones (Citizen reporting on the move, field officer mobile inspection) |
| **Tablet** | `sm:` / `md:` | `640px - 1023px` | Tablets (Supervisors in court, mobile command centers) |
| **Laptop** | `lg:` | `1024px - 1279px` | Standard investigator laptops (Full 2-column workspace) |
| **Desktop** | `xl:` | `1280px - 1535px` | Agency office monitors (Full 3-column workspace with pinned sidebars) |
| **Wide Desktop** | `2xl:` | `>= 1536px` | HQ Command & Control Centers (Large map visualization + ledger split) |

---

## 2. Adaptation Strategies

1. **Multi-Column Workspaces**:
   - On Desktop (`>= 1024px`): Three-column layout (Navigation + Main Workspace + Case Meta/Task Sidebar).
   - On Mobile (`< 1024px`): Single column layout with sticky bottom action sheet or tabs.
2. **Data Tables**:
   - On Desktop: Full multi-column table with column sorting.
   - On Mobile: Card list representation displaying critical fields (Reference Number, Status Pill, Category, Date).
3. **Public Reporting Stepper**:
   - On Desktop: Horizontal visual stepper with milestone labels.
   - On Mobile: Compact progress bar with "Step 2 of 8: Location" header.
