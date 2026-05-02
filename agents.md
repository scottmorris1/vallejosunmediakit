# AGENTS.md

## Project Overview

Static media kit website for the Vallejo Sun, a local news publication in Vallejo, California.

Primary goals:
- Present ad offerings clearly.
- Convert advertisers through packages, contact forms, booking links, and self-serve purchases.
- Capture advertiser leads and opt-ins.
- Support a lightweight ad sales workflow without a heavy CRM.

Tech stack:
- Static HTML + CSS, no framework.
- GitHub repo for source control.
- Cloudflare Pages planned for hosting.
- Cloudflare Workers planned for backend endpoints.
- Airtable planned for lead capture, advertiser updates, and fulfillment records.
- Stripe Checkout planned for self-serve ad payments.

Do not introduce a frontend framework unless explicitly requested.

---

## Core UX Principles

1. Keep the site simple and conversion-focused.
2. Emphasize goal-oriented ad packages before individual placements.
3. Reduce buyer overwhelm with guidance and hierarchy.
4. Preserve clear paths:
   - Not sure where to start? Book a call.
   - Want a simple option? Start with a package.
   - Know what you need? Build your own campaign.
5. Mobile layouts must be clean and usable.
6. Avoid vague marketing language when concrete metrics are available.

---

## Site Structure

Expected main files:
- `index.html` — homepage / main conversion page.
- `offerings.html` — packages, placements, calendar, Best Of links.
- `buy.html` — self-serve product selection and checkout entry.
- `contact.html` — advertiser lead form.
- `style.css` — shared styles.
- Static assets in `/images`.

---

## Navigation

Header:
- Sticky on desktop and mobile.
- Mobile uses hamburger menu.
- Mobile menu overlays page content and should not push page down.
- Header should include the large “Buy Ads” button.
- Do not duplicate “Buy Ads” as a normal nav text link.

External links:
- Book a Call uses Proton booking link:
  `https://calendar.proton.me/bookings#GaKm4o3hgP7zuDBAB4oR7ZU6LmCOGeGwRCEpAeerXy8=`
- Calendar Ads links to:
  `https://hub.cityspark.com/event/submission/VallejoSun`
- Best Of Contest links to:
  `https://bestof.vallejosun.com/advertise`

Footer:
- Black full-width footer.
- Links:
  - The Vallejo Sun — `https://www.vallejosun.com/`
  - About the Vallejo Sun — `https://www.vallejosun.com/about/`
  - Privacy policy — `https://www.vallejosun.com/privacy-policy/`
  - Editorial policies — `https://www.vallejosun.com/editorial-independence-policy/`

---

## Homepage: `index.html`

Homepage should communicate reach, trust, and clear paths to action.

Hero stat block must include four items:
- `40,000+` — Monthly website visitors
- `6,400` — Newsletter subscribers
- `80%` — Live in Vallejo
- `82%` — Attend local events

Rules:
- Keep four stats for visual balance.
- Avoid replacing concrete stats with vague language.
- Do not reintroduce open rate in the top stat block.

Testimonials:
- Quote text should be slightly larger than normal body text.
- Testimonials should support credibility without dominating layout.

Email capture:
There are two advertiser-update email capture forms on `index.html`.

Purpose:
- Capture lower-intent advertiser update subscribers for a future quarterly advertiser update email.

Rules:
- Forms must not sit inline with button rows.
- Forms should appear on a new line below adjacent CTAs.
- Desktop max width around `420px`.
- Mobile:
  - email field full width
  - “Get updates” button below field
  - button should be yellow/primary
  - button should not span full width unless explicitly changed later
  - maintain visible spacing between field and button

Fields:
- `email`
- hidden `source = media_kit_home_signup`
- hidden `advertiser_updates = true`

Planned endpoint:
- `POST /api/advertiser-updates`

Behavior:
- Submit through Cloudflare Worker.
- Worker writes to Airtable.
- Do not expose Airtable credentials in frontend code.
- Add success/error UI without disrupting layout.

---

## Offerings Page: `offerings.html`

Purpose:
- Present recommended packages first.
- Let advanced buyers build their own campaign through individual placements.
- Route special products to their existing external flows.

Recommended packages are the default path.

Current package naming:
- Event Promotion Special
- Brand Builder
- Top Visibility
- Announcement / Launch

Important:
- “Top Visibility” replaced the older “Brand Builder Plus” name.
- Do not reintroduce “Brand Builder Plus.”

Guidance near packages should be clear and scannable, preferably broken into three lines/bullets:
- Not sure where to start? Book a call.
- Want a simple option? Start with a package.
- Know what you need? Build your own campaign below.

Individual placements:
- Section header should be “Build your own campaign.”
- De-emphasize placements visually relative to packages.
- Placements are still important because they explain package components.

Newsletter naming:
- Use “News Roundup Newsletter,” not “Weekly Newsletter.”

Calendar:
- Calendar Ads should route to CitySpark submission flow:
  `https://hub.cityspark.com/event/submission/VallejoSun`
- Copy should set expectation that quick account creation may be required.
- The calendar flow is external; do not build a duplicate calendar page unless requested.

Best Of:
- Best Of should link to:
  `https://bestof.vallejosun.com/advertise`
- Do not duplicate Best Of sales flow on this site unless requested.

---

## Buy Page: `buy.html`

Purpose:
- Let users choose a package or placement and proceed to Stripe Checkout.

Current UX:
- Desktop may use selection list + summary panel.
- Mobile must not require users to choose an item and then hunt/scroll for the checkout button.
- If using a sticky mobile checkout bar, keep it visually clean:
  - selected product name
  - price
  - compact checkout button
  - no overlap
  - no cramped text
- Avoid making CTA buttons obscure product text.

Product grouping:
- Emphasize recommended packages first.
- Add a clear “Individual placements” section to separate packages from placements.

Planned Stripe flow:
- User selects product on `buy.html`.
- Frontend sends product slug to Cloudflare Worker:
  - `POST /api/create-checkout-session`
- Worker maps slug to Stripe Price ID.
- Worker creates Stripe Checkout Session.
- Stripe handles payment.
- On success, Stripe redirects user back to:
  - `ad-details.html?session_id={CHECKOUT_SESSION_ID}`
- `ad-details.html` calls:
  - `GET /api/checkout-session?session_id=...`
- Worker verifies the Stripe Checkout Session.
- User submits ad details only after verified payment.

Constraints:
- Use Stripe Checkout.
- Do not build custom payment forms.
- Do not expose Stripe secret keys in frontend code.
- Do not expose Airtable tokens in frontend code.
- Payment and ad-detail collection are separate steps.

Optional later:
- Add Stripe webhook endpoint:
  - `POST /api/stripe-webhook`
- Webhooks are server-to-server.
- Webhooks do not redirect users.
- Use webhook later to update Airtable if payment succeeds but user never completes the redirect/details flow.

---

## Post-Payment Ad Details Page: `ad-details.html` (Planned)

Purpose:
- Collect ad fulfillment details after successful Stripe payment.

Access:
- Should require a valid Stripe Checkout Session ID.
- Page should verify payment through Worker before accepting submission.

Suggested fields:
- Contact name
- Business / organization
- Email
- Phone
- Purchased product (read-only from Stripe session)
- Preferred start date
- Landing page URL
- What are you promoting?
- Notes / instructions
- Need design help? yes/no
- Creative upload

Uploads:
- Desired UX: drag-and-drop file upload.
- Preferred architecture:
  - Cloudflare R2 for uploaded files
  - Airtable stores file URLs and fulfillment record
- Do not expose R2 or Airtable credentials in frontend code.
- If R2 is not implemented initially, build the form without uploads first.

Planned endpoints:
- `GET /api/checkout-session?session_id=...`
- `POST /api/ad-details`
- Later:
  - `POST /api/upload-url`

Airtable should receive:
- Stripe Session ID
- Payment status
- Product slug/name
- Amount paid
- Contact details
- Campaign details
- Uploaded creative URLs
- Fulfillment status

---

## Contact Page: `contact.html`

Purpose:
- Capture higher-intent advertiser leads and questions.
- More complex than homepage email capture.

Contact form fields include:
- Name
- Company role
- Business or organization
- Email
- Phone
- Website
- Address
- What are you interested in?
- When would you like to start?
- What are you promoting?
- Do you already have ad creative?
- Questions or comments
- Advertiser updates opt-in checkbox, pre-checked

Rules:
- Address field should appear above:
  - What are you interested in?
  - When would you like to start?
- Contact page layout:
  - Desktop: form on left, helpful sidebar on right.
  - Mobile: form full width first, sidebar below.
- Do not let sidebar squeeze form on mobile.
- Opt-in checkbox should be visually connected to submit action.

Planned endpoint:
- `POST /api/contact`

Airtable record should include:
- all form fields
- `source = media_kit_contact_form`
- `advertiser_updates` true/false
- timestamp
- optional lead status

Do not post directly to Airtable from frontend.

---

## Airtable Integration

Airtable is the operational database, not the frontend.

Use Cloudflare Workers for:
- validation
- secret handling
- Airtable API calls

Never expose:
- Airtable personal access token
- Airtable base ID if avoidable
- Stripe secret key

Planned Airtable tables may include:

### Advertiser Updates
For low-intent email capture.
Fields:
- Email
- Source
- Advertiser Updates
- Created At
- Page

### Advertising Leads
For contact form leads.
Fields:
- Name
- Company Role
- Business
- Email
- Phone
- Website
- Address
- Interest
- Timeline
- Promotion
- Creative Status
- Comments
- Advertiser Updates
- Source
- Lead Status
- Created At

### Ad Purchases / Fulfillment
For paid self-serve purchases.
Fields:
- Stripe Session ID
- Payment Status
- Product Slug
- Product Name
- Amount Paid
- Contact Name
- Business
- Email
- Phone
- Preferred Start Date
- Landing Page URL
- Promotion Description
- Creative File URLs
- Needs Design Help
- Fulfillment Status
- Internal Notes

---

## Cloudflare Workers

Planned endpoints:
- `POST /api/advertiser-updates`
- `POST /api/contact`
- `POST /api/create-checkout-session`
- `GET /api/checkout-session?session_id=...`
- `POST /api/ad-details`
- Later:
  - `POST /api/upload-url`
  - `POST /api/stripe-webhook`

Environment variables/secrets:
- `AIRTABLE_TOKEN`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_ADVERTISER_UPDATES_TABLE`
- `AIRTABLE_LEADS_TABLE`
- `AIRTABLE_PURCHASES_TABLE`
- `STRIPE_SECRET_KEY`
- Stripe Price IDs for each product
- Later:
  - R2 configuration if uploads are implemented

Validation:
- Validate email on email capture and contact forms.
- Return JSON responses.
- Frontend should show success/error states.
- Avoid page reloads if possible.

---

## Styling Rules

General:
- Keep design clean, low-friction, and readable.
- Do not add heavy visual sections unnecessarily.
- Avoid gallery-style image blocks unless explicitly requested.

Buttons:
- Primary buttons are yellow using `--accent`.
- Secondary buttons are white.
- Button corners should be rounded/pill-like.
- Do not stretch buttons full width on desktop unless intended.
- On mobile, full-width buttons are acceptable only when layout clearly benefits.

Forms:
- Inputs should have rounded corners matching button style.
- Maintain adequate spacing between inputs and buttons.
- Mobile forms should stack cleanly.
- Avoid elements touching screen edges.

Email capture forms:
- Especially fragile; avoid broad CSS rewrites that affect them unintentionally.
- Confirm both homepage instances after edits.

---

## Known Pitfalls / Do Not Reintroduce

- Do not place homepage email forms inside CTA button flex rows.
- Do not make the bottom email form sit on the same line as CTA buttons.
- Do not make “Get updates” white; it should be yellow.
- Do not allow mobile email field to be narrow while button is wide.
- Do not make mobile contact page sidebar appear beside the form.
- Do not add “Buy Ads” as both a nav text link and a header button.
- Do not reintroduce “Brand Builder Plus.”
- Do not reintroduce “Weekly Newsletter” naming.
- Do not use vague stats when concrete stats exist.
- Do not use open rate in the homepage hero stat block.
- Do not add duplicate pages for Calendar or Best Of unless requested.

---

## Working Style for Codex

When editing:
- Work directly in repo files.
- Prefer precise diffs over broad rewrites.
- Preserve existing design unless explicitly changing it.
- Check desktop and mobile behavior mentally after CSS edits.
- Avoid adding frameworks, build tools, or dependencies unless asked.
- Keep all shared styling in `style.css` where practical.
- Do not create duplicate versions of pages.

Before committing:
- Verify index homepage CTA forms still work visually.
- Verify mobile nav still overlays instead of pushing content.
- Verify contact form is full width on mobile.
- Verify buy page mobile path to checkout is obvious.
