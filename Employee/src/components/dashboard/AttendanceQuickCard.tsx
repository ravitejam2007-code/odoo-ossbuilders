import React from 'react';
import { Clock, ArrowRight, Play, Square } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export interface AttendanceQuickCardProps {
  className?: string;
}

export const AttendanceQuickCard: React.FC<AttendanceQuickCardProps> = ({ className = '' }) => {
  const { currentUser, checkIn, checkOut, checkInTime } = useAuth();
  const isPresent = currentUser?.workStatus === 'present';

  return (
    <Card className={`p-6 flex flex-col justify-between space-y-4 bg-white border border-zinc-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 rounded-2xl bg-zinc-100 text-zinc-950 border border-zinc-200">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-black text-zinc-950 tracking-tight">Today's Attendance</h4>
            <p className="text-xs text-zinc-500">Work status & check-in log</p>
          </div>
        </div>
        {currentUser && <Badge status={currentUser.workStatus} />}
      </div>

      <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-500 font-medium">Status:</span>
          <span className="font-bold text-zinc-950">
            {isPresent ? 'Checked In' : 'Not Checked In'}
          </span>
        </div>
        {checkInTime && (
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-500 font-medium">Check-In Time:</span>
            <span className="font-mono font-bold text-emerald-700">{checkInTime}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-1">
        {!isPresent ? (
          <Button variant="primary" size="sm" onClick={checkIn} className="w-full">
            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
            <span>Check In</span>
          </Button>
        ) : (
          <Button variant="destructive" size="sm" onClick={checkOut} className="w-full">
            <Square className="w-3.5 h-3.5 mr-1.5 fill-current" />
            <span>Check Out</span>
          </Button>
        )}
      </div>

      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
        <span className="text-zinc-500 font-medium">Full attendance records</span>
        <a href="/attendance" className="font-bold text-zinc-950 hover:underline flex items-center gap-1">
          <span>View Log</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </Card>
  );
};
