import { supabaseAdmin } from '../../config/supabase';
import { AppError } from '../../utils/response';
import { ErrorCodes } from '../../constants/errorCodes';
import { NotificationItem } from '../../types';

export class NotificationsService {
  async getMyNotifications(userId: string): Promise<NotificationItem[]> {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to fetch notifications');
    }

    return (data || []).map((n) => ({
      id: n.id,
      userId: n.user_id,
      title: n.title,
      message: n.message,
      type: n.type,
      read: n.read,
      createdAt: n.created_at,
    }));
  }

  async markAsRead(id: string, userId: string) {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to update notification status');
    }

    return data;
  }

  async markAllAsRead(userId: string) {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId);

    if (error) {
      throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to mark notifications as read');
    }

    return { message: 'All notifications marked as read' };
  }
}
