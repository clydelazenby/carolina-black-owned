import {
    NOTIFICATIONS_LOADING,
    NOTIFICATIONS_LOADED,
    ADD_NOTIFICATION,
    MARK_AS_READ,
    MARK_ALL_AS_READ,
    DELETE_NOTIFICATION,
    CLEAR_ALL_NOTIFICATIONS,
    UPDATE_NOTIFICATION_PREFERENCES
} from '../actions/NotificationActions';

const initialState = {
    notifications: [],
    preferences: {
        emailNotifications: true,
        pushNotifications: false,
        newReviews: true,
        favorites: true,
        claimUpdates: true,
        badges: true,
        systemUpdates: true,
        promotions: false
    },
    unreadCount: 0,
    loading: false
};

const NotificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case NOTIFICATIONS_LOADING:
            return {
                ...state,
                loading: true
            };

        case NOTIFICATIONS_LOADED:
            return {
                ...state,
                loading: false,
                notifications: action.payload.notifications,
                preferences: action.payload.preferences,
                unreadCount: action.payload.notifications.filter(n => !n.read).length
            };

        case ADD_NOTIFICATION:
            return {
                ...state,
                notifications: [action.payload, ...state.notifications],
                unreadCount: state.unreadCount + 1
            };

        case MARK_AS_READ:
            return {
                ...state,
                notifications: state.notifications.map(n =>
                    n.id === action.payload ? { ...n, read: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1)
            };

        case MARK_ALL_AS_READ:
            return {
                ...state,
                notifications: state.notifications.map(n => ({ ...n, read: true })),
                unreadCount: 0
            };

        case DELETE_NOTIFICATION:
            const deletedNotif = state.notifications.find(n => n.id === action.payload);
            return {
                ...state,
                notifications: state.notifications.filter(n => n.id !== action.payload),
                unreadCount: deletedNotif && !deletedNotif.read
                    ? Math.max(0, state.unreadCount - 1)
                    : state.unreadCount
            };

        case CLEAR_ALL_NOTIFICATIONS:
            return {
                ...state,
                notifications: [],
                unreadCount: 0
            };

        case UPDATE_NOTIFICATION_PREFERENCES:
            return {
                ...state,
                preferences: action.payload
            };

        default:
            return state;
    }
};

export default NotificationReducer;
