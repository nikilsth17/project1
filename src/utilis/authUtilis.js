import axios from "axios";
import AuthenticationsServices from "../services/AuthenticationService/AuthenticationsServices";

export const REFRESH_INTERVAL = 10000; // Adjust as needed

export const refreshToken = async (navigate, setTokenCallback) => {
  // Get both tokens from local storage
  const user = JSON.parse(localStorage.getItem("user"));
  const directToken = user?.token;

  if (!directToken) {
    console.error("No direct token found, skipping refresh.");
    return;
  }

  try {
    const response = await AuthenticationsServices.refresh({
      token: directToken, // Assuming this is the token for refreshing
    });

    const newToken = response.token;
    if (newToken) {
      // Update both the direct token and the token inside user
      const updatedUser = { ...user, token: newToken }; // If the user object has token field
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update the direct token
      localStorage.setItem("token", JSON.stringify(newToken));
      localStorage.setItem("jwtToken", JSON.stringify(newToken));
      // Update the state of the token in the component if a callback is provided
      if (setTokenCallback) {
        setTokenCallback(newToken); // Update token in the component state
      }

      // console.log("Token refreshed successfully.");
    } else {
      // console.error("Failed to refresh token. Logging out.");
      handleLogout(navigate);
    }
  } catch (error) {
    // console.error("Error refreshing token:", error);
    handleLogout(navigate);
  }
};

export const handleLogout = (navigate) => {
  localStorage.clear();
  navigate("/login");
  setTimeout(() => {
    window.location.reload();
  }, 100);
};
