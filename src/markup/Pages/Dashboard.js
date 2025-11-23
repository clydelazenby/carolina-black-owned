import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import { loadDashboard, getAnalytics, deleteMyListing } from '../../store/actions/DashboardActions';

const Dashboard = ({
    auth,
    dashboard,
    loadDashboard,
    getAnalytics,
    deleteMyListing
}) => {
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (auth.auth?.localId) {
            loadDashboard();
        }
    }, [auth.auth?.localId, loadDashboard]);

    const { myListings, analytics, loading } = dashboard;

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num?.toString() || '0';
    };

    const getGrowthPercentage = () => {
        if (analytics.viewsLastMonth === 0) return analytics.viewsThisMonth > 0 ? 100 : 0;
        return Math.round(((analytics.viewsThisMonth - analytics.viewsLastMonth) / analytics.viewsLastMonth) * 100);
    };

    const handleDeleteListing = (listingId) => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            deleteMyListing(listingId);
        }
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
                            <h1 className="text-white">Business Dashboard</h1>
                            <nav aria-label="breadcrumb" className="breadcrumb-row">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item active">Dashboard</li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="container py-5">
                    {/* Dashboard Tabs */}
                    <ul className="nav nav-tabs mb-4">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'listings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('listings')}
                            >
                                My Listings ({myListings.length})
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                                onClick={() => setActiveTab('analytics')}
                            >
                                Analytics
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'activity' ? 'active' : ''}`}
                                onClick={() => setActiveTab('activity')}
                            >
                                Recent Activity
                            </button>
                        </li>
                    </ul>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="row">
                            {/* Stats Cards */}
                            <div className="col-lg-3 col-md-6 mb-4">
                                <div className="card bg-primary text-white h-100">
                                    <div className="card-body">
                                        <h6 className="card-title">Total Listings</h6>
                                        <h2 className="mb-0">{analytics.totalListings}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 mb-4">
                                <div className="card bg-success text-white h-100">
                                    <div className="card-body">
                                        <h6 className="card-title">Total Views</h6>
                                        <h2 className="mb-0">{formatNumber(analytics.totalViews)}</h2>
                                        <small>
                                            {getGrowthPercentage() >= 0 ? '+' : ''}{getGrowthPercentage()}% this month
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 mb-4">
                                <div className="card bg-danger text-white h-100">
                                    <div className="card-body">
                                        <h6 className="card-title">Favorites</h6>
                                        <h2 className="mb-0">{formatNumber(analytics.totalFavorites)}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 mb-4">
                                <div className="card bg-warning text-dark h-100">
                                    <div className="card-body">
                                        <h6 className="card-title">Reviews</h6>
                                        <h2 className="mb-0">{analytics.totalReviews}</h2>
                                        <small>Avg: {analytics.averageRating} stars</small>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="col-12 mb-4">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="mb-0">Quick Actions</h5>
                                    </div>
                                    <div className="card-body">
                                        <Link to="/add-listing" className="btn btn-primary me-2 mb-2">
                                            Add New Listing
                                        </Link>
                                        <Link to="/claim-business" className="btn btn-outline-primary me-2 mb-2">
                                            Claim a Business
                                        </Link>
                                        <Link to="/profile" className="btn btn-outline-secondary mb-2">
                                            Edit Profile
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Top Performing Listings */}
                            {analytics.topPerformingListings.length > 0 && (
                                <div className="col-lg-6 mb-4">
                                    <div className="card h-100">
                                        <div className="card-header">
                                            <h5 className="mb-0">Top Performing Listings</h5>
                                        </div>
                                        <div className="card-body">
                                            <ul className="list-group list-group-flush">
                                                {analytics.topPerformingListings.map((listing, index) => (
                                                    <li key={listing.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                        <span>
                                                            <strong>#{index + 1}</strong> {listing.name || listing.title}
                                                        </span>
                                                        <span className="badge bg-primary rounded-pill">
                                                            {listing.views || 0} views
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Category Breakdown */}
                            <div className="col-lg-6 mb-4">
                                <div className="card h-100">
                                    <div className="card-header">
                                        <h5 className="mb-0">Category Breakdown</h5>
                                    </div>
                                    <div className="card-body">
                                        {Object.keys(analytics.categoryBreakdown).length > 0 ? (
                                            <ul className="list-group list-group-flush">
                                                {Object.entries(analytics.categoryBreakdown).map(([category, count]) => (
                                                    <li key={category} className="list-group-item d-flex justify-content-between">
                                                        <span>{category}</span>
                                                        <span className="badge bg-secondary rounded-pill">{count}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-muted">No listings yet</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Listings Tab */}
                    {activeTab === 'listings' && (
                        <div className="row">
                            {myListings.length === 0 ? (
                                <div className="col-12 text-center py-5">
                                    <h4>You don't have any listings yet</h4>
                                    <p className="text-muted">Add your first business listing to get started</p>
                                    <Link to="/add-listing" className="btn btn-primary">
                                        Add New Listing
                                    </Link>
                                </div>
                            ) : (
                                myListings.map(listing => (
                                    <div key={listing.id} className="col-lg-6 mb-4">
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <h5 className="card-title">{listing.name || listing.title}</h5>
                                                        <p className="text-muted small mb-2">
                                                            {listing.category} | {listing.city || listing.location}
                                                        </p>
                                                    </div>
                                                    {listing.verified && (
                                                        <span className="badge bg-success">Verified</span>
                                                    )}
                                                </div>
                                                <p className="card-text small">{listing.description?.substring(0, 100)}...</p>
                                                <div className="d-flex gap-2 mt-3">
                                                    <span className="badge bg-light text-dark">
                                                        {listing.views || 0} views
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="card-footer bg-transparent">
                                                <Link
                                                    to={`/edit-listing/${listing.id}`}
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    to={`/listing-details?id=${listing.id}`}
                                                    className="btn btn-sm btn-outline-secondary me-2"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteListing(listing.id)}
                                                    className="btn btn-sm btn-outline-danger"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 'analytics' && (
                        <div className="row">
                            <div className="col-12 mb-4">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="mb-0">Views Overview</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="row text-center">
                                            <div className="col-md-4">
                                                <h3 className="text-primary">{analytics.viewsThisMonth}</h3>
                                                <p className="text-muted">Views This Month</p>
                                            </div>
                                            <div className="col-md-4">
                                                <h3 className="text-secondary">{analytics.viewsLastMonth}</h3>
                                                <p className="text-muted">Views Last Month</p>
                                            </div>
                                            <div className="col-md-4">
                                                <h3 className={getGrowthPercentage() >= 0 ? 'text-success' : 'text-danger'}>
                                                    {getGrowthPercentage() >= 0 ? '+' : ''}{getGrowthPercentage()}%
                                                </h3>
                                                <p className="text-muted">Growth</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Location Breakdown */}
                            <div className="col-lg-6 mb-4">
                                <div className="card h-100">
                                    <div className="card-header">
                                        <h5 className="mb-0">Listings by Location</h5>
                                    </div>
                                    <div className="card-body">
                                        {Object.keys(analytics.locationBreakdown).length > 0 ? (
                                            <ul className="list-group list-group-flush">
                                                {Object.entries(analytics.locationBreakdown).map(([location, count]) => (
                                                    <li key={location} className="list-group-item d-flex justify-content-between">
                                                        <span>{location}</span>
                                                        <span className="badge bg-info rounded-pill">{count}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-muted">No data available</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Performance Summary */}
                            <div className="col-lg-6 mb-4">
                                <div className="card h-100">
                                    <div className="card-header">
                                        <h5 className="mb-0">Performance Summary</h5>
                                    </div>
                                    <div className="card-body">
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Total Listings</span>
                                                <strong>{analytics.totalListings}</strong>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Total Reviews</span>
                                                <strong>{analytics.totalReviews}</strong>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Average Rating</span>
                                                <strong>{analytics.averageRating} / 5</strong>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Total Favorites</span>
                                                <strong>{analytics.totalFavorites}</strong>
                                            </li>
                                        </ul>
                                    </div>
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
                                {analytics.recentActivity.length === 0 ? (
                                    <p className="text-muted text-center py-4">No recent activity</p>
                                ) : (
                                    <div className="timeline">
                                        {analytics.recentActivity.map((activity, index) => (
                                            <div key={index} className="timeline-item mb-3 pb-3 border-bottom">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <strong>{activity.type === 'review' ? 'New Review' : activity.type}</strong>
                                                        <span className="text-muted ms-2">on {activity.listingName}</span>
                                                    </div>
                                                    <small className="text-muted">
                                                        {new Date(activity.timestamp).toLocaleDateString()}
                                                    </small>
                                                </div>
                                                {activity.type === 'review' && activity.data && (
                                                    <p className="mb-0 mt-2 small text-muted">
                                                        "{activity.data.comment?.substring(0, 100)}..."
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    dashboard: state.dashboard
});

const mapDispatchToProps = {
    loadDashboard,
    getAnalytics,
    deleteMyListing
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
