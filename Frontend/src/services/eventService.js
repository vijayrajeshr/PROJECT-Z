// frontend/src/services/eventService.js

import apiClient from '../api/axiosClient';

// --- PUBLIC READ ENDPOINTS ---

export const fetchAllEvents = async () => {
  try {
    const response = await apiClient.get('/events');
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const fetchEventById = async (id) => {
  try {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    throw error;
  }
};

// --- BOOKING ENDPOINTS (User) ---

export const createBooking = async (bookingData) => {
  const response = await apiClient.post('/bookings', bookingData);
  return response.data;
};

export const confirmMockPayment = async (bookingId) => {
  const response = await apiClient.post('/bookings/confirm-mock', { bookingId });
  return response.data;
};

export const fetchMyTickets = async () => {
  const response = await apiClient.get('/bookings/my-tickets');
  return response.data;
};