-- =============================================================================
-- Dayflow HRMS Seed Data (supabase/seed.sql)
-- =============================================================================

-- 1. Insert Admin User (Password: Admin@1234, Login ID: OIADMI20220001)
INSERT INTO users (id, login_id, email, password_hash, role, email_verified, company_name)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'OIADMI20220001',
    'admin@dayflow.internal',
    '$2b$10$fS0x7z91fC8gE9H.O4o0i.hPjH3F9qO7W3zX.iM4c7vN9jK5k6yv2',
    'admin',
    TRUE,
    'Odoo Inc'
) ON CONFLICT (email) DO NOTHING;

-- Admin Profile
INSERT INTO profiles (
    user_id, name, phone, company, department, job_title, manager, avatar, avatar_url, work_status, joined_year, serial_no,
    about, skills, bank_details, salary_info
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Admin User',
    '+1 (555) 019-2834',
    'Odoo Inc',
    'Human Resources',
    'HR Administrator',
    'Executive Board',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'present',
    2022,
    '0001',
    'System Administrator managing HR and payroll systems.',
    '["HR Management", "Payroll Administration", "Talent Acquisition"]'::JSONB,
    '{"accountNumber": "112233445566", "bankName": "Silicon Valley Bank", "ifscCode": "SVBL0001234", "panNo": "ADM123456Z", "uanNo": "998877665544", "empCode": "OIADMI20220001"}'::JSONB,
    '{"monthWage": 120000, "yearlyWage": 1440000, "basicSalary": 60000, "houseRentAllowance": 30000, "standardAllowance": 8000, "performanceBonus": 12000, "leaveTravelAllowance": 5000, "fixedAllowance": 5000, "pfContributionEmployee": 7200, "pfContributionEmployer": 7200, "professionalTax": 200, "noOfWorkingDaysPerWeek": 5}'::JSONB
) ON CONFLICT (user_id) DO NOTHING;

-- Admin Leave Balance
INSERT INTO leave_balances (user_id, paid_days_available, sick_days_available, unpaid_days_taken)
VALUES ('a0000000-0000-0000-0000-000000000001', 30, 10, 0)
ON CONFLICT (user_id) DO NOTHING;

-- 2. Insert Initial Employee: John Doe (Login ID: OIJODO20220001, Password: Password@1234)
INSERT INTO users (id, login_id, email, password_hash, role, email_verified, company_name)
VALUES (
    'e0000000-0000-0000-0000-000000000002',
    'OIJODO20220001',
    'john.doe@company.com',
    '$2b$10$NIqqJGthKBymbuRtRVwZlO7d2aXmXnZ2Kk/eL0C6Ym6iN7yZpM8.u',
    'employee',
    TRUE,
    'Odoo Inc'
) ON CONFLICT (email) DO NOTHING;

-- Employee Profile
INSERT INTO profiles (
    user_id, name, phone, company, department, job_title, manager, avatar, avatar_url, work_status, joined_year, serial_no,
    about, what_i_love_about_job, skills, certifications, interests, dob, residing_address, nationality, gender, marital_status,
    bank_details, salary_info
) VALUES (
    'e0000000-0000-0000-0000-000000000002',
    'John Doe',
    '+91 98765 43210',
    'Odoo Inc',
    'Engineering',
    'Associate Engineer',
    'Admin User',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    'present',
    2022,
    '0001',
    'Fullstack software engineer specialized in building scalable React and Node.js enterprise applications.',
    'Collaborating with innovative teams and solving challenging architectural puzzles.',
    '["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "Docker", "Git"]'::JSONB,
    '["AWS Certified Solutions Architect", "Meta Certified Frontend Developer"]'::JSONB,
    '["Open Source", "System Design", "Running", "Chess"]'::JSONB,
    '1995-04-14',
    '742 Evergreen Terrace, Sector 4, Silicon Valley, CA 94025',
    'Indian',
    'Male',
    'Single',
    '{"accountNumber": "98765432109876", "bankName": "HDFC Bank", "ifscCode": "HDFC0001234", "panNo": "ABCDE1234F", "uanNo": "100987654321", "empCode": "OIJODO20220001"}'::JSONB,
    '{"monthWage": 65000, "yearlyWage": 780000, "basicSalary": 32500, "houseRentAllowance": 16250, "standardAllowance": 4000, "performanceBonus": 5000, "leaveTravelAllowance": 3000, "fixedAllowance": 4250, "pfContributionEmployee": 3900, "pfContributionEmployer": 3900, "professionalTax": 200, "noOfWorkingDaysPerWeek": 5}'::JSONB
) ON CONFLICT (user_id) DO NOTHING;

-- Employee Leave Balance
INSERT INTO leave_balances (user_id, paid_days_available, sick_days_available, unpaid_days_taken)
VALUES ('e0000000-0000-0000-0000-000000000002', 24, 7, 0)
ON CONFLICT (user_id) DO NOTHING;

-- Initial Notification
INSERT INTO notifications (user_id, title, message, type, read)
VALUES (
    'e0000000-0000-0000-0000-000000000002',
    'Welcome to Dayflow HRMS',
    'Your employee profile has been configured. Your Login ID is OIJODO20220001.',
    'info',
    FALSE
);
