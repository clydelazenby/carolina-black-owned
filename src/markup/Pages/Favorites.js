import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from './../Layout/Header';
import Footer from './../Layout/Footer';
import BusinessCard from './../Element/BusinessCard';
import { loadFavorites, clearFavorites } from '../../store/actions/FavoritesActions';

var bnr = require('./../../images/banner/bnr1.jpg');

/**
 * Favorites Page
 * Displays user's saved/bookmarked businesses
 */
const Favorites = ({ favorites, loaded, loadFavorites, clearFavorites }) => {
    useEffect(() => {
        if (!loaded) {
            loadFavorites();
        }
    }, [loaded, loadFavorites]);

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to remove all favorites?')) {
            clearFavorites();
        }
    };

    return (
        <div className="page-wraper">
            <Header />

            <div className="page-content bg-white">
                {/* Banner */}
                <div
                    className="dlab-bnr-inr dlab-bnr-inr-sm overlay-black-middle"
                    style={{ backgroundImage: `url(${bnr})` }}
                >
                    <div className="container">
                        <div className="dlab-bnr-inr-entry">
                            <h1 className="text-white">My Favorites</h1>
                            <nav aria-label="breadcrumb" className="breadcrumb-row">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/">Home</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Favorites
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="section-full content-inner bg-white">
                    <div className="container">
                        {/* Header */}
                        <div className="favorites-header">
                            <div className="section-head text-black">
                                <h2 className="box-title">
                                    <i className="fa fa-heart text-primary"></i> Saved Businesses
                                </h2>
                                <p>
                                    {favorites.length > 0
                                        ? `You have ${favorites.length} saved business${favorites.length !== 1 ? 'es' : ''}`
                                        : 'Save businesses to easily find them later'}
                                </p>
                            </div>
                            {favorites.length > 0 && (
                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={handleClearAll}
                                >
                                    <i className="fa fa-trash"></i> Clear All
                                </button>
                            )}
                        </div>

                        {/* Favorites Grid */}
                        {favorites.length > 0 ? (
                            <div className="row">
                                {favorites.map((business) => (
                                    <div
                                        className="col-lg-4 col-md-6 col-sm-12"
                                        key={business.id}
                                    >
                                        <BusinessCard
                                            business={business}
                                            showDistance={false}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-favorites">
                                <div className="empty-icon">
                                    <i className="fa fa-heart-o"></i>
                                </div>
                                <h3>No Favorites Yet</h3>
                                <p>
                                    Start exploring and save businesses you love by clicking the
                                    heart icon on any listing.
                                </p>
                                <Link to="/listing-left-sidebar" className="site-button">
                                    Browse Businesses
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

const mapStateToProps = (state) => ({
    favorites: state.favorites.items,
    loaded: state.favorites.loaded,
});

const mapDispatchToProps = {
    loadFavorites,
    clearFavorites,
};

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);
