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
  breakTimeHours: number;
}

export interface AdminEmployee {
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
  role: UserRole;
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

export interface AdminAttendance {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  date: string;
  dayOfWeek: string;
  checkIn: string;
  checkOut?: string;
  workHours: string;
  extraHours: string;
  status: AttendanceStatus;
}

export interface AdminLeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
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

export interface AdminPayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  month: string;
  year: number;
  grossSalary: number;
  basicSalary: number;
  hra: number;
  deductions: number;
  netSalary: number;
  payableDays: number;
  totalDaysInMonth: number;
  status: 'paid' | 'draft' | 'processed';
}

export interface AdminReportSummary {
  totalEmployees: number;
  presentToday: number;
  onLeaveToday: number;
  absentToday: number;
  pendingLeaveRequests: number;
  monthlyPayrollBudget: number;
  departmentCounts: Record<string, number>;
}
