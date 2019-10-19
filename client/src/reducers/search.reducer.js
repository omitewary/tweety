import { SET_SEARCH, UPDATE_SEARCH_TERM, MOST_TWEETED_TERM } from '../actions/types';
const initialState = {
    searchTerm: "", 
    searchTermUpdated: "",
    mostTweetedTerm: "",
    notificationCounter: ""
};

export default function(state = initialState, action) {
    const { type, payload } = action
    switch(type) {
        case SET_SEARCH: 
            return {
                ...state,
                searchTerm: payload
            }
        case UPDATE_SEARCH_TERM:
            return {
                ...state,
                searchTermUpdated: payload
            }
        case MOST_TWEETED_TERM:
            console.log('payload :', payload)
            return {
                ...state,
                mostTweetedTerm: payload.mostTweetedTerm,
                notificationCounter: payload.count
            }
        default:
            return state;
    }
}