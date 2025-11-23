/**
 * Favorites Reducer
 * Manages user favorites/bookmarks state
 */

import {
    LOAD_FAVORITES,
    ADD_FAVORITE,
    REMOVE_FAVORITE,
    CLEAR_FAVORITES,
} from '../actions/FavoritesActions';

const initialState = {
    items: [],
    loaded: false,
};

const FavoritesReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_FAVORITES:
            return {
                ...state,
                items: action.payload,
                loaded: true,
            };

        case ADD_FAVORITE: {
            // Avoid duplicates
            const exists = state.items.some(item => item.id === action.payload.id);
            if (exists) return state;

            return {
                ...state,
                items: [action.payload, ...state.items],
            };
        }

        case REMOVE_FAVORITE:
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload),
            };

        case CLEAR_FAVORITES:
            return {
                ...state,
                items: [],
            };

        default:
            return state;
    }
};

export default FavoritesReducer;
