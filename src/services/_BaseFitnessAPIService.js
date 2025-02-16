import axios from 'axios';
import _BaseAPIService from './_BaseAPIService';


const _BaseFitnessAPIService = {
  retrieveToken : () => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  },
  instance : axios.create({
    baseURL: window.APP_CONFIG.api3.baseapi,
    // headers: {
    //   Authorization: `Bearer ` +  retrieveToken(), // Add 'Bearer' before the token
    // },
  }),

  storeToken : async (token) => {
    try {
      await sessionStorage.setItem('jwtToken', token);
    } catch (error) {
      console.error('Error storing token:', error);
    }
  },
  
  
  
};
// Add an interceptor to include the token in the request headers
_BaseAPIService.instance.interceptors.request.use(
  async (config) => {
    try {
      const token = window.APP_CONFIG.api3.token; // Retrieve your authentication token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error intercepting request:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default _BaseFitnessAPIService;
