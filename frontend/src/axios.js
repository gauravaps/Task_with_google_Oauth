import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:5000", 
  // baseURL:"https://task-manager-backend-k6jq.onrender.com",
  baseURL: "/api", // because it won't block cookies by third party in production only
  withCredentials: true, 
});

export default API; 
    