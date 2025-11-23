// User Profile Action Types
export const PROFILE_LOADING = 'PROFILE_LOADING';
export const PROFILE_LOADED = 'PROFILE_LOADED';
export const PROFILE_ERROR = 'PROFILE_ERROR';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const SET_ACTIVITY_HISTORY = 'SET_ACTIVITY_HISTORY';
export const ADD_BADGE = 'ADD_BADGE';
export const SET_BADGES = 'SET_BADGES';

// Badge definitions
export const BADGES = {
    FIRST_REVIEW: {
        id: 'first_review',
        name: 'First Review',
        description: 'Wrote your first review',
        icon: '⭐',
        category: 'reviews'
    },
    REVIEWER_5: {
        id: 'reviewer_5',
        name: 'Active Reviewer',
        description: 'Wrote 5 reviews',
        icon: '📝',
        category: 'reviews'
    },
    REVIEWER_25: {
        id: 'reviewer_25',
        name: 'Review Master',
        description: 'Wrote 25 reviews',
        icon: '🏆',
        category: 'reviews'
    },
    FIRST_FAVORITE: {
        id: 'first_favorite',
        name: 'First Favorite',
        description: 'Saved your first favorite',
        icon: '❤️',
        category: 'favorites'
    },
    COLLECTOR_10: {
        id: 'collector_10',
        name: 'Collector',
        description: 'Saved 10 favorites',
        icon: '📚',
        category: 'favorites'
    },
    BUSINESS_OWNER: {
        id: 'business_owner',
        name: 'Business Owner',
        description: 'Listed a business',
        icon: '🏪',
        category: 'business'
    },
    VERIFIED_OWNER: {
        id: 'verified_owner',
        name: 'Verified Owner',
        description: 'Verified business ownership',
        icon: '✅',
        category: 'business'
    },
    EARLY_ADOPTER: {
        id: 'early_adopter',
        name: 'Early Adopter',
        description: 'Joined during beta',
        icon: '🚀',
        category: 'special'
    },
    COMMUNITY_SUPPORTER: {
        id: 'community_supporter',
        name: 'Community Supporter',
        description: 'Shared 10 businesses',
        icon: '🤝',
        category: 'social'
    },
    EXPLORER: {
        id: 'explorer',
        name: 'Explorer',
        description: 'Viewed 50 businesses',
        icon: '🔍',
        category: 'engagement'
    }
};

// Load user profile
export const loadProfile = (userId) => {
    return async (dispatch) => {
        dispatch({ type: PROFILE_LOADING });

        try {
            const profile = getProfileFromStorage(userId);
            const activityHistory = getActivityHistory(userId);
            const badges = getBadgesFromStorage(userId);

            dispatch({
                type: PROFILE_LOADED,
                payload: {
                    profile,
                    activityHistory,
                    badges
                }
            });

            // Check for new badges
            dispatch(checkAndAwardBadges(userId));
        } catch (error) {
            dispatch({
                type: PROFILE_ERROR,
                payload: error.message
            });
        }
    };
};

// Update profile
export const updateProfile = (userId, profileData) => {
    return (dispatch) => {
        const existingProfile = getProfileFromStorage(userId);
        const updatedProfile = {
            ...existingProfile,
            ...profileData,
            updatedAt: new Date().toISOString()
        };

        saveProfileToStorage(userId, updatedProfile);

        dispatch({
            type: UPDATE_PROFILE,
            payload: updatedProfile
        });

        // Record activity
        dispatch(recordActivity(userId, 'profile_update', { changes: Object.keys(profileData) }));
    };
};

// Record user activity
export const recordActivity = (userId, activityType, data = {}) => {
    return (dispatch) => {
        const activity = {
            id: `activity_${Date.now()}`,
            type: activityType,
            data,
            timestamp: new Date().toISOString()
        };

        const history = getActivityHistory(userId);
        history.unshift(activity);

        // Keep only last 100 activities
        const trimmedHistory = history.slice(0, 100);
        saveActivityHistory(userId, trimmedHistory);

        dispatch({
            type: SET_ACTIVITY_HISTORY,
            payload: trimmedHistory
        });

        // Check for badge eligibility
        dispatch(checkAndAwardBadges(userId));
    };
};

// Check and award badges
export const checkAndAwardBadges = (userId) => {
    return (dispatch, getState) => {
        const { reviews, favorites } = getState();
        const currentBadges = getBadgesFromStorage(userId);
        const newBadges = [];

        // Count user's reviews
        const userReviews = Object.values(reviews.byBusinessId)
            .flat()
            .filter(r => r.userId === userId);

        // Review badges
        if (userReviews.length >= 1 && !currentBadges.includes('first_review')) {
            newBadges.push('first_review');
        }
        if (userReviews.length >= 5 && !currentBadges.includes('reviewer_5')) {
            newBadges.push('reviewer_5');
        }
        if (userReviews.length >= 25 && !currentBadges.includes('reviewer_25')) {
            newBadges.push('reviewer_25');
        }

        // Favorite badges
        const userFavorites = favorites.items.length;
        if (userFavorites >= 1 && !currentBadges.includes('first_favorite')) {
            newBadges.push('first_favorite');
        }
        if (userFavorites >= 10 && !currentBadges.includes('collector_10')) {
            newBadges.push('collector_10');
        }

        // Business owner badge
        const myListings = JSON.parse(localStorage.getItem(`myListings_${userId}`) || '[]');
        if (myListings.length >= 1 && !currentBadges.includes('business_owner')) {
            newBadges.push('business_owner');
        }

        // Share badges
        const shareCount = parseInt(localStorage.getItem(`shareCount_${userId}`) || '0');
        if (shareCount >= 10 && !currentBadges.includes('community_supporter')) {
            newBadges.push('community_supporter');
        }

        // View badges
        const viewCount = parseInt(localStorage.getItem(`viewCount_${userId}`) || '0');
        if (viewCount >= 50 && !currentBadges.includes('explorer')) {
            newBadges.push('explorer');
        }

        if (newBadges.length > 0) {
            const allBadges = [...currentBadges, ...newBadges];
            saveBadgesToStorage(userId, allBadges);

            newBadges.forEach(badgeId => {
                dispatch({
                    type: ADD_BADGE,
                    payload: badgeId
                });
            });
        }
    };
};

// Get user's public profile
export const getPublicProfile = (userId) => {
    return (dispatch) => {
        const profile = getProfileFromStorage(userId);
        const badges = getBadgesFromStorage(userId);

        // Return only public fields
        return {
            displayName: profile.displayName || 'Anonymous User',
            avatar: profile.avatar,
            bio: profile.bio,
            joinedAt: profile.createdAt,
            badges: badges,
            isBusinessOwner: profile.isBusinessOwner || false
        };
    };
};

// Helper functions
const getProfileFromStorage = (userId) => {
    const key = `userProfile_${userId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
        return JSON.parse(stored);
    }
    // Return default profile
    return {
        userId,
        displayName: '',
        email: '',
        avatar: null,
        bio: '',
        location: '',
        website: '',
        socialLinks: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: ''
        },
        preferences: {
            emailNotifications: true,
            pushNotifications: false,
            newsletterSubscribed: false
        },
        isBusinessOwner: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
};

const saveProfileToStorage = (userId, profile) => {
    const key = `userProfile_${userId}`;
    localStorage.setItem(key, JSON.stringify(profile));
};

const getActivityHistory = (userId) => {
    const key = `activityHistory_${userId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
};

const saveActivityHistory = (userId, history) => {
    const key = `activityHistory_${userId}`;
    localStorage.setItem(key, JSON.stringify(history));
};

const getBadgesFromStorage = (userId) => {
    const key = `userBadges_${userId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
};

const saveBadgesToStorage = (userId, badges) => {
    const key = `userBadges_${userId}`;
    localStorage.setItem(key, JSON.stringify(badges));
};

// Record share action (for badge tracking)
export const recordShare = (userId) => {
    const currentCount = parseInt(localStorage.getItem(`shareCount_${userId}`) || '0');
    localStorage.setItem(`shareCount_${userId}`, (currentCount + 1).toString());
};

// Record view action (for badge tracking)
export const recordView = (userId) => {
    const currentCount = parseInt(localStorage.getItem(`viewCount_${userId}`) || '0');
    localStorage.setItem(`viewCount_${userId}`, (currentCount + 1).toString());
};
