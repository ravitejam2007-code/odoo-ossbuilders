import React from 'react';
import { Calendar, ArrowRight, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useLeaveBalance } from '../../hooks/useEmployeeData';
import { useAuth } from '../../context/AuthContext';

export interface LeaveRequestsQuickCardProps {
  className?: string;
}

export const LeaveRequestsQuickCard: React.FC<LeaveRequestsQuickCardProps> = ({ className = '' }) => {
  const { currentUser } = useAuth();
  const { data: balance } = useLeaveBalance(currentUser?.id);

  return (
    <Card className={`p-6 flex flex-col justify-between space-y-4 bg-white border border-zinc-200 ${className}`}>
      <div className="flex items-center space-x-2.5">
        <div className="p-2.5 rounded-2xl bg-zinc-100 text-zinc-950 border border-zinc-200">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base font-black text-zinc-950 tracking-tight">Time Off Balances</h4>
          <p className="text-xs text-zinc-500">Available leave allocations</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">Paid Leave</span>
          <span className="text-lg font-black text-zinc-950 font-mono">
            {balance?.paidDaysAvailable || 24} Days
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">Sick Leave</span>
          <span className="text-lg font-black text-zinc-950 font-mono">
            {balance?.sickDaysAvailable || 7} Days
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <a href="/leave/new" className="w-full">
          <Button variant="secondary" size="sm" className="w-full">
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Request Time Off</span>
          </Button>
        </a>
      </div>

      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
        <span className="text-zinc-500 font-medium">Leave request history</span>
        <a href="/leave" className="font-bold text-zinc-950 hover:underline flex items-center gap-1">
          <span>View Portal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </Card>
  );
};
