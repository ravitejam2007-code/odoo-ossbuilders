import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCreateLeaveRequest } from '../../hooks/useEmployeeData';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { FormField, Input, Select, Textarea } from '../ui/FormField';
import { ArrowLeft, Upload, FileText, AlertCircle } from 'lucide-react';
import type { LeaveType } from '../../types/api';

export const LeaveNewView: React.FC = () => {
  const { currentUser } = useAuth();
  const createMutation = useCreateLeaveRequest();

  const [leaveType, setLeaveType] = useState<LeaveType>('Paid Time Off');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-02');
  const [reason, setReason] = useState('');
  const [attachmentName, setAttachmentName] = useState<string | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState('');

  if (!currentUser) return null;

  // Calculate allocation days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const daysCount = diffTime >= 0 ? Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1 : 0;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
    }
  };

  const validateForm = () => {
    if (!startDate || !endDate) {
      setErrorMsg('Please select valid start and end dates.');
      return false;
    }
    if (end < start) {
      setErrorMsg('End Date must be on or after Start Date.');
      return false;
    }
    if (leaveType === 'Sick Leave' && daysCount > 1 && !attachmentName) {
      setErrorMsg('Sick Leave requests exceeding 1 day require a medical certificate attachment.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (createMutation.isPending) return;
    if (!validateForm()) return;

    setErrorMsg('');
    createMutation.mutate(
      {
        employeeId: currentUser.id,
        employeeName: currentUser.name,
        leaveType,
        startDate,
        endDate,
        daysCount,
        reason: reason.trim(),
        attachmentName,
      },
      {
        onSuccess: () => {
          if (typeof window !== 'undefined') {
            window.location.href = '/leave';
          }
        },
        onError: () => {
          setErrorMsg('Failed to submit leave request. Please check input details and try again.');
        },
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans text-zinc-900">
      <div className="flex items-center justify-between">
        <a href="/leave" className="inline-flex items-center text-xs font-bold text-zinc-950 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Leave Requests</span>
        </a>
        <span className="text-xs text-zinc-500 font-bold">New Leave Application</span>
      </div>

      <Card className="p-8 space-y-6 bg-white border-zinc-200 shadow-2xs">
        <div className="border-b border-zinc-100 pb-4">
          <h1 className="text-2xl font-black text-zinc-950 tracking-tight">Request Time Off</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Submit a leave application for HR/Management approval.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Employee (Read-only) */}
          <FormField label="Employee Identity (Read-only)">
            <Input type="text" disabled value={`${currentUser.name} (${currentUser.loginId})`} className="font-bold text-zinc-950" />
          </FormField>

          {/* Time Off Type */}
          <FormField label="Time Off Type" required>
            <Select value={leaveType} onChange={(e) => setLeaveType(e.target.value as LeaveType)}>
              <option value="Paid Time Off">Paid Time Off</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Unpaid Leaves">Unpaid Leaves</option>
            </Select>
          </FormField>

          {/* Date Range Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Start Date" required>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </FormField>

            <FormField label="End Date" required>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </FormField>
          </div>

          {/* Allocation */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase">Calculated Allocation Days</span>
            <span className={`text-lg font-black font-mono ${daysCount > 0 ? 'text-zinc-950' : 'text-rose-600'}`}>
              {daysCount > 0 ? `${daysCount} Days` : 'Invalid Date Range'}
            </span>
          </div>

          {/* Attachment (Upload) */}
          <FormField label="Attachment (Required for Sick Leave > 1 day)">
            <div className="flex items-center space-x-3">
              <label className="px-4 py-2.5 rounded-2xl bg-white border border-zinc-200 text-xs font-bold text-zinc-900 hover:bg-zinc-50 cursor-pointer inline-flex items-center space-x-2 shadow-2xs">
                <Upload className="w-4 h-4 text-zinc-950" />
                <span>Upload Document</span>
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
              {attachmentName && (
                <span className="text-xs text-zinc-950 font-bold flex items-center gap-1 font-mono">
                  <FileText className="w-3.5 h-3.5" />
                  {attachmentName}
                </span>
              )}
            </div>
          </FormField>

          {/* Remarks / Reason */}
          <FormField label="Remarks / Reason">
            <Textarea
              placeholder="State the reason for your time off request..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </FormField>

          {/* Actions & Submit Protection */}
          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-zinc-100">
            <a href="/leave">
              <Button variant="ghost" size="md" type="button" disabled={createMutation.isPending}>
                Discard
              </Button>
            </a>
            <Button
              variant="primary"
              size="md"
              type="submit"
              loading={createMutation.isPending}
              disabled={createMutation.isPending || daysCount <= 0}
            >
              Submit Request
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
