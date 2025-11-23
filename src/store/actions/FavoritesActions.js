/**
 * Favorites Redux Actions
 * Handles user favorites/bookmarks for businesses
 */

// Action Types
export const LOAD_FAVORITES = 'LOAD_FAVORITES';
export const ADD_FAVORITE = 'ADD_FAVORITE';
export const REMOVE_FAVORITE = 'REMOVE_FAVORITE';
export const CLEAR_FAVORITES = 'CLEAR_FAVORITES';

const STORAGE_KEY = 'carolina_favorites';

/**
 * Load favorites from localStorage
 */
export const loadFavorites = () => {
    return (dispatch) => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const favorites = stored ? JSON.parse(stored) : [];
            dispatch({
                type: LOAD_FAVORITES,
                payload: favorites,
            });
        } catch (error) {
            console.error('Error loading favorites:', error);
            dispatch({
                type: LOAD_FAVORITES,
                payload: [],
            });
        }
    };
};

/**
 * Add a business to favorites
 * @param {Object} business - The business to add
 */
export const addFavorite = (business) => {
    return (dispatch, getState) => {
        dispatch({
            type: ADD_FAVORITE,
            payload: business,
        });

        // Persist to localStorage
        const { favorites } = getState();
        saveFavoritesToStorage(favorites.items);
    };
};

/**
 * Remove a business from favorites
 * @param {string|number} businessId - The business ID to remove
 */
export const removeFavorite = (businessId) => {
    return (dispatch, getState) => {
        dispatch({
            type: REMOVE_FAVORITE,
            payload: businessId,
        });

        // Persist to localStorage
        const { favorites } = getState();
        saveFavoritesToStorage(favorites.items);
    };
};

/**
 * Toggle favorite status for a business
 * @param {Object} business - The business to toggle
 */
export const toggleFavorite = (business) => {
    return (dispatch, getState) => {
        const { favorites } = getState();
        const isFavorited = favorites.items.some(item => item.id === business.id);

        if (isFavorited) {
            dispatch(removeFavorite(business.id));
        } else {
            dispatch(addFavorite(business));
        }
    };
};

/**
 * Clear all favorites
 */
export const clearFavorites = () => {
    return (dispatch) => {
        dispatch({ type: CLEAR_FAVORITES });
        localStorage.removeItem(STORAGE_KEY);
    };
};

/**
 * Check if a business is favorited
 * @param {string|number} businessId - The business ID
 * @returns {Function} Selector function
 */
export const isFavorited = (businessId) => (state) => {
    return state.favorites.items.some(item => item.id === businessId);
};

// Helper function
const saveFavoritesToStorage = (favorites) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error('Error saving favorites:', error);
    }
};
