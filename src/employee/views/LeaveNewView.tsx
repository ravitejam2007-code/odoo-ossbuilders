import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLeaveBalance, useSubmitLeaveRequest, useUploadLeaveAttachment } from '../hooks/useEmployeeData';
import { Button } from '../../shared/Button';
import { Card } from '../../shared/Card';
import { FormField, Input, Textarea, Select } from '../../shared/FormField';
import { Breadcrumbs } from '../../shared/Breadcrumbs';
import {
  Upload,
  FileText,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  Calendar,
  Paperclip,
  X,
} from 'lucide-react';

interface FormState {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  document: File | null;
}

interface FormErrors {
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
  general?: string;
}

export const LeaveNewView: React.FC = () => {
  const { currentUser } = useAuth();
  const { data: leaveBalance } = useLeaveBalance();
  const submitLeaveMutation = useSubmitLeaveRequest();
  const uploadAttachmentMutation = useUploadLeaveAttachment();

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadedAttachment, setUploadedAttachment] = useState<{ name: string; url: string } | null>(null);

  const [form, setForm] = useState<FormState>({
    leaveType: 'Paid Time Off',
    startDate: '',
    endDate: '',
    reason: '',
    document: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const today = new Date().toISOString().split('T')[0];

  const calcDays = (): number => {
    if (!form.startDate || !form.endDate) return 0;
    const a = new Date(form.startDate);
    const b = new Date(form.endDate);
    if (b < a) return 0;
    
    // Count weekdays
    let count = 0;
    const cur = new Date(a);
    while (cur <= b) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) {
        count++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    return count > 0 ? count : 1;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, general: 'File size must be under 10MB.' }));
      return;
    }

    setForm((prev) => ({ ...prev, document: file }));
    try {
      const res = await uploadAttachmentMutation.mutateAsync(file);
      setUploadedAttachment({
        name: res.attachmentName,
        url: res.attachmentUrl,
      });
    } catch {
      // Keep local file reference as fallback
    }
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.leaveType) e.leaveType = 'Please select a leave type.';
    if (!form.startDate) e.startDate = 'Start date is required.';
    if (!form.endDate) e.endDate = 'End date is required.';
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      e.endDate = 'End date must be on or after start date.';
    }
    if (!form.reason.trim()) e.reason = 'Please provide remarks / reason for your request.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});

    try {
      let attachmentName = uploadedAttachment?.name;
      let attachmentUrl = uploadedAttachment?.url;

      // If document was selected but upload hasn't run yet
      if (form.document && !attachmentUrl) {
        try {
          const uploadRes = await uploadAttachmentMutation.mutateAsync(form.document);
          attachmentName = uploadRes.attachmentName;
          attachmentUrl = uploadRes.attachmentUrl;
        } catch {
          // Proceed if upload fails
        }
      }

      await submitLeaveMutation.mutateAsync({
        leaveType: form.leaveType,
        startDate: form.startDate,
        endDate: form.endDate,
        daysCount: calcDays(),
        reason: form.reason.trim(),
        attachmentName,
        attachmentUrl,
      });

      setSubmitted(true);
    } catch (err: any) {
      const code = err.code || '';
      if (code === 'INSUFFICIENT_LEAVE_BALANCE') {
        setErrors({ general: 'Insufficient leave balance quota for the requested days.' });
      } else if (code === 'INVALID_DATE_RANGE') {
        setErrors({ endDate: 'End date cannot be earlier than start date.' });
      } else {
        setErrors({ general: err.message || 'Failed to submit leave request. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-5 text-center px-4 font-sans">
        <div className="w-16 h-16 rounded-full bg-[#e6f4ea] flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-[#31a24c]" />
        </div>
        <h2 className="text-[24px] font-semibold tracking-tight text-[#0a1317]">
          Time Off Request Submitted
        </h2>
        <p className="text-[15px] text-[#5d6c7b] max-w-md">
          Your <strong className="text-[#0a1317]">{form.leaveType}</strong> application for{' '}
          <strong className="text-[#0a1317]">{calcDays()} Workdays</strong> ({form.startDate} to {form.endDate}) has been submitted for HR review.
        </p>
        <div className="flex gap-3 pt-2">
          <Button variant="primary" size="md" onClick={() => (window.location.href = '/leave')}>
            View Leave History
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={() => {
              setSubmitted(false);
              setForm({ leaveType: 'Paid Time Off', startDate: '', endDate: '', reason: '', document: null });
              setUploadedAttachment(null);
            }}
          >
            Apply Another Leave
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[720px] mx-auto font-sans">
      <Breadcrumbs
        items={[
          { label: 'Time Off', href: '/leave' },
          { label: 'New Request' },
        ]}
      />

      {/* ── Page Header ────────────────────────────────────────────── */}
      <div>
        <h1 className="text-[28px] sm:text-[34px] font-semibold tracking-tight leading-tight text-[#0a1317]">
          Apply for Time Off
        </h1>
        <p className="text-[14px] text-[#5d6c7b] mt-1">
          Complete the allocation details below for administrative review and quota tracking
        </p>
      </div>

      {errors.general && (
        <div className="p-3.5 rounded-[12px] bg-[#fde8ec] border border-[#f0284a]/20 text-[13px] text-[#c0122e] font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#e41e3f] flex-shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* ── Form Card ──────────────────────────────────────────────── */}
      <Card variant="feature" className="p-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Employee Field */}
          <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0a1317] text-white flex items-center justify-center font-bold text-[13px]">
                {currentUser?.name?.charAt(0) || 'E'}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#8595a4] block">Employee</span>
                <span className="text-[14px] font-bold text-[#0a1317]">{currentUser?.name}</span>
              </div>
            </div>
            <span className="font-mono text-[12px] font-bold text-[#5d6c7b]">
              ID: {currentUser?.loginId}
            </span>
          </div>

          {/* Time Off Type */}
          <FormField label="Time Off Type" required error={errors.leaveType}>
            <Select
              value={form.leaveType}
              onChange={(e) => {
                setForm({ ...form, leaveType: e.target.value });
                if (errors.leaveType) setErrors({ ...errors, leaveType: undefined });
              }}
              hasError={!!errors.leaveType}
            >
              <option value="Paid Time Off">
                Paid Time Off ({leaveBalance?.paidTimeOffDays ?? 24} Days Available)
              </option>
              <option value="Sick Leave">
                Sick Leave ({leaveBalance?.sickLeaveDays ?? 7} Days Available)
              </option>
              <option value="Unpaid Leaves">
                Unpaid Leaves (Reduces Payable Workdays)
              </option>
            </Select>
          </FormField>

          {/* Validity Period: Start Date & End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Start Date" required error={errors.startDate}>
              <Input
                type="date"
                value={form.startDate}
                min={today}
                onChange={(e) => {
                  setForm({ ...form, startDate: e.target.value });
                  if (errors.startDate) setErrors({ ...errors, startDate: undefined });
                }}
                hasError={!!errors.startDate}
              />
            </FormField>

            <FormField label="End Date" required error={errors.endDate}>
              <Input
                type="date"
                value={form.endDate}
                min={form.startDate || today}
                onChange={(e) => {
                  setForm({ ...form, endDate: e.target.value });
                  if (errors.endDate) setErrors({ ...errors, endDate: undefined });
                }}
                hasError={!!errors.endDate}
              />
            </FormField>
          </div>

          {/* Computed Duration */}
          <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0064e0]" />
              <span className="text-[13px] font-bold text-[#0a1317]">Allocation Duration:</span>
            </div>
            <span className="font-mono text-[15px] font-bold text-[#0a1317]">
              {calcDays()} Workdays
            </span>
          </div>

          {/* Reason / Remarks */}
          <FormField label="Reason / Remarks" required error={errors.reason}>
            <Textarea
              value={form.reason}
              onChange={(e) => {
                setForm({ ...form, reason: e.target.value });
                if (errors.reason) setErrors({ ...errors, reason: undefined });
              }}
              placeholder="State the purpose of your time off request..."
              rows={3}
              hasError={!!errors.reason}
            />
          </FormField>

          {/* Attachment Upload */}
          <FormField label="Supporting Document / Medical Note (Optional)">
            <label
              className={[
                'flex flex-col items-center justify-center gap-2',
                'border-2 border-dashed border-[#ced0d4]',
                'rounded-[12px] p-5 cursor-pointer',
                'bg-[#f1f4f7] text-[#5d6c7b]',
                'hover:border-[#1876f2] hover:bg-[#f0f6ff]',
                'transition-all duration-150',
              ].join(' ')}
            >
              <input
                type="file"
                className="sr-only"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              {form.document ? (
                <div className="flex flex-col items-center">
                  <FileText className="w-6 h-6 text-[#0064e0]" />
                  <span className="text-[13px] font-bold text-[#0064e0] mt-1">{form.document.name}</span>
                  <span className="text-[11px] text-[#8595a4]">
                    {(form.document.size / 1024).toFixed(0)} KB &bull; {uploadAttachmentMutation.isPending ? 'Uploading to storage...' : 'Ready &bull; Click to replace'}
                  </span>
                </div>
              ) : (
                <>
                  <Paperclip className="w-5 h-5 text-[#8595a4]" />
                  <span className="text-[13px] font-bold text-[#0a1317]">Upload Document / Certificate</span>
                  <span className="text-[11px] text-[#8595a4]">PDF, JPG, or PNG (Max 10MB)</span>
                </>
              )}
            </label>
          </FormField>

          {/* Submit & Discard Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#dee3e9]">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => (window.location.href = '/leave')}
            >
              Discard
            </Button>
            <Button
              type="submit"
              variant="buy-cta"
              size="md"
              loading={submitting || uploadAttachmentMutation.isPending}
            >
              Submit Request
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
