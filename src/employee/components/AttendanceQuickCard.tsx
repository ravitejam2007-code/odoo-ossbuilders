import React from 'react';
import { Card } from '../../shared/Card';
import { Clock, ArrowRight } from 'lucide-react';
import { useAttendanceHistory } from '../hooks/useEmployeeData';

export const AttendanceQuickCard: React.FC = () => {
  const { data: attendanceData } = useAttendanceHistory();
  const summary = attendanceData?.summary;

  return (
    <Card className="p-5 bg-white border-zinc-200 flex flex-col justify-between space-y-4 font-sans">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-950">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-950">Attendance Summary</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            {summary ? `${summary.countPresent} Days Present` : 'Regular Shift Active'}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
        <span className="text-zinc-500 font-medium font-mono">
          {summary?.totalWorkHours ? `${summary.totalWorkHours} total` : '09:00 AM – 06:00 PM'}
        </span>
        <a href="/attendance" className="font-bold text-zinc-950 hover:underline inline-flex items-center gap-1">
          <span>Log Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </Card>
  );
};
