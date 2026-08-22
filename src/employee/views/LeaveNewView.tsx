import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../../shared/Button';
import { Card } from '../../shared/Card';
import { FormField, Input, Textarea, Select } from '../../shared/FormField';
import { Breadcrumbs } from '../../shared/Breadcrumbs';
import { Upload, FileText, ChevronLeft, AlertCircle, CheckCircle, User, Calendar, Paperclip } from 'lucide-react';

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
}

export const LeaveNewView: React.FC = () => {
  const { currentUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
    return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86400000) + 1);
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.leaveType) e.leaveType = 'Please select a leave type.';
    if (!form.startDate) e.startDate = 'Start date is required.';
    if (!form.endDate) e.endDate = 'End date is required.';
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      e.endDate = 'End date must be on or after start date.';
    if (!form.reason.trim()) e.reason = 'Please provide remarks / reason.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-5 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-[#e6f4ea] flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-[#31a24c]" />
        </div>
        <h2 className="font-heading text-[24px] font-[600] uppercase tracking-[0.02em] text-[#0a1317]">
          Time Off Request Submitted
        </h2>
        <p className="text-[15px] text-[#5d6c7b] max-w-sm">
          Your <strong className="text-[#0a1317]">{form.leaveType}</strong> application for <strong className="text-[#0a1317]">{calcDays().toFixed(2)} Days</strong> has been recorded and submitted for HR approval.
        </p>
        <div className="flex gap-3 pt-2">
          <Button variant="primary" size="md" onClick={() => window.location.href = '/leave'}>
            View Leave Requests
          </Button>
          <Button variant="ghost" size="md" onClick={() => {
            setSubmitted(false);
            setForm({ leaveType: 'Paid Time Off', startDate: '', endDate: '', reason: '', document: null });
          }}>
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[720px] mx-auto">
      <Breadcrumbs items={[
        { label: 'Time Off', href: '/leave' },
        { label: 'New Request' },
      ]} />

      {/* ── Page Header ────────────────────────────────────────────── */}
      <div>
        <h1 className="font-heading text-[32px] sm:text-[40px] font-[600] uppercase tracking-[0.02em] leading-[1.15] text-[#0a1317]">
          New Time Off Request
        </h1>
        <p className="text-[15px] font-normal text-[#5d6c7b] mt-1">
          Complete the allocation details below for administrative review
        </p>
      </div>

      {/* ── Form Card ──────────────────────────────────────────────── */}
      <Card variant="feature" className="p-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          
          {/* Employee Field (Read-only as per wireframe) */}
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

          {/* Time Off Type (Wireframe: Paid Time Off, Sick Leave, Unpaid Leave) */}
          <FormField label="Time Off Type" required error={errors.leaveType}>
            <Select
              value={form.leaveType}
              onChange={(e) => {
                setForm({ ...form, leaveType: e.target.value });
                if (errors.leaveType) setErrors({ ...errors, leaveType: undefined });
              }}
              hasError={!!errors.leaveType}
            >
              <option value="Paid Time Off">Paid Time Off (24 Days Available)</option>
              <option value="Sick Leave">Sick Leave (07 Days Available)</option>
              <option value="Unpaid Leave">Unpaid Leave (Reduces Payable Days)</option>
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

          {/* Allocation Computation */}
          <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0064e0]" />
              <span className="text-[13px] font-bold text-[#0a1317]">Allocation Duration:</span>
            </div>
            <span className="font-mono text-[15px] font-bold text-[#0a1317]">
              {calcDays().toFixed(2)} Days
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

          {/* Attachment Upload (Certificate support per wireframe) */}
          <FormField label="Supporting Document / Medical Certificate">
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
                onChange={(e) => setForm({ ...form, document: e.target.files?.[0] || null })}
              />
              {form.document ? (
                <>
                  <FileText className="w-6 h-6 text-[#0064e0]" />
                  <span className="text-[13px] font-bold text-[#0064e0]">{form.document.name}</span>
                  <span className="text-[11px] text-[#8595a4]">
                    {(form.document.size / 1024).toFixed(0)} KB &bull; Click to replace
                  </span>
                </>
              ) : (
                <>
                  <Paperclip className="w-5 h-5 text-[#8595a4]" />
                  <span className="text-[13px] font-bold text-[#0a1317]">Upload Certificate / Document</span>
                  <span className="text-[11px] text-[#8595a4]">PDF, JPG or PNG (Optional for paid leave, recommended for sick leave)</span>
                </>
              )}
            </label>
          </FormField>

          {/* Submit & Discard Actions (Wireframe Rule 67 & 68) */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#dee3e9]">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => window.location.href = '/leave'}
            >
              Discard
            </Button>
            <Button type="submit" variant="buy-cta" size="md" loading={submitting}>
              Submit Request
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
