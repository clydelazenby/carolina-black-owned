import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const InteractiveMap = ({
    businesses,
    userLocation,
    onBusinessSelect,
    height = '500px',
    showClusters = true,
    showDirections = false
}) => {
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 35.2271, lng: -80.8431 }); // Charlotte default
    const [zoom, setZoom] = useState(10);
    const [clusters, setClusters] = useState([]);
    const [viewMode, setViewMode] = useState('map'); // 'map', 'satellite', 'terrain'

    // Carolina cities for quick navigation
    const carolinaCities = [
        { name: 'Charlotte', lat: 35.2271, lng: -80.8431 },
        { name: 'Raleigh', lat: 35.7796, lng: -78.6382 },
        { name: 'Charleston', lat: 32.7765, lng: -79.9311 },
        { name: 'Durham', lat: 35.9940, lng: -78.8986 },
        { name: 'Greensboro', lat: 36.0726, lng: -79.7920 },
        { name: 'Columbia', lat: 34.0007, lng: -81.0348 },
        { name: 'Greenville', lat: 34.8526, lng: -82.3940 },
        { name: 'Wilmington', lat: 34.2257, lng: -77.9447 }
    ];

    // Calculate clusters based on zoom level
    useEffect(() => {
        if (showClusters && businesses.length > 0 && zoom < 12) {
            const clusterData = clusterBusinesses(businesses, zoom);
            setClusters(clusterData);
        } else {
            setClusters([]);
        }
    }, [businesses, zoom, showClusters]);

    // Update center when user location changes
    useEffect(() => {
        if (userLocation?.coordinates) {
            setMapCenter({
                lat: userLocation.coordinates.lat,
                lng: userLocation.coordinates.lng
            });
        }
    }, [userLocation]);

    const clusterBusinesses = (businesses, zoomLevel) => {
        const gridSize = Math.pow(2, 8 - Math.min(zoomLevel, 8));
        const clusters = {};

        businesses.forEach(business => {
            if (business.lat && business.lng) {
                const gridX = Math.floor(business.lng / gridSize);
                const gridY = Math.floor(business.lat / gridSize);
                const key = `${gridX}-${gridY}`;

                if (!clusters[key]) {
                    clusters[key] = {
                        lat: 0,
                        lng: 0,
                        businesses: [],
                        count: 0
                    };
                }

                clusters[key].businesses.push(business);
                clusters[key].count++;
                clusters[key].lat += business.lat;
                clusters[key].lng += business.lng;
            }
        });

        // Average the positions
        return Object.values(clusters).map(cluster => ({
            ...cluster,
            lat: cluster.lat / cluster.count,
            lng: cluster.lng / cluster.count
        }));
    };

    const handleBusinessClick = (business) => {
        setSelectedBusiness(business);
        if (onBusinessSelect) {
            onBusinessSelect(business);
        }
    };

    const handleCitySelect = (city) => {
        setMapCenter({ lat: city.lat, lng: city.lng });
        setZoom(12);
    };

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 1, 18));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 1, 4));

    const getDirectionsUrl = (business) => {
        if (userLocation?.coordinates && business.lat && business.lng) {
            return `https://www.google.com/maps/dir/${userLocation.coordinates.lat},${userLocation.coordinates.lng}/${business.lat},${business.lng}`;
        }
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name + ' ' + (business.city || ''))}`;
    };

    // Mock map rendering (in production, integrate with Google Maps, Mapbox, or Leaflet)
    const renderMap = () => {
        const gridSize = 50;
        const mapWidth = 800;
        const mapHeight = parseInt(height);

        return (
            <div className="position-relative" style={{ height, backgroundColor: '#e8e8e8', overflow: 'hidden' }}>
                {/* Map Controls */}
                <div className="position-absolute top-0 end-0 p-3 d-flex flex-column gap-2" style={{ zIndex: 100 }}>
                    <div className="btn-group-vertical">
                        <button className="btn btn-light btn-sm" onClick={handleZoomIn}>
                            <i className="fa fa-plus"></i>
                        </button>
                        <button className="btn btn-light btn-sm" onClick={handleZoomOut}>
                            <i className="fa fa-minus"></i>
                        </button>
                    </div>
                </div>

                {/* View Mode Toggle */}
                <div className="position-absolute top-0 start-0 p-3" style={{ zIndex: 100 }}>
                    <div className="btn-group btn-group-sm">
                        <button
                            className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-light'}`}
                            onClick={() => setViewMode('map')}
                        >
                            Map
                        </button>
                        <button
                            className={`btn ${viewMode === 'satellite' ? 'btn-primary' : 'btn-light'}`}
                            onClick={() => setViewMode('satellite')}
                        >
                            Satellite
                        </button>
                    </div>
                </div>

                {/* Map Background */}
                <div
                    className="w-100 h-100"
                    style={{
                        background: viewMode === 'satellite'
                            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                            : 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
                        position: 'relative'
                    }}
                >
                    {/* Grid lines for visual reference */}
                    <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.2 }}>
                        {[...Array(20)].map((_, i) => (
                            <React.Fragment key={i}>
                                <line x1={i * gridSize} y1="0" x2={i * gridSize} y2="100%" stroke="#999" />
                                <line x1="0" y1={i * gridSize} x2="100%" y2={i * gridSize} stroke="#999" />
                            </React.Fragment>
                        ))}
                    </svg>

                    {/* Cluster markers */}
                    {clusters.length > 0 && clusters.map((cluster, index) => (
                        <div
                            key={`cluster-${index}`}
                            className="position-absolute d-flex align-items-center justify-content-center rounded-circle bg-primary text-white cursor-pointer"
                            style={{
                                left: `${((cluster.lng - mapCenter.lng) / (180 / zoom) + 0.5) * 100}%`,
                                top: `${(-(cluster.lat - mapCenter.lat) / (90 / zoom) + 0.5) * 100}%`,
                                width: `${Math.min(40 + cluster.count * 5, 80)}px`,
                                height: `${Math.min(40 + cluster.count * 5, 80)}px`,
                                transform: 'translate(-50%, -50%)',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                            }}
                            onClick={() => setZoom(prev => Math.min(prev + 2, 18))}
                        >
                            {cluster.count}
                        </div>
                    ))}

                    {/* Individual business markers (when zoomed in) */}
                    {clusters.length === 0 && businesses.slice(0, 50).map((business, index) => (
                        business.lat && business.lng && (
                            <div
                                key={business.id || index}
                                className="position-absolute"
                                style={{
                                    left: `${30 + (index % 10) * 6}%`,
                                    top: `${20 + Math.floor(index / 10) * 12}%`,
                                    transform: 'translate(-50%, -100%)',
                                    cursor: 'pointer',
                                    zIndex: selectedBusiness?.id === business.id ? 200 : 10
                                }}
                                onClick={() => handleBusinessClick(business)}
                            >
                                <div
                                    className={`d-flex align-items-center justify-content-center ${selectedBusiness?.id === business.id ? 'bg-danger' : 'bg-primary'} text-white rounded-circle`}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                                    }}
                                >
                                    <i className="fa fa-map-marker"></i>
                                </div>
                            </div>
                        )
                    ))}

                    {/* User location marker */}
                    {userLocation?.coordinates && (
                        <div
                            className="position-absolute"
                            style={{
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 150
                            }}
                        >
                            <div
                                className="rounded-circle bg-info border border-white"
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    boxShadow: '0 0 0 8px rgba(0,123,255,0.2)'
                                }}
                            />
                        </div>
                    )}

                    {/* Map label */}
                    <div className="position-absolute bottom-0 start-0 p-2 bg-white bg-opacity-75 small">
                        <strong>Center:</strong> {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)} |
                        <strong className="ms-2">Zoom:</strong> {zoom}
                    </div>
                </div>

                {/* Selected Business Info */}
                {selectedBusiness && (
                    <div
                        className="position-absolute bg-white rounded shadow p-3"
                        style={{
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '300px',
                            maxWidth: '90%',
                            zIndex: 200
                        }}
                    >
                        <button
                            className="btn-close position-absolute top-0 end-0 m-2"
                            onClick={() => setSelectedBusiness(null)}
                        />
                        <h6 className="mb-1">{selectedBusiness.name || selectedBusiness.title}</h6>
                        <p className="small text-muted mb-2">
                            {selectedBusiness.category} | {selectedBusiness.city}
                        </p>
                        {selectedBusiness.rating && (
                            <div className="mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <i
                                        key={i}
                                        className={`fa fa-star ${i < selectedBusiness.rating ? 'text-warning' : 'text-muted'}`}
                                    />
                                ))}
                                <span className="ms-1 small">({selectedBusiness.rating})</span>
                            </div>
                        )}
                        <div className="d-flex gap-2">
                            <Link
                                to={`/listing-details?id=${selectedBusiness.id}`}
                                className="btn btn-sm btn-primary flex-grow-1"
                            >
                                View Details
                            </Link>
                            {showDirections && (
                                <a
                                    href={getDirectionsUrl(selectedBusiness)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-secondary"
                                >
                                    <i className="fa fa-directions"></i> Directions
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="interactive-map">
            {/* City Quick Select */}
            <div className="mb-3 d-flex flex-wrap gap-2">
                <span className="text-muted small me-2 align-self-center">Quick jump:</span>
                {carolinaCities.map(city => (
                    <button
                        key={city.name}
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleCitySelect(city)}
                    >
                        {city.name}
                    </button>
                ))}
            </div>

            {/* Map Container */}
            {renderMap()}

            {/* Legend */}
            <div className="mt-3 d-flex gap-4 small text-muted">
                <div>
                    <span className="d-inline-block rounded-circle bg-primary me-1" style={{ width: '12px', height: '12px' }}></span>
                    Business Location
                </div>
                <div>
                    <span className="d-inline-block rounded-circle bg-info me-1" style={{ width: '12px', height: '12px' }}></span>
                    Your Location
                </div>
                {showClusters && (
                    <div>
                        <span className="d-inline-block rounded-circle bg-primary text-white text-center me-1" style={{ width: '20px', height: '20px', fontSize: '10px', lineHeight: '20px' }}>5</span>
                        Cluster (zoom to expand)
                    </div>
                )}
            </div>

            {/* Business List Below Map */}
            {businesses.length > 0 && (
                <div className="mt-4">
                    <h6>Businesses on Map ({businesses.length})</h6>
                    <div className="row">
                        {businesses.slice(0, 6).map((business, index) => (
                            <div key={business.id || index} className="col-md-4 mb-3">
                                <div
                                    className={`card h-100 cursor-pointer ${selectedBusiness?.id === business.id ? 'border-primary' : ''}`}
                                    onClick={() => handleBusinessClick(business)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="card-body p-3">
                                        <h6 className="card-title mb-1">{business.name || business.title}</h6>
                                        <p className="small text-muted mb-0">{business.city}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {businesses.length > 6 && (
                        <p className="text-muted small">
                            Showing 6 of {businesses.length} businesses. Zoom in to see more.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

const mapStateToProps = (state) => ({
    userLocation: state.location
});

export default connect(mapStateToProps)(InteractiveMap);
