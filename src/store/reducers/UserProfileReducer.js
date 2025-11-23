import {
    PROFILE_LOADING,
    PROFILE_LOADED,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    SET_ACTIVITY_HISTORY,
    ADD_BADGE,
    SET_BADGES
} from '../actions/UserProfileActions';

const initialState = {
    profile: {
        userId: null,
        displayName: '',
        email: '',
        avatar: null,
        bio: '',
        location: '',
        website: '',
        socialLinks: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: ''
        },
        preferences: {
            emailNotifications: true,
            pushNotifications: false,
            newsletterSubscribed: false
        },
        isBusinessOwner: false,
        createdAt: null,
        updatedAt: null
    },
    activityHistory: [],
    badges: [],
    loading: false,
    error: null
};

const UserProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case PROFILE_LOADING:
            return {
                ...state,
                loading: true,
                error: null
            };

        case PROFILE_LOADED:
            return {
                ...state,
                loading: false,
                profile: action.payload.profile,
                activityHistory: action.payload.activityHistory,
                badges: action.payload.badges
            };

        case PROFILE_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case UPDATE_PROFILE:
            return {
                ...state,
                profile: action.payload
            };

        case SET_ACTIVITY_HISTORY:
            return {
                ...state,
                activityHistory: action.payload
            };

        case ADD_BADGE:
            return {
                ...state,
                badges: [...state.badges, action.payload]
            };

        case SET_BADGES:
            return {
                ...state,
                badges: action.payload
            };

        default:
            return state;
    }
};

export default UserProfileReducer;
