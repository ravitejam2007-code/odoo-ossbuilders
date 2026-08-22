# Phase 3 Navigation — Attendance

## Route
`/attendance`

## Entry points
- Dashboard → Attendance
- Main employee navigation → Attendance

## Page navigation
- current day / selected week controls
- check-in/check-out action
- daily/weekly display
- optional date controls only if supported by the API contract

## Access rule
Employee can access only their own attendance.

## What NOT to do
Do not add `/attendance/:employeeId` to the employee route structure.
Do not expose an "All Employees" filter on this route.
