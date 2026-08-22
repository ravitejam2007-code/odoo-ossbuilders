-- =============================================================================
-- Dayflow HRMS Seed Data
-- =============================================================================

-- Clean existing data (optional, for resetting demo)
-- TRUNCATE TABLE notifications, documents, payslips, leave_requests, leave_balances, attendance, salary_structures, profiles, users CASCADE;

-- Insert Admin User (Password: Admin@1234)
-- Hash generated with bcrypt cost 10: $2a$10$wN9aNq0XfJ2G6H4qRjH9qOqQh0Qo0V5DkUo3jH6uB6vQ7r0q1vXm2 (example, can be updated or re-hashed)
INSERT INTO users (id, login_id, email, password_hash, role, email_verified)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'DFADMI20260001',
    'admin@dayflow.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- 'password'
    'admin',
    TRUE
) ON CONFLICT (login_id) DO NOTHING;

-- Insert Admin Profile
INSERT INTO profiles (user_id, name, phone, company, department, job_title, manager, avatar, work_status, joined_year, serial_no)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'System Administrator',
    '+91 98765 43210',
    'Dayflow HRMS',
    'Human Resources',
    'HR Lead & Admin',
    'Board of Directors',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'present',
    2026,
    '0001'
) ON CONFLICT (user_id) DO NOTHING;

-- Insert Employee User (Matching INITIAL_EMPLOYEE in Employee/src/api/mockData.ts)
INSERT INTO users (id, login_id, email, password_hash, role, email_verified)
VALUES (
    'e0000000-0000-0000-0000-000000000002',
    'OIJODO20220001',
    'john.doe@company.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- 'password'
    'employee',
    TRUE
) ON CONFLICT (login_id) DO NOTHING;

-- Insert Employee Profile
INSERT INTO profiles (
    user_id, name, phone, company, department, job_title, manager, avatar, work_status, joined_year, serial_no,
    about, what_i_love_about_job, skills, certifications, interests, dob, residing_address, nationality, gender, marital_status,
    bank_details, salary_info
) VALUES (
    'e0000000-0000-0000-0000-000000000002',
    'John Doe',
    '+1 (555) 234-5678',
    'Dayflow Tech',
    'Engineering',
    'Senior Frontend Engineer',
    'Sarah Jenkins',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    'present',
    2022,
    '0001',
    'Passionate full stack software engineer with 5+ years of experience designing modular architectures and enterprise web applications.',
    'Collaborating with creative engineers and turning complex requirements into simple, responsive user interfaces.',
    ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'System Architecture']::TEXT[],
    ARRAY['AWS Certified Solutions Architect', 'Meta Certified Frontend Developer']::TEXT[],
    ARRAY['Open Source Contributions', 'Mountain Biking', 'Chess', 'Photography']::TEXT[],
    '1995-04-14',
    '742 Evergreen Terrace, Sector 4, Tech City',
    'Indian',
    'Male',
    'Single',
    '{
        "accountNumber": "98765432109876",
        "bankName": "HDFC Bank Ltd.",
        "ifscCode": "HDFC0001234",
        "panNo": "ABCDE1234F",
        "uanNo": "100987654321",
        "empCode": "OIJODO20220001"
    }'::JSONB,
    '{
        "monthWage": 65000,
        "yearlyWage": 780000,
        "basicSalary": 32500,
        "houseRentAllowance": 16250,
        "standardAllowance": 4000,
        "performanceBonus": 5000,
        "leaveTravelAllowance": 3000,
        "fixedAllowance": 4250,
        "pfContributionEmployee": 3900,
        "pfContributionEmployer": 3900,
        "professionalTax": 200,
        "noOfWorkingDaysPerWeek": 5
    }'::JSONB
) ON CONFLICT (user_id) DO NOTHING;

-- Insert Leave Balances for Employee
INSERT INTO leave_balances (user_id, paid_days_available, sick_days_available, unpaid_days_taken)
VALUES ('e0000000-0000-0000-0000-000000000002', 24.0, 7.0, 0.0)
ON CONFLICT (user_id) DO NOTHING;

-- Insert Seed Attendance Records for Employee
INSERT INTO attendance (user_id, date, day_of_week, check_in, check_out, work_hours, extra_hours, status)
VALUES
    ('e0000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '4 days', 'Mon', '09:02 AM', '06:05 PM', '8h 33m', '0h 33m', 'present'),
    ('e0000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '3 days', 'Tue', '08:58 AM', '06:12 PM', '8h 44m', '0h 44m', 'present'),
    ('e0000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '2 days', 'Wed', '09:15 AM', '06:00 PM', '8h 15m', '0h 15m', 'present'),
    ('e0000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '1 days', 'Thu', '09:00 AM', '05:30 PM', '8h 00m', '0h 00m', 'present')
ON CONFLICT (user_id, date) DO NOTHING;

-- Insert Sample Notifications
INSERT INTO notifications (user_id, title, message, type, read)
VALUES
    ('e0000000-0000-0000-0000-000000000002', 'Welcome to Dayflow', 'Your employee account is active and verified.', 'success', TRUE),
    ('e0000000-0000-0000-0000-000000000002', 'Payroll Cycle Updated', 'Salary structure has been verified by HR admin.', 'info', FALSE);
