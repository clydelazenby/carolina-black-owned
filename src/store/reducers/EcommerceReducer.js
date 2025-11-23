import {
    SET_BUSINESS_SERVICES,
    ADD_SERVICE,
    UPDATE_SERVICE,
    DELETE_SERVICE,
    SET_APPOINTMENTS,
    CREATE_APPOINTMENT,
    UPDATE_APPOINTMENT,
    CANCEL_APPOINTMENT,
    SET_ORDERS,
    CREATE_ORDER,
    UPDATE_ORDER_STATUS,
    SET_CART,
    ADD_TO_CART,
    REMOVE_FROM_CART,
    CLEAR_CART,
    SET_BUSINESS_HOURS,
    ECOMMERCE_LOADING,
    ECOMMERCE_ERROR
} from '../actions/EcommerceActions';

const initialState = {
    services: {},
    appointments: [],
    orders: [],
    cart: [],
    businessHours: {},
    loading: false,
    error: null
};

const EcommerceReducer = (state = initialState, action) => {
    switch (action.type) {
        case ECOMMERCE_LOADING:
            return {
                ...state,
                loading: true,
                error: null
            };

        case ECOMMERCE_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case SET_BUSINESS_SERVICES:
            return {
                ...state,
                loading: false,
                services: {
                    ...state.services,
                    [action.payload.businessId]: action.payload.services
                }
            };

        case ADD_SERVICE:
            const businessServices = state.services[action.payload.businessId] || [];
            return {
                ...state,
                services: {
                    ...state.services,
                    [action.payload.businessId]: [...businessServices, action.payload]
                }
            };

        case UPDATE_SERVICE:
            return {
                ...state,
                services: {
                    ...state.services,
                    [action.payload.businessId]: (state.services[action.payload.businessId] || [])
                        .map(s => s.id === action.payload.id ? action.payload : s)
                }
            };

        case DELETE_SERVICE:
            return {
                ...state,
                services: Object.fromEntries(
                    Object.entries(state.services).map(([bizId, services]) => [
                        bizId,
                        services.filter(s => s.id !== action.payload)
                    ])
                )
            };

        case SET_APPOINTMENTS:
            return {
                ...state,
                appointments: action.payload
            };

        case CREATE_APPOINTMENT:
            return {
                ...state,
                appointments: [...state.appointments, action.payload]
            };

        case UPDATE_APPOINTMENT:
            return {
                ...state,
                appointments: state.appointments.map(a =>
                    a.id === action.payload.id ? action.payload : a
                )
            };

        case CANCEL_APPOINTMENT:
            return {
                ...state,
                appointments: state.appointments.map(a =>
                    a.id === action.payload
                        ? { ...a, status: 'cancelled' }
                        : a
                )
            };

        case SET_ORDERS:
            return {
                ...state,
                orders: action.payload
            };

        case CREATE_ORDER:
            return {
                ...state,
                orders: [action.payload, ...state.orders]
            };

        case UPDATE_ORDER_STATUS:
            return {
                ...state,
                orders: state.orders.map(o =>
                    o.id === action.payload.orderId
                        ? { ...o, status: action.payload.status }
                        : o
                )
            };

        case SET_CART:
            return {
                ...state,
                cart: action.payload
            };

        case ADD_TO_CART:
            const existingItem = state.cart.find(i => i.id === action.payload.id);
            if (existingItem) {
                return {
                    ...state,
                    cart: state.cart.map(i =>
                        i.id === action.payload.id
                            ? { ...i, quantity: (i.quantity || 1) + 1 }
                            : i
                    )
                };
            }
            return {
                ...state,
                cart: [...state.cart, { ...action.payload, quantity: 1 }]
            };

        case REMOVE_FROM_CART:
            return {
                ...state,
                cart: state.cart.filter(i => i.id !== action.payload)
            };

        case CLEAR_CART:
            return {
                ...state,
                cart: []
            };

        case SET_BUSINESS_HOURS:
            return {
                ...state,
                businessHours: {
                    ...state.businessHours,
                    [action.payload.businessId]: action.payload.hours
                }
            };

        default:
            return state;
    }
};

export default EcommerceReducer;
