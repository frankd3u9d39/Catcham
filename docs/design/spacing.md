# Spacing & Layout Rhythm

CATCHAM enforces a strict **8-point grid** (with a 4-point micro-scale for precise alignment) to ensure consistency across all screens.

---

## 1. Spacing Scale

| Token | Pixels | Rem Equivalent | Purpose |
| :--- | :--- | :--- | :--- |
| `space-1` | 4px | 0.25rem | Micro-spacing: Icon-to-text spacing, tag padding |
| `space-2` | 8px | 0.5rem | Tight spacing: Input field internal padding, list item gaps |
| `space-3` | 12px | 0.75rem | Compact spacing: Card internal micro-padding, badge padding |
| `space-4` | 16px | 1.0rem | Standard base: Card padding, table cell vertical padding, form row gap |
| `space-5` | 20px | 1.25rem | Intermediate spacing: Button group spacing, modal internal padding |
| `space-6` | 24px | 1.5rem | Medium spacing: Section gap inside cards, drawer padding |
| `space-8` | 32px | 2.0rem | Macro spacing: Page header to content gap, grid gutter on desktop |
| `space-10` | 40px | 2.5rem | Large spacing: Major dashboard block separation |
| `space-12` | 48px | 3.0rem | Extra-large: Stepper milestone spacing |
| `space-16` | 64px | 4.0rem | Hero section vertical padding, public landing gaps |
| `space-20` | 80px | 5.0rem | Top-level page footer separation |

---

## 2. Layout Containers & Max Widths

- **Public Guided Intake Form**: Max-width `768px` (centered, focused, zero side distractions).
- **Standard Enterprise Dashboard / Case View**: Max-width `1600px` (optimal for multi-column split views: case details + task checklist + evidence pane).
- **Public Landing Page**: Max-width `1280px` (standard container).

---

## 3. Elevation & Shadows
Shadows in CATCHAM are subtle, non-dramatic, and designed to separate layers on white surfaces.

| Token | Definition | Usage |
| :--- | :--- | :--- |
| `shadow-none` | `none` | Flat elements, secondary buttons |
| `shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Data cards, standard form inputs |
| `shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)` | Hover cards, dropdown menus, popovers |
| `shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.03)` | Modal dialogs, side drawers |
| `shadow-xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)` | Critical confirmation dialogs |

---

## 4. Border Radius Scale
CATCHAM avoids "pill" cards or excessive rounded corners to preserve a dignified institutional feel:
- `radius-sm` (4px): Checkboxes, micro-tags, tooltips.
- `radius-md` (6px): Form inputs, dropdown items, table row focus rings.
- `radius-lg` (8px): Standard buttons, action bars, alert banners.
- `radius-xl` (12px): Standard workspace cards, modals, sidebars.
- `radius-full` (9999px): User avatar circles, circular status badges only.
