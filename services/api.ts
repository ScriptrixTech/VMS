// Powered by OnSpace.AI
import { ApiResponse, PaginatedResponse } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000/api' 
  : 'https://your-repl-name.replit.app/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: RegisterRequest) {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async refreshToken(accessToken: string, refreshToken: string) {
    return this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ accessToken, refreshToken }),
    });
  }

  async getCurrentUser() {
    return this.request<UserInfo>('/auth/me');
  }

  // Vehicle endpoints
  async getVehicles(searchParams?: VehicleSearchRequest) {
    const params = new URLSearchParams();
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    return this.request<VehicleResponse[]>(`/vehicles?${params}`);
  }

  async getVehicle(id: number) {
    return this.request<VehicleResponse>(`/vehicles/${id}`);
  }

  async createVehicle(vehicleData: VehicleRequest) {
    return this.request<VehicleResponse>('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  }

  async updateVehicle(id: number, vehicleData: VehicleRequest) {
    return this.request<VehicleResponse>(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
  }

  async deleteVehicle(id: number) {
    return this.request<void>(`/vehicles/${id}`, { method: 'DELETE' });
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request<DashboardStatsResponse>('/dashboard/stats');
  }

  // Maintenance endpoints
  async getMaintenanceRecords(vehicleId: number) {
    return this.request<MaintenanceRecordResponse[]>(`/maintenance/vehicle/${vehicleId}`);
  }

  async createMaintenanceRecord(data: MaintenanceRecordRequest) {
    return this.request<MaintenanceRecordResponse>('/maintenance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Fuel endpoints
  async getFuelRecords(vehicleId: number) {
    return this.request<FuelRecordResponse[]>(`/fuel/vehicle/${vehicleId}`);
  }

  async createFuelRecord(data: FuelRecordRequest) {
    return this.request<FuelRecordResponse>('/fuel', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();

// Types
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface VehicleRequest {
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  mileage: number;
  status: string;
  ownerId?: string;
}

export interface VehicleResponse {
  id: number;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  mileage: number;
  status: string;
  ownerId?: string;
  ownerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleSearchRequest {
  make?: string;
  model?: string;
  year?: number;
  status?: string;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

export interface DashboardStatsResponse {
  totalVehicles: number;
  activeVehicles: number;
  vehiclesInMaintenance: number;
  overdueMaintenanceCount: number;
  monthlyFuelCost: number;
  monthlyMaintenanceCost: number;
  averageVehicleAge: number;
  vehiclesByStatus: Array<{ status: string; count: number }>;
  monthlyExpenses: Array<{ month: string; fuelCost: number; maintenanceCost: number }>;
}

export interface MaintenanceRecordRequest {
  vehicleId: number;
  type: string;
  description: string;
  cost: number;
  serviceProvider: string;
  serviceDate: string;
  nextServiceDue?: string;
  parts?: string;
  status: string;
  receiptImagePath?: string;
}

export interface MaintenanceRecordResponse {
  id: number;
  vehicleId: number;
  vehicleInfo: string;
  type: string;
  description: string;
  cost: number;
  serviceProvider: string;
  serviceDate: string;
  nextServiceDue?: string;
  parts?: string;
  status: string;
  receiptImagePath?: string;
  performedById?: string;
  performedByName?: string;
  createdAt: string;
}

export interface FuelRecordRequest {
  vehicleId: number;
  fuelAmount: number;
  cost: number;
  pricePerUnit: number;
  odometerReading: number;
  fuelStation: string;
  fuelDate: string;
  receiptImagePath?: string;
}

export interface FuelRecordResponse {
  id: number;
  vehicleId: number;
  vehicleInfo: string;
  fuelAmount: number;
  cost: number;
  pricePerUnit: number;
  odometerReading: number;
  fuelEfficiency?: number;
  fuelStation: string;
  fuelDate: string;
  receiptImagePath?: string;
  recordedById?: string;
  recordedByName?: string;
  createdAt: string;
}

export default apiService;