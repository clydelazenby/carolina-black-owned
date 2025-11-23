/**
 * API Service
 * @deprecated Use src/services/api.js instead for new code
 *
 * This file is kept for backward compatibility.
 * New code should import { authAPI, listingsAPI } from 'services/api.js'
 */

import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

// Authentication URLs - now using centralized config
const signUpUrl = `${API_BASE_URL}${API_ENDPOINTS.auth.signup}`;
const loginUrl = `${API_BASE_URL}${API_ENDPOINTS.auth.login}`;

// Listings URLs - now using centralized config
const listListingsUrl = `${API_BASE_URL}${API_ENDPOINTS.listings.list}`;
const createListingUrl = `${API_BASE_URL}${API_ENDPOINTS.listings.create}`;
const updateListingUrl = (listingId) => `${API_BASE_URL}${API_ENDPOINTS.listings.update(listingId)}`;
const deleteListingUrl = (listingId) => `${API_BASE_URL}${API_ENDPOINTS.listings.delete(listingId)}`;


// Authentication functions
export const signUp = (email, password) => {
    const userData = {
      email: email,
      password: password,
    };
  
    return axios.post(signUpUrl, userData)
      .then((response) => {
        if (response.status === 201) {
          return response.data;
        } else {
          throw new Error('Failed to register user');
        }
      })
      .catch((error) => {
        console.error('Sign-Up Error:', error);
        throw error;
      });
  };
  
  export const login = (email, password) => {
    const userData = {
      email: email,
      password: password,
    };
  
    return axios.post(loginUrl, userData)
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        } else {
          throw new Error('Login failed');
        }
      })
      .catch((error) => {
        console.error('Login Error:', error);
        throw error;
      });
  };
  
  // Listings functions
  export const listListings = () => {
    return axios.get(listListingsUrl);
  };
  
  export const createListing = (data) => {
    return axios.post(createListingUrl, data)
      .then((response) => {
        if (response.status === 201) {
          return response.data;
        } else {
          throw new Error('Failed to create listing');
        }
      })
      .catch((error) => {
        console.error('Create Listing Error:', error);
        throw error;
      });
  };
  
  export const updateListing = (listingId, data) => {
    return axios.put(`${updateListingUrl}${listingId}/`, data)
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        } else {
          throw new Error('Failed to update listing');
        }
      })
      .catch((error) => {
        console.error('Update Listing Error:', error);
        throw error;
      });
  };
  
  export const deleteListing = (listingId) => {
    return axios.delete(`${deleteListingUrl}${listingId}/`)
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        } else {
          throw new Error('Failed to delete listing');
        }
      })
      .catch((error) => {
        console.error('Delete Listing Error:', error);
        throw error;
      });
  };