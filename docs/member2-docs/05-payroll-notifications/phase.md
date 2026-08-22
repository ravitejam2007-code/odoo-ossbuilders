# Phase 5 — Employee Payroll and Notifications

## Objective
Implement the employee read-only payroll view and notification list.

The requirements state that payroll data is read-only for employees. The system also includes email and notification alerts. Member 2 owns the employee notification screen.

## Pin-to-pin implementation

### Step 1 — Payroll contract
Confirm the exact employee payroll response from Member 1.
Do not invent salary fields.

### Step 2 — Payroll screen
Build `/payroll` as read-only.

Clearly distinguish:
- salary/payroll information that is returned
- unavailable/not-yet-generated information
- read-only state

Do not render edit controls.

### Step 3 — Notifications
Build `/notifications` showing notification list data supplied by the API.

Support:
- unread/read state
- timestamp/date display
- notification content
- loading state
- empty state
- error state

### Step 4 — Read/unread mutation
If the API supplies a mark-read operation:
1. call typed mutation
2. avoid duplicate mutation
3. update/invalidate relevant notification queries
4. keep UI consistent with server state

### Step 5 — Navigation integration
Unread indicators in the main navigation may be displayed only if the notification contract provides the count/state.

### Step 6 — Responsive pass
Payroll should remain legible on small screens. Avoid forcing wide desktop-only tables when a stacked representation is more appropriate.

## Definition of Done
- `/payroll` is fully read-only.
- `/notifications` works with server data.
- Unread/read state is consistent.
- No invented payroll calculations.
- No edit/delete controls appear for employee payroll.

## What NOT to do
- Do not let employees edit salary.
- Do not calculate payroll in the frontend unless explicitly specified by the API/product contract.
- Do not invent salary slip fields.
- Do not mark notifications read permanently without server confirmation.
