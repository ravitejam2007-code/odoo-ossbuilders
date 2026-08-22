import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Play,
  Square,
  RefreshCw,
  AlertCircle,
  Info,
} from 'lucide-react';
import { useAttendanceRecords, useCheckInMutation, useCheckOutMutation } from '../../hooks/useEmployeeData';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { LoadingSpinner, Skeleton } from '../ui/Loading';
import { EmptyState } from '../ui/EmptyState';

export const AttendanceView: React.FC = () => {
  const { currentUser, checkIn, checkOut, checkInTime } = useAuth();
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [selectedPeriod, setSelectedPeriod] = useState('August 2026');

  // Query ONLY authenticated employee's attendance (Strict Privacy Isolation)
  const { data: records, isLoading, isError, refetch } = useAttendanceRecords(currentUser?.id, viewMode);

  // Server-driven mutations with double-click prevention
  const checkInMutation = useCheckInMutation(currentUser?.id);
  const checkOutMutation = useCheckOutMutation(currentUser?.id);

  const isCheckedIn = currentUser?.workStatus === 'present';
  const isMutating = checkInMutation.isPending || checkOutMutation.isPending;

  const handleCheckIn = () => {
    if (isMutating) return;
    checkInMutation.mutate(undefined, {
      onSuccess: () => {
        checkIn();
      },
    });
  };

  const handleCheckOut = () => {
    if (isMutating) return;
    checkOutMutation.mutate(undefined, {
      onSuccess: () => {
        checkOut();
      },
    });
  };

  const list = records || [];
  const countPresent = list.filter((r) => r.status === 'present').length;
  const countHalfDay = list.filter((r) => r.status === 'half_day').length;
  const countLeaves = list.filter((r) => r.status === 'on_leave').length;

  return (
    <div className="space-y-8 font-sans text-zinc-900">
      {/* Header & Page Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">My Attendance</h1>
          <p className="text-xs font-semibold text-zinc-500 mt-1">
            View your daily attendance, working hours, and session logs.
          </p>
        </div>

        {/* View Mode Toggle & Period Navigator */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Daily vs Weekly View Toggle */}
          <div className="flex bg-zinc-100 p-1 rounded-full border border-zinc-200">
            <button
              type="button"
              onClick={() => setViewMode('daily')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === 'daily'
                  ? 'bg-zinc-950 text-white shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Daily View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('weekly')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === 'weekly'
                  ? 'bg-zinc-950 text-white shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Weekly View
            </button>
          </div>

          {/* Period Selector */}
          <div className="flex items-center space-x-2 bg-white p-1.5 rounded-full border border-zinc-200 shadow-2xs">
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors"
              title="Previous Period"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 py-0.5 font-bold text-xs text-zinc-950 min-w-[100px] text-center font-mono">
              {selectedPeriod}
            </span>
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors"
              title="Next Period"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SERVER-DRIVEN CHECK-IN / CHECK-OUT ACTION BANNER */}
      <Card className="p-6 bg-white border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-950">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Today's Work Status</span>
              <h3 className="text-xl font-black text-zinc-950">
                {isCheckedIn ? 'Checked In' : 'Not Checked In'}
              </h3>
              {checkInTime && isCheckedIn && (
                <p className="text-xs font-mono font-bold text-emerald-700 mt-0.5">
                  Checked in at {checkInTime}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {!isCheckedIn ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleCheckIn}
                loading={checkInMutation.isPending}
                disabled={isMutating}
                className="w-full sm:w-auto"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                <span>Check In</span>
              </Button>
            ) : (
              <Button
                variant="destructive"
                size="md"
                onClick={handleCheckOut}
                loading={checkOutMutation.isPending}
                disabled={isMutating}
                className="w-full sm:w-auto"
              >
                <Square className="w-4 h-4 mr-2 fill-current" />
                <span>Check Out</span>
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* SUMMARY STAT PILLS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-white border-zinc-200">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Present Days</span>
          <p className="text-3xl font-black text-zinc-950 mt-1 font-mono">{countPresent} Days</p>
        </Card>

        <Card className="p-6 bg-white border-zinc-200">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Half-days Logged</span>
          <p className="text-3xl font-black text-zinc-950 mt-1 font-mono">{countHalfDay} Days</p>
        </Card>

        <Card className="p-6 bg-white border-zinc-200">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Leaves Taken</span>
          <p className="text-3xl font-black text-zinc-950 mt-1 font-mono">{countLeaves} Days</p>
        </Card>

        <Card className="p-6 bg-white border-zinc-200">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Total Work Hours</span>
          <p className="text-3xl font-black text-zinc-950 mt-1 font-mono">35:00 hrs</p>
        </Card>
      </div>

      {/* ATTENDANCE TABLE (Daily vs Weekly) */}
      <Card className="overflow-hidden bg-white border-zinc-200">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-base font-black text-zinc-950">
            {viewMode === 'daily' ? 'Daily Attendance History' : 'Weekly Attendance Breakdown'}
          </h3>
          <span className="text-xs font-bold text-zinc-700 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
            {viewMode === 'daily' ? 'Recent Entries' : 'Monthly Overview'}
          </span>
        </div>

        {/* LOADING SKELETONS */}
        {isLoading && (
          <div className="p-6 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}

        {/* ERROR STATE RECOVERY */}
        {isError && (
          <div className="p-8 text-center space-y-3 bg-rose-50/50">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
            <h4 className="text-sm font-bold text-rose-900">Failed to load attendance records</h4>
            <p className="text-xs text-rose-700">A network error occurred while fetching your attendance.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-full hover:bg-rose-700 inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Request</span>
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !isError && list.length === 0 && (
          <EmptyState
            title="No attendance records found"
            description="Attendance records for this period will appear here."
          />
        )}

        {/* TABLE DISPLAY */}
        {!isLoading && !isError && list.length > 0 && (
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
              {list.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell className="font-bold text-zinc-950 font-mono">{rec.date}</TableCell>
                  <TableCell className="font-semibold text-zinc-600">{rec.dayOfWeek || 'Weekday'}</TableCell>
                  <TableCell className="font-mono text-emerald-700 font-bold">{rec.checkIn}</TableCell>
                  <TableCell className="font-mono text-rose-700 font-bold">{rec.checkOut || '--:--'}</TableCell>
                  <TableCell className="font-mono font-bold">{rec.workHours}</TableCell>
                  <TableCell className="font-mono text-zinc-500">{rec.extraHours}</TableCell>
                  <TableCell>
                    <Badge status={rec.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* PRIVACY NOTICE */}
      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-600 text-xs flex items-center space-x-2">
        <Info className="w-4 h-4 text-zinc-950 flex-shrink-0" />
        <span>
          <strong>Privacy Boundary:</strong> Attendance records are scope-bound exclusively to your authenticated employee account.
        </span>
      </div>
    </div>
  );
};
