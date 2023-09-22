import axios from 'axios';

// Authentication URLs
const signUpUrl = "http://localhost:8000/api/auth/signup/";
const loginUrl = "http://localhost:8000/api/auth/login/";


// Listings URLs
const listListingsUrl = "http://localhost:8000/api/listings/";
const createListingUrl = "http://localhost:8000/api/listings/add/";
const updateListingUrl = (listingId) => `http://localhost:8000/api/listings/update/${listingId}/`;
const deleteListingUrl = (listingId) => `http://localhost:8000/api/listings/delete/${listingId}/`;


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