/**
 * Location Selectors
 * Helper functions to access location state
 */

export const selectLocation = (state) => state.location;

export const selectCoordinates = (state) => state.location?.coordinates;

export const selectCity = (state) => state.location?.city;

export const selectCityName = (state) => {
    const city = state.location?.city;
    if (!city) return null;
    return `${city.name}, ${city.state}`;
};

export const selectIsInCarolinaRegion = (state) => state.location?.isInCarolinaRegion;

export const selectNearbyBusinesses = (state) => state.location?.nearbyBusinesses || [];

export const selectSearchRadius = (state) => state.location?.searchRadius || 25;

export const selectLocationLoading = (state) => state.location?.loading;

export const selectLocationError = (state) => state.location?.error;

export const selectLocationDetected = (state) => state.location?.locationDetected;
