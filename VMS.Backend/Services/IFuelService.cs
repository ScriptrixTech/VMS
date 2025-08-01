
using VMS.Backend.DTOs;

namespace VMS.Backend.Services;

public interface IFuelService
{
    Task<IEnumerable<FuelRecordResponse>> GetFuelRecordsAsync(Guid vehicleId);
    Task<FuelRecordResponse> GetFuelRecordByIdAsync(Guid id);
    Task<FuelRecordResponse> CreateFuelRecordAsync(FuelRecordRequest request, string userId);
    Task<FuelRecordResponse> UpdateFuelRecordAsync(Guid id, FuelRecordRequest request);
    Task DeleteFuelRecordAsync(Guid id);
    Task<FuelEfficiencyReport> GetFuelEfficiencyReportAsync(Guid vehicleId, DateTime? startDate, DateTime? endDate);
}
