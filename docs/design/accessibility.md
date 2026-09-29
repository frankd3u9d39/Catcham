# Accessibility Specifications (WCAG 2.2 Level AA)

CATCHAM is built to be accessible to every Nigerian citizen and officer, regardless of hardware, network capability, or physical disability.

---

## 1. Contrast Ratios
- **Text & Images of Text**: 4.5:1 minimum for normal text (< 18pt), 3:0:1 minimum for large text (>= 18pt or >= 14pt bold).
- **Interactive UI Components & Graphical Objects**: 3.0:1 minimum against adjacent background colors.
- **Status Badges**: Text within status pills is styled with high-contrast text (`#004D2A` on `#F3FAF6`, `#991B1B` on `#FEF2F2`).

---

## 2. Keyboard Navigation & Focus Order
- **Focus Indicators**: All focusable interactive elements feature a visible 2px outline in Nigerian Green (`#006B3C`) with a 2px offset.
- **Skip Links**: The very first focusable element on every page is a `Skip to Main Content` anchor.
- **Modal Trapping**: Modal dialogs and slide drawers strictly trap focus inside the modal until dismissed via `Escape` or close action.
- **Logical Tabindex**: Tab order follows DOM visual reading hierarchy strictly from top-left to bottom-right.

---

## 3. Screen Reader Support & Semantics
- Pure semantic HTML5: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
- All icon-only buttons (such as notification bells, search triggers, or copy buttons) must have explicit `aria-label` attributes.
- Dynamic status changes (e.g., "Report submitted successfully", "Evidence verified") trigger `aria-live="polite"` announcements.

---

## 4. Touch Targets & Responsive Adaptability
- Minimum touch target for all interactive elements: **44px × 44px** (especially vital for mobile citizen reporting).
- Zoom support: The layout must remain fully readable and operable up to 200% browser zoom without loss of content or broken horizontal scrolling.
