import api from './api';
import type { Booking } from './database.types';

export const createBooking = async (bookingData: Partial<Booking>) => {
  const response = await api.post<Booking>('/bookings', bookingData);
  return response.data;
};

export const getBooking = async (id: string) => {
  const response = await api.get<Booking>(`/bookings/${id}`);
  return response.data;
};

export const getUserBookings = async () => {
  const response = await api.get<Booking[]>('/bookings/user');
  return response.data;
};

export const updateBooking = async (id: string, bookingData: Partial<Booking>) => {
  const response = await api.patch<Booking>(`/bookings/${id}`, bookingData);
  return response.data;
};

export const cancelBooking = async (id: string) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};