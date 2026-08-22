import React, { useState } from 'react';
import { useColleagues } from '../hooks/useEmployeeData';
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
  Play, Square, Clock, Calendar, DollarSign,
  Bell, Search, ArrowRight, AlertCircle, RefreshCw
} from 'lucide-react';
import type { Employee } from '../types/api';

export const DashboardView: React.FC = () => {
  const { currentUser, checkIn, checkOut, checkInTime } = useAuth();
  const { data: colleagues, isLoading, isError, refetch } = useColleagues();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);

  const isCheckedIn = currentUser?.workStatus === 'present';
  const list = colleagues || [];

  const filtered = list.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.loginId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const departments = ['All', ...Array.from(new Set(list.map((e) => e.department)))];

  const weeklyLogs = [
    { date: '2026-08-18', day: 'Mon', checkIn: '09:02 AM', checkOut: '06:05 PM', hours: '08:30', status: 'present' },
    { date: '2026-08-19', day: 'Tue', checkIn: '09:15 AM', checkOut: '06:10 PM', hours: '08:25', status: 'present' },
    { date: '2026-08-20', day: 'Wed', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '08:30', status: 'present' },
    { date: '2026-08-21', day: 'Thu', checkIn: '—', checkOut: '—', hours: '00:00', status: 'on_leave' },
    { date: '2026-08-22', day: 'Fri', checkIn: '09:12 AM', checkOut: '—', hours: '04:37', status: 'present' },
  ];

  const recentActivity = [
    { id: 1, text: 'Checked in at 09:12 AM', time: 'Today', icon: Clock },
    { id: 2, text: 'July payslip processed — ₹46,800', time: 'Yesterday', icon: DollarSign },
    { id: 3, text: 'Sick leave approved (2 days)', time: 'Aug 12', icon: Calendar },
  ];

  if (!currentUser) return null;

  return (
    <div className="space-y-8 font-sans">
      {/* ── Welcome Section ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#0a1317] tracking-[-0.02em] leading-tight">
            Good morning, {currentUser.name.split(' ')[0]}
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
                {isCheckedIn ? 'Session Active' : 'Not Checked In'}
              </h2>
              <p className="text-[13px] text-[#5d6c7b] mt-0.5">
                {isCheckedIn
                  ? `Started at ${checkInTime} &bull; 04:37 hrs elapsed &bull; Expected 08:00 hrs`
                  : 'Regular shift: 09:00 AM – 06:00 PM'}
              </p>
            </div>
          </div>

          {!isCheckedIn ? (
            <Button variant="buy-cta" size="md" onClick={checkIn} className="w-full sm:w-auto flex-shrink-0">
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>Check In</span>
            </Button>
          ) : (
            <Button variant="destructive" size="md" onClick={checkOut} className="w-full sm:w-auto flex-shrink-0">
              <Square className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>Check Out</span>
            </Button>
          )}
        </div>
      </Card>

      {/* ── 3-Up Quick Access Feature Tiles ───────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Time Off Balance', value: '14 Days Left', sub: '2 requests pending approval', href: '/leave', icon: Calendar, color: '#0064e0', bg: '#e8f0fc' },
          { label: 'Latest Payslip', value: '₹46,800 Net', sub: 'July 2026 · Processed', href: '/payroll', icon: DollarSign, color: '#31a24c', bg: '#e6f4ea' },
          { label: 'Notifications', value: '3 Unread', sub: 'Leave approval & payslip updates', href: '/notifications', icon: Bell, color: '#f2a918', bg: '#fef3c7' },
        ].map(({ label, value, sub, href, icon: Icon, color, bg }) => (
          <a key={label} href={href} className="group block focus-visible:outline-none">
            <Card variant="feature" className="p-5 h-full flex flex-col justify-between group-hover:border-[#ced0d4] group-hover:shadow-[rgba(20,22,26,0.08)_0px_4px_16px_0px] transition-all">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: bg }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <ArrowRight className="w-4 h-4 text-[#8595a4] group-hover:text-[#0a1317] group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8595a4]">{label}</p>
                <p className="text-[18px] font-semibold text-[#0a1317] mt-0.5 tracking-tight">{value}</p>
                <p className="text-[12px] text-[#5d6c7b] mt-0.5">{sub}</p>
              </div>
            </Card>
          </a>
        ))}
      </div>

      {/* ── Main Layout: Directory & Side Panels ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Team Directory */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-[20px] font-semibold text-[#0a1317] tracking-tight">
                Team Directory
              </h2>
              <p className="text-[13px] text-[#5d6c7b]">Colleague status and contact details</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8595a4]" />
                <input
                  type="text"
                  placeholder="Search directory…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 h-9 rounded-full bg-[#f1f4f7] text-[13px] text-[#1c1e21] placeholder:text-[#8595a4] border-0 outline-none focus:ring-2 focus:ring-[#1876f2] w-40 sm:w-48"
                />
              </div>

              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="h-9 px-3 rounded-full bg-[#f1f4f7] text-[12px] font-semibold text-[#1c1e21] border-0 outline-none focus:ring-2 focus:ring-[#1876f2]"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <Card variant="feature" className="p-4 sm:p-5">
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-[12px]" />
                ))}
              </div>
            )}

            {isError && (
              <div className="p-8 flex flex-col items-center gap-3 text-center">
                <AlertCircle className="w-6 h-6 text-[#e41e3f]" />
                <p className="text-[14px] font-semibold text-[#0a1317]">Failed to load directory</p>
                <Button variant="ghost" size="sm" onClick={() => refetch()}>
                  <RefreshCw className="w-3.5 h-3.5" /> Retry
                </Button>
              </div>
            )}

            {!isLoading && !isError && filtered.length === 0 && (
              <EmptyState title="No employees found" description="Try adjusting your search query or department filter." />
            )}

            {!isLoading && !isError && filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filtered.map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => setViewEmployee(emp)}
                    className="p-3 rounded-[12px] bg-[#ffffff] border border-[#dee3e9] hover:border-[#ced0d4] hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#dee3e9] flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-[#0a1317] truncate group-hover:text-[#0064e0] transition-colors">
                          {emp.name}
                        </p>
                        <p className="text-[12px] text-[#5d6c7b] truncate">{emp.jobTitle}</p>
                        <p className="text-[11px] text-[#8595a4]">{emp.department}</p>
                      </div>
                    </div>
                    <Badge status={emp.workStatus} />
                  </div>
                ))}
              </div>
            )}
          </Card>
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
                Recent Activity
              </h3>
              <a href="/notifications" className="text-[12px] font-semibold text-[#5d6c7b] hover:text-[#0a1317]">
                View All &rarr;
              </a>
            </div>

            <div className="space-y-2.5">
              {recentActivity.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="flex items-start gap-3 p-3 rounded-[12px] bg-[#f1f4f7]">
                    <div className="w-8 h-8 rounded-full bg-[#ffffff] border border-[#dee3e9] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-[#0a1317]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold leading-[1.43] text-[#0a1317]">{item.text}</p>
                      <p className="text-[11px] font-normal text-[#8595a4] mt-0.5">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Employee Detail Modal (Clean & Compact) ────────────────── */}
      <Modal
        isOpen={!!viewEmployee}
        onClose={() => setViewEmployee(null)}
        title="Employee Details"
        maxWidth="lg"
      >
        {viewEmployee && (
          <div className="space-y-4">
            {/* Header info card */}
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

            {/* Details 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
              {[
                { label: 'Department', value: `${viewEmployee.department} (${viewEmployee.company})` },
                { label: 'Manager', value: viewEmployee.manager },
                { label: 'Email', value: viewEmployee.email },
                { label: 'Phone', value: viewEmployee.phone },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-[12px] bg-[#ffffff] border border-[#dee3e9]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8595a4]">{label}</p>
                  <p className="text-[13px] font-semibold text-[#0a1317] mt-1 truncate">{value}</p>
                </div>
              ))}
            </div>

            {/* Weekly Attendance Section */}
            <div className="space-y-2 pt-2">
              <h4 className="text-[14px] font-semibold text-[#0a1317]">
                Weekly Attendance
              </h4>
              <div className="rounded-[12px] border border-[#dee3e9] overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Day</TableHead>
                      <TableHead>In</TableHead>
                      <TableHead>Out</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weeklyLogs.map((log) => (
                      <TableRow key={log.date}>
                        <TableCell className="font-mono text-[12px]">{log.date}</TableCell>
                        <TableCell>{log.day}</TableCell>
                        <TableCell className="font-mono text-[#31a24c] font-bold text-[12px]">{log.checkIn}</TableCell>
                        <TableCell className="font-mono text-[#e41e3f] font-bold text-[12px]">{log.checkOut}</TableCell>
                        <TableCell className="font-mono font-bold text-[12px]">{log.hours} hrs</TableCell>
                        <TableCell><Badge status={log.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
