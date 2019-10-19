import { SET_COUNT } from '../actions/types';
const initialState = {
    notificationCounter: "", 
};

export default function(state = initialState, action) {
    const { type, payload } = action
    console.log()
    switch(type) {
        case SET_COUNT: 
            return {
                ...state,
                notificationCounter: payload
            }
        default:
            return state;
    }
}
