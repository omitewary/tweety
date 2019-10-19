import { combineReducers } from 'redux';
import setSearch from './search.reducer';
import trackTweets from './search.reducer';
import setTweetCount from './search.reducer';
import notify from './notify.reducers';

export default combineReducers({
    setSearch, 
    trackTweets, 
    setTweetCount,
    notify, 
});