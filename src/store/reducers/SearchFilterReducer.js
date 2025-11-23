/**
 * Search & Filter Reducer
 * Manages search query, filters, and filtered results state
 */

import {
    SET_SEARCH_QUERY,
    SET_LOCATION_FILTER,
    SET_CATEGORY_FILTER,
    SET_SORT_BY,
    SET_RATING_FILTER,
    CLEAR_ALL_FILTERS,
    SET_FILTERED_RESULTS,
    SORT_OPTIONS,
} from '../actions/SearchFilterActions';

const initialState = {
    // Search & Filter inputs
    searchQuery: '',
    locationFilter: '',
    categoryFilter: 'all',
    sortBy: SORT_OPTIONS.RELEVANCE,
    ratingFilter: 0,

    // Filtered results
    filteredResults: [],
    hasFiltersApplied: false,

    // UI state
    isFiltering: false,
};

const SearchFilterReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SEARCH_QUERY:
            return {
                ...state,
                searchQuery: action.payload,
                hasFiltersApplied: true,
            };

        case SET_LOCATION_FILTER:
            return {
                ...state,
                locationFilter: action.payload,
                hasFiltersApplied: true,
            };

        case SET_CATEGORY_FILTER:
            return {
                ...state,
                categoryFilter: action.payload,
                hasFiltersApplied: action.payload !== 'all',
            };

        case SET_SORT_BY:
            return {
                ...state,
                sortBy: action.payload,
            };

        case SET_RATING_FILTER:
            return {
                ...state,
                ratingFilter: action.payload,
                hasFiltersApplied: action.payload > 0,
            };

        case SET_FILTERED_RESULTS:
            return {
                ...state,
                filteredResults: action.payload,
                isFiltering: false,
            };

        case CLEAR_ALL_FILTERS:
            return {
                ...initialState,
            };

        default:
            return state;
    }
};

export default SearchFilterReducer;
