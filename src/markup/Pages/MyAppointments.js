import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import { loadUserAppointments, cancelAppointment } from '../../store/actions/EcommerceActions';

const MyAppointments = ({
    auth,
    ecommerce,
    loadUserAppointments,
    cancelAppointment
}) => {
    const [filter, setFilter] = useState('upcoming');
    const userId = auth.auth?.localId;

    useEffect(() => {
        if (userId) {
            loadUserAppointments(userId);
        }
    }, [userId, loadUserAppointments]);

    const { appointments, loading } = ecommerce;

    const now = new Date();

    const filteredAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date + 'T' + apt.time);

        switch (filter) {
            case 'upcoming':
                return aptDate >= now && apt.status !== 'cancelled';
            case 'past':
                return aptDate < now || apt.status === 'completed';
            case 'cancelled':
                return apt.status === 'cancelled';
            default:
                return true;
        }
    });

    const sortedAppointments = [...filteredAppointments].sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.time);
        const dateB = new Date(b.date + 'T' + b.time);
        return filter === 'past' ? dateB - dateA : dateA - dateB;
    });

    const handleCancel = (appointmentId, businessId) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            cancelAppointment(businessId, appointmentId, 'Cancelled by customer');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-warning text-dark',
            confirmed: 'bg-success',
            completed: 'bg-info',
            cancelled: 'bg-danger',
            no_show: 'bg-secondary'
        };
        return badges[status] || 'bg-secondary';
    };

    const formatDate = (dateStr) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
    };

    const isUpcoming = (date, time) => {
        return new Date(date + 'T' + time) >= now;
    };

    return (
        <>
            <Header />
            <div className="page-content bg-white">
                {/* Page Banner */}
                <div className="dez-bnr-inr overlay-black-middle" style={{ backgroundColor: '#2c3e50' }}>
                    <div className="container">
                        <div className="dez-bnr-inr-entry">
                            <h1 className="text-white">My Appointments</h1>
                            <nav aria-label="breadcrumb" className="breadcrumb-row">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item active">Appointments</li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="container py-5">
                    {/* Filter Tabs */}
                    <ul className="nav nav-tabs mb-4">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${filter === 'upcoming' ? 'active' : ''}`}
                                onClick={() => setFilter('upcoming')}
                            >
                                Upcoming
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${filter === 'past' ? 'active' : ''}`}
                                onClick={() => setFilter('past')}
                            >
                                Past
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${filter === 'cancelled' ? 'active' : ''}`}
                                onClick={() => setFilter('cancelled')}
                            >
                                Cancelled
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                All
                            </button>
                        </li>
                    </ul>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : sortedAppointments.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="fa fa-calendar-o fa-3x text-muted mb-3"></i>
                            <h4>No {filter !== 'all' ? filter : ''} appointments</h4>
                            <p className="text-muted">
                                {filter === 'upcoming'
                                    ? "You don't have any upcoming appointments."
                                    : filter === 'past'
                                        ? "You don't have any past appointments."
                                        : "You haven't booked any appointments yet."}
                            </p>
                            <Link to="/listing" className="btn btn-primary">
                                Browse Businesses
                            </Link>
                        </div>
                    ) : (
                        <div className="row">
                            {sortedAppointments.map(appointment => (
                                <div key={appointment.id} className="col-lg-6 mb-4">
                                    <div className={`card h-100 ${!isUpcoming(appointment.date, appointment.time) ? 'bg-light' : ''}`}>
                                        <div className="card-header d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-0">{appointment.businessName}</h6>
                                            </div>
                                            <span className={`badge ${getStatusBadge(appointment.status)}`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-6">
                                                    <p className="mb-1 small text-muted">Service</p>
                                                    <p className="mb-3"><strong>{appointment.serviceName}</strong></p>
                                                </div>
                                                <div className="col-6">
                                                    <p className="mb-1 small text-muted">Price</p>
                                                    <p className="mb-3"><strong>${appointment.price}</strong></p>
                                                </div>
                                                <div className="col-6">
                                                    <p className="mb-1 small text-muted">Date</p>
                                                    <p className="mb-3">
                                                        <i className="fa fa-calendar me-1"></i>
                                                        {formatDate(appointment.date)}
                                                    </p>
                                                </div>
                                                <div className="col-6">
                                                    <p className="mb-1 small text-muted">Time</p>
                                                    <p className="mb-3">
                                                        <i className="fa fa-clock-o me-1"></i>
                                                        {appointment.time}
                                                    </p>
                                                </div>
                                            </div>

                                            {appointment.notes && (
                                                <div className="bg-light p-2 rounded mb-3">
                                                    <small className="text-muted">Notes: {appointment.notes}</small>
                                                </div>
                                            )}

                                            {appointment.status === 'cancelled' && appointment.statusNotes && (
                                                <div className="alert alert-danger py-2 mb-0">
                                                    <small>Reason: {appointment.statusNotes}</small>
                                                </div>
                                            )}
                                        </div>
                                        <div className="card-footer bg-transparent">
                                            <div className="d-flex gap-2">
                                                <Link
                                                    to={`/listing-details?id=${appointment.businessId}`}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    View Business
                                                </Link>

                                                {isUpcoming(appointment.date, appointment.time) &&
                                                    appointment.status !== 'cancelled' && (
                                                        <>
                                                            <Link
                                                                to={`/book-appointment?businessId=${appointment.businessId}&businessName=${encodeURIComponent(appointment.businessName)}`}
                                                                className="btn btn-sm btn-outline-secondary"
                                                            >
                                                                Reschedule
                                                            </Link>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleCancel(appointment.id, appointment.businessId)}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    )}

                                                {!isUpcoming(appointment.date, appointment.time) &&
                                                    appointment.status === 'completed' && (
                                                        <Link
                                                            to={`/listing-details?id=${appointment.businessId}#reviews`}
                                                            className="btn btn-sm btn-outline-success"
                                                        >
                                                            Leave Review
                                                        </Link>
                                                    )}

                                                {!isUpcoming(appointment.date, appointment.time) && (
                                                    <Link
                                                        to={`/book-appointment?businessId=${appointment.businessId}&businessName=${encodeURIComponent(appointment.businessName)}`}
                                                        className="btn btn-sm btn-primary"
                                                    >
                                                        Book Again
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Quick Stats */}
                    {appointments.length > 0 && (
                        <div className="row mt-4">
                            <div className="col-12">
                                <div className="card bg-light">
                                    <div className="card-body">
                                        <h6 className="mb-3">Appointment Stats</h6>
                                        <div className="row text-center">
                                            <div className="col-3">
                                                <h4 className="mb-0">{appointments.length}</h4>
                                                <small className="text-muted">Total</small>
                                            </div>
                                            <div className="col-3">
                                                <h4 className="mb-0 text-success">
                                                    {appointments.filter(a =>
                                                        new Date(a.date + 'T' + a.time) >= now && a.status !== 'cancelled'
                                                    ).length}
                                                </h4>
                                                <small className="text-muted">Upcoming</small>
                                            </div>
                                            <div className="col-3">
                                                <h4 className="mb-0 text-info">
                                                    {appointments.filter(a => a.status === 'completed').length}
                                                </h4>
                                                <small className="text-muted">Completed</small>
                                            </div>
                                            <div className="col-3">
                                                <h4 className="mb-0 text-danger">
                                                    {appointments.filter(a => a.status === 'cancelled').length}
                                                </h4>
                                                <small className="text-muted">Cancelled</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    ecommerce: state.ecommerce
});

const mapDispatchToProps = {
    loadUserAppointments,
    cancelAppointment
};

export default connect(mapStateToProps, mapDispatchToProps)(MyAppointments);
