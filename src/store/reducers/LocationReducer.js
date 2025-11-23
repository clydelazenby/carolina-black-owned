/**
 * Location Reducer
 * Manages user location and nearby businesses state
 */

import {
    LOCATION_LOADING,
    LOCATION_SUCCESS,
    LOCATION_ERROR,
    LOCATION_CLEAR,
    SET_NEARBY_BUSINESSES,
    SET_SEARCH_RADIUS,
} from '../actions/LocationActions';

const initialState = {
    // User's current location
    coordinates: null, // { lat, lng }
    city: null, // { name, state, lat, lng, distance }
    isInCarolinaRegion: false,

    // Nearby businesses
    nearbyBusinesses: [],
    searchRadius: 25, // Default 25 miles

    // UI state
    loading: false,
    error: null,
    locationDetected: false,
};

const LocationReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOCATION_LOADING:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case LOCATION_SUCCESS:
            return {
                ...state,
                loading: false,
                coordinates: action.payload.coordinates,
                city: action.payload.city,
                isInCarolinaRegion: action.payload.isInCarolinaRegion,
                locationDetected: true,
                error: null,
            };

        case LOCATION_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
                locationDetected: false,
            };

        case LOCATION_CLEAR:
            return {
                ...initialState,
            };

        case SET_NEARBY_BUSINESSES:
            return {
                ...state,
                nearbyBusinesses: action.payload,
            };

        case SET_SEARCH_RADIUS:
            return {
                ...state,
                searchRadius: action.payload,
            };

        default:
            return state;
    }
};

export default LocationReducer;
