import React, { useState, useMemo } from 'react';
import { Card } from '../../shared/Card';
import { Badge } from '../../shared/Badge';
import { Button } from '../../shared/Button';
import { Modal } from '../../shared/Modal';
import { FormField, Input, Select } from '../../shared/FormField';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../shared/Table';
import { EmptyState } from '../../shared/EmptyState';
import { useAdminEmployees, useCreateAdminEmployee } from '../hooks/useAdminData';
import { Skeleton } from '../../shared/Loading';
import { Plus, Search, AlertCircle, RefreshCw, Users, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';
import type { AdminEmployee, UserRole } from '../types/api';

export const AdminEmployeesView: React.FC = () => {
  const { data: initialEmployees, isLoading, isError, refetch } = useAdminEmployees();
  const createEmployeeMutation = useCreateAdminEmployee();

  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [status, setStatus] = useState('All');

  // Modal State for New Employee
  const [showAddModal, setShowAddModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('+91 98765 12345');
  const [formDept, setFormDept] = useState('Engineering');
  const [formTitle, setFormTitle] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('employee');
  const [formWage, setFormWage] = useState(50000);
  const [formPassword, setFormPassword] = useState('Welcome@2026');
  const [createSuccess, setCreateSuccess] = useState('');
  const [createError, setCreateError] = useState('');

  const list = initialEmployees || [];

  const departments = ['All', ...Array.from(new Set(list.map((e) => e.department || 'General')))];
  const statuses = ['All', 'Active', 'On Leave', 'Inactive'];

  const filtered = list.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      (emp.loginId || '').toLowerCase().includes(search.toLowerCase()) ||
      (emp.jobTitle || '').toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === 'All' || emp.department === dept;
    const matchStatus = status === 'All' || emp.workStatus?.toLowerCase().includes(status.toLowerCase());
    return matchSearch && matchDept && matchStatus;
  });

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formTitle.trim()) {
      setCreateError('Please complete all required fields.');
      return;
    }

    setCreateError('');
    try {
      const res = await createEmployeeMutation.mutateAsync({
        name: formName.trim(),
        email: formEmail.trim().toLowerCase(),
        phone: formPhone.trim(),
        password: formPassword,
        role: formRole,
        department: formDept,
        jobTitle: formTitle.trim(),
        wage: formWage,
      });

      setCreateSuccess(`Employee ${formName} created! Assigned Login ID: ${res.loginId}`);
      await refetch();
      setTimeout(() => {
        setCreateSuccess('');
        setShowAddModal(false);
        setFormName('');
        setFormEmail('');
        setFormPhone('+91 98765 12345');
        setFormTitle('');
      }, 2500);
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create employee record.');
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-[32px] sm:text-[40px] font-[600] uppercase tracking-[0.02em] leading-[1.15] text-[#0a1317]">
            Employees
          </h1>
          <p className="text-[15px] font-normal leading-[1.50] tracking-[-0.16px] text-[#5d6c7b] mt-1">
            {isLoading ? 'Loading…' : `${filtered.length} of ${list.length} employees`}
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>

      {/* ── Filters Bar ────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search pill */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8595a4]" />
          <input
            type="text"
            placeholder="Search employees…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 h-10 w-56 rounded-full bg-[#f1f4f7] text-[14px] font-normal text-[#1c1e21] placeholder:text-[#8595a4] border-0 outline-none focus:ring-2 focus:ring-[#1876f2]"
          />
        </div>

        {/* Dept filter */}
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          className="h-10 px-4 rounded-full bg-[#f1f4f7] text-[13px] font-bold text-[#1c1e21] border-0 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[#1876f2] pr-8"
        >
          {departments.map((d) => <option key={d}>{d}</option>)}
        </select>

        {/* Status pills */}
        <div className="flex items-center gap-1">
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={[
                'px-3.5 py-2 rounded-full text-[13px] font-bold transition-colors duration-150 outline-none',
                'focus-visible:ring-2 focus-visible:ring-[#1876f2]',
                status === s
                  ? 'bg-[#0a1317] text-white'
                  : 'bg-white text-[#1c1e21] border border-[#ced0d4] hover:bg-[#f1f4f7]',
              ].join(' ')}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Employee Table ──────────────────────────────────────────── */}
      <Card variant="feature" className="overflow-hidden">
        {isLoading && (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 rounded-[8px]" />)}
          </div>
        )}

        {isError && (
          <div className="p-10 flex flex-col items-center gap-3 text-center">
            <AlertCircle className="w-6 h-6 text-[#e41e3f]" />
            <p className="text-[14px] font-bold text-[#0a1317]">Failed to load employees</p>
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <EmptyState
            title="No employees found"
            description="Try adjusting your search or filter criteria."
            actionLabel="Clear Filters"
            onAction={() => { setSearch(''); setDept('All'); setStatus('All'); }}
            icon={<Users className="w-5 h-5" />}
          />
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Login ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((emp) => (
                <TableRow
                  key={emp.id}
                  className="cursor-pointer hover:bg-[#f1f4f7] transition-colors"
                  onClick={() => window.location.href = `/admin/employees/${emp.id}`}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover border border-[#dee3e9] flex-shrink-0"
                      />
                      <div>
                        <p className="text-[14px] font-bold text-[#0a1317]">{emp.name}</p>
                        <p className="text-[12px] text-[#5d6c7b]">{emp.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-[12px] font-bold text-[#0a1317] bg-[#f1f4f7] px-2 py-0.5 rounded-[6px] border border-[#dee3e9]">
                      {emp.loginId}
                    </span>
                  </TableCell>
                  <TableCell className="text-[13px] text-[#5d6c7b]">{emp.department}</TableCell>
                  <TableCell className="text-[13px] text-[#1c1e21] font-medium">{emp.jobTitle}</TableCell>
                  <TableCell>
                    <Badge status={emp.workStatus} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ChevronRight className="w-4 h-4 text-[#8595a4]" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* ── Add Employee Modal (with Backend API Integration) ─── */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setCreateError('');
        }}
        title="Create Employee Record"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateEmployee} className="space-y-4">
          {createSuccess && (
            <div className="p-3.5 rounded-[12px] bg-[#e6f4ea] border border-[#31a24c]/30 text-[13px] text-[#1a7f3c] font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#31a24c] flex-shrink-0" />
              <span>{createSuccess}</span>
            </div>
          )}

          {createError && (
            <div className="p-3.5 rounded-[12px] bg-[#fde8ec] border border-[#f0284a]/20 text-[13px] text-[#c0122e] font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#e41e3f] flex-shrink-0" />
              <span>{createError}</span>
            </div>
          )}

          {/* Automatic Login ID Banner */}
          <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#8595a4] block">
                Automatic Sequential ID Engine
              </span>
              <span className="font-mono text-[14px] font-bold text-[#0064e0] mt-0.5 block">
                Generated upon registration (Format: OI + Initials + Year + Seq)
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffffff] border border-[#dee3e9] text-[12px] font-bold text-[#0a1317]">
              <Sparkles className="w-3.5 h-3.5 text-[#0064e0]" />
              <span>Auto-Assigned</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Full Name" required>
              <Input
                type="text"
                placeholder="e.g. Rachel Smith"
                value={formName}
                onChange={(e) => {
                  setFormName(e.target.value);
                  setCreateError('');
                }}
                required
              />
            </FormField>

            <FormField label="Work Email" required>
              <Input
                type="email"
                placeholder="e.g. rachel.smith@company.com"
                value={formEmail}
                onChange={(e) => {
                  setFormEmail(e.target.value);
                  setCreateError('');
                }}
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Phone Contact">
              <Input
                type="tel"
                placeholder="+91 98765 12345"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
              />
            </FormField>

            <FormField label="Department" required>
              <Select value={formDept} onChange={(e) => setFormDept(e.target.value)}>
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Job Title" required>
              <Input
                type="text"
                placeholder="e.g. HR Specialist"
                value={formTitle}
                onChange={(e) => {
                  setFormTitle(e.target.value);
                  setCreateError('');
                }}
                required
              />
            </FormField>

            <FormField label="Role & Access Level">
              <Select value={formRole} onChange={(e) => setFormRole(e.target.value as UserRole)}>
                <option value="employee">Employee (Standard Access)</option>
                <option value="hr_officer">HR Officer (Leave & Attendance Admin)</option>
                <option value="admin">Administrator (Full Access)</option>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Monthly Fixed Wage (₹)" required>
              <Input
                type="number"
                value={formWage}
                onChange={(e) => setFormWage(Number(e.target.value))}
                className="font-mono font-bold"
              />
            </FormField>

            <FormField label="Initial Password" required>
              <Input
                type="text"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
              />
            </FormField>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#dee3e9]">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => {
                setShowAddModal(false);
                setCreateError('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              loading={createEmployeeMutation.isPending}
            >
              Create Employee &amp; Credentials
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
