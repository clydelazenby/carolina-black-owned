import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    setSearchQuery,
    setLocationFilter,
    setCategoryFilter,
    setRatingFilter,
    clearAllFilters,
    CATEGORIES,
} from '../../store/actions/SearchFilterActions';
import {
    selectSearchQuery,
    selectLocationFilter,
    selectCategoryFilter,
    selectRatingFilter,
    selectActiveFilterCount,
} from '../../store/selectors/SearchFilterSelectors';

class Sidebar extends Component {
    handleSearchChange = (e) => {
        this.props.setSearchQuery(e.target.value);
    };

    handleLocationChange = (e) => {
        this.props.setLocationFilter(e.target.value);
    };

    handleCategoryChange = (e) => {
        this.props.setCategoryFilter(e.target.value);
    };

    handleRatingChange = (rating) => {
        this.props.setRatingFilter(rating);
    };

    handleClearFilters = () => {
        this.props.clearAllFilters();
    };

    handleTagClick = (tag) => {
        this.props.setSearchQuery(tag);
    };

    render() {
        const {
            searchQuery,
            locationFilter,
            categoryFilter,
            ratingFilter,
            activeFilterCount,
        } = this.props;

        return (
            <div className="col-lg-4 col-md-6">
                <div className="sticky-top">
                    <div className="listing-filter-sidebar">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="title m-b0">Filter By</h4>
                            {activeFilterCount > 0 && (
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={this.handleClearFilters}
                                >
                                    Clear ({activeFilterCount})
                                </button>
                            )}
                        </div>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group">
                                <label className="small text-muted">Search</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="What are you looking for?"
                                        value={searchQuery}
                                        onChange={this.handleSearchChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="small text-muted">Location</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="City or state"
                                        value={locationFilter}
                                        onChange={this.handleLocationChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="small text-muted">Category</label>
                                <select
                                    className="custom-select"
                                    value={categoryFilter}
                                    onChange={this.handleCategoryChange}
                                >
                                    <option value="all">All Categories</option>
                                    {CATEGORIES.map((category) => (
                                        <option key={category} value={category.toLowerCase()}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="small text-muted">Minimum Rating</label>
                                <div className="rating-filter">
                                    {[0, 1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            type="button"
                                            className={`btn btn-sm mr-1 mb-1 ${
                                                ratingFilter === rating
                                                    ? 'btn-primary'
                                                    : 'btn-outline-secondary'
                                            }`}
                                            onClick={() => this.handleRatingChange(rating)}
                                        >
                                            {rating === 0 ? 'Any' : `${rating}+`}
                                            {rating > 0 && <i className="fa fa-star ml-1"></i>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="listing-filter-sidebar">
                        <h4 className="title">Popular Tags</h4>
                        <div className="widget_tag">
                            <ul className="m-b0">
                                <li>
                                    <Link to="#" onClick={() => this.handleTagClick('Restaurant')}>
                                        Restaurant
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" onClick={() => this.handleTagClick('Beauty')}>
                                        Beauty
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" onClick={() => this.handleTagClick('Retail')}>
                                        Retail
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" onClick={() => this.handleTagClick('Technology')}>
                                        Technology
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" onClick={() => this.handleTagClick('Health')}>
                                        Health
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="add p-tb30">
                        <img src={require('./../../images/add/add1.jpg')} alt="" />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    searchQuery: selectSearchQuery(state),
    locationFilter: selectLocationFilter(state),
    categoryFilter: selectCategoryFilter(state),
    ratingFilter: selectRatingFilter(state),
    activeFilterCount: selectActiveFilterCount(state),
});

const mapDispatchToProps = {
    setSearchQuery,
    setLocationFilter,
    setCategoryFilter,
    setRatingFilter,
    clearAllFilters,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
