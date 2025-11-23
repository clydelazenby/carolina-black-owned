// Dashboard Action Types
export const DASHBOARD_LOADING = 'DASHBOARD_LOADING';
export const DASHBOARD_LOADED = 'DASHBOARD_LOADED';
export const DASHBOARD_ERROR = 'DASHBOARD_ERROR';
export const SET_ANALYTICS = 'SET_ANALYTICS';
export const SET_MY_LISTINGS = 'SET_MY_LISTINGS';
export const CLAIM_BUSINESS_REQUEST = 'CLAIM_BUSINESS_REQUEST';
export const CLAIM_BUSINESS_SUCCESS = 'CLAIM_BUSINESS_SUCCESS';
export const CLAIM_BUSINESS_ERROR = 'CLAIM_BUSINESS_ERROR';
export const UPDATE_LISTING_STATS = 'UPDATE_LISTING_STATS';

// Load dashboard data
export const loadDashboard = () => {
    return async (dispatch, getState) => {
        dispatch({ type: DASHBOARD_LOADING });

        try {
            const { auth } = getState();
            const userId = auth.auth?.localId;

            // Get user's listings
            const myListings = getMyListingsFromStorage(userId);

            // Calculate analytics
            const analytics = calculateAnalytics(myListings, getState());

            dispatch({
                type: DASHBOARD_LOADED,
                payload: { myListings, analytics }
            });
        } catch (error) {
            dispatch({
                type: DASHBOARD_ERROR,
                payload: error.message
            });
        }
    };
};

// Get analytics data
export const getAnalytics = () => {
    return (dispatch, getState) => {
        const { posts, favorites, reviews } = getState();
        const myListings = getState().dashboard?.myListings || [];

        const analytics = {
            totalListings: myListings.length,
            totalViews: myListings.reduce((sum, l) => sum + (l.views || 0), 0),
            totalFavorites: countFavoritesForListings(myListings, favorites.items),
            totalReviews: countReviewsForListings(myListings, reviews.byBusinessId),
            averageRating: calculateAverageRating(myListings, reviews.byBusinessId),
            viewsThisMonth: calculateMonthlyViews(myListings),
            viewsLastMonth: calculateLastMonthViews(myListings),
            topPerformingListings: getTopListings(myListings, 5),
            recentActivity: getRecentActivity(myListings, reviews.byBusinessId),
            categoryBreakdown: getCategoryBreakdown(myListings),
            locationBreakdown: getLocationBreakdown(myListings)
        };

        dispatch({ type: SET_ANALYTICS, payload: analytics });
        return analytics;
    };
};

// Claim a business
export const claimBusiness = (businessId, claimData) => {
    return async (dispatch, getState) => {
        dispatch({ type: CLAIM_BUSINESS_REQUEST });

        try {
            const { auth } = getState();
            const userId = auth.auth?.localId;

            // Store claim request
            const claims = JSON.parse(localStorage.getItem('businessClaims') || '{}');
            claims[businessId] = {
                userId,
                businessId,
                ...claimData,
                status: 'pending',
                submittedAt: new Date().toISOString()
            };
            localStorage.setItem('businessClaims', JSON.stringify(claims));

            dispatch({
                type: CLAIM_BUSINESS_SUCCESS,
                payload: { businessId, status: 'pending' }
            });

            return { success: true, message: 'Claim submitted successfully' };
        } catch (error) {
            dispatch({
                type: CLAIM_BUSINESS_ERROR,
                payload: error.message
            });
            return { success: false, message: error.message };
        }
    };
};

// Add listing to my listings
export const addToMyListings = (listing) => {
    return (dispatch, getState) => {
        const { auth } = getState();
        const userId = auth.auth?.localId;

        const myListings = getMyListingsFromStorage(userId);
        const newListing = {
            ...listing,
            ownerId: userId,
            createdAt: new Date().toISOString(),
            views: 0,
            viewHistory: []
        };

        myListings.push(newListing);
        saveMyListingsToStorage(userId, myListings);

        dispatch({ type: SET_MY_LISTINGS, payload: myListings });
    };
};

// Update listing
export const updateMyListing = (listingId, updates) => {
    return (dispatch, getState) => {
        const { auth } = getState();
        const userId = auth.auth?.localId;

        const myListings = getMyListingsFromStorage(userId);
        const index = myListings.findIndex(l => l.id === listingId);

        if (index !== -1) {
            myListings[index] = { ...myListings[index], ...updates, updatedAt: new Date().toISOString() };
            saveMyListingsToStorage(userId, myListings);
            dispatch({ type: SET_MY_LISTINGS, payload: myListings });
        }
    };
};

// Delete listing
export const deleteMyListing = (listingId) => {
    return (dispatch, getState) => {
        const { auth } = getState();
        const userId = auth.auth?.localId;

        let myListings = getMyListingsFromStorage(userId);
        myListings = myListings.filter(l => l.id !== listingId);
        saveMyListingsToStorage(userId, myListings);

        dispatch({ type: SET_MY_LISTINGS, payload: myListings });
    };
};

// Record a view for a listing
export const recordListingView = (listingId) => {
    return (dispatch) => {
        const viewKey = `listing_views_${listingId}`;
        const views = JSON.parse(localStorage.getItem(viewKey) || '[]');
        views.push({
            timestamp: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0]
        });
        localStorage.setItem(viewKey, JSON.stringify(views));

        dispatch({ type: UPDATE_LISTING_STATS, payload: { listingId, views: views.length } });
    };
};

// Helper functions
const getMyListingsFromStorage = (userId) => {
    const key = `myListings_${userId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
};

const saveMyListingsToStorage = (userId, listings) => {
    const key = `myListings_${userId}`;
    localStorage.setItem(key, JSON.stringify(listings));
};

const countFavoritesForListings = (listings, allFavorites) => {
    const listingIds = listings.map(l => l.id);
    return allFavorites.filter(f => listingIds.includes(f.id)).length;
};

const countReviewsForListings = (listings, reviewsByBusiness) => {
    return listings.reduce((sum, listing) => {
        const reviews = reviewsByBusiness[listing.id] || [];
        return sum + reviews.length;
    }, 0);
};

const calculateAverageRating = (listings, reviewsByBusiness) => {
    let totalRating = 0;
    let totalReviews = 0;

    listings.forEach(listing => {
        const reviews = reviewsByBusiness[listing.id] || [];
        reviews.forEach(r => {
            totalRating += r.rating;
            totalReviews++;
        });
    });

    return totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;
};

const calculateMonthlyViews = (listings) => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    return listings.reduce((sum, listing) => {
        const viewKey = `listing_views_${listing.id}`;
        const views = JSON.parse(localStorage.getItem(viewKey) || '[]');
        const monthViews = views.filter(v => {
            const date = new Date(v.timestamp);
            return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
        });
        return sum + monthViews.length;
    }, 0);
};

const calculateLastMonthViews = (listings) => {
    const now = new Date();
    const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

    return listings.reduce((sum, listing) => {
        const viewKey = `listing_views_${listing.id}`;
        const views = JSON.parse(localStorage.getItem(viewKey) || '[]');
        const monthViews = views.filter(v => {
            const date = new Date(v.timestamp);
            return date.getMonth() === lastMonth && date.getFullYear() === year;
        });
        return sum + monthViews.length;
    }, 0);
};

const getTopListings = (listings, count) => {
    return [...listings]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, count);
};

const getRecentActivity = (listings, reviewsByBusiness) => {
    const activities = [];

    listings.forEach(listing => {
        const reviews = reviewsByBusiness[listing.id] || [];
        reviews.forEach(review => {
            activities.push({
                type: 'review',
                listingId: listing.id,
                listingName: listing.name || listing.title,
                data: review,
                timestamp: review.createdAt
            });
        });
    });

    return activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);
};

const getCategoryBreakdown = (listings) => {
    const breakdown = {};
    listings.forEach(listing => {
        const category = listing.category || 'Other';
        breakdown[category] = (breakdown[category] || 0) + 1;
    });
    return breakdown;
};

const getLocationBreakdown = (listings) => {
    const breakdown = {};
    listings.forEach(listing => {
        const location = listing.city || listing.location || 'Unknown';
        breakdown[location] = (breakdown[location] || 0) + 1;
    });
    return breakdown;
};

const calculateAnalytics = (myListings, state) => {
    const { favorites, reviews } = state;
    return {
        totalListings: myListings.length,
        totalViews: myListings.reduce((sum, l) => sum + (l.views || 0), 0),
        totalFavorites: countFavoritesForListings(myListings, favorites.items),
        totalReviews: countReviewsForListings(myListings, reviews.byBusinessId),
        averageRating: calculateAverageRating(myListings, reviews.byBusinessId),
        viewsThisMonth: calculateMonthlyViews(myListings),
        viewsLastMonth: calculateLastMonthViews(myListings),
        topPerformingListings: getTopListings(myListings, 5),
        recentActivity: getRecentActivity(myListings, reviews.byBusinessId),
        categoryBreakdown: getCategoryBreakdown(myListings),
        locationBreakdown: getLocationBreakdown(myListings)
    };
};
