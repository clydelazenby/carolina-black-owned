/**
 * Reviews Reducer
 * Manages reviews state for businesses
 */

import {
    REVIEWS_LOADING,
    REVIEWS_SUCCESS,
    REVIEWS_ERROR,
    ADD_REVIEW,
    DELETE_REVIEW,
} from '../actions/ReviewActions';

const initialState = {
    // Reviews by business ID
    reviewsByBusiness: {},
    // Average ratings by business ID
    ratingsByBusiness: {},
    // UI state
    loading: false,
    error: null,
};

const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
};

const ReviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case REVIEWS_LOADING:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case REVIEWS_SUCCESS: {
            const { businessId, reviews } = action.payload;
            return {
                ...state,
                loading: false,
                reviewsByBusiness: {
                    ...state.reviewsByBusiness,
                    [businessId]: reviews,
                },
                ratingsByBusiness: {
                    ...state.ratingsByBusiness,
                    [businessId]: calculateAverageRating(reviews),
                },
                error: null,
            };
        }

        case REVIEWS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case ADD_REVIEW: {
            const { businessId, review } = action.payload;
            const existingReviews = state.reviewsByBusiness[businessId] || [];
            const updatedReviews = [review, ...existingReviews];
            return {
                ...state,
                reviewsByBusiness: {
                    ...state.reviewsByBusiness,
                    [businessId]: updatedReviews,
                },
                ratingsByBusiness: {
                    ...state.ratingsByBusiness,
                    [businessId]: calculateAverageRating(updatedReviews),
                },
            };
        }

        case DELETE_REVIEW: {
            const { businessId, reviewId } = action.payload;
            const filteredReviews = (state.reviewsByBusiness[businessId] || [])
                .filter(review => review.id !== reviewId);
            return {
                ...state,
                reviewsByBusiness: {
                    ...state.reviewsByBusiness,
                    [businessId]: filteredReviews,
                },
                ratingsByBusiness: {
                    ...state.ratingsByBusiness,
                    [businessId]: calculateAverageRating(filteredReviews),
                },
            };
        }

        default:
            return state;
    }
};

export default ReviewsReducer;
