import React, { useState } from 'react';
import { Card } from '../../shared/Card';
import { Badge } from '../../shared/Badge';
import { Button } from '../../shared/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../shared/Table';
import { EmptyState } from '../../shared/EmptyState';
import { Skeleton } from '../../shared/Loading';
import { useAdminAttendance } from '../hooks/useAdminData';
import { AlertCircle, RefreshCw, Clock, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export const AdminAttendanceView: React.FC = () => {
  const { data: records, isLoading, isError, refetch } = useAdminAttendance();
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const list = records || [];
  const filtered = list.filter((r) =>
    r.employeeName?.toLowerCase().includes(search.toLowerCase())
  );

  const navigateMonth = (dir: number) => {
    const d = new Date(year, month + dir);
    setMonth(d.getMonth());
    setYear(d.getFullYear());
  };

  const summary = {
    present: list.filter((r) => r.status === 'present').length,
    absent:  list.filter((r) => r.status === 'absent').length,
    leave:   list.filter((r) => r.status?.includes('leave')).length,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-[32px] sm:text-[40px] font-[600] uppercase tracking-[0.02em] leading-[1.15] text-[#0a1317]">
            Attendance
          </h1>
          <p className="text-[15px] font-normal leading-[1.50] tracking-[-0.16px] text-[#5d6c7b] mt-1">
            Employee attendance records and daily logs
          </p>
        </div>
        <Button variant="ghost" size="sm">
          <Download className="w-3.5 h-3.5" /> Export
        </Button>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Present', value: summary.present, color: '#31a24c', bg: '#e6f4ea' },
          { label: 'Absent', value: summary.absent, color: '#e41e3f', bg: '#fde8ec' },
          { label: 'On Leave', value: summary.leave, color: '#5d6c7b', bg: '#f1f4f7' },
        ].map(({ label, value, color, bg }) => (
          <Card variant="feature" key={label} className="p-5">
            <span className="text-[28px] font-[500] leading-[1.17]" style={{ color }}>{isLoading ? '—' : value}</span>
            <p className="text-[13px] font-normal text-[#5d6c7b] mt-1">{label}</p>
          </Card>
        ))}
      </div>

      {/* Month nav + search */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigateMonth(-1)} className="w-9 h-9 rounded-full border border-[#dee3e9] bg-white hover:bg-[#f1f4f7] flex items-center justify-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1876f2]">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[16px] font-bold text-[#0a1317] min-w-[100px] text-center">{MONTHS[month]} {year}</span>
          <button onClick={() => navigateMonth(1)} className="w-9 h-9 rounded-full border border-[#dee3e9] bg-white hover:bg-[#f1f4f7] flex items-center justify-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1876f2]">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8595a4]" />
          <input type="text" placeholder="Search employee…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 h-10 w-52 rounded-full bg-[#f1f4f7] text-[13px] text-[#1c1e21] placeholder:text-[#8595a4] border-0 outline-none focus:ring-2 focus:ring-[#1876f2]" />
        </div>
      </div>

      <Card variant="feature" className="overflow-hidden">
        {isLoading && (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 rounded-[8px]" />)}
          </div>
        )}
        {isError && (
          <div className="p-10 flex flex-col items-center gap-3 text-center">
            <AlertCircle className="w-6 h-6 text-[#e41e3f]" />
            <p className="text-[14px] font-bold text-[#0a1317]">Failed to load attendance</p>
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </Button>
          </div>
        )}
        {!isLoading && !isError && filtered.length === 0 && (
          <EmptyState title="No records found" description="No attendance data for this period." icon={<Clock className="w-5 h-5" />} />
        )}
        {!isLoading && !isError && filtered.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((rec, i) => (
                <TableRow key={`${rec.employeeId}-${rec.date}-${i}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#f1f4f7] flex items-center justify-center text-[11px] font-bold text-[#0a1317] flex-shrink-0">
                        {rec.employeeName?.charAt(0) || '?'}
                      </div>
                      <span className="font-bold text-[#0a1317]">{rec.employeeName}</span>
                    </div>
                  </TableCell>
                  <TableCell><span className="font-mono text-[12px]">{rec.date}</span></TableCell>
                  <TableCell><span className="font-mono text-[13px] font-bold text-[#31a24c]">{rec.checkIn || '—'}</span></TableCell>
                  <TableCell><span className="font-mono text-[13px] font-bold text-[#e41e3f]">{rec.checkOut || '—'}</span></TableCell>
                  <TableCell><span className="font-mono font-bold">{rec.totalHours ? `${rec.totalHours}h` : '—'}</span></TableCell>
                  <TableCell><Badge status={rec.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};
