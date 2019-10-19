import { SET_SEARCH, UPDATE_SEARCH_TERM, MOST_TWEETED_TERM } from './types';
import store from '../store';

export const setSearch = (event) => dispatch => {
    dispatch({
      type: SET_SEARCH,
      payload: event.target.value
    });  
};

export const trackTweets = () => dispatch => {
    const searchTerm = store.getState().setSearch.searchTerm;
    fetch("/setSearchTerm", {
            method: "POST",
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            body: JSON.stringify({ searchTerm })
        }).then(res => {
            res.json().then(data => {
                //console.log('data : ', data)
                dispatch({
                    type: UPDATE_SEARCH_TERM,
                    payload: searchTerm
                });
            })
        })
}

export const setTweetCount = (payload) => dispatch => {
    fetch("/setCount", {
        method: "POST",
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
        body: JSON.stringify({ payload })
    }).then(res =>{
        res.json().then(data => {

            dispatch({
                type: MOST_TWEETED_TERM,
                payload:{ mostTweetedTerm: data.searchedTerm, count: data.notificationCounter}
            })
        })
        
    })
}
