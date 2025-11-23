/**
 * Geolocation Service
 * Handles browser geolocation and reverse geocoding to detect user's city
 */

// Carolina region cities with their coordinates
export const CAROLINA_CITIES = [
    { name: 'Charlotte', state: 'NC', lat: 35.2271, lng: -80.8431 },
    { name: 'Raleigh', state: 'NC', lat: 35.7796, lng: -78.6382 },
    { name: 'Durham', state: 'NC', lat: 35.9940, lng: -78.8986 },
    { name: 'Myrtle Beach', state: 'SC', lat: 33.6891, lng: -78.8867 },
    { name: 'Charleston', state: 'SC', lat: 32.7765, lng: -79.9311 },
    { name: 'Greensboro', state: 'NC', lat: 36.0726, lng: -79.7920 },
    { name: 'Winston-Salem', state: 'NC', lat: 36.0999, lng: -80.2442 },
    { name: 'Fayetteville', state: 'NC', lat: 35.0527, lng: -78.8784 },
    { name: 'Wilmington', state: 'NC', lat: 34.2257, lng: -77.9447 },
    { name: 'Columbia', state: 'SC', lat: 34.0007, lng: -81.0348 },
    { name: 'Greenville', state: 'SC', lat: 34.8526, lng: -82.3940 },
];

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in miles
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 3959; // Earth's radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const toRad = (deg) => deg * (Math.PI / 180);

/**
 * Find the nearest Carolina city to given coordinates
 * @param {number} lat - User's latitude
 * @param {number} lng - User's longitude
 * @returns {Object} Nearest city object with distance
 */
export const findNearestCity = (lat, lng) => {
    let nearestCity = null;
    let minDistance = Infinity;

    CAROLINA_CITIES.forEach(city => {
        const distance = calculateDistance(lat, lng, city.lat, city.lng);
        if (distance < minDistance) {
            minDistance = distance;
            nearestCity = { ...city, distance: Math.round(distance * 10) / 10 };
        }
    });

    return nearestCity;
};

/**
 * Get user's current position using browser Geolocation API
 * @returns {Promise<{lat: number, lng: number}>} User's coordinates
 */
export const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                let errorMessage;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out';
                        break;
                    default:
                        errorMessage = 'Unknown error getting location';
                }
                reject(new Error(errorMessage));
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000, // Cache for 5 minutes
            }
        );
    });
};

/**
 * Get user's location and nearest city
 * @returns {Promise<Object>} Location data including coordinates and nearest city
 */
export const getUserLocation = async () => {
    try {
        const coords = await getCurrentPosition();
        const nearestCity = findNearestCity(coords.lat, coords.lng);

        return {
            coordinates: coords,
            city: nearestCity,
            isInCarolinaRegion: nearestCity.distance < 100, // Within 100 miles of a Carolina city
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Format distance for display
 * @param {number} distance - Distance in miles
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
    if (distance < 0.1) {
        return 'Nearby';
    } else if (distance < 1) {
        return `${Math.round(distance * 10) / 10} mi`;
    } else if (distance < 10) {
        return `${Math.round(distance * 10) / 10} mi`;
    } else {
        return `${Math.round(distance)} mi`;
    }
};

export default {
    getCurrentPosition,
    getUserLocation,
    calculateDistance,
    findNearestCity,
    formatDistance,
    CAROLINA_CITIES,
};
