import axios, { AxiosInstance } from 'axios';
import { ICar } from '../types/car';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Fetch all cars (for client-side pagination)
export const fetchAllCars = async (): Promise<ICar[]> => {
  try {
    const { data } = await apiClient.get('/cars/all');
    return data;
  } catch (error) {
    console.error('Error fetching all cars:', error);
    return [];
  }
};

// Backend search API
export const searchCarsBackend = async (query: string): Promise<ICar[]> => {
  try {
    if (!query.trim()) {
      return await fetchAllCars();
    }
    const { data } = await apiClient.get('/cars/search', {
      params: { query },
    });
    return data;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

// Fetch single car
export const fetchCarById = async (id: number): Promise<ICar> => {
  const { data } = await apiClient.get(`/cars/${id}`);
  return data.data;
};

// Filter 
export const filterCarsBackend = async (filters: any[]): Promise<ICar[]> => {
  try {
    if (!filters || filters.length === 0) {
      console.log('No filters, fetching all cars');
      return await fetchAllCars();
    }

    const { data } = await apiClient.post('/cars/filter', { filters });

    return data.data || [];
  } catch (error) {
    console.error('Filter error:', error);
    return [];
  }
};


// Delete car
export const deleteCar = async (id: number): Promise<void> => {
  await apiClient.delete(`/cars/${id}`);
};

export default apiClient;
