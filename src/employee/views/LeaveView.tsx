import React, { useState } from 'react';
import { useLeaveRequests } from '../hooks/useEmployeeData';
import { Badge } from '../../shared/Badge';
import { Card } from '../../shared/Card';
import { Button } from '../../shared/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../shared/Table';
import { Skeleton } from '../../shared/Loading';
import { EmptyState } from '../../shared/EmptyState';
import { Plus, Calendar, AlertCircle, RefreshCw, Download } from 'lucide-react';

const LEAVE_TYPES = [
  { type: 'Annual Leave', used: 6, total: 21, color: '#0064e0', bg: '#e8f0fc' },
  { type: 'Sick Leave', used: 3, total: 10, color: '#31a24c', bg: '#e6f4ea' },
  { type: 'Casual Leave', used: 1, total: 7, color: '#5d6c7b', bg: '#f1f4f7' },
  { type: 'Compensatory', used: 0, total: 3, color: '#8595a4', bg: '#f1f4f7' },
];

export const LeaveView: React.FC = () => {
  const { data: leaveRecords, isLoading, isError, refetch } = useLeaveRequests();

  return (
    <div className="space-y-8">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#0a1317] tracking-tight leading-tight">
            Time Off
          </h1>
          <p className="text-[14px] text-[#5d6c7b] mt-1 font-normal">
            Leave balance, allocation records, and requests
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </Button>
          {/* DESIGN-meta: primary (black pill) for primary page action */}
          <Button variant="primary" size="md" onClick={() => window.location.href = '/leave/new'}>
            <Plus className="w-4 h-4" />
            <span>New Request</span>
          </Button>
        </div>
      </div>

      {/* ── Leave Balance Cards ───────────────────────────────────── */}
      {/* DESIGN-meta: feature-icon-row pattern for leave balance tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {LEAVE_TYPES.map(({ type, used, total, color, bg }) => {
          const remaining = total - used;
          const pct = Math.min((used / total) * 100, 100);
          return (
            <Card variant="feature" key={type} className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#8595a4]">
                  {type}
                </span>
              </div>
              {/* DESIGN-meta: display-lg weight for balance number */}
              <span
                className="text-[32px] font-[500] leading-[1.17] tracking-[0] block"
                style={{ color }}
              >
                {remaining}
              </span>
              <p className="text-[13px] font-normal text-[#5d6c7b]">
                {used} used of {total}
              </p>
              {/* Progress bar */}
              <div className="h-1 rounded-full bg-[#f1f4f7] overflow-hidden mt-1">
                <div
                  className="h-1 rounded-full transition-all duration-500"
                  style={{ backgroundColor: color, width: `${pct}%` }}
                />
              </div>
            </Card>
          );
        })}
      </div>

      {/* ── Leave History Table ───────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[20px] font-[500] leading-[1.25] text-[#0a1317] tracking-[0]">
            Request History
          </h2>
        </div>

        <Card variant="feature" className="overflow-hidden">
          {isLoading && (
            <div className="p-4 space-y-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 rounded-[8px]" />)}
            </div>
          )}

          {isError && (
            <div className="p-8 flex flex-col items-center gap-3 text-center">
              <AlertCircle className="w-6 h-6 text-[#e41e3f]" />
              <p className="text-[14px] font-bold text-[#0a1317]">Failed to load leave records</p>
              <Button variant="ghost" size="sm" onClick={() => refetch()}>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </Button>
            </div>
          )}

          {!isLoading && !isError && (!leaveRecords || leaveRecords.length === 0) && (
            <EmptyState
              title="No leave requests yet"
              description="You haven't submitted any leave requests."
              actionLabel="New Request"
              onAction={() => window.location.href = '/leave/new'}
              icon={<Calendar className="w-5 h-5" />}
            />
          )}

          {!isLoading && !isError && leaveRecords && leaveRecords.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRecords.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell>
                      <span className="font-bold text-[#0a1317]">{rec.leaveType}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-[13px]">{rec.startDate}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-[13px]">{rec.endDate}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold">{rec.days}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-[#5d6c7b] max-w-[160px] truncate block">{rec.reason}</span>
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
      </div>
    </div>
  );
};
