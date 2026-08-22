# Phase 2 — Employee Dashboard and Profile

## Objective
Implement the employee dashboard and profile experience using the foundation from Phase 1.

The requirements specify that the employee dashboard provides quick access to Profile, Attendance, Leave Requests, and Logout and shows recent activity or alerts. Employee profiles include personal details, job details, salary structure, documents, and profile picture. Employees may edit limited fields such as address, phone, and profile picture; admins can edit all employee details.

## Pin-to-pin implementation

### Step 1 — Dashboard data contract
Confirm the backend contract for:
- current employee identity/profile summary
- activity/alerts
- dashboard summary information

If the backend endpoint is not ready, use a typed mock matching the agreed contract.

### Step 2 — Dashboard structure
Create:
- page heading
- welcome/current-user area
- quick-access cards
- recent activity or alert area
- loading skeleton
- empty activity state
- API error state

Each quick-access card must navigate using the central route definitions.

### Step 3 — Profile view
Build `/profile` with clearly separated sections:
- personal details
- job details
- salary structure
- documents
- profile picture

Salary must be presented as read-only in the employee experience.

### Step 4 — Profile edit
Build `/profile/edit` with only employee-editable fields from the specification/contract:
- address
- phone
- profile picture

Do not expose admin-only editing controls.

### Step 5 — Form behavior
Implement:
- initial loading
- field-level validation
- dirty-state tracking
- save/cancel actions
- submit loading state
- API error state
- success feedback
- prevention of duplicate submissions

### Step 6 — Query and mutation handling
Use the typed API client and TanStack Query hooks. After a successful profile update:
1. update/invalidate the correct current-profile query
2. refresh the displayed profile state
3. avoid manually mutating unrelated caches

### Step 7 — Responsive and accessibility pass
Check:
- mobile profile layout
- readable sections
- keyboard operation
- labels associated with inputs
- visible validation errors
- focus after modal/error where appropriate

## Definition of Done
- Dashboard works with real API or contract-compatible mock.
- Profile displays all required employee-visible sections.
- Employee can edit only permitted fields.
- Payroll data in profile remains read-only.
- Loading/error/empty/success states are complete.
- No admin controls leak into employee UI.

## What NOT to do
- Do not allow editing job details or salary structure from employee profile.
- Do not create an employee-ID selector on the employee profile route.
- Do not fetch another employee's profile for convenience.
- Do not put profile business rules in React components.
- Do not duplicate dashboard cards for the future Admin “View as employee” feature; make them reusable.
