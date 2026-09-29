# Typography: Inter Sovereign Scale

CATCHAM uses a single, robust typeface family: **Inter**.
Inter provides clean geometry, tabular figures for numerical data (case numbers, coordinates, dates, currencies), and cross-platform consistency.

---

## 1. Typeface Specifications
- **Font Family**: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Feature Settings**: `'cv02', 'cv03', 'cv04', 'cv11', 'tnum'` (Tabular numbers enabled for data tables and timelines).

---

## 2. Typographic Scale

| Level | Size (px / rem) | Line Height | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | 40px / 2.5rem | 48px / 1.2 | Bold (700) | -0.02em | Public Landing Hero headline |
| **H1** | 32px / 2.0rem | 40px / 1.25 | Bold (700) | -0.015em | Top-level workspace page titles (e.g. Investigation Workspace) |
| **H2** | 24px / 1.5rem | 32px / 1.33 | SemiBold (600) | -0.01em | Major section headers, card modal headers |
| **H3** | 20px / 1.25rem | 28px / 1.4 | SemiBold (600) | -0.005em | Card headers, workflow state titles, tab titles |
| **H4** | 16px / 1.0rem | 24px / 1.5 | SemiBold (600) | 0 | Sub-section headers, table column headers |
| **Body (Default)** | 15px / 0.9375rem | 24px / 1.6 | Regular (400) | 0 | Primary narrative text, report descriptions, case notes |
| **Body Strong** | 15px / 0.9375rem | 24px / 1.6 | Medium (500) | 0 | Emphasized text, interactive table cell data, button labels |
| **Small** | 13px / 0.8125rem | 20px / 1.53 | Regular (400) | 0.005em | Form helper text, metadata labels, breadcrumbs, tags |
| **Caption / Code** | 12px / 0.75rem | 16px / 1.33 | Medium (500) | 0.02em | Case ID (`CAS-2026-...`), SHA-256 hash, timestamps |

---

## 3. Tabular Data & Numerical Formatting
- Case numbers and references (e.g., `CTM-2026-0001`) must render in monospace or tabular figures with `font-mono` or `tabular-nums`.
- Naira values must render with the sovereign symbol (`₦`) and strict two-decimal formatting (`₦12,500,000.00`).
- Coordinates render with 5 decimal places (`9.0765° N, 7.3986° E`).
