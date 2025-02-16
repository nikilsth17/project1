// actions.js
import NotificationService from '../../services/NotificationService/NotificationService';
import {
    FETCH_NOTIFICATIONS_SUCCESS,
    MARK_AS_READ,
    CLEAR_ALL_NOTIFICATIONS,
    FETCH_NOTIFICATIONS_FAILURE,
  } from './actionTypes';
  
  // Action creators
  export const fetchNotifications = (userId) => async (dispatch) => {
    try {
      const response = await NotificationService.get(userId);
      // console.log("🚀 ~ fetchNotifications ~ response:", response)
      dispatch({
        type: FETCH_NOTIFICATIONS_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      // console.error("Error fetching notifications:", error);
      dispatch({
        type: FETCH_NOTIFICATIONS_FAILURE,
        payload: error.message,
      });
    }
  };
  
  export const markNotificationAsRead = (notificationId) => async (dispatch) => {
    try {
      await NotificationService.update(notificationId); // Assuming this marks the notification as read
      dispatch({ type: MARK_AS_READ, payload: notificationId });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };
  
  export const clearAllNotifications = (userId) => async (dispatch) => {
    try {
      await NotificationService.clearAll(userId); // Assuming this clears all notifications
      dispatch({ type: CLEAR_ALL_NOTIFICATIONS });
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };
  