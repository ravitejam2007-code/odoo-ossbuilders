export type UserRole = 'employee' | 'admin' | 'hr_officer';
export type WorkStatus = 'present' | 'absent' | 'half_day' | 'on_leave';
export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'on_leave';
export type LeaveType = 'Paid Time Off' | 'Sick Leave' | 'Unpaid Leaves';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface BankDetails {
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  panNo: string;
  uanNo: string;
  empCode: string;
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
}

export interface Employee {
  id: string;
  loginId: string; // Format: OIJODO20220001
  name: string;
  email: string;
  phone: string;
  company: string;
  department: string;
  jobTitle: string;
  manager: string;
  avatar: string;
  role: UserRole;
  workStatus: WorkStatus;
  joinedYear: number;
  serialNo: string;
  
  // Profile resume & private info
  about?: string;
  whatILoveAboutJob?: string;
  skills?: string[];
  certifications?: string[];
  interests?: string[];
  
  dob?: string;
  residingAddress?: string;
  nationality?: string;
  gender?: string;
  maritalStatus?: string;
  bankDetails?: BankDetails;
  salaryInfo?: SalaryInfo;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // Mon, Tue, Wed...
  checkIn: string; // HH:MM AM/PM
  checkOut?: string; // HH:MM AM/PM
  workHours: string;
  extraHours: string;
  status: AttendanceStatus;
}

export interface AttendanceSummary {
  status: WorkStatus;
  checkInTime: string | null;
  countPresent: number;
  countHalfDay: number;
  countLeave: number;
  totalWorkHours: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  status: LeaveStatus;
  attachmentName?: string;
  reason?: string;
  adminComment?: string;
  createdAt: string;
}

export interface LeaveBalance {
  paidDaysAvailable: number;
  sickDaysAvailable: number;
  unpaidDaysTaken: number;
}

export interface Payslip {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  grossSalary: number;
  netSalary: number;
  deductions: number;
  paidDays: number;
  status: 'paid' | 'draft';
  pdfUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  createdAt: string;
  read: boolean;
}
