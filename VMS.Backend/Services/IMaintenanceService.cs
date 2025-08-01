
using VMS.Backend.DTOs;

namespace VMS.Backend.Services;

public interface IMaintenanceService
{
    Task<List<MaintenanceRecordResponse>> GetMaintenanceRecordsAsync(int vehicleId);
    Task<MaintenanceRecordResponse> CreateMaintenanceRecordAsync(MaintenanceRecordRequest request);
    Task<MaintenanceRecordResponse> UpdateMaintenanceRecordAsync(int id, MaintenanceRecordRequest request);
    Task<bool> DeleteMaintenanceRecordAsync(int id);
    Task<List<MaintenanceRecordResponse>> GetUpcomingMaintenanceAsync();
    Task<List<MaintenanceRecordResponse>> GetOverdueMaintenanceAsync();
}

public interface IFuelService
{
    Task<List<FuelRecordResponse>> GetFuelRecordsAsync(int vehicleId);
    Task<FuelRecordResponse> CreateFuelRecordAsync(FuelRecordRequest request);
    Task<FuelRecordResponse> UpdateFuelRecordAsync(int id, FuelRecordRequest request);
    Task<bool> DeleteFuelRecordAsync(int id);
    Task<FuelEfficiencyReport> GetFuelEfficiencyReportAsync(int vehicleId, DateTime startDate, DateTime endDate);
}

public interface IReportService
{
    Task<DashboardStatsResponse> GetDashboardStatsAsync();
    Task<byte[]> GenerateVehicleReportAsync(ReportRequest request);
    Task<byte[]> GenerateMaintenanceReportAsync(ReportRequest request);
    Task<byte[]> GenerateFuelReportAsync(ReportRequest request);
}

public interface IUserService
{
    Task<List<UserResponse>> GetUsersAsync();
    Task<UserResponse> GetUserByIdAsync(string id);
    Task<bool> UpdateUserRoleAsync(string userId, string role);
    Task<bool> DeactivateUserAsync(string userId);
    Task<bool> ActivateUserAsync(string userId);
}
