
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using VMS.Backend.Data;
using VMS.Backend.DTOs;
using VMS.Backend.Models;

namespace VMS.Backend.Services;

public class FuelService : IFuelService
{
    private readonly VMSDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public FuelService(VMSDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<List<FuelRecordResponse>> GetFuelRecordsAsync(int vehicleId)
    {
        var records = await _context.FuelRecords
            .Include(f => f.Vehicle)
            .Include(f => f.RecordedBy)
            .Where(f => f.VehicleId == vehicleId)
            .OrderByDescending(f => f.FuelDate)
            .ToListAsync();

        return records.Select(MapToResponse).ToList();
    }

    public async Task<FuelRecordResponse> CreateFuelRecordAsync(FuelRecordRequest request)
    {
        var userId = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // Calculate fuel efficiency if previous record exists
        var previousRecord = await _context.FuelRecords
            .Where(f => f.VehicleId == request.VehicleId && f.OdometerReading < request.OdometerReading)
            .OrderByDescending(f => f.OdometerReading)
            .FirstOrDefaultAsync();

        decimal? fuelEfficiency = null;
        if (previousRecord != null)
        {
            var distance = request.OdometerReading - previousRecord.OdometerReading;
            if (distance > 0 && request.FuelAmount > 0)
            {
                fuelEfficiency = distance / request.FuelAmount; // MPG or KM/L
            }
        }

        var record = new FuelRecord
        {
            VehicleId = request.VehicleId,
            FuelAmount = request.FuelAmount,
            Cost = request.Cost,
            PricePerUnit = request.PricePerUnit,
            OdometerReading = request.OdometerReading,
            FuelEfficiency = fuelEfficiency,
            FuelStation = request.FuelStation,
            FuelDate = request.FuelDate,
            ReceiptImagePath = request.ReceiptImagePath,
            RecordedById = userId
        };

        _context.FuelRecords.Add(record);

        // Update vehicle mileage
        var vehicle = await _context.Vehicles.FindAsync(request.VehicleId);
        if (vehicle != null && request.OdometerReading > vehicle.Mileage)
        {
            vehicle.Mileage = request.OdometerReading;
            vehicle.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return await GetFuelRecordResponseAsync(record.Id);
    }

    public async Task<FuelRecordResponse> UpdateFuelRecordAsync(int id, FuelRecordRequest request)
    {
        var record = await _context.FuelRecords.FindAsync(id);
        if (record == null)
        {
            throw new NotFoundException("Fuel record not found");
        }

        record.FuelAmount = request.FuelAmount;
        record.Cost = request.Cost;
        record.PricePerUnit = request.PricePerUnit;
        record.OdometerReading = request.OdometerReading;
        record.FuelStation = request.FuelStation;
        record.FuelDate = request.FuelDate;
        record.ReceiptImagePath = request.ReceiptImagePath;
        record.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetFuelRecordResponseAsync(id);
    }

    public async Task<bool> DeleteFuelRecordAsync(int id)
    {
        var record = await _context.FuelRecords.FindAsync(id);
        if (record == null)
        {
            throw new NotFoundException("Fuel record not found");
        }

        _context.FuelRecords.Remove(record);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<FuelEfficiencyReport> GetFuelEfficiencyReportAsync(int vehicleId, DateTime startDate, DateTime endDate)
    {
        var records = await _context.FuelRecords
            .Include(f => f.Vehicle)
            .Where(f => f.VehicleId == vehicleId && f.FuelDate >= startDate && f.FuelDate <= endDate)
            .OrderBy(f => f.FuelDate)
            .ToListAsync();

        if (!records.Any())
        {
            var vehicle = await _context.Vehicles.FindAsync(vehicleId);
            return new FuelEfficiencyReport
            {
                VehicleId = vehicleId,
                VehicleInfo = vehicle != null ? $"{vehicle.Make} {vehicle.Model} ({vehicle.Year})" : "Unknown Vehicle"
            };
        }

        var totalFuel = records.Sum(r => r.FuelAmount);
        var totalCost = records.Sum(r => r.Cost);
        var totalDistance = records.Max(r => r.OdometerReading) - records.Min(r => r.OdometerReading);
        var averageEfficiency = totalDistance > 0 && totalFuel > 0 ? totalDistance / totalFuel : 0;

        return new FuelEfficiencyReport
        {
            VehicleId = vehicleId,
            VehicleInfo = $"{records.First().Vehicle?.Make} {records.First().Vehicle?.Model} ({records.First().Vehicle?.Year})",
            AverageEfficiency = averageEfficiency,
            TotalFuelConsumed = totalFuel,
            TotalCost = totalCost,
            TotalDistance = totalDistance,
            Records = records.Select(MapToResponse).ToList()
        };
    }

    private async Task<FuelRecordResponse> GetFuelRecordResponseAsync(int id)
    {
        var record = await _context.FuelRecords
            .Include(f => f.Vehicle)
            .Include(f => f.RecordedBy)
            .FirstOrDefaultAsync(f => f.Id == id);

        if (record == null)
        {
            throw new NotFoundException("Fuel record not found");
        }

        return MapToResponse(record);
    }

    private static FuelRecordResponse MapToResponse(FuelRecord record)
    {
        return new FuelRecordResponse
        {
            Id = record.Id,
            VehicleId = record.VehicleId,
            VehicleInfo = $"{record.Vehicle?.Make} {record.Vehicle?.Model} ({record.Vehicle?.Year})",
            FuelAmount = record.FuelAmount,
            Cost = record.Cost,
            PricePerUnit = record.PricePerUnit,
            OdometerReading = record.OdometerReading,
            FuelEfficiency = record.FuelEfficiency,
            FuelStation = record.FuelStation,
            FuelDate = record.FuelDate,
            ReceiptImagePath = record.ReceiptImagePath,
            RecordedById = record.RecordedById,
            RecordedByName = record.RecordedBy != null ? $"{record.RecordedBy.FirstName} {record.RecordedBy.LastName}" : null,
            CreatedAt = record.CreatedAt
        };
    }
}
