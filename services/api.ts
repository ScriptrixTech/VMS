// Powered by OnSpace.AI
import { ApiResponse, PaginatedResponse } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.varshini-fleet.com';

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private getAuthToken(): string | null {
    // In a real app, this would retrieve the token from secure storage
    return null; // Placeholder for auth token
  }

  private getHeaders(): Record<string, string> {
    const headers = { ...this.defaultHeaders };
    const token = this.getAuthToken();
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'An error occurred',
          error: data.error || `HTTP ${response.status}`,
        };
      }
      
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Success',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to parse response',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const url = new URL(`${this.baseURL}${endpoint}`);
      
      if (params) {
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, String(params[key]));
          }
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        message: 'Network error',
        error: error instanceof Error ? error.message : 'Unknown network error',
      };
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        message: 'Network error',
        error: error instanceof Error ? error.message : 'Unknown network error',
      };
    }
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        message: 'Network error',
        error: error instanceof Error ? error.message : 'Unknown network error',
      };
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        message: 'Network error',
        error: error instanceof Error ? error.message : 'Unknown network error',
      };
    }
  }

  async uploadFile<T>(endpoint: string, file: FormData): Promise<ApiResponse<T>> {
    try {
      const headers = { ...this.getHeaders() };
      delete headers['Content-Type']; // Let fetch set the boundary for FormData

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: file,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        message: 'File upload failed',
        error: error instanceof Error ? error.message : 'Unknown upload error',
      };
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Helper function for paginated requests
export async function getPaginatedData<T>(
  endpoint: string,
  page: number = 1,
  limit: number = 10,
  filters?: Record<string, any>
): Promise<PaginatedResponse<T>> {
  const params = {
    page,
    limit,
    ...filters,
  };

  const response = await apiClient.get<T[]>(endpoint, params);
  
  if (!response.success) {
    return {
      ...response,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
  }

  // Assuming the API returns pagination info in headers or response body
  // This is a placeholder - adjust based on actual API response structure
  return {
    ...response,
    pagination: {
      page,
      limit,
      total: 0, // Should come from API response
      totalPages: 0, // Should come from API response
    },
  };
}

export default apiClient;