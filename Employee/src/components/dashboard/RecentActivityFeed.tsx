import React from 'react';
import { Bell, CheckCircle2, Clock, Info, AlertCircle, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Loading';
import { useNotifications } from '../../hooks/useEmployeeData';

export const RecentActivityFeed: React.FC = () => {
  const { data: notifications, isLoading, isError } = useNotifications();

  const list = (notifications || []).slice(0, 4);

  return (
    <Card className="p-6 space-y-4 bg-white border border-zinc-200 shadow-2xs">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-zinc-950" />
          <h3 className="text-sm font-black text-zinc-950">Recent Activity & Alerts</h3>
        </div>
        <a href="/notifications" className="text-xs font-bold text-zinc-950 hover:underline flex items-center gap-1">
          <span>All</span>
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      )}

      {isError && (
        <div className="p-4 rounded-2xl bg-rose-50 text-xs font-bold text-rose-700 text-center">
          Failed to load recent updates.
        </div>
      )}

      {!isLoading && !isError && list.length === 0 && (
        <p className="text-xs text-zinc-400 text-center py-4">No recent activity.</p>
      )}

      {!isLoading && !isError && list.length > 0 && (
        <div className="space-y-2.5">
          {list.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-zinc-50/80 border border-zinc-200/60 flex items-start space-x-3 text-xs"
            >
              <div className="p-2 rounded-xl bg-white border border-zinc-200 mt-0.5 text-zinc-950">
                <Info className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <h4 className="font-bold text-zinc-950 truncate">{item.title}</h4>
                <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">{item.message}</p>
                <span className="text-[9px] text-zinc-400 font-mono block">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
