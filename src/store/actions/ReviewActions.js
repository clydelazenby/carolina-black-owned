/**
 * Reviews Redux Actions
 * Handles reviews and ratings for businesses
 */

// Action Types
export const REVIEWS_LOADING = 'REVIEWS_LOADING';
export const REVIEWS_SUCCESS = 'REVIEWS_SUCCESS';
export const REVIEWS_ERROR = 'REVIEWS_ERROR';
export const ADD_REVIEW = 'ADD_REVIEW';
export const DELETE_REVIEW = 'DELETE_REVIEW';

/**
 * Fetch reviews for a business
 * @param {string|number} businessId - The business ID
 */
export const fetchReviews = (businessId) => {
    return async (dispatch) => {
        dispatch({ type: REVIEWS_LOADING, payload: businessId });

        try {
            // TODO: Replace with actual API call
            // const response = await axios.get(`/api/businesses/${businessId}/reviews/`);

            // For now, return sample data
            const sampleReviews = getSampleReviews(businessId);

            dispatch({
                type: REVIEWS_SUCCESS,
                payload: {
                    businessId,
                    reviews: sampleReviews,
                },
            });
        } catch (error) {
            dispatch({
                type: REVIEWS_ERROR,
                payload: error.message,
            });
        }
    };
};

/**
 * Add a new review
 * @param {string|number} businessId - The business ID
 * @param {Object} review - The review data
 */
export const addReview = (businessId, review) => {
    return async (dispatch, getState) => {
        try {
            // TODO: Replace with actual API call
            // const response = await axios.post(`/api/businesses/${businessId}/reviews/`, review);

            const newReview = {
                id: Date.now(),
                ...review,
                date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }),
            };

            dispatch({
                type: ADD_REVIEW,
                payload: {
                    businessId,
                    review: newReview,
                },
            });

            // Store in localStorage for persistence
            saveReviewToStorage(businessId, newReview);

            return newReview;
        } catch (error) {
            throw error;
        }
    };
};

/**
 * Delete a review
 * @param {string|number} businessId - The business ID
 * @param {string|number} reviewId - The review ID
 */
export const deleteReview = (businessId, reviewId) => ({
    type: DELETE_REVIEW,
    payload: { businessId, reviewId },
});

// Helper functions
const getSampleReviews = (businessId) => {
    // Check localStorage for user-added reviews
    const storedReviews = getStoredReviews(businessId);

    // Sample reviews data
    const sampleReviews = [
        {
            id: 1,
            author: 'Rosalina Kelian',
            avatar: '/images/testimonials/pic1.jpg',
            rating: 5,
            date: 'May 19, 2024',
            comment: 'Amazing experience! The staff was incredibly friendly and the service was top-notch. I highly recommend this business to everyone looking for quality and great customer service.',
        },
        {
            id: 2,
            author: 'Marcus Johnson',
            avatar: '/images/testimonials/pic2.jpg',
            rating: 4,
            date: 'April 15, 2024',
            comment: 'Great local business that truly cares about the community. The products are excellent quality and reasonably priced. Will definitely be coming back!',
        },
        {
            id: 3,
            author: 'Tanya Williams',
            avatar: '/images/testimonials/pic3.jpg',
            rating: 5,
            date: 'March 22, 2024',
            comment: 'Love supporting Black-owned businesses in my community. This place exceeded all my expectations. The owner is so passionate about what they do!',
        },
    ];

    return [...storedReviews, ...sampleReviews];
};

const getStoredReviews = (businessId) => {
    try {
        const reviews = localStorage.getItem(`reviews_${businessId}`);
        return reviews ? JSON.parse(reviews) : [];
    } catch {
        return [];
    }
};

const saveReviewToStorage = (businessId, review) => {
    try {
        const existing = getStoredReviews(businessId);
        localStorage.setItem(`reviews_${businessId}`, JSON.stringify([review, ...existing]));
    } catch (error) {
        console.error('Error saving review:', error);
    }
};
