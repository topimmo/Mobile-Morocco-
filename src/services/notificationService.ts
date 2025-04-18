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
  | "admin_message";

export type NotificationChannel = "in_app" | "email" | "whatsapp";

// Mock data for development
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
 * Get all notifications for a user
 */
export const getUserNotifications = async (
  userId: string,
): Promise<Notification[]> => {
  // In a real app, this would fetch from an API or database
  return notifications.filter((notif) => notif.userId === userId);
};

/**
 * Get unread notifications for a user
 */
export const getUnreadNotifications = async (
  userId: string,
): Promise<Notification[]> => {
  return notifications.filter(
    (notif) => notif.userId === userId && !notif.isRead,
  );
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (
  id: string,
): Promise<Notification | undefined> => {
  const index = notifications.findIndex((notif) => notif.id === id);

  if (index === -1) return undefined;

  notifications[index] = {
    ...notifications[index],
    isRead: true,
  };

  return notifications[index];
};

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (
  userId: string,
): Promise<number> => {
  let count = 0;

  notifications = notifications.map((notif) => {
    if (notif.userId === userId && !notif.isRead) {
      count++;
      return { ...notif, isRead: true };
    }
    return notif;
  });

  return count;
};

/**
 * Create a new notification
 */
export const createNotification = async (
  notification: Omit<Notification, "id" | "createdAt">,
): Promise<Notification> => {
  const newNotification = {
    ...notification,
    id: `notif_${Date.now()}`,
    createdAt: new Date(),
  };

  notifications.push(newNotification);
  return newNotification;
};

/**
 * Delete a notification
 */
export const deleteNotification = async (id: string): Promise<boolean> => {
  const initialLength = notifications.length;
  notifications = notifications.filter((notif) => notif.id !== id);
  return notifications.length < initialLength;
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
 * Send an email notification (mock implementation)
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
 * Send a WhatsApp notification (mock implementation)
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
export const getNotificationStats = async () => {
  const totalNotifications = notifications.length;
  const unreadNotifications = notifications.filter(
    (notif) => !notif.isRead,
  ).length;
  const inAppNotifications = notifications.filter(
    (notif) => notif.channel === "in_app",
  ).length;
  const emailNotifications = notifications.filter(
    (notif) => notif.channel === "email",
  ).length;
  const whatsAppNotifications = notifications.filter(
    (notif) => notif.channel === "whatsapp",
  ).length;

  return {
    total: totalNotifications,
    unread: unreadNotifications,
    inApp: inAppNotifications,
    email: emailNotifications,
    whatsApp: whatsAppNotifications,
  };
};
