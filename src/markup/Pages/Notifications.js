import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import {
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    requestPushPermission
} from '../../store/actions/NotificationActions';

const Notifications = ({
    auth,
    notifications,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    requestPushPermission
}) => {
    const userId = auth.auth?.localId;

    useEffect(() => {
        if (userId) {
            loadNotifications(userId);
        }
    }, [userId, loadNotifications]);

    const { notifications: notificationList, unreadCount, loading, preferences } = notifications;

    const getNotificationIcon = (type) => {
        const icons = {
            'new_review': 'fa-star',
            'review_reply': 'fa-reply',
            'favorite_milestone': 'fa-heart',
            'business_update': 'fa-building',
            'claim_status': 'fa-check-circle',
            'badge_earned': 'fa-trophy',
            'system': 'fa-info-circle',
            'promotion': 'fa-gift'
        };
        return icons[type] || 'fa-bell';
    };

    const getNotificationColor = (type) => {
        const colors = {
            'new_review': 'primary',
            'review_reply': 'info',
            'favorite_milestone': 'danger',
            'business_update': 'secondary',
            'claim_status': 'success',
            'badge_earned': 'warning',
            'system': 'dark',
            'promotion': 'purple'
        };
        return colors[type] || 'secondary';
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const handleMarkAsRead = (notificationId) => {
        markAsRead(userId, notificationId);
    };

    const handleDelete = (notificationId) => {
        deleteNotification(userId, notificationId);
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead(userId);
    };

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to clear all notifications?')) {
            clearAllNotifications(userId);
        }
    };

    const handleEnablePush = async () => {
        const result = await requestPushPermission();
        if (result) {
            alert('Push notifications enabled!');
        } else {
            alert('Push notifications were denied or are not supported.');
        }
    };

    return (
        <>
            <Header />
            <div className="page-content bg-white">
                {/* Page Banner */}
                <div className="dez-bnr-inr overlay-black-middle" style={{ backgroundColor: '#2c3e50' }}>
                    <div className="container">
                        <div className="dez-bnr-inr-entry">
                            <h1 className="text-white">Notifications</h1>
                            <nav aria-label="breadcrumb" className="breadcrumb-row">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item active">Notifications</li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="container py-5">
                    <div className="row">
                        {/* Main Content */}
                        <div className="col-lg-8">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-0">
                                            All Notifications
                                            {unreadCount > 0 && (
                                                <span className="badge bg-danger ms-2">{unreadCount} new</span>
                                            )}
                                        </h5>
                                    </div>
                                    <div>
                                        {unreadCount > 0 && (
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={handleMarkAllAsRead}
                                            >
                                                Mark all as read
                                            </button>
                                        )}
                                        {notificationList.length > 0 && (
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={handleClearAll}
                                            >
                                                Clear all
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="card-body p-0">
                                    {loading ? (
                                        <div className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : notificationList.length === 0 ? (
                                        <div className="text-center py-5">
                                            <i className="fa fa-bell-slash fa-3x text-muted mb-3"></i>
                                            <p className="text-muted">No notifications yet</p>
                                        </div>
                                    ) : (
                                        <ul className="list-group list-group-flush">
                                            {notificationList.map(notification => (
                                                <li
                                                    key={notification.id}
                                                    className={`list-group-item ${!notification.read ? 'bg-light' : ''}`}
                                                >
                                                    <div className="d-flex">
                                                        <div className="me-3">
                                                            <span className={`badge bg-${getNotificationColor(notification.type)} rounded-circle p-2`}>
                                                                <i className={`fa ${getNotificationIcon(notification.type)}`}></i>
                                                            </span>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <div className="d-flex justify-content-between align-items-start">
                                                                <div>
                                                                    <strong>{notification.title}</strong>
                                                                    {!notification.read && (
                                                                        <span className="badge bg-primary ms-2">New</span>
                                                                    )}
                                                                </div>
                                                                <small className="text-muted">
                                                                    {formatTime(notification.createdAt)}
                                                                </small>
                                                            </div>
                                                            <p className="mb-1 text-muted">{notification.message}</p>
                                                            <div className="mt-2">
                                                                {notification.actionUrl && (
                                                                    <Link
                                                                        to={notification.actionUrl}
                                                                        className="btn btn-sm btn-outline-primary me-2"
                                                                    >
                                                                        View
                                                                    </Link>
                                                                )}
                                                                {!notification.read && (
                                                                    <button
                                                                        className="btn btn-sm btn-outline-secondary me-2"
                                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                                    >
                                                                        Mark as read
                                                                    </button>
                                                                )}
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleDelete(notification.id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="col-lg-4">
                            {/* Notification Settings */}
                            <div className="card mb-4">
                                <div className="card-header">
                                    <h6 className="mb-0">Notification Settings</h6>
                                </div>
                                <div className="card-body">
                                    <div className="form-check mb-2">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="emailNotifs"
                                            defaultChecked={preferences?.emailNotifications}
                                        />
                                        <label className="form-check-label" htmlFor="emailNotifs">
                                            Email Notifications
                                        </label>
                                    </div>
                                    <div className="form-check mb-3">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="pushNotifs"
                                            defaultChecked={preferences?.pushNotifications}
                                        />
                                        <label className="form-check-label" htmlFor="pushNotifs">
                                            Push Notifications
                                        </label>
                                    </div>

                                    {!preferences?.pushNotifications && (
                                        <button
                                            className="btn btn-sm btn-outline-primary w-100"
                                            onClick={handleEnablePush}
                                        >
                                            Enable Push Notifications
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Notification Types */}
                            <div className="card">
                                <div className="card-header">
                                    <h6 className="mb-0">Notification Types</h6>
                                </div>
                                <div className="card-body">
                                    <div className="form-check mb-2">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="newReviews"
                                            defaultChecked={preferences?.newReviews !== false}
                                        />
                                        <label className="form-check-label" htmlFor="newReviews">
                                            New Reviews
                                        </label>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="favorites"
                                            defaultChecked={preferences?.favorites !== false}
                                        />
                                        <label className="form-check-label" htmlFor="favorites">
                                            Favorite Milestones
                                        </label>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="claimUpdates"
                                            defaultChecked={preferences?.claimUpdates !== false}
                                        />
                                        <label className="form-check-label" htmlFor="claimUpdates">
                                            Claim Updates
                                        </label>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="badges"
                                            defaultChecked={preferences?.badges !== false}
                                        />
                                        <label className="form-check-label" htmlFor="badges">
                                            Badge Achievements
                                        </label>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="systemUpdates"
                                            defaultChecked={preferences?.systemUpdates !== false}
                                        />
                                        <label className="form-check-label" htmlFor="systemUpdates">
                                            System Updates
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="promotions"
                                            defaultChecked={preferences?.promotions === true}
                                        />
                                        <label className="form-check-label" htmlFor="promotions">
                                            Promotions & Offers
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    notifications: state.notifications
});

const mapDispatchToProps = {
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    requestPushPermission
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
