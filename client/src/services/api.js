import axios from "axios";

export const API = axios.create({ baseURL: "http://localhost:5000" });

export const fetchRemoteOKJobs = () => API.get('/jobs/scrape/remoteok');
