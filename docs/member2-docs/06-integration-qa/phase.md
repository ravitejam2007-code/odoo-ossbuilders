# Phase 6 — Integration, QA, Responsive Review, and Release Readiness

## Objective
Integrate all employee screens into a coherent production-ready experience and prepare for shared staging validation.

The team plan calls for notifications, reports, responsive QA across both frontend surfaces, and staging deployment in Week 6. Member 2 focuses on the employee surface and coordinates with Member 3 and Member 1 for cross-surface consistency.

## Pin-to-pin implementation

### Step 1 — Authentication end-to-end verification
Verify:
- login
- authentication persistence
- logout
- expired/invalid session behavior
- protected employee routes
- redirect after successful authentication

### Step 2 — Cross-route consistency
Walk through:
Dashboard → Profile → Attendance → Leave → Payroll → Notifications.

Check:
- navigation
- loading behavior
- consistent page headers
- error treatment
- responsive layout
- shared component consistency

### Step 3 — API integration audit
For every employee feature:
- confirm real API hook
- remove stale mock data
- confirm query keys
- confirm invalidation
- confirm typed request/response usage
- verify server errors are rendered clearly

### Step 4 — Security/privacy UI audit
Confirm employee screens never offer:
- another employee selector
- admin-only links
- employee ID query parameters for private-resource access
- salary editing
- leave approval
- all-employee attendance

Client checks are UX boundaries; backend authorization remains authoritative.

### Step 5 — Responsive QA
Test major widths and interactions:
- navigation
- dashboard cards
- profile forms
- attendance views
- leave form
- payroll
- notifications

Look for:
- clipped tables
- overflowing buttons
- inaccessible dialogs
- horizontal scrolling caused by layout mistakes
- text truncation that hides important data

### Step 6 — Accessibility audit
Check:
- keyboard access
- focus visibility
- input labels
- error messages
- buttons with meaningful names
- non-color-only status distinctions
- sensible heading structure

### Step 7 — Shared-component audit
Coordinate with Member 3:
- same Button behavior
- same Card treatment
- same Table behavior
- same FormField validation behavior
- same status treatment

Do not fork shared primitives just to make one screen visually different.

### Step 8 — Regression testing
Retest:
- authentication
- dashboard
- profile/edit
- attendance
- leave/new
- payroll
- notifications
- logout

Include successful flows and intentional API failures.

### Step 9 — Staging handoff
Provide:
- changed files
- API dependencies
- environment assumptions
- known issues
- test results
- screenshots if the team's process uses them

## Definition of Done
- All Employee routes work against real contracts.
- Employee privacy boundaries are reflected in the UI.
- Responsive QA is complete.
- Shared UI is consistent with Member 3.
- No stale mock data remains where real APIs are available.
- Known failures are documented.

## What NOT to do
- Do not hide unresolved integration failures.
- Do not bypass TypeScript/API errors with unsafe casts just to make the build pass.
- Do not alter backend behavior to solve a frontend display issue without coordinating with Member 1.
- Do not introduce last-minute architecture rewrites.
