const auth = {
  login: (token) => localStorage.setItem("admin_token", token),
  logout: () => localStorage.removeItem("admin_token"),
  isLoggedIn: () => !!localStorage.getItem("admin_token"),
  getToken: () => localStorage.getItem("admin_token"),
};

export default auth;