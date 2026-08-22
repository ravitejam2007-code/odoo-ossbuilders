import React, { useState } from 'react';
import { Search, Filter, Building2, User, Phone, Mail, RefreshCw, AlertCircle, Clock, Play, Square, Calendar } from 'lucide-react';
import { useColleagues } from '../../hooks/useEmployeeData';
import { useAuth } from '../../context/AuthContext';
import { IDCardFlip } from '../ui/IDCardFlip';
import { Modal } from '../ui/Modal';
import { Skeleton } from '../ui/Loading';
import { EmptyState } from '../ui/EmptyState';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { ProfileQuickCard } from '../dashboard/ProfileQuickCard';
import { AttendanceQuickCard } from '../dashboard/AttendanceQuickCard';
import { LeaveRequestsQuickCard } from '../dashboard/LeaveRequestsQuickCard';
import { RecentActivityFeed } from '../dashboard/RecentActivityFeed';
import type { Employee } from '../../types/api';

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

  // Dummy weekly attendance logs for view-only modal
  const sampleWeeklyLogs = [
    { date: '2026-08-18', day: 'Mon', checkIn: '09:02 AM', checkOut: '06:05 PM', hours: '08:30 hrs', status: 'present' },
    { date: '2026-08-19', day: 'Tue', checkIn: '09:15 AM', checkOut: '06:10 PM', hours: '08:25 hrs', status: 'present' },
    { date: '2026-08-20', day: 'Wed', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '08:30 hrs', status: 'present' },
    { date: '2026-08-21', day: 'Thu', checkIn: '--:--', checkOut: '--:--', hours: '00:00 hrs', status: 'on_leave' },
    { date: '2026-08-22', day: 'Fri', checkIn: '09:12 AM', checkOut: '06:00 PM', hours: '08:18 hrs', status: 'present' },
  ];

  return (
    <div className="space-y-6 font-sans text-zinc-900">
      {/* Welcome Header */}
      {currentUser && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
              Good morning, {currentUser.name.split(' ')[0]}
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              {currentUser.jobTitle} &bull; {currentUser.department} ({currentUser.company})
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Badge status={currentUser.workStatus} className="text-xs px-3 py-1" />
          </div>
        </div>
      )}

      {/* Attendance Action Widget */}
      {currentUser && (
        <Card className="p-5 bg-white border-zinc-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="p-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-950">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-zinc-950">
                    {isCheckedIn ? 'Checked In' : 'Not Checked In'}
                  </h3>
                  {checkInTime && isCheckedIn && (
                    <span className="text-xs font-mono text-emerald-700 font-semibold">
                      ({checkInTime})
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {isCheckedIn ? 'Session active · Work Duration: 04:37 hrs (Expected: 08:00 hrs)' : 'Regular shift: 09:00 AM – 06:00 PM'}
                </p>
              </div>
            </div>

            <div className="w-full sm:w-auto">
              {!isCheckedIn ? (
                <Button variant="primary" size="md" onClick={checkIn} className="w-full sm:w-auto">
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  <span>Check In</span>
                </Button>
              ) : (
                <Button variant="destructive" size="md" onClick={checkOut} className="w-full sm:w-auto">
                  <Square className="w-4 h-4 mr-2 fill-current" />
                  <span>Check Out</span>
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Quick Access Cards */}
      {currentUser && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <ProfileQuickCard employee={currentUser} />
          <AttendanceQuickCard />
          <LeaveRequestsQuickCard />
        </div>
      )}

      {/* Directory & Side Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2 space-y-5">
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-zinc-950 tracking-tight">Team Directory</h2>
              <p className="text-xs text-zinc-500">Colleague status and attendance info</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <div className="relative w-full sm:w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search team..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-medium placeholder:text-zinc-400 focus:border-zinc-950 outline-none"
                />
              </div>

              <div className="relative w-full sm:w-32">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-medium text-zinc-950 appearance-none cursor-pointer outline-none focus:border-zinc-950"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Loading Skeletons */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Skeleton className="h-56 w-full rounded-2xl" />
              <Skeleton className="h-56 w-full rounded-2xl" />
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2">
              <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
              <h4 className="text-sm font-bold text-rose-900">Failed to load directory</h4>
              <button
                type="button"
                onClick={() => refetch()}
                className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Directory Grid */}
          {!isLoading && !isError && filtered.length === 0 ? (
            <EmptyState
              title="No employees found"
              description="Adjust your search or filter."
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchTerm('');
                setSelectedDept('All');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filtered.map((employee) => (
                <IDCardFlip
                  key={employee.id}
                  employee={employee}
                  onClick={() => setViewEmployee(employee)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div>
          <RecentActivityFeed />
        </div>
      </div>

      {/* Employee Info Modal */}
      <Modal
        isOpen={!!viewEmployee}
        onClose={() => setViewEmployee(null)}
        title="Employee Details"
        maxWidth="lg"
      >
        {viewEmployee && (
          <div className="space-y-5">
            <div className="flex items-center space-x-3.5 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
              <img
                src={viewEmployee.avatar}
                alt={viewEmployee.name}
                className="w-14 h-14 rounded-xl object-cover border border-zinc-200"
              />
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-zinc-950">{viewEmployee.name}</h3>
                  <Badge status={viewEmployee.workStatus} />
                </div>
                <p className="text-xs text-zinc-600">{viewEmployee.jobTitle}</p>
                <p className="font-mono text-xs text-zinc-400 font-semibold">{viewEmployee.loginId}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-zinc-200 space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Department</span>
                <p className="font-semibold text-zinc-950">{viewEmployee.department} ({viewEmployee.company})</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-zinc-200 space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Manager</span>
                <p className="font-semibold text-zinc-950">{viewEmployee.manager}</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-zinc-200 space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Email</span>
                <p className="font-medium text-zinc-950 truncate">{viewEmployee.email}</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-zinc-200 space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Phone</span>
                <p className="font-medium text-zinc-950">{viewEmployee.phone}</p>
              </div>
            </div>

            {/* Weekly Attendance */}
            <div className="space-y-2 pt-2 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Weekly Attendance Log</span>
                </h4>
              </div>

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
                  {sampleWeeklyLogs.map((log) => (
                    <TableRow key={log.date}>
                      <TableCell className="font-mono text-xs font-semibold text-zinc-950">{log.date}</TableCell>
                      <TableCell className="text-xs text-zinc-600">{log.day}</TableCell>
                      <TableCell className="font-mono text-xs text-emerald-700 font-semibold">{log.checkIn}</TableCell>
                      <TableCell className="font-mono text-xs text-rose-700 font-semibold">{log.checkOut}</TableCell>
                      <TableCell className="font-mono text-xs font-semibold">{log.hours}</TableCell>
                      <TableCell>
                        <Badge status={log.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
