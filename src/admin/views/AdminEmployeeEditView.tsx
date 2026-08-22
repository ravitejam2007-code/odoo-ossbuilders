import React, { useState } from 'react';
import { useAdminEmployee, useUpdateAdminEmployee } from '../hooks/useAdminData';
import { Card } from '../../shared/Card';
import { Button } from '../../shared/Button';
import { FormField, Input, Select } from '../../shared/FormField';
import { Skeleton } from '../../shared/Loading';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import type { UserRole } from '../types/api';

export interface AdminEmployeeEditViewProps {
  id: string;
}

export const AdminEmployeeEditView: React.FC<AdminEmployeeEditViewProps> = ({ id }) => {
  const { data: employee, isLoading, isError } = useAdminEmployee(id);
  const updateMutation = useUpdateAdminEmployee();

  const [name, setName] = useState(employee?.name || '');
  const [email, setEmail] = useState(employee?.email || '');
  const [phone, setPhone] = useState(employee?.phone || '');
  const [jobTitle, setJobTitle] = useState(employee?.jobTitle || '');
  const [department, setDepartment] = useState(employee?.department || '');
  const [role, setRole] = useState<UserRole>(employee?.role || 'employee');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (employee) {
      setName(employee.name);
      setEmail(employee.email);
      setPhone(employee.phone);
      setJobTitle(employee.jobTitle);
      setDepartment(employee.department);
      setRole(employee.role);
    }
  }, [employee]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-64 w-full rounded-[16px]" />
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="p-8 text-center space-y-3 max-w-md mx-auto">
        <h3 className="text-[18px] font-bold text-[#e41e3f]">Record Not Found</h3>
        <a href="/admin/employees">
          <Button variant="secondary" size="sm">Back to Directory</Button>
        </a>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (updateMutation.isPending) return;

    if (!name || !email) {
      setErrorMsg('Please complete required employee fields.');
      return;
    }

    setErrorMsg('');
    updateMutation.mutate(
      {
        id: employee.id,
        name,
        email,
        phone,
        jobTitle,
        department,
        role,
      },
      {
        onSuccess: () => {
          setSavedSuccess(true);
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.location.href = `/admin/employees/${employee.id}`;
            }
          }, 1000);
        },
        onError: () => {
          setErrorMsg('Failed to update employee record.');
        },
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans text-[#1c1e21]">
      <div className="flex items-center justify-between">
        <a href={`/admin/employees/${employee.id}`} className="inline-flex items-center text-[13px] font-bold text-[#0a1317] hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Cancel &amp; Back</span>
        </a>
        <span className="text-[13px] text-[#5d6c7b] font-bold">Edit Employee Record</span>
      </div>

      <Card variant="feature" className="p-6 space-y-6">
        <div className="border-b border-[#dee3e9] pb-3">
          <h2 className="text-[20px] font-bold text-[#0a1317] tracking-tight">Edit Employee: {employee.name}</h2>
          <p className="text-[13px] text-[#5d6c7b] mt-0.5">Login ID: {employee.loginId}</p>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-[12px] bg-[#e6f4ea] border border-[#31a24c]/30 text-[13px] text-[#1a7f3c] font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#31a24c] flex-shrink-0" />
            <span>Employee record updated successfully! Redirecting...</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-[12px] bg-[#fde8ec] border border-[#f0284a]/20 text-[13px] text-[#c0122e] font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#e41e3f] flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Login ID (Auto-Generated)">
            <Input type="text" disabled value={employee.loginId} className="bg-[#f1f4f7] font-mono font-bold text-[#5d6c7b]" />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Full Name" required>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </FormField>

            <FormField label="Work Email" required>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Phone Contact">
              <Input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </FormField>

            <FormField label="User Role &amp; Permissions">
              <Select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
                <option value="employee">Employee (Standard Access)</option>
                <option value="hr_officer">HR Officer (Leave &amp; Attendance Manager)</option>
                <option value="admin">System Administrator (Full Admin Access)</option>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Job Title">
              <Input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            </FormField>

            <FormField label="Department">
              <Input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} />
            </FormField>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-[#dee3e9]">
            <a href={`/admin/employees/${employee.id}`}>
              <Button variant="ghost" size="sm" type="button" disabled={updateMutation.isPending}>
                Cancel
              </Button>
            </a>
            <Button variant="primary" size="sm" type="submit" loading={updateMutation.isPending} disabled={updateMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
