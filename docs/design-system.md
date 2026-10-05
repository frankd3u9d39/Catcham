# Design system

Tokens live in `apps/web/design-system/tokens` and are mirrored into
`apps/web/tailwind.config.ts` for Tailwind, and into
`apps/mobile/theme/index.ts` for React Native, which has no access to Tailwind.
Changing a colour means changing it in the token file and both mirrors.

## Colour

Green is the brand colour, with `brand-600` (`#006B3C`) as the primary. Neutrals
are a slate-derived ramp. Status colours carry meaning and are not used
decoratively:

| Token        | Use                                                         |
| ------------ | ----------------------------------------------------------- |
| `success`    | Resolved, closed, verified integrity                        |
| `warning`    | In progress, approaching a deadline, a sensitive action      |
| `error`      | Rejected, overdue, failed verification                       |
| `confidential` | Anonymous submitters, restricted evidence, confidential notes |

Status is never carried by colour alone. Every badge pairs its colour with a
label, and most with an icon, because a colour-blind user and a greyscale
printout both have to work.

## Typography

Inter for text, JetBrains Mono for anything that gets read aloud or typed back:
reference numbers, case numbers, tracking codes and hashes. Those are the values
people quote over a phone, so they need unambiguous digits.

## Components

`apps/web/components/ui` holds the primitives — Button, Input, Select, Textarea,
Card, Badge, Dialog, Pagination, and the loading, empty and error states.
`components/business` and `components/evidence` hold the composed pieces:
Timeline, WorkflowStepper, EvidenceList, CustodyTrailView.

The error and empty states are primitives on purpose. Every screen that loads
data has three outcomes beyond the happy path — loading, failed, empty — and
making them components means none of them gets skipped.

## Responsive behaviour

The web portal is a desktop tool that has to survive a phone. Two patterns do
most of the work:

- Wide tables become card lists below `lg`. A seven-column table is unreadable
  on a phone, so the report queue renders as a table on desktop and as cards on
  mobile, from the same data.
- The sidebar is fixed on desktop and off-canvas below `lg`, opened by a floating
  button.

Dialogs are centred cards on desktop and bottom sheets on a phone.

## Accessibility

- Interactive targets are at least 44pt, and 48pt in the mobile app.
- Dialogs trap Tab, restore focus on close, and carry `role="dialog"` with
  `aria-modal`.
- Every page has a skip link to `#main-content`.
- Form fields have associated labels; errors are described in text, not by border
  colour alone.
- Icon-only buttons carry an `aria-label`.
- Loading states announce what is loading rather than showing a bare spinner.

## Mobile app

The mobile app shares the tokens but not the components — React Native has no
DOM. Two deliberate differences:

- Selection uses a list of tappable rows rather than a native picker, because
  picker behaviour differs enough between iOS and Android to be a liability on
  the form that matters most.
- Location is requested on demand, not at launch. Someone reporting anonymously
  should choose when to share their position, and a permission prompt on first
  launch invites a refusal that then has to be undone in system settings.
