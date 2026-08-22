import React, { useState } from 'react';
import { useAdminEmployee, useUpdateAdminEmployee } from '../hooks/useAdminData';
import { Card } from '../../shared/Card';
import { Button } from '../../shared/Button';
import { FormField, Input } from '../../shared/FormField';
import { Skeleton } from '../../shared/Loading';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export interface AdminPayrollEditViewProps {
  id: string;
}

export const AdminPayrollEditView: React.FC<AdminPayrollEditViewProps> = ({ id }) => {
  const { data: employee, isLoading, isError } = useAdminEmployee(id);
  const updateMutation = useUpdateAdminEmployee();

  const initialWage = employee?.salaryInfo?.monthWage || 50000;
  const [monthlyWage, setMonthlyWage] = useState<number>(initialWage);
  const [workingDays, setWorkingDays] = useState<number>(employee?.salaryInfo?.noOfWorkingDaysPerWeek || 5);
  const [breakTime, setBreakTime] = useState<number>(employee?.salaryInfo?.breakTimeHours || 1);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (employee?.salaryInfo) {
      setMonthlyWage(employee.salaryInfo.monthWage);
      setWorkingDays(employee.salaryInfo.noOfWorkingDaysPerWeek);
      setBreakTime(employee.salaryInfo.breakTimeHours);
    }
  }, [employee]);

  const yearlyWage = monthlyWage * 12;
  const basicSalary = monthlyWage * 0.5;
  const hra = basicSalary * 0.5;
  const pfEmployee = monthlyWage * 0.06;
  const profTax = 200;
  const netEstimated = monthlyWage - pfEmployee - profTax;

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
        <a href="/admin/payroll">
          <Button variant="secondary" size="sm">Back to Payroll</Button>
        </a>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (updateMutation.isPending) return;

    if (!monthlyWage || monthlyWage <= 0) {
      setErrorMsg('Please enter a valid monthly wage.');
      return;
    }

    setErrorMsg('');
    updateMutation.mutate(
      {
        id: employee.id,
        salaryInfo: {
          ...(employee.salaryInfo || {
            standardAllowance: 5000,
            performanceBonus: 5000,
            leaveTravelAllowance: 2500,
            fixedAllowance: 0,
          }),
          monthWage: monthlyWage,
          yearlyWage,
          basicSalary,
          houseRentAllowance: hra,
          pfContributionEmployee: pfEmployee,
          pfContributionEmployer: pfEmployee,
          professionalTax: profTax,
          noOfWorkingDaysPerWeek: workingDays,
          breakTimeHours: breakTime,
        },
      },
      {
        onSuccess: () => {
          setSavedSuccess(true);
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.location.href = `/admin/payroll`;
            }
          }, 1000);
        },
        onError: () => {
          setErrorMsg('Failed to update salary configuration.');
        },
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans text-[#1c1e21]">
      <div className="flex items-center justify-between">
        <a href="/admin/payroll" className="inline-flex items-center text-[13px] font-bold text-[#0a1317] hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Cancel &amp; Back</span>
        </a>
        <span className="text-[13px] text-[#5d6c7b] font-bold">Salary Structure Configuration</span>
      </div>

      <Card variant="feature" className="p-6 space-y-6">
        <div className="border-b border-[#dee3e9] pb-3">
          <h2 className="text-[20px] font-bold text-[#0a1317] tracking-tight">Configure Wage: {employee.name}</h2>
          <p className="text-[13px] text-[#5d6c7b] mt-0.5">{employee.jobTitle} &bull; {employee.department}</p>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-[12px] bg-[#e6f4ea] border border-[#31a24c]/30 text-[13px] text-[#1a7f3c] font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#31a24c] flex-shrink-0" />
            <span>Salary components updated and recalculated successfully! Redirecting...</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-[12px] bg-[#fde8ec] border border-[#f0284a]/20 text-[13px] text-[#c0122e] font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#e41e3f] flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Monthly Fixed Wage (₹)" required>
            <Input
              type="number"
              value={monthlyWage}
              onChange={(e) => setMonthlyWage(Number(e.target.value))}
              className="font-mono text-[16px] font-bold text-[#0a1317]"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Working Days per Week">
              <Input
                type="number"
                value={workingDays}
                onChange={(e) => setWorkingDays(Number(e.target.value))}
              />
            </FormField>

            <FormField label="Break Time Hours per Shift">
              <Input
                type="number"
                value={breakTime}
                onChange={(e) => setBreakTime(Number(e.target.value))}
              />
            </FormField>
          </div>

          {/* Automatic Recalculations Display */}
          <div className="p-4 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9] space-y-3">
            <h4 className="text-[12px] font-bold text-[#0a1317] uppercase tracking-wider">Automatic Component Calculations</h4>
            
            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <span className="text-[#5d6c7b] block text-[11px]">Yearly Derived Wage:</span>
                <span className="font-mono font-bold text-[#0a1317]">₹{yearlyWage.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[#5d6c7b] block text-[11px]">Basic Salary (50%):</span>
                <span className="font-mono font-bold text-[#0a1317]">₹{basicSalary.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[#5d6c7b] block text-[11px]">HRA (50% of Basic):</span>
                <span className="font-mono font-bold text-[#0a1317]">₹{hra.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[#5d6c7b] block text-[11px]">PF Deduction (Employee):</span>
                <span className="font-mono font-bold text-[#e41e3f]">₹{pfEmployee.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[#5d6c7b] block text-[11px]">Professional Tax:</span>
                <span className="font-mono font-bold text-[#e41e3f]">₹{profTax}</span>
              </div>
              <div>
                <span className="text-[#5d6c7b] block text-[11px]">Estimated Monthly Net:</span>
                <span className="font-mono font-bold text-[#31a24c]">₹{netEstimated.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-[#dee3e9]">
            <a href="/admin/payroll">
              <Button variant="ghost" size="sm" type="button" disabled={updateMutation.isPending}>
                Cancel
              </Button>
            </a>
            <Button variant="primary" size="sm" type="submit" loading={updateMutation.isPending} disabled={updateMutation.isPending}>
              Save Salary Structure
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
