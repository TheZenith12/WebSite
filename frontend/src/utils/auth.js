// utils/auth.js
const TOKEN_KEY = "admin_token";

const auth = {
  login: (token) => localStorage.setItem(TOKEN_KEY, token),
  logout: () => localStorage.removeItem(TOKEN_KEY),
  isLoggedIn: () => !!localStorage.getItem(TOKEN_KEY),
  getToken: () => localStorage.getItem(TOKEN_KEY)
};

export default auth;
