import React, { useState } from 'react';
import { useAdminEmployee } from '../hooks/useAdminData';
import { Card } from '../../shared/Card';
import { Button } from '../../shared/Button';
import { Badge } from '../../shared/Badge';
import { Skeleton } from '../../shared/Loading';
import { ArrowLeft, Edit, User, Lock, DollarSign } from 'lucide-react';

export interface AdminEmployeeDetailViewProps {
  id: string;
}

export const AdminEmployeeDetailView: React.FC<AdminEmployeeDetailViewProps> = ({ id }) => {
  const { data: employee, isLoading, isError } = useAdminEmployee(id);
  const [activeTab, setActiveTab] = useState<'profile' | 'private' | 'salary'>('profile');

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <Skeleton className="h-40 w-full rounded-[16px]" />
        <Skeleton className="h-64 w-full rounded-[16px]" />
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="p-8 text-center space-y-3 max-w-md mx-auto">
        <h3 className="text-[18px] font-bold text-[#e41e3f]">Employee Not Found</h3>
        <p className="text-[14px] text-[#5d6c7b]">The requested employee record ({id}) could not be located.</p>
        <a href="/admin/employees">
          <Button variant="secondary" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Back to Directory</span>
          </Button>
        </a>
      </div>
    );
  }

  const sal = employee.salaryInfo;
  const bank = employee.bankDetails;

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-[#1c1e21]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <a href="/admin/employees" className="inline-flex items-center text-[13px] font-bold text-[#0a1317] hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Directory</span>
        </a>
        <a href={`/admin/employees/${employee.id}/edit`}>
          <Button variant="primary" size="sm">
            <Edit className="w-3.5 h-3.5 mr-1.5" />
            <span>Edit Record</span>
          </Button>
        </a>
      </div>

      {/* Profile Card Header */}
      <Card variant="feature" className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img src={employee.avatar} alt="" className="w-16 h-16 rounded-[12px] object-cover border border-[#dee3e9] shadow-2xs" />
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <h2 className="text-[22px] font-bold text-[#0a1317] tracking-tight">{employee.name}</h2>
                <Badge status={employee.workStatus} />
              </div>
              <p className="text-[13px] text-[#5d6c7b]">{employee.jobTitle} &bull; {employee.department}</p>
              <p className="font-mono text-[12px] font-bold text-[#0a1317]">ID: {employee.loginId}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#dee3e9] space-x-6 text-[13px] font-semibold">
        {[
          { key: 'profile', label: 'Employee Profile', icon: User },
          { key: 'private', label: 'Private Information', icon: Lock },
          { key: 'salary', label: 'Salary Structure (Admin Only)', icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-1.5 py-2.5 border-b-2 transition-colors cursor-pointer ${
                isActive ? 'border-[#0a1317] text-[#0a1317] font-bold' : 'border-transparent text-[#5d6c7b] hover:text-[#0a1317]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
          <Card variant="feature" className="p-4 space-y-2">
            <span className="text-[11px] uppercase font-bold text-[#8595a4] block">Work Details</span>
            <div>
              <span className="text-[#5d6c7b] block text-[12px]">Company &amp; Department:</span>
              <span className="font-bold text-[#0a1317]">{employee.company} &bull; {employee.department}</span>
            </div>
            <div>
              <span className="text-[#5d6c7b] block text-[12px]">Reporting Manager:</span>
              <span className="font-bold text-[#0a1317]">{employee.manager}</span>
            </div>
          </Card>

          <Card variant="feature" className="p-4 space-y-2">
            <span className="text-[11px] uppercase font-bold text-[#8595a4] block">Contact Info</span>
            <div>
              <span className="text-[#5d6c7b] block text-[12px]">Work Email:</span>
              <span className="font-semibold text-[#0a1317]">{employee.email}</span>
            </div>
            <div>
              <span className="text-[#5d6c7b] block text-[12px]">Phone Contact:</span>
              <span className="font-semibold text-[#0a1317]">{employee.phone}</span>
            </div>
          </Card>
        </div>
      )}

      {/* Private Info Tab */}
      {activeTab === 'private' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
          <Card variant="feature" className="p-4 space-y-2">
            <span className="text-[11px] uppercase font-bold text-[#8595a4] block">Personal Background</span>
            <div>
              <span className="text-[#5d6c7b] block text-[12px]">Date of Birth:</span>
              <span className="font-mono font-semibold text-[#0a1317]">{employee.dob || '1995-06-15'}</span>
            </div>
            <div>
              <span className="text-[#5d6c7b] block text-[12px]">Residing Address:</span>
              <span className="font-medium text-[#0a1317]">{employee.residingAddress || '42 Silicon Avenue, Tech Park'}</span>
            </div>
          </Card>

          <Card variant="feature" className="p-4 space-y-2">
            <span className="text-[11px] uppercase font-bold text-[#8595a4] block">Bank Account &amp; Tax</span>
            <div>
              <span className="text-[#5d6c7b] block text-[12px]">Bank Account:</span>
              <span className="font-mono font-semibold text-[#0a1317]">{bank?.bankName || 'HDFC Bank'} &bull; {bank?.accountNumber || '918237465012'}</span>
            </div>
            <div>
              <span className="text-[#5d6c7b] block text-[12px]">PAN Number:</span>
              <span className="font-mono font-semibold text-[#0a1317]">{bank?.panNo || 'ABCDE1234F'}</span>
            </div>
          </Card>
        </div>
      )}

      {/* Salary Info Tab */}
      {activeTab === 'salary' && (
        <Card variant="feature" className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#dee3e9] pb-3">
            <h3 className="text-[16px] font-bold text-[#0a1317]">Salary Breakdown (Admin Configuration)</h3>
            <a href={`/admin/payroll/${employee.id}/edit`}>
              <Button variant="secondary" size="sm">
                Configure Wage &amp; Components
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[13px]">
            <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9]">
              <span className="text-[11px] uppercase font-bold text-[#8595a4] block">Monthly Gross Wage</span>
              <span className="text-[20px] font-bold font-mono text-[#0a1317]">₹{sal?.monthWage.toLocaleString('en-IN') || '50,000'}</span>
            </div>
            <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9]">
              <span className="text-[11px] uppercase font-bold text-[#8595a4] block">Basic Salary (50%)</span>
              <span className="text-[20px] font-bold font-mono text-[#0a1317]">₹{sal?.basicSalary.toLocaleString('en-IN') || '25,000'}</span>
            </div>
            <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9]">
              <span className="text-[11px] uppercase font-bold text-[#8595a4] block">HRA (50% of Basic)</span>
              <span className="text-[20px] font-bold font-mono text-[#0a1317]">₹{sal?.houseRentAllowance.toLocaleString('en-IN') || '12,500'}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
