import React, { useState } from 'react';
import { Card } from '../../shared/Card';
import { Badge } from '../../shared/Badge';
import { Button } from '../../shared/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../shared/Table';
import { EmptyState } from '../../shared/EmptyState';
import { Skeleton } from '../../shared/Loading';
import { useAdminLeaveRequests, useApproveLeave, useRejectLeave } from '../hooks/useAdminData';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Calendar, Search, Filter } from 'lucide-react';

export const AdminLeaveView: React.FC = () => {
  const { data: requests, isLoading, isError, refetch } = useAdminLeaveRequests();
  const approveMutation = useApproveLeave();
  const rejectMutation = useRejectLeave();

  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const list = requests || [];
  const filtered = list.filter((r) => {
    const matchFilter = filter === 'all' || r.status === filter;
    const matchSearch = r.employeeName?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: list.length,
    pending: list.filter((r) => r.status === 'pending').length,
    approved: list.filter((r) => r.status === 'approved').length,
    rejected: list.filter((r) => r.status === 'rejected').length,
  };

  const handleApprove = async (id: string) => {
    setMutatingId(id);
    setActionError(null);
    try {
      await approveMutation.mutateAsync({ id, comment: 'Approved by HR Administration' });
      setActionSuccess('Leave application approved successfully!');
      setTimeout(() => setActionSuccess(null), 4000);
      await refetch();
    } catch (err: any) {
      setActionError(err.message || 'Failed to approve leave application.');
      setTimeout(() => setActionError(null), 4000);
    } finally {
      setMutatingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setMutatingId(id);
    setActionError(null);
    try {
      await rejectMutation.mutateAsync({ id, comment: 'Leave application rejected' });
      setActionSuccess('Leave application rejected.');
      setTimeout(() => setActionSuccess(null), 4000);
      await refetch();
    } catch (err: any) {
      setActionError(err.message || 'Failed to reject leave application.');
      setTimeout(() => setActionError(null), 4000);
    } finally {
      setMutatingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-[32px] sm:text-[40px] font-[600] uppercase tracking-[0.02em] leading-[1.15] text-[#0a1317]">
            Leave Management
          </h1>
          <p className="text-[15px] font-normal leading-[1.50] tracking-[-0.16px] text-[#5d6c7b] mt-1">
            Review and approve employee leave requests
          </p>
        </div>
        {counts.pending > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#fef3c7] border border-[#f7b928]/30">
            <AlertCircle className="w-3.5 h-3.5 text-[#92570c]" />
            <span className="text-[13px] font-bold text-[#92570c]">{counts.pending} pending</span>
          </div>
        )}
      </div>

      {/* Pill-tab status filters */}
      <div className="flex flex-wrap items-center gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={[
              'px-4 py-2 rounded-full text-[13px] font-bold capitalize transition-colors duration-150 outline-none',
              'focus-visible:ring-2 focus-visible:ring-[#1876f2]',
              filter === tab
                ? 'bg-[#0a1317] text-white'
                : 'bg-white text-[#1c1e21] border border-[#ced0d4] hover:bg-[#f1f4f7]',
            ].join(' ')}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8595a4]" />
          <input
            type="text"
            placeholder="Search employee…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 h-10 w-48 rounded-full bg-[#f1f4f7] text-[13px] text-[#1c1e21] placeholder:text-[#8595a4] border-0 outline-none focus:ring-2 focus:ring-[#1876f2]"
          />
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

      <Card variant="feature" className="overflow-hidden">
        {isLoading && (
          <div className="p-4 space-y-3">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14 rounded-[8px]" />)}
          </div>
        )}
        {isError && (
          <div className="p-10 flex flex-col items-center gap-3 text-center">
            <AlertCircle className="w-6 h-6 text-[#e41e3f]" />
            <p className="text-[14px] font-bold text-[#0a1317]">Failed to load leave requests</p>
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </Button>
          </div>
        )}
        {!isLoading && !isError && filtered.length === 0 && (
          <EmptyState title="No leave requests" description="No requests match the current filter." icon={<Calendar className="w-5 h-5" />} />
        )}
        {!isLoading && !isError && filtered.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <a href={`/admin/leave/${req.id}`} className="font-bold text-[#0a1317] hover:underline">{req.employeeName}</a>
                  </TableCell>
                  <TableCell>{req.leaveType}</TableCell>
                  <TableCell><span className="font-mono text-[12px]">{req.startDate}</span></TableCell>
                  <TableCell><span className="font-mono text-[12px]">{req.endDate}</span></TableCell>
                  <TableCell><span className="font-bold">{req.daysCount}d</span></TableCell>
                  <TableCell><Badge status={req.status} /></TableCell>
                  <TableCell>
                    {req.status === 'pending' && (
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleApprove(req.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-bold bg-[#0064e0] text-white hover:bg-[#0457cb] transition-colors">
                          <CheckCircle2 className="w-3 h-3" /> Approve
                        </button>
                        <button onClick={() => handleReject(req.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-bold bg-[#fde8ec] text-[#e41e3f] hover:bg-[#e41e3f] hover:text-white transition-colors">
                          <XCircle className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    )}
                    {req.status !== 'pending' && (
                      <a href={`/admin/leave/${req.id}`} className="text-[13px] font-bold text-[#5d6c7b] hover:text-[#0a1317] transition-colors">View →</a>
                    )}
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
