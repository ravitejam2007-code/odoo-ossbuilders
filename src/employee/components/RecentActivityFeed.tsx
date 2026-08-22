import React from 'react';
import { Card } from '../../shared/Card';
import { Bell, CheckCircle2, Clock, DollarSign, Calendar } from 'lucide-react';
import { useNotifications } from '../hooks/useEmployeeData';

const iconMap: Record<string, any> = {
  approval: { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
  payroll: { icon: DollarSign, color: 'text-blue-600 bg-blue-50' },
  attendance: { icon: Clock, color: 'text-amber-600 bg-amber-50' },
  leave: { icon: Calendar, color: 'text-blue-600 bg-blue-50' },
  general: { icon: Bell, color: 'text-zinc-950 bg-zinc-100' },
  system: { icon: Bell, color: 'text-red-600 bg-red-50' },
};

export const RecentActivityFeed: React.FC = () => {
  const { data: notifications = [] } = useNotifications();
  const recent = notifications.slice(0, 3);

  return (
    <Card className="p-5 bg-white border-zinc-200 space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
          <Bell className="w-4 h-4 text-zinc-500" />
          <span>Recent Activity</span>
        </h3>
        <a href="/notifications" className="text-xs font-bold text-zinc-950 hover:underline">
          View All
        </a>
      </div>

      {recent.length === 0 ? (
        <div className="p-4 text-center text-xs text-zinc-400">
          No recent activity logs
        </div>
      ) : (
        <div className="space-y-3 text-xs">
          {recent.map((item) => {
            const config = iconMap[item.type] || iconMap.general;
            const Icon = config.icon;
            return (
              <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className={`p-1.5 rounded-md ${config.color} flex-shrink-0`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-zinc-950 truncate">{item.title}</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono flex-shrink-0 ml-2">
                  {item.timestamp || 'Recent'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
