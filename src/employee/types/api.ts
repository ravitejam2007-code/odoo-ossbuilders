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
  breakTimeHours: number;
}

export interface Employee {
  id: string;
  loginId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  department: string;
  jobTitle: string;
  manager: string;
  avatar: string;
  workStatus: WorkStatus;
  joinedYear: number;
  serialNo: string;
  
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
  date: string;
  dayOfWeek: string;
  checkIn: string;
  checkOut?: string;
  workHours: string;
  extraHours: string;
  status: AttendanceStatus;
}

export interface LeaveRequest {
  id: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  status: LeaveStatus;
  attachmentName?: string;
  reason?: string;
  createdAt: string;
}

export interface LeaveBalance {
  paidTimeOffDays: number;
  sickLeaveDays: number;
  unpaidLeaveDays: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'leave' | 'attendance' | 'payroll' | 'general';
}

export interface PayslipItem {
  id: string;
  month: string;
  year: number;
  grossSalary: number;
  netSalary: number;
  deductions: number;
  payableDays: number;
  status: 'paid' | 'processed';
  pdfUrl?: string;
}
