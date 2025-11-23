// Admin Action Types
export const ADMIN_LOADING = 'ADMIN_LOADING';
export const ADMIN_ERROR = 'ADMIN_ERROR';
export const SET_PENDING_CLAIMS = 'SET_PENDING_CLAIMS';
export const SET_PENDING_LISTINGS = 'SET_PENDING_LISTINGS';
export const SET_REPORTED_CONTENT = 'SET_REPORTED_CONTENT';
export const SET_USER_LIST = 'SET_USER_LIST';
export const APPROVE_CLAIM = 'APPROVE_CLAIM';
export const REJECT_CLAIM = 'REJECT_CLAIM';
export const VERIFY_BUSINESS = 'VERIFY_BUSINESS';
export const UNVERIFY_BUSINESS = 'UNVERIFY_BUSINESS';
export const APPROVE_LISTING = 'APPROVE_LISTING';
export const REJECT_LISTING = 'REJECT_LISTING';
export const BAN_USER = 'BAN_USER';
export const UNBAN_USER = 'UNBAN_USER';
export const SET_ADMIN_STATS = 'SET_ADMIN_STATS';
export const RESOLVE_REPORT = 'RESOLVE_REPORT';
export const DELETE_CONTENT = 'DELETE_CONTENT';

// Report types
export const REPORT_TYPES = {
    SPAM: 'spam',
    INAPPROPRIATE: 'inappropriate',
    MISLEADING: 'misleading',
    DUPLICATE: 'duplicate',
    WRONG_CATEGORY: 'wrong_category',
    CLOSED_BUSINESS: 'closed_business',
    OTHER: 'other'
};

// Verification statuses
export const VERIFICATION_STATUS = {
    UNVERIFIED: 'unverified',
    PENDING: 'pending',
    VERIFIED: 'verified',
    REJECTED: 'rejected'
};

// Check if user is admin
export const isAdmin = (userId) => {
    const admins = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    return admins.includes(userId);
};

// Load admin dashboard
export const loadAdminDashboard = () => {
    return (dispatch, getState) => {
        const { auth } = getState();
        const userId = auth.auth?.localId;

        if (!isAdmin(userId)) {
            dispatch({
                type: ADMIN_ERROR,
                payload: 'Unauthorized: Admin access required'
            });
            return;
        }

        dispatch({ type: ADMIN_LOADING });

        // Load all admin data
        dispatch(loadPendingClaims());
        dispatch(loadPendingListings());
        dispatch(loadReportedContent());
        dispatch(loadAdminStats());
    };
};

// Load pending business claims
export const loadPendingClaims = () => {
    return (dispatch) => {
        const claims = JSON.parse(localStorage.getItem('businessClaims') || '{}');
        const pendingClaims = Object.entries(claims)
            .filter(([_, claim]) => claim.status === 'pending')
            .map(([businessId, claim]) => ({ ...claim, businessId }));

        dispatch({
            type: SET_PENDING_CLAIMS,
            payload: pendingClaims
        });
    };
};

// Approve a business claim
export const approveClaim = (businessId, claimData) => {
    return (dispatch) => {
        const claims = JSON.parse(localStorage.getItem('businessClaims') || '{}');
        claims[businessId] = {
            ...claims[businessId],
            status: 'approved',
            approvedAt: new Date().toISOString()
        };
        localStorage.setItem('businessClaims', JSON.stringify(claims));

        // Update business verification
        dispatch(verifyBusiness(businessId));

        // Update user's my listings
        const userId = claimData.userId;
        const myListings = JSON.parse(localStorage.getItem(`myListings_${userId}`) || '[]');
        const businessData = claims[businessId].businessData || {};
        myListings.push({
            id: businessId,
            ...businessData,
            ownerId: userId,
            claimedAt: new Date().toISOString(),
            verified: true
        });
        localStorage.setItem(`myListings_${userId}`, JSON.stringify(myListings));

        dispatch({
            type: APPROVE_CLAIM,
            payload: businessId
        });

        return { success: true };
    };
};

// Reject a business claim
export const rejectClaim = (businessId, reason = '') => {
    return (dispatch) => {
        const claims = JSON.parse(localStorage.getItem('businessClaims') || '{}');
        claims[businessId] = {
            ...claims[businessId],
            status: 'rejected',
            rejectionReason: reason,
            rejectedAt: new Date().toISOString()
        };
        localStorage.setItem('businessClaims', JSON.stringify(claims));

        dispatch({
            type: REJECT_CLAIM,
            payload: { businessId, reason }
        });

        return { success: true };
    };
};

// Verify a business
export const verifyBusiness = (businessId) => {
    return (dispatch) => {
        const verified = JSON.parse(localStorage.getItem('verifiedBusinesses') || '[]');
        if (!verified.includes(businessId)) {
            verified.push(businessId);
            localStorage.setItem('verifiedBusinesses', JSON.stringify(verified));
        }

        dispatch({
            type: VERIFY_BUSINESS,
            payload: businessId
        });
    };
};

// Remove business verification
export const unverifyBusiness = (businessId) => {
    return (dispatch) => {
        let verified = JSON.parse(localStorage.getItem('verifiedBusinesses') || '[]');
        verified = verified.filter(id => id !== businessId);
        localStorage.setItem('verifiedBusinesses', JSON.stringify(verified));

        dispatch({
            type: UNVERIFY_BUSINESS,
            payload: businessId
        });
    };
};

// Check if business is verified
export const isBusinessVerified = (businessId) => {
    const verified = JSON.parse(localStorage.getItem('verifiedBusinesses') || '[]');
    return verified.includes(businessId);
};

// Load pending listings for approval
export const loadPendingListings = () => {
    return (dispatch) => {
        const pending = JSON.parse(localStorage.getItem('pendingListings') || '[]');
        dispatch({
            type: SET_PENDING_LISTINGS,
            payload: pending
        });
    };
};

// Approve a listing
export const approveListing = (listingId) => {
    return (dispatch) => {
        let pending = JSON.parse(localStorage.getItem('pendingListings') || '[]');
        const listing = pending.find(l => l.id === listingId);

        if (listing) {
            // Move to approved listings
            const approved = JSON.parse(localStorage.getItem('approvedListings') || '[]');
            approved.push({ ...listing, approvedAt: new Date().toISOString() });
            localStorage.setItem('approvedListings', JSON.stringify(approved));

            // Remove from pending
            pending = pending.filter(l => l.id !== listingId);
            localStorage.setItem('pendingListings', JSON.stringify(pending));
        }

        dispatch({
            type: APPROVE_LISTING,
            payload: listingId
        });
    };
};

// Reject a listing
export const rejectListing = (listingId, reason = '') => {
    return (dispatch) => {
        let pending = JSON.parse(localStorage.getItem('pendingListings') || '[]');
        const listing = pending.find(l => l.id === listingId);

        if (listing) {
            // Move to rejected listings
            const rejected = JSON.parse(localStorage.getItem('rejectedListings') || '[]');
            rejected.push({
                ...listing,
                rejectedAt: new Date().toISOString(),
                rejectionReason: reason
            });
            localStorage.setItem('rejectedListings', JSON.stringify(rejected));

            // Remove from pending
            pending = pending.filter(l => l.id !== listingId);
            localStorage.setItem('pendingListings', JSON.stringify(pending));
        }

        dispatch({
            type: REJECT_LISTING,
            payload: { listingId, reason }
        });
    };
};

// Load reported content
export const loadReportedContent = () => {
    return (dispatch) => {
        const reports = JSON.parse(localStorage.getItem('contentReports') || '[]');
        const unresolvedReports = reports.filter(r => !r.resolved);

        dispatch({
            type: SET_REPORTED_CONTENT,
            payload: unresolvedReports
        });
    };
};

// Report content (user action)
export const reportContent = (contentType, contentId, reportType, details = '') => {
    return (dispatch, getState) => {
        const { auth } = getState();
        const userId = auth.auth?.localId;

        const report = {
            id: `report_${Date.now()}`,
            contentType, // 'listing', 'review', 'user'
            contentId,
            reportType,
            details,
            reportedBy: userId,
            createdAt: new Date().toISOString(),
            resolved: false
        };

        const reports = JSON.parse(localStorage.getItem('contentReports') || '[]');
        reports.push(report);
        localStorage.setItem('contentReports', JSON.stringify(reports));

        return { success: true, reportId: report.id };
    };
};

// Resolve a report
export const resolveReport = (reportId, action, notes = '') => {
    return (dispatch) => {
        const reports = JSON.parse(localStorage.getItem('contentReports') || '[]');
        const index = reports.findIndex(r => r.id === reportId);

        if (index !== -1) {
            reports[index] = {
                ...reports[index],
                resolved: true,
                resolvedAction: action,
                resolutionNotes: notes,
                resolvedAt: new Date().toISOString()
            };
            localStorage.setItem('contentReports', JSON.stringify(reports));
        }

        dispatch({
            type: RESOLVE_REPORT,
            payload: { reportId, action }
        });
    };
};

// Delete content (admin action)
export const deleteContent = (contentType, contentId, reason = '') => {
    return (dispatch) => {
        const deletedContent = JSON.parse(localStorage.getItem('deletedContent') || '[]');
        deletedContent.push({
            contentType,
            contentId,
            reason,
            deletedAt: new Date().toISOString()
        });
        localStorage.setItem('deletedContent', JSON.stringify(deletedContent));

        dispatch({
            type: DELETE_CONTENT,
            payload: { contentType, contentId }
        });
    };
};

// Ban a user
export const banUser = (userId, reason = '', duration = null) => {
    return (dispatch) => {
        const bannedUsers = JSON.parse(localStorage.getItem('bannedUsers') || '{}');
        bannedUsers[userId] = {
            reason,
            bannedAt: new Date().toISOString(),
            expiresAt: duration ? new Date(Date.now() + duration).toISOString() : null
        };
        localStorage.setItem('bannedUsers', JSON.stringify(bannedUsers));

        dispatch({
            type: BAN_USER,
            payload: { userId, reason }
        });
    };
};

// Unban a user
export const unbanUser = (userId) => {
    return (dispatch) => {
        const bannedUsers = JSON.parse(localStorage.getItem('bannedUsers') || '{}');
        delete bannedUsers[userId];
        localStorage.setItem('bannedUsers', JSON.stringify(bannedUsers));

        dispatch({
            type: UNBAN_USER,
            payload: userId
        });
    };
};

// Check if user is banned
export const isUserBanned = (userId) => {
    const bannedUsers = JSON.parse(localStorage.getItem('bannedUsers') || '{}');
    const ban = bannedUsers[userId];

    if (!ban) return false;

    // Check if ban has expired
    if (ban.expiresAt && new Date(ban.expiresAt) < new Date()) {
        // Auto-unban
        delete bannedUsers[userId];
        localStorage.setItem('bannedUsers', JSON.stringify(bannedUsers));
        return false;
    }

    return true;
};

// Load admin statistics
export const loadAdminStats = () => {
    return (dispatch) => {
        const claims = JSON.parse(localStorage.getItem('businessClaims') || '{}');
        const pendingListings = JSON.parse(localStorage.getItem('pendingListings') || '[]');
        const reports = JSON.parse(localStorage.getItem('contentReports') || '[]');
        const verified = JSON.parse(localStorage.getItem('verifiedBusinesses') || '[]');
        const bannedUsers = JSON.parse(localStorage.getItem('bannedUsers') || '{}');

        const stats = {
            pendingClaims: Object.values(claims).filter(c => c.status === 'pending').length,
            approvedClaims: Object.values(claims).filter(c => c.status === 'approved').length,
            rejectedClaims: Object.values(claims).filter(c => c.status === 'rejected').length,
            pendingListings: pendingListings.length,
            unresolvedReports: reports.filter(r => !r.resolved).length,
            totalReports: reports.length,
            verifiedBusinesses: verified.length,
            bannedUsers: Object.keys(bannedUsers).length,
            reportsThisWeek: reports.filter(r => {
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                return new Date(r.createdAt) > weekAgo;
            }).length
        };

        dispatch({
            type: SET_ADMIN_STATS,
            payload: stats
        });
    };
};

// Add admin user
export const addAdmin = (userId) => {
    const admins = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    if (!admins.includes(userId)) {
        admins.push(userId);
        localStorage.setItem('adminUsers', JSON.stringify(admins));
    }
};

// Remove admin user
export const removeAdmin = (userId) => {
    let admins = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    admins = admins.filter(id => id !== userId);
    localStorage.setItem('adminUsers', JSON.stringify(admins));
};
