# Frontend-Backend Integration Guide

## Overview

This guide documents how the Carolina Black Owned frontend (React) integrates with the backend (Django REST Framework).

**Frontend Repository:** carolina-black-owned (React)
**Backend Repository:** [carolina_black_owned_be](https://github.com/clydelazenby/carolina_black_owned_be) (Django)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│                                                                 │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐    │
│  │  Pages   │   │Components│   │  Redux   │   │ Services │    │
│  │          │◄──│          │◄──│  Store   │◄──│          │    │
│  └──────────┘   └──────────┘   └──────────┘   └────┬─────┘    │
│                                                      │          │
│                                    ┌─────────────────┘          │
│                                    ▼                            │
│                          ┌──────────────────┐                   │
│                          │  src/services/   │                   │
│                          │     api.js       │                   │
│                          └────────┬─────────┘                   │
│                                   │                             │
└───────────────────────────────────┼─────────────────────────────┘
                                    │
                          HTTP (REST API)
                                    │
┌───────────────────────────────────┼─────────────────────────────┐
│                                   ▼                             │
│                        BACKEND (Django)                         │
│                                                                 │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐    │
│  │   URLs   │──▶│  Views   │──▶│Serializers│──▶│  Models  │   │
│  └──────────┘   └──────────┘   └──────────┘   └────┬─────┘    │
│                                                      │          │
│                                                      ▼          │
│                                              ┌──────────────┐   │
│                                              │   MySQL DB   │   │
│                                              └──────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### 1. Backend Setup (Django)

```bash
# Clone backend repository
git clone https://github.com/clydelazenby/carolina_black_owned_be.git
cd carolina_black_owned_be
git checkout dev

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
# Backend runs on http://localhost:8000
```

### 2. Frontend Setup (React)

```bash
# Navigate to frontend directory
cd carolina-black-owned

# Install dependencies
npm install

# Create environment file (already done)
# .env.development exists with REACT_APP_API_URL=http://localhost:8000

# Start development server
npm start
# Frontend runs on http://localhost:3000
```

---

## API Configuration

### Environment Variables

The frontend uses environment variables for API configuration:

| File | Purpose |
|------|---------|
| `.env.development` | Development settings (localhost) |
| `.env.production` | Production settings |
| `.env.example` | Template for new environments |

**Key Variables:**
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_VERSION=v1
REACT_APP_DEBUG=true
```

### Centralized API Config

All API endpoints are defined in `src/config/api.js`:

```javascript
import { API_BASE_URL, API_ENDPOINTS } from './config/api';

// Usage
const loginUrl = `${API_BASE_URL}${API_ENDPOINTS.auth.login}`;
// Result: http://localhost:8000/api/auth/login/
```

---

## Authentication Flow

### Registration Flow

```
Frontend                          Backend
   │                                 │
   │  POST /api/auth/signup/         │
   │  {email, password, username}    │
   │ ─────────────────────────────▶  │
   │                                 │
   │  {token, user_id, email}        │
   │ ◀─────────────────────────────  │
   │                                 │
   │  Save token to localStorage     │
   │  Redirect to dashboard          │
   │                                 │
```

### Login Flow

```
Frontend                          Backend
   │                                 │
   │  POST /api/auth/login/          │
   │  {email/username, password}     │
   │ ─────────────────────────────▶  │
   │                                 │
   │  {token, user_id, email,        │
   │   expiresIn, refreshToken}      │
   │ ◀─────────────────────────────  │
   │                                 │
   │  Save to localStorage           │
   │  Start logout timer             │
   │  Dispatch loginConfirmed        │
   │                                 │
```

### Token Usage

All authenticated requests include the token in the Authorization header:

```javascript
// Handled automatically by src/services/api.js interceptor
headers: {
  'Authorization': 'Token <user_token>'
}
```

### Auto-Login

On app load, `checkAutoLogin()` in AuthService.js:
1. Checks localStorage for 'userDetails'
2. Verifies token hasn't expired
3. Restores Redux auth state if valid
4. Redirects to login if invalid/expired

---

## API Services

### Using the Unified API Service

```javascript
// Import specific APIs
import { authAPI, listingsAPI, reviewsAPI } from './services/api';

// Authentication
const response = await authAPI.login({ email, password });
const user = await authAPI.signup(userData);

// Listings
const listings = await listingsAPI.getAll();
const listing = await listingsAPI.getById(id);
await listingsAPI.create(formData);
await listingsAPI.update(id, data);
await listingsAPI.delete(id);

// Reviews
const reviews = await reviewsAPI.getForListing(listingId);
await reviewsAPI.create(listingId, { rating: 5, comment: 'Great!' });
```

### Available API Modules

| Module | Purpose |
|--------|---------|
| `authAPI` | Authentication (login, signup, logout, profile) |
| `listingsAPI` | Business listings CRUD |
| `reviewsAPI` | Reviews management |
| `favoritesAPI` | User favorites |
| `dashboardAPI` | Dashboard statistics |
| `notificationsAPI` | User notifications |
| `claimsAPI` | Business claims |
| `appointmentsAPI` | Booking appointments |
| `adminAPI` | Admin operations |
| `coreAPI` | Homepage, categories, cities |

---

## Redux State Management

### Store Structure

```javascript
{
  auth: {
    email: '',
    idToken: '',
    localId: '',
    expiresIn: '',
    refreshToken: '',
    errorMessage: '',
    successMessage: '',
    showLoading: false
  },
  posts: { ... },           // Listings data
  location: { ... },        // User location
  reviews: { ... },         // Reviews by listing
  favorites: { ... },       // Saved businesses
  searchFilter: { ... },    // Search/filter state
  dashboard: { ... },       // Business owner data
  userProfile: { ... },     // User profile & badges
  notifications: { ... },   // Notifications
  ecommerce: { ... },       // Services, appointments
  admin: { ... },           // Admin state
}
```

### Action Creators

Actions dispatch API calls and update Redux state:

```javascript
// src/store/actions/AuthActions.js
export function signupAction(email, password, history) {
  return (dispatch) => {
    dispatch({ type: SIGNUP_REQUEST });

    signUp(email, password)
      .then((response) => {
        dispatch({ type: SIGNUP_SUCCESS, payload: response.data });
        saveTokenInLocalStorage(response.data);
        history.push('/');
      })
      .catch((error) => {
        dispatch({ type: SIGNUP_FAILURE, payload: error });
      });
  };
}
```

---

## Endpoint Mapping

### Currently Implemented

| Frontend Service | Backend Endpoint | Status |
|------------------|------------------|--------|
| `authAPI.signup` | `/api/auth/signup/` | Working |
| `authAPI.login` | `/api/auth/login/` | Working |
| `authAPI.getToken` | `/api/token/` | Working |
| `listingsAPI.getAll` | `/api/listings/` | Working |
| `listingsAPI.create` | `/api/listings/add/` | Working |
| `listingsAPI.update` | `/api/listings/update/<id>/` | Working |
| `listingsAPI.delete` | `/api/listings/delete/<id>/` | Working |
| `coreAPI.getHomepage` | `/api/homepage/` | Working |

### Needs Backend Implementation

| Frontend Service | Expected Endpoint | Priority |
|------------------|-------------------|----------|
| `authAPI.logout` | `/api/auth/logout/` | High |
| `authAPI.getProfile` | `/api/auth/profile/` | High |
| `reviewsAPI.*` | `/api/listings/<id>/reviews/` | High |
| `favoritesAPI.*` | `/api/favorites/` | High |
| `dashboardAPI.*` | `/api/dashboard/` | Medium |
| `notificationsAPI.*` | `/api/notifications/` | Medium |
| `claimsAPI.*` | `/api/claims/` | Medium |
| `appointmentsAPI.*` | `/api/appointments/` | Low |
| `adminAPI.*` | `/api/admin/` | Medium |

---

## Data Models Mapping

### Listing

| Frontend Field | Backend Field | Type |
|----------------|---------------|------|
| `id` | `id` | Integer |
| `name` | `directory_name` | String |
| `tagline` | `tagline` | String |
| `url` | `directory_url` | URL |
| `category` | `industry_niche` | String |
| `socialLinks` | `social_media_links` | JSON |
| `description` | `description` | Text |
| `keywords` | `keywords` | Text |
| `videoUrl` | `video_url` | URL |
| `logo` | `logo` | File |
| `email` | `email` | Email |

### User

| Frontend Field | Backend Field | Type |
|----------------|---------------|------|
| `id` | `id` | Integer |
| `email` | `email` | Email |
| `username` | `username` | String |
| `firstName` | `first_name` | String |
| `lastName` | `last_name` | String |
| `address` | `address` | String |
| `city` | `city_town` | String |
| `agreedToTerms` | `agreed_to_terms` | Boolean |
| `agreedToPrivacy` | `agreed_to_privacy_policy` | Boolean |

---

## Error Handling

### Frontend Error Handling

The API service includes response interceptors for common errors:

```javascript
// src/services/api.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized - redirect to login
          break;
        case 403:
          // Handle forbidden
          break;
        case 404:
          // Handle not found
          break;
        case 500:
          // Handle server error
          break;
      }
    }
    return Promise.reject(error);
  }
);
```

### Backend Error Responses

Expected error format from Django:

```json
{
  "status": "error_code",
  "message": "Human readable message",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

---

## CORS Configuration

### Backend Settings

```python
# settings.py
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

### Frontend Proxy (Development)

```javascript
// setupProxy.js
app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://localhost:8000',
    changeOrigin: true,
  })
);
```

---

## Development Workflow

### Running Both Servers

**Terminal 1 (Backend):**
```bash
cd carolina_black_owned_be
source venv/bin/activate
python manage.py runserver
```

**Terminal 2 (Frontend):**
```bash
cd carolina-black-owned
npm start
```

### Testing API Calls

Use browser dev tools or Postman:

```bash
# Get auth token
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Get listings (with token)
curl -X GET http://localhost:8000/api/listings/ \
  -H "Authorization: Token <your_token>"
```

---

## Deployment Considerations

### Production Configuration

1. **Frontend:**
   - Build: `npm run build`
   - Set `REACT_APP_API_URL` to production backend URL
   - Deploy to CDN or static hosting (Netlify, Vercel, S3)

2. **Backend:**
   - Set `DEBUG=False`
   - Configure `ALLOWED_HOSTS`
   - Set up HTTPS
   - Use Gunicorn + Nginx
   - Configure proper CORS origins

### Environment Variables

**Frontend (.env.production):**
```env
REACT_APP_API_URL=https://api.carolinablackowned.com
REACT_APP_DEBUG=false
```

**Backend (.env):**
```env
DEBUG=False
DJANGO_SECRET_KEY=<production-secret>
ALLOWED_HOSTS=api.carolinablackowned.com
CORS_ALLOWED_ORIGINS=https://carolinablackowned.com
```

---

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend has correct CORS_ALLOWED_ORIGINS
   - Check if credentials are being sent with requests

2. **401 Unauthorized**
   - Token may be expired
   - Check token is being sent in Authorization header

3. **Network Errors**
   - Verify backend is running
   - Check API_BASE_URL matches backend URL

4. **404 Not Found**
   - Verify endpoint path matches backend URLs
   - Check for trailing slashes (Django requires them)

### Debug Checklist

- [ ] Backend server running on correct port
- [ ] Frontend .env has correct API URL
- [ ] CORS configured on backend
- [ ] Token being sent in headers (check Network tab)
- [ ] Endpoint paths match exactly (including trailing /)

---

*Last Updated: November 2024*
