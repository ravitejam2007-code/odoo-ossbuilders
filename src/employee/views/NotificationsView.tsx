import React, { useState } from 'react';
import { Card } from '../../shared/Card';
import { Button } from '../../shared/Button';
import { EmptyState } from '../../shared/EmptyState';
import { Skeleton } from '../../shared/Loading';
import {
  Bell,
  CheckCircle2,
  Clock,
  DollarSign,
  Calendar,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '../hooks/useEmployeeData';

const iconMap: Record<string, React.ReactNode> = {
  approval: <CheckCircle2 className="w-4 h-4" />,
  payroll: <DollarSign className="w-4 h-4" />,
  attendance: <Clock className="w-4 h-4" />,
  leave: <Calendar className="w-4 h-4" />,
  general: <Bell className="w-4 h-4" />,
  system: <AlertCircle className="w-4 h-4" />,
};

const colorMap: Record<string, { bg: string; text: string }> = {
  approval: { bg: '#e6f4ea', text: '#31a24c' },
  payroll: { bg: '#e8f0fc', text: '#0064e0' },
  attendance: { bg: '#fef3c7', text: '#92570c' },
  leave: { bg: '#e8f0fc', text: '#0064e0' },
  general: { bg: '#f1f4f7', text: '#5d6c7b' },
  system: { bg: '#fde8ec', text: '#e41e3f' },
};

export const NotificationsView: React.FC = () => {
  const { data: notifications = [], isLoading, isError, refetch } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayed = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="max-w-2xl mx-auto space-y-8 font-sans">
      {/* ── Centralized Header ──────────────────────────────────────── */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f1f4f7] border border-[#dee3e9] mb-1">
          <Bell className="w-5 h-5 text-[#0a1317]" />
        </div>
        <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#0a1317] tracking-tight leading-tight">
          Notifications Center
        </h1>
        <p className="text-[14px] text-[#5d6c7b] max-w-md mx-auto">
          {unreadCount > 0
            ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''} requiring attention.`
            : 'All caught up! No unread notifications.'}
        </p>
      </div>

      {/* ── Filter & Action Bar ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <div className="flex items-center justify-center gap-2 p-1 rounded-full bg-[#f1f4f7] border border-[#dee3e9]">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={[
              'px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer outline-none',
              filter === 'all'
                ? 'bg-[#0a1317] text-white shadow-xs'
                : 'text-[#5d6c7b] hover:text-[#0a1317]',
            ].join(' ')}
          >
            All ({notifications.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={[
              'px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer outline-none',
              filter === 'unread'
                ? 'bg-[#0a1317] text-white shadow-xs'
                : 'text-[#5d6c7b] hover:text-[#0a1317]',
            ].join(' ')}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            loading={markAllReadMutation.isPending}
            onClick={() => markAllReadMutation.mutate()}
            className="text-[13px]"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            <span>Mark all as read</span>
          </Button>
        )}
      </div>

      {/* ── Notification List ───────────────────────────────────────── */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-[16px]" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-[#ffffff] border border-[#dee3e9] rounded-[20px] shadow-xs space-y-3">
          <AlertCircle className="w-6 h-6 text-[#e41e3f] mx-auto" />
          <p className="text-[14px] font-bold text-[#0a1317]">Failed to load notifications</p>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            <span>Retry</span>
          </Button>
        </div>
      ) : displayed.length === 0 ? (
        <div className="p-8 text-center bg-[#ffffff] border border-[#dee3e9] rounded-[20px] shadow-xs">
          <EmptyState
            title="No Notifications Found"
            description={
              filter === 'unread'
                ? 'All notifications have been marked as read.'
                : 'You have no system notifications at this time.'
            }
            icon={<Bell className="w-6 h-6 text-[#8595a4]" />}
            actionLabel={filter === 'unread' ? 'View All Notifications' : undefined}
            onAction={() => setFilter('all')}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((n) => {
            const colors = colorMap[n.type] || colorMap.general;
            const timeDisplay = n.timestamp || (n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Recent');

            return (
              <div
                key={n.id}
                onClick={() => {
                  if (!n.read) {
                    markReadMutation.mutate(n.id);
                  }
                }}
                className={[
                  'flex items-start gap-4 p-4 sm:p-5 rounded-[16px]',
                  'border transition-all duration-150 cursor-pointer text-left',
                  !n.read
                    ? 'bg-[#ffffff] border-[#ced0d4] shadow-[rgba(20,22,26,0.06)_0px_2px_8px_0px]'
                    : 'bg-[#fafbfc] border-[#dee3e9] opacity-85',
                  'hover:border-[#0a1317] group',
                ].join(' ')}
                role="article"
              >
                {/* Type Icon */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {iconMap[n.type] || iconMap.general}
                </div>

                {/* Body Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-[14px] font-semibold leading-tight ${
                          n.read ? 'text-[#444950]' : 'text-[#0a1317]'
                        }`}
                      >
                        {n.title}
                      </p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-[#0064e0] flex-shrink-0" />}
                    </div>
                    <span className="text-[12px] text-[#8595a4] flex-shrink-0 font-medium">
                      {timeDisplay}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#5d6c7b] mt-1 leading-[1.5]">
                    {n.message || n.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
