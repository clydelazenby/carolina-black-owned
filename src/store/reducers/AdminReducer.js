import {
    ADMIN_LOADING,
    ADMIN_ERROR,
    SET_PENDING_CLAIMS,
    SET_PENDING_LISTINGS,
    SET_REPORTED_CONTENT,
    SET_USER_LIST,
    APPROVE_CLAIM,
    REJECT_CLAIM,
    VERIFY_BUSINESS,
    UNVERIFY_BUSINESS,
    APPROVE_LISTING,
    REJECT_LISTING,
    BAN_USER,
    UNBAN_USER,
    SET_ADMIN_STATS,
    RESOLVE_REPORT,
    DELETE_CONTENT
} from '../actions/AdminActions';

const initialState = {
    pendingClaims: [],
    pendingListings: [],
    reportedContent: [],
    users: [],
    verifiedBusinesses: [],
    stats: {
        pendingClaims: 0,
        approvedClaims: 0,
        rejectedClaims: 0,
        pendingListings: 0,
        unresolvedReports: 0,
        totalReports: 0,
        verifiedBusinesses: 0,
        bannedUsers: 0,
        reportsThisWeek: 0
    },
    loading: false,
    error: null
};

const AdminReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADMIN_LOADING:
            return {
                ...state,
                loading: true,
                error: null
            };

        case ADMIN_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case SET_PENDING_CLAIMS:
            return {
                ...state,
                pendingClaims: action.payload,
                loading: false
            };

        case SET_PENDING_LISTINGS:
            return {
                ...state,
                pendingListings: action.payload
            };

        case SET_REPORTED_CONTENT:
            return {
                ...state,
                reportedContent: action.payload
            };

        case SET_USER_LIST:
            return {
                ...state,
                users: action.payload
            };

        case APPROVE_CLAIM:
            return {
                ...state,
                pendingClaims: state.pendingClaims.filter(c => c.businessId !== action.payload),
                stats: {
                    ...state.stats,
                    pendingClaims: state.stats.pendingClaims - 1,
                    approvedClaims: state.stats.approvedClaims + 1
                }
            };

        case REJECT_CLAIM:
            return {
                ...state,
                pendingClaims: state.pendingClaims.filter(c => c.businessId !== action.payload.businessId),
                stats: {
                    ...state.stats,
                    pendingClaims: state.stats.pendingClaims - 1,
                    rejectedClaims: state.stats.rejectedClaims + 1
                }
            };

        case VERIFY_BUSINESS:
            return {
                ...state,
                verifiedBusinesses: [...state.verifiedBusinesses, action.payload],
                stats: {
                    ...state.stats,
                    verifiedBusinesses: state.stats.verifiedBusinesses + 1
                }
            };

        case UNVERIFY_BUSINESS:
            return {
                ...state,
                verifiedBusinesses: state.verifiedBusinesses.filter(id => id !== action.payload),
                stats: {
                    ...state.stats,
                    verifiedBusinesses: state.stats.verifiedBusinesses - 1
                }
            };

        case APPROVE_LISTING:
            return {
                ...state,
                pendingListings: state.pendingListings.filter(l => l.id !== action.payload),
                stats: {
                    ...state.stats,
                    pendingListings: state.stats.pendingListings - 1
                }
            };

        case REJECT_LISTING:
            return {
                ...state,
                pendingListings: state.pendingListings.filter(l => l.id !== action.payload.listingId),
                stats: {
                    ...state.stats,
                    pendingListings: state.stats.pendingListings - 1
                }
            };

        case BAN_USER:
            return {
                ...state,
                users: state.users.map(u =>
                    u.id === action.payload.userId
                        ? { ...u, banned: true, banReason: action.payload.reason }
                        : u
                ),
                stats: {
                    ...state.stats,
                    bannedUsers: state.stats.bannedUsers + 1
                }
            };

        case UNBAN_USER:
            return {
                ...state,
                users: state.users.map(u =>
                    u.id === action.payload
                        ? { ...u, banned: false, banReason: null }
                        : u
                ),
                stats: {
                    ...state.stats,
                    bannedUsers: Math.max(0, state.stats.bannedUsers - 1)
                }
            };

        case SET_ADMIN_STATS:
            return {
                ...state,
                stats: action.payload
            };

        case RESOLVE_REPORT:
            return {
                ...state,
                reportedContent: state.reportedContent.filter(r => r.id !== action.payload.reportId),
                stats: {
                    ...state.stats,
                    unresolvedReports: Math.max(0, state.stats.unresolvedReports - 1)
                }
            };

        case DELETE_CONTENT:
            return {
                ...state
            };

        default:
            return state;
    }
};

export default AdminReducer;
