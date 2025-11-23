import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchReviews } from '../../store/actions/ReviewActions';
import StarRating from './StarRating';

// Default avatar image
import defaultAvatar from './../../images/testimonials/pic1.jpg';

/**
 * ReviewList Component
 * Displays list of reviews for a business
 */
const ReviewList = ({
    businessId,
    reviews,
    averageRating,
    loading,
    fetchReviews,
}) => {
    useEffect(() => {
        if (businessId) {
            fetchReviews(businessId);
        }
    }, [businessId, fetchReviews]);

    if (loading) {
        return (
            <div className="reviews-loading">
                <i className="fa fa-spinner fa-spin"></i> Loading reviews...
            </div>
        );
    }

    const reviewCount = reviews?.length || 0;

    return (
        <div className="reviews-section">
            {/* Reviews Header */}
            <div className="reviews-header">
                <h3 className="font-26">
                    Customer Reviews
                    <span className="review-count-badge">{reviewCount}</span>
                </h3>
                {reviewCount > 0 && (
                    <div className="average-rating">
                        <StarRating
                            rating={averageRating || 0}
                            size="md"
                            showValue={true}
                            totalReviews={reviewCount}
                        />
                    </div>
                )}
            </div>

            {/* Reviews List */}
            {reviewCount > 0 ? (
                <ol className="comment-list review-list">
                    {reviews.map((review) => (
                        <li className="comment" key={review.id}>
                            <div className="comment-body">
                                <div className="comment-author vcard">
                                    <img
                                        className="avatar photo"
                                        src={review.avatar || defaultAvatar}
                                        alt={review.author}
                                        onError={(e) => { e.target.src = defaultAvatar; }}
                                    />
                                    <cite className="fn">{review.author}</cite>
                                </div>
                                <div className="comment-meta">
                                    <span className="review-date">{review.date}</span>
                                    <StarRating rating={review.rating} size="sm" />
                                </div>
                                <p className="review-comment">{review.comment}</p>
                                <div className="review-actions">
                                    <button className="btn-helpful">
                                        <i className="fa fa-thumbs-up"></i> Helpful
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ol>
            ) : (
                <div className="no-reviews">
                    <i className="fa fa-comment-o"></i>
                    <p>No reviews yet. Be the first to review this business!</p>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = (state, ownProps) => ({
    reviews: state.reviews.reviewsByBusiness[ownProps.businessId] || [],
    averageRating: state.reviews.ratingsByBusiness[ownProps.businessId] || 0,
    loading: state.reviews.loading,
});

const mapDispatchToProps = {
    fetchReviews,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewList);
