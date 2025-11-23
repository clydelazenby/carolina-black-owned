// src/hooks/useListings.js

import { useState, useEffect } from 'react';
import { listingsAPI } from '../services/api';

export const useListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    listingsAPI.getAll()
      .then(response => {
        setListings(response.data);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to fetch listings:', err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { listings, loading, error };
}
