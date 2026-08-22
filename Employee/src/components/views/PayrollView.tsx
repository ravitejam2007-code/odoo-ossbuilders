import React from 'react';
import { Download, Lock, RefreshCw, AlertCircle } from 'lucide-react';
import { usePayslips } from '../../hooks/useEmployeeData';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { LoadingSpinner, Skeleton } from '../ui/Loading';
import { EmptyState } from '../ui/EmptyState';

export const PayrollView: React.FC = () => {
  const { currentUser } = useAuth();
  const { data: payslips, isLoading, isError, refetch } = usePayslips(currentUser?.id);

  if (!currentUser) return null;
  const sal = currentUser.salaryInfo;

  const list = payslips || [];

  return (
    <div className="space-y-8 font-sans text-zinc-900">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">My Payroll & Payslips</h1>
          <p className="text-xs font-semibold text-zinc-500 mt-1">
            Official monthly wage breakdown, statutory contributions, and downloadable payslip archives.
          </p>
        </div>

        {/* Read-Only Notice Badge */}
        <div className="px-4 py-2 rounded-full bg-zinc-100 border border-zinc-200 flex items-center space-x-2 text-xs font-bold text-zinc-700">
          <Lock className="w-4 h-4 text-zinc-950" />
          <span>Read-Only Employee View</span>
        </div>
      </div>

      {/* Salary Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-white border-zinc-200">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Monthly Gross Wage</span>
          <p className="text-3xl font-black text-zinc-950 mt-1 font-mono">
            ₹{sal?.monthWage.toLocaleString('en-IN') || '50,000'}
          </p>
          <span className="text-[10px] font-bold text-zinc-600 mt-1 block">Yearly: ₹{sal?.yearlyWage.toLocaleString('en-IN') || '600,000'}</span>
        </Card>

        <Card className="p-6 bg-white border-zinc-200">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Basic Salary (50%)</span>
          <p className="text-3xl font-black text-zinc-950 mt-1 font-mono">
            ₹{sal?.basicSalary.toLocaleString('en-IN') || '25,000'}
          </p>
          <span className="text-[10px] font-bold text-zinc-600 mt-1 block">HRA: ₹{sal?.houseRentAllowance.toLocaleString('en-IN') || '12,500'}</span>
        </Card>

        <Card className="p-6 bg-white border-zinc-200">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Monthly Deductions (PF+PT)</span>
          <p className="text-3xl font-black text-zinc-950 mt-1 font-mono">
            ₹{((sal?.pfContributionEmployee || 3000) + (sal?.professionalTax || 200)).toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] font-bold text-zinc-600 mt-1 block">PF: ₹3,000 | PT: ₹200</span>
        </Card>

        <Card className="p-6 bg-white border-zinc-200">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Estimated Net Salary</span>
          <p className="text-3xl font-black text-zinc-950 mt-1 font-mono">
            ₹{((sal?.monthWage || 50000) - (sal?.pfContributionEmployee || 3000) - (sal?.professionalTax || 200)).toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] font-bold text-zinc-600 mt-1 block">Direct Bank Transfer</span>
        </Card>
      </div>

      {/* Monthly Payslips Table */}
      <Card className="overflow-hidden bg-white border-zinc-200">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-base font-black text-zinc-950">Monthly Payslip Archives</h3>
          <span className="text-xs font-bold text-zinc-700 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
            FY 2026-2027
          </span>
        </div>

        {/* LOADING SKELETONS */}
        {isLoading && (
          <div className="p-6 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}

        {/* ERROR STATE */}
        {isError && (
          <div className="p-8 text-center space-y-3 bg-rose-50/50">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
            <h4 className="text-sm font-bold text-rose-900">Failed to load payslips</h4>
            <p className="text-xs text-rose-700">A network error occurred while fetching your salary slips.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-full hover:bg-rose-700 inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Request</span>
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !isError && list.length === 0 && (
          <EmptyState
            title="No payslips generated"
            description="Your monthly payslips will be published here upon HR processing."
          />
        )}

        {/* TABLE DISPLAY */}
        {!isLoading && !isError && list.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month & Year</TableHead>
                <TableHead>Paid Days</TableHead>
                <TableHead>Gross Amount</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((pay) => (
                <TableRow key={pay.id}>
                  <TableCell className="font-bold text-zinc-950 font-mono">{pay.month} {pay.year}</TableCell>
                  <TableCell className="font-semibold text-zinc-600 font-mono">{pay.paidDays} Days</TableCell>
                  <TableCell className="font-mono font-bold text-zinc-950">₹{pay.grossSalary.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="font-mono text-rose-700 font-bold">₹{pay.deductions.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="font-mono text-emerald-700 font-bold">₹{pay.netSalary.toLocaleString('en-IN')}</TableCell>
                  <TableCell>
                    <Badge status={pay.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => alert(`Downloading Payslip PDF for ${pay.month} ${pay.year}...`)}
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      <span>Download PDF</span>
                    </Button>
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
