/**
 * 🌿 handleAxiosError
 * A shared function for transforming Axios errors into consistent, user-friendly objects.
 */
export const handleAxiosError = (err, context = "request") => {
  let status = null;
  let code = err.code || "UNKNOWN_ERROR";
  let data = null;
  let message = err.message;
  let friendlyMessage = `Something went wrong while processing your ${context}.`;

  if (err.response) {
    status = err.response.status;
    data = err.response.data;
    message = err.response.data?.message || err.message;

    switch (status) {
      case 400:
        friendlyMessage = "Please check your input and try again.";
        break;
      case 401:
        friendlyMessage = "You need to sign in to continue.";
        break;
      case 403:
        friendlyMessage = "You don’t have permission to perform this action.";
        break;
      case 404:
        friendlyMessage = "We couldn’t find what you were looking for.";
        break;
      case 408:
        friendlyMessage = "The request took too long — please try again.";
        break;
      case 500:
      default:
        friendlyMessage =
          "Our servers are taking a mindful pause. Please try again in a few moments.";
        break;
    }
  } else if (err.request) {
    friendlyMessage =
      "We couldn’t connect to the Mindful Reader library. Please check your connection.";
    message = "No response received from server.";
  } else {
    friendlyMessage = "Something unexpected happened. Please try again later.";
  }

  if (process.env.NODE_ENV === "development") {
    console.warn(`⚠️ ${context.toUpperCase()} ERROR:`, {
      status,
      message,
      code,
      data,
    });
  }

  return { status, code, data, message, friendlyMessage };
};
