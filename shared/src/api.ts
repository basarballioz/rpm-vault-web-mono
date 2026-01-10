import { Bike, BikeFilters, ApiResponse } from './types';
import { API_CONFIG } from './constants';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async getBikes(filters?: BikeFilters): Promise<ApiResponse<Bike[]>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const endpoint = `${API_CONFIG.ENDPOINTS.BIKES}${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request<Bike[]>(endpoint);
  }

  async getBikeById(id: string): Promise<ApiResponse<Bike>> {
    return this.request<Bike>(API_CONFIG.ENDPOINTS.BIKE_DETAILS(id));
  }

  async getStats(): Promise<ApiResponse<{ totalBikes: number; totalBrands: number; totalCategories: number }>> {
    return this.request(API_CONFIG.ENDPOINTS.STATS);
  }
}

export const apiService = new ApiService();
export default ApiService;