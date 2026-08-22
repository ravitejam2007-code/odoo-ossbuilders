import React, { useState } from 'react';
import { Card } from '../../shared/Card';
import { Button } from '../../shared/Button';
import { EmptyState } from '../../shared/EmptyState';
import { Bell, CheckCircle2, Clock, DollarSign, Calendar, AlertCircle, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  type: 'approval' | 'payroll' | 'attendance' | 'system' | 'leave';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'approval', title: 'Leave Request Approved', body: 'Your sick leave request for Aug 10–11 has been approved by HR.', time: '2 hours ago', read: false },
  { id: '2', type: 'payroll', title: 'July Payslip Ready', body: 'Your July 2026 payslip has been processed. Net pay: ₹46,800.', time: 'Yesterday', read: false },
  { id: '3', type: 'attendance', title: 'Check-in Reminder', body: 'You haven\'t checked in today. Regular shift starts at 9:00 AM.', time: '9:05 AM', read: true },
  { id: '4', type: 'leave', title: 'Leave Balance Updated', body: 'Your annual leave balance has been refreshed for FY 2026–27.', time: 'Aug 1', read: true },
  { id: '5', type: 'system', title: 'Profile Updated', body: 'Your emergency contact information was updated successfully.', time: 'Jul 28', read: true },
];

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
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayed = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const markAllRead = () => setNotifications(notifications.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id: string) => setNotifications(notifications.filter((n) => n.id !== id));

  return (
    <div className="space-y-8 max-w-[720px]">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#0a1317] tracking-tight leading-tight">
            Notifications
          </h1>
          <p className="text-[14px] text-[#5d6c7b] mt-1 font-normal">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </Button>
        )}
      </div>

      {/* ── Filter Pill Tabs ─────────────────────────────────────── */}
      {/* DESIGN-meta: button-pill-tab / button-pill-tab-active */}
      <div className="flex items-center gap-2">
        {(['all', 'unread'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={[
              'px-4 py-2 rounded-full text-[14px] font-bold leading-[1.43] tracking-[-0.14px]',
              'transition-colors duration-150 outline-none',
              'focus-visible:ring-2 focus-visible:ring-[#1876f2]',
              filter === tab
                ? 'bg-[#0a1317] text-white'
                : 'bg-white text-[#1c1e21] border border-[#ced0d4] hover:bg-[#f1f4f7]',
            ].join(' ')}
          >
            {tab === 'all' ? `All (${notifications.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* ── Notification List ─────────────────────────────────────── */}
      {displayed.length === 0 ? (
        <EmptyState
          title="No notifications"
          description={filter === 'unread' ? 'All notifications have been read.' : 'You have no notifications yet.'}
          icon={<Bell className="w-5 h-5" />}
          actionLabel="Show All"
          onAction={() => setFilter('all')}
        />
      ) : (
        <div className="space-y-2">
          {displayed.map((n) => {
            const colors = colorMap[n.type];
            return (
              <div
                key={n.id}
                className={[
                  'flex items-start gap-4 p-4 rounded-[16px]',
                  'border border-[#dee3e9]',
                  'transition-all duration-150',
                  !n.read ? 'bg-[#ffffff]' : 'bg-[#f9fafb]',
                  'group',
                ].join(' ')}
                role="article"
              >
                {/* Type icon */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {iconMap[n.type]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0" onClick={() => markRead(n.id)} role="button" tabIndex={0}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {/* subtitle / body-sm-bold */}
                      <p className={`text-[14px] font-bold leading-[1.43] tracking-[-0.14px] ${n.read ? 'text-[#444950]' : 'text-[#0a1317]'}`}>
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#0064e0] flex-shrink-0" aria-label="Unread" />
                      )}
                    </div>
                    {/* caption: 12px/400 */}
                    <span className="text-[12px] font-normal text-[#8595a4] flex-shrink-0">{n.time}</span>
                  </div>
                  {/* body-sm: 14px/400 */}
                  <p className="text-[14px] font-normal leading-[1.43] text-[#5d6c7b] mt-1">
                    {n.body}
                  </p>
                </div>

                {/* Dismiss */}
                <button
                  type="button"
                  onClick={() => dismiss(n.id)}
                  className={[
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    'text-[#8595a4] hover:text-[#e41e3f]',
                    'hover:bg-[#fde8ec]',
                    'opacity-0 group-hover:opacity-100',
                    'transition-all duration-150 outline-none',
                    'focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[#1876f2]',
                  ].join(' ')}
                  aria-label="Dismiss notification"
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
