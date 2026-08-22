import React from 'react';
import { Card } from '../../shared/Card';
import { Calendar, ArrowRight } from 'lucide-react';
import { useLeaveBalance } from '../hooks/useEmployeeData';

export const LeaveRequestsQuickCard: React.FC = () => {
  const { data: balance } = useLeaveBalance();

  return (
    <Card className="p-5 bg-white border-zinc-200 flex flex-col justify-between space-y-4 font-sans">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-950">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-950">Time Off Balances</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            {balance ? `${balance.paidTimeOffDays} Paid Days Available` : '24 Paid Days Available'}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
        <span className="text-zinc-500 font-medium">
          {balance ? `${balance.sickLeaveDays} Sick Days Left` : '7 Sick Days Left'}
        </span>
        <a href="/leave" className="font-bold text-zinc-950 hover:underline inline-flex items-center gap-1">
          <span>Apply Leave</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </Card>
  );
};
