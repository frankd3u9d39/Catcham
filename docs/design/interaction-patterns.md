# Interaction Patterns & Micro-UX

CATCHAM standardizes all interactions to ensure that users across all 36 Nigerian states encounter zero unexpected behaviors.

---

## 1. Form Validation Patterns
- **Validation Timing**: Progressive validation on blur for individual fields; comprehensive validation upon step progression.
- **Error Placement**: Error text in Crimson (`#DC2626`) appears directly below the offending input with an accompanying warning icon.
- **Auto-formatting**:
  - Nigerian Phone numbers auto-format to `+234 (0) 80X XXX XXXX`.
  - Reference numbers format automatically with capital letters and hyphens.

---

## 2. Destructive & Critical Confirmation Pattern
- Any destructive operation (e.g. Rejecting report, Reassigning lead investigator, Sealing evidence, Closing investigation) requires:
  1. Trigger button with distinct secondary confirmation modal.
  2. Mandatory "Reason for Action" text field to maintain the audit log.
  3. Explicit positive confirmation button requiring 2 distinct user actions.

---

## 3. Toast Notifications & Alert Banners
- **Toasts**: Non-disruptive feedback (e.g., "Report draft saved", "Hash copied to clipboard") appear in the bottom-right corner and auto-dismiss after 4 seconds.
- **Alert Banners**: High-importance systemic messages (e.g., "Case escalated to Special Investigations Unit", "Chain of custody sealed") remain pinned at the top of the relevant card until resolved.
