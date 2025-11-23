import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from '../../services/GeolocationService';

// Default placeholder image
import defaultImage from './../../images/listing/pic1.jpg';

/**
 * BusinessCard Component
 * Displays a single business with optional distance information
 */
const BusinessCard = ({ business, showDistance = false }) => {
    const {
        id,
        name,
        tagline,
        description,
        image,
        logo,
        category,
        address,
        city,
        state,
        distance,
        isOpen,
        rating = 5,
    } = business;

    const displayImage = image || logo || defaultImage;
    const displayLocation = city && state ? `${city}, ${state}` : address || 'Carolina Region';

    return (
        <div className="listing-bx featured-star-left m-b30">
            <div className="listing-media">
                <Link to={`/listing-details/${id || ''}`}>
                    <img src={displayImage} alt={name || 'Business'} />
                </Link>
                {showDistance && distance !== undefined && (
                    <div className="distance-badge">
                        <i className="fa fa-map-marker"></i> {formatDistance(distance)}
                    </div>
                )}
                <ul className="featured-star">
                    {[...Array(5)].map((_, i) => (
                        <li key={i}>
                            <i className={`fa fa-star${i < rating ? '' : '-o'}`}></i>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="listing-info">
                <h3 className="title">
                    <Link to={`/listing-details/${id || ''}`}>{name || 'Business Name'}</Link>
                </h3>
                <p>{tagline || description?.substring(0, 80) || 'Local Black-owned business'}</p>
                <ul className="place-info">
                    <li className="place-location">
                        <i className="fa fa-map-marker"></i>
                        {displayLocation}
                    </li>
                    {isOpen !== undefined && (
                        <li className={isOpen ? 'open' : 'closed'}>
                            <i className={`fa fa-${isOpen ? 'check' : 'times'}`}></i>
                            {isOpen ? 'Open Now' : 'Closed'}
                        </li>
                    )}
                    {category && (
                        <li className="category-tag">
                            <i className="fa fa-tag"></i>
                            {category}
                        </li>
                    )}
                </ul>
            </div>
            <ul className="wish-bx">
                <li>
                    <Link className="like-btn" to="#">
                        <i className="fa fa-heart"></i>
                    </Link>
                </li>
                <li>
                    <Link className="info-btn" to="#">
                        <i className="fa fa-leaf"></i>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default BusinessCard;
