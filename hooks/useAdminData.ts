// Powered by OnSpace.AI
import { useState, useEffect, useCallback } from 'react';
import { 
  Vehicle, 
  Driver, 
  MoneyRequest, 
  DashboardStats,
  Campaign,
  MaintenanceRecord,
  FuelRecord,
  Attendance
} from '../types';
import * as adminApi from '../services/endpoints/admin';

// Dashboard Hook
export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getDashboardStats();
      
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

// Fleet Management Hook
export const useFleetData = (filters?: any) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchVehicles = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getVehicles(page, pagination.limit, filters);
      
      if (response.success && response.data) {
        setVehicles(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit]);

  const createVehicle = useCallback(async (vehicleData: Partial<Vehicle>) => {
    try {
      const response = await adminApi.createVehicle(vehicleData);
      if (response.success) {
        await fetchVehicles(pagination.page);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create vehicle' 
      };
    }
  }, [fetchVehicles, pagination.page]);

  const updateVehicle = useCallback(async (vehicleId: string, vehicleData: Partial<Vehicle>) => {
    try {
      const response = await adminApi.updateVehicle(vehicleId, vehicleData);
      if (response.success) {
        await fetchVehicles(pagination.page);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update vehicle' 
      };
    }
  }, [fetchVehicles, pagination.page]);

  const deleteVehicle = useCallback(async (vehicleId: string) => {
    try {
      const response = await adminApi.deleteVehicle(vehicleId);
      if (response.success) {
        await fetchVehicles(pagination.page);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete vehicle' 
      };
    }
  }, [fetchVehicles, pagination.page]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    loading,
    error,
    pagination,
    refetch: fetchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  };
};

// Driver Management Hook
export const useDriversData = (filters?: any) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchDrivers = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getDrivers(page, pagination.limit, filters);
      
      if (response.success && response.data) {
        setDrivers(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit]);

  const createDriver = useCallback(async (driverData: Partial<Driver>) => {
    try {
      const response = await adminApi.createDriver(driverData);
      if (response.success) {
        await fetchDrivers(pagination.page);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create driver' 
      };
    }
  }, [fetchDrivers, pagination.page]);

  const updateDriver = useCallback(async (driverId: string, driverData: Partial<Driver>) => {
    try {
      const response = await adminApi.updateDriver(driverId, driverData);
      if (response.success) {
        await fetchDrivers(pagination.page);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update driver' 
      };
    }
  }, [fetchDrivers, pagination.page]);

  const deactivateDriver = useCallback(async (driverId: string) => {
    try {
      const response = await adminApi.deactivateDriver(driverId);
      if (response.success) {
        await fetchDrivers(pagination.page);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to deactivate driver' 
      };
    }
  }, [fetchDrivers, pagination.page]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  return {
    drivers,
    loading,
    error,
    pagination,
    refetch: fetchDrivers,
    createDriver,
    updateDriver,
    deactivateDriver,
  };
};

// Money Requests Hook
export const useMoneyRequests = (filters?: any) => {
  const [requests, setRequests] = useState<MoneyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    totalAmount: 0,
  });

  const fetchRequests = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getMoneyRequests(page, 10, filters);
      
      if (response.success && response.data) {
        setRequests(response.data);
        
        // Calculate stats
        const pending = response.data.filter(r => r.status === 'pending').length;
        const approved = response.data.filter(r => r.status === 'approved').length;
        const rejected = response.data.filter(r => r.status === 'rejected').length;
        const totalAmount = response.data
          .filter(r => r.status === 'pending')
          .reduce((sum, r) => sum + r.amount, 0);
        
        setStats({ pending, approved, rejected, totalAmount });
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const approveRequest = useCallback(async (
    requestId: string, 
    paymentMethod: string, 
    transactionId?: string
  ) => {
    try {
      const response = await adminApi.approveMoneyRequest(requestId, paymentMethod, transactionId);
      if (response.success) {
        await fetchRequests();
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to approve request' 
      };
    }
  }, [fetchRequests]);

  const rejectRequest = useCallback(async (requestId: string, rejectionReason: string) => {
    try {
      const response = await adminApi.rejectMoneyRequest(requestId, rejectionReason);
      if (response.success) {
        await fetchRequests();
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to reject request' 
      };
    }
  }, [fetchRequests]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    stats,
    loading,
    error,
    refetch: fetchRequests,
    approveRequest,
    rejectRequest,
  };
};

// Maintenance Hook
export const useMaintenanceData = (filters?: any) => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upcomingMaintenance, setUpcomingMaintenance] = useState<MaintenanceRecord[]>([]);

  const fetchMaintenanceRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [recordsResponse, upcomingResponse] = await Promise.all([
        adminApi.getMaintenanceRecords(1, 10, filters),
        adminApi.getUpcomingMaintenance(),
      ]);
      
      if (recordsResponse.success && recordsResponse.data) {
        setRecords(recordsResponse.data);
      }
      
      if (upcomingResponse.success && upcomingResponse.data) {
        setUpcomingMaintenance(upcomingResponse.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch maintenance data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createMaintenanceRecord = useCallback(async (data: Partial<MaintenanceRecord>) => {
    try {
      const response = await adminApi.createMaintenanceRecord(data);
      if (response.success) {
        await fetchMaintenanceRecords();
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create maintenance record' 
      };
    }
  }, [fetchMaintenanceRecords]);

  useEffect(() => {
    fetchMaintenanceRecords();
  }, [fetchMaintenanceRecords]);

  return {
    records,
    upcomingMaintenance,
    loading,
    error,
    refetch: fetchMaintenanceRecords,
    createRecord: createMaintenanceRecord,
  };
};

// Attendance Hook
export const useAttendanceData = (date?: string) => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const currentDate = date || new Date().toISOString().split('T')[0];
      const response = await adminApi.getAllAttendance(currentDate);
      
      if (response.success && response.data) {
        setAttendance(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  }, [date]);

  const markAttendance = useCallback(async (driverId: string, attendanceData: Partial<Attendance>) => {
    try {
      const response = await adminApi.markAttendance(driverId, attendanceData);
      if (response.success) {
        await fetchAttendance();
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to mark attendance' 
      };
    }
  }, [fetchAttendance]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return {
    attendance,
    loading,
    error,
    refetch: fetchAttendance,
    markAttendance,
  };
};