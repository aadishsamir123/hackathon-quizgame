// Utility function to get URL parameters
export const getUrlParameter = (name) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
};

// Get user UID from URL parameter
export const getUserUID = () => {
  return getUrlParameter("uid");
};
