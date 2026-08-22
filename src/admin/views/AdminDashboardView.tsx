import React, { useState } from 'react';
import { Card } from '../../shared/Card';
import { Badge } from '../../shared/Badge';
import { Button } from '../../shared/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../shared/Table';
import { Skeleton } from '../../shared/Loading';
import { EmptyState } from '../../shared/EmptyState';
import {
  useAdminReports,
  useAdminLeaveRequests,
  useAdminEmployees,
  useApproveLeave,
  useRejectLeave,
} from '../hooks/useAdminData';
import {
  Users, Clock, Calendar, DollarSign, TrendingUp,
  ArrowRight, AlertCircle, CheckCircle2, XCircle, RefreshCw
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { data: reports, isLoading: loadingReports, refetch: refetchReports } = useAdminReports();
  const { data: pendingLeaves, isLoading: loadingLeaves, refetch: refetchLeaves } = useAdminLeaveRequests('pending');
  const { data: employees, isLoading: loadingEmployees } = useAdminEmployees();

  const approveMutation = useApproveLeave();
  const rejectMutation = useRejectLeave();

  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  const totalEmployees = reports?.totalEmployees ?? (employees?.length || 0);
  const presentToday = reports?.presentToday ?? 0;
  const onLeaveToday = reports?.onLeaveToday ?? 0;
  const pendingCount = reports?.pendingLeaveRequests ?? (pendingLeaves?.length || 0);

  const stats = [
    {
      label: 'Total Employees',
      value: String(totalEmployees),
      delta: `${employees?.filter((e) => e.workStatus === 'present').length || presentToday} active on shift`,
      icon: Users,
      color: '#0064e0',
      bg: '#e8f0fc',
    },
    {
      label: 'Present Today',
      value: String(presentToday),
      delta: `${totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 100}% attendance rate`,
      icon: Clock,
      color: '#31a24c',
      bg: '#e6f4ea',
    },
    {
      label: 'On Leave',
      value: String(onLeaveToday),
      delta: `${pendingCount} pending approvals`,
      icon: Calendar,
      color: '#f2a918',
      bg: '#fef3c7',
    },
    {
      label: 'Monthly Payroll',
      value: reports?.totalPayrollMonthly ? `₹${Number(reports.totalPayrollMonthly).toLocaleString('en-IN')}` : '₹0',
      delta: `Avg ₹${Number(reports?.avgSalary || 0).toLocaleString('en-IN')} / emp`,
      icon: DollarSign,
      color: '#0a1317',
      bg: '#f1f4f7',
    },
  ];

  const handleApprove = async (id: string) => {
    setMutatingId(id);
    setActionError(null);
    try {
      await approveMutation.mutateAsync({ id, comment: 'Approved by HR Administrator' });
      setActionSuccess('Leave request approved and attendance synchronized!');
      setTimeout(() => setActionSuccess(null), 4000);
      await refetchLeaves();
      await refetchReports();
    } catch (err: any) {
      setActionError(err.message || 'Failed to approve leave request.');
      setTimeout(() => setActionError(null), 4000);
    } finally {
      setMutatingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setMutatingId(id);
    setActionError(null);
    try {
      await rejectMutation.mutateAsync({ id, comment: 'Application rejected by HR Administrator' });
      setActionSuccess('Leave request rejected.');
      setTimeout(() => setActionSuccess(null), 4000);
      await refetchLeaves();
      await refetchReports();
    } catch (err: any) {
      setActionError(err.message || 'Failed to reject leave request.');
      setTimeout(() => setActionError(null), 4000);
    } finally {
      setMutatingId(null);
    }
  };

  const pendingList = pendingLeaves || [];
  const recentHiresList = employees?.slice(0, 4) || [];

  return (
    <div className="space-y-8 font-sans">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-[32px] sm:text-[40px] font-[600] uppercase tracking-[0.02em] leading-[1.15] text-[#0a1317]">
            HR Executive Dashboard
          </h1>
          <p className="text-[15px] font-normal leading-[1.50] tracking-[-0.16px] text-[#5d6c7b] mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} &bull; Real-time workforce metrics
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-[12px] bg-[#e6f4ea] border border-[#31a24c]/30 text-[13px] text-[#1a7f3c] font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#31a24c] flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 rounded-[12px] bg-[#fde8ec] border border-[#f0284a]/20 text-[13px] text-[#c0122e] font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#e41e3f] flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* ── KPI Tiles ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, delta, icon: Icon, color, bg }) => (
          <Card variant="feature" key={label} className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#8595a4]">{label}</span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
            </div>
            <div>
              <p className="text-[32px] font-[500] leading-[1.17] tracking-[0]" style={{ color }}>
                {loadingReports ? '—' : value}
              </p>
              <p className="text-[13px] font-normal text-[#5d6c7b] mt-0.5">{delta}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Main Grid: Pending Approvals + Activity ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Leave Approvals (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-[20px] font-[600] uppercase tracking-[0.02em] text-[#0a1317]">
                Pending Leave Approvals
              </h2>
              {pendingList.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#92570c] text-[12px] font-bold">
                  {pendingList.length} Action Needed
                </span>
              )}
            </div>
            <a href="/admin/leave" className="inline-flex items-center gap-1 text-[13px] font-bold text-[#5d6c7b] hover:text-[#0a1317] transition-colors">
              All requests <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <Card variant="feature" className="overflow-hidden">
            {loadingLeaves ? (
              <div className="p-4 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-[8px]" />
                ))}
              </div>
            ) : pendingList.length === 0 ? (
              <div className="p-6 text-center">
                <EmptyState
                  title="No Pending Approvals"
                  description="All employee time-off requests have been reviewed."
                  icon={<CheckCircle2 className="w-5 h-5 text-[#31a24c]" />}
                />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingList.slice(0, 5).map((req) => {
                    const isBusy = mutatingId === req.id;
                    return (
                      <TableRow key={req.id}>
                        <TableCell>
                          <div>
                            <p className="font-bold text-[#0a1317]">{req.employeeName}</p>
                            <p className="text-[12px] text-[#8595a4]">{req.department}</p>
                          </div>
                        </TableCell>
                        <TableCell>{req.leaveType}</TableCell>
                        <TableCell>
                          <span className="font-mono text-[12px]">{req.startDate} → {req.endDate}</span>
                        </TableCell>
                        <TableCell><span className="font-bold">{req.daysCount}d</span></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleApprove(req.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-bold bg-[#0064e0] text-white hover:bg-[#0457cb] disabled:opacity-50 transition-colors cursor-pointer"
                              aria-label={`Approve leave for ${req.employeeName}`}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              {isBusy ? 'Syncing...' : 'Approve'}
                            </button>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleReject(req.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-bold bg-[#fde8ec] text-[#e41e3f] hover:bg-[#f0284a] hover:text-white disabled:opacity-50 transition-colors cursor-pointer"
                              aria-label={`Reject leave for ${req.employeeName}`}
                            >
                              Reject
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>

        {/* Recent Directory Hires (1/3) */}
        <div className="space-y-4">
          <h2 className="font-heading text-[20px] font-[600] uppercase tracking-[0.02em] text-[#0a1317]">
            Active Team Members
          </h2>
          <Card variant="feature" className="divide-y divide-[#dee3e9]">
            {loadingEmployees ? (
              <div className="p-4 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 rounded-[8px]" />
                ))}
              </div>
            ) : recentHiresList.length === 0 ? (
              <div className="p-4 text-center text-[13px] text-[#5d6c7b]">No employees registered yet.</div>
            ) : (
              recentHiresList.map((hire) => (
                <div key={hire.id} className="flex items-center gap-3 p-4">
                  <img
                    src={hire.avatar}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover border border-[#dee3e9] flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-[#0a1317] truncate">{hire.name}</p>
                    <p className="text-[12px] font-normal text-[#5d6c7b] truncate">{hire.jobTitle} · {hire.department}</p>
                  </div>
                  <Badge status={hire.workStatus} />
                </div>
              ))
            )}
            <div className="p-4">
              <a href="/admin/employees" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0a1317] hover:underline">
                View all employees <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>

          {/* Quick status summary */}
          <div className="flex items-start gap-3 p-4 rounded-[16px] bg-[#f1f4f7] border border-[#dee3e9]">
            <TrendingUp className="w-4 h-4 text-[#0064e0] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[14px] font-bold text-[#0a1317]">Operations Summary</p>
              <p className="text-[13px] font-normal text-[#5d6c7b] mt-0.5">
                {presentToday} checked in &bull; {totalEmployees} active personnel in system.
              </p>
              <a href="/admin/attendance" className="inline-flex items-center gap-1 text-[13px] font-bold text-[#0064e0] mt-2 hover:underline">
                View attendance logs <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions Row ─────────────────────────────────────── */}
      <div>
        <h2 className="text-[20px] font-[500] leading-[1.25] text-[#0a1317] tracking-[0] mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="md" onClick={() => window.location.href = '/admin/employees'}>
            <Users className="w-4 h-4" />
            Manage Employees
          </Button>
          <Button variant="secondary" size="md" onClick={() => window.location.href = '/admin/leave'}>
            <Calendar className="w-4 h-4" />
            Review Leaves ({pendingCount})
          </Button>
          <Button variant="ghost" size="md" onClick={() => window.location.href = '/admin/payroll'}>
            <DollarSign className="w-4 h-4" />
            View Payroll Breakdown
          </Button>
          <Button variant="ghost" size="md" onClick={() => window.location.href = '/admin/reports'}>
            <TrendingUp className="w-4 h-4" />
            Executive Reports
          </Button>
        </div>
      </div>
    </div>
  );
};
