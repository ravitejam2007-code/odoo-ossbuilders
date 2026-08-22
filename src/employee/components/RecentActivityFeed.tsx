import React from 'react';
import { Card } from '../../shared/Card';
import { Bell, CheckCircle2, Clock, DollarSign } from 'lucide-react';

export const RecentActivityFeed: React.FC = () => {
  const activities = [
    { id: 1, title: 'Checked in at 09:12 AM', time: 'Today', icon: Clock, color: 'text-emerald-600 bg-emerald-50' },
    { id: 2, title: 'July Payslip Processed (₹46,800)', time: 'Yesterday', icon: DollarSign, color: 'text-zinc-950 bg-zinc-100' },
    { id: 3, title: 'Sick Leave Approved (2 days)', time: 'Aug 12', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
  ];

  return (
    <Card className="p-5 bg-white border-zinc-200 space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
          <Bell className="w-4 h-4 text-zinc-500" />
          <span>Recent Activity</span>
        </h3>
        <a href="/notifications" className="text-xs font-bold text-zinc-950 hover:underline">
          View All
        </a>
      </div>

      <div className="space-y-3 text-xs">
        {activities.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
              <div className="flex items-center space-x-2.5">
                <div className={`p-1.5 rounded-md ${item.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-zinc-950">{item.title}</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">{item.time}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
