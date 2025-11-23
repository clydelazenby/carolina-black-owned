import React, { useState } from 'react';

/**
 * StarRating Component
 * Interactive star rating for reviews
 *
 * @param {number} rating - Current rating value (1-5)
 * @param {function} onRatingChange - Callback when rating changes (for interactive mode)
 * @param {boolean} interactive - Whether user can change the rating
 * @param {string} size - Size of stars: 'sm', 'md', 'lg'
 * @param {boolean} showValue - Show numeric value next to stars
 */
const StarRating = ({
    rating = 0,
    onRatingChange,
    interactive = false,
    size = 'md',
    showValue = false,
    totalReviews = null,
}) => {
    const [hoverRating, setHoverRating] = useState(0);

    const sizeClasses = {
        sm: 'star-sm',
        md: 'star-md',
        lg: 'star-lg',
    };

    const handleClick = (value) => {
        if (interactive && onRatingChange) {
            onRatingChange(value);
        }
    };

    const handleMouseEnter = (value) => {
        if (interactive) {
            setHoverRating(value);
        }
    };

    const handleMouseLeave = () => {
        if (interactive) {
            setHoverRating(0);
        }
    };

    const displayRating = hoverRating || rating;

    return (
        <div className={`star-rating ${sizeClasses[size]} ${interactive ? 'interactive' : ''}`}>
            <ul className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <li
                        key={star}
                        className={`star ${displayRating >= star ? 'filled' : 'empty'}`}
                        onClick={() => handleClick(star)}
                        onMouseEnter={() => handleMouseEnter(star)}
                        onMouseLeave={handleMouseLeave}
                        role={interactive ? 'button' : 'presentation'}
                        tabIndex={interactive ? 0 : -1}
                        onKeyPress={(e) => {
                            if (interactive && (e.key === 'Enter' || e.key === ' ')) {
                                handleClick(star);
                            }
                        }}
                    >
                        <i className={`fa fa-star${displayRating >= star ? '' : '-o'}`}></i>
                    </li>
                ))}
            </ul>
            {showValue && (
                <span className="rating-value">
                    {rating.toFixed(1)}
                    {totalReviews !== null && (
                        <span className="review-count">({totalReviews} reviews)</span>
                    )}
                </span>
            )}
        </div>
    );
};

export default StarRating;
