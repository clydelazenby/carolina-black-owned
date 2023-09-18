import React, { Component } from 'react';
import axios from 'axios';

import Header from './../Layout/Header';
import Footer from './../Layout/Footer';
import { Link } from 'react-router-dom';
import popCity from './../Element/popCity';
import Topplacesowl from './../Element/Topplacesowl';
import Userowl from './../Element/Userowl';
import Tabcontent from './../Element/Tabcontent';

import bnr from './../../images/main-slider/header-background.jpg';
import img1 from './../../images/background/1bg7.jpg';

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            homepageData: null,
        };
    }

    componentDidMount() {
        // Fetch homepage data from the Django backend
        axios.get('/api/homepage/')  // Adjust the URL based on your project setup
            .then(response => {
                this.setState({ homepageData: response.data });
            })
            .catch(error => {
                console.error('Error fetching homepage data:', error);
            });
    }

    render() {
        const { homepageData } = this.state;

        return (
            <div className="page-wraper">
                <Header />

                <div className="page-content bg-white">
                    <div className="dlab-bnr-inr dlab-bnr-inr-md" style={{ backgroundImage: `url(${bnr})`, backgroundSize: 'cover' }}>
                        <div className="container">
                            <div className="dlab-bnr-inr-entry align-m dlab-home">
                                <div className="bnr-content">
                                    {homepageData && <h2><strong>{homepageData.title}</strong></h2>}
                                </div>

                                <div className="dlab-tabs search-filter">
                                    <Tabcontent />
                                </div>

                                <div className="category-bx">
                                    <Link to="./listing-left-sidebar" className="category">
                                        <i className="flaticon-cart-of-ecommerce"></i>
                                        <p>carts</p>
                                    </Link>
                                    <Link to="/listing-left-sidebar" className="category">
                                        <i className="flaticon-carrot"></i>
                                        <p>foods</p>
                                    </Link>
                                    <Link to="/listing-left-sidebar" className="category">
                                        <i className="flaticon-hockey"></i>
                                        <p>candy</p>
                                    </Link>
                                    <Link to="/listing-left-sidebar" className="category">
                                        <i className="flaticon-pill-capsule"></i>
                                        <p>medicine</p>
                                    </Link>
                                    <Link to="/listing-left-sidebar" className="category">
                                        <i className="flaticon-birthday-cake"></i>
                                        <p>cake</p>
                                    </Link>
                                    <Link to="/listing-left-sidebar" className="category">
                                        <i className="flaticon-place"></i>
                                        <p>place</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content-block">
                        <div className="section-full bg-white content-inner">
                            <div className="container">
                                <div className="section-head text-black text-center">
                                    <h2 className="box-title">Popular Cities</h2>
                                    <div className="dlab-separator bg-primary"></div>
                                    {homepageData && <p>{homepageData.description}</p>}
                                </div>

                                <popCity />
                            </div>
                        </div>

                        <Topplacesowl />

                        <div className="section-full bg-img-fix most-visited content-inner overlay-primary-dark" style={{ backgroundImage: `url(${img1})` }}>
                            <div className="container">
                                <div className="section-head text-white text-center">
                                    <h2 className="box-title">How It Works?</h2>
                                    <div className="dlab-separator bg-white"></div>
                                    <p>Navigating our directory to find and support Black-owned businesses in cities like Charlotte, Raleigh, Myrtle Beach, and Charleston has never been easier. Here's a step-by-step guide to make the most of your experience:</p>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4 col-md-4">
                                        <div className="icon-bx-wraper sr-box center box1 m-b30">
                                            <div className="icon-bx-lg radius bg-white m-b20"><Link to="#"><i className="ti-search"></i></Link></div>
                                            <div className="icon-content">
                                                <h3 className="dlab-tilte">Choose What To Do?</h3>
                                                <p>Decide what you're looking for, whether it's dining, shopping, or professional services, and browse through our categorized listings.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4">
                                        <div className="icon-bx-wraper sr-box center m-b30">
                                            <div className="icon-bx-lg radius bg-white m-b20"><Link to="#"><i className="ti-gift"></i></Link></div>
                                            <div className="icon-content">
                                                <h3 className="dlab-tilte">Find What You Want?</h3>
                                                <p>Use our advanced search and filters to narrow down your options and find businesses that meet your specific needs.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4">
                                        <div className="icon-bx-wraper sr-box center box1 m-b30">
                                            <div className="icon-bx-lg radius bg-white m-b20"><Link to="#"><i className="ti-rocket"></i></Link></div>
                                            <div className="icon-content">
                                                <h3 className="dlab-tilte">Explore Amazing Places</h3>
                                                <p>Visit individual business profiles to find essential details like operating hours and customer reviews, making it easy for you to connect or visit.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="section-full content-inner bg-gray">
                            <div className="container">
                                <div className="section-head text-center">
                                    <h2 className="box-title">What Our Users Say</h2>
                                    <div className="dlab-separator bg-primary"></div>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.</p>
                                </div>
                                <div className="container">
                                    <Userowl />
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

export default Homepage;
