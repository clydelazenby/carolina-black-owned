import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { detectLocation, setSearchRadius } from '../../store/actions/LocationActions';
import {
    selectCity,
    selectCityName,
    selectLocationLoading,
    selectLocationError,
    selectLocationDetected,
    selectCoordinates,
    selectSearchRadius,
} from '../../store/selectors/LocationSelectors';
import { formatDistance, CAROLINA_CITIES } from '../../services/GeolocationService';
import BusinessCard from './BusinessCard';

// Sample businesses data (will be replaced with API data)
// Each business has coordinates for distance calculation
const sampleBusinesses = [
    {
        id: 1,
        name: "Queen City Soul Food",
        tagline: "Authentic Southern cuisine",
        category: "Restaurant",
        city: "Charlotte",
        state: "NC",
        latitude: 35.2271,
        longitude: -80.8431,
        image: require('./../../images/listing/pic1.jpg'),
        rating: 5,
        isOpen: true,
    },
    {
        id: 2,
        name: "Carolina Cuts Barbershop",
        tagline: "Premium grooming experience",
        category: "Beauty & Grooming",
        city: "Raleigh",
        state: "NC",
        latitude: 35.7796,
        longitude: -78.6382,
        image: require('./../../images/listing/pic2.jpg'),
        rating: 5,
        isOpen: true,
    },
    {
        id: 3,
        name: "Lowcountry Boutique",
        tagline: "Fashion with southern charm",
        category: "Retail",
        city: "Charleston",
        state: "SC",
        latitude: 32.7765,
        longitude: -79.9311,
        image: require('./../../images/listing/pic3.jpg'),
        rating: 4,
        isOpen: true,
    },
    {
        id: 4,
        name: "Beach Vibes Cafe",
        tagline: "Coffee and coastal treats",
        category: "Cafe",
        city: "Myrtle Beach",
        state: "SC",
        latitude: 33.6891,
        longitude: -78.8867,
        image: require('./../../images/listing/pic4.jpg'),
        rating: 5,
        isOpen: false,
    },
    {
        id: 5,
        name: "Triangle Tech Solutions",
        tagline: "IT services for small business",
        category: "Technology",
        city: "Durham",
        state: "NC",
        latitude: 35.9940,
        longitude: -78.8986,
        image: require('./../../images/listing/pic5.jpg'),
        rating: 5,
        isOpen: true,
    },
    {
        id: 6,
        name: "Southern Roots Wellness",
        tagline: "Holistic health and healing",
        category: "Health & Wellness",
        city: "Greensboro",
        state: "NC",
        latitude: 36.0726,
        longitude: -79.7920,
        image: require('./../../images/listing/pic6.jpg'),
        rating: 4,
        isOpen: true,
    },
];

// Slider arrow components
function SampleNextArrow(props) {
    const { onClick } = props;
    return (
        <div className="owl-nav">
            <div className="owl-next la la-angle-right" onClick={onClick} />
        </div>
    );
}

function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
        <div className="owl-nav">
            <div className="owl-prev la la-angle-left" onClick={onClick} />
        </div>
    );
}

class NearYou extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nearbyBusinesses: [],
            hasAttemptedLocation: false,
        };
    }

    componentDidMount() {
        // Auto-detect location on mount
        this.handleDetectLocation();
    }

    componentDidUpdate(prevProps) {
        // Recalculate nearby businesses when location changes
        if (prevProps.coordinates !== this.props.coordinates && this.props.coordinates) {
            this.calculateNearbyBusinesses();
        }
    }

    handleDetectLocation = async () => {
        const { detectLocation } = this.props;
        this.setState({ hasAttemptedLocation: true });

        try {
            await detectLocation();
        } catch (error) {
            console.log('Location detection failed:', error.message);
            // Still show businesses even if location fails
            this.showDefaultBusinesses();
        }
    };

    calculateNearbyBusinesses = () => {
        const { coordinates, searchRadius } = this.props;

        if (!coordinates) {
            this.showDefaultBusinesses();
            return;
        }

        // Calculate distance for each business
        const businessesWithDistance = sampleBusinesses.map(business => {
            const distance = this.calculateDistance(
                coordinates.lat,
                coordinates.lng,
                business.latitude,
                business.longitude
            );
            return { ...business, distance };
        });

        // Sort by distance and filter by radius
        const nearby = businessesWithDistance
            .filter(b => b.distance <= searchRadius)
            .sort((a, b) => a.distance - b.distance);

        this.setState({ nearbyBusinesses: nearby });
    };

    showDefaultBusinesses = () => {
        // Show all businesses without distance when location is unavailable
        this.setState({ nearbyBusinesses: sampleBusinesses });
    };

    calculateDistance = (lat1, lng1, lat2, lng2) => {
        const R = 3959; // Earth's radius in miles
        const dLat = this.toRad(lat2 - lat1);
        const dLng = this.toRad(lng2 - lng1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 10) / 10;
    };

    toRad = (deg) => deg * (Math.PI / 180);

    handleRadiusChange = (e) => {
        const radius = parseInt(e.target.value, 10);
        this.props.setSearchRadius(radius);
        // Recalculate with new radius
        setTimeout(() => this.calculateNearbyBusinesses(), 0);
    };

    render() {
        const { cityName, loading, error, locationDetected, searchRadius } = this.props;
        const { nearbyBusinesses, hasAttemptedLocation } = this.state;

        const sliderSettings = {
            dots: false,
            slidesToShow: Math.min(4, nearbyBusinesses.length || 1),
            infinite: nearbyBusinesses.length > 4,
            nextArrow: <SampleNextArrow />,
            prevArrow: <SamplePrevArrow />,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: { slidesToShow: 3 },
                },
                {
                    breakpoint: 991,
                    settings: { slidesToShow: 2 },
                },
                {
                    breakpoint: 576,
                    settings: { slidesToShow: 1 },
                },
            ],
        };

        return (
            <div className="section-full bg-white content-inner near-you-section">
                <div className="container">
                    {/* Section Header */}
                    <div className="section-head text-black text-center">
                        <h2 className="box-title">
                            {locationDetected ? (
                                <>
                                    <i className="fa fa-map-marker text-primary"></i>{' '}
                                    Businesses Near {cityName}
                                </>
                            ) : (
                                'Discover Local Businesses'
                            )}
                        </h2>
                        <div className="dlab-separator bg-primary"></div>

                        {/* Location Status */}
                        {loading ? (
                            <p className="location-status">
                                <i className="fa fa-spinner fa-spin"></i> Detecting your location...
                            </p>
                        ) : error ? (
                            <div className="location-status">
                                <p className="text-muted">
                                    <i className="fa fa-info-circle"></i> {error}
                                </p>
                                <button
                                    className="btn btn-sm btn-outline-primary mt-2"
                                    onClick={this.handleDetectLocation}
                                >
                                    <i className="fa fa-location-arrow"></i> Try Again
                                </button>
                            </div>
                        ) : locationDetected ? (
                            <div className="location-controls">
                                <p className="text-success mb-2">
                                    <i className="fa fa-check-circle"></i> Showing businesses within{' '}
                                    <select
                                        value={searchRadius}
                                        onChange={this.handleRadiusChange}
                                        className="radius-select"
                                    >
                                        <option value={5}>5 miles</option>
                                        <option value={10}>10 miles</option>
                                        <option value={25}>25 miles</option>
                                        <option value={50}>50 miles</option>
                                        <option value={100}>100 miles</option>
                                    </select>
                                </p>
                            </div>
                        ) : (
                            <p>
                                Support Black-owned businesses in Charlotte, Raleigh, Myrtle Beach, and Charleston.
                            </p>
                        )}
                    </div>

                    {/* Enable Location Button (if not detected) */}
                    {!locationDetected && !loading && hasAttemptedLocation && (
                        <div className="text-center mb-4">
                            <button
                                className="btn btn-primary"
                                onClick={this.handleDetectLocation}
                            >
                                <i className="fa fa-location-arrow"></i> Enable Location
                            </button>
                            <p className="text-muted mt-2 small">
                                Enable location to see businesses closest to you
                            </p>
                        </div>
                    )}

                    {/* Business Cards Slider */}
                    {nearbyBusinesses.length > 0 ? (
                        <Slider
                            className="owl-btn-center-lr owl-btn-1 primary owl-loaded owl-drag"
                            {...sliderSettings}
                        >
                            {nearbyBusinesses.map((business, index) => (
                                <div className="item p-a5" key={business.id || index}>
                                    <BusinessCard
                                        business={business}
                                        showDistance={locationDetected}
                                    />
                                </div>
                            ))}
                        </Slider>
                    ) : loading ? null : (
                        <div className="text-center py-4">
                            <p className="text-muted">
                                No businesses found in your area. Try increasing the search radius.
                            </p>
                        </div>
                    )}

                    {/* View All Link */}
                    <div className="text-center mt-4">
                        <Link to="/listing-left-sidebar" className="btn btn-primary">
                            View All Businesses <i className="fa fa-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    coordinates: selectCoordinates(state),
    city: selectCity(state),
    cityName: selectCityName(state),
    loading: selectLocationLoading(state),
    error: selectLocationError(state),
    locationDetected: selectLocationDetected(state),
    searchRadius: selectSearchRadius(state),
});

const mapDispatchToProps = {
    detectLocation,
    setSearchRadius,
};

export default connect(mapStateToProps, mapDispatchToProps)(NearYou);
