// E-commerce Action Types
export const SET_BUSINESS_SERVICES = 'SET_BUSINESS_SERVICES';
export const ADD_SERVICE = 'ADD_SERVICE';
export const UPDATE_SERVICE = 'UPDATE_SERVICE';
export const DELETE_SERVICE = 'DELETE_SERVICE';
export const SET_APPOINTMENTS = 'SET_APPOINTMENTS';
export const CREATE_APPOINTMENT = 'CREATE_APPOINTMENT';
export const UPDATE_APPOINTMENT = 'UPDATE_APPOINTMENT';
export const CANCEL_APPOINTMENT = 'CANCEL_APPOINTMENT';
export const SET_ORDERS = 'SET_ORDERS';
export const CREATE_ORDER = 'CREATE_ORDER';
export const UPDATE_ORDER_STATUS = 'UPDATE_ORDER_STATUS';
export const SET_CART = 'SET_CART';
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const CLEAR_CART = 'CLEAR_CART';
export const SET_BUSINESS_HOURS = 'SET_BUSINESS_HOURS';
export const ECOMMERCE_LOADING = 'ECOMMERCE_LOADING';
export const ECOMMERCE_ERROR = 'ECOMMERCE_ERROR';

// Service/Product types
export const SERVICE_TYPES = {
    APPOINTMENT: 'appointment',
    PRODUCT: 'product',
    SERVICE: 'service'
};

// Order statuses
export const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

// Appointment statuses
export const APPOINTMENT_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show'
};

// Load business services/products
export const loadBusinessServices = (businessId) => {
    return (dispatch) => {
        dispatch({ type: ECOMMERCE_LOADING });
        const services = getServicesFromStorage(businessId);
        dispatch({
            type: SET_BUSINESS_SERVICES,
            payload: { businessId, services }
        });
    };
};

// Add a service/product
export const addService = (businessId, serviceData) => {
    return (dispatch) => {
        const newService = {
            id: `service_${Date.now()}`,
            businessId,
            ...serviceData,
            createdAt: new Date().toISOString(),
            isActive: true
        };

        const services = getServicesFromStorage(businessId);
        services.push(newService);
        saveServicesToStorage(businessId, services);

        dispatch({
            type: ADD_SERVICE,
            payload: newService
        });

        return newService;
    };
};

// Update a service
export const updateService = (businessId, serviceId, updates) => {
    return (dispatch) => {
        const services = getServicesFromStorage(businessId);
        const index = services.findIndex(s => s.id === serviceId);

        if (index !== -1) {
            services[index] = { ...services[index], ...updates, updatedAt: new Date().toISOString() };
            saveServicesToStorage(businessId, services);

            dispatch({
                type: UPDATE_SERVICE,
                payload: services[index]
            });
        }
    };
};

// Delete a service
export const deleteService = (businessId, serviceId) => {
    return (dispatch) => {
        let services = getServicesFromStorage(businessId);
        services = services.filter(s => s.id !== serviceId);
        saveServicesToStorage(businessId, services);

        dispatch({
            type: DELETE_SERVICE,
            payload: serviceId
        });
    };
};

// Set business hours
export const setBusinessHours = (businessId, hours) => {
    return (dispatch) => {
        saveBusinessHours(businessId, hours);
        dispatch({
            type: SET_BUSINESS_HOURS,
            payload: { businessId, hours }
        });
    };
};

// Get available time slots for a business
export const getAvailableSlots = (businessId, date, serviceId) => {
    return (dispatch, getState) => {
        const hours = getBusinessHoursFromStorage(businessId);
        const appointments = getAppointmentsFromStorage(businessId);
        const services = getServicesFromStorage(businessId);
        const service = services.find(s => s.id === serviceId);

        if (!hours || !service) return [];

        const dayOfWeek = new Date(date).getDay();
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayHours = hours[dayNames[dayOfWeek]];

        if (!dayHours || dayHours.closed) return [];

        // Generate time slots
        const slots = [];
        const duration = service.duration || 30; // minutes
        const startTime = parseTime(dayHours.open);
        const endTime = parseTime(dayHours.close);

        let current = startTime;
        while (current + duration <= endTime) {
            const slotTime = formatTime(current);

            // Check if slot is already booked
            const isBooked = appointments.some(apt => {
                const aptDate = new Date(apt.date).toDateString();
                const targetDate = new Date(date).toDateString();
                return aptDate === targetDate && apt.time === slotTime && apt.status !== 'cancelled';
            });

            if (!isBooked) {
                slots.push({
                    time: slotTime,
                    available: true
                });
            }

            current += duration;
        }

        return slots;
    };
};

// Create an appointment
export const createAppointment = (appointmentData) => {
    return (dispatch, getState) => {
        const { auth } = getState();
        const userId = auth.auth?.localId;

        const newAppointment = {
            id: `apt_${Date.now()}`,
            userId,
            ...appointmentData,
            status: APPOINTMENT_STATUS.PENDING,
            createdAt: new Date().toISOString()
        };

        // Save to business appointments
        const businessApts = getAppointmentsFromStorage(appointmentData.businessId);
        businessApts.push(newAppointment);
        saveAppointmentsToStorage(appointmentData.businessId, businessApts);

        // Save to user appointments
        const userApts = getUserAppointmentsFromStorage(userId);
        userApts.push(newAppointment);
        saveUserAppointmentsToStorage(userId, userApts);

        dispatch({
            type: CREATE_APPOINTMENT,
            payload: newAppointment
        });

        return newAppointment;
    };
};

// Update appointment status
export const updateAppointmentStatus = (businessId, appointmentId, status, notes = '') => {
    return (dispatch) => {
        const appointments = getAppointmentsFromStorage(businessId);
        const index = appointments.findIndex(a => a.id === appointmentId);

        if (index !== -1) {
            appointments[index] = {
                ...appointments[index],
                status,
                statusNotes: notes,
                updatedAt: new Date().toISOString()
            };
            saveAppointmentsToStorage(businessId, appointments);

            dispatch({
                type: UPDATE_APPOINTMENT,
                payload: appointments[index]
            });
        }
    };
};

// Cancel appointment
export const cancelAppointment = (businessId, appointmentId, reason = '') => {
    return updateAppointmentStatus(businessId, appointmentId, APPOINTMENT_STATUS.CANCELLED, reason);
};

// Load user's appointments
export const loadUserAppointments = (userId) => {
    return (dispatch) => {
        const appointments = getUserAppointmentsFromStorage(userId);
        dispatch({
            type: SET_APPOINTMENTS,
            payload: appointments
        });
    };
};

// Load business appointments
export const loadBusinessAppointments = (businessId) => {
    return (dispatch) => {
        const appointments = getAppointmentsFromStorage(businessId);
        dispatch({
            type: SET_APPOINTMENTS,
            payload: appointments
        });
    };
};

// Cart actions
export const addToCart = (item) => {
    return (dispatch, getState) => {
        const { auth } = getState();
        const userId = auth.auth?.localId || 'guest';

        const cart = getCartFromStorage(userId);
        const existingIndex = cart.findIndex(i => i.id === item.id);

        if (existingIndex !== -1) {
            cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }

        saveCartToStorage(userId, cart);
        dispatch({
            type: SET_CART,
            payload: cart
        });
    };
};

export const removeFromCart = (itemId) => {
    return (dispatch, getState) => {
        const { auth } = getState();
        const userId = auth.auth?.localId || 'guest';

        let cart = getCartFromStorage(userId);
        cart = cart.filter(i => i.id !== itemId);
        saveCartToStorage(userId, cart);

        dispatch({
            type: SET_CART,
            payload: cart
        });
    };
};

export const updateCartQuantity = (itemId, quantity) => {
    return (dispatch, getState) => {
        const { auth } = getState();
        const userId = auth.auth?.localId || 'guest';

        const cart = getCartFromStorage(userId);
        const index = cart.findIndex(i => i.id === itemId);

        if (index !== -1) {
            if (quantity <= 0) {
                cart.splice(index, 1);
            } else {
                cart[index].quantity = quantity;
            }
            saveCartToStorage(userId, cart);
        }

        dispatch({
            type: SET_CART,
            payload: cart
        });
    };
};

export const clearCart = () => {
    return (dispatch, getState) => {
        const { auth } = getState();
        const userId = auth.auth?.localId || 'guest';
        saveCartToStorage(userId, []);

        dispatch({ type: CLEAR_CART });
    };
};

export const loadCart = () => {
    return (dispatch, getState) => {
        const { auth } = getState();
        const userId = auth.auth?.localId || 'guest';
        const cart = getCartFromStorage(userId);

        dispatch({
            type: SET_CART,
            payload: cart
        });
    };
};

// Create an order
export const createOrder = (orderData) => {
    return (dispatch, getState) => {
        const { auth, ecommerce } = getState();
        const userId = auth.auth?.localId;

        const newOrder = {
            id: `order_${Date.now()}`,
            userId,
            items: ecommerce.cart,
            ...orderData,
            status: ORDER_STATUS.PENDING,
            createdAt: new Date().toISOString()
        };

        // Save order
        const orders = getOrdersFromStorage(userId);
        orders.unshift(newOrder);
        saveOrdersToStorage(userId, orders);

        // Clear cart
        dispatch(clearCart());

        dispatch({
            type: CREATE_ORDER,
            payload: newOrder
        });

        return newOrder;
    };
};

// Load user's orders
export const loadOrders = () => {
    return (dispatch, getState) => {
        const { auth } = getState();
        const userId = auth.auth?.localId;
        const orders = getOrdersFromStorage(userId);

        dispatch({
            type: SET_ORDERS,
            payload: orders
        });
    };
};

// Update order status (for business owners)
export const updateOrderStatus = (orderId, status) => {
    return (dispatch, getState) => {
        // This would typically update in the backend
        dispatch({
            type: UPDATE_ORDER_STATUS,
            payload: { orderId, status }
        });
    };
};

// Helper functions
const getServicesFromStorage = (businessId) => {
    return JSON.parse(localStorage.getItem(`services_${businessId}`) || '[]');
};

const saveServicesToStorage = (businessId, services) => {
    localStorage.setItem(`services_${businessId}`, JSON.stringify(services));
};

const getBusinessHoursFromStorage = (businessId) => {
    const stored = localStorage.getItem(`businessHours_${businessId}`);
    if (stored) return JSON.parse(stored);

    // Default hours
    return {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '17:00', closed: false },
        saturday: { open: '10:00', close: '15:00', closed: false },
        sunday: { open: '00:00', close: '00:00', closed: true }
    };
};

const saveBusinessHours = (businessId, hours) => {
    localStorage.setItem(`businessHours_${businessId}`, JSON.stringify(hours));
};

const getAppointmentsFromStorage = (businessId) => {
    return JSON.parse(localStorage.getItem(`appointments_${businessId}`) || '[]');
};

const saveAppointmentsToStorage = (businessId, appointments) => {
    localStorage.setItem(`appointments_${businessId}`, JSON.stringify(appointments));
};

const getUserAppointmentsFromStorage = (userId) => {
    return JSON.parse(localStorage.getItem(`userAppointments_${userId}`) || '[]');
};

const saveUserAppointmentsToStorage = (userId, appointments) => {
    localStorage.setItem(`userAppointments_${userId}`, JSON.stringify(appointments));
};

const getCartFromStorage = (userId) => {
    return JSON.parse(localStorage.getItem(`cart_${userId}`) || '[]');
};

const saveCartToStorage = (userId, cart) => {
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
};

const getOrdersFromStorage = (userId) => {
    return JSON.parse(localStorage.getItem(`orders_${userId}`) || '[]');
};

const saveOrdersToStorage = (userId, orders) => {
    localStorage.setItem(`orders_${userId}`, JSON.stringify(orders));
};

const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};
