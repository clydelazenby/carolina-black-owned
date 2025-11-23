import React from 'react';
import {Link} from 'react-router-dom';
import Header from './../Layout/Header';
import Footer from './../Layout/Footer';
import GoogleMaps from "simple-react-google-maps";
import ReviewList from './../Element/ReviewList';
import ReviewForm from './../Element/ReviewForm';
import ShareButtons from './../Element/ShareButtons';
import FavoriteButton from './../Element/FavoriteButton';
import StarRating from './../Element/StarRating';

var bnr = require('./../../images/banner/bnr1.jpg');

// Sample business data (would come from API in production)
const businessData = {
	id: 1,
	name: "Wonder O'bell",
	tagline: "Winter is gone very soon",
	description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
	category: "Restaurant",
	price: "$50",
	address: "3858 Marion Street, VT 05661",
	phone: "+909 987 978 6",
	email: "info@webmail.com",
	website: "webexample.com",
	image: require('./../../images/listing/default/thum1.jpg'),
	rating: 4.5,
	latitude: 35.2271,
	longitude: -80.8431,
};

const Listingdetail = () => {
	return(
		<div className="page-wraper">

			<Header />

			<div className="page-content bg-white">

				<div className="dlab-bnr-inr dlab-bnr-inr-sm overlay-black-middle" style={{backgroundImage:"url( " + bnr + " )"}}>
					<div className="container">
						<div className="dlab-bnr-inr-entry">
							<div className="wonder-bx text-white">
								<div className="wonder-theme">wo.</div>
								<div className="wonder-title">
									<h2>{businessData.name} <i className="fa font-20 align-self-center fa-check-circle"></i></h2>
									<p>{businessData.tagline}</p>
									<StarRating rating={businessData.rating} size="md" showValue={true} />
								</div>
								<div className="wonder-price">
									<p>Price range</p>
									<h3 className="m-b0">{businessData.price}</h3>
								</div>
								<div className="wonder-btn">
									<FavoriteButton business={businessData} size="lg" showText={true} />
									<Link to={""} className="site-button button-lg radius-no text-uppercase ml-2">call now</Link>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="section-full content-inner">
					<div className="container">
						<div className="dlab-post-media m-b50">
							<Link to={"#"}><img src={businessData.image} alt={businessData.name} /></Link>
						</div>
						<div className="row">

							<div className="col-xl-8 col-lg-7 col-md-12 p-b30">
								<div className="section-head text-black mb-3">
									<h2 className="box-title">About this Business</h2>
									<p className="m-b0">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco  laboris nisi ut aliquip ex ea commodo amet set for your cool happiness for lyour loyal city.</p>
								</div>
								<div className="dlab-divider bg-gray-dark"></div>
								<div className="widget widget_getintuch widget_listing">
									<ul>
										<li>
											<i className="fa fa-map-marker text-primary"></i>
											<p className="m-b0">{businessData.address}</p>
										</li>
										<li>
											<i className="fa fa-phone text-primary"></i>
											<p className="m-b0">{businessData.phone}</p>
										</li>
										<li>
											<i className="fa fa-envelope text-primary"></i>
											<p className="m-b0">{businessData.email}</p>
											<p className="m-b0">{businessData.website}</p>
										</li>
										<li className="align-self-center">
											<button className="site-button text-uppercase radius-xl">Report</button>
										</li>
									</ul>
								</div>
								<div className="dlab-divider bg-gray-dark"></div>
								<p className="m-b15 font-weight-300">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
								<p className="font-weight-300">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
								<div className="clearfix m-b50">
									<img className="alignleft" src={require("./../../images/listing/grid/pic1.jpg")} alt="" />
									<p className="font-weight-300">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
								</div>
								<h3 className="font-26">Core Features</h3>
								<div className="dlab-post-tags clear m-b50">
									<div className="post-tags">
										<Link to={""}>wifi </Link>
										<Link to={""}>parking </Link>
										<Link to={""}>tv </Link>
										<Link to={""}>take-out </Link>
										<Link to={""}>balcony </Link>
									</div>
								</div>
								<div className="dlab-divider bg-gray-dark"></div>

								{/* Reviews Section */}
								<div className="clear" id="comment-list">
									<div className="comments-area" id="comments">
										<ReviewList businessId={businessData.id} />

										<div className="dlab-divider bg-gray-dark m-t30"></div>

										<ReviewForm businessId={businessData.id} />
									</div>
								</div>

							</div>

							<div className="col-xl-4 col-lg-5 col-md-12 sticky-top p-b30">
								<aside className="side-bar listing-side-bar">
									{/* Favorite Button (Mobile) */}
									<div className="widget widget_favorite d-lg-none">
										<FavoriteButton business={businessData} size="lg" showText={true} />
									</div>

									<div className="widget widget_map">
										<div className="m-b30 align-self-stretch">
											<GoogleMaps
												apiKey={"AIzaSyDrAU41UTBlcEDNJgEtdlFLZeUBNBuHhzM"}
												style={{ height: "400px", width: "100%" }}
												zoom={12}
												center={{ lat: businessData.latitude, lng: businessData.longitude }}
												markers={{ lat: businessData.latitude, lng: businessData.longitude }}
											/>
										</div>
										<Link to={""} className="site-button button-lg radius-xl m-b30 text-uppercase">get directions</Link>
									</div>
									<div className="widget widget_time">
										<h4 className="m-b10">Opening Hours</h4>
										<div className="dlab-separator bg-primary m-b20"></div>
										<ul className="m-b0">
											<li><span>Monday</span> 08:00am - 11:00pm</li>
											<li><span>Tuesday</span> 08:00am - 11:00pm</li>
											<li><span>Wednesday</span> 12:00am - 11:00pm</li>
											<li><span>Thursday</span> 08:00am - 11:00pm</li>
											<li><span>Friday</span> 03:00pm - 02:00am</li>
											<li><span>Saturday</span> 03:00pm - 02:00am</li>
											<li><span>Sunday</span> Closed</li>
										</ul>
									</div>

									{/* Share Buttons */}
									<div className="widget widget_share">
										<ShareButtons
											title={businessData.name}
											description={businessData.description}
											layout="vertical"
										/>
									</div>
								</aside>
							</div>

						</div>
					</div>


				</div>
			</div>

			<Footer />

		</div>
	)
}

export default Listingdetail;
