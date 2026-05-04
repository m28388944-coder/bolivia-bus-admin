import axios from 'axios';

const API = axios.create({
  baseURL: 'https://bolivia-bus-backend.onrender.com',
  headers: { 'Content-Type': 'application/json' },
});

export const getLatestLocations = () => API.get('/tracking/latest');
export const getSchedules       = () => API.get('/schedules/');
export const getBookings        = () => API.get('/bookings/my');
export const WS_URL = 'ws://localhost:8000/tracking/ws';

export default API;
