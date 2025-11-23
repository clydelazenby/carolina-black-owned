import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import {
    loadBusinessServices,
    createAppointment,
    getAvailableSlots
} from '../../store/actions/EcommerceActions';

const BookAppointment = ({
    auth,
    ecommerce,
    loadBusinessServices,
    createAppointment,
    getAvailableSlots
}) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const businessId = queryParams.get('businessId');
    const businessName = queryParams.get('businessName') || 'Business';

    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        notes: ''
    });
    const [bookingComplete, setBookingComplete] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);

    useEffect(() => {
        if (businessId) {
            loadBusinessServices(businessId);
        }
    }, [businessId, loadBusinessServices]);

    const services = ecommerce.services[businessId] || [];

    // Generate available dates (next 30 days, excluding past dates)
    const getAvailableDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date.toISOString().split('T')[0]);
        }
        return dates;
    };

    // Generate time slots when date is selected
    useEffect(() => {
        if (selectedDate && selectedService) {
            // Mock available slots - in real app would call getAvailableSlots
            const slots = [
                '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                '12:00', '13:00', '13:30', '14:00', '14:30', '15:00',
                '15:30', '16:00', '16:30'
            ];
            setAvailableSlots(slots);
        }
    }, [selectedDate, selectedService]);

    const handleServiceSelect = (service) => {
        setSelectedService(service);
        setStep(2);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedTime('');
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        setStep(3);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const appointmentData = {
            businessId,
            businessName,
            serviceId: selectedService.id,
            serviceName: selectedService.name,
            date: selectedDate,
            time: selectedTime,
            duration: selectedService.duration,
            price: selectedService.price,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            notes: formData.notes
        };

        const result = await createAppointment(appointmentData);
        setBookingDetails(result);
        setBookingComplete(true);
    };

    const formatDate = (dateStr) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
    };

    if (bookingComplete) {
        return (
            <>
                <Header />
                <div className="page-content bg-white">
                    <div className="container py-5">
                        <div className="row justify-content-center">
                            <div className="col-lg-6">
                                <div className="card text-center">
                                    <div className="card-body py-5">
                                        <div className="mb-4">
                                            <i className="fa fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
                                        </div>
                                        <h2 className="mb-3">Booking Confirmed!</h2>
                                        <p className="text-muted mb-4">
                                            Your appointment has been successfully booked.
                                        </p>
                                        <div className="bg-light p-4 rounded mb-4">
                                            <h5>{selectedService?.name}</h5>
                                            <p className="mb-1"><strong>Date:</strong> {formatDate(selectedDate)}</p>
                                            <p className="mb-1"><strong>Time:</strong> {selectedTime}</p>
                                            <p className="mb-1"><strong>Duration:</strong> {selectedService?.duration} minutes</p>
                                            <p className="mb-0"><strong>Price:</strong> ${selectedService?.price}</p>
                                        </div>
                                        <p className="small text-muted mb-4">
                                            A confirmation email has been sent to {formData.email}
                                        </p>
                                        <div>
                                            <Link to="/my-appointments" className="btn btn-primary me-2">
                                                View My Appointments
                                            </Link>
                                            <Link to="/listing" className="btn btn-outline-secondary">
                                                Browse Businesses
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="page-content bg-white">
                {/* Page Banner */}
                <div className="dez-bnr-inr overlay-black-middle" style={{ backgroundColor: '#2c3e50' }}>
                    <div className="container">
                        <div className="dez-bnr-inr-entry">
                            <h1 className="text-white">Book Appointment</h1>
                            <p className="text-white-50">{businessName}</p>
                            <nav aria-label="breadcrumb" className="breadcrumb-row">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item"><Link to="/listing">Listings</Link></li>
                                    <li className="breadcrumb-item active">Book</li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="container py-5">
                    {/* Progress Steps */}
                    <div className="row mb-5">
                        <div className="col-12">
                            <div className="d-flex justify-content-center">
                                <div className={`text-center px-4 ${step >= 1 ? 'text-primary' : 'text-muted'}`}>
                                    <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${step >= 1 ? 'bg-primary text-white' : 'bg-light'}`} style={{ width: '40px', height: '40px' }}>
                                        1
                                    </div>
                                    <p className="small mt-2 mb-0">Select Service</p>
                                </div>
                                <div className="border-top mt-3" style={{ width: '50px' }}></div>
                                <div className={`text-center px-4 ${step >= 2 ? 'text-primary' : 'text-muted'}`}>
                                    <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${step >= 2 ? 'bg-primary text-white' : 'bg-light'}`} style={{ width: '40px', height: '40px' }}>
                                        2
                                    </div>
                                    <p className="small mt-2 mb-0">Date & Time</p>
                                </div>
                                <div className="border-top mt-3" style={{ width: '50px' }}></div>
                                <div className={`text-center px-4 ${step >= 3 ? 'text-primary' : 'text-muted'}`}>
                                    <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${step >= 3 ? 'bg-primary text-white' : 'bg-light'}`} style={{ width: '40px', height: '40px' }}>
                                        3
                                    </div>
                                    <p className="small mt-2 mb-0">Your Details</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            {/* Step 1: Select Service */}
                            {step === 1 && (
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="mb-0">Select a Service</h5>
                                    </div>
                                    <div className="card-body">
                                        {services.length === 0 ? (
                                            <div className="text-center py-4">
                                                <p className="text-muted">No services available for booking.</p>
                                                <p className="small text-muted">
                                                    This business hasn't set up online booking yet.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="row">
                                                {services.filter(s => s.isActive).map(service => (
                                                    <div key={service.id} className="col-md-6 mb-3">
                                                        <div
                                                            className={`card h-100 cursor-pointer ${selectedService?.id === service.id ? 'border-primary' : ''}`}
                                                            onClick={() => handleServiceSelect(service)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <div className="card-body">
                                                                <h6 className="card-title">{service.name}</h6>
                                                                <p className="card-text small text-muted">
                                                                    {service.description}
                                                                </p>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <span className="badge bg-light text-dark">
                                                                        {service.duration} min
                                                                    </span>
                                                                    <strong className="text-primary">${service.price}</strong>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Demo services if none exist */}
                                        {services.length === 0 && (
                                            <div className="mt-4">
                                                <p className="text-muted small">Demo services for preview:</p>
                                                <div className="row">
                                                    {[
                                                        { id: 'demo1', name: 'Consultation', description: 'Initial consultation session', duration: 30, price: 50 },
                                                        { id: 'demo2', name: 'Standard Service', description: 'Our most popular service', duration: 60, price: 100 },
                                                        { id: 'demo3', name: 'Premium Service', description: 'Full premium experience', duration: 90, price: 150 }
                                                    ].map(service => (
                                                        <div key={service.id} className="col-md-6 mb-3">
                                                            <div
                                                                className={`card h-100 ${selectedService?.id === service.id ? 'border-primary' : ''}`}
                                                                onClick={() => handleServiceSelect(service)}
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                <div className="card-body">
                                                                    <h6 className="card-title">{service.name}</h6>
                                                                    <p className="card-text small text-muted">{service.description}</p>
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <span className="badge bg-light text-dark">{service.duration} min</span>
                                                                        <strong className="text-primary">${service.price}</strong>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Date & Time */}
                            {step === 2 && (
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">Select Date & Time</h5>
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setStep(1)}>
                                            Back
                                        </button>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            {/* Date Selection */}
                                            <div className="col-md-6 mb-4">
                                                <h6>Select Date</h6>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={selectedDate}
                                                    onChange={(e) => handleDateSelect(e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>

                                            {/* Time Selection */}
                                            <div className="col-md-6 mb-4">
                                                <h6>Select Time</h6>
                                                {!selectedDate ? (
                                                    <p className="text-muted small">Please select a date first</p>
                                                ) : (
                                                    <div className="row g-2">
                                                        {availableSlots.map(time => (
                                                            <div key={time} className="col-4">
                                                                <button
                                                                    className={`btn w-100 ${selectedTime === time ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                                    onClick={() => handleTimeSelect(time)}
                                                                >
                                                                    {time}
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Selected Service Summary */}
                                        <div className="bg-light p-3 rounded mt-3">
                                            <h6>Selected Service</h6>
                                            <p className="mb-1"><strong>{selectedService?.name}</strong></p>
                                            <p className="mb-0 small text-muted">
                                                {selectedService?.duration} minutes | ${selectedService?.price}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Contact Details */}
                            {step === 3 && (
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">Your Details</h5>
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setStep(2)}>
                                            Back
                                        </button>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label className="form-label">Full Name *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Email *</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Phone Number *</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="form-label">Additional Notes</label>
                                                <textarea
                                                    className="form-control"
                                                    name="notes"
                                                    rows="3"
                                                    value={formData.notes}
                                                    onChange={handleInputChange}
                                                    placeholder="Any special requests or information..."
                                                />
                                            </div>

                                            {/* Booking Summary */}
                                            <div className="bg-light p-3 rounded mb-4">
                                                <h6>Booking Summary</h6>
                                                <div className="row">
                                                    <div className="col-6">
                                                        <p className="mb-1 small text-muted">Service</p>
                                                        <p className="mb-0"><strong>{selectedService?.name}</strong></p>
                                                    </div>
                                                    <div className="col-6">
                                                        <p className="mb-1 small text-muted">Price</p>
                                                        <p className="mb-0"><strong>${selectedService?.price}</strong></p>
                                                    </div>
                                                    <div className="col-6 mt-2">
                                                        <p className="mb-1 small text-muted">Date</p>
                                                        <p className="mb-0"><strong>{formatDate(selectedDate)}</strong></p>
                                                    </div>
                                                    <div className="col-6 mt-2">
                                                        <p className="mb-1 small text-muted">Time</p>
                                                        <p className="mb-0"><strong>{selectedTime}</strong></p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button type="submit" className="btn btn-primary btn-lg w-100">
                                                Confirm Booking
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
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
    loadBusinessServices,
    createAppointment,
    getAvailableSlots
};

export default connect(mapStateToProps, mapDispatchToProps)(BookAppointment);
