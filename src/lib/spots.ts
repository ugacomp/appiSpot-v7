import api from './api';
import type { Spot } from './database.types';
import toast from 'react-hot-toast';

export const getSpots = async (): Promise<Spot[]> => {
  try {
    const response = await api.get('/spots');
    if (!response.data) {
      throw new Error('No spots data received');
    }
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Unable to load spots';
    toast.error(message);
    return [];
  }
};

export const getSpot = async (id: string): Promise<Spot | null> => {
  try {
    const response = await api.get(`/spots/${id}`);
    if (!response.data) {
      throw new Error('Spot not found');
    }
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Unable to load spot details';
    toast.error(message);
    return null;
  }
};

export const createSpot = async (spotData: Partial<Spot>): Promise<Spot | null> => {
  try {
    const response = await api.post('/spots', spotData);
    toast.success('Spot created successfully!');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Unable to create spot';
    toast.error(message);
    return null;
  }
};