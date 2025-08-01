// Powered by OnSpace.AI
export interface User {
  id: string;
  name: string;
  email?: string;
  mobile: string;
  role: 'admin' | 'driver';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Driver extends User {
  licenseNumber: string;
  licenseExpiry: string;
  emergencyContact: string;
  address: string;
  joiningDate: string;
  salary: number;
  assignedVehicle?: string;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  model: string;
  brand: string;
  year: number;
  capacity: string;
  fuelType: 'petrol' | 'diesel' | 'cng';
  insuranceNumber: string;
  insuranceExpiry: string;
  rcNumber: string;
  status: 'available' | 'in-use' | 'maintenance' | 'retired';
  assignedDriver?: string;
  lastServiceDate?: string;
  nextServiceDue?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FuelRecord {
  id: string;
  vehicleId: string;
  driverId: string;
  amount: number;
  quantity: number;
  pricePerLiter: number;
  fuelStation: string;
  location: string;
  date: string;
  odometer: number;
  receipt?: string;
  createdAt: string;
}

export interface Attendance {
  id: string;
  driverId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  status: 'present' | 'absent' | 'partial';
  workingHours?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MoneyRequest {
  id: string;
  driverId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  clientName: string;
  campaignName: string;
  description: string;
  startDate: string;
  endDate: string;
  route: string;
  assignedVehicles: string[];
  revenue: number;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'routine' | 'repair' | 'inspection';
  description: string;
  cost: number;
  serviceProvider: string;
  date: string;
  nextServiceDue?: string;
  parts?: string[];
  status: 'completed' | 'pending' | 'in-progress';
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  type: 'financial' | 'attendance' | 'vehicle' | 'fuel' | 'driver';
  title: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  data: any;
  generatedBy: string;
  createdAt: string;
}

export interface DashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  totalDrivers: number;
  activeDrivers: number;
  pendingRequests: number;
  todayRevenue: number;
  monthlyRevenue: number;
  fuelExpense: number;
  attendanceRate: number;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}