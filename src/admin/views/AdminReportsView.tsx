import React, { useState } from 'react';
import { Card } from '../../shared/Card';
import { Button } from '../../shared/Button';
import { Skeleton } from '../../shared/Loading';
import { Modal } from '../../shared/Modal';
import {
  useAdminReports,
  useAdminEmployees,
  useAdminPayroll,
  useAdminAttendance,
  useAdminLeaveRequests,
} from '../hooks/useAdminData';
import {
  BarChart2, TrendingUp, Users, Clock, Calendar, Download,
  ArrowRight, FileText, CheckCircle2, DollarSign
} from 'lucide-react';

export const AdminReportsView: React.FC = () => {
  const { data: reports, isLoading: loadingReports } = useAdminReports();
  const { data: employees } = useAdminEmployees();
  const { data: payroll } = useAdminPayroll();
  const { data: attendance } = useAdminAttendance();
  const { data: leaves } = useAdminLeaveRequests();

  const [activeReportModal, setActiveReportModal] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const triggerCSVDownload = (csvContent: string, fileName: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadSuccess(`Downloaded ${fileName}`);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handleDownloadAttendanceCSV = () => {
    const list = attendance || [];
    let csv = 'Employee,Date,Day,CheckIn,CheckOut,WorkHours,Status\n';
    list.forEach((r) => {
      csv += `"${r.employeeName || ''}","${r.date || ''}","${r.dayOfWeek || ''}","${r.checkIn || ''}","${r.checkOut || ''}","${r.workHours || ''}","${r.status || ''}"\n`;
    });
    triggerCSVDownload(csv, `Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleDownloadLeaveCSV = () => {
    const list = leaves || [];
    let csv = 'Employee,Department,LeaveType,StartDate,EndDate,DaysCount,Status,Reason\n';
    list.forEach((l) => {
      csv += `"${l.employeeName || ''}","${l.department || ''}","${l.leaveType || ''}","${l.startDate || ''}","${l.endDate || ''}",${l.daysCount || 0},"${l.status || ''}","${(l.reason || '').replace(/"/g, '""')}"\n`;
    });
    triggerCSVDownload(csv, `Leave_Analysis_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleDownloadPayrollCSV = () => {
    const list = (payroll || []) as any[];
    let csv = 'Employee,Email,Department,JobTitle,MonthlyGrossWage,AnnualCTC,BasicSalary,HRA,PFDeduction\n';
    list.forEach((p) => {
      const s = p.salaryInfo || {};
      csv += `"${p.name || p.employeeName || ''}","${p.email || ''}","${p.department || ''}","${p.jobTitle || ''}",${s.monthWage || p.grossSalary || 0},${s.yearlyWage || (s.monthWage || p.grossSalary || 0) * 12},${s.basicSalary || 0},${s.houseRentAllowance || 0},${s.pfContributionEmployee || 0}\n`;
    });
    triggerCSVDownload(csv, `Payroll_Summary_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleDownloadHeadcountCSV = () => {
    const list = employees || [];
    let csv = 'ID,Name,Email,Phone,Department,JobTitle,Role,WorkStatus\n';
    list.forEach((e) => {
      csv += `"${e.loginId || ''}","${e.name || ''}","${e.email || ''}","${e.phone || ''}","${e.department || ''}","${e.jobTitle || ''}","${e.role || ''}","${e.workStatus || ''}"\n`;
    });
    triggerCSVDownload(csv, `Headcount_Directory_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportAll = () => {
    handleDownloadAttendanceCSV();
    setTimeout(() => handleDownloadLeaveCSV(), 300);
    setTimeout(() => handleDownloadPayrollCSV(), 600);
    setTimeout(() => handleDownloadHeadcountCSV(), 900);
  };

  const reportsList = [
    {
      id: 'attendance',
      title: 'Attendance Summary',
      description: 'Monthly punch logs, work durations, and overtime metrics across all departments.',
      icon: Clock,
      color: '#0064e0',
      bg: '#e8f0fc',
      onDownload: handleDownloadAttendanceCSV,
    },
    {
      id: 'leave',
      title: 'Leave & Absence Analysis',
      description: 'Quota consumption by leave category, approval status, and absenteeism trends.',
      icon: Calendar,
      color: '#31a24c',
      bg: '#e6f4ea',
      onDownload: handleDownloadLeaveCSV,
    },
    {
      id: 'payroll',
      title: 'Payroll Expenditure Report',
      description: 'Total monthly salary disbursements, department cost allocations, and statutory deductions.',
      icon: TrendingUp,
      color: '#f2a918',
      bg: '#fef3c7',
      onDownload: handleDownloadPayrollCSV,
    },
    {
      id: 'headcount',
      title: 'Headcount & Staff Directory',
      description: 'Active personnel directory, departmental distributions, and employment role assignments.',
      icon: Users,
      color: '#5d6c7b',
      bg: '#f1f4f7',
      onDownload: handleDownloadHeadcountCSV,
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-[32px] sm:text-[40px] font-[600] uppercase tracking-[0.02em] leading-[1.15] text-[#0a1317]">
            Executive Reports &amp; Analytics
          </h1>
          <p className="text-[15px] font-normal leading-[1.50] tracking-[-0.16px] text-[#5d6c7b] mt-1">
            Generate, preview, and export comprehensive enterprise HR analytics
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleExportAll}>
          <Download className="w-3.5 h-3.5 mr-1" />
          <span>Export All Data</span>
        </Button>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-[12px] bg-[#e6f4ea] border border-[#31a24c]/30 text-[13px] text-[#1a7f3c] font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#31a24c] flex-shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* ── Report Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reportsList.map(({ id, title, description, icon: Icon, color, bg, onDownload }) => (
          <Card variant="feature" key={id} className="p-6 flex flex-col justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[18px] font-bold leading-[1.44] text-[#0a1317]">{title}</h3>
                <p className="text-[14px] font-normal leading-[1.43] tracking-[-0.14px] text-[#5d6c7b] mt-1">
                  {description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-[#dee3e9]">
              <Button variant="primary" size="sm" onClick={() => setActiveReportModal(id)}>
                <BarChart2 className="w-3.5 h-3.5 mr-1" />
                <span>View Summary</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={onDownload}>
                <Download className="w-3.5 h-3.5 mr-1" />
                <span>Download CSV</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Featured Live Insights Banner ──────────────────────────── */}
      <Card variant="promo" className="p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#8595a4]">Workforce Intelligence</p>
            <h3 className="text-[26px] font-[500] leading-[1.25] text-white">
              Attendance Health: {reports?.avgAttendanceRate ?? 95}% &bull; Monthly Payroll: ₹{Number(reports?.totalPayrollMonthly || 0).toLocaleString('en-IN')}
            </h3>
            <p className="text-[15px] font-normal text-[#8595a4]">
              {reports?.presentToday ?? 0} active employees present today out of {reports?.totalEmployees ?? employees?.length ?? 0} total headcount.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={handleDownloadPayrollCSV}
            className="bg-transparent border-white/40 text-white hover:bg-white/10 flex-shrink-0"
          >
            <Download className="w-4 h-4 mr-1.5" />
            <span>Export Payroll Sheet</span>
          </Button>
        </div>
      </Card>

      {/* ── Report Preview Modal ────────────────────────────────────── */}
      <Modal
        isOpen={!!activeReportModal}
        onClose={() => setActiveReportModal(null)}
        title="Report Summary Preview"
        maxWidth="lg"
      >
        <div className="space-y-4 text-[13px]">
          {activeReportModal === 'attendance' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-[#f1f4f7] rounded-[10px]">
                  <span className="text-[11px] text-[#8595a4] uppercase font-bold block">Present Today</span>
                  <span className="text-[20px] font-bold text-[#31a24c]">{reports?.presentToday ?? 0}</span>
                </div>
                <div className="p-3 bg-[#f1f4f7] rounded-[10px]">
                  <span className="text-[11px] text-[#8595a4] uppercase font-bold block">On Leave Today</span>
                  <span className="text-[20px] font-bold text-[#0064e0]">{reports?.onLeaveToday ?? 0}</span>
                </div>
                <div className="p-3 bg-[#f1f4f7] rounded-[10px]">
                  <span className="text-[11px] text-[#8595a4] uppercase font-bold block">Absent Today</span>
                  <span className="text-[20px] font-bold text-[#e41e3f]">{reports?.absentToday ?? 0}</span>
                </div>
              </div>
              <p className="text-[#5d6c7b]">
                Total recorded attendance entries: <strong className="text-[#0a1317]">{attendance?.length || 0} records</strong> in database.
              </p>
            </div>
          )}

          {activeReportModal === 'leave' && (
            <div className="space-y-3">
              <p className="text-[#5d6c7b]">
                Pending requests awaiting review: <strong className="text-[#0a1317]">{reports?.pendingLeaveRequests ?? 0}</strong>
              </p>
              <div className="p-3.5 bg-[#f1f4f7] rounded-[12px] space-y-1">
                <span className="text-[11px] font-bold uppercase text-[#8595a4]">Leave Types Configured</span>
                <p className="text-[#0a1317] font-semibold">Paid Time Off (24d quota), Sick Leave (7d quota), Unpaid Leaves</p>
              </div>
            </div>
          )}

          {activeReportModal === 'payroll' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#f1f4f7] rounded-[10px]">
                  <span className="text-[11px] text-[#8595a4] uppercase font-bold block">Total Monthly Budget</span>
                  <span className="text-[18px] font-bold font-mono text-[#0a1317]">
                    ₹{Number(reports?.totalPayrollMonthly || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-3 bg-[#f1f4f7] rounded-[10px]">
                  <span className="text-[11px] text-[#8595a4] uppercase font-bold block">Average Monthly Salary</span>
                  <span className="text-[18px] font-bold font-mono text-[#0064e0]">
                    ₹{Number(reports?.avgSalary || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeReportModal === 'headcount' && (
            <div className="space-y-3">
              <p className="text-[#5d6c7b]">
                Total Registered Personnel: <strong className="text-[#0a1317]">{employees?.length || 0} employees</strong>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Array.from(new Set(employees?.map((e) => e.department).filter(Boolean))).map((dept) => {
                  const count = employees?.filter((e) => e.department === dept).length || 0;
                  return (
                    <div key={dept} className="p-2.5 bg-[#f1f4f7] rounded-[8px]">
                      <span className="text-[11px] text-[#8595a4] block truncate">{dept}</span>
                      <span className="font-bold text-[#0a1317]">{count} members</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#dee3e9]">
            <Button variant="ghost" size="sm" onClick={() => setActiveReportModal(null)}>
              Close
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                if (activeReportModal === 'attendance') handleDownloadAttendanceCSV();
                else if (activeReportModal === 'leave') handleDownloadLeaveCSV();
                else if (activeReportModal === 'payroll') handleDownloadPayrollCSV();
                else if (activeReportModal === 'headcount') handleDownloadHeadcountCSV();
                setActiveReportModal(null);
              }}
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              <span>Download Full CSV</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
