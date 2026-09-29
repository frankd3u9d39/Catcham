# Design Decisions & Architectural Rationale

---

## Decision 1: Restrained Sovereign Aesthetic over Startup Minimalism
- **Context**: Whistleblowers and agency personnel dealing with sensitive matters of national security, corruption, and infrastructure vandalism need to feel confident in the gravity and accountability of the system.
- **Decision**: Avoid rounded pill cards, neon highlights, playful cartoon illustrations, or dark gamer themes. Use structured grids, white cards with crisp 1px borders (`#E2E8F0`), deep sovereign green accents (`#006B3C`), and legible tabular typography.
- **Outcome**: The interface conveys institutional dignity and court-admissible rigor.

---

## Decision 2: Distinct Separation Between Original Evidence & AI Insights
- **Context**: AI models provide OCR and transcription assistance, but cannot be conflated with original evidence in legal proceedings.
- **Decision**: AI annotations are rendered in a distinct secondary panel with explicit confidence scores and "Machine Assisted Analysis" tags. The original digital asset remains immutable, hashed, and visually distinct.
- **Outcome**: Eliminates legal ambiguity and upholds the digital chain of custody.

---

## Decision 3: Guided Multi-Step Public Reporting vs Single Monolithic Form
- **Context**: Citizens reporting incidents on mobile devices with variable internet connectivity often abandon long, intimidating multi-field forms.
- **Decision**: Break report submission into 8 discrete, manageable stages with progressive auto-saving of local drafts, clear progress indication, and optional location capture.
- **Outcome**: Increases completion rates and reduces reporting errors while preserving user privacy.
