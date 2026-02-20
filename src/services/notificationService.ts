import { supabase } from "@/lib/supabase/client";

// Types for notification management
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedId?: string; // ID of related entity (subscription, ad, etc.)
  isRead: boolean;
  channel: NotificationChannel;
  createdAt: Date;
  scheduledFor?: Date; // For scheduled notifications
}

export type NotificationType =
  | "subscription_expiry"
  | "subscription_payment"
  | "ad_expiry"
  | "ad_performance"
  | "admin_message"
  | "new_message"
  | "job_request"
  | "support_ticket"
  | "product_update";

export type NotificationChannel = "in_app" | "email" | "whatsapp";

// Fallback mock data for development and offline mode
let notifications: Notification[] = [
  {
    id: "notif1",
    userId: "user1",
    title: "Subscription Expiring Soon",
    message:
      "Your premium subscription will expire in 3 days. Renew now to maintain your benefits.",
    type: "subscription_expiry",
    relatedId: "1", // Subscription ID
    isRead: false,
    channel: "in_app",
    createdAt: new Date("2023-06-25"),
    scheduledFor: new Date("2023-06-28"),
  },
  {
    id: "notif2",
    userId: "user2",
    title: "Ad Campaign Ending",
    message:
      "Your ad 'New Accessories Collection' will end in 2 days. Extend it to maintain visibility.",
    type: "ad_expiry",
    relatedId: "ad2", // Ad ID
    isRead: true,
    channel: "in_app",
    createdAt: new Date("2023-07-10"),
    scheduledFor: new Date("2023-07-13"),
  },
];

/**
 * Subscribe to real-time notifications for a user
 */
export const subscribeToNotifications = (
  userId: string,
  callback: (notification: Notification) => void,
) => {
  // Subscribe to notifications table changes for this user
  const subscription = supabase
    .channel("notifications-channel")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        // Convert the payload to a Notification object
        const newNotification = mapDatabaseNotificationToModel(payload.new);
        callback(newNotification);
      },
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(subscription);
  };
};

/**
 * Get all notifications for a user
 */
export const getUserNotifications = async (
  userId: string,
): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("userId", userId)
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapDatabaseNotificationToModel);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    // Fallback to mock data in case of error
    return notifications.filter((notif) => notif.userId === userId);
  }
};

/**
 * Get unread notifications for a user
 */
export const getUnreadNotifications = async (
  userId: string,
): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("userId", userId)
      .eq("isRead", false)
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapDatabaseNotificationToModel);
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    // Fallback to mock data
    return notifications.filter(
      (notif) => notif.userId === userId && !notif.isRead,
    );
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (
  id: string,
): Promise<Notification | undefined> => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .update({ isRead: true })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapDatabaseNotificationToModel(data);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    // Fallback to mock implementation
    const index = notifications.findIndex((notif) => notif.id === id);
    if (index === -1) return undefined;
    notifications[index] = { ...notifications[index], isRead: true };
    return notifications[index];
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (
  userId: string,
): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .update({ isRead: true })
      .eq("userId", userId)
      .eq("isRead", false)
      .select();

    if (error) throw error;
    return data?.length || 0;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    // Fallback to mock implementation
    let count = 0;
    notifications = notifications.map((notif) => {
      if (notif.userId === userId && !notif.isRead) {
        count++;
        return { ...notif, isRead: true };
      }
      return notif;
    });
    return count;
  }
};

/**
 * Create a new notification
 */
export const createNotification = async (
  notification: Omit<Notification, "id" | "createdAt">,
): Promise<Notification> => {
  try {
    const dbNotification = {
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      relatedId: notification.relatedId,
      isRead: notification.isRead,
      channel: notification.channel,
      scheduledFor: notification.scheduledFor instanceof Date ? notification.scheduledFor.toISOString() : notification.scheduledFor,
    };

    const { data, error } = await supabase
      .from("notifications")
      .insert([dbNotification])
      .select()
      .single();

    if (error) throw error;
    return mapDatabaseNotificationToModel(data);
  } catch (error) {
    console.error("Error creating notification:", error);
    // Fallback to mock implementation
    const mockNotification = {
      ...notification,
      id: `notif_${Date.now()}`,
      createdAt: new Date(),
    };
    notifications.push(mockNotification);
    return mockNotification;
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting notification:", error);
    // Fallback to mock implementation
    const initialLength = notifications.length;
    notifications = notifications.filter((notif) => notif.id !== id);
    return notifications.length < initialLength;
  }
};

const mapDatabaseNotificationToModel = (dbNotif: Record<string, unknown>): Notification => {
  return {
    id: dbNotif.id as string,
    userId: dbNotif.user_id as string,
    title: dbNotif.title as string,
    message: dbNotif.message as string,
    type: dbNotif.type as NotificationType,
    relatedId: dbNotif.related_id as string,
    isRead: dbNotif.isRead as boolean,
    channel: dbNotif.channel as NotificationChannel,
    createdAt: new Date(dbNotif.created_at as string),
    scheduledFor: dbNotif.scheduled_for ? new Date(dbNotif.scheduled_for as string) : undefined,
  };
};

/**
 * Schedule a notification for future delivery
 */
export const scheduleNotification = async (
  notification: Omit<Notification, "id" | "createdAt">,
  scheduledDate: Date,
): Promise<Notification> => {
  return createNotification({
    ...notification,
    scheduledFor: scheduledDate,
  });
};

/**
 * Send an in-app notification
 */
export const sendInAppNotification = async (
  userId: string,
  title: string,
  message: string,
  type: NotificationType,
  relatedId?: string,
): Promise<Notification> => {
  return createNotification({
    userId,
    title,
    message,
    type,
    relatedId,
    isRead: false,
    channel: "in_app",
  });
};

/**
 * Send an email notification
 */
export const sendEmailNotification = async (
  userId: string,
  title: string,
  message: string,
  type: NotificationType,
  relatedId?: string,
): Promise<Notification> => {
  // In a real app, this would use an email service
  console.log(`Sending email to user ${userId}: ${title}`);

  return createNotification({
    userId,
    title,
    message,
    type,
    relatedId,
    isRead: false,
    channel: "email",
  });
};

/**
 * Send a WhatsApp notification
 */
export const sendWhatsAppNotification = async (
  userId: string,
  title: string,
  message: string,
  type: NotificationType,
  relatedId?: string,
): Promise<Notification> => {
  // In a real app, this would use a WhatsApp Business API
  console.log(`Sending WhatsApp message to user ${userId}: ${title}`);

  return createNotification({
    userId,
    title,
    message,
    type,
    relatedId,
    isRead: false,
    channel: "whatsapp",
  });
};

/**
 * Get notification statistics
 */
export const getNotificationStats = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("userId", userId);

    if (error) throw error;

    const notifs = (data || []).map(mapDatabaseNotificationToModel);
    return {
      total: notifs.length,
      unread: notifs.filter((n) => !n.isRead).length,
      inApp: notifs.filter((n) => n.channel === "in_app").length,
      email: notifs.filter((n) => n.channel === "email").length,
      whatsApp: notifs.filter((n) => n.channel === "whatsapp").length,
    };
  } catch (error) {
    console.error("Error getting notification stats:", error);
    // Fallback to mock implementation
    const userNotifications = notifications.filter((n) => n.userId === userId);
    return {
      total: userNotifications.length,
      unread: userNotifications.filter((n) => !n.isRead).length,
      inApp: userNotifications.filter((n) => n.channel === "in_app").length,
      email: userNotifications.filter((n) => n.channel === "email").length,
      whatsApp: userNotifications.filter((n) => n.channel === "whatsapp")
        .length,
    };
  }
};
