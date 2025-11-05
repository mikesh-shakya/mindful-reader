import { myAxios, privateAxios } from "./Helper";

const handleAxiosError = (err) => {
  let status = null;
  let code = err.code || "UNKNOWN_ERROR";
  let data = null;
  let message = err.message;
  let friendlyMessage = "Something went wrong. Please try again.";

  if (err.response) {
    status = err.response.status;
    data = err.response.data;
    message = err.response.data?.message || err.message;

    switch (status) {
      case 400:
        friendlyMessage = "Please check your input and try again.";
        break;
      case 401:
        friendlyMessage = "Your session has expired. Please log in again.";
        break;
      case 403:
        friendlyMessage = "You don’t have permission to do that.";
        break;
      case 404:
        friendlyMessage = "We couldn’t find what you were looking for.";
        break;
      case 500:
      default:
        friendlyMessage =
          "Our servers are taking a mindful pause. Try again soon.";
        break;
    }
  } else if (err.request) {
    // Network / backend unreachable
    friendlyMessage =
      "We couldn’t reach the server — please check your connection.";
    message = "No response received from server.";
  } else {
    // Other errors (code errors, timeouts, etc.)
    friendlyMessage =
      "Something went wrong on our side. Please try again later.";
  }

  return {
    status,
    code,
    data,
    message,
    friendlyMessage,
  };
};

/* -----------------------------
   🌿 Public Auth APIs
----------------------------- */

// User signup
export const signUp = async (user) => {
  try {
    const { data } = await myAxios.post("/auth/register", user);
    return data;
  } catch (err) {
    throw handleAxiosError(err);
  }
};

// User login
export const loginUser = async (loginData) => {
  try {
    const { data } = await myAxios.post("/auth/login", loginData);
    return data;
  } catch (err) {
    throw handleAxiosError(err);
  }
};

/* -----------------------------
   🌿 Private User APIs
----------------------------- */

// Get user by username
export const getUserByUsername = async (username) => {
  try {
    const { data } = await privateAxios.get(`/users/${username}`);
    return data;
  } catch (err) {
    throw handleAxiosError(err);
  }
};

// Get user by userId
export const getUserByUserId = async (userId) => {
  try {
    const { data } = await privateAxios.get(`/users/${userId}`);
    return data;
  } catch (err) {
    throw handleAxiosError(err);
  }
};
