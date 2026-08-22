import React, { useState, useEffect } from 'react';
import { Card } from '../../shared/Card';
import { Button } from '../../shared/Button';
import { EmptyState } from '../../shared/EmptyState';
import { Bell, CheckCircle2, Clock, DollarSign, Calendar, AlertCircle, Trash2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface NotificationItem {
  id: string;
  type: 'approval' | 'payroll' | 'attendance' | 'system' | 'leave';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const DEFAULT_INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'notif-1', type: 'approval', title: 'Leave Request Approved', body: 'Your time off request for upcoming days has been approved by HR.', time: '2 hours ago', read: false },
  { id: 'notif-2', type: 'payroll', title: 'Monthly Payslip Ready', body: 'Your latest salary payslip has been processed and is ready for download.', time: 'Yesterday', read: false },
  { id: 'notif-3', type: 'attendance', title: 'Daily Attendance Reminder', body: 'Regular work shift is active. Remember to log your attendance checkout.', time: 'Today', read: true },
];

function getStoredNotifications(): NotificationItem[] {
  if (typeof window === 'undefined') return DEFAULT_INITIAL_NOTIFICATIONS;
  const raw = localStorage.getItem('dayflow_notifications');
  if (!raw) {
    localStorage.setItem('dayflow_notifications', JSON.stringify(DEFAULT_INITIAL_NOTIFICATIONS));
    return DEFAULT_INITIAL_NOTIFICATIONS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_INITIAL_NOTIFICATIONS;
  }
}

function saveStoredNotifications(items: NotificationItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('dayflow_notifications', JSON.stringify(items));
}

const iconMap: Record<string, React.ReactNode> = {
  approval: <CheckCircle2 className="w-4 h-4" />,
  payroll: <DollarSign className="w-4 h-4" />,
  attendance: <Clock className="w-4 h-4" />,
  leave: <Calendar className="w-4 h-4" />,
  system: <AlertCircle className="w-4 h-4" />,
};

const colorMap: Record<string, { bg: string; text: string }> = {
  approval: { bg: '#e6f4ea', text: '#31a24c' },
  payroll:  { bg: '#e8f0fc', text: '#0064e0' },
  attendance: { bg: '#fef3c7', text: '#92570c' },
  leave:    { bg: '#f1f4f7', text: '#5d6c7b' },
  system:   { bg: '#f1f4f7', text: '#8595a4' },
};

export const NotificationsView: React.FC = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    setNotifications(getStoredNotifications());
  }, []);

  const updateNotificationsList = (newList: NotificationItem[]) => {
    setNotifications(newList);
    saveStoredNotifications(newList);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayed = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    updateNotificationsList(updated);
  };

  const markRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    updateNotificationsList(updated);
  };

  const dismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    updateNotificationsList(updated);
  };

  const clearAll = () => {
    updateNotificationsList([]);
  };

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

      {/* ── Centralized Filter & Action Bar ─────────────────────────── */}
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
          <Button variant="ghost" size="sm" onClick={markAllRead} className="text-[13px]">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            <span>Mark all read</span>
          </Button>
        )}

        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-[13px] text-[#8595a4] hover:text-[#e41e3f]">
            <span>Clear all</span>
          </Button>
        )}
      </div>

      {/* ── Centralized Notification Cards ──────────────────────────── */}
      {displayed.length === 0 ? (
        <div className="p-8 text-center bg-[#ffffff] border border-[#dee3e9] rounded-[20px] shadow-xs">
          <EmptyState
            title="No Notifications Found"
            description={filter === 'unread' ? 'All notifications have been marked as read.' : 'You have no notifications at this time.'}
            icon={<Bell className="w-6 h-6 text-[#8595a4]" />}
            actionLabel={filter === 'unread' ? 'View All Notifications' : undefined}
            onAction={() => setFilter('all')}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((n) => {
            const colors = colorMap[n.type] || colorMap.system;
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
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
                  {iconMap[n.type] || iconMap.system}
                </div>

                {/* Body Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className={`text-[14px] font-semibold leading-tight ${n.read ? 'text-[#444950]' : 'text-[#0a1317]'}`}>
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#0064e0] flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-[12px] text-[#8595a4] flex-shrink-0 font-medium">
                      {n.time}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#5d6c7b] mt-1 leading-[1.5]">
                    {n.body}
                  </p>
                </div>

                {/* Dismiss Action */}
                <button
                  type="button"
                  onClick={(e) => dismiss(n.id, e)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#8595a4] hover:text-[#e41e3f] hover:bg-[#fde8ec] transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 outline-none"
                  aria-label="Dismiss"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
