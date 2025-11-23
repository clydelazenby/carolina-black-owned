import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { toggleFavorite, loadFavorites } from '../../store/actions/FavoritesActions';

/**
 * FavoriteButton Component
 * Heart button to add/remove business from favorites
 */
const FavoriteButton = ({
    business,
    isFavorited,
    toggleFavorite,
    loadFavorites,
    loaded,
    size = 'md',
    showText = false,
}) => {
    useEffect(() => {
        if (!loaded) {
            loadFavorites();
        }
    }, [loaded, loadFavorites]);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(business);
    };

    const sizeClasses = {
        sm: 'favorite-btn-sm',
        md: 'favorite-btn-md',
        lg: 'favorite-btn-lg',
    };

    return (
        <button
            className={`favorite-btn ${sizeClasses[size]} ${isFavorited ? 'favorited' : ''}`}
            onClick={handleClick}
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
            <i className={`fa fa-heart${isFavorited ? '' : '-o'}`}></i>
            {showText && (
                <span className="favorite-text">
                    {isFavorited ? 'Saved' : 'Save'}
                </span>
            )}
        </button>
    );
};

const mapStateToProps = (state, ownProps) => ({
    isFavorited: state.favorites.items.some(item => item.id === ownProps.business?.id),
    loaded: state.favorites.loaded,
});

const mapDispatchToProps = {
    toggleFavorite,
    loadFavorites,
};

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteButton);
