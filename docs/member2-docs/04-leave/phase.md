# Phase 4 — Employee Leave and Leave Application

## Objective
Build the employee leave list and leave application flow.

The requirements specify Paid, Sick, and Unpaid leave types; a date range; remarks; and request statuses Pending, Approved, and Rejected. Employees submit requests; Admin/HR handles approval.

The team split explicitly states that the leave→attendance transaction is backend-owned. Member 2 only invokes the leave decision/application APIs and reflects the resulting server state.

## Pin-to-pin implementation

### Step 1 — Leave list
Build `/leave` showing the employee's requests.

Recommended information:
- leave type
- start date
- end date
- remarks
- status
- decision/comment where supplied by contract

### Step 2 — Leave application form
Build `/leave/new` with:
- leave type
- start date
- end date
- remarks

### Step 3 — Validation
Validate user-facing constraints supported by the contract:
- required fields
- valid date range
- acceptable leave type
- sensible text constraints

Server validation remains authoritative.

### Step 4 — Submit
On submit:
1. disable the form
2. send the typed mutation
3. show server errors
4. on success invalidate the employee's leave query
5. navigate according to app convention, normally back to `/leave`

### Step 5 — Status presentation
Create one shared status renderer for:
- Pending
- Approved
- Rejected

Do not visually imply an approval has occurred before the server confirms it.

### Step 6 — Refresh behavior
When returning from creation or after mutation:
- fetch/refresh the current employee's leave data
- do not append guessed objects into cache unless the actual server response is used

### Step 7 — Coordinate with Member 3
The Admin leave approval UI uses the same backend workflow. Agree on status labels and comments presentation so employee and admin views remain consistent.

## Definition of Done
- Employee can see own leave requests.
- Employee can submit Paid/Sick/Unpaid leave.
- Date range and remarks work.
- Pending/Approved/Rejected statuses work.
- Mutation errors are visible.
- No approval logic is duplicated in the frontend.

## What NOT to do
- Do not build approve/reject controls in the employee UI.
- Do not update attendance directly after a leave application.
- Do not implement the leave→attendance transaction in React.
- Do not fake an Approved state.
- Do not show another employee's leave requests.
