import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import { loadProfile, updateProfile, BADGES } from '../../store/actions/UserProfileActions';

const UserProfile = ({
    auth,
    userProfile,
    loadProfile,
    updateProfile
}) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        displayName: '',
        bio: '',
        location: '',
        website: '',
        socialLinks: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: ''
        }
    });

    useEffect(() => {
        if (auth.auth?.localId) {
            loadProfile(auth.auth.localId);
        }
    }, [auth.auth?.localId, loadProfile]);

    useEffect(() => {
        if (userProfile.profile) {
            setFormData({
                displayName: userProfile.profile.displayName || '',
                bio: userProfile.profile.bio || '',
                location: userProfile.profile.location || '',
                website: userProfile.profile.website || '',
                socialLinks: userProfile.profile.socialLinks || {
                    facebook: '',
                    twitter: '',
                    instagram: '',
                    linkedin: ''
                }
            });
        }
    }, [userProfile.profile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('social_')) {
            const socialPlatform = name.replace('social_', '');
            setFormData(prev => ({
                ...prev,
                socialLinks: {
                    ...prev.socialLinks,
                    [socialPlatform]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(auth.auth.localId, formData);
        setIsEditing(false);
    };

    const { profile, activityHistory, badges, loading } = userProfile;

    const getBadgeDetails = (badgeId) => {
        return Object.values(BADGES).find(b => b.id === badgeId) || null;
    };

    const formatActivityType = (type) => {
        const typeMap = {
            'profile_update': 'Updated profile',
            'review_added': 'Added a review',
            'favorite_added': 'Favorited a business',
            'listing_viewed': 'Viewed a listing',
            'share': 'Shared a business'
        };
        return typeMap[type] || type;
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="page-content bg-white">
                    <div className="container py-5 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="page-content bg-white">
                {/* Page Banner */}
                <div className="dez-bnr-inr overlay-black-middle" style={{ backgroundColor: '#2c3e50' }}>
                    <div className="container">
                        <div className="dez-bnr-inr-entry">
                            <h1 className="text-white">My Profile</h1>
                            <nav aria-label="breadcrumb" className="breadcrumb-row">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item active">Profile</li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="container py-5">
                    <div className="row">
                        {/* Profile Sidebar */}
                        <div className="col-lg-4 mb-4">
                            <div className="card">
                                <div className="card-body text-center">
                                    <div className="profile-avatar mb-3">
                                        <div
                                            className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto"
                                            style={{ width: '100px', height: '100px', fontSize: '2.5rem', color: 'white' }}
                                        >
                                            {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    </div>
                                    <h4>{profile.displayName || 'Anonymous User'}</h4>
                                    {profile.location && (
                                        <p className="text-muted mb-2">
                                            <i className="fa fa-map-marker me-1"></i> {profile.location}
                                        </p>
                                    )}
                                    <p className="text-muted small">
                                        Member since {new Date(profile.createdAt).toLocaleDateString()}
                                    </p>

                                    {/* Badge Count */}
                                    <div className="d-flex justify-content-center gap-4 mt-3 pt-3 border-top">
                                        <div className="text-center">
                                            <h5 className="mb-0">{badges.length}</h5>
                                            <small className="text-muted">Badges</small>
                                        </div>
                                        <div className="text-center">
                                            <h5 className="mb-0">{activityHistory.length}</h5>
                                            <small className="text-muted">Activities</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="card mt-4">
                                <div className="card-body">
                                    <h6 className="card-title">Quick Links</h6>
                                    <ul className="list-unstyled mb-0">
                                        <li className="mb-2">
                                            <Link to="/dashboard">
                                                <i className="fa fa-dashboard me-2"></i> Dashboard
                                            </Link>
                                        </li>
                                        <li className="mb-2">
                                            <Link to="/favorites">
                                                <i className="fa fa-heart me-2"></i> My Favorites
                                            </Link>
                                        </li>
                                        <li className="mb-2">
                                            <Link to="/my-appointments">
                                                <i className="fa fa-calendar me-2"></i> My Appointments
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/notifications">
                                                <i className="fa fa-bell me-2"></i> Notifications
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-lg-8">
                            {/* Tabs */}
                            <ul className="nav nav-tabs mb-4">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('profile')}
                                    >
                                        Profile
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'badges' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('badges')}
                                    >
                                        Badges ({badges.length})
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'activity' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('activity')}
                                    >
                                        Activity
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('settings')}
                                    >
                                        Settings
                                    </button>
                                </li>
                            </ul>

                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">Profile Information</h5>
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => setIsEditing(!isEditing)}
                                        >
                                            {isEditing ? 'Cancel' : 'Edit'}
                                        </button>
                                    </div>
                                    <div className="card-body">
                                        {isEditing ? (
                                            <form onSubmit={handleSubmit}>
                                                <div className="mb-3">
                                                    <label className="form-label">Display Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="displayName"
                                                        value={formData.displayName}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Bio</label>
                                                    <textarea
                                                        className="form-control"
                                                        name="bio"
                                                        rows="3"
                                                        value={formData.bio}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Location</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="location"
                                                        value={formData.location}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Website</label>
                                                    <input
                                                        type="url"
                                                        className="form-control"
                                                        name="website"
                                                        value={formData.website}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <h6 className="mt-4 mb-3">Social Links</h6>
                                                <div className="row">
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">Facebook</label>
                                                        <input
                                                            type="url"
                                                            className="form-control"
                                                            name="social_facebook"
                                                            value={formData.socialLinks.facebook}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">Twitter</label>
                                                        <input
                                                            type="url"
                                                            className="form-control"
                                                            name="social_twitter"
                                                            value={formData.socialLinks.twitter}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">Instagram</label>
                                                        <input
                                                            type="url"
                                                            className="form-control"
                                                            name="social_instagram"
                                                            value={formData.socialLinks.instagram}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">LinkedIn</label>
                                                        <input
                                                            type="url"
                                                            className="form-control"
                                                            name="social_linkedin"
                                                            value={formData.socialLinks.linkedin}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                                <button type="submit" className="btn btn-primary">
                                                    Save Changes
                                                </button>
                                            </form>
                                        ) : (
                                            <>
                                                <div className="row mb-3">
                                                    <div className="col-sm-4 text-muted">Display Name</div>
                                                    <div className="col-sm-8">{profile.displayName || 'Not set'}</div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-sm-4 text-muted">Bio</div>
                                                    <div className="col-sm-8">{profile.bio || 'Not set'}</div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-sm-4 text-muted">Location</div>
                                                    <div className="col-sm-8">{profile.location || 'Not set'}</div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-sm-4 text-muted">Website</div>
                                                    <div className="col-sm-8">
                                                        {profile.website ? (
                                                            <a href={profile.website} target="_blank" rel="noopener noreferrer">
                                                                {profile.website}
                                                            </a>
                                                        ) : 'Not set'}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Badges Tab */}
                            {activeTab === 'badges' && (
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="mb-0">My Badges</h5>
                                    </div>
                                    <div className="card-body">
                                        {badges.length === 0 ? (
                                            <div className="text-center py-4">
                                                <p className="text-muted">No badges earned yet</p>
                                                <p className="small text-muted">
                                                    Start reviewing businesses and saving favorites to earn badges!
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="row">
                                                {badges.map(badgeId => {
                                                    const badge = getBadgeDetails(badgeId);
                                                    if (!badge) return null;
                                                    return (
                                                        <div key={badgeId} className="col-md-4 col-6 mb-4">
                                                            <div className="card h-100 text-center">
                                                                <div className="card-body">
                                                                    <div className="badge-icon mb-2" style={{ fontSize: '2.5rem' }}>
                                                                        {badge.icon}
                                                                    </div>
                                                                    <h6 className="mb-1">{badge.name}</h6>
                                                                    <small className="text-muted">{badge.description}</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Available Badges */}
                                        <h6 className="mt-4 mb-3">Available Badges</h6>
                                        <div className="row">
                                            {Object.values(BADGES).filter(b => !badges.includes(b.id)).map(badge => (
                                                <div key={badge.id} className="col-md-4 col-6 mb-4">
                                                    <div className="card h-100 text-center" style={{ opacity: 0.5 }}>
                                                        <div className="card-body">
                                                            <div className="badge-icon mb-2" style={{ fontSize: '2rem' }}>
                                                                {badge.icon}
                                                            </div>
                                                            <h6 className="mb-1 small">{badge.name}</h6>
                                                            <small className="text-muted">{badge.description}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Activity Tab */}
                            {activeTab === 'activity' && (
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="mb-0">Recent Activity</h5>
                                    </div>
                                    <div className="card-body">
                                        {activityHistory.length === 0 ? (
                                            <p className="text-muted text-center py-4">No recent activity</p>
                                        ) : (
                                            <div className="timeline">
                                                {activityHistory.slice(0, 20).map((activity, index) => (
                                                    <div key={activity.id || index} className="timeline-item mb-3 pb-3 border-bottom">
                                                        <div className="d-flex justify-content-between">
                                                            <span>{formatActivityType(activity.type)}</span>
                                                            <small className="text-muted">
                                                                {new Date(activity.timestamp).toLocaleDateString()}
                                                            </small>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Settings Tab */}
                            {activeTab === 'settings' && (
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="mb-0">Account Settings</h5>
                                    </div>
                                    <div className="card-body">
                                        <h6>Notification Preferences</h6>
                                        <div className="form-check mb-2">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="emailNotifs"
                                                defaultChecked={profile.preferences?.emailNotifications}
                                            />
                                            <label className="form-check-label" htmlFor="emailNotifs">
                                                Email Notifications
                                            </label>
                                        </div>
                                        <div className="form-check mb-2">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="pushNotifs"
                                                defaultChecked={profile.preferences?.pushNotifications}
                                            />
                                            <label className="form-check-label" htmlFor="pushNotifs">
                                                Push Notifications
                                            </label>
                                        </div>
                                        <div className="form-check mb-4">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="newsletter"
                                                defaultChecked={profile.preferences?.newsletterSubscribed}
                                            />
                                            <label className="form-check-label" htmlFor="newsletter">
                                                Newsletter Subscription
                                            </label>
                                        </div>

                                        <hr />

                                        <h6>Account Actions</h6>
                                        <button className="btn btn-outline-secondary me-2 mb-2">
                                            Change Password
                                        </button>
                                        <button className="btn btn-outline-danger mb-2">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            )}
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
    userProfile: state.userProfile
});

const mapDispatchToProps = {
    loadProfile,
    updateProfile
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
