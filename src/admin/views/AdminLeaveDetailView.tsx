import React, { useState } from 'react';
import { useAdminLeaveRequest, useApproveLeave, useRejectLeave } from '../hooks/useAdminData';
import { Card } from '../../shared/Card';
import { Button } from '../../shared/Button';
import { Badge } from '../../shared/Badge';
import { FormField, Textarea } from '../../shared/FormField';
import { Skeleton } from '../../shared/Loading';
import { ArrowLeft, CheckCircle2, XCircle, FileText, MessageSquare } from 'lucide-react';

export interface AdminLeaveDetailViewProps {
  id: string;
}

export const AdminLeaveDetailView: React.FC<AdminLeaveDetailViewProps> = ({ id }) => {
  const { data: request, isLoading, isError } = useAdminLeaveRequest(id);
  const approveMutation = useApproveLeave();
  const rejectMutation = useRejectLeave();

  const [comment, setComment] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-64 w-full rounded-[16px]" />
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="p-8 text-center space-y-3 max-w-md mx-auto">
        <h3 className="text-[18px] font-bold text-[#e41e3f]">Leave Request Not Found</h3>
        <a href="/admin/leave">
          <Button variant="secondary" size="sm">Back to Leave List</Button>
        </a>
      </div>
    );
  }

  const isMutating = approveMutation.isPending || rejectMutation.isPending;

  const handleApprove = () => {
    if (isMutating) return;
    approveMutation.mutate(
      { id: request.id, comment },
      {
        onSuccess: () => {
          setActionSuccess('Leave request approved successfully.');
        },
      }
    );
  };

  const handleReject = () => {
    if (isMutating) return;
    rejectMutation.mutate(
      { id: request.id, comment },
      {
        onSuccess: () => {
          setActionSuccess('Leave request rejected.');
        },
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans text-[#1c1e21]">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <a href="/admin/leave" className="inline-flex items-center text-[13px] font-bold text-[#0a1317] hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Leave Requests</span>
        </a>
        <Badge status={request.status} />
      </div>

      <Card variant="feature" className="p-6 space-y-6">
        <div className="flex items-center space-x-3.5 border-b border-[#dee3e9] pb-4">
          <img src={request.employeeAvatar} alt="" className="w-12 h-12 rounded-full object-cover border border-[#dee3e9]" />
          <div>
            <h2 className="text-[18px] font-bold text-[#0a1317]">{request.employeeName}</h2>
            <p className="text-[13px] text-[#5d6c7b]">{request.department} &bull; Application Ref: {request.id}</p>
          </div>
        </div>

        {actionSuccess && (
          <div className="p-3.5 rounded-[12px] bg-[#e6f4ea] border border-[#31a24c]/30 text-[13px] text-[#1a7f3c] font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#31a24c] flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
          <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9] space-y-1">
            <span className="text-[11px] uppercase font-bold text-[#8595a4] block">Leave Type</span>
            <span className="font-bold text-[#0a1317] block text-[15px]">{request.leaveType}</span>
          </div>

          <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9] space-y-1">
            <span className="text-[11px] uppercase font-bold text-[#8595a4] block">Allocation Days</span>
            <span className="font-mono font-bold text-[#0a1317] block text-[15px]">{request.daysCount} Days</span>
          </div>

          <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9] space-y-1">
            <span className="text-[11px] uppercase font-bold text-[#8595a4] block">Start Date</span>
            <span className="font-mono font-bold text-[#0a1317] block">{request.startDate}</span>
          </div>

          <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9] space-y-1">
            <span className="text-[11px] uppercase font-bold text-[#8595a4] block">End Date</span>
            <span className="font-mono font-bold text-[#0a1317] block">{request.endDate}</span>
          </div>
        </div>

        {/* Reason / Remarks */}
        <div className="space-y-1 text-[13px]">
          <span className="text-[11px] uppercase font-bold text-[#8595a4] block">Reason Provided</span>
          <p className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9] text-[#1c1e21] font-medium">
            {request.reason || 'No remarks provided.'}
          </p>
        </div>

        {/* Attachment */}
        {request.attachmentName && (
          <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9] flex items-center justify-between text-[13px]">
            <span className="font-semibold text-[#0a1317] flex items-center gap-1.5 font-mono">
              <FileText className="w-4 h-4 text-[#5d6c7b]" />
              {request.attachmentName}
            </span>
            <Button variant="secondary" size="sm" onClick={() => alert(`Opening certificate attachment: ${request.attachmentName}`)}>
              View Certificate
            </Button>
          </div>
        )}

        {/* Previous Admin Comment */}
        {request.adminComment && (
          <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9] text-[13px] space-y-1">
            <span className="text-[11px] uppercase font-bold text-[#8595a4] block">Admin Decision Comment</span>
            <p className="font-semibold text-[#0a1317] italic flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-[#5d6c7b]" />
              <span>{request.adminComment}</span>
            </p>
          </div>
        )}

        {/* Approve / Reject Controls */}
        {request.status === 'pending' && (
          <div className="pt-4 space-y-4 border-t border-[#dee3e9]">
            <FormField label="Admin Decision Remarks / Feedback">
              <Textarea
                placeholder="Enter approval/rejection notes for the employee..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </FormField>

            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="destructive"
                size="md"
                onClick={handleReject}
                loading={rejectMutation.isPending}
                disabled={isMutating}
              >
                <XCircle className="w-4 h-4 mr-1.5" />
                <span>Reject Application</span>
              </Button>

              <Button
                variant="buy-cta"
                size="md"
                onClick={handleApprove}
                loading={approveMutation.isPending}
                disabled={isMutating}
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                <span>Approve Application</span>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
