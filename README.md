# Carolina Black Owned

A directory and marketplace web application designed to discover, list, and support Black-owned businesses across North Carolina and South Carolina.

## Features

### Business Directory
- Browse all Black-owned businesses in the Carolinas
- Multiple viewing options: list view, grid view, and map overlay
- Detailed business pages with descriptions, social links, and contact info

### Search & Filtering (Phase 3)
- **Real-time search** - Search businesses by name, tagline, description, or category
- **Location filtering** - Filter by city or state
- **Category filtering** - Filter by 10 business categories:
  - Restaurant
  - Beauty & Grooming
  - Retail
  - Cafe
  - Technology
  - Health & Wellness
  - Professional Services
  - Entertainment
  - Automotive
  - Home Services
- **Rating filter** - Filter by minimum star rating
- **Multiple sort options**:
  - Relevance (default)
  - Highest/Lowest rated
  - Name (A-Z / Z-A)
  - Newest first
  - Distance from user (when location enabled)
- **Clear filters** - One-click reset of all active filters
- **Active filter count** - Visual indicator of applied filters
- **Grid/List toggle** - Switch between view modes

### Location-Based Discovery
- Auto-detect user location using browser Geolocation API
- Find nearby businesses based on configurable search radius (5-100 miles)
- Distance calculation using Haversine formula
- Automatic detection of nearest Carolina city from 11 major cities:
  - North Carolina: Charlotte, Raleigh, Durham, Greensboro, Winston-Salem, Fayetteville, Wilmington
  - South Carolina: Charleston, Columbia, Greenville, Myrtle Beach
- Location caching for improved performance (5-minute cache)
- Distance display formatting ("Nearby", "5.2 mi", "45 mi")

### Reviews & Ratings
- View and submit reviews for businesses
- 5-star rating system
- User-generated reviews with timestamps
- Persistent storage of reviews

### Favorites System
- Save businesses to your favorites list
- Toggle favorite status on any listing
- Dedicated favorites page to view all saved businesses
- Clear all favorites functionality

### Social Sharing
- Share businesses across multiple platforms:
  - Facebook
  - Twitter/X
  - LinkedIn
  - WhatsApp
  - Email
- Copy link to clipboard functionality
- Native share support on mobile devices (Web Share API)
- Horizontal and vertical layout options

### Business Owner Dashboard (Phase 4)
- **Analytics Overview**
  - Total views, favorites, and reviews tracking
  - Monthly growth comparisons
  - Top performing listings
  - Category and location breakdowns
- **Listing Management**
  - View, edit, and delete your listings
  - Claim existing businesses
  - Verification status tracking
- **Activity Feed**
  - Recent reviews and engagement
  - Performance notifications

### User Profiles (Phase 4)
- **Profile Customization**
  - Display name, bio, and location
  - Social media links
  - Avatar support
- **Achievement Badges**
  - 10 earnable badges including:
    - First Review, Active Reviewer, Review Master
    - First Favorite, Collector
    - Business Owner, Verified Owner
    - Community Supporter, Explorer, Early Adopter
- **Activity History**
  - Track all user actions
  - Review history
  - Engagement metrics

### Notifications System (Phase 4)
- **In-App Notifications**
  - New review alerts
  - Favorite milestones
  - Badge achievements
  - Claim status updates
- **Push Notifications**
  - Browser push notification support
  - Real-time alerts
- **Email Preferences**
  - Customizable notification settings
  - Digest options

### E-commerce Integration (Phase 4)
- **Online Appointment Booking**
  - Service selection
  - Date and time picker
  - Available slot detection
  - Booking confirmation
- **My Appointments**
  - View upcoming and past appointments
  - Cancel or reschedule
  - Leave reviews after visits
- **Shopping Cart** (Framework ready)
  - Add products/services to cart
  - Quantity management
  - Order placement

### Admin Panel (Phase 4)
- **Business Claim Moderation**
  - Review and approve/reject claims
  - Verification management
- **Listing Approval**
  - Pending listings queue
  - Approval/rejection workflow
- **Content Moderation**
  - Report management
  - Content removal tools
- **User Management**
  - Ban/unban users
  - Admin statistics

### Interactive Map (Phase 4)
- **Map Features**
  - Marker clustering for dense areas
  - Quick city navigation (8 major Carolina cities)
  - Zoom controls
  - Satellite/map view toggle
- **Business Info**
  - Click markers for business details
  - Direct links to listings
  - Directions integration

### Mobile PWA (Phase 4)
- **Progressive Web App**
  - Install to home screen
  - App-like experience
- **Offline Support**
  - Service worker caching
  - Offline page access
- **Background Sync**
  - Queue actions when offline
  - Sync when connection restored

### User Authentication
- User registration and login
- Session management with persistent tokens
- Protected routes for authenticated features

### Business Listing Management
- Add new business listings with comprehensive details:
  - Business name, tagline, and description
  - Logo upload
  - Industry/niche categorization
  - Website and social media links
  - Contact email
  - Keywords and video URL
- Edit and delete listings

## Tech Stack

### Frontend
- **React 17** - Core UI framework
- **Redux** - State management with Redux-Thunk
- **React Router DOM 5** - Client-side routing
- **React Bootstrap** - UI components
- **Tailwind CSS 3.0** - Utility-first styling
- **Axios** - HTTP client

### Build Tools
- **Webpack 5** - Module bundler
- **Babel** - JavaScript transpiler
- **Jest** - Testing framework

### Additional Libraries
- React Slick - Carousel/slider components
- Simple React Lightbox - Image gallery
- SweetAlert - Alert dialogs
- EmailJS - Email functionality
- React Mailchimp Form - Newsletter integration

## Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)
- npm or yarn
- Backend API server (Django) running on `http://localhost:8000`
  - Backend repo: [carolina_black_owned_be](https://github.com/clydelazenby/carolina_black_owned_be)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd carolina-black-owned
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment (optional - defaults to localhost:8000):
```bash
# .env.development is pre-configured for local development
# Edit .env.production for production deployment
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

### Environment Configuration

The application uses environment variables for API configuration:

| File | Purpose |
|------|---------|
| `.env.development` | Local development (localhost:8000) |
| `.env.production` | Production deployment |
| `.env.example` | Template for new environments |

**Key Variables:**
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_VERSION=v1
REACT_APP_DEBUG=true
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm test` | Run test suite |

## Project Structure

```
/
├── /docs                    # Documentation
│   ├── BACKEND_REVIEW.md    # Backend code review & recommendations
│   ├── INTEGRATION_GUIDE.md # Frontend-backend integration guide
│   └── BACKEND_ENDPOINTS_CODE.md # Ready-to-use backend code
├── /src
│   ├── /config              # Configuration files
│   │   └── api.js           # Centralized API endpoints
│   ├── /markup              # UI Components
│   │   ├── /Layout          # Header, Footer components
│   │   ├── /Pages           # Page components
│   │   └── /Element         # Reusable components
│   ├── /store               # Redux state management
│   │   ├── /actions         # Action creators
│   │   ├── /reducers        # State reducers
│   │   └── /selectors       # State selectors
│   ├── /services            # API services
│   │   ├── api.js           # Unified API service (NEW)
│   │   ├── AuthService.js   # Authentication
│   │   └── ...              # Other services
│   ├── /hooks               # Custom React hooks
│   ├── /css                 # Stylesheets
│   └── /images              # Static assets
├── .env.development         # Development environment config
├── .env.production          # Production environment config
└── .env.example             # Environment template
```

## API Integration

The application uses a centralized API service (`src/services/api.js`) for all backend communications.

### Using the API Service

```javascript
// Import specific API modules
import { authAPI, listingsAPI, reviewsAPI, favoritesAPI } from './services/api';

// Authentication
await authAPI.login({ email, password });
await authAPI.signup(userData);

// Listings
const { data } = await listingsAPI.getAll();
await listingsAPI.create(formData);

// Reviews
await reviewsAPI.create(listingId, { rating: 5, comment: 'Great!' });

// Favorites
await favoritesAPI.add(listingId);
```

### API Endpoints

The application connects to a Django backend API:

#### Authentication
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup/` | User registration | Working |
| POST | `/api/auth/login/` | User login | Working |
| POST | `/api/auth/logout/` | User logout | Pending |
| GET/PUT | `/api/auth/profile/` | User profile | Pending |

#### Listings
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/listings/` | Get all listings | Working |
| POST | `/api/listings/add/` | Create new listing | Working |
| PUT | `/api/listings/update/{id}/` | Update listing | Working |
| DELETE | `/api/listings/delete/{id}/` | Delete listing | Working |

#### Reviews (Phase 4)
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/listings/{id}/reviews/` | Get reviews | Pending |
| POST | `/api/listings/{id}/reviews/` | Create review | Pending |

#### Favorites (Phase 4)
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/favorites/` | Get favorites | Pending |
| POST | `/api/favorites/add/` | Add favorite | Pending |
| DELETE | `/api/favorites/remove/{id}/` | Remove favorite | Pending |

#### Dashboard (Phase 4)
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/dashboard/stats/` | Dashboard statistics | Pending |
| GET | `/api/dashboard/my-listings/` | User's listings | Pending |

#### Core
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/homepage/` | Homepage data | Working |

> **Note:** Endpoints marked "Pending" require backend implementation. See `docs/BACKEND_ENDPOINTS_CODE.md` for ready-to-use implementation code.

## Page Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/login` | User login |
| `/register` | User registration |
| `/add-listing` | Create new business listing |
| `/listing` | Browse all businesses |
| `/listing-details` | Business detail page |
| `/favorites` | Saved businesses |
| `/blog` | Blog section |
| `/contact-us` | Contact page |
| `/dashboard` | Business owner dashboard (Phase 4) |
| `/profile` | User profile page (Phase 4) |
| `/notifications` | Notifications center (Phase 4) |
| `/book-appointment` | Appointment booking (Phase 4) |
| `/my-appointments` | User's appointments (Phase 4) |
| `/claim-business` | Claim a business (Phase 4) |
| `/admin` | Admin panel (Phase 4) |

## Redux Store Structure

```javascript
{
  auth: {
    token,
    isAuthenticated,
    user
  },
  posts: {
    items,
    loading,
    error
  },
  location: {
    coordinates,
    nearestCity,
    loading,
    searchRadius
  },
  favorites: {
    items: [],
    loading,
    loaded
  },
  reviews: {
    byBusinessId: {},
    loading
  },
  searchFilter: {
    searchQuery,
    locationFilter,
    categoryFilter,
    sortBy,
    ratingFilter,
    filteredResults: [],
    hasFiltersApplied
  },
  // Phase 4 additions
  dashboard: {
    myListings: [],
    analytics: {},
    claims: {},
    loading
  },
  userProfile: {
    profile: {},
    activityHistory: [],
    badges: [],
    loading
  },
  notifications: {
    notifications: [],
    preferences: {},
    unreadCount
  },
  ecommerce: {
    services: {},
    appointments: [],
    orders: [],
    cart: []
  },
  admin: {
    pendingClaims: [],
    pendingListings: [],
    reportedContent: [],
    stats: {}
  }
}
```

## Documentation

Detailed documentation is available in the `/docs` directory:

| Document | Description |
|----------|-------------|
| [INTEGRATION_GUIDE.md](docs/INTEGRATION_GUIDE.md) | Complete frontend-backend integration guide |
| [BACKEND_REVIEW.md](docs/BACKEND_REVIEW.md) | Backend code review with security recommendations |
| [BACKEND_ENDPOINTS_CODE.md](docs/BACKEND_ENDPOINTS_CODE.md) | Ready-to-use code for missing backend endpoints |

## Backend Repository

The Django backend is maintained in a separate repository:
- **Repository:** [carolina_black_owned_be](https://github.com/clydelazenby/carolina_black_owned_be)
- **Branch:** dev
- **Framework:** Django 4.x + Django REST Framework

See the [Integration Guide](docs/INTEGRATION_GUIDE.md) for setup instructions.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For questions or issues, please contact the development team.
