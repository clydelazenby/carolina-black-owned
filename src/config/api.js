/**
 * API Configuration
 * Centralized configuration for all API endpoints
 *
 * This file provides a single source of truth for:
 * - Base API URL (from environment variables)
 * - All API endpoint paths
 * - API versioning
 */

// Base URL from environment variable with fallback
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
export const API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';

/**
 * API Endpoints Configuration
 * Maps to Django backend carolina_black_owned_be
 */
export const API_ENDPOINTS = {
  // Authentication endpoints (auth_app)
  auth: {
    signup: '/api/auth/signup/',
    login: '/api/auth/login/',
    logout: '/api/auth/logout/',
    token: '/api/token/',
    refreshToken: '/api/token/refresh/',
    resetPassword: '/api/auth/reset-password/',
    changePassword: '/api/auth/change-password/',
    profile: '/api/auth/profile/',
  },

  // Listings endpoints (listings app)
  listings: {
    list: '/api/listings/',
    create: '/api/listings/add/',
    update: (id) => `/api/listings/update/${id}/`,
    delete: (id) => `/api/listings/delete/${id}/`,
    detail: (id) => `/api/listings/${id}/`,
    search: '/api/listings/search/',
    featured: '/api/listings/featured/',
    byCategory: (category) => `/api/listings/category/${category}/`,
    byCity: (city) => `/api/listings/city/${city}/`,
  },

  // Reviews endpoints (to be implemented in backend)
  reviews: {
    list: (listingId) => `/api/listings/${listingId}/reviews/`,
    create: (listingId) => `/api/listings/${listingId}/reviews/`,
    update: (listingId, reviewId) => `/api/listings/${listingId}/reviews/${reviewId}/`,
    delete: (listingId, reviewId) => `/api/listings/${listingId}/reviews/${reviewId}/`,
  },

  // Favorites endpoints (to be implemented in backend)
  favorites: {
    list: '/api/favorites/',
    add: '/api/favorites/add/',
    remove: (id) => `/api/favorites/remove/${id}/`,
    check: (listingId) => `/api/favorites/check/${listingId}/`,
  },

  // Dashboard endpoints (to be implemented in backend)
  dashboard: {
    stats: '/api/dashboard/stats/',
    analytics: '/api/dashboard/analytics/',
    myListings: '/api/dashboard/my-listings/',
    claims: '/api/dashboard/claims/',
  },

  // User profile endpoints (to be implemented in backend)
  profile: {
    get: '/api/profile/',
    update: '/api/profile/update/',
    badges: '/api/profile/badges/',
    activity: '/api/profile/activity/',
  },

  // Notifications endpoints (to be implemented in backend)
  notifications: {
    list: '/api/notifications/',
    markRead: (id) => `/api/notifications/${id}/read/`,
    markAllRead: '/api/notifications/read-all/',
    preferences: '/api/notifications/preferences/',
  },

  // Business claims endpoints (to be implemented in backend)
  claims: {
    submit: '/api/claims/submit/',
    status: (id) => `/api/claims/${id}/status/`,
    list: '/api/claims/',
  },

  // Appointments/Booking endpoints (to be implemented in backend)
  appointments: {
    list: '/api/appointments/',
    create: '/api/appointments/create/',
    cancel: (id) => `/api/appointments/${id}/cancel/`,
    reschedule: (id) => `/api/appointments/${id}/reschedule/`,
  },

  // Admin endpoints (to be implemented in backend)
  admin: {
    users: '/api/admin/users/',
    listings: '/api/admin/listings/',
    claims: '/api/admin/claims/',
    reports: '/api/admin/reports/',
    analytics: '/api/admin/analytics/',
  },

  // Core endpoints
  core: {
    homepage: '/api/homepage/',
    categories: '/api/categories/',
    cities: '/api/cities/',
    contact: '/api/contact/',
  },
};

/**
 * Build full URL for an endpoint
 * @param {string} endpoint - The endpoint path
 * @returns {string} Full URL
 */
export const buildUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

/**
 * Get headers for API requests
 * @param {string|null} token - Authentication token
 * @param {boolean} isFormData - Whether the request contains FormData
 * @returns {Object} Headers object
 */
export const getHeaders = (token = null, isFormData = false) => {
  const headers = {};

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  return headers;
};

export default {
  API_BASE_URL,
  API_VERSION,
  API_ENDPOINTS,
  buildUrl,
  getHeaders,
};
