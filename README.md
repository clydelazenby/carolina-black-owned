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

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm test` | Run test suite |

## Project Structure

```
/src
├── /markup              # UI Components
│   ├── /Layout          # Header, Footer components
│   ├── /Pages           # Page components
│   └── /Element         # Reusable components
├── /store               # Redux state management
│   ├── /actions         # Action creators
│   ├── /reducers        # State reducers
│   └── /selectors       # State selectors
├── /services            # API calls and business logic
├── /hooks               # Custom React hooks
├── /css                 # Stylesheets
└── /images              # Static assets
```

## API Endpoints

The application connects to a Django backend API:

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup/` | User registration |
| POST | `/api/auth/login/` | User login |

### Listings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/listings/` | Get all listings |
| POST | `/api/listings/add/` | Create new listing |
| PUT | `/api/listings/update/{id}/` | Update listing |
| DELETE | `/api/listings/delete/{id}/` | Delete listing |

### Content
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/homepage/` | Homepage data |

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
