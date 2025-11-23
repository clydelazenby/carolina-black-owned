import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, useLocation, useHistory } from 'react-router-dom';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import { claimBusiness } from '../../store/actions/DashboardActions';

const ClaimBusiness = ({ auth, claimBusiness }) => {
    const location = useLocation();
    const history = useHistory();
    const queryParams = new URLSearchParams(location.search);
    const businessId = queryParams.get('businessId');
    const businessName = queryParams.get('businessName') || '';

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        businessId: businessId || '',
        businessName: businessName,
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        role: '',
        verificationMethod: '',
        documentType: '',
        additionalInfo: '',
        agreeToTerms: false
    });
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.agreeToTerms) {
            alert('Please agree to the terms and conditions');
            return;
        }

        const result = await claimBusiness(formData.businessId || `claim_${Date.now()}`, {
            ...formData,
            userId: auth.auth?.localId,
            businessData: {
                name: formData.businessName
            }
        });

        if (result.success) {
            setSubmitted(true);
        }
    };

    if (submitted) {
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
                                            <i className="fa fa-clock text-warning" style={{ fontSize: '4rem' }}></i>
                                        </div>
                                        <h2 className="mb-3">Claim Submitted!</h2>
                                        <p className="text-muted mb-4">
                                            Your business claim has been submitted for review.
                                            We'll verify your information and get back to you within 2-3 business days.
                                        </p>
                                        <div className="bg-light p-4 rounded mb-4">
                                            <h5>What happens next?</h5>
                                            <ul className="text-start mb-0">
                                                <li>Our team will review your claim</li>
                                                <li>We may contact you for additional verification</li>
                                                <li>You'll receive an email once approved</li>
                                                <li>Once approved, you can manage your listing</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <Link to="/dashboard" className="btn btn-primary me-2">
                                                Go to Dashboard
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
                            <h1 className="text-white">Claim Your Business</h1>
                            <p className="text-white-50">Verify ownership and take control of your listing</p>
                            <nav aria-label="breadcrumb" className="breadcrumb-row">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item active">Claim Business</li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            {/* Benefits Section */}
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">Why Claim Your Business?</h5>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <ul className="list-unstyled">
                                                <li className="mb-2">
                                                    <i className="fa fa-check text-success me-2"></i>
                                                    Update business information
                                                </li>
                                                <li className="mb-2">
                                                    <i className="fa fa-check text-success me-2"></i>
                                                    Respond to customer reviews
                                                </li>
                                                <li className="mb-2">
                                                    <i className="fa fa-check text-success me-2"></i>
                                                    Add photos and videos
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="col-md-6">
                                            <ul className="list-unstyled">
                                                <li className="mb-2">
                                                    <i className="fa fa-check text-success me-2"></i>
                                                    View analytics and insights
                                                </li>
                                                <li className="mb-2">
                                                    <i className="fa fa-check text-success me-2"></i>
                                                    Get verified badge
                                                </li>
                                                <li className="mb-2">
                                                    <i className="fa fa-check text-success me-2"></i>
                                                    Enable online booking
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Claim Form */}
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">Business Claim Form</h5>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        {/* Step 1: Business Information */}
                                        <h6 className="text-primary mb-3">Business Information</h6>

                                        <div className="row mb-3">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Business Name *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="businessName"
                                                    value={formData.businessName}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="Enter business name"
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Business ID (if known)</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="businessId"
                                                    value={formData.businessId}
                                                    onChange={handleInputChange}
                                                    placeholder="Optional"
                                                />
                                            </div>
                                        </div>

                                        <hr className="my-4" />

                                        {/* Step 2: Contact Information */}
                                        <h6 className="text-primary mb-3">Your Contact Information</h6>

                                        <div className="row mb-3">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Your Full Name *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="contactName"
                                                    value={formData.contactName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Your Role *</label>
                                                <select
                                                    className="form-select"
                                                    name="role"
                                                    value={formData.role}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option value="">Select your role</option>
                                                    <option value="owner">Owner</option>
                                                    <option value="manager">Manager</option>
                                                    <option value="employee">Authorized Employee</option>
                                                    <option value="representative">Official Representative</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Email Address *</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="contactEmail"
                                                    value={formData.contactEmail}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                                <small className="text-muted">
                                                    Preferably a business email address
                                                </small>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Phone Number *</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    name="contactPhone"
                                                    value={formData.contactPhone}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <hr className="my-4" />

                                        {/* Step 3: Verification */}
                                        <h6 className="text-primary mb-3">Verification</h6>

                                        <div className="mb-3">
                                            <label className="form-label">Preferred Verification Method *</label>
                                            <select
                                                className="form-select"
                                                name="verificationMethod"
                                                value={formData.verificationMethod}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select verification method</option>
                                                <option value="phone">Phone Call Verification</option>
                                                <option value="email">Business Email Verification</option>
                                                <option value="document">Document Upload</option>
                                                <option value="mail">Mail Verification (Postcard)</option>
                                            </select>
                                        </div>

                                        {formData.verificationMethod === 'document' && (
                                            <div className="mb-3">
                                                <label className="form-label">Document Type</label>
                                                <select
                                                    className="form-select"
                                                    name="documentType"
                                                    value={formData.documentType}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">Select document type</option>
                                                    <option value="license">Business License</option>
                                                    <option value="tax">Tax Document</option>
                                                    <option value="utility">Utility Bill</option>
                                                    <option value="registration">Business Registration</option>
                                                </select>
                                                <div className="mt-2">
                                                    <input type="file" className="form-control" />
                                                    <small className="text-muted">
                                                        Upload a document proving your association with the business
                                                    </small>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mb-4">
                                            <label className="form-label">Additional Information</label>
                                            <textarea
                                                className="form-control"
                                                name="additionalInfo"
                                                rows="3"
                                                value={formData.additionalInfo}
                                                onChange={handleInputChange}
                                                placeholder="Any additional information to help verify your claim..."
                                            />
                                        </div>

                                        <hr className="my-4" />

                                        {/* Terms & Submit */}
                                        <div className="mb-4">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="agreeTerms"
                                                    name="agreeToTerms"
                                                    checked={formData.agreeToTerms}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                                <label className="form-check-label" htmlFor="agreeTerms">
                                                    I confirm that I am authorized to claim this business and agree to the
                                                    <Link to="/terms" className="ms-1">Terms of Service</Link> and
                                                    <Link to="/privacy" className="ms-1">Privacy Policy</Link>.
                                                </label>
                                            </div>
                                        </div>

                                        <button type="submit" className="btn btn-primary btn-lg w-100">
                                            Submit Claim
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* FAQ */}
                            <div className="card mt-4">
                                <div className="card-header">
                                    <h5 className="mb-0">Frequently Asked Questions</h5>
                                </div>
                                <div className="card-body">
                                    <div className="accordion" id="claimFAQ">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header">
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                                                    How long does verification take?
                                                </button>
                                            </h2>
                                            <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#claimFAQ">
                                                <div className="accordion-body">
                                                    Typically 2-3 business days. Phone and email verification may be faster.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header">
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                                                    What if the business is already claimed?
                                                </button>
                                            </h2>
                                            <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#claimFAQ">
                                                <div className="accordion-body">
                                                    Contact our support team and we'll help resolve ownership disputes.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header">
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                                                    Is there a cost to claim a business?
                                                </button>
                                            </h2>
                                            <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#claimFAQ">
                                                <div className="accordion-body">
                                                    No, claiming your business is completely free.
                                                </div>
                                            </div>
                                        </div>
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
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

const mapDispatchToProps = {
    claimBusiness
};

export default connect(mapStateToProps, mapDispatchToProps)(ClaimBusiness);
