import React, { useState } from 'react';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import StarRating from './StarRating';
import { addReview } from '../../store/actions/ReviewActions';

/**
 * ReviewForm Component
 * Form for submitting business reviews
 */
const ReviewForm = ({ businessId, addReview, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        rating: 0,
        comment: '',
        author: '',
        email: '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleRatingChange = (rating) => {
        setFormData(prev => ({ ...prev, rating }));
        if (errors.rating) {
            setErrors(prev => ({ ...prev, rating: null }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (formData.rating === 0) {
            newErrors.rating = 'Please select a rating';
        }
        if (!formData.comment.trim()) {
            newErrors.comment = 'Please write a review';
        } else if (formData.comment.trim().length < 10) {
            newErrors.comment = 'Review must be at least 10 characters';
        }
        if (!formData.author.trim()) {
            newErrors.author = 'Please enter your name';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Please enter your email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setSubmitting(true);

        try {
            await addReview(businessId, {
                author: formData.author,
                email: formData.email,
                rating: formData.rating,
                comment: formData.comment,
                avatar: null, // Default avatar
            });

            swal('Thank you!', 'Your review has been submitted successfully.', 'success');

            // Reset form
            setFormData({
                rating: 0,
                comment: '',
                author: '',
                email: '',
            });
        } catch (error) {
            swal('Error', 'Failed to submit review. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="review-form-container">
            <h3 className="font-26">Write a Review</h3>
            <form className="review-form" onSubmit={handleSubmit}>
                {/* Star Rating */}
                <div className="form-group rating-input">
                    <label>Your Rating <span className="required">*</span></label>
                    <StarRating
                        rating={formData.rating}
                        onRatingChange={handleRatingChange}
                        interactive={true}
                        size="lg"
                    />
                    {errors.rating && <span className="error-text">{errors.rating}</span>}
                </div>

                {/* Review Text */}
                <div className="form-group">
                    <label htmlFor="comment">Your Review <span className="required">*</span></label>
                    <textarea
                        id="comment"
                        name="comment"
                        rows="6"
                        placeholder="Share your experience with this business..."
                        value={formData.comment}
                        onChange={handleChange}
                        className={errors.comment ? 'error' : ''}
                    />
                    {errors.comment && <span className="error-text">{errors.comment}</span>}
                </div>

                {/* Author Name */}
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="author">Your Name <span className="required">*</span></label>
                            <input
                                type="text"
                                id="author"
                                name="author"
                                placeholder="Enter your name"
                                value={formData.author}
                                onChange={handleChange}
                                className={errors.author ? 'error' : ''}
                            />
                            {errors.author && <span className="error-text">{errors.author}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="email">Your Email <span className="required">*</span></label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="form-group">
                    <button
                        type="submit"
                        className="site-button"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <>
                                <i className="fa fa-spinner fa-spin"></i> Submitting...
                            </>
                        ) : (
                            'Submit Review'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth?.auth?.idToken,
});

const mapDispatchToProps = {
    addReview,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewForm);
