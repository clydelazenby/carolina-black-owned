/**
 * Location Redux Actions
 * Handles user location detection and nearby business discovery
 */

import { getUserLocation, calculateDistance } from '../../services/GeolocationService';

// Action Types
export const LOCATION_LOADING = 'LOCATION_LOADING';
export const LOCATION_SUCCESS = 'LOCATION_SUCCESS';
export const LOCATION_ERROR = 'LOCATION_ERROR';
export const LOCATION_CLEAR = 'LOCATION_CLEAR';
export const SET_NEARBY_BUSINESSES = 'SET_NEARBY_BUSINESSES';
export const SET_SEARCH_RADIUS = 'SET_SEARCH_RADIUS';

/**
 * Detect user's location
 */
export const detectLocation = () => {
    return async (dispatch) => {
        dispatch({ type: LOCATION_LOADING });

        try {
            const locationData = await getUserLocation();

            dispatch({
                type: LOCATION_SUCCESS,
                payload: {
                    coordinates: locationData.coordinates,
                    city: locationData.city,
                    isInCarolinaRegion: locationData.isInCarolinaRegion,
                },
            });

            return locationData;
        } catch (error) {
            dispatch({
                type: LOCATION_ERROR,
                payload: error.message,
            });
            throw error;
        }
    };
};

/**
 * Clear location data
 */
export const clearLocation = () => ({
    type: LOCATION_CLEAR,
});

/**
 * Set search radius for nearby businesses
 * @param {number} radius - Radius in miles
 */
export const setSearchRadius = (radius) => ({
    type: SET_SEARCH_RADIUS,
    payload: radius,
});

/**
 * Calculate distances and filter nearby businesses
 * @param {Array} businesses - Array of business objects with lat/lng
 * @param {Object} userCoords - User's coordinates {lat, lng}
 * @param {number} radius - Search radius in miles
 */
export const setNearbyBusinesses = (businesses, userCoords, radius = 25) => {
    return (dispatch) => {
        if (!userCoords || !businesses) {
            dispatch({
                type: SET_NEARBY_BUSINESSES,
                payload: [],
            });
            return;
        }

        // Calculate distance for each business and filter by radius
        const businessesWithDistance = businesses
            .map(business => {
                // Skip businesses without coordinates
                if (!business.latitude || !business.longitude) {
                    return null;
                }

                const distance = calculateDistance(
                    userCoords.lat,
                    userCoords.lng,
                    business.latitude,
                    business.longitude
                );

                return {
                    ...business,
                    distance: Math.round(distance * 10) / 10,
                };
            })
            .filter(business => business !== null && business.distance <= radius)
            .sort((a, b) => a.distance - b.distance);

        dispatch({
            type: SET_NEARBY_BUSINESSES,
            payload: businessesWithDistance,
        });
    };
};
