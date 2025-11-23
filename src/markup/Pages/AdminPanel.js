import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import {
    loadAdminDashboard,
    approveClaim,
    rejectClaim,
    approveListing,
    rejectListing,
    resolveReport,
    banUser,
    unbanUser,
    isAdmin
} from '../../store/actions/AdminActions';

const AdminPanel = ({
    auth,
    admin,
    loadAdminDashboard,
    approveClaim,
    rejectClaim,
    approveListing,
    rejectListing,
    resolveReport,
    banUser,
    unbanUser
}) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [rejectReason, setRejectReason] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

    const userId = auth.auth?.localId;
    const isUserAdmin = isAdmin(userId);

    useEffect(() => {
        if (isUserAdmin) {
            loadAdminDashboard();
        }
    }, [isUserAdmin, loadAdminDashboard]);

    const { stats, pendingClaims, pendingListings, reportedContent, loading, error } = admin;

    const handleApproveClaim = (businessId, claim) => {
        approveClaim(businessId, claim);
    };

    const handleRejectClaim = (businessId) => {
        if (rejectReason) {
            rejectClaim(businessId, rejectReason);
            setRejectReason('');
            setSelectedItem(null);
        }
    };

    const handleResolveReport = (reportId, action) => {
        resolveReport(reportId, action);
    };

    if (!isUserAdmin) {
        return (
            <>
                <Header />
                <div className="page-content bg-white">
                    <div className="container py-5 text-center">
                        <h2>Access Denied</h2>
                        <p className="text-muted">You do not have permission to access the admin panel.</p>
                        <Link to="/" className="btn btn-primary">Go Home</Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

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
                <div className="dez-bnr-inr overlay-black-middle" style={{ backgroundColor: '#1a1a2e' }}>
                    <div className="container">
                        <div className="dez-bnr-inr-entry">
                            <h1 className="text-white">Admin Panel</h1>
                            <nav aria-label="breadcrumb" className="breadcrumb-row">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item active">Admin</li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="container py-5">
                    {error && (
                        <div className="alert alert-danger">{error}</div>
                    )}

                    {/* Admin Tabs */}
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
                                className={`nav-link ${activeTab === 'claims' ? 'active' : ''}`}
                                onClick={() => setActiveTab('claims')}
                            >
                                Claims ({stats.pendingClaims})
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'listings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('listings')}
                            >
                                Listings ({stats.pendingListings})
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
                                onClick={() => setActiveTab('reports')}
                            >
                                Reports ({stats.unresolvedReports})
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                                onClick={() => setActiveTab('users')}
                            >
                                Users
                            </button>
                        </li>
                    </ul>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="row">
                            {/* Stats Cards */}
                            <div className="col-lg-3 col-md-6 mb-4">
                                <div className="card bg-warning text-dark h-100">
                                    <div className="card-body">
                                        <h6 className="card-title">Pending Claims</h6>
                                        <h2 className="mb-0">{stats.pendingClaims}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 mb-4">
                                <div className="card bg-info text-white h-100">
                                    <div className="card-body">
                                        <h6 className="card-title">Pending Listings</h6>
                                        <h2 className="mb-0">{stats.pendingListings}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 mb-4">
                                <div className="card bg-danger text-white h-100">
                                    <div className="card-body">
                                        <h6 className="card-title">Unresolved Reports</h6>
                                        <h2 className="mb-0">{stats.unresolvedReports}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 mb-4">
                                <div className="card bg-success text-white h-100">
                                    <div className="card-body">
                                        <h6 className="card-title">Verified Businesses</h6>
                                        <h2 className="mb-0">{stats.verifiedBusinesses}</h2>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Stats */}
                            <div className="col-lg-6 mb-4">
                                <div className="card h-100">
                                    <div className="card-header">
                                        <h5 className="mb-0">Claims Summary</h5>
                                    </div>
                                    <div className="card-body">
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Pending</span>
                                                <span className="badge bg-warning text-dark">{stats.pendingClaims}</span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Approved</span>
                                                <span className="badge bg-success">{stats.approvedClaims}</span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Rejected</span>
                                                <span className="badge bg-danger">{stats.rejectedClaims}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6 mb-4">
                                <div className="card h-100">
                                    <div className="card-header">
                                        <h5 className="mb-0">Moderation Stats</h5>
                                    </div>
                                    <div className="card-body">
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Total Reports</span>
                                                <span className="badge bg-secondary">{stats.totalReports}</span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Reports This Week</span>
                                                <span className="badge bg-info">{stats.reportsThisWeek}</span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Banned Users</span>
                                                <span className="badge bg-dark">{stats.bannedUsers}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Claims Tab */}
                    {activeTab === 'claims' && (
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Pending Business Claims</h5>
                            </div>
                            <div className="card-body">
                                {pendingClaims.length === 0 ? (
                                    <p className="text-muted text-center py-4">No pending claims</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Business</th>
                                                    <th>Claimant</th>
                                                    <th>Submitted</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pendingClaims.map(claim => (
                                                    <tr key={claim.businessId}>
                                                        <td>
                                                            <strong>{claim.businessName || claim.businessId}</strong>
                                                        </td>
                                                        <td>{claim.contactName || claim.userId}</td>
                                                        <td>{new Date(claim.submittedAt).toLocaleDateString()}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-success me-2"
                                                                onClick={() => handleApproveClaim(claim.businessId, claim)}
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => setSelectedItem(claim)}
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#rejectModal"
                                                            >
                                                                Reject
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Listings Tab */}
                    {activeTab === 'listings' && (
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Pending Listings</h5>
                            </div>
                            <div className="card-body">
                                {pendingListings.length === 0 ? (
                                    <p className="text-muted text-center py-4">No pending listings</p>
                                ) : (
                                    <div className="row">
                                        {pendingListings.map(listing => (
                                            <div key={listing.id} className="col-lg-6 mb-4">
                                                <div className="card h-100">
                                                    <div className="card-body">
                                                        <h5 className="card-title">{listing.name || listing.title}</h5>
                                                        <p className="text-muted small">{listing.category} | {listing.city}</p>
                                                        <p className="card-text small">{listing.description?.substring(0, 150)}...</p>
                                                    </div>
                                                    <div className="card-footer bg-transparent">
                                                        <button
                                                            className="btn btn-sm btn-success me-2"
                                                            onClick={() => approveListing(listing.id)}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => rejectListing(listing.id, 'Does not meet guidelines')}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Reports Tab */}
                    {activeTab === 'reports' && (
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Reported Content</h5>
                            </div>
                            <div className="card-body">
                                {reportedContent.length === 0 ? (
                                    <p className="text-muted text-center py-4">No unresolved reports</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Type</th>
                                                    <th>Reason</th>
                                                    <th>Details</th>
                                                    <th>Reported</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportedContent.map(report => (
                                                    <tr key={report.id}>
                                                        <td>
                                                            <span className={`badge ${
                                                                report.contentType === 'listing' ? 'bg-primary' :
                                                                report.contentType === 'review' ? 'bg-info' : 'bg-secondary'
                                                            }`}>
                                                                {report.contentType}
                                                            </span>
                                                        </td>
                                                        <td>{report.reportType}</td>
                                                        <td>{report.details?.substring(0, 50)}...</td>
                                                        <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-outline-success me-1"
                                                                onClick={() => handleResolveReport(report.id, 'dismissed')}
                                                                title="Dismiss"
                                                            >
                                                                Dismiss
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleResolveReport(report.id, 'removed')}
                                                                title="Remove Content"
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">User Management</h5>
                            </div>
                            <div className="card-body">
                                <p className="text-muted">
                                    User management features including search, view profiles, and moderation actions.
                                </p>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search users by email or name..."
                                    />
                                </div>
                                <div className="alert alert-info">
                                    <strong>Quick Stats:</strong>
                                    <br />
                                    Banned Users: {stats.bannedUsers}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Reject Modal */}
                <div className="modal fade" id="rejectModal" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Reject Claim</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Reason for Rejection</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        placeholder="Please provide a reason..."
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => selectedItem && handleRejectClaim(selectedItem.businessId)}
                                    data-bs-dismiss="modal"
                                >
                                    Reject
                                </button>
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
    admin: state.admin
});

const mapDispatchToProps = {
    loadAdminDashboard,
    approveClaim,
    rejectClaim,
    approveListing,
    rejectListing,
    resolveReport,
    banUser,
    unbanUser
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel);
