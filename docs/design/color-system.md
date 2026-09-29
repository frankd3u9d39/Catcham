# Color System: CATCHAM Sovereign Palette

The CATCHAM color system is anchored in three primary foundations:
1. **Pure White**: Primary backgrounds, cards, and modal canvases.
2. **Softened Obsidian Black**: Headings, body text, deep contrasting navigation elements.
3. **Nigerian Sovereign Green**: Brand identity, primary affirmative actions, active states.

---

## 1. Brand Palette: Nigerian Green

The green is a deep, dignified sovereign tone (`#006B3C`), avoiding neon or electric variations.

| Token Name | Hex Code | Purpose / Usage |
| :--- | :--- | :--- |
| `brand-50` | `#F3FAF6` | Subtle active background, highlighted table rows, badge background |
| `brand-100` | `#E8F5EE` | Border tint for success/active callouts, pill containers |
| `brand-200` | `#C5E6D4` | Secondary accent borders |
| `brand-500` | `#008A4B` | Hover state for primary buttons and interactive accents |
| `brand-600` | `#006B3C` | **Primary Brand Color**: Primary buttons, active nav links, checkmarks |
| `brand-700` | `#005731` | Pressed/Active state for buttons and dark borders |
| `brand-900` | `#003820` | High-contrast brand headings or deep brand banners |

---

## 2. Monochrome Foundation: White & Softened Black

To maintain maximum contrast without harsh eye strain:

| Token Name | Hex Code | Purpose / Usage |
| :--- | :--- | :--- |
| `neutral-white` | `#FFFFFF` | Primary card background, input field background, topbar |
| `neutral-50` | `#F8FAFC` | Main page background (subtle light grey to distinguish white cards) |
| `neutral-100` | `#F1F5F9` | Table header background, divider bars, secondary button default |
| `neutral-200` | `#E2E8F0` | Standard component borders, card strokes |
| `neutral-300` | `#CBD5E1` | Disabled borders, subtle separators |
| `neutral-400` | `#94A3B8` | Placeholder text, inactive icons |
| `neutral-500` | `#64748B` | Secondary descriptive text, metadata labels |
| `neutral-700` | `#334155` | Form labels, dark icon strokes |
| `neutral-800` | `#1E293B` | Inverted surfaces (tooltips, high-contrast badges) |
| `neutral-900` | `#181818` | Section headers, table cell primary values |
| `neutral-950` | `#111111` | **Primary Text Color**, high-priority headings, solid black accents |

---

## 3. Operational & Status Colors

Every status indicator in CATCHAM must pair color with an icon and explicit text label. Never convey state by color alone.

| Status | Color Name | Hex Code | Background Tint | Icon | Meaning in CATCHAM |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Success** | Green | `#008A4B` | `#F3FAF6` | `CheckCircle2` | Verified evidence, closed case, approved workflow |
| **Warning** | Amber | `#D97706` | `#FFFBEB` | `AlertTriangle` | Approaching SLA, pending supervisor approval, escalation |
| **Error / Critical** | Crimson | `#DC2626` | `#FEF2F2` | `AlertCircle` | Tampered evidence, breached SLA, rejected workflow, failed login |
| **Info / Neutral** | Slate | `#475569` | `#F8FAFC` | `Info` | Triaged report, system notice, historical log |
| **Confidential** | Indigo | `#4F46E5` | `#EEF2FF` | `Lock` | Restricted evidence classification, confidential notes |

---

## 4. Contrast & Accessibility Rules
- Text contrast ratio against background: **Minimum 4.5:1** for normal text, **3:1** for large headings (WCAG 2.2 AA).
- Primary button: White (`#FFFFFF`) text on `brand-600` (`#006B3C`) yields a contrast ratio of **4.8:1** (Passes AA).
- Input field borders: Minimum `#CBD5E1` on `#FFFFFF` (3:1 contrast against surface).
