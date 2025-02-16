// reducer.js
import {
    FETCH_NOTIFICATIONS_SUCCESS,
    MARK_AS_READ,
    CLEAR_ALL_NOTIFICATIONS,
    FETCH_NOTIFICATIONS_FAILURE,
  } from './actionTypes';
  
  const initialState = {
    notifications: [],
    error: null,
  };
  
  const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_NOTIFICATIONS_SUCCESS:
        return {
          ...state,
          notifications: action.payload,
          error: null,
        };
      case MARK_AS_READ:
        return {
          ...state,
          notifications: state.notifications.map((notification) =>
            notification.id === action.payload
              ? { ...notification, is_read: true }
              : notification
          ),
        };
      case CLEAR_ALL_NOTIFICATIONS:
        return {
          ...state,
          notifications: state.notifications.map((notification) => ({
            ...notification,
            is_read: true,
          })),
        };
      case FETCH_NOTIFICATIONS_FAILURE: // Optional: For error handling
        return {
          ...state,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default notificationReducer;
  