export type WorkStatus = 'present' | 'absent' | 'half_day' | 'on_leave';
export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'on_leave';
export type LeaveType = 'Paid Time Off' | 'Sick Leave' | 'Unpaid Leaves';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface BankDetails {
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  panNo?: string;
  uanNo?: string;
  empCode?: string;
}

export interface SalaryInfo {
  monthWage: number;
  yearlyWage: number;
  basicSalary: number;
  houseRentAllowance: number;
  standardAllowance: number;
  performanceBonus: number;
  leaveTravelAllowance: number;
  fixedAllowance: number;
  pfContributionEmployee: number;
  pfContributionEmployer: number;
  professionalTax: number;
  noOfWorkingDaysPerWeek: number;
  breakTimeHours?: number;
}

export interface Employee {
  id: string;
  userId?: string;
  loginId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  department: string;
  jobTitle: string;
  manager: string;
  avatar: string;
  role?: string;
  workStatus: WorkStatus;
  joinedYear: number;
  serialNo: string;
  
  // Tab 1: Resume
  about?: string;
  whatILoveAboutJob?: string;
  skills?: string[];
  certifications?: string[];
  interests?: string[];
  
  // Tab 2: Private Info
  dob?: string;
  residingAddress?: string;
  nationality?: string;
  gender?: string;
  maritalStatus?: string;
  bankDetails?: BankDetails;
  
  // Tab 3: Salary Info
  salaryInfo?: SalaryInfo;
}

export interface AttendanceRecord {
  id: string;
  userId?: string;
  date: string;
  dayOfWeek: string;
  checkIn: string;
  checkOut?: string | null;
  workHours: string;
  extraHours: string;
  status: AttendanceStatus;
}

export interface AttendanceSummary {
  status: string;
  checkInTime?: string;
  countPresent: number;
  countHalfDay: number;
  countLeave: number;
  totalWorkHours: string;
}

export interface AttendanceResponse {
  records: AttendanceRecord[];
  summary: AttendanceSummary;
}

export interface LeaveRequest {
  id: string;
  userId?: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  status: LeaveStatus;
  reason?: string;
  attachmentName?: string;
  attachmentUrl?: string;
  adminComment?: string;
  createdAt: string;
}

export interface LeaveBalance {
  paidTimeOffDays: number;
  sickLeaveDays: number;
  unpaidLeaveDays: number;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  body?: string;
  timestamp?: string;
  createdAt?: string;
  read: boolean;
  type: 'leave' | 'attendance' | 'payroll' | 'general' | 'approval' | 'system';
}

export interface PayslipItem {
  id: string;
  month: string;
  year: number;
  grossSalary: number;
  netSalary: number;
  deductions: number;
  payableDays?: number;
  status: 'paid' | 'processed' | 'pending';
  pdfUrl?: string;
}

export interface PayrollResponse {
  salaryInfo?: SalaryInfo;
  bankDetails?: BankDetails;
  payslips?: PayslipItem[];
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: Employee;
}

export interface SignupResponse {
  userId: string;
  loginId: string;
  email: string;
  name: string;
  role: string;
  message: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any[];
  };
}
