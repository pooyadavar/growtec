const ACCESS_TOKEN_KEY = "growtec_access_token";
const USERNAME_KEY = "growtec_username";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getUsername = () => localStorage.getItem(USERNAME_KEY);

export const setUsername = (username) => {
  localStorage.setItem(USERNAME_KEY, username);
};

export const clearAuthStorage = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
};

export const clearAccessToken = () => {
  clearAuthStorage();
};
