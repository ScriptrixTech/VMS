
using VMS.Backend.DTOs;

namespace VMS.Backend.Services;

public interface IVehicleService
{
    Task<VehicleResponse> CreateVehicleAsync(VehicleRequest request);
    Task<VehicleResponse> GetVehicleByIdAsync(int id);
    Task<List<VehicleResponse>> GetVehiclesAsync(VehicleSearchRequest searchRequest);
    Task<VehicleResponse> UpdateVehicleAsync(int id, VehicleRequest request);
    Task<bool> DeleteVehicleAsync(int id);
    Task<bool> AssignVehicleAsync(int vehicleId, VehicleAssignRequest request);
    Task<bool> UnassignVehicleAsync(int vehicleId);
    Task<bool> ValidateVINAsync(string vin);
}
