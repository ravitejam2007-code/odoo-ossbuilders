import React from 'react';
import { Card } from '../../shared/Card';
import { Badge } from '../../shared/Badge';
import { Button } from '../../shared/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../shared/Table';
import {
  Users, Clock, Calendar, DollarSign, TrendingUp,
  ArrowRight, AlertCircle, CheckCircle2
} from 'lucide-react';

const STATS = [
  { label: 'Total Employees', value: '128', delta: '+3 this month', icon: Users, color: '#0064e0', bg: '#e8f0fc' },
  { label: 'Present Today', value: '104', delta: '81% attendance', icon: Clock, color: '#31a24c', bg: '#e6f4ea' },
  { label: 'On Leave', value: '12', delta: '4 pending approval', icon: Calendar, color: '#f2a918', bg: '#fef3c7' },
  { label: 'Payroll Pending', value: '3', delta: 'Due by Aug 31', icon: DollarSign, color: '#e41e3f', bg: '#fde8ec' },
];

const PENDING_LEAVES = [
  { id: '1', employee: 'Priya Sharma', type: 'Annual Leave', from: 'Aug 25', to: 'Aug 28', days: 4, dept: 'Engineering' },
  { id: '2', employee: 'Rahul Mehta', type: 'Sick Leave', from: 'Aug 23', to: 'Aug 24', days: 2, dept: 'Design' },
  { id: '3', employee: 'Ananya Iyer', type: 'Casual Leave', from: 'Aug 26', to: 'Aug 26', days: 1, dept: 'Marketing' },
];

const RECENT_HIRES = [
  { name: 'Kavya Nair', role: 'Frontend Engineer', dept: 'Engineering', joined: 'Aug 18' },
  { name: 'Dev Patel', role: 'HR Specialist', dept: 'HR', joined: 'Aug 10' },
  { name: 'Sana Khan', role: 'UX Researcher', dept: 'Design', joined: 'Aug 2' },
];

export const AdminDashboardView: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div>
        <h1 className="font-heading text-[32px] sm:text-[40px] font-[600] uppercase tracking-[0.02em] leading-[1.15] text-[#0a1317]">
          HR Dashboard
        </h1>
        <p className="text-[15px] font-normal leading-[1.50] tracking-[-0.16px] text-[#5d6c7b] mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* ── KPI Tiles ─────────────────────────────────────────────── */}
      {/* DESIGN-meta: feature-icon-row — 4-up card-icon-feature */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, delta, icon: Icon, color, bg }) => (
          <Card variant="feature" key={label} className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#8595a4]">{label}</span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: bg }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
            </div>
            <div>
              <p className="text-[32px] font-[500] leading-[1.17] tracking-[0]" style={{ color }}>{value}</p>
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
            <h2 className="font-heading text-[20px] font-[600] uppercase tracking-[0.02em] text-[#0a1317]">
              Pending Approvals
            </h2>
            <a href="/admin/leave" className="inline-flex items-center gap-1 text-[13px] font-bold text-[#5d6c7b] hover:text-[#0a1317] transition-colors">
              All requests <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <Card variant="feature" className="overflow-hidden">
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
                {PENDING_LEAVES.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <div>
                        <p className="font-bold text-[#0a1317]">{req.employee}</p>
                        <p className="text-[12px] text-[#8595a4]">{req.dept}</p>
                      </div>
                    </TableCell>
                    <TableCell>{req.type}</TableCell>
                    <TableCell>
                      <span className="font-mono text-[12px]">{req.from} → {req.to}</span>
                    </TableCell>
                    <TableCell><span className="font-bold">{req.days}d</span></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {/* DESIGN-meta: buy-cta (cobalt) for approve action */}
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-bold bg-[#0064e0] text-white hover:bg-[#0457cb] transition-colors"
                          aria-label={`Approve leave for ${req.employee}`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Approve
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-bold bg-[#fde8ec] text-[#e41e3f] hover:bg-[#f0284a] hover:text-white transition-colors"
                          aria-label={`Reject leave for ${req.employee}`}
                        >
                          Reject
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Recent Hires (1/3) */}
        <div className="space-y-4">
          <h2 className="font-heading text-[20px] font-[600] uppercase tracking-[0.02em] text-[#0a1317]">
            Recent Hires
          </h2>
          <Card variant="feature" className="divide-y divide-[#dee3e9]">
            {RECENT_HIRES.map((hire) => (
              <div key={hire.name} className="flex items-center gap-3 p-4">
                <div className="w-9 h-9 rounded-full bg-[#0a1317] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[12px] font-bold">{hire.name.charAt(0)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-[#0a1317] truncate">{hire.name}</p>
                  <p className="text-[12px] font-normal text-[#5d6c7b] truncate">{hire.role} · {hire.dept}</p>
                </div>
                <span className="text-[12px] font-bold text-[#8595a4] flex-shrink-0">{hire.joined}</span>
              </div>
            ))}
            <div className="p-4">
              <a href="/admin/employees" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0a1317] hover:underline">
                View all employees <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>

          {/* Payroll alert */}
          <div className="flex items-start gap-3 p-4 rounded-[16px] bg-[#fef3c7] border border-[#f7b928]/30">
            <AlertCircle className="w-4 h-4 text-[#92570c] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[14px] font-bold text-[#0a1317]">Payroll Due</p>
              <p className="text-[13px] font-normal text-[#92570c] mt-0.5">
                3 payslips pending processing for August.
              </p>
              <a href="/admin/payroll" className="inline-flex items-center gap-1 text-[13px] font-bold text-[#0a1317] mt-2 hover:underline">
                Process now <ArrowRight className="w-3 h-3" />
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
          <Button variant="primary" size="md" onClick={() => window.location.href = '/admin/employees/new'}>
            <Users className="w-4 h-4" />
            Add Employee
          </Button>
          <Button variant="secondary" size="md" onClick={() => window.location.href = '/admin/leave'}>
            <Calendar className="w-4 h-4" />
            Review Leave
          </Button>
          <Button variant="ghost" size="md" onClick={() => window.location.href = '/admin/payroll'}>
            <DollarSign className="w-4 h-4" />
            Process Payroll
          </Button>
          <Button variant="ghost" size="md" onClick={() => window.location.href = '/admin/reports'}>
            <TrendingUp className="w-4 h-4" />
            Run Report
          </Button>
        </div>
      </div>
    </div>
  );
};
