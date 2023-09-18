import React,{Component} from 'react';
import {Link} from 'react-router-dom';


const cityBlog = [
	{
		image: require('./../../images/destinations/charlotte.jpg'),
		title: 'Charlotte',
	},
	{
		image: require('./../../images/destinations/raleigh-night.jpeg'),
		title: 'Raleigh-Durham',
	},
	{
		image: require('./../../images/destinations/myrtle-beach.jpeg'),
		title: 'Myrtle Beach',
	},
	{
		image: require('./../../images/destinations/charelston.jpeg'),
		title: 'Charleston',
	},

];



class popCity extends Component{
	
	render(){

		return(
					
			<div className="row">
				{cityBlog.map((item,index) => (
					<div className="col-lg-3 col-md-6 col-sm-6" key={index}>
					
						<div className="featured-bx m-b30">
							<div className="featured-media">
								<img src={item.image} alt=""/>
							</div>	
							<div className="featured-info">
								<ul className="featured-star">
									<li><i className="fa fa-star"></i></li>
									<li><i className="fa fa-star"></i></li>
									<li><i className="fa fa-star"></i></li>
									<li><i className="fa fa-star"></i></li>
									<li><i className="fa fa-star"></i></li>
								</ul>
								<h5 className="title"><Link to={"/listing-details"}>{item.title}</Link></h5>
								<ul className="featured-category">
									<li><i className="fa fa-moon-o"></i> 12 Cities</li>
									<li><i className="fa fa-map-o"></i> 30+ Listing</li>
								</ul>
							</div>
						</div>
					
					</div>
				))}
			</div>
					
		)
	}
}

export default popCity;