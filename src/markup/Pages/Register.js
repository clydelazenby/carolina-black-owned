import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import api from '../../api';
import { withRouter } from 'react-router-dom';
import bnr from './../../images/background/bg7.jpg';

function Register(props) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    address: '',
    city_town: '',
    username: '',
    agreed_to_terms: false,
    agreed_to_privacy_policy: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = async (e) => {
	e.preventDefault();
	try {
	  const response = await api.post('http://localhost:8000/api/auth/signup/', formData);
	  if (response.status === 201) {
		console.log('User registered successfully');
		// Check if the backend sent a redirect instruction
		if (response.data.redirect === 'homepage') {
		  // Redirect to homepage or whatever route you have for it
		  props.history.push('/');
		}
	  } else {
		console.error('Registration failed');
	  }
	} catch (error) {
	  if (error.response) {
		setErrors(error.response.data);
	  } else {
		console.error('Error:', error.message);
	  }
	}
  };

  return (
    <div>
      <div className="page-wraper">
        <div
          className="page-content dlab-login"
          style={{
            backgroundImage: "url(" + bnr + ")",
            backgroundBlendMode: 'screen',
          }}
        >
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-4 login-form-box">
                <div className="login-form">
                  <div className="logo">
                    <Link to={'./'}>
                      <img
                        src={require('./../../images/logo-black.png')}
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className="tab-content nav">
                    <div className="">
                      {props.errorMessage && (
                        <div className="">
                          {props.errorMessage}
                        </div>
                      )}
                      {props.successMessage && (
                        <div className="">
                          {props.successMessage}
                        </div>
                      )}
                      <form className="dlab-form" onSubmit={handleSubmit}>
                        <h3 className="form-title m-t0">
                          Create an account! It's free and always will be.
                        </h3>
                        <div className="form-group text-center">
                          <Link to="#" className="site-button facebook">
                            <i className="fa fa-facebook-official m-r10"></i>{' '}
                            Log in with Facebook
                          </Link>
                        </div>
                        <div className="form-group">
                          <input
                            name="first_name"
                            required=""
                            value={formData.first_name}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="First Name"
                            type="text"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            name="last_name"
                            required=""
                            value={formData.last_name}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Last Name"
                            type="text"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="hello@example.com"
                          />
                          <div className="text-danger">
                            {errors.email && <div>{errors.email}</div>}
                          </div>
                        </div>
                        <div className="form-group">
                          <input
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Password"
                            type="password"
                          />
                          <div className="text-danger">
                            {errors.password && <div>{errors.password}</div>}
                          </div>
                        </div>
                        <div className="form-group">
                          <input
                            name="address"
                            required=""
                            value={formData.address}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Address"
                            type="text"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            name="city_town"
                            required=""
                            value={formData.city_town}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="City/Town"
                            type="text"
                          />
                        </div>
                        <h6 className="text-inherit m-b10">
                          Enter your account details below:
                        </h6>
                        <div className="form-group">
                          <input
                            name="username"
                            required=""
                            value={formData.username}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="User Name"
                            type="text"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            name="retype_password"
                            value={formData.retype_password}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Re-type Your Password"
                            type="password"
                          />
                          <div className="text-danger">
                            {errors.retype_password && <div>{errors.retype_password}</div>}
                          </div>
                        </div>
                        <div className="form-group">
                          <input
                            type="checkbox"
                            id="privacy-policy"
                            name="agreed_to_privacy_policy"
                            checked={formData.agreed_to_privacy_policy}
                            onChange={handleCheckboxChange}
                            required=""
                          />
                          <label htmlFor="privacy-policy">
                            I agree to the{' '}
                            <Link to="#" className="btn-link">
                              Terms of Service
                            </Link>{' '}
                            &{' '}
                            <Link to="#" className="btn-link">
                              Privacy Policy
                            </Link>
                          </label>
                        </div>
                        <div className="form-group">
                          <button className="site-button button-md btn-block">
                            Submit
                          </button>
                        </div>
                        <div className="form-group">
                          <p className="info-bottom">
                            <Link to="login" className="btn-link">
                              Login with username and password?
                            </Link>
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="content-info">
                  <ul className="list-info">
                    <li>
                      <div className="dlab-box">
                        <i className="fa fa-bullhorn"></i>
                        <p>
                          Get personalized advice from the friends and travel
                          experts you trust
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="dlab-box">
                        <i className="fa fa-car"></i>
                        <p>
                          Easily find hotels, things to do & restaurants that
                          are right for you
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="dlab-box">
                        <i className="fa fa-suitcase"></i>
                        <p>
                          It's everything you need to know and go better.
                          Everytime.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(
	connect((state) => ({
	  errorMessage: state.auth.errorMessage,
	  successMessage: state.auth.successMessage,
	  showLoading: state.auth.showLoading,
	}))(Register)
  );