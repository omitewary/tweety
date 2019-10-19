import { SET_COUNT } from './types';

export const notify = (count) => dispatch => {
    dispatch({
      type: SET_COUNT,
      payload: count
    });  
};
