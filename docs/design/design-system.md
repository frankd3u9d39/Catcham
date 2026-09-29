# CATCHAM Sovereign Design System

> **Single Source of Truth for the CATCHAM Multi-Agency Platform Frontend.**

---

## 1. System Vision & Tone
CATCHAM is Nigeria's multi-agency whistleblowing, incident reporting, investigation, digital evidence, and case management platform. The design system embodies:
- **Sovereign Trust & Serious Authority**: Not a flashy commercial startup; an accountable, transparent, government-grade operational system.
- **Calm, Human & Accessible**: Citizens submitting sensitive reports need clarity, reassurance, and zero cognitive overload.
- **Predominant Palette**: Clean White (`#FFFFFF`), Softened Deep Charcoal/Black (`#111111`, `#181818`), and Sovereign Nigerian Green (`#006B3C`).
- **Restrained & Functional**: No decorative bouncing, crypto-neon accents, or gratuitous glassmorphic cards. Every visual element serves an operational purpose.

---

## 2. Core Pillars

| Pillar | Principle | Manifestation |
| :--- | :--- | :--- |
| **Trust by Default** | Reassure citizens and officers that data is secure and immutable. | Visible cryptographic badges (SHA-256), clear data-retention and anonymity disclaimers, clear audit markers. |
| **Cognitive Restraint** | Investigative work and whistleblowing require absolute clarity. | Controlled whitespace, single readable typeface (`Inter`), strict 8-point rhythm, absence of visual clutter. |
| **Universal Accessibility** | Built for 220+ million Nigerians across varied networks and devices. | WCAG 2.2 AA compliance, high contrast, touch targets >= 44x44px, offline state notifications. |
| **Role-Adaptive Interface** | One unified frontend adapting to permissions. | The same component library renders citizen reporting, investigator workbenches, and supervisor dashboards seamlessly. |

---

## 3. Design Tokens Architecture
The design system operates on three tiers of design tokens:
1. **Global/Primitive Tokens**: Raw hex values, pixel sizes, and font scale values (`colors.ts`, `spacing.ts`, `typography.ts`).
2. **Semantic Tokens**: Contextual mappings such as `color-surface-primary`, `color-brand-default`, `color-status-urgent`.
3. **Component Tokens**: Scoped component states (e.g., `button-primary-bg`, `card-border-subtle`).

All tokens are defined in TypeScript under `apps/web/design-system/tokens/` and exported directly into `tailwind.config.ts`.
