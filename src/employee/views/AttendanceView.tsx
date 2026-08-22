import React, { useState } from 'react';
import { useAttendanceHistory, useCheckInMutation, useCheckOutMutation } from '../hooks/useEmployeeData';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../../shared/Badge';
import { Card } from '../../shared/Card';
import { Button } from '../../shared/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../shared/Table';
import { Skeleton } from '../../shared/Loading';
import { EmptyState } from '../../shared/EmptyState';
import {
  Clock, Play, Square, ChevronLeft, ChevronRight,
  TrendingUp, AlertCircle, RefreshCw, Download
} from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const AttendanceView: React.FC = () => {
  const { currentUser: authUser, checkInTime: authCheckInTime, refreshCurrentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [actionError, setActionError] = useState('');

  const monthNumber = selectedDate.getMonth() + 1;
  const monthString = `${selectedDate.getFullYear()}-${String(monthNumber).padStart(2, '0')}`;

  const { data: attendanceData, isLoading, isError, refetch } = useAttendanceHistory(monthString);
  const checkInMutation = useCheckInMutation();
  const checkOutMutation = useCheckOutMutation();

  const records = attendanceData?.records || [];
  const summary = attendanceData?.summary || {
    countPresent: 0,
    countLeave: 0,
    countHalfDay: 0,
    countAbsent: 0,
    totalWorkHours: '0h 0m',
    status: 'absent' as const,
    checkInTime: undefined,
  };
  const isCheckedIn =
    summary?.status === 'present' || authUser?.workStatus === 'present';

  const displayCheckInTime =
    authCheckInTime ||
    summary?.checkInTime ||
    records.find((r) => r.status === 'present')?.checkIn ||
    '09:00 AM';

  const handleCheckIn = async () => {
    setActionError('');
    try {
      await checkInMutation.mutateAsync();
      await refreshCurrentUser();
      await refetch();
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
      await refetch();
    } catch (err: any) {
      setActionError(err.message || 'Check out failed');
      setTimeout(() => setActionError(''), 4000);
    }
  };

  const navigateMonth = (dir: number) => {
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + dir);
      return next;
    });
  };

  return (
    <div className="space-y-8 font-sans">
      {/* ── Page Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#0a1317] tracking-tight leading-tight">
            Attendance Management
          </h1>
          <p className="text-[14px] text-[#5d6c7b] mt-1 font-normal">
            Track your daily punch in/out timestamps, monthly work hours, and overtime
          </p>
        </div>
      </div>

      {/* ── Today's Status Card ───────────────────────────────────── */}
      <Card variant="feature" className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[12px] bg-[#f1f4f7] flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-[#0a1317]" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#8595a4]">Today's Status</p>
              <h2 className="text-[18px] font-bold leading-[1.44] text-[#0a1317]">
                {isCheckedIn ? 'Work Session Active' : 'Not Checked In'}
              </h2>
              <p className="text-[14px] font-normal text-[#5d6c7b] mt-0.5">
                {isCheckedIn
                  ? `Checked in at ${displayCheckInTime} &bull; Total Month: ${summary?.totalWorkHours || '0h 0m'}`
                  : 'Regular shift: 09:00 AM – 06:00 PM'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end gap-3 w-full sm:w-auto">
            {actionError && (
              <span className="text-[12px] text-[#e41e3f] font-semibold">{actionError}</span>
            )}
            {!isCheckedIn ? (
              <Button
                variant="buy-cta"
                size="md"
                loading={checkInMutation.isPending}
                onClick={handleCheckIn}
                className="w-full sm:w-auto"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Check In (Punch In)</span>
              </Button>
            ) : (
              <Button
                variant="destructive"
                size="md"
                loading={checkOutMutation.isPending}
                onClick={handleCheckOut}
                className="w-full sm:w-auto"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Check Out (Punch Out)</span>
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* ── Month Summary Tiles ───────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Present Days', value: summary.countPresent, color: '#31a24c', bg: '#e6f4ea' },
          { label: 'Leave Days', value: summary.countLeave, color: '#0064e0', bg: '#e8f0fc' },
          { label: 'Half-days', value: summary.countHalfDay, color: '#92570c', bg: '#fef3c7' },
          { label: 'Total Hours', value: summary.totalWorkHours || '0h 0m', color: '#0a1317', bg: '#f1f4f7', isString: true },
        ].map(({ label, value, color, bg, isString }) => (
          <Card variant="feature" key={label} className="p-5 flex flex-col gap-1">
            <span
              className="text-[28px] font-[500] leading-[1.17] tracking-[0]"
              style={{ color }}
            >
              {isLoading ? '—' : value}
            </span>
            <span className="text-[14px] font-normal leading-[1.43] text-[#5d6c7b]">{label}</span>
            {!isString && (
              <div className="mt-2 h-1 rounded-full" style={{ backgroundColor: bg }}>
                <div
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: color,
                    width: isLoading ? '0%' : `${Math.min(((Number(value) || 0) / 22) * 100, 100)}%`,
                  }}
                />
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* ── Attendance Log Table ──────────────────────────────────── */}
      <div>
        {/* Month Navigator */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[20px] font-[500] leading-[1.25] text-[#0a1317] tracking-[0]">
            {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()} Records
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigateMonth(-1)}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-[#dee3e9] bg-[#ffffff] hover:bg-[#f1f4f7] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1876f2] cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4 text-[#1c1e21]" />
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-[#dee3e9] bg-[#ffffff] hover:bg-[#f1f4f7] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1876f2] cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4 text-[#1c1e21]" />
            </button>
          </div>
        </div>

        {/* Table */}
        <Card variant="feature" className="overflow-hidden">
          {isLoading && (
            <div className="p-4 space-y-3">
              <Skeleton className="h-10 rounded-[8px]" />
              <Skeleton className="h-10 rounded-[8px]" />
              <Skeleton className="h-10 rounded-[8px]" />
            </div>
          )}

          {isError && (
            <div className="p-8 flex flex-col items-center gap-3 text-center">
              <AlertCircle className="w-6 h-6 text-[#e41e3f]" />
              <p className="text-[14px] font-bold text-[#0a1317]">Failed to load attendance records</p>
              <Button variant="ghost" size="sm" onClick={() => refetch()}>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </Button>
            </div>
          )}

          {!isLoading && !isError && records.length === 0 && (
            <EmptyState
              title="No attendance records found"
              description={`No logs available for ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}.`}
            />
          )}

          {!isLoading && !isError && records.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Work Hours</TableHead>
                  <TableHead>Extra Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((rec) => (
                  <TableRow key={rec.id || rec.date}>
                    <TableCell>
                      <span className="font-mono text-[13px]">{rec.date}</span>
                    </TableCell>
                    <TableCell>{rec.dayOfWeek || '—'}</TableCell>
                    <TableCell>
                      <span className="font-mono text-[13px] font-bold text-[#31a24c]">
                        {rec.checkIn || '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-[13px] font-bold text-[#e41e3f]">
                        {rec.checkOut || '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-[13px] font-bold text-[#0a1317]">
                        {rec.workHours || '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-[13px] font-bold text-[#5d6c7b]">
                        {rec.extraHours || '0h 0m'}
                      </span>
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

        {/* Progress summary banner */}
        {!isLoading && records.length > 0 && (
          <div className="mt-4 flex items-center gap-3 p-4 rounded-[12px] bg-[#f1f4f7]">
            <TrendingUp className="w-4 h-4 text-[#31a24c] flex-shrink-0" />
            <p className="text-[14px] font-normal text-[#5d6c7b]">
              <span className="font-bold text-[#0a1317]">{summary.countPresent} days</span> completed in {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()} &bull; Total accumulated work duration: <span className="font-bold text-[#0a1317]">{summary.totalWorkHours}</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
