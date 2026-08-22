import React, { useState } from 'react';
import { Card } from '../../shared/Card';
import { Badge } from '../../shared/Badge';
import { Button } from '../../shared/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../shared/Table';
import { EmptyState } from '../../shared/EmptyState';
import { Skeleton } from '../../shared/Loading';
import { useAdminPayroll } from '../hooks/useAdminData';
import { AlertCircle, RefreshCw, DollarSign, Download, Search, CheckCircle2 } from 'lucide-react';

export const AdminPayrollView: React.FC = () => {
  const { data: payroll, isLoading, isError, refetch } = useAdminPayroll();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const list = payroll || [];
  const filtered = list.filter((p) => {
    const matchSearch = p.employeeName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalNet = list.reduce((s, p) => s + (Number(p.netSalary) || 0), 0);
  const totalGross = list.reduce((s, p) => s + (Number(p.grossSalary) || 0), 0);
  const pendingCount = list.filter((p) => p.status === 'draft' || p.status === 'processed').length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-[32px] sm:text-[40px] font-[600] uppercase tracking-[0.02em] leading-[1.15] text-[#0a1317]">
            Payroll
          </h1>
          <p className="text-[15px] font-normal leading-[1.50] tracking-[-0.16px] text-[#5d6c7b] mt-1">
            Process and manage employee payslips
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm"><Download className="w-3.5 h-3.5" /> Export</Button>
          <Button variant="primary" size="md" onClick={() => window.location.href = '/admin/payroll/new'}>
            <CheckCircle2 className="w-4 h-4" /> Process Payroll
          </Button>
        </div>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Gross Pay', value: `₹${totalGross.toLocaleString('en-IN')}`, color: '#0a1317', bg: '#f1f4f7' },
          { label: 'Total Net Pay', value: `₹${totalNet.toLocaleString('en-IN')}`, color: '#31a24c', bg: '#e6f4ea' },
          { label: 'Pending Payslips', value: String(pendingCount), color: '#e41e3f', bg: '#fde8ec' },
        ].map(({ label, value, color, bg }) => (
          <Card variant="feature" key={label} className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
              <DollarSign className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#8595a4]">{label}</p>
              <p className="text-[20px] font-[500] text-[#0a1317] mt-0.5" style={{ color }}>{isLoading ? '—' : value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8595a4]" />
          <input type="text" placeholder="Search employee…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 h-10 w-52 rounded-full bg-[#f1f4f7] text-[13px] text-[#1c1e21] placeholder:text-[#8595a4] border-0 outline-none focus:ring-2 focus:ring-[#1876f2]" />
        </div>
        {['all', 'paid', 'draft'].map((tab) => (
          <button key={tab} type="button" onClick={() => setStatusFilter(tab)}
            className={['px-4 py-2 rounded-full text-[13px] font-bold capitalize transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1876f2]',
              statusFilter === tab ? 'bg-[#0a1317] text-white' : 'bg-white text-[#1c1e21] border border-[#ced0d4] hover:bg-[#f1f4f7]'].join(' ')}>
            {tab}
          </button>
        ))}
      </div>

      <Card variant="feature" className="overflow-hidden">
        {isLoading && <div className="p-4 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 rounded-[8px]" />)}</div>}
        {isError && (
          <div className="p-10 flex flex-col items-center gap-3 text-center">
            <AlertCircle className="w-6 h-6 text-[#e41e3f]" />
            <p className="text-[14px] font-bold text-[#0a1317]">Failed to load payroll data</p>
            <Button variant="ghost" size="sm" onClick={() => refetch()}><RefreshCw className="w-3.5 h-3.5" /> Retry</Button>
          </div>
        )}
        {!isLoading && !isError && filtered.length === 0 && (
          <EmptyState title="No payroll records" description="No payslips match the current filter." icon={<DollarSign className="w-5 h-5" />} />
        )}
        {!isLoading && !isError && filtered.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Gross Pay</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((rec) => (
                <TableRow key={rec.id} className="hover:bg-[#f1f4f7] transition-colors">
                  <TableCell><span className="font-bold text-[#0a1317]">{rec.employeeName}</span></TableCell>
                  <TableCell>{rec.month}</TableCell>
                  <TableCell><span className="font-mono text-[13px]">₹{Number(rec.grossSalary || 0).toLocaleString('en-IN')}</span></TableCell>
                  <TableCell><span className="font-mono text-[13px] text-[#e41e3f]">−₹{Number(rec.deductions || 0).toLocaleString('en-IN')}</span></TableCell>
                  <TableCell><span className="font-mono text-[13px] font-bold text-[#31a24c]">₹{Number(rec.netSalary || 0).toLocaleString('en-IN')}</span></TableCell>
                  <TableCell><Badge status={rec.status} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <a href={`/admin/payroll/${rec.id}/edit`} className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-bold bg-[#f1f4f7] text-[#0a1317] hover:bg-[#dee3e9] transition-colors">
                        Edit
                      </a>
                      <button className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-bold bg-[#f1f4f7] text-[#0a1317] hover:bg-[#dee3e9] transition-colors">
                        <Download className="w-3 h-3 mr-1" /> PDF
                      </button>
                    </div>
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
