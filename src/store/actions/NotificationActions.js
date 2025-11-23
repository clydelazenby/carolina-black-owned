// Notification Action Types
export const NOTIFICATIONS_LOADING = 'NOTIFICATIONS_LOADING';
export const NOTIFICATIONS_LOADED = 'NOTIFICATIONS_LOADED';
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const MARK_AS_READ = 'MARK_AS_READ';
export const MARK_ALL_AS_READ = 'MARK_ALL_AS_READ';
export const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';
export const CLEAR_ALL_NOTIFICATIONS = 'CLEAR_ALL_NOTIFICATIONS';
export const UPDATE_NOTIFICATION_PREFERENCES = 'UPDATE_NOTIFICATION_PREFERENCES';

// Notification types
export const NOTIFICATION_TYPES = {
    NEW_REVIEW: 'new_review',
    REVIEW_REPLY: 'review_reply',
    FAVORITE_MILESTONE: 'favorite_milestone',
    BUSINESS_UPDATE: 'business_update',
    CLAIM_STATUS: 'claim_status',
    BADGE_EARNED: 'badge_earned',
    SYSTEM: 'system',
    PROMOTION: 'promotion'
};

// Load notifications
export const loadNotifications = (userId) => {
    return (dispatch) => {
        dispatch({ type: NOTIFICATIONS_LOADING });

        const notifications = getNotificationsFromStorage(userId);
        const preferences = getNotificationPreferences(userId);

        dispatch({
            type: NOTIFICATIONS_LOADED,
            payload: { notifications, preferences }
        });
    };
};

// Create a new notification
export const createNotification = (userId, notification) => {
    return (dispatch, getState) => {
        const preferences = getState().notifications?.preferences || getNotificationPreferences(userId);

        // Check if user wants this type of notification
        if (!shouldSendNotification(notification.type, preferences)) {
            return;
        }

        const newNotification = {
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...notification,
            read: false,
            createdAt: new Date().toISOString()
        };

        // Save to storage
        const notifications = getNotificationsFromStorage(userId);
        notifications.unshift(newNotification);
        saveNotificationsToStorage(userId, notifications.slice(0, 100)); // Keep last 100

        dispatch({
            type: ADD_NOTIFICATION,
            payload: newNotification
        });

        // Send push notification if enabled
        if (preferences.pushNotifications && 'Notification' in window) {
            sendPushNotification(newNotification);
        }

        // Queue email notification if enabled
        if (preferences.emailNotifications) {
            queueEmailNotification(userId, newNotification);
        }

        return newNotification;
    };
};

// Mark notification as read
export const markAsRead = (userId, notificationId) => {
    return (dispatch) => {
        const notifications = getNotificationsFromStorage(userId);
        const updated = notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
        );
        saveNotificationsToStorage(userId, updated);

        dispatch({
            type: MARK_AS_READ,
            payload: notificationId
        });
    };
};

// Mark all notifications as read
export const markAllAsRead = (userId) => {
    return (dispatch) => {
        const notifications = getNotificationsFromStorage(userId);
        const updated = notifications.map(n => ({ ...n, read: true }));
        saveNotificationsToStorage(userId, updated);

        dispatch({ type: MARK_ALL_AS_READ });
    };
};

// Delete a notification
export const deleteNotification = (userId, notificationId) => {
    return (dispatch) => {
        const notifications = getNotificationsFromStorage(userId);
        const filtered = notifications.filter(n => n.id !== notificationId);
        saveNotificationsToStorage(userId, filtered);

        dispatch({
            type: DELETE_NOTIFICATION,
            payload: notificationId
        });
    };
};

// Clear all notifications
export const clearAllNotifications = (userId) => {
    return (dispatch) => {
        saveNotificationsToStorage(userId, []);
        dispatch({ type: CLEAR_ALL_NOTIFICATIONS });
    };
};

// Update notification preferences
export const updateNotificationPreferences = (userId, preferences) => {
    return (dispatch) => {
        saveNotificationPreferences(userId, preferences);

        dispatch({
            type: UPDATE_NOTIFICATION_PREFERENCES,
            payload: preferences
        });
    };
};

// Notification triggers - call these when events happen

// When a business receives a new review
export const notifyNewReview = (businessOwnerId, businessName, reviewerName, rating) => {
    return createNotification(businessOwnerId, {
        type: NOTIFICATION_TYPES.NEW_REVIEW,
        title: 'New Review',
        message: `${reviewerName} left a ${rating}-star review on ${businessName}`,
        data: { businessName, reviewerName, rating },
        actionUrl: '/dashboard/reviews'
    });
};

// When someone favorites a business
export const notifyFavoriteMilestone = (businessOwnerId, businessName, count) => {
    const milestones = [10, 25, 50, 100, 250, 500, 1000];
    if (milestones.includes(count)) {
        return createNotification(businessOwnerId, {
            type: NOTIFICATION_TYPES.FAVORITE_MILESTONE,
            title: 'Favorite Milestone! 🎉',
            message: `${businessName} has reached ${count} favorites!`,
            data: { businessName, count },
            actionUrl: '/dashboard/analytics'
        });
    }
    return () => {}; // No-op if not a milestone
};

// When a claim status changes
export const notifyClaimStatus = (userId, businessName, status) => {
    const statusMessages = {
        approved: `Your claim for ${businessName} has been approved!`,
        rejected: `Your claim for ${businessName} was not approved.`,
        pending: `Your claim for ${businessName} is being reviewed.`
    };

    return createNotification(userId, {
        type: NOTIFICATION_TYPES.CLAIM_STATUS,
        title: 'Business Claim Update',
        message: statusMessages[status],
        data: { businessName, status },
        actionUrl: '/dashboard/claims'
    });
};

// When user earns a badge
export const notifyBadgeEarned = (userId, badgeName, badgeIcon) => {
    return createNotification(userId, {
        type: NOTIFICATION_TYPES.BADGE_EARNED,
        title: 'Badge Earned! 🏆',
        message: `Congratulations! You've earned the "${badgeName}" badge!`,
        data: { badgeName, badgeIcon },
        actionUrl: '/profile/badges'
    });
};

// System notification
export const notifySystem = (userId, title, message) => {
    return createNotification(userId, {
        type: NOTIFICATION_TYPES.SYSTEM,
        title,
        message,
        data: {}
    });
};

// Helper functions
const getNotificationsFromStorage = (userId) => {
    const key = `notifications_${userId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
};

const saveNotificationsToStorage = (userId, notifications) => {
    const key = `notifications_${userId}`;
    localStorage.setItem(key, JSON.stringify(notifications));
};

const getNotificationPreferences = (userId) => {
    const key = `notificationPrefs_${userId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
        return JSON.parse(stored);
    }
    // Default preferences
    return {
        emailNotifications: true,
        pushNotifications: false,
        newReviews: true,
        favorites: true,
        claimUpdates: true,
        badges: true,
        systemUpdates: true,
        promotions: false
    };
};

const saveNotificationPreferences = (userId, preferences) => {
    const key = `notificationPrefs_${userId}`;
    localStorage.setItem(key, JSON.stringify(preferences));
};

const shouldSendNotification = (type, preferences) => {
    const typeToPreference = {
        [NOTIFICATION_TYPES.NEW_REVIEW]: 'newReviews',
        [NOTIFICATION_TYPES.REVIEW_REPLY]: 'newReviews',
        [NOTIFICATION_TYPES.FAVORITE_MILESTONE]: 'favorites',
        [NOTIFICATION_TYPES.CLAIM_STATUS]: 'claimUpdates',
        [NOTIFICATION_TYPES.BADGE_EARNED]: 'badges',
        [NOTIFICATION_TYPES.SYSTEM]: 'systemUpdates',
        [NOTIFICATION_TYPES.PROMOTION]: 'promotions'
    };

    const prefKey = typeToPreference[type];
    return prefKey ? preferences[prefKey] !== false : true;
};

const sendPushNotification = (notification) => {
    if (Notification.permission === 'granted') {
        new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
            tag: notification.id
        });
    }
};

const queueEmailNotification = (userId, notification) => {
    // Queue email for batch sending (would integrate with backend)
    const queue = JSON.parse(localStorage.getItem('emailQueue') || '[]');
    queue.push({
        userId,
        notification,
        queuedAt: new Date().toISOString()
    });
    localStorage.setItem('emailQueue', JSON.stringify(queue));
};

// Request push notification permission
export const requestPushPermission = () => {
    return async (dispatch, getState) => {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return false;
        }

        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            const { auth } = getState();
            const userId = auth.auth?.localId;
            if (userId) {
                dispatch(updateNotificationPreferences(userId, {
                    ...getNotificationPreferences(userId),
                    pushNotifications: true
                }));
            }
            return true;
        }

        return false;
    };
};
