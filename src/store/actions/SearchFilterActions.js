/**
 * Search & Filter Redux Actions
 * Handles search queries, category filtering, and sorting for business listings
 */

// Action Types
export const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';
export const SET_LOCATION_FILTER = 'SET_LOCATION_FILTER';
export const SET_CATEGORY_FILTER = 'SET_CATEGORY_FILTER';
export const SET_SORT_BY = 'SET_SORT_BY';
export const SET_RATING_FILTER = 'SET_RATING_FILTER';
export const CLEAR_ALL_FILTERS = 'CLEAR_ALL_FILTERS';
export const SET_FILTERED_RESULTS = 'SET_FILTERED_RESULTS';
export const APPLY_FILTERS = 'APPLY_FILTERS';

// Categories available for filtering
export const CATEGORIES = [
    'Restaurant',
    'Beauty & Grooming',
    'Retail',
    'Cafe',
    'Technology',
    'Health & Wellness',
    'Professional Services',
    'Entertainment',
    'Automotive',
    'Home Services',
];

// Sort options
export const SORT_OPTIONS = {
    RELEVANCE: 'relevance',
    NEWEST: 'newest',
    RATING_HIGH: 'rating_high',
    RATING_LOW: 'rating_low',
    NAME_AZ: 'name_az',
    NAME_ZA: 'name_za',
    DISTANCE: 'distance',
};

/**
 * Set search query
 * @param {string} query - Search term
 */
export const setSearchQuery = (query) => ({
    type: SET_SEARCH_QUERY,
    payload: query,
});

/**
 * Set location filter
 * @param {string} location - Location/city name
 */
export const setLocationFilter = (location) => ({
    type: SET_LOCATION_FILTER,
    payload: location,
});

/**
 * Set category filter
 * @param {string} category - Category name or empty for all
 */
export const setCategoryFilter = (category) => ({
    type: SET_CATEGORY_FILTER,
    payload: category,
});

/**
 * Set sort option
 * @param {string} sortBy - Sort option from SORT_OPTIONS
 */
export const setSortBy = (sortBy) => ({
    type: SET_SORT_BY,
    payload: sortBy,
});

/**
 * Set minimum rating filter
 * @param {number} rating - Minimum rating (0-5)
 */
export const setRatingFilter = (rating) => ({
    type: SET_RATING_FILTER,
    payload: rating,
});

/**
 * Clear all filters and reset to defaults
 */
export const clearAllFilters = () => ({
    type: CLEAR_ALL_FILTERS,
});

/**
 * Apply filters and sort to business list
 * @param {Array} businesses - Array of all businesses
 * @param {Object} userCoords - User's coordinates for distance sorting (optional)
 */
export const applyFilters = (businesses, userCoords = null) => {
    return (dispatch, getState) => {
        const { searchFilter } = getState();
        const { searchQuery, locationFilter, categoryFilter, sortBy, ratingFilter } = searchFilter;

        let filtered = [...businesses];

        // Apply search query filter
        if (searchQuery && searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(business =>
                business.name?.toLowerCase().includes(query) ||
                business.tagline?.toLowerCase().includes(query) ||
                business.description?.toLowerCase().includes(query) ||
                business.category?.toLowerCase().includes(query)
            );
        }

        // Apply location filter
        if (locationFilter && locationFilter.trim()) {
            const location = locationFilter.toLowerCase().trim();
            filtered = filtered.filter(business =>
                business.city?.toLowerCase().includes(location) ||
                business.state?.toLowerCase().includes(location)
            );
        }

        // Apply category filter
        if (categoryFilter && categoryFilter !== 'all') {
            filtered = filtered.filter(business =>
                business.category?.toLowerCase() === categoryFilter.toLowerCase()
            );
        }

        // Apply rating filter
        if (ratingFilter > 0) {
            filtered = filtered.filter(business =>
                (business.rating || 0) >= ratingFilter
            );
        }

        // Apply sorting
        filtered = sortBusinesses(filtered, sortBy, userCoords);

        dispatch({
            type: SET_FILTERED_RESULTS,
            payload: filtered,
        });

        return filtered;
    };
};

/**
 * Sort businesses based on sort option
 */
const sortBusinesses = (businesses, sortBy, userCoords) => {
    const sorted = [...businesses];

    switch (sortBy) {
        case SORT_OPTIONS.NEWEST:
            // Sort by created date (if available) or id descending
            return sorted.sort((a, b) => {
                if (a.createdAt && b.createdAt) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
                return (b.id || 0) - (a.id || 0);
            });

        case SORT_OPTIONS.RATING_HIGH:
            return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));

        case SORT_OPTIONS.RATING_LOW:
            return sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));

        case SORT_OPTIONS.NAME_AZ:
            return sorted.sort((a, b) =>
                (a.name || '').localeCompare(b.name || '')
            );

        case SORT_OPTIONS.NAME_ZA:
            return sorted.sort((a, b) =>
                (b.name || '').localeCompare(a.name || '')
            );

        case SORT_OPTIONS.DISTANCE:
            if (userCoords) {
                return sorted.sort((a, b) =>
                    (a.distance || Infinity) - (b.distance || Infinity)
                );
            }
            return sorted;

        case SORT_OPTIONS.RELEVANCE:
        default:
            // Default relevance - keep original order or sort by rating
            return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
};
