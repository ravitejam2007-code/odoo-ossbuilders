import React, { useState } from 'react';
import {
  useCurrentUser,
  useColleagues,
  useAttendanceHistory,
  useCheckInMutation,
  useCheckOutMutation,
  useLeaveBalance,
  usePayroll,
  useNotifications,
} from '../hooks/useEmployeeData';
import { useAuth } from '../context/AuthContext';
import { IDCardFlip } from '../../shared/IDCardFlip';
import { Modal } from '../../shared/Modal';
import { Skeleton } from '../../shared/Loading';
import { EmptyState } from '../../shared/EmptyState';
import { Badge } from '../../shared/Badge';
import { Button } from '../../shared/Button';
import { Card } from '../../shared/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../shared/Table';
import {
  Play,
  Square,
  Clock,
  Calendar,
  DollarSign,
  Bell,
  Search,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  UserCheck,
} from 'lucide-react';
import type { Employee } from '../types/api';

export const DashboardView: React.FC = () => {
  const { currentUser: authUser, checkInTime: authCheckInTime, refreshCurrentUser } = useAuth();
  const { data: profileUser } = useCurrentUser();
  const currentUser = profileUser || authUser;

  const { data: colleagues, isLoading: loadingColleagues } = useColleagues();
  const { data: attendanceData, isLoading: loadingAttendance, refetch: refetchAttendance } = useAttendanceHistory();
  const { data: leaveBalance } = useLeaveBalance();
  const { data: payrollData } = usePayroll();
  const { data: notifications } = useNotifications();

  const checkInMutation = useCheckInMutation();
  const checkOutMutation = useCheckOutMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [actionError, setActionError] = useState('');

  const attendanceSummary = attendanceData?.summary;
  const attendanceRecords = attendanceData?.records || [];

  const isCheckedIn =
    attendanceSummary?.status === 'present' || currentUser?.workStatus === 'present';

  const displayCheckInTime =
    authCheckInTime ||
    attendanceSummary?.checkInTime ||
    attendanceRecords.find((r) => r.status === 'present')?.checkIn ||
    '09:00 AM';

  const handleCheckIn = async () => {
    setActionError('');
    try {
      await checkInMutation.mutateAsync();
      await refreshCurrentUser();
      await refetchAttendance();
    } catch (err: any) {
      setActionError(err.message || 'Check in failed');
      setTimeout(() => setActionError(''), 4000);
    }
  };

  const handleCheckOut = async () => {
    setActionError('');
    try {
      await checkOutMutation.mutateAsync();
      await refreshCurrentUser();
      await refetchAttendance();
    } catch (err: any) {
      setActionError(err.message || 'Check out failed');
      setTimeout(() => setActionError(''), 4000);
    }
  };

  const list = colleagues || [];
  const filtered = list.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.loginId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const departments = ['All', ...Array.from(new Set(list.map((e) => e.department).filter(Boolean)))];

  const totalPaidDaysLeft = leaveBalance?.paidTimeOffDays ?? 24;
  const latestPayslip = payrollData?.payslips?.[0];
  const netPayDisplay = latestPayslip ? `₹${Number(latestPayslip.netSalary).toLocaleString('en-IN')} Net` : 'View Payroll';
  const unreadNotifsCount = notifications?.filter((n) => !n.read).length ?? 0;

  if (!currentUser) return null;

  return (
    <div className="space-y-8 font-sans">
      {/* ── Welcome Section ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#0a1317] tracking-[-0.02em] leading-tight">
            Good morning, {currentUser.name?.split(' ')[0] || 'Employee'}
          </h1>
          <p className="text-[14px] text-[#5d6c7b] mt-1 font-normal">
            {currentUser.jobTitle} &bull; {currentUser.department} &bull; {currentUser.company}
          </p>
        </div>
        <Badge status={currentUser.workStatus} showIcon />
      </div>

      {/* ── Attendance Action Card ────────────────────────────────── */}
      <Card variant="feature" className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[12px] bg-[#f1f4f7] flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-[#0a1317]" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-[#0a1317]">
                {isCheckedIn ? 'Work Session Active' : 'Not Checked In'}
              </h2>
              <p className="text-[13px] text-[#5d6c7b] mt-0.5">
                {isCheckedIn
                  ? `Checked in at ${displayCheckInTime} &bull; Total Month: ${attendanceSummary?.totalWorkHours || '—'}`
                  : 'Regular work shift: 09:00 AM – 06:00 PM'}
              </p>
            </div>
          </div>

          {actionError && (
            <div className="w-full p-2.5 rounded-[8px] bg-[#fde8ec] border border-[#f0284a]/20 text-[12px] text-[#c0122e] font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#e41e3f] flex-shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {!isCheckedIn ? (
            <Button
              variant="buy-cta"
              size="md"
              loading={checkInMutation.isPending}
              onClick={handleCheckIn}
              className="w-full sm:w-auto flex-shrink-0"
            >
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>Check In (Punch In)</span>
            </Button>
          ) : (
            <Button
              variant="destructive"
              size="md"
              loading={checkOutMutation.isPending}
              onClick={handleCheckOut}
              className="w-full sm:w-auto flex-shrink-0"
            >
              <Square className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>Check Out (Punch Out)</span>
            </Button>
          )}
        </div>
      </Card>

      {/* ── 3-Up Quick Access Feature Tiles ───────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a href="/leave" className="group block focus-visible:outline-none">
          <Card variant="feature" className="p-5 h-full flex flex-col justify-between group-hover:border-[#ced0d4] group-hover:shadow-[rgba(20,22,26,0.08)_0px_4px_16px_0px] transition-all">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center bg-[#e8f0fc]">
                <Calendar className="w-5 h-5 text-[#0064e0]" />
              </div>
              <ArrowRight className="w-4 h-4 text-[#8595a4] group-hover:text-[#0a1317] group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8595a4]">Time Off Balance</p>
              <p className="text-[18px] font-semibold text-[#0a1317] mt-0.5 tracking-tight">{totalPaidDaysLeft} Paid Days Left</p>
              <p className="text-[12px] text-[#5d6c7b] mt-0.5">{leaveBalance?.sickLeaveDays ?? 7} Sick Days Available</p>
            </div>
          </Card>
        </a>

        <a href="/payroll" className="group block focus-visible:outline-none">
          <Card variant="feature" className="p-5 h-full flex flex-col justify-between group-hover:border-[#ced0d4] group-hover:shadow-[rgba(20,22,26,0.08)_0px_4px_16px_0px] transition-all">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center bg-[#e6f4ea]">
                <DollarSign className="w-5 h-5 text-[#31a24c]" />
              </div>
              <ArrowRight className="w-4 h-4 text-[#8595a4] group-hover:text-[#0a1317] group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8595a4]">Latest Payslip</p>
              <p className="text-[18px] font-semibold text-[#0a1317] mt-0.5 tracking-tight">{netPayDisplay}</p>
              <p className="text-[12px] text-[#5d6c7b] mt-0.5">{latestPayslip ? `${latestPayslip.month} ${latestPayslip.year} · Processed` : 'Salary Breakdown'}</p>
            </div>
          </Card>
        </a>

        <a href="/notifications" className="group block focus-visible:outline-none">
          <Card variant="feature" className="p-5 h-full flex flex-col justify-between group-hover:border-[#ced0d4] group-hover:shadow-[rgba(20,22,26,0.08)_0px_4px_16px_0px] transition-all">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center bg-[#fef3c7]">
                <Bell className="w-5 h-5 text-[#f2a918]" />
              </div>
              <ArrowRight className="w-4 h-4 text-[#8595a4] group-hover:text-[#0a1317] group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8595a4]">Notifications</p>
              <p className="text-[18px] font-semibold text-[#0a1317] mt-0.5 tracking-tight">{unreadNotifsCount} Unread</p>
              <p className="text-[12px] text-[#5d6c7b] mt-0.5">Time off, attendance & payslip updates</p>
            </div>
          </Card>
        </a>
      </div>

      {/* ── Main Layout: Attendance / Directory & Side Panels ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Monthly Attendance Records */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-[20px] font-semibold text-[#0a1317] tracking-tight">
                Recent Attendance Logs
              </h2>
              <p className="text-[13px] text-[#5d6c7b]">
                {attendanceSummary?.countPresent ?? 0} days present this month &bull; Total {attendanceSummary?.totalWorkHours || '0h 0m'}
              </p>
            </div>
            <a href="/attendance">
              <Button variant="ghost" size="sm">
                <span>View Full Log &rarr;</span>
              </Button>
            </a>
          </div>

          <Card variant="feature" className="overflow-hidden">
            {loadingAttendance ? (
              <div className="p-4 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 rounded-[8px]" />
                ))}
              </div>
            ) : attendanceRecords.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  title="No Attendance Logs Yet"
                  description="Punch in today to record your first attendance check-in."
                  icon={<Clock className="w-5 h-5 text-[#8595a4]" />}
                />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Work Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.slice(0, 5).map((rec) => (
                    <TableRow key={rec.id || rec.date}>
                      <TableCell className="font-mono text-[12px]">{rec.date}</TableCell>
                      <TableCell>{rec.dayOfWeek || '—'}</TableCell>
                      <TableCell className="font-mono text-[#31a24c] font-bold text-[12px]">
                        {rec.checkIn || '—'}
                      </TableCell>
                      <TableCell className="font-mono text-[#e41e3f] font-bold text-[12px]">
                        {rec.checkOut || '—'}
                      </TableCell>
                      <TableCell className="font-mono font-bold text-[12px]">
                        {rec.workHours || '—'}
                      </TableCell>
                      <TableCell>
                        <Badge status={rec.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>

          {/* Directory section if colleagues are available */}
          {list.length > 0 && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-semibold text-[#0a1317]">Team Directory</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8595a4]" />
                  <input
                    type="text"
                    placeholder="Search colleagues…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 h-8 rounded-full bg-[#f1f4f7] text-[12px] text-[#1c1e21] placeholder:text-[#8595a4] border-0 outline-none focus:ring-2 focus:ring-[#1876f2] w-36 sm:w-44"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filtered.slice(0, 4).map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => setViewEmployee(emp)}
                    className="p-3 rounded-[12px] bg-[#ffffff] border border-[#dee3e9] hover:border-[#ced0d4] transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#dee3e9] flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[#0a1317] truncate">{emp.name}</p>
                        <p className="text-[11px] text-[#5d6c7b] truncate">{emp.jobTitle}</p>
                      </div>
                    </div>
                    <Badge status={emp.workStatus} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Digital ID Card & Activity */}
        <div className="space-y-6">
          <div>
            <h2 className="text-[20px] font-semibold text-[#0a1317] tracking-tight mb-3">
              Digital Badge ID
            </h2>
            <IDCardFlip employee={currentUser} />
          </div>

          <Card variant="feature" className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-[#0a1317]">
                Recent Notifications
              </h3>
              <a href="/notifications" className="text-[12px] font-semibold text-[#5d6c7b] hover:text-[#0a1317]">
                View All &rarr;
              </a>
            </div>

            {notifications && notifications.length > 0 ? (
              <div className="space-y-2.5">
                {notifications.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 rounded-[12px] bg-[#f1f4f7]">
                    <div className="w-8 h-8 rounded-full bg-[#ffffff] border border-[#dee3e9] flex items-center justify-center flex-shrink-0">
                      <Bell className="w-3.5 h-3.5 text-[#0a1317]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold leading-[1.43] text-[#0a1317]">{item.title}</p>
                      <p className="text-[12px] text-[#5d6c7b] mt-0.5 line-clamp-1">{item.message || item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-[12px] text-[#5d6c7b]">
                No recent notifications
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ── Employee Detail Modal ──────────────────────────────────── */}
      <Modal
        isOpen={!!viewEmployee}
        onClose={() => setViewEmployee(null)}
        title="Employee Details"
        maxWidth="lg"
      >
        {viewEmployee && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-[16px] bg-[#f1f4f7] border border-[#dee3e9]">
              <img
                src={viewEmployee.avatar}
                alt={viewEmployee.name}
                className="w-14 h-14 rounded-full object-cover border border-[#dee3e9] shadow-xs"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-[17px] font-semibold text-[#0a1317]">
                    {viewEmployee.name}
                  </h3>
                  <Badge status={viewEmployee.workStatus} />
                </div>
                <p className="text-[13px] font-medium text-[#5d6c7b] mt-0.5">{viewEmployee.jobTitle}</p>
                <p className="text-[11px] font-bold text-[#8595a4] font-mono mt-0.5">ID: {viewEmployee.loginId}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
              {[
                { label: 'Department', value: `${viewEmployee.department} (${viewEmployee.company})` },
                { label: 'Manager', value: viewEmployee.manager || '—' },
                { label: 'Email', value: viewEmployee.email },
                { label: 'Phone', value: viewEmployee.phone || '—' },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-[12px] bg-[#ffffff] border border-[#dee3e9]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8595a4]">{label}</p>
                  <p className="text-[13px] font-semibold text-[#0a1317] mt-1 truncate">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
