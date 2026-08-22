import React, { useState } from 'react';
import { useAttendanceHistory } from '../hooks/useEmployeeData';
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
  const { currentUser, checkIn, checkOut, checkInTime } = useAuth();
  const { data: records, isLoading, isError, refetch } = useAttendanceHistory();
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const isCheckedIn = currentUser?.workStatus === 'present';

  const navigateMonth = (dir: number) => {
    const d = new Date(year, month + dir);
    setMonth(d.getMonth());
    setYear(d.getFullYear());
  };

  const summary = {
    present: records?.filter((r) => r.status === 'present').length ?? 0,
    absent:  records?.filter((r) => r.status === 'absent').length ?? 0,
    leave:   records?.filter((r) => r.status === 'on_leave').length ?? 0,
    halfDay: records?.filter((r) => r.status === 'half_day').length ?? 0,
  };

  return (
    <div className="space-y-8">
      {/* ── Page Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#0a1317] tracking-tight leading-tight">
            Attendance
          </h1>
          <p className="text-[14px] text-[#5d6c7b] mt-1 font-normal">
            Track your daily check-in and check-out history
          </p>
        </div>
        <Button variant="ghost" size="sm">
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* ── Today's Status Card ───────────────────────────────────── */}
      <Card variant="feature" className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[12px] bg-[#f1f4f7] flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-[#0a1317]" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#8595a4]">Today</p>
              <h2 className="text-[18px] font-bold leading-[1.44] text-[#0a1317]">
                {isCheckedIn ? 'Session active' : 'Not checked in'}
              </h2>
              <p className="text-[14px] font-normal text-[#5d6c7b] mt-0.5">
                {isCheckedIn
                  ? `Checked in at ${checkInTime}`
                  : 'Regular shift: 09:00 AM – 06:00 PM'}
              </p>
            </div>
          </div>

          {/* DESIGN-meta: buy-cta cobalt for check-in action */}
          <div className="flex gap-3 w-full sm:w-auto">
            {!isCheckedIn ? (
              <Button variant="buy-cta" size="md" onClick={checkIn} className="w-full sm:w-auto">
                <Play className="w-4 h-4 fill-current" />
                <span>Check In</span>
              </Button>
            ) : (
              <Button variant="destructive" size="md" onClick={checkOut} className="w-full sm:w-auto">
                <Square className="w-4 h-4 fill-current" />
                <span>Check Out</span>
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* ── Month Summary Tiles ───────────────────────────────────── */}
      {/* DESIGN-meta: feature-icon-row — 4-up card-icon-feature */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Present', value: summary.present, color: '#31a24c', bg: '#e6f4ea' },
          { label: 'Absent', value: summary.absent, color: '#e41e3f', bg: '#fde8ec' },
          { label: 'Leave Days', value: summary.leave, color: '#5d6c7b', bg: '#f1f4f7' },
          { label: 'Half-day', value: summary.halfDay, color: '#92570c', bg: '#fef3c7' },
        ].map(({ label, value, color, bg }) => (
          <Card variant="feature" key={label} className="p-5 flex flex-col gap-1">
            <span
              className="text-[28px] font-[500] leading-[1.17] tracking-[0]"
              style={{ color }}
            >
              {isLoading ? '—' : value}
            </span>
            <span className="text-[14px] font-normal leading-[1.43] text-[#5d6c7b]">{label}</span>
            <div className="mt-2 h-1 rounded-full" style={{ backgroundColor: bg }}>
              <div
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  backgroundColor: color,
                  width: isLoading ? '0%' : `${Math.min((value / 22) * 100, 100)}%`,
                }}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* ── Attendance Log Table ──────────────────────────────────── */}
      <div>
        {/* Month Navigator */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[20px] font-[500] leading-[1.25] text-[#0a1317] tracking-[0]">
            {MONTHS[month]} {year}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigateMonth(-1)}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-[#dee3e9] bg-[#ffffff] hover:bg-[#f1f4f7] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1876f2]"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4 text-[#1c1e21]" />
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-[#dee3e9] bg-[#ffffff] hover:bg-[#f1f4f7] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1876f2]"
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

          {!isLoading && !isError && (!records || records.length === 0) && (
            <EmptyState
              title="No records found"
              description="No attendance data available for this month."
            />
          )}

          {!isLoading && !isError && records && records.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((rec) => (
                  <TableRow key={rec.date}>
                    <TableCell>
                      <span className="font-mono text-[13px]">{rec.date}</span>
                    </TableCell>
                    <TableCell>{rec.dayOfWeek || new Date(rec.date).toLocaleDateString('en', { weekday: 'short' })}</TableCell>
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
                        {rec.workHours ? `${rec.workHours} hrs` : '—'}
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

        {/* Monthly target progress */}
        {!isLoading && records && records.length > 0 && (
          <div className="mt-4 flex items-center gap-3 p-4 rounded-[12px] bg-[#f1f4f7]">
            <TrendingUp className="w-4 h-4 text-[#31a24c] flex-shrink-0" />
            <p className="text-[14px] font-normal text-[#5d6c7b]">
              <span className="font-bold text-[#0a1317]">{summary.present} of 22</span> working days completed this month.{' '}
              On track for full attendance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
