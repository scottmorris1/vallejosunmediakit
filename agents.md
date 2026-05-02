# AGENTS.md

## Project Overview
Static media kit website for the Vallejo Sun (local news publication).
Purpose: convert advertisers via clear offerings, CTA flows, and lead capture.

Tech stack:
- Static HTML + CSS (no framework)
- Hosted via GitHub Pages / static hosting
- Forms integrate with Airtable via Cloudflare Worker (planned)

---

## Core UX Principles

1. Minimize friction
   - Primary goal: get users to either:
     - Book a call
     - View offerings
     - Submit contact / email

2. Clear decision paths
   - Always support:
     - “Not sure → Book a call”
     - “Simple → Start with a package”
     - “Advanced → Choose placements”

3. Avoid overwhelming users
   - De-emphasize individual placements
   - Emphasize packages and guidance

4. Mobile-first behavior matters
   - Layout must be clean and readable on mobile
   - No cramped UI elements
   - Forms must stack properly

---

## Key Components

### CTA Structure (IMPORTANT)
Every major section should support:

- Primary: Book a Call
- Secondary: View Offerings
- Tertiary: Email capture or Contact

Bottom CTA must include:
- Ad Offerings
- Book a Call
- Ask a Question (links to contact page)

---

### Email Capture Forms (CRITICAL)

There are **2 forms on index.html**

Rules:
- Must NOT sit inline with button rows
- Must always appear on a new line below CTAs
- Max width: ~420px on desktop
- Full width input on mobile
- Button below input on mobile
- Button should NOT be full width
- Must include spacing between input and button

Fields:
- email
- source = media_kit_home_signup
- advertiser_updates = true

Future:
- Forms POST to `/api/advertiser-updates`
- That endpoint sends to Airtable

---

### Stats Section (Homepage)

Must always include:

- 40,000+ Monthly website visitors
- 6,400 Newsletter subscribers
- 80% Live in Vallejo
- 82% Attend local events

Rules:
- Keep 4 items (visual balance)
- Avoid vague language like “trusted”
- Prefer concrete metrics

---

### Testimonials

- Slightly larger text than body copy
- Used as credibility, not decoration
- Should not dominate layout

---

### Navigation

- Sticky header on desktop and mobile
- Mobile uses hamburger menu
- Menu overlays page (does not push content down)

---

## Styling Rules

Buttons:
- Primary = yellow (`--accent`)
- Secondary = white
- Forms should visually match button style (rounded / pill)

Forms:
- Rounded inputs (pill shape)
- Clean spacing
- Never edge-to-edge cramped on mobile

Layout:
- Avoid elements stretching full width unnecessarily
- Maintain consistent spacing rhythm

---

## Known Pitfalls (DO NOT REINTRODUCE)

- Email forms inside flex button rows
- Conflicting CSS overrides for `.email-capture`
- Mobile layouts where:
  - button touches screen edge
  - input is not full width
- Overuse of vague marketing language
- Adding too many product options without hierarchy

---

## File Structure

- `index.html` → homepage (primary conversion page)
- `offerings.html` → packages + placements
- `contact.html` → lead form
- `style.css` → all styling

---

## Development Rules

When making changes:
- Edit existing files directly (no duplicate structures)
- Do not introduce new frameworks
- Do not break mobile layout
- Do not regress CTA placement or hierarchy

---

## Future Integrations

Airtable:
- Store advertiser email opt-ins
- Source tracking required

Cloudflare Worker:
- Handles form POST
- Keeps Airtable API key secure

---

## Working Style

- Prefer precise edits over broad rewrites
- Preserve working layout unless explicitly changing it
- Validate both desktop and mobile behavior
