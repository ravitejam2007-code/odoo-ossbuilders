import React from 'react';
import { Card } from '../../shared/Card';
import { Button } from '../../shared/Button';
import { BarChart2, TrendingUp, Users, Clock, Calendar, Download, ArrowRight } from 'lucide-react';

const REPORTS = [
  {
    title: 'Attendance Summary',
    description: 'Monthly attendance rates, absenteeism, and on-leave breakdown across all departments.',
    icon: Clock,
    color: '#0064e0',
    bg: '#e8f0fc',
    href: '#',
  },
  {
    title: 'Leave Analysis',
    description: 'Leave utilization by type, department, and employee. Identifies trends and heavy users.',
    icon: Calendar,
    color: '#31a24c',
    bg: '#e6f4ea',
    href: '#',
  },
  {
    title: 'Payroll Report',
    description: 'Total payroll cost by department, month-over-month comparison, and deduction breakdown.',
    icon: TrendingUp,
    color: '#f2a918',
    bg: '#fef3c7',
    href: '#',
  },
  {
    title: 'Headcount Report',
    description: 'Employee count by department, role, and employment type. Includes new hires and exits.',
    icon: Users,
    color: '#5d6c7b',
    bg: '#f1f4f7',
    href: '#',
  },
];

export const AdminReportsView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-[32px] sm:text-[40px] font-[600] uppercase tracking-[0.02em] leading-[1.15] text-[#0a1317]">
            Reports
          </h1>
          <p className="text-[15px] font-normal leading-[1.50] tracking-[-0.16px] text-[#5d6c7b] mt-1">
            Generate and export HR analytics reports
          </p>
        </div>
        <Button variant="ghost" size="sm">
          <Download className="w-3.5 h-3.5" /> Export All
        </Button>
      </div>

      {/* Report Tiles — DESIGN-meta why-buy-tile pattern */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {REPORTS.map(({ title, description, icon: Icon, color, bg, href }) => (
          <Card variant="feature" key={title} className="p-6 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[18px] font-bold leading-[1.44] text-[#0a1317]">{title}</h3>
                <p className="text-[14px] font-normal leading-[1.43] tracking-[-0.14px] text-[#5d6c7b] mt-1">
                  {description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-[#dee3e9]">
              <Button variant="primary" size="sm">
                <BarChart2 className="w-3.5 h-3.5" /> Generate
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="w-3.5 h-3.5" /> Download CSV
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* DESIGN-meta: card-promo-strip dark for featured insight */}
      <Card variant="promo" className="p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#8595a4]">Insight</p>
            <h3 className="text-[24px] font-[500] leading-[1.25] text-white mt-1">
              Attendance rate this month: 81%
            </h3>
            <p className="text-[16px] font-normal text-[#8595a4] mt-1">
              Down 4% from last month. Engineering and Design show highest absenteeism.
            </p>
          </div>
          <Button variant="secondary"
            className="bg-transparent border-white/40 text-white hover:bg-white/10 flex-shrink-0">
            Full Report <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
