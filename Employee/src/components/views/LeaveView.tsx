import React, { useState } from 'react';
import { Plus, CalendarDays, CheckCircle2, Clock, FileText, Filter, AlertCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { useLeaveRequests, useLeaveBalance } from '../../hooks/useEmployeeData';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { LoadingSpinner, Skeleton } from '../ui/Loading';
import { EmptyState } from '../ui/EmptyState';
import type { LeaveStatus } from '../../types/api';

export const LeaveView: React.FC = () => {
  const { currentUser } = useAuth();
  const { data: requests, isLoading, isError, refetch } = useLeaveRequests(currentUser?.id);
  const { data: balance } = useLeaveBalance(currentUser?.id);

  const [statusFilter, setStatusFilter] = useState<'all' | LeaveStatus>('all');

  const list = requests || [];

  const filteredRequests = list.filter((req) => {
    if (statusFilter === 'all') return true;
    return req.status === statusFilter;
  });

  return (
    <div className="space-y-8 font-sans text-zinc-900">
      {/* Header & New Leave Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">Time Off & Leave</h1>
          <p className="text-xs font-semibold text-zinc-500 mt-1">
            View available leave balances, request status, and submit time off applications.
          </p>
        </div>

        <a href="/leave/new">
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-2" />
            <span>Request Time Off</span>
          </Button>
        </a>
      </div>

      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6 bg-white border-zinc-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Paid Time Off</span>
              <p className="text-3xl font-black text-zinc-950 mt-1 font-mono">{balance?.paidDaysAvailable || 24} Days Available</p>
            </div>
            <CalendarDays className="w-8 h-8 text-zinc-400" />
          </div>
        </Card>

        <Card className="p-6 bg-white border-zinc-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Sick Leave</span>
              <p className="text-3xl font-black text-zinc-950 mt-1 font-mono">{balance?.sickDaysAvailable || 7} Days Available</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-zinc-400" />
          </div>
        </Card>

        <Card className="p-6 bg-white border-zinc-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Unpaid Days Taken</span>
              <p className="text-3xl font-black text-zinc-950 mt-1 font-mono">{balance?.unpaidDaysTaken || 0} Days</p>
            </div>
            <Clock className="w-8 h-8 text-zinc-400" />
          </div>
        </Card>
      </div>

      {/* Request Filter Tabs & Table */}
      <Card className="overflow-hidden bg-white border-zinc-200">
        <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-base font-black text-zinc-950">Leave History & Requests</h3>

          {/* Filter Status Tabs */}
          <div className="flex items-center space-x-1 bg-zinc-100 p-1 rounded-full border border-zinc-200">
            {[
              { key: 'all', label: 'All Requests' },
              { key: 'pending', label: 'Pending' },
              { key: 'approved', label: 'Approved' },
              { key: 'rejected', label: 'Rejected' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key as any)}
                className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                  statusFilter === tab.key
                    ? 'bg-zinc-950 text-white shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING SKELETONS */}
        {isLoading && (
          <div className="p-6 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}

        {/* ERROR STATE */}
        {isError && (
          <div className="p-8 text-center space-y-3 bg-rose-50/50">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
            <h4 className="text-sm font-bold text-rose-900">Failed to load leave requests</h4>
            <p className="text-xs text-rose-700">A network error occurred while fetching your time off history.</p>
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
        {!isLoading && !isError && filteredRequests.length === 0 && (
          <EmptyState
            title="No leave requests found"
            description="You haven't submitted any leave requests matching this filter."
            actionLabel="Request Time Off"
            onAction={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/leave/new';
              }
            }}
          />
        )}

        {/* TABLE DISPLAY */}
        {!isLoading && !isError && filteredRequests.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason / Remarks</TableHead>
                <TableHead>Admin Decision</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-bold text-zinc-950 font-mono">{req.startDate}</TableCell>
                  <TableCell className="font-bold text-zinc-950 font-mono">{req.endDate}</TableCell>
                  <TableCell className="font-semibold text-zinc-950">{req.leaveType}</TableCell>
                  <TableCell className="font-mono font-bold">{req.daysCount} Days</TableCell>
                  <TableCell className="text-xs text-zinc-600 max-w-xs truncate">
                    {req.reason || '--'}
                  </TableCell>
                  <TableCell className="text-xs text-zinc-500 max-w-xs">
                    {req.adminComment ? (
                      <span className="flex items-center gap-1 text-zinc-900 font-medium italic">
                        <MessageSquare className="w-3 h-3 text-zinc-950 flex-shrink-0" />
                        <span className="truncate">{req.adminComment}</span>
                      </span>
                    ) : (
                      <span className="text-zinc-400">Awaiting review</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge status={req.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};
