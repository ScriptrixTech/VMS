// Powered by OnSpace.AI
import { apiClient } from '../api';
import { 
  ApiResponse, 
  PaginatedResponse, 
  Vehicle, 
  Driver, 
  MoneyRequest, 
  Campaign,
  MaintenanceRecord,
  FuelRecord,
  Attendance,
  Report,
  DashboardStats
} from '../../types';

// Dashboard and Statistics
export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  return apiClient.get<DashboardStats>('/admin/dashboard/stats');
};

export const getRealtimeStats = async (): Promise<ApiResponse<DashboardStats>> => {
  return apiClient.get<DashboardStats>('/admin/dashboard/realtime');
};

// Fleet Management
export const getVehicles = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    status?: string;
    fuelType?: string;
    brand?: string;
    search?: string;
  }
): Promise<PaginatedResponse<Vehicle>> => {
  return apiClient.get<Vehicle[]>('/admin/vehicles', {
    page,
    limit,
    ...filters,
  });
};

export const getVehicleById = async (vehicleId: string): Promise<ApiResponse<Vehicle>> => {
  return apiClient.get<Vehicle>(`/admin/vehicles/${vehicleId}`);
};

export const createVehicle = async (vehicleData: Partial<Vehicle>): Promise<ApiResponse<Vehicle>> => {
  return apiClient.post<Vehicle>('/admin/vehicles', vehicleData);
};

export const updateVehicle = async (
  vehicleId: string,
  vehicleData: Partial<Vehicle>
): Promise<ApiResponse<Vehicle>> => {
  return apiClient.put<Vehicle>(`/admin/vehicles/${vehicleId}`, vehicleData);
};

export const deleteVehicle = async (vehicleId: string): Promise<ApiResponse<void>> => {
  return apiClient.delete<void>(`/admin/vehicles/${vehicleId}`);
};

export const assignVehicleToDriver = async (
  vehicleId: string,
  driverId: string
): Promise<ApiResponse<void>> => {
  return apiClient.post<void>(`/admin/vehicles/${vehicleId}/assign`, { driverId });
};

export const unassignVehicle = async (vehicleId: string): Promise<ApiResponse<void>> => {
  return apiClient.post<void>(`/admin/vehicles/${vehicleId}/unassign`);
};

// Driver Management
export const getDrivers = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    status?: string;
    hasVehicle?: boolean;
    search?: string;
  }
): Promise<PaginatedResponse<Driver>> => {
  return apiClient.get<Driver[]>('/admin/drivers', {
    page,
    limit,
    ...filters,
  });
};

export const getDriverById = async (driverId: string): Promise<ApiResponse<Driver>> => {
  return apiClient.get<Driver>(`/admin/drivers/${driverId}`);
};

export const createDriver = async (driverData: Partial<Driver>): Promise<ApiResponse<Driver>> => {
  return apiClient.post<Driver>('/admin/drivers', driverData);
};

export const updateDriver = async (
  driverId: string,
  driverData: Partial<Driver>
): Promise<ApiResponse<Driver>> => {
  return apiClient.put<Driver>(`/admin/drivers/${driverId}`, driverData);
};

export const deactivateDriver = async (driverId: string): Promise<ApiResponse<void>> => {
  return apiClient.post<void>(`/admin/drivers/${driverId}/deactivate`);
};

export const activateDriver = async (driverId: string): Promise<ApiResponse<void>> => {
  return apiClient.post<void>(`/admin/drivers/${driverId}/activate`);
};

export const getDriverAttendance = async (
  driverId: string,
  startDate: string,
  endDate: string
): Promise<ApiResponse<Attendance[]>> => {
  return apiClient.get<Attendance[]>(`/admin/drivers/${driverId}/attendance`, {
    startDate,
    endDate,
  });
};

// Financial Request Management
export const getMoneyRequests = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    status?: string;
    driverId?: string;
    dateRange?: { startDate: string; endDate: string };
  }
): Promise<PaginatedResponse<MoneyRequest>> => {
  return apiClient.get<MoneyRequest[]>('/admin/money-requests', {
    page,
    limit,
    ...filters,
  });
};

export const approveMoneyRequest = async (
  requestId: string,
  paymentMethod: string,
  transactionId?: string
): Promise<ApiResponse<MoneyRequest>> => {
  return apiClient.post<MoneyRequest>(`/admin/money-requests/${requestId}/approve`, {
    paymentMethod,
    transactionId,
  });
};

export const rejectMoneyRequest = async (
  requestId: string,
  rejectionReason: string
): Promise<ApiResponse<MoneyRequest>> => {
  return apiClient.post<MoneyRequest>(`/admin/money-requests/${requestId}/reject`, {
    rejectionReason,
  });
};

export const getRequestHistory = async (
  driverId: string,
  page: number = 1
): Promise<PaginatedResponse<MoneyRequest>> => {
  return apiClient.get<MoneyRequest[]>(`/admin/drivers/${driverId}/requests`, {
    page,
  });
};

// Maintenance Management
export const getMaintenanceRecords = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    vehicleId?: string;
    type?: string;
    status?: string;
  }
): Promise<PaginatedResponse<MaintenanceRecord>> => {
  return apiClient.get<MaintenanceRecord[]>('/admin/maintenance', {
    page,
    limit,
    ...filters,
  });
};

export const createMaintenanceRecord = async (
  maintenanceData: Partial<MaintenanceRecord>
): Promise<ApiResponse<MaintenanceRecord>> => {
  return apiClient.post<MaintenanceRecord>('/admin/maintenance', maintenanceData);
};

export const updateMaintenanceRecord = async (
  recordId: string,
  maintenanceData: Partial<MaintenanceRecord>
): Promise<ApiResponse<MaintenanceRecord>> => {
  return apiClient.put<MaintenanceRecord>(`/admin/maintenance/${recordId}`, maintenanceData);
};

export const getUpcomingMaintenance = async (): Promise<ApiResponse<MaintenanceRecord[]>> => {
  return apiClient.get<MaintenanceRecord[]>('/admin/maintenance/upcoming');
};

export const getMaintenanceAlerts = async (): Promise<ApiResponse<MaintenanceRecord[]>> => {
  return apiClient.get<MaintenanceRecord[]>('/admin/maintenance/alerts');
};

// Fuel Management
export const getFuelRecords = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    vehicleId?: string;
    driverId?: string;
    dateRange?: { startDate: string; endDate: string };
  }
): Promise<PaginatedResponse<FuelRecord>> => {
  return apiClient.get<FuelRecord[]>('/admin/fuel', {
    page,
    limit,
    ...filters,
  });
};

export const approveFuelEntry = async (recordId: string): Promise<ApiResponse<FuelRecord>> => {
  return apiClient.post<FuelRecord>(`/admin/fuel/${recordId}/approve`);
};

export const getFuelAnalytics = async (
  period: string,
  vehicleId?: string
): Promise<ApiResponse<any>> => {
  return apiClient.get<any>('/admin/fuel/analytics', {
    period,
    vehicleId,
  });
};

// Campaign Management
export const getCampaigns = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    status?: string;
    clientName?: string;
  }
): Promise<PaginatedResponse<Campaign>> => {
  return apiClient.get<Campaign[]>('/admin/campaigns', {
    page,
    limit,
    ...filters,
  });
};

export const createCampaign = async (campaignData: Partial<Campaign>): Promise<ApiResponse<Campaign>> => {
  return apiClient.post<Campaign>('/admin/campaigns', campaignData);
};

export const updateCampaign = async (
  campaignId: string,
  campaignData: Partial<Campaign>
): Promise<ApiResponse<Campaign>> => {
  return apiClient.put<Campaign>(`/admin/campaigns/${campaignId}`, campaignData);
};

export const assignVehiclesToCampaign = async (
  campaignId: string,
  vehicleIds: string[]
): Promise<ApiResponse<Campaign>> => {
  return apiClient.post<Campaign>(`/admin/campaigns/${campaignId}/assign-vehicles`, {
    vehicleIds,
  });
};

// Attendance Management
export const getAllAttendance = async (
  date: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Attendance>> => {
  return apiClient.get<Attendance[]>('/admin/attendance', {
    date,
    page,
    limit,
  });
};

export const getAttendanceReport = async (
  startDate: string,
  endDate: string,
  driverId?: string
): Promise<ApiResponse<any>> => {
  return apiClient.get<any>('/admin/attendance/report', {
    startDate,
    endDate,
    driverId,
  });
};

export const markAttendance = async (
  driverId: string,
  attendanceData: Partial<Attendance>
): Promise<ApiResponse<Attendance>> => {
  return apiClient.post<Attendance>('/admin/attendance', {
    driverId,
    ...attendanceData,
  });
};

// Document Management
export const uploadDocument = async (
  entityType: 'vehicle' | 'driver',
  entityId: string,
  documentType: string,
  file: FormData
): Promise<ApiResponse<any>> => {
  return apiClient.uploadFile<any>(
    `/admin/documents/${entityType}/${entityId}/${documentType}`,
    file
  );
};

export const getDocuments = async (
  entityType: 'vehicle' | 'driver',
  entityId: string
): Promise<ApiResponse<any[]>> => {
  return apiClient.get<any[]>(`/admin/documents/${entityType}/${entityId}`);
};

export const getExpiringDocuments = async (): Promise<ApiResponse<any[]>> => {
  return apiClient.get<any[]>('/admin/documents/expiring');
};

// Reports and Analytics
export const generateReport = async (
  reportType: string,
  parameters: any
): Promise<ApiResponse<Report>> => {
  return apiClient.post<Report>('/admin/reports/generate', {
    type: reportType,
    parameters,
  });
};

export const getReportHistory = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Report>> => {
  return apiClient.get<Report[]>('/admin/reports', {
    page,
    limit,
  });
};

export const downloadReport = async (reportId: string): Promise<ApiResponse<Blob>> => {
  return apiClient.get<Blob>(`/admin/reports/${reportId}/download`);
};

export const getAnalyticsData = async (
  metric: string,
  period: string,
  filters?: any
): Promise<ApiResponse<any>> => {
  return apiClient.get<any>('/admin/analytics', {
    metric,
    period,
    ...filters,
  });
};

// Notification Management
export const sendNotification = async (
  recipientType: 'driver' | 'all',
  recipientId: string | null,
  title: string,
  message: string,
  data?: any
): Promise<ApiResponse<void>> => {
  return apiClient.post<void>('/admin/notifications/send', {
    recipientType,
    recipientId,
    title,
    message,
    data,
  });
};

export const getNotificationHistory = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<any>> => {
  return apiClient.get<any[]>('/admin/notifications', {
    page,
    limit,
  });
};

// System Settings
export const getSystemSettings = async (): Promise<ApiResponse<any>> => {
  return apiClient.get<any>('/admin/settings');
};

export const updateSystemSettings = async (settings: any): Promise<ApiResponse<any>> => {
  return apiClient.put<any>('/admin/settings', settings);
};

export const backupData = async (): Promise<ApiResponse<void>> => {
  return apiClient.post<void>('/admin/system/backup');
};

export const getSystemHealth = async (): Promise<ApiResponse<any>> => {
  return apiClient.get<any>('/admin/system/health');
};