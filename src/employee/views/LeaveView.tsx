import React from 'react';
import { useLeaveRequests, useLeaveBalance } from '../hooks/useEmployeeData';
import { Badge } from '../../shared/Badge';
import { Card } from '../../shared/Card';
import { Button } from '../../shared/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../shared/Table';
import { Skeleton } from '../../shared/Loading';
import { EmptyState } from '../../shared/EmptyState';
import { Plus, Calendar, AlertCircle, RefreshCw, Paperclip, ExternalLink } from 'lucide-react';

export const LeaveView: React.FC = () => {
  const { data: leaveRecords, isLoading: loadingRequests, isError: errorRequests, refetch: refetchRequests } = useLeaveRequests();
  const { data: leaveBalance, isLoading: loadingBalance } = useLeaveBalance();

  const balanceCards = [
    {
      type: 'Paid Time Off',
      available: leaveBalance?.paidTimeOffDays ?? 24,
      total: 24,
      color: '#0064e0',
      bg: '#e8f0fc',
    },
    {
      type: 'Sick Leave',
      available: leaveBalance?.sickLeaveDays ?? 7,
      total: 7,
      color: '#31a24c',
      bg: '#e6f4ea',
    },
    {
      type: 'Unpaid Leaves',
      available: leaveBalance?.unpaidLeaveDays ?? 0,
      total: 0,
      color: '#8595a4',
      bg: '#f1f4f7',
      isUnpaid: true,
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#0a1317] tracking-tight leading-tight">
            Time Off &amp; Leave
          </h1>
          <p className="text-[14px] text-[#5d6c7b] mt-1 font-normal">
            Leave quota balance, request history, and allocation management
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="primary" size="md" onClick={() => (window.location.href = '/leave/new')}>
            <Plus className="w-4 h-4" />
            <span>Apply Time Off</span>
          </Button>
        </div>
      </div>

      {/* ── Leave Balance Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {balanceCards.map(({ type, available, total, color, bg, isUnpaid }) => {
          const used = isUnpaid ? available : Math.max(0, total - available);
          const pct = isUnpaid ? 0 : Math.min(((available) / total) * 100, 100);

          return (
            <Card variant="feature" key={type} className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#8595a4]">
                  {type}
                </span>
                <Calendar className="w-4 h-4" style={{ color }} />
              </div>

              <span
                className="text-[32px] font-[500] leading-[1.17] tracking-[0] block"
                style={{ color }}
              >
                {loadingBalance ? '—' : `${available} Days`}
              </span>

              <p className="text-[13px] font-normal text-[#5d6c7b]">
                {isUnpaid ? `${available} days taken` : `${used} used of ${total} quota`}
              </p>

              {!isUnpaid && (
                <div className="h-1 rounded-full bg-[#f1f4f7] overflow-hidden mt-1">
                  <div
                    className="h-1 rounded-full transition-all duration-500"
                    style={{ backgroundColor: color, width: `${pct}%` }}
                  />
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* ── Leave History Table ───────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[20px] font-[500] leading-[1.25] text-[#0a1317] tracking-[0]">
            Leave Request History
          </h2>
        </div>

        <Card variant="feature" className="overflow-hidden">
          {loadingRequests && (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-[8px]" />
              ))}
            </div>
          )}

          {errorRequests && (
            <div className="p-8 flex flex-col items-center gap-3 text-center">
              <AlertCircle className="w-6 h-6 text-[#e41e3f]" />
              <p className="text-[14px] font-bold text-[#0a1317]">Failed to load leave records</p>
              <Button variant="ghost" size="sm" onClick={() => refetchRequests()}>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </Button>
            </div>
          )}

          {!loadingRequests && !errorRequests && (!leaveRecords || leaveRecords.length === 0) && (
            <EmptyState
              title="No leave requests yet"
              description="You have not submitted any time off applications."
              actionLabel="Apply For Leave"
              onAction={() => (window.location.href = '/leave/new')}
              icon={<Calendar className="w-5 h-5" />}
            />
          )}

          {!loadingRequests && !errorRequests && leaveRecords && leaveRecords.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Reason / Notes</TableHead>
                  <TableHead>Attachment</TableHead>
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
                      <span className="font-bold">{rec.daysCount}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-[#5d6c7b] max-w-[200px] truncate block" title={rec.reason}>
                        {rec.reason || '—'}
                      </span>
                      {rec.adminComment && (
                        <span className="text-[11px] text-[#0064e0] block mt-0.5" title={rec.adminComment}>
                          HR: {rec.adminComment}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {rec.attachmentUrl ? (
                        <a
                          href={rec.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0064e0] hover:underline"
                        >
                          <Paperclip className="w-3 h-3" />
                          <span className="max-w-[100px] truncate">{rec.attachmentName || 'Doc'}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-[#8595a4] text-[12px]">—</span>
                      )}
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
