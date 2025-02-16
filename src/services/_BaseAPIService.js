// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// const _BaseAPIService = {
//   // Retrieve token from localStorage
//   retrieveToken: () => {
//     try {
//       const userString = localStorage.getItem("user");
//       // console.log("🚀 ~ userString:", userString);
//       const user = JSON.parse(userString);
//       return user?.token || null;
//     } catch (error) {
//       console.error("Error retrieving token:", error);
//       return null;
//     }
//   },

//   // Axios instance with base URL
//   instance: axios.create({
//     baseURL: window.APP_CONFIG.api1.baseapi, // Set the correct base URL
//   }),

//   // Store token in localStorage
//   storeToken: async (token) => {
//     try {
//       const userString = localStorage.getItem("user");
//       const user = JSON.parse(userString) || {};
//       // console.log("🚀 ~ storeToken: ~ user:", user);
//       user.token = token;
//       localStorage.setItem("user", JSON.stringify(user));
//     } catch (error) {
//       console.error("Error storing token:", error);
//     }
//   },

//   // Refresh token logic
//   refreshToken: async () => {
//     try {
//       const userString = localStorage.getItem("user");
//       if (!userString) throw new Error("No user data found");

//       const user = JSON.parse(userString);
//       if (!user || !user.token) throw new Error("No token found");

//       // Decode the token to check expiration
//       const decodedToken = jwtDecode(user.token);
//       const currentTime = Date.now() / 1000;
//       if (decodedToken.exp < currentTime) {
//         console.warn("Token is expired. Logging out...");
//         localStorage.clear();
//         window.location.href = "/";
//         return;
//       }

//       // Make the refresh request
//       const response = await axios.post(`${window.APP_CONFIG.api1.baseapi}/refresh`, {
//         token: user.token,
//       });

//       // Handle 401/403 errors
//       if (response.status === 401 || response.status === 403) {
//         console.error("User not authorized or deleted. Logging out...");
//         localStorage.clear();
//         window.location.href = "/";
//         return;
//       }

//       // Update token in localStorage
//       const newToken = response?.token;
//       if (!newToken) throw new Error("Invalid token response");

//       const updatedUser = { ...user, token: newToken };
//       localStorage.setItem("user", JSON.stringify(updatedUser));

//       console.log("Token refreshed successfully");
//       return newToken;
//     } catch (error) {
//       console.error("Error refreshing token:", error);
//       localStorage.clear();
//       window.location.href = "/";
//       throw error;
//     }
//   },

//   // Start a polling mechanism to refresh token every 45 seconds
//   startRefreshTokenPolling: () => {
//     const interval = setInterval(async () => {
//       try {
//         // Retrieve the token from localStorage
//         const token = _BaseAPIService.retrieveToken();
//         if (!token) throw new Error("No token found");

//         // Decode the token to check expiration
//         const decodedToken = jwtDecode(token);
//         const currentTime = Date.now() / 1000;
//         const timeToExpire = decodedToken.exp - currentTime;

//         console.log(`🚀 ~ Token expires in ${timeToExpire} seconds`);

//         // Refresh the token if it's about to expire within the next 5min
//         if (timeToExpire <= 300) {
//           console.warn("Token will expire soon. Refreshing...");
//           await _BaseAPIService.refreshToken();
//         }

//         // Force token refresh every 20 seconds regardless of expiration time
//         await _BaseAPIService.refreshToken();
//       } catch (error) {
//         console.error("Error in token refresh interval:", error);

//         // Clear the interval and log out the user on any error
//         clearInterval(interval);
//         localStorage.clear();
//         window.location.href = "/";
//       }
//     }, 20000); // ✅ Poll every 20 seconds

//     return interval;
//   },

//   // Stop polling when needed (e.g., on logout)
//   stopRefreshTokenPolling: (interval) => {
//     clearInterval(interval);
//   },
// };

// // ✅ Request Interceptor (for token management)
// _BaseAPIService.instance.interceptors.request.use(
//   async (config) => {
//     try {
//       const token = await _BaseAPIService.retrieveToken();
//       console.log("🚀 ~ token @@@@@:", token);

//       if (token) {
//         // Add token to headers
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     } catch (error) {
//       console.error("Error intercepting request:", error);
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default _BaseAPIService;

import axios from "axios";
import toast from "react-hot-toast";

const _BaseAPIService = {
  retrieveToken: () => {
    try {
      const userString = localStorage.getItem("user");
      const user = JSON.parse(userString);
      return user?.token || null;
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  },

  storeToken: (token) => {
    try {
      const userString = localStorage.getItem("user");
      const user = JSON.parse(userString) || {};
      user.token = token;
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error storing token:", error);
    }
  },

  validateToken: async () => {
    try {
      const token = _BaseAPIService.retrieveToken();
      // console.log("🚀 ~ validateToken: ~ token:", token);
      if (!token) return false;
      const response = await axios.post(
        `${window.APP_CONFIG.api1.baseapi}/refresh`,
        {
          token: token,
        }
      );

      // console.log("response--token", response);
      // const decoded = jwtDecode(token);
      // console.log("🚀 ~ validateToken: ~ decoded:", decoded);

      // Check expiration
      // if (decoded.exp * 1000 < Date.now()) {
      //   console.warn("Token has expired");
      //   return false;
      // }

      return true;
    } catch (error) {
      console.error("Token validation failed:", error);
      return false;
    }
  },
};

// Axios instance
_BaseAPIService.instance = axios.create({
  baseURL: window.APP_CONFIG.api1.baseapi,
});

// Attach token to request headers
_BaseAPIService.instance.interceptors.request.use(
  (config) => {
    if (!_BaseAPIService.validateToken()) {
      console.warn("Invalid token, not attaching to request.");
      return config; // Skip adding token
    }

    const token = _BaseAPIService.retrieveToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors and redirect to login

_BaseAPIService.instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.log("🚀 ~ error:", error);

    if (error.response?.status === 401) {
      console.warn("Unauthorized, redirecting to login...");
      localStorage.removeItem("user"); // Clear token
      // toast.error("Unauthorized");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default _BaseAPIService;
