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
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const list = (payroll || []).map((p: any) => {
    const s = p.salaryInfo || {};
    const gross = Number(p.grossSalary || s.monthWage || 50000);
    const deductions = Number(p.deductions || ((s.pfContributionEmployee || (gross * 0.06)) + (s.professionalTax || 200)));
    const net = Number(p.netSalary || (gross - deductions));

    return {
      id: p.userId || p.id,
      userId: p.userId || p.id,
      employeeName: p.name || p.employeeName || 'Employee',
      email: p.email || '',
      department: p.department || 'Engineering',
      jobTitle: p.jobTitle || 'Associate',
      grossSalary: gross,
      deductions: deductions,
      netSalary: net,
      status: p.status || 'processed',
      salaryInfo: s,
    };
  });

  const filtered = list.filter((p) => {
    const matchSearch =
      p.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalNet = list.reduce((s, p) => s + p.netSalary, 0);
  const totalGross = list.reduce((s, p) => s + p.grossSalary, 0);
  const pendingCount = list.filter((p) => p.status === 'draft' || p.status === 'pending').length;

  const handleExportCSV = () => {
    let csv = 'Employee ID,Name,Email,Department,JobTitle,GrossSalary,Deductions,NetTakeHome,Status\n';
    list.forEach((p) => {
      csv += `"${p.id}","${p.employeeName}","${p.email}","${p.department}","${p.jobTitle}",${p.grossSalary},${p.deductions},${p.netSalary},"${p.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Dayflow_Payroll_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess('Payroll records exported as CSV successfully!');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-[32px] sm:text-[40px] font-[600] uppercase tracking-[0.02em] leading-[1.15] text-[#0a1317]">
            Payroll Management
          </h1>
          <p className="text-[15px] font-normal leading-[1.50] tracking-[-0.16px] text-[#5d6c7b] mt-1">
            Process compensation, configure salary structures, and export disbursement sheets
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleExportCSV}>
            <Download className="w-3.5 h-3.5 mr-1" /> Export CSV
          </Button>
          <Button variant="primary" size="md" onClick={() => (window.location.href = '/admin/employees')}>
            <CheckCircle2 className="w-4 h-4 mr-1" /> Configure Employees
          </Button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-[12px] bg-[#e6f4ea] border border-[#31a24c]/30 text-[13px] text-[#1a7f3c] font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#31a24c] flex-shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Summary tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Monthly Gross Budget', value: `₹${totalGross.toLocaleString('en-IN')}`, color: '#0a1317', bg: '#f1f4f7' },
          { label: 'Total Net Take-Home Pay', value: `₹${totalNet.toLocaleString('en-IN')}`, color: '#31a24c', bg: '#e6f4ea' },
          { label: 'Registered Salary Profiles', value: String(list.length), color: '#0064e0', bg: '#e8f0fc' },
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
          <input
            type="text"
            placeholder="Search employee or dept…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 h-10 w-60 rounded-full bg-[#f1f4f7] text-[13px] text-[#1c1e21] placeholder:text-[#8595a4] border-0 outline-none focus:ring-2 focus:ring-[#1876f2]"
          />
        </div>
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
                <TableHead>Department</TableHead>
                <TableHead>Gross Pay</TableHead>
                <TableHead>Deductions (PF+Tax)</TableHead>
                <TableHead>Net Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((rec) => (
                <TableRow key={rec.id} className="hover:bg-[#f1f4f7] transition-colors">
                  <TableCell>
                    <div>
                      <p className="font-bold text-[#0a1317]">{rec.employeeName}</p>
                      <p className="text-[11px] text-[#8595a4]">{rec.email || rec.jobTitle}</p>
                    </div>
                  </TableCell>
                  <TableCell><span className="text-[13px] text-[#5d6c7b]">{rec.department}</span></TableCell>
                  <TableCell><span className="font-mono text-[13px] font-semibold">₹{Number(rec.grossSalary || 0).toLocaleString('en-IN')}</span></TableCell>
                  <TableCell><span className="font-mono text-[13px] text-[#e41e3f]">−₹{Number(rec.deductions || 0).toLocaleString('en-IN')}</span></TableCell>
                  <TableCell><span className="font-mono text-[13px] font-bold text-[#31a24c]">₹{Number(rec.netSalary || 0).toLocaleString('en-IN')}</span></TableCell>
                  <TableCell><Badge status={rec.status} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <a href={`/admin/payroll/${rec.id}/edit`} className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-bold bg-[#f1f4f7] text-[#0a1317] hover:bg-[#dee3e9] transition-colors">
                        Configure Wage
                      </a>
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
