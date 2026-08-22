import React from 'react';
import { Bell, CheckCircle2, Info, AlertTriangle, ShieldAlert, Check, RefreshCw } from 'lucide-react';
import { useNotifications } from '../../hooks/useEmployeeData';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LoadingSpinner, Skeleton } from '../ui/Loading';
import { EmptyState } from '../ui/EmptyState';

export const NotificationsView: React.FC = () => {
  const { data: notifications, isLoading, isError, refetch, markAsRead } = useNotifications();

  const list = notifications || [];
  const unreadCount = list.filter((n) => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-700" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-700" />;
      case 'alert':
        return <ShieldAlert className="w-5 h-5 text-rose-700" />;
      default:
        return <Info className="w-5 h-5 text-zinc-950" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-zinc-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">Notifications</h1>
          <p className="text-xs font-semibold text-zinc-500 mt-1">
            Leave approval notices, check-in reminders, and official announcements.
          </p>
        </div>

        {unreadCount > 0 && (
          <span className="px-3.5 py-1.5 rounded-full bg-zinc-950 text-white text-xs font-bold inline-flex items-center space-x-1.5 self-start sm:self-auto shadow-2xs">
            <Bell className="w-3.5 h-3.5" />
            <span>{unreadCount} Unread Alerts</span>
          </span>
        )}
      </div>

      {/* Notifications List */}
      <Card className="overflow-hidden p-6 space-y-4 bg-white border-zinc-200">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <h3 className="text-base font-black text-zinc-950">Recent Notifications Feed</h3>
          <span className="text-xs text-zinc-500 font-bold">{list.length} Items Total</span>
        </div>

        {/* LOADING SKELETONS */}
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {/* ERROR STATE */}
        {isError && (
          <div className="p-8 text-center space-y-3 bg-rose-50/50 rounded-2xl">
            <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
            <h4 className="text-sm font-bold text-rose-900">Failed to load notifications</h4>
            <p className="text-xs text-rose-700">A network error occurred while fetching alerts.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-full hover:bg-rose-700 inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Request</span>
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !isError && list.length === 0 && (
          <EmptyState
            title="You're all caught up!"
            description="No pending notifications or system alerts."
          />
        )}

        {/* NOTIFICATION FEED ITEMS */}
        {!isLoading && !isError && list.length > 0 && (
          <div className="space-y-3">
            {list.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  !item.read
                    ? 'bg-zinc-50 border-zinc-300 shadow-2xs'
                    : 'bg-white border-zinc-200/80 opacity-85 hover:opacity-100'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs mt-0.5">
                    {getTypeIcon(item.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-black text-zinc-950">{item.title}</h4>
                      {!item.read && (
                        <span className="px-2 py-0.5 rounded-full bg-zinc-950 text-white text-[9px] font-black uppercase tracking-wider font-mono">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">{item.message}</p>
                    <span className="text-[10px] text-zinc-400 font-mono font-bold block pt-1">
                      {new Date(item.createdAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {!item.read && (
                  <Button
                    variant="secondary"
                    size="sm"
                    loading={markAsRead.isPending}
                    disabled={markAsRead.isPending}
                    onClick={() => markAsRead.mutate(item.id)}
                    className="flex-shrink-0"
                  >
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                    <span>Mark Read</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
