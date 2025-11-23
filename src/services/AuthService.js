/**
 * Authentication Service
 * Handles user authentication, token management, and session persistence
 */

import axios from 'axios';
import swal from 'sweetalert';
import {
    loginConfirmedAction,
    logout,
} from '../store/actions/AuthActions';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

export function signUp(email, password) {
    const postData = {
        email,
        password,
    };
    return axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.auth.signup}`,
        postData,
    );
}

export function login(email, password) {
    const postData = {
        email,
        password,
    };
    return axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.auth.login}`,
        postData,
    );
}

export function formatError(errorResponse) {
    switch (errorResponse.data.status) {
        case 'email_exists':
            swal("Oops", "Email already exists", "error");
            break;
        case 'email_not_found':
            swal("Oops", "Email not found", "error",{ button: "Try Again!",});
            break;
        case 'invalid_password':
            swal("Oops", "Invalid Password", "error",{ button: "Try Again!",});
            break;
        case 'user_disabled':
            swal("Oops", "User Disabled", "error");
            break;
        default:
            return '';
    }
}

export function saveTokenInLocalStorage(tokenDetails) {
    tokenDetails.expireDate = new Date(
        new Date().getTime() + tokenDetails.expiresIn * 1000,
    );
    localStorage.setItem('userDetails', JSON.stringify(tokenDetails));
}

export function runLogoutTimer(dispatch, timer, history) {
    setTimeout(() => {
        dispatch(logout(history));
    }, timer);
}

export function checkAutoLogin(dispatch, history) {
    // ... (This part remains mostly the same)
}

