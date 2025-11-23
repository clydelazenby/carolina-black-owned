import {
    DASHBOARD_LOADING,
    DASHBOARD_LOADED,
    DASHBOARD_ERROR,
    SET_ANALYTICS,
    SET_MY_LISTINGS,
    CLAIM_BUSINESS_REQUEST,
    CLAIM_BUSINESS_SUCCESS,
    CLAIM_BUSINESS_ERROR,
    UPDATE_LISTING_STATS
} from '../actions/DashboardActions';

const initialState = {
    myListings: [],
    analytics: {
        totalListings: 0,
        totalViews: 0,
        totalFavorites: 0,
        totalReviews: 0,
        averageRating: 0,
        viewsThisMonth: 0,
        viewsLastMonth: 0,
        topPerformingListings: [],
        recentActivity: [],
        categoryBreakdown: {},
        locationBreakdown: {}
    },
    claims: {},
    loading: false,
    error: null
};

const DashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case DASHBOARD_LOADING:
            return {
                ...state,
                loading: true,
                error: null
            };

        case DASHBOARD_LOADED:
            return {
                ...state,
                loading: false,
                myListings: action.payload.myListings,
                analytics: action.payload.analytics
            };

        case DASHBOARD_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case SET_ANALYTICS:
            return {
                ...state,
                analytics: action.payload
            };

        case SET_MY_LISTINGS:
            return {
                ...state,
                myListings: action.payload
            };

        case CLAIM_BUSINESS_REQUEST:
            return {
                ...state,
                loading: true
            };

        case CLAIM_BUSINESS_SUCCESS:
            return {
                ...state,
                loading: false,
                claims: {
                    ...state.claims,
                    [action.payload.businessId]: action.payload.status
                }
            };

        case CLAIM_BUSINESS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case UPDATE_LISTING_STATS:
            return {
                ...state,
                myListings: state.myListings.map(listing =>
                    listing.id === action.payload.listingId
                        ? { ...listing, views: action.payload.views }
                        : listing
                )
            };

        default:
            return state;
    }
};

export default DashboardReducer;
