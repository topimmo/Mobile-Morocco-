// Types for subscription management
export interface Subscription {
  id: string;
  userId: string;
  type: "free" | "premium";
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  paymentStatus: "pending" | "confirmed" | "failed";
  paymentMethod: "bank_transfer" | "other";
  paymentReference?: string;
  features: {
    featuredPlacement: boolean;
    highlightedAds: boolean;
    prioritySupport: boolean;
  };
  notificationPreferences?: {
    expiryReminder: boolean;
    paymentReminder: boolean;
    promotions: boolean;
    channels: {
      inApp: boolean;
      email: boolean;
      whatsApp: boolean;
    };
  };
}

// Mock data for development
let subscriptions: Subscription[] = [
  {
    id: "1",
    userId: "user1",
    type: "premium",
    startDate: new Date("2023-06-01"),
    endDate: new Date("2023-07-01"),
    isActive: true,
    paymentStatus: "confirmed",
    paymentMethod: "bank_transfer",
    paymentReference: "REF123456",
    features: {
      featuredPlacement: true,
      highlightedAds: true,
      prioritySupport: true,
    },
    notificationPreferences: {
      expiryReminder: true,
      paymentReminder: true,
      promotions: true,
      channels: {
        inApp: true,
        email: true,
        whatsApp: false,
      },
    },
  },
  {
    id: "2",
    userId: "user2",
    type: "free",
    startDate: new Date("2023-06-15"),
    endDate: new Date("2099-12-31"), // Free subscriptions don't expire
    isActive: true,
    paymentStatus: "confirmed",
    paymentMethod: "bank_transfer",
    features: {
      featuredPlacement: false,
      highlightedAds: false,
      prioritySupport: false,
    },
    notificationPreferences: {
      expiryReminder: true,
      paymentReminder: true,
      promotions: false,
      channels: {
        inApp: true,
        email: false,
        whatsApp: false,
      },
    },
  },
];

/**
 * Get all subscriptions
 */
export const getAllSubscriptions = async (): Promise<Subscription[]> => {
  // In a real app, this would fetch from an API or database
  return subscriptions;
};

/**
 * Get a subscription by ID
 */
export const getSubscriptionById = async (
  id: string,
): Promise<Subscription | undefined> => {
  return subscriptions.find((sub) => sub.id === id);
};

/**
 * Get a user's subscription
 */
export const getUserSubscription = async (
  userId: string,
): Promise<Subscription | undefined> => {
  return subscriptions.find((sub) => sub.userId === userId && sub.isActive);
};

/**
 * Create a new subscription
 */
export const createSubscription = async (
  subscription: Omit<Subscription, "id">,
): Promise<Subscription> => {
  const newSubscription = {
    ...subscription,
    id: `sub_${Date.now()}`,
  };

  subscriptions.push(newSubscription);
  return newSubscription;
};

/**
 * Update a subscription
 */
export const updateSubscription = async (
  id: string,
  updates: Partial<Subscription>,
): Promise<Subscription | undefined> => {
  const index = subscriptions.findIndex((sub) => sub.id === id);

  if (index === -1) return undefined;

  const updatedSubscription = {
    ...subscriptions[index],
    ...updates,
  };

  subscriptions[index] = updatedSubscription;
  return updatedSubscription;
};

/**
 * Renew a subscription for a specified number of days
 */
export const renewSubscription = async (
  id: string,
  daysToAdd: number = 30,
): Promise<Subscription | undefined> => {
  const subscription = await getSubscriptionById(id);

  if (!subscription) return undefined;

  // Calculate new end date
  const currentEndDate = new Date(subscription.endDate);
  const newEndDate = new Date(currentEndDate);
  newEndDate.setDate(newEndDate.getDate() + daysToAdd);

  // Update the subscription
  return updateSubscription(id, {
    endDate: newEndDate,
    isActive: true,
    paymentStatus: "confirmed",
  });
};

/**
 * Activate a subscription
 */
export const activateSubscription = async (
  id: string,
): Promise<Subscription | undefined> => {
  return updateSubscription(id, {
    isActive: true,
    paymentStatus: "confirmed",
  });
};

/**
 * Deactivate a subscription
 */
export const deactivateSubscription = async (
  id: string,
): Promise<Subscription | undefined> => {
  return updateSubscription(id, { isActive: false });
};

/**
 * Check if a subscription is active and not expired
 */
export const isSubscriptionActive = async (
  userId: string,
): Promise<boolean> => {
  const subscription = await getUserSubscription(userId);

  if (!subscription) return false;

  const now = new Date();
  return subscription.isActive && subscription.endDate > now;
};

/**
 * Check if a subscription is expiring soon
 */
export const isSubscriptionExpiringSoon = async (
  subscriptionId: string,
  daysThreshold: number = 7,
): Promise<boolean> => {
  const subscription = await getSubscriptionById(subscriptionId);

  if (!subscription || !subscription.isActive) return false;

  const now = new Date();
  const expiryDate = new Date(subscription.endDate);
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  return daysUntilExpiry > 0 && daysUntilExpiry <= daysThreshold;
};

/**
 * Schedule expiry notifications for a subscription
 */
export const scheduleSubscriptionExpiryNotifications = async (
  subscriptionId: string,
): Promise<void> => {
  // This would be implemented with a real scheduling system
  // For now, we'll just check if the subscription is expiring soon
  const subscription = await getSubscriptionById(subscriptionId);

  if (
    !subscription ||
    !subscription.isActive ||
    !subscription.notificationPreferences?.expiryReminder
  ) {
    return;
  }

  // In a real implementation, this would create scheduled tasks
  console.log(
    `Scheduled expiry notifications for subscription ${subscriptionId}`,
  );
};

/**
 * Check if a user has premium features
 */
export const hasPremiumFeatures = async (userId: string): Promise<boolean> => {
  const subscription = await getUserSubscription(userId);

  if (!subscription) return false;

  const now = new Date();
  return (
    subscription.isActive &&
    subscription.type === "premium" &&
    subscription.endDate > now
  );
};

/**
 * Get subscription statistics
 */
export const getSubscriptionStats = async () => {
  const allSubscriptions = await getAllSubscriptions();

  const activeSubscriptions = allSubscriptions.filter((sub) => sub.isActive);
  const premiumSubscriptions = allSubscriptions.filter(
    (sub) => sub.type === "premium" && sub.isActive,
  );
  const pendingPayments = allSubscriptions.filter(
    (sub) => sub.paymentStatus === "pending",
  );

  return {
    total: allSubscriptions.length,
    active: activeSubscriptions.length,
    premium: premiumSubscriptions.length,
    pending: pendingPayments.length,
  };
};
