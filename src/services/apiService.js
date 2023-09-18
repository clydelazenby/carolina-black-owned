import axios from 'axios';

// Authentication URLs
const signUpUrl = "http://localhost:8000/api/auth/signup/";
const loginUrl = "http://localhost:8000/api/auth/login/";


// Listings URLs
const listListingsUrl = "http://localhost:8000/api/listings/";
const createListingUrl = "http://localhost:8000/api/listings/create/";
const updateListingUrl = "http://localhost:8000/api/listings/update/";  // append listing ID at the end
const deleteListingUrl = "http://localhost:8000/api/listings/delete/";  // append listing ID at the end

// Authentication functions
export const signUp = (email, password) => {
  // Existing implementation
};

export const login = (email, password) => {
  // Existing implementation
};

// Listings functions
export const listListings = () => {
  return axios.get(listListingsUrl);
};

export const createListing = (data) => {
  return axios.post(createListingUrl, data);
};

export const updateListing = (listingId, data) => {
  return axios.put(`${updateListingUrl}${listingId}/`, data);
};

export const deleteListing = (listingId) => {
  return axios.delete(`${deleteListingUrl}${listingId}/`);
};
