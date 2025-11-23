/**
 * Unified API Service
 * Single source of truth for all API communications
 *
 * Features:
 * - Centralized axios instance with proper configuration
 * - Automatic token injection via Authorization header
 * - Request/response interceptors for error handling
 * - Support for all CRUD operations
 */

import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, getHeaders } from '../config/api';
import { store } from '../store/store';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    try {
      const state = store.getState();
      const token = state.auth?.auth?.idToken;

      if (token) {
        // Use Authorization header (more secure than query params)
        config.headers['Authorization'] = `Token ${token}`;
      }

      return config;
    } catch (error) {
      console.error('API Request Interceptor Error:', error);
      return config;
    }
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          console.error('Authentication error - please login again');
          // Optionally dispatch logout action here
          break;
        case 403:
          console.error('Permission denied');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error - please try again later');
          break;
        default:
          console.error('API Error:', data?.message || 'Unknown error');
      }
    } else if (error.request) {
      console.error('Network error - please check your connection');
    }

    return Promise.reject(error);
  }
);

// ============================================
// Authentication API
// ============================================

export const authAPI = {
  /**
   * Register a new user
   * @param {Object} userData - { email, password, username, first_name, last_name }
   */
  signup: (userData) => {
    return api.post(API_ENDPOINTS.auth.signup, userData);
  },

  /**
   * Login user
   * @param {Object} credentials - { email/username, password }
   */
  login: (credentials) => {
    return api.post(API_ENDPOINTS.auth.login, credentials);
  },

  /**
   * Logout user
   */
  logout: () => {
    return api.post(API_ENDPOINTS.auth.logout);
  },

  /**
   * Get authentication token
   * @param {Object} credentials - { username, password }
   */
  getToken: (credentials) => {
    return api.post(API_ENDPOINTS.auth.token, credentials);
  },

  /**
   * Get user profile
   */
  getProfile: () => {
    return api.get(API_ENDPOINTS.auth.profile);
  },

  /**
   * Update user profile
   * @param {Object} profileData
   */
  updateProfile: (profileData) => {
    return api.put(API_ENDPOINTS.auth.profile, profileData);
  },
};

// ============================================
// Listings API
// ============================================

export const listingsAPI = {
  /**
   * Get all listings
   * @param {Object} params - Query parameters { page, limit, category, city, search }
   */
  getAll: (params = {}) => {
    return api.get(API_ENDPOINTS.listings.list, { params });
  },

  /**
   * Get single listing by ID
   * @param {number} id - Listing ID
   */
  getById: (id) => {
    return api.get(API_ENDPOINTS.listings.detail(id));
  },

  /**
   * Create new listing
   * @param {Object|FormData} listingData - Listing data (supports FormData for file uploads)
   */
  create: (listingData) => {
    const isFormData = listingData instanceof FormData;
    return api.post(API_ENDPOINTS.listings.create, listingData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
  },

  /**
   * Update existing listing
   * @param {number} id - Listing ID
   * @param {Object|FormData} listingData - Updated listing data
   */
  update: (id, listingData) => {
    const isFormData = listingData instanceof FormData;
    return api.put(API_ENDPOINTS.listings.update(id), listingData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
  },

  /**
   * Delete listing
   * @param {number} id - Listing ID
   */
  delete: (id) => {
    return api.delete(API_ENDPOINTS.listings.delete(id));
  },

  /**
   * Search listings
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   */
  search: (query, filters = {}) => {
    return api.get(API_ENDPOINTS.listings.search, {
      params: { q: query, ...filters },
    });
  },

  /**
   * Get featured listings
   */
  getFeatured: () => {
    return api.get(API_ENDPOINTS.listings.featured);
  },

  /**
   * Get listings by category
   * @param {string} category - Category name
   */
  getByCategory: (category) => {
    return api.get(API_ENDPOINTS.listings.byCategory(category));
  },

  /**
   * Get listings by city
   * @param {string} city - City name
   */
  getByCity: (city) => {
    return api.get(API_ENDPOINTS.listings.byCity(city));
  },
};

// ============================================
// Reviews API
// ============================================

export const reviewsAPI = {
  /**
   * Get reviews for a listing
   * @param {number} listingId - Listing ID
   */
  getForListing: (listingId) => {
    return api.get(API_ENDPOINTS.reviews.list(listingId));
  },

  /**
   * Create review for a listing
   * @param {number} listingId - Listing ID
   * @param {Object} reviewData - { rating, comment }
   */
  create: (listingId, reviewData) => {
    return api.post(API_ENDPOINTS.reviews.create(listingId), reviewData);
  },

  /**
   * Update review
   * @param {number} listingId - Listing ID
   * @param {number} reviewId - Review ID
   * @param {Object} reviewData - Updated review data
   */
  update: (listingId, reviewId, reviewData) => {
    return api.put(API_ENDPOINTS.reviews.update(listingId, reviewId), reviewData);
  },

  /**
   * Delete review
   * @param {number} listingId - Listing ID
   * @param {number} reviewId - Review ID
   */
  delete: (listingId, reviewId) => {
    return api.delete(API_ENDPOINTS.reviews.delete(listingId, reviewId));
  },
};

// ============================================
// Favorites API
// ============================================

export const favoritesAPI = {
  /**
   * Get user's favorites
   */
  getAll: () => {
    return api.get(API_ENDPOINTS.favorites.list);
  },

  /**
   * Add listing to favorites
   * @param {number} listingId - Listing ID
   */
  add: (listingId) => {
    return api.post(API_ENDPOINTS.favorites.add, { listing_id: listingId });
  },

  /**
   * Remove listing from favorites
   * @param {number} listingId - Listing ID
   */
  remove: (listingId) => {
    return api.delete(API_ENDPOINTS.favorites.remove(listingId));
  },

  /**
   * Check if listing is favorited
   * @param {number} listingId - Listing ID
   */
  check: (listingId) => {
    return api.get(API_ENDPOINTS.favorites.check(listingId));
  },
};

// ============================================
// Dashboard API
// ============================================

export const dashboardAPI = {
  /**
   * Get dashboard statistics
   */
  getStats: () => {
    return api.get(API_ENDPOINTS.dashboard.stats);
  },

  /**
   * Get analytics data
   * @param {Object} params - { period: 'week'|'month'|'year' }
   */
  getAnalytics: (params = {}) => {
    return api.get(API_ENDPOINTS.dashboard.analytics, { params });
  },

  /**
   * Get user's listings
   */
  getMyListings: () => {
    return api.get(API_ENDPOINTS.dashboard.myListings);
  },

  /**
   * Get user's business claims
   */
  getClaims: () => {
    return api.get(API_ENDPOINTS.dashboard.claims);
  },
};

// ============================================
// Notifications API
// ============================================

export const notificationsAPI = {
  /**
   * Get all notifications
   */
  getAll: () => {
    return api.get(API_ENDPOINTS.notifications.list);
  },

  /**
   * Mark notification as read
   * @param {number} id - Notification ID
   */
  markRead: (id) => {
    return api.post(API_ENDPOINTS.notifications.markRead(id));
  },

  /**
   * Mark all notifications as read
   */
  markAllRead: () => {
    return api.post(API_ENDPOINTS.notifications.markAllRead);
  },

  /**
   * Get notification preferences
   */
  getPreferences: () => {
    return api.get(API_ENDPOINTS.notifications.preferences);
  },

  /**
   * Update notification preferences
   * @param {Object} preferences
   */
  updatePreferences: (preferences) => {
    return api.put(API_ENDPOINTS.notifications.preferences, preferences);
  },
};

// ============================================
// Business Claims API
// ============================================

export const claimsAPI = {
  /**
   * Submit a business claim
   * @param {Object} claimData - { listing_id, proof_documents, ... }
   */
  submit: (claimData) => {
    const isFormData = claimData instanceof FormData;
    return api.post(API_ENDPOINTS.claims.submit, claimData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
  },

  /**
   * Check claim status
   * @param {number} id - Claim ID
   */
  getStatus: (id) => {
    return api.get(API_ENDPOINTS.claims.status(id));
  },

  /**
   * Get all user's claims
   */
  getAll: () => {
    return api.get(API_ENDPOINTS.claims.list);
  },
};

// ============================================
// Appointments API
// ============================================

export const appointmentsAPI = {
  /**
   * Get user's appointments
   */
  getAll: () => {
    return api.get(API_ENDPOINTS.appointments.list);
  },

  /**
   * Create appointment
   * @param {Object} appointmentData - { listing_id, date, time, service, notes }
   */
  create: (appointmentData) => {
    return api.post(API_ENDPOINTS.appointments.create, appointmentData);
  },

  /**
   * Cancel appointment
   * @param {number} id - Appointment ID
   */
  cancel: (id) => {
    return api.post(API_ENDPOINTS.appointments.cancel(id));
  },

  /**
   * Reschedule appointment
   * @param {number} id - Appointment ID
   * @param {Object} newSchedule - { date, time }
   */
  reschedule: (id, newSchedule) => {
    return api.put(API_ENDPOINTS.appointments.reschedule(id), newSchedule);
  },
};

// ============================================
// Admin API
// ============================================

export const adminAPI = {
  /**
   * Get all users (admin only)
   */
  getUsers: (params = {}) => {
    return api.get(API_ENDPOINTS.admin.users, { params });
  },

  /**
   * Get all listings for moderation (admin only)
   */
  getListings: (params = {}) => {
    return api.get(API_ENDPOINTS.admin.listings, { params });
  },

  /**
   * Get pending claims (admin only)
   */
  getClaims: (params = {}) => {
    return api.get(API_ENDPOINTS.admin.claims, { params });
  },

  /**
   * Get reports (admin only)
   */
  getReports: (params = {}) => {
    return api.get(API_ENDPOINTS.admin.reports, { params });
  },

  /**
   * Get admin analytics (admin only)
   */
  getAnalytics: (params = {}) => {
    return api.get(API_ENDPOINTS.admin.analytics, { params });
  },
};

// ============================================
// Core API
// ============================================

export const coreAPI = {
  /**
   * Get homepage data
   */
  getHomepage: () => {
    return api.get(API_ENDPOINTS.core.homepage);
  },

  /**
   * Get all categories
   */
  getCategories: () => {
    return api.get(API_ENDPOINTS.core.categories);
  },

  /**
   * Get all cities
   */
  getCities: () => {
    return api.get(API_ENDPOINTS.core.cities);
  },

  /**
   * Submit contact form
   * @param {Object} contactData - { name, email, subject, message }
   */
  submitContact: (contactData) => {
    return api.post(API_ENDPOINTS.core.contact, contactData);
  },
};

// Export the axios instance for direct use if needed
export default api;
