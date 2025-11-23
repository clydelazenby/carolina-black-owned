import { applyMiddleware, combineReducers, compose,createStore,} from 'redux';
import PostsReducer from './reducers/PostsReducer';
import thunk from 'redux-thunk';
import { AuthReducer } from './reducers/AuthReducer';
import LocationReducer from './reducers/LocationReducer';
import ReviewsReducer from './reducers/ReviewsReducer';
import FavoritesReducer from './reducers/FavoritesReducer';
import SearchFilterReducer from './reducers/SearchFilterReducer';
import DashboardReducer from './reducers/DashboardReducer';
import UserProfileReducer from './reducers/UserProfileReducer';
import NotificationReducer from './reducers/NotificationReducer';
import EcommerceReducer from './reducers/EcommerceReducer';
import AdminReducer from './reducers/AdminReducer';
import todoReducers from './reducers/Reducers';
import { reducer as reduxFormReducer } from 'redux-form';
const middleware = applyMiddleware(thunk);

const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({
    posts: PostsReducer,
    auth: AuthReducer,
    location: LocationReducer,
    reviews: ReviewsReducer,
    favorites: FavoritesReducer,
    searchFilter: SearchFilterReducer,
    dashboard: DashboardReducer,
    userProfile: UserProfileReducer,
    notifications: NotificationReducer,
    ecommerce: EcommerceReducer,
    admin: AdminReducer,
    todoReducers,
    form: reduxFormReducer,
});

//const store = createStore(rootReducers);

export const store = createStore(reducers,  composeEnhancers(middleware));
