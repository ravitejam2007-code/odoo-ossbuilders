import type {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  LeaveBalance,
  NotificationItem,
  PayslipItem,
} from '../types/api';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-101',
    loginId: 'OIJODO20220001',
    name: 'John Doe',
    email: 'john.doe@odoo.com',
    phone: '+91 98765 43210',
    company: 'Odoo India',
    department: 'Engineering',
    jobTitle: 'Senior Frontend Developer',
    manager: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    workStatus: 'present',
    joinedYear: 2022,
    serialNo: '0001',
    about: 'Senior software engineer dedicated to building scalable enterprise HR solutions.',
    whatILoveAboutJob: 'Solving architectural challenges and shipping clean production apps.',
    interests: ['Open-source', 'Chess', 'Web performance'],
    skills: ['React', 'TypeScript', 'Astro.js', 'Tailwind CSS', 'TanStack Query'],
    certifications: ['Certified Frontend Specialist 2025', 'Agile Engineering Leader'],
    dob: '1995-06-15',
    residingAddress: '42 Silicon Avenue, Tech Park',
    nationality: 'Indian',
    gender: 'Male',
    maritalStatus: 'Single',
    bankDetails: {
      accountNumber: '918237465012',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001234',
      panNo: 'ABCDE1234F',
      uanNo: '100987654321',
      empCode: 'OIJODO20220001',
    },
    salaryInfo: {
      monthWage: 50000,
      yearlyWage: 600000,
      basicSalary: 25000,
      houseRentAllowance: 12500,
      standardAllowance: 5000,
      performanceBonus: 5000,
      leaveTravelAllowance: 2500,
      fixedAllowance: 0,
      pfContributionEmployee: 3000,
      pfContributionEmployer: 3000,
      professionalTax: 200,
      noOfWorkingDaysPerWeek: 5,
      breakTimeHours: 1,
    },
  },
  {
    id: 'emp-102',
    loginId: 'OIMAAL20230002',
    name: 'Matt Alice',
    email: 'matt.alice@odoo.com',
    phone: '+91 98765 43211',
    company: 'Odoo India',
    department: 'Design',
    jobTitle: 'Lead Product Designer',
    manager: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    workStatus: 'present',
    joinedYear: 2023,
    serialNo: '0002',
    about: 'User experience designer focused on minimal enterprise aesthetics.',
    skills: ['Figma', 'UI Design', 'Design Systems'],
    dob: '1994-08-20',
    residingAddress: '88 Innovation Boulevard',
    nationality: 'Indian',
  },
  {
    id: 'emp-103',
    loginId: 'OIRASM20240003',
    name: 'Rachel Smith',
    email: 'rachel.smith@odoo.com',
    phone: '+91 98765 43212',
    company: 'Odoo India',
    department: 'Human Resources',
    jobTitle: 'HR Specialist',
    manager: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    workStatus: 'on_leave',
    joinedYear: 2024,
    serialNo: '0003',
    about: 'HR operations lead handling employee onboarding and leave approvals.',
    skills: ['HR Operations', 'Payroll Administration'],
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    date: '2026-08-22',
    dayOfWeek: 'Saturday',
    checkIn: '09:12 AM',
    checkOut: undefined,
    workHours: '04:37 hrs',
    extraHours: '00:00 hrs',
    status: 'present',
  },
  {
    id: 'att-2',
    date: '2026-08-21',
    dayOfWeek: 'Friday',
    checkIn: '09:00 AM',
    checkOut: '06:05 PM',
    workHours: '08:35 hrs',
    extraHours: '00:35 hrs',
    status: 'present',
  },
  {
    id: 'att-3',
    date: '2026-08-20',
    dayOfWeek: 'Thursday',
    checkIn: '08:55 AM',
    checkOut: '06:00 PM',
    workHours: '08:35 hrs',
    extraHours: '00:35 hrs',
    status: 'present',
  },
];

export const INITIAL_LEAVE_BALANCE: LeaveBalance = {
  paidTimeOffDays: 24,
  sickLeaveDays: 7,
  unpaidLeaveDays: 0,
};

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'leave-101',
    leaveType: 'Paid Time Off',
    startDate: '2026-08-28',
    endDate: '2026-08-30',
    daysCount: 3,
    status: 'pending',
    reason: 'Family vacation and personal errands.',
    createdAt: '2026-08-20T10:30:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Payroll Processed',
    message: 'Your monthly salary for July 2026 has been credited to your bank account.',
    timestamp: '2 hours ago',
    read: false,
    type: 'payroll',
  },
  {
    id: 'notif-2',
    title: 'Leave Approved',
    message: 'Your Sick Leave application for Aug 10 - Aug 11 was approved by HR.',
    timestamp: '1 day ago',
    read: true,
    type: 'leave',
  },
];

export const INITIAL_PAYSLIPS: PayslipItem[] = [
  {
    id: 'pay-1',
    month: 'July',
    year: 2026,
    grossSalary: 50000,
    netSalary: 46800,
    deductions: 3200,
    payableDays: 22,
    status: 'processed',
  },
  {
    id: 'pay-2',
    month: 'June',
    year: 2026,
    grossSalary: 50000,
    netSalary: 46800,
    deductions: 3200,
    payableDays: 22,
    status: 'processed',
  },
];

// Helper functions for reading dynamic persisted state
export function getPersistentEmployees(): Employee[] {
  if (typeof window === 'undefined') return INITIAL_EMPLOYEES;
  const raw = localStorage.getItem('dayflow_registered_employees');
  if (!raw) {
    localStorage.setItem('dayflow_registered_employees', JSON.stringify(INITIAL_EMPLOYEES));
    return INITIAL_EMPLOYEES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_EMPLOYEES;
  }
}

export function getPersistentAttendance(): AttendanceRecord[] {
  if (typeof window === 'undefined') return INITIAL_ATTENDANCE;
  const raw = localStorage.getItem('dayflow_attendance_records');
  if (!raw) {
    localStorage.setItem('dayflow_attendance_records', JSON.stringify(INITIAL_ATTENDANCE));
    return INITIAL_ATTENDANCE;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_ATTENDANCE;
  }
}

export function getPersistentLeaveRequests(): LeaveRequest[] {
  if (typeof window === 'undefined') return INITIAL_LEAVE_REQUESTS;
  const raw = localStorage.getItem('dayflow_leave_requests');
  if (!raw) {
    localStorage.setItem('dayflow_leave_requests', JSON.stringify(INITIAL_LEAVE_REQUESTS));
    return INITIAL_LEAVE_REQUESTS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_LEAVE_REQUESTS;
  }
}

export function savePersistentLeaveRequest(req: LeaveRequest) {
  const all = getPersistentLeaveRequests();
  const updated = [req, ...all];
  if (typeof window !== 'undefined') {
    localStorage.setItem('dayflow_leave_requests', JSON.stringify(updated));
  }
  return updated;
}

// Aliases for backwards compatibility with existing imports
export const MOCK_CURRENT_USER = INITIAL_EMPLOYEES[0];
export const MOCK_COLLEAGUES = INITIAL_EMPLOYEES;
export const MOCK_ATTENDANCE = INITIAL_ATTENDANCE;
export const MOCK_LEAVE_BALANCE = INITIAL_LEAVE_BALANCE;
export const MOCK_LEAVE_REQUESTS = INITIAL_LEAVE_REQUESTS;
export const MOCK_NOTIFICATIONS = INITIAL_NOTIFICATIONS;
export const MOCK_PAYSLIPS = INITIAL_PAYSLIPS;
