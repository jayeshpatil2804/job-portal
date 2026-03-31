# Implementation Plan: Contact Page + Payment Status Fix

## Overview

Two independent features:
1. **Contact / About Us Page** — Public page with company info and an enquiry form that sends an email to `support@losodhan.com` via the existing SendGrid integration.
2. **Recruiter Payment Status Fix** — The `createJob` gate checks only `isPaid`, but when an admin **activates** (sets `isActive = true`) a recruiter portal, the recruiter should still be able to post jobs even without paying. The admin panel also needs a dedicated **"Mark as Paid / Unpaid / Temp-Activated"** control.

---

## User Review Required

> [!IMPORTANT]
> **Root cause of the "Please pay" bug:**
> `job.controller.ts` line 22 checks `if (!recruiter?.isPaid)` — it ONLY looks at `isPaid`.
> When an admin activates a recruiter (`isActive = true`), this does NOT set `isPaid = true`, so the check still fails.
>
> **Fix strategy:** Change the gate to `if (!recruiter?.isPaid && !recruiter?.isActive)` — meaning a recruiter can post jobs if **either** they've paid **OR** the admin has manually activated them.

> [!IMPORTANT]
> **New payment status states for admin panel:**
> - `Paid` → `isPaid = true` (genuine payment received)
> - `Unpaid` → `isPaid = false`  
> - `Temp Activated` → `isActive = true, isPaid = false` (admin grants temporary access without payment)
>
> The admin panel currently has separate Activate/Deactivate and payment badge — we'll add a unified **"Set Payment Status"** dropdown on each recruiter row in the Recruiter Approval table.

---

## Proposed Changes

### Feature 1: Contact / About Us Page

---

#### [NEW] `ContactPage.jsx` — `Frontend/src/pages/public/`
A single public page with two sections:
- **About Us** — Company mission, team description, values, address (Pandesara, Surat GJ 394221)
- **Enquiry Form** — Fields: Name, Email, Mobile, Subject (dropdown), Message → calls new backend API `POST /api/contact` → sends email via SendGrid to `support@losodhan.com`

#### [MODIFY] `App.jsx` — `Frontend/src/`
Add lazy route: `<Route path="/contact" element={<ContactPage />} />`

#### [MODIFY] `HomePage.jsx` — footer Company column
Update "Assistance" link from `/contact` to `/contact` (already correct path, just confirming).

---

#### [NEW] `contact.controller.ts` — `Backend/src/modules/`
`POST /api/contact` — public endpoint (no auth required).  
Accepts `{ name, email, mobile, subject, message }`.  
Sends email to `support@losodhan.com` using **SendGrid** (`@sendgrid/mail` already installed, `SENDGRID_API_KEY` already in `.env`).  
Also sends a **confirmation reply** to the enquirer's email.

#### [NEW] `contact.routes.ts` — `Backend/src/modules/`
Public router: `POST /contact` → `sendEnquiry`

#### [MODIFY] `index.ts` (or main router) — register contact route
Mount at `app.use('/api/contact', contactRoutes)`

---

### Feature 2: Payment Status Fix

---

#### [MODIFY] `job.controller.ts` — `Backend/src/modules/job/controllers/`
Change line 22:
```diff
- if (!recruiter?.isPaid) {
+ if (!recruiter?.isPaid && !recruiter?.isActive) {
```
Also update the `select` to include `isActive`:
```diff
- select: { isPaid: true }
+ select: { isPaid: true, isActive: true }
```

#### [NEW] `updateRecruiterPaymentStatus` — `Backend/src/.../management.controller.ts`
New controller function: `PATCH /admin/recruiters/:id/payment-status`  
Accepts `{ paymentStatus: 'PAID' | 'UNPAID' | 'TEMP_ACTIVATED' }` and updates DB:
- `PAID` → `isPaid: true, isActive: true`
- `UNPAID` → `isPaid: false`
- `TEMP_ACTIVATED` → `isPaid: false, isActive: true`

#### [MODIFY] `admin.management.routes.ts`
Add: `router.patch('/recruiters/:id/payment-status', checkPermission('RECRUITER_APPROVAL'), updateRecruiterPaymentStatus)`

#### [MODIFY] `RecruiterApproval.jsx` — `Frontend/src/pages/private/admin/`
Replace the static "Paid/Unpaid" badge + separate "Activate/Deactivate" button with a **Payment Status dropdown**:
- Options: `Paid ✓`, `Unpaid ✗`, `Temp Activated ⏱`
- On select → calls `PATCH /admin/recruiters/:id/payment-status`
- Color-coded: green (paid), gray (unpaid), amber (temp activated)

---

## Open Questions

> [!NOTE]
> None — the approach is clear. Awaiting your approval to execute.

---

## Verification Plan

### Backend
- Start dev server, call `POST /api/contact` with valid data and verify email arrives at `support@losodhan.com`
- As a recruiter with `isPaid = false, isActive = true` → call `POST /api/jobs` → should succeed (no longer blocked)
- As a recruiter with `isPaid = false, isActive = false` → call `POST /api/jobs` → should still get 403

### Frontend
- Visit `/contact` — form renders, submit test enquiry, check toast confirmation
- Admin panel → Recruiter Approval page → change payment status dropdown → verify badge updates instantly
