import React, { useState } from 'react';
import { usePayroll } from '../hooks/useEmployeeData';
import { useAuth } from '../context/AuthContext';
import { Card } from '../../shared/Card';
import { Badge } from '../../shared/Badge';
import { Button } from '../../shared/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../shared/Table';
import { Skeleton } from '../../shared/Loading';
import { EmptyState } from '../../shared/EmptyState';
import {
  AlertCircle,
  RefreshCw,
  Download,
  DollarSign,
  TrendingUp,
  Building2,
  FileText,
  CreditCard,
} from 'lucide-react';

export const PayrollView: React.FC = () => {
  const { currentUser } = useAuth();
  const { data: payrollData, isLoading, isError, refetch } = usePayroll();
  const [selected, setSelected] = useState<string | null>(null);

  const salaryInfo = payrollData?.salaryInfo || currentUser?.salaryInfo;
  const bankDetails = payrollData?.bankDetails || currentUser?.bankDetails;
  const payslips = payrollData?.payslips || [];
  const latestPayslip = payslips[0];

  // Compute breakdown metrics
  const grossEarnings =
    latestPayslip?.grossSalary ||
    (salaryInfo
      ? (salaryInfo.basicSalary || 0) +
        (salaryInfo.houseRentAllowance || 0) +
        (salaryInfo.standardAllowance || 0) +
        (salaryInfo.performanceBonus || 0) +
        (salaryInfo.leaveTravelAllowance || 0) +
        (salaryInfo.fixedAllowance || 0)
      : 0);

  const totalDeductions =
    latestPayslip?.deductions ||
    (salaryInfo
      ? (salaryInfo.pfContributionEmployee || 0) + (salaryInfo.professionalTax || 0)
      : 0);

  const netPay =
    latestPayslip?.netSalary ||
    (grossEarnings > 0 ? grossEarnings - totalDeductions : salaryInfo?.monthWage || 0);

  if (!currentUser) return null;

  return (
    <div className="space-y-8 font-sans">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#0a1317] tracking-tight leading-tight">
            Payroll &amp; Compensation
          </h1>
          <p className="text-[14px] text-[#5d6c7b] mt-1 font-normal">
            Monthly salary structure, statutory deductions, and payslip downloads
          </p>
        </div>
      </div>

      {/* ── Latest Payslip Hero Card ──────────────────────────────── */}
      {isLoading ? (
        <Skeleton className="h-44 rounded-[16px]" />
      ) : netPay > 0 ? (
        <Card variant="promo" className="p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#8595a4]">
                Monthly Net Take-Home · {latestPayslip?.month || 'Current Cycle'}
              </p>
              <h2 className="text-[40px] sm:text-[48px] font-[500] leading-[1.17] tracking-[0] text-white">
                ₹{Number(netPay).toLocaleString('en-IN')}
              </h2>
              <p className="text-[15px] font-normal text-[#8595a4]">
                Disbursed to {bankDetails?.bankName ? `${bankDetails.bankName} (A/C: ••••${bankDetails.accountNumber.slice(-4)})` : 'registered bank account'}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Badge status={latestPayslip?.status || 'processed'} />
                <span className="text-[12px] font-normal text-[#8595a4]">
                  {salaryInfo?.noOfWorkingDaysPerWeek ? `${salaryInfo.noOfWorkingDaysPerWeek} Workdays / Week` : '5-Day Work Week'}
                </span>
              </div>
            </div>

            {latestPayslip?.pdfUrl && (
              <a href={latestPayslip.pdfUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="secondary"
                  size="md"
                  className="bg-transparent border-white/40 text-white hover:bg-white/10 flex-shrink-0"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  <span>Download Payslip</span>
                </Button>
              </a>
            )}
          </div>
        </Card>
      ) : null}

      {/* ── Salary Breakdown Tiles ─────────────────────────────────── */}
      {grossEarnings > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Gross Monthly Pay',
              value: `₹${Number(grossEarnings).toLocaleString('en-IN')}`,
              icon: DollarSign,
              color: '#31a24c',
              sub: 'Basic + Allowances',
            },
            {
              label: 'Statutory Deductions',
              value: `₹${Number(totalDeductions).toLocaleString('en-IN')}`,
              icon: TrendingUp,
              color: '#e41e3f',
              sub: 'PF Contribution + PT',
            },
            {
              label: 'Net Take-Home Pay',
              value: `₹${Number(netPay).toLocaleString('en-IN')}`,
              icon: CreditCard,
              color: '#0064e0',
              sub: 'Direct Bank Transfer',
            },
          ].map(({ label, value, icon: Icon, color, sub }) => (
            <Card variant="feature" key={label} className="p-5 flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: color + '1a' }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#8595a4]">{label}</p>
                <p className="text-[20px] font-semibold text-[#0a1317] tracking-tight mt-0.5">{value}</p>
                <p className="text-[12px] text-[#5d6c7b] mt-0.5">{sub}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Salary Details Grid ────────────────────────────────────── */}
      {salaryInfo && (
        <Card variant="feature" className="p-6 space-y-4">
          <div className="border-b border-[#dee3e9] pb-3">
            <h2 className="text-[17px] font-semibold text-[#0a1317]">Salary Structure Breakdown</h2>
            <p className="text-[13px] text-[#5d6c7b]">Detailed line-item compensation metrics</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[13px]">
            <div className="p-3 rounded-[10px] bg-[#f1f4f7]">
              <span className="text-[11px] font-bold text-[#8595a4] block uppercase">Basic Salary</span>
              <span className="font-mono font-bold text-[#0a1317] mt-0.5 block">
                ₹{Number(salaryInfo.basicSalary || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 rounded-[10px] bg-[#f1f4f7]">
              <span className="text-[11px] font-bold text-[#8595a4] block uppercase">HRA</span>
              <span className="font-mono font-bold text-[#0a1317] mt-0.5 block">
                ₹{Number(salaryInfo.houseRentAllowance || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 rounded-[10px] bg-[#f1f4f7]">
              <span className="text-[11px] font-bold text-[#8595a4] block uppercase">Standard Allowance</span>
              <span className="font-mono font-bold text-[#0a1317] mt-0.5 block">
                ₹{Number(salaryInfo.standardAllowance || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 rounded-[10px] bg-[#f1f4f7]">
              <span className="text-[11px] font-bold text-[#8595a4] block uppercase">Performance Bonus</span>
              <span className="font-mono font-bold text-[#0a1317] mt-0.5 block">
                ₹{Number(salaryInfo.performanceBonus || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 rounded-[10px] bg-[#f1f4f7]">
              <span className="text-[11px] font-bold text-[#8595a4] block uppercase">Employee PF</span>
              <span className="font-mono font-bold text-[#e41e3f] mt-0.5 block">
                −₹{Number(salaryInfo.pfContributionEmployee || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 rounded-[10px] bg-[#f1f4f7]">
              <span className="text-[11px] font-bold text-[#8595a4] block uppercase">Professional Tax</span>
              <span className="font-mono font-bold text-[#e41e3f] mt-0.5 block">
                −₹{Number(salaryInfo.professionalTax || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 rounded-[10px] bg-[#f1f4f7]">
              <span className="text-[11px] font-bold text-[#8595a4] block uppercase">Annual CTC Wage</span>
              <span className="font-mono font-bold text-[#0064e0] mt-0.5 block">
                ₹{Number(salaryInfo.yearlyWage || salaryInfo.monthWage * 12 || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 rounded-[10px] bg-[#f1f4f7]">
              <span className="text-[11px] font-bold text-[#8595a4] block uppercase">Employer PF</span>
              <span className="font-mono font-bold text-[#31a24c] mt-0.5 block">
                ₹{Number(salaryInfo.pfContributionEmployer || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* ── Payslip History Table ─────────────────────────────────── */}
      <div>
        <h2 className="text-[20px] font-semibold text-[#0a1317] tracking-tight mb-5">
          Generated Payslip Records
        </h2>

        <Card variant="feature" className="overflow-hidden">
          {isLoading && (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-[8px]" />
              ))}
            </div>
          )}

          {isError && (
            <div className="p-8 flex flex-col items-center gap-3 text-center">
              <AlertCircle className="w-6 h-6 text-[#e41e3f]" />
              <p className="text-[14px] font-bold text-[#0a1317]">Failed to load payroll data</p>
              <Button variant="ghost" size="sm" onClick={() => refetch()}>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </Button>
            </div>
          )}

          {!isLoading && !isError && payslips.length === 0 && (
            <EmptyState
              title="No processed payslips yet"
              description="Monthly payslips will appear here once finalized by HR & Finance."
              icon={<FileText className="w-5 h-5" />}
            />
          )}

          {!isLoading && !isError && payslips.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month &amp; Year</TableHead>
                  <TableHead>Gross Pay</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Pay</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payslips.map((slip) => (
                  <TableRow
                    key={slip.id}
                    className="cursor-pointer hover:bg-[#f1f4f7] transition-colors"
                    onClick={() => setSelected(slip.id === selected ? null : slip.id)}
                  >
                    <TableCell>
                      <span className="font-bold text-[#0a1317]">
                        {slip.month} {slip.year}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-[13px]">
                        ₹{Number(slip.grossSalary).toLocaleString('en-IN')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-[13px] text-[#e41e3f]">
                        −₹{Number(slip.deductions).toLocaleString('en-IN')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-[13px] font-bold text-[#31a24c]">
                        ₹{Number(slip.netSalary).toLocaleString('en-IN')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge status={slip.status} />
                    </TableCell>
                    <TableCell>
                      {slip.pdfUrl ? (
                        <a
                          href={slip.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold text-[#0a1317] border border-[#dee3e9] bg-white hover:bg-[#f1f4f7] transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </a>
                      ) : (
                        <span className="text-[12px] text-[#8595a4] font-medium">Processed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
};
