import React, { useState } from 'react';
import { usePayslips } from '../hooks/useEmployeeData';
import { useAuth } from '../context/AuthContext';
import { Card } from '../../shared/Card';
import { Badge } from '../../shared/Badge';
import { Button } from '../../shared/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../shared/Table';
import { Skeleton } from '../../shared/Loading';
import { EmptyState } from '../../shared/EmptyState';
import { AlertCircle, RefreshCw, Download, DollarSign, TrendingUp, ChevronRight, FileText } from 'lucide-react';

export const PayrollView: React.FC = () => {
  const { currentUser } = useAuth();
  const { data: payslips, isLoading, isError, refetch } = usePayslips();
  const [selected, setSelected] = useState<string | null>(null);

  const latest = payslips?.[0];

  if (!currentUser) return null;

  return (
    <div className="space-y-8">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#0a1317] tracking-tight leading-tight">
            Payroll
          </h1>
          <p className="text-[14px] text-[#5d6c7b] mt-1 font-normal">
            Monthly salary details and payslips
          </p>
        </div>
      </div>

      {/* ── Latest Payslip Hero Card ──────────────────────────────── */}
      {isLoading ? (
        <Skeleton className="h-44 rounded-[16px]" />
      ) : latest ? (
        /* DESIGN-meta: card-promo-strip dark for the main salary display */
        <Card variant="promo" className="p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#8595a4]">
                Latest Payslip · {latest.month}
              </p>
              {/* DESIGN-meta: display-lg (48px) for net pay */}
              <h2 className="text-[40px] sm:text-[48px] font-[500] leading-[1.17] tracking-[0] text-white">
                ₹{Number(latest.netPay).toLocaleString('en-IN')}
              </h2>
              <p className="text-[16px] font-normal text-[#8595a4]">Net take-home</p>
              <div className="flex items-center gap-2 pt-1">
                <Badge status={latest.status} />
                <span className="text-[12px] font-normal text-[#8595a4]">Processed on {latest.processedDate}</span>
              </div>
            </div>
            <Button variant="secondary" size="md"
              className="bg-transparent border-white/40 text-white hover:bg-white/10 flex-shrink-0 self-start sm:self-auto"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </Button>
          </div>
        </Card>
      ) : null}

      {/* ── Salary Breakdown ──────────────────────────────────────── */}
      {latest && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* DESIGN-meta: why-buy-tile style with card-icon-feature chrome */}
          {[
            { label: 'Gross Pay', value: `₹${Number(latest.grossPay || 55000).toLocaleString('en-IN')}`, icon: DollarSign, color: '#31a24c' },
            { label: 'Deductions', value: `₹${Number(latest.deductions || 8200).toLocaleString('en-IN')}`, icon: TrendingUp, color: '#e41e3f' },
            { label: 'Net Pay', value: `₹${Number(latest.netPay).toLocaleString('en-IN')}`, icon: DollarSign, color: '#0064e0' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card variant="feature" key={label} className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '1a' }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#8595a4]">{label}</p>
                <p className="text-[20px] font-[500] leading-[1.25] text-[#0a1317] tracking-[0] mt-0.5">
                  {value}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Payslip History Table ─────────────────────────────────── */}
      <div>
        <h2 className="text-[20px] font-[500] leading-[1.25] text-[#0a1317] tracking-[0] mb-5">
          Payslip History
        </h2>

        <Card variant="feature" className="overflow-hidden">
          {isLoading && (
            <div className="p-4 space-y-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 rounded-[8px]" />)}
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

          {!isLoading && !isError && (!payslips || payslips.length === 0) && (
            <EmptyState
              title="No payslips yet"
              description="Payslips will appear here once processed by HR."
              icon={<FileText className="w-5 h-5" />}
            />
          )}

          {!isLoading && !isError && payslips && payslips.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
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
                      <span className="font-bold text-[#0a1317]">{slip.month}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-[13px]">
                        ₹{Number(slip.grossPay || 55000).toLocaleString('en-IN')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-[13px] text-[#e41e3f]">
                        −₹{Number(slip.deductions || 8200).toLocaleString('en-IN')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-[13px] font-bold text-[#31a24c]">
                        ₹{Number(slip.netPay).toLocaleString('en-IN')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge status={slip.status} />
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold text-[#0a1317] border border-[#dee3e9] bg-white hover:bg-[#f1f4f7] transition-colors"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Download payslip for ${slip.month}`}
                      >
                        <Download className="w-3 h-3" />
                        PDF
                      </button>
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
