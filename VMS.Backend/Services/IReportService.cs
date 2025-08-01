
using VMS.Backend.DTOs;

namespace VMS.Backend.Services;

public interface IReportService
{
    Task<DashboardStatsResponse> GetDashboardStatsAsync();
    Task<VehicleUtilizationReport> GetVehicleUtilizationReportAsync(DateTime startDate, DateTime endDate);
    Task<MaintenanceCostReport> GetMaintenanceCostReportAsync(DateTime startDate, DateTime endDate);
    Task<FuelCostReport> GetFuelCostReportAsync(DateTime startDate, DateTime endDate);
    Task<byte[]> ExportVehicleDataToPdfAsync();
    Task<byte[]> ExportMaintenanceDataToCsvAsync();
}
