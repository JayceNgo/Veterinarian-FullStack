import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// eslint-disable-next-line import/no-anonymous-default-export
export default api;
