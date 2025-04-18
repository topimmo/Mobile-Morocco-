import React, { useState, useEffect } from "react";
import { Bell, X, Check, Clock, AlertTriangle, BarChart3 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Notification,
  getUserNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/services/notificationService";

interface InAppNotificationsProps {
  userId: string;
  language?: "ar" | "fr";
}

const InAppNotifications: React.FC<InAppNotificationsProps> = ({
  userId,
  language = "ar",
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isRTL = language === "ar";

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      const userNotifications = await getUserNotifications(userId);
      setNotifications(userNotifications);

      const unread = await getUnreadNotifications(userId);
      setUnreadCount(unread.length);
    };

    loadNotifications();

    // In a real app, we would set up a websocket or polling here
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  // Handle marking a notification as read
  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);

    // Update local state
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif,
      ),
    );

    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead(userId);

    // Update local state
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) => ({ ...notif, isRead: true })),
    );

    setUnreadCount(0);
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "subscription_expiry":
      case "subscription_payment":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "ad_expiry":
      case "ad_performance":
        return <BarChart3 className="h-4 w-4 text-blue-500" />;
      case "admin_message":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(isRTL ? "ar-MA" : "fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        align={isRTL ? "end" : "start"}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">
            {isRTL ? "الإشعارات" : "Notifications"}
          </h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              {isRTL ? "تعيين الكل كمقروء" : "Tout marquer comme lu"}
            </Button>
          )}
        </div>

        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {isRTL ? "لا توجد إشعارات جديدة" : "Aucune nouvelle notification"}
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 ${notification.isRead ? "" : "bg-muted/30"}`}
                >
                  <div className="flex gap-3">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Separator className="mt-3" />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default InAppNotifications;
