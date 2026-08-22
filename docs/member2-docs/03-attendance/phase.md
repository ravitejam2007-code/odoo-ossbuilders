# Phase 3 — Employee Attendance

## Objective
Implement the employee attendance experience. The HRMS requirements call for daily and weekly attendance views, employee check-in/check-out, and attendance statuses including Present, Absent, Half-day, and Leave. Employees can view only their own attendance.

## Pin-to-pin implementation

### Step 1 — Verify API contract
Confirm endpoints/types for:
- current employee attendance
- daily/weekly filtering
- check-in
- check-out

Do not invent status values beyond the agreed contract.

### Step 2 — Build the attendance page
Create:
- page header
- current status summary
- check-in/check-out action area
- daily view
- weekly view
- date/week navigation where supported
- status indicators
- loading state
- empty state
- error state

### Step 3 — Check-in state machine
The UI must derive allowed actions from server state.

Example:
- not checked in → show Check In
- checked in → show Check Out
- already completed → disable further check-in/out

Do not trust local state alone.

### Step 4 — Attendance status rendering
Use a centralized status-to-label/display mapping so Present, Absent, Half-day, and Leave render consistently.

### Step 5 — Mutation flow
On check-in/check-out:
1. disable duplicate submission
2. call typed mutation
3. display server validation/error if rejected
4. invalidate/refetch attendance queries
5. reflect the new server state

### Step 6 — Date handling
Use the project's established date/time utilities. Do not perform ad-hoc timezone calculations inside multiple components.

### Step 7 — Privacy check
The employee route must query only the authenticated employee's attendance.

## Definition of Done
- Daily and weekly attendance are usable.
- Check-in/check-out reflects server state.
- Status values render correctly.
- API errors are recoverable.
- Employee cannot select another employee.
- Responsive attendance presentation works on smaller screens.

## What NOT to do
- Do not add an employee ID field to attendance.
- Do not calculate final attendance status independently if the server owns that rule.
- Do not fake successful check-in locally without confirming the API result.
- Do not implement admin all-employee attendance here.
