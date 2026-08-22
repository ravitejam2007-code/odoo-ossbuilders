-- =============================================================================
-- Dayflow HRMS PostgreSQL / Supabase Schema (Migration: 20260822000001)
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users Table (Core Auth & Credentials)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    login_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. OIJODO20220001
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'employee', -- 'employee' | 'admin' | 'hr_officer'
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    company_name VARCHAR(100) DEFAULT 'Dayflow',
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Profiles Table (Employee Personal, Professional & Banking Info)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) DEFAULT '',
    company VARCHAR(100) DEFAULT 'Dayflow',
    department VARCHAR(100) DEFAULT 'Engineering',
    job_title VARCHAR(100) DEFAULT 'Associate Engineer',
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    manager VARCHAR(255) DEFAULT 'System Admin',
    avatar TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    work_status VARCHAR(50) NOT NULL DEFAULT 'present', -- 'present' | 'absent' | 'half_day' | 'on_leave'
    date_joined DATE DEFAULT CURRENT_DATE,
    joined_year INT DEFAULT 2026,
    serial_no VARCHAR(50) DEFAULT '0001',
    about TEXT DEFAULT '',
    what_i_love_about_job TEXT DEFAULT '',
    skills JSONB DEFAULT '["React", "TypeScript", "Node.js"]'::JSONB,
    certifications JSONB DEFAULT '[]'::JSONB,
    interests JSONB DEFAULT '[]'::JSONB,
    dob VARCHAR(50) DEFAULT '',
    residing_address TEXT DEFAULT '',
    nationality VARCHAR(100) DEFAULT 'Indian',
    gender VARCHAR(50) DEFAULT '',
    marital_status VARCHAR(50) DEFAULT 'Single',
    bank_details JSONB DEFAULT '{
        "accountNumber": "",
        "bankName": "",
        "ifscCode": "",
        "panNo": "",
        "uanNo": "",
        "empCode": ""
    }'::JSONB,
    salary_info JSONB DEFAULT '{
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
    }'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Attendance Table (Daily Punch In/Out Logs)
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    day_of_week VARCHAR(20) NOT NULL, -- 'Mon', 'Tue', etc.
    check_in VARCHAR(20), -- '09:00 AM'
    check_out VARCHAR(20), -- '06:00 PM'
    check_in_time TIME,
    check_out_time TIME,
    work_hours VARCHAR(20) DEFAULT '0h 0m',
    extra_hours VARCHAR(20) DEFAULT '0h 0m',
    status VARCHAR(50) NOT NULL DEFAULT 'present', -- 'present' | 'absent' | 'half_day' | 'on_leave'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_attendance_date UNIQUE (user_id, date)
);

-- 4. Leave Balances Table (Paid, Sick, Unpaid Quotas)
CREATE TABLE IF NOT EXISTS leave_balances (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    paid_days_available INT NOT NULL DEFAULT 24,
    sick_days_available INT NOT NULL DEFAULT 7,
    unpaid_days_taken INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Leave Requests Table
CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    leave_type VARCHAR(50) NOT NULL, -- 'Paid Time Off' | 'Sick Leave' | 'Unpaid Leaves'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_count NUMERIC(5, 1) NOT NULL DEFAULT 1.0,
    reason TEXT DEFAULT '',
    attachment_name VARCHAR(255) DEFAULT '',
    attachment_url TEXT DEFAULT '',
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    admin_comment TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Salary Structures Table
CREATE TABLE IF NOT EXISTS salary_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    month_wage NUMERIC(12, 2) NOT NULL DEFAULT 0,
    yearly_wage NUMERIC(12, 2) NOT NULL DEFAULT 0,
    basic_salary NUMERIC(12, 2) NOT NULL DEFAULT 0,
    house_rent_allowance NUMERIC(12, 2) NOT NULL DEFAULT 0,
    standard_allowance NUMERIC(12, 2) NOT NULL DEFAULT 0,
    performance_bonus NUMERIC(12, 2) NOT NULL DEFAULT 0,
    leave_travel_allowance NUMERIC(12, 2) NOT NULL DEFAULT 0,
    fixed_allowance NUMERIC(12, 2) NOT NULL DEFAULT 0,
    pf_employee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    pf_employer NUMERIC(12, 2) NOT NULL DEFAULT 0,
    pf_contribution_employee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    pf_contribution_employer NUMERIC(12, 2) NOT NULL DEFAULT 0,
    professional_tax NUMERIC(12, 2) NOT NULL DEFAULT 0,
    no_of_working_days_per_week INT NOT NULL DEFAULT 5,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Payslips Table (Monthly Salary Slips)
CREATE TABLE IF NOT EXISTS payslips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    month VARCHAR(20) NOT NULL,
    year INT NOT NULL,
    gross_salary NUMERIC(12, 2) NOT NULL DEFAULT 0,
    net_salary NUMERIC(12, 2) NOT NULL DEFAULT 0,
    deductions NUMERIC(12, 2) NOT NULL DEFAULT 0,
    paid_days INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'paid', -- 'paid' | 'draft'
    pdf_url TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info', -- 'info' | 'success' | 'warning' | 'alert'
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Documents Table (Identity & Medical Files)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Database Indexes
CREATE INDEX IF NOT EXISTS idx_users_login_id ON users(login_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON attendance(user_id, date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_user ON leave_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read);

-- 11. Supabase Storage Buckets Setup
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('avatars', 'avatars', true),
    ('attachments', 'attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Avatars') THEN
        CREATE POLICY "Public Read Avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth Users Upload Avatars') THEN
        CREATE POLICY "Auth Users Upload Avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth Users Upload Attachments') THEN
        CREATE POLICY "Auth Users Upload Attachments" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'attachments');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth Users Read Attachments') THEN
        CREATE POLICY "Auth Users Read Attachments" ON storage.objects FOR SELECT USING (bucket_id = 'attachments');
    END IF;
END $$;
