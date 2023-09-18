// src/hooks/useListings.js

import { useState, useEffect } from 'react';
import axios from 'axios';

export const useListings = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/listings/')
      .then(response => {
        setListings(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return listings;
}
