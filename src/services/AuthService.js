import axios from 'axios';
import swal from 'sweetalert';
import {
    loginConfirmedAction,
    logout,
} from '../store/actions/AuthActions';

export function signUp(email, password) {
    const postData = {
        email,
        password,
    };
    return axios.post(
        `http://localhost:8000/api/signup/`,
        postData,
    );
}

export function login(email, password) {
    const postData = {
        email,
        password,
    };
    return axios.post(
        `http://localhost:8000/api/login/`,
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

