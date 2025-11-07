import axios from "axios";

const API = axios.create({
  baseURL: "https://movie-review-0044.onrender.com/api", // your backend URL
});

export default API;

