import { mockSpots } from './mockData';
import toast from 'react-hot-toast';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  get: async (url: string) => {
    await delay(800);
    
    // Mock responses
    if (url === '/spots') {
      return { data: mockSpots };
    }
    
    if (url.startsWith('/spots/')) {
      const id = url.split('/')[2];
      const spot = mockSpots.find(s => s.id === id);
      if (!spot) throw new Error('Spot not found');
      return { data: spot };
    }

    throw new Error('Not implemented');
  },

  post: async (url: string, data: any) => {
    await delay(1000);
    
    // Mock responses
    if (url === '/spots') {
      return { 
        data: {
          id: Date.now().toString(),
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };
    }

    throw new Error('Not implemented');
  }
};

export default api;