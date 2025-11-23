import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Header from './../Layout/Header';
import Footer from './../Layout/Footer';
import Sidebar from './../Element/Sidebar';
import BusinessCard from './../Element/BusinessCard';
import {
    setSortBy,
    applyFilters,
    SORT_OPTIONS,
    CATEGORIES,
} from '../../store/actions/SearchFilterActions';
import {
    selectFilteredResults,
    selectSortBy,
    selectHasFiltersApplied,
    selectSearchQuery,
    selectCategoryFilter,
    selectLocationFilter,
    selectRatingFilter,
} from '../../store/selectors/SearchFilterSelectors';
import { selectCoordinates } from '../../store/selectors/LocationSelectors';

var bnr = require('./../../images/banner/bnr3.jpg');

// Sample businesses data - will be replaced with API data
const allBusinesses = [
    {
        id: 1,
        name: 'Queen City Soul Food',
        tagline: 'Authentic Southern cuisine',
        category: 'Restaurant',
        city: 'Charlotte',
        state: 'NC',
        latitude: 35.2271,
        longitude: -80.8431,
        image: require('./../../images/listing/pic1.jpg'),
        rating: 5,
        isOpen: true,
    },
    {
        id: 2,
        name: 'Carolina Cuts Barbershop',
        tagline: 'Premium grooming experience',
        category: 'Beauty & Grooming',
        city: 'Raleigh',
        state: 'NC',
        latitude: 35.7796,
        longitude: -78.6382,
        image: require('./../../images/listing/pic2.jpg'),
        rating: 5,
        isOpen: true,
    },
    {
        id: 3,
        name: 'Lowcountry Boutique',
        tagline: 'Fashion with southern charm',
        category: 'Retail',
        city: 'Charleston',
        state: 'SC',
        latitude: 32.7765,
        longitude: -79.9311,
        image: require('./../../images/listing/pic3.jpg'),
        rating: 4,
        isOpen: true,
    },
    {
        id: 4,
        name: 'Beach Vibes Cafe',
        tagline: 'Coffee and coastal treats',
        category: 'Cafe',
        city: 'Myrtle Beach',
        state: 'SC',
        latitude: 33.6891,
        longitude: -78.8867,
        image: require('./../../images/listing/pic4.jpg'),
        rating: 5,
        isOpen: false,
    },
    {
        id: 5,
        name: 'Triangle Tech Solutions',
        tagline: 'IT services for small business',
        category: 'Technology',
        city: 'Durham',
        state: 'NC',
        latitude: 35.994,
        longitude: -78.8986,
        image: require('./../../images/listing/pic5.jpg'),
        rating: 5,
        isOpen: true,
    },
    {
        id: 6,
        name: 'Southern Roots Wellness',
        tagline: 'Holistic health and healing',
        category: 'Health & Wellness',
        city: 'Greensboro',
        state: 'NC',
        latitude: 36.0726,
        longitude: -79.792,
        image: require('./../../images/listing/pic6.jpg'),
        rating: 4,
        isOpen: true,
    },
    {
        id: 7,
        name: 'Palmetto Auto Care',
        tagline: 'Trusted automotive services',
        category: 'Automotive',
        city: 'Columbia',
        state: 'SC',
        latitude: 34.0007,
        longitude: -81.0348,
        image: require('./../../images/listing/pic7.jpg'),
        rating: 5,
        isOpen: true,
    },
    {
        id: 8,
        name: 'Carolina Legal Services',
        tagline: 'Professional legal assistance',
        category: 'Professional Services',
        city: 'Charlotte',
        state: 'NC',
        latitude: 35.23,
        longitude: -80.85,
        image: require('./../../images/listing/pic8.jpg'),
        rating: 4,
        isOpen: true,
    },
    {
        id: 9,
        name: 'Uptown Entertainment',
        tagline: 'Events and entertainment',
        category: 'Entertainment',
        city: 'Raleigh',
        state: 'NC',
        latitude: 35.78,
        longitude: -78.64,
        image: require('./../../images/listing/pic9.jpg'),
        rating: 5,
        isOpen: true,
    },
    {
        id: 10,
        name: 'Coastal Home Services',
        tagline: 'Home repair and maintenance',
        category: 'Home Services',
        city: 'Wilmington',
        state: 'NC',
        latitude: 34.2257,
        longitude: -77.9447,
        image: require('./../../images/listing/pic10.jpg'),
        rating: 4,
        isOpen: true,
    },
    {
        id: 11,
        name: 'Midlands Cafe',
        tagline: 'Coffee and community',
        category: 'Cafe',
        city: 'Columbia',
        state: 'SC',
        latitude: 34.0,
        longitude: -81.03,
        image: require('./../../images/listing/pic11.jpg'),
        rating: 5,
        isOpen: true,
    },
    {
        id: 12,
        name: 'Triad Beauty Bar',
        tagline: 'Full-service beauty salon',
        category: 'Beauty & Grooming',
        city: 'Winston-Salem',
        state: 'NC',
        latitude: 36.0999,
        longitude: -80.2442,
        image: require('./../../images/listing/pic12.jpg'),
        rating: 5,
        isOpen: true,
    },
];

class Listing extends Component {
    state = {
        viewMode: 'grid', // 'grid' or 'list'
    };

    componentDidMount() {
        // Apply initial filters
        this.props.applyFilters(allBusinesses, this.props.userCoordinates);
    }

    componentDidUpdate(prevProps) {
        // Re-apply filters when filter state changes
        if (
            prevProps.searchQuery !== this.props.searchQuery ||
            prevProps.categoryFilter !== this.props.categoryFilter ||
            prevProps.locationFilter !== this.props.locationFilter ||
            prevProps.ratingFilter !== this.props.ratingFilter ||
            prevProps.sortBy !== this.props.sortBy
        ) {
            this.props.applyFilters(allBusinesses, this.props.userCoordinates);
        }
    }

    handleSortChange = (e) => {
        this.props.setSortBy(e.target.value);
    };

    toggleViewMode = (mode) => {
        this.setState({ viewMode: mode });
    };

    renderStars = (rating) => {
        return Array(5)
            .fill(0)
            .map((_, i) => (
                <li key={i}>
                    <i className={`fa fa-star ${i < rating ? '' : 'text-muted'}`}></i>
                </li>
            ));
    };

    render() {
        const { filteredResults, hasFiltersApplied, sortBy } = this.props;
        const { viewMode } = this.state;

        // Use filtered results if filters applied, otherwise show all
        const businesses = hasFiltersApplied ? filteredResults : allBusinesses;

        return (
            <div className="page-wraper">
                <Header />

                <div className="page-content bg-white">
                    <div
                        className="dlab-bnr-inr dlab-bnr-inr-sm overlay-black-middle"
                        style={{ backgroundImage: 'url(' + bnr + ')' }}
                    >
                        <div className="container">
                            <div className="dlab-bnr-inr-entry">
                                <h1 className="text-white">Business Directory</h1>
                                <p>Find awesome Black-owned businesses across the Carolinas</p>

                                <div className="breadcrumb-row">
                                    <ul className="list-inline">
                                        <li>
                                            <Link to={'./'}>Home</Link>
                                        </li>
                                        <li>Listings</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content-block">
                        <div className="section-full content-inner bg-white">
                            <div className="container">
                                <div className="row">
                                    {/* Sidebar */}
                                    <Sidebar />

                                    {/* Main Content */}
                                    <div className="col-lg-8 col-md-6">
                                        {/* Filter Bar */}
                                        <div className="listing-filter m-b30">
                                            <div className="d-flex flex-wrap justify-content-between align-items-center">
                                                <div className="results-count mb-2 mb-md-0">
                                                    <span className="text-muted">
                                                        Showing {businesses.length} businesses
                                                    </span>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <div className="mr-3">
                                                        <select
                                                            className="custom-select"
                                                            value={sortBy}
                                                            onChange={this.handleSortChange}
                                                        >
                                                            <option value={SORT_OPTIONS.RELEVANCE}>
                                                                Sort: Relevance
                                                            </option>
                                                            <option value={SORT_OPTIONS.RATING_HIGH}>
                                                                Highest Rated
                                                            </option>
                                                            <option value={SORT_OPTIONS.RATING_LOW}>
                                                                Lowest Rated
                                                            </option>
                                                            <option value={SORT_OPTIONS.NAME_AZ}>
                                                                Name (A-Z)
                                                            </option>
                                                            <option value={SORT_OPTIONS.NAME_ZA}>
                                                                Name (Z-A)
                                                            </option>
                                                            <option value={SORT_OPTIONS.NEWEST}>
                                                                Newest First
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <ul className="filter-icon m-b0">
                                                        <li className="mr-1">
                                                            <button
                                                                className={`btn btn-sm ${
                                                                    viewMode === 'grid'
                                                                        ? 'btn-primary'
                                                                        : 'btn-outline-secondary'
                                                                }`}
                                                                onClick={() => this.toggleViewMode('grid')}
                                                            >
                                                                <i className="fa fa-th"></i>
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                className={`btn btn-sm ${
                                                                    viewMode === 'list'
                                                                        ? 'btn-primary'
                                                                        : 'btn-outline-secondary'
                                                                }`}
                                                                onClick={() => this.toggleViewMode('list')}
                                                            >
                                                                <i className="fa fa-th-list"></i>
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Business Listings */}
                                        {businesses.length > 0 ? (
                                            <div className="row">
                                                {businesses.map((business) => (
                                                    <div
                                                        className={
                                                            viewMode === 'grid'
                                                                ? 'col-lg-6 col-md-12 col-sm-6 m-b30'
                                                                : 'col-12 m-b30'
                                                        }
                                                        key={business.id}
                                                    >
                                                        {viewMode === 'grid' ? (
                                                            <BusinessCard business={business} />
                                                        ) : (
                                                            <div className="listing-bx listing-bx-list d-flex">
                                                                <div className="listing-media">
                                                                    <img
                                                                        src={business.image}
                                                                        alt={business.name}
                                                                        style={{
                                                                            width: '200px',
                                                                            height: '150px',
                                                                            objectFit: 'cover',
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="listing-info flex-grow-1 p-3">
                                                                    <ul className="featured-star">
                                                                        {this.renderStars(business.rating)}
                                                                    </ul>
                                                                    <h3 className="title">
                                                                        <Link to={'/listing-details'}>
                                                                            {business.name}
                                                                        </Link>
                                                                    </h3>
                                                                    <p className="text-muted mb-2">
                                                                        {business.tagline}
                                                                    </p>
                                                                    <p className="mb-1">
                                                                        <i className="fa fa-map-marker text-primary mr-2"></i>
                                                                        {business.city}, {business.state}
                                                                    </p>
                                                                    <p className="mb-0">
                                                                        <span
                                                                            className={`badge ${
                                                                                business.isOpen
                                                                                    ? 'badge-success'
                                                                                    : 'badge-secondary'
                                                                            }`}
                                                                        >
                                                                            {business.isOpen ? 'Open' : 'Closed'}
                                                                        </span>
                                                                        <span className="badge badge-info ml-2">
                                                                            {business.category}
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-5">
                                                <i
                                                    className="fa fa-search fa-3x text-muted mb-3"
                                                    style={{ opacity: 0.5 }}
                                                ></i>
                                                <h4>No businesses found</h4>
                                                <p className="text-muted">
                                                    Try adjusting your search or filter criteria
                                                </p>
                                            </div>
                                        )}

                                        {/* Pagination */}
                                        {businesses.length > 0 && (
                                            <div className="pagination-bx clearfix text-center">
                                                <ul className="pagination">
                                                    <li className="previous">
                                                        <Link to={'#'}>
                                                            <i className="fa fa-arrow-left"></i>
                                                        </Link>
                                                    </li>
                                                    <li className="active">
                                                        <Link to={'#'}>1</Link>
                                                    </li>
                                                    <li className="next">
                                                        <Link to={'#'}>
                                                            <i className="fa fa-arrow-right"></i>
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    filteredResults: selectFilteredResults(state),
    hasFiltersApplied: selectHasFiltersApplied(state),
    sortBy: selectSortBy(state),
    searchQuery: selectSearchQuery(state),
    categoryFilter: selectCategoryFilter(state),
    locationFilter: selectLocationFilter(state),
    ratingFilter: selectRatingFilter(state),
    userCoordinates: selectCoordinates(state),
});

const mapDispatchToProps = {
    setSortBy,
    applyFilters,
};

export default connect(mapStateToProps, mapDispatchToProps)(Listing);
