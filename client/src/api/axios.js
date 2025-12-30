import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://csci426-project.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

export default api;