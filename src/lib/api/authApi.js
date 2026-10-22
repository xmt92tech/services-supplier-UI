import api from "../axios";

export const userLogin = async (email, password) => {
  const response = await api.post("/auth/login", {
        email,
        password,
      })
      const token = response.data.token;

  // Save token in localStorage
  localStorage.setItem("token", token);

  return token;
}

// Logout
export const userLogout = () => {
  // Clear token from localStorage
  localStorage.removeItem("token");

  // Optionally reset default headers (not always needed since interceptor handles it)
  delete api.defaults.headers.common["Authorization"];
};

let navigateFn = null;

export const setNavigate = (navigate) => {
  navigateFn = navigate;
};

export const logoutAndRedirect = () => {
  localStorage.removeItem("token");
  if (navigateFn) {
    navigateFn("/login"); // smoother react-router redirect
  } else {
    window.location.href = "/login"; // fallback
  }
};
