
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using VMS.Backend.Data;
using VMS.Backend.DTOs;
using VMS.Backend.Models;

namespace VMS.Backend.Services;

public class FuelService : IFuelService
{
    private readonly VMSDbContext _context;

    public FuelService(VMSDbContext context)
    {
        _context = context;
    }

    public async Task<FuelRecordResponseDto> CreateFuelRecordAsync(CreateFuelRecordDto createDto, ClaimsPrincipal user)
    {
        var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // Calculate fuel efficiency if we have previous data
        decimal? fuelEfficiency = null;
        var previousRecord = await _context.FuelRecords
            .Where(f => f.VehicleId == createDto.VehicleId && f.FuelDate < createDto.FuelDate)
            .OrderByDescending(f => f.FuelDate)
            .FirstOrDefaultAsync();

        if (previousRecord != null && previousRecord.Mileage < createDto.Mileage)
        {
            var distanceTraveled = createDto.Mileage - previousRecord.Mileage;
            fuelEfficiency = distanceTraveled / createDto.FuelAmount;
        }

        var fuelRecord = new FuelRecord
        {
            VehicleId = createDto.VehicleId,
            FuelAmount = createDto.FuelAmount,
            Cost = createDto.Cost,
            PricePerUnit = createDto.PricePerUnit,
            Mileage = createDto.Mileage,
            FuelEfficiency = fuelEfficiency,
            FuelDate = createDto.FuelDate,
            Location = createDto.Location,
            RecordedById = userId
        };

        _context.FuelRecords.Add(fuelRecord);
        await _context.SaveChangesAsync();

        return await GetFuelRecordResponseDto(fuelRecord);
    }

    public async Task<FuelRecordResponseDto?> GetFuelRecordByIdAsync(Guid id)
    {
        var record = await _context.FuelRecords
            .Include(f => f.Vehicle)
            .Include(f => f.RecordedBy)
            .FirstOrDefaultAsync(f => f.Id == id);

        return record == null ? null : await GetFuelRecordResponseDto(record);
    }

    public async Task<PagedResult<FuelRecordResponseDto>> GetFuelRecordsAsync(
        int pageNumber, int pageSize, Guid? vehicleId, DateTime? fromDate, DateTime? toDate)
    {
        var query = _context.FuelRecords
            .Include(f => f.Vehicle)
            .Include(f => f.RecordedBy)
            .AsQueryable();

        if (vehicleId.HasValue)
        {
            query = query.Where(f => f.VehicleId == vehicleId.Value);
        }

        if (fromDate.HasValue)
        {
            query = query.Where(f => f.FuelDate >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(f => f.FuelDate <= toDate.Value);
        }

        var totalCount = await query.CountAsync();
        var records = await query
            .OrderByDescending(f => f.FuelDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var recordDtos = new List<FuelRecordResponseDto>();
        foreach (var record in records)
        {
            recordDtos.Add(await GetFuelRecordResponseDto(record));
        }

        return new PagedResult<FuelRecordResponseDto>
        {
            Items = recordDtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<FuelRecordResponseDto?> UpdateFuelRecordAsync(Guid id, UpdateFuelRecordDto updateDto)
    {
        var record = await _context.FuelRecords.FindAsync(id);
        if (record == null) return null;

        // Recalculate fuel efficiency if mileage or fuel amount changed
        if (record.Mileage != updateDto.Mileage || record.FuelAmount != updateDto.FuelAmount)
        {
            var previousRecord = await _context.FuelRecords
                .Where(f => f.VehicleId == record.VehicleId && f.FuelDate < record.FuelDate && f.Id != id)
                .OrderByDescending(f => f.FuelDate)
                .FirstOrDefaultAsync();

            if (previousRecord != null && previousRecord.Mileage < updateDto.Mileage)
            {
                var distanceTraveled = updateDto.Mileage - previousRecord.Mileage;
                record.FuelEfficiency = distanceTraveled / updateDto.FuelAmount;
            }
            else
            {
                record.FuelEfficiency = null;
            }
        }

        record.FuelAmount = updateDto.FuelAmount;
        record.Cost = updateDto.Cost;
        record.PricePerUnit = updateDto.PricePerUnit;
        record.Mileage = updateDto.Mileage;
        record.FuelDate = updateDto.FuelDate;
        record.Location = updateDto.Location;

        await _context.SaveChangesAsync();
        return await GetFuelRecordResponseDto(record);
    }

    public async Task<bool> DeleteFuelRecordAsync(Guid id)
    {
        var record = await _context.FuelRecords.FindAsync(id);
        if (record == null) return false;

        _context.FuelRecords.Remove(record);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<FuelAnalyticsDto> GetFuelAnalyticsAsync(Guid? vehicleId, DateTime? fromDate, DateTime? toDate)
    {
        var query = _context.FuelRecords.AsQueryable();

        if (vehicleId.HasValue)
        {
            query = query.Where(f => f.VehicleId == vehicleId.Value);
        }

        if (fromDate.HasValue)
        {
            query = query.Where(f => f.FuelDate >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(f => f.FuelDate <= toDate.Value);
        }

        var records = await query.ToListAsync();

        if (!records.Any())
        {
            return new FuelAnalyticsDto
            {
                TotalCost = 0,
                TotalFuelAmount = 0,
                AveragePricePerUnit = 0,
                AverageFuelEfficiency = 0,
                TotalRecords = 0
            };
        }

        return new FuelAnalyticsDto
        {
            TotalCost = records.Sum(f => f.Cost),
            TotalFuelAmount = records.Sum(f => f.FuelAmount),
            AveragePricePerUnit = records.Average(f => f.PricePerUnit),
            AverageFuelEfficiency = records.Where(f => f.FuelEfficiency.HasValue).Average(f => f.FuelEfficiency) ?? 0,
            TotalRecords = records.Count
        };
    }

    private async Task<FuelRecordResponseDto> GetFuelRecordResponseDto(FuelRecord record)
    {
        if (record.Vehicle == null)
        {
            record.Vehicle = await _context.Vehicles.FindAsync(record.VehicleId);
        }

        if (record.RecordedBy == null && record.RecordedById != null)
        {
            record.RecordedBy = await _context.Users.FindAsync(record.RecordedById);
        }

        return new FuelRecordResponseDto
        {
            Id = record.Id,
            VehicleId = record.VehicleId,
            VehicleInfo = record.Vehicle != null ? $"{record.Vehicle.Make} {record.Vehicle.Model} ({record.Vehicle.LicensePlate})" : "Unknown Vehicle",
            FuelAmount = record.FuelAmount,
            Cost = record.Cost,
            PricePerUnit = record.PricePerUnit,
            Mileage = record.Mileage,
            FuelEfficiency = record.FuelEfficiency,
            FuelDate = record.FuelDate,
            Location = record.Location,
            RecordedById = record.RecordedById,
            RecordedByName = record.RecordedBy != null ? $"{record.RecordedBy.FirstName} {record.RecordedBy.LastName}" : null,
            CreatedAt = record.CreatedAt
        };
    }
}

public interface IFuelService
{
    Task<FuelRecordResponseDto> CreateFuelRecordAsync(CreateFuelRecordDto createDto, ClaimsPrincipal user);
    Task<FuelRecordResponseDto?> GetFuelRecordByIdAsync(Guid id);
    Task<PagedResult<FuelRecordResponseDto>> GetFuelRecordsAsync(int pageNumber, int pageSize, Guid? vehicleId, DateTime? fromDate, DateTime? toDate);
    Task<FuelRecordResponseDto?> UpdateFuelRecordAsync(Guid id, UpdateFuelRecordDto updateDto);
    Task<bool> DeleteFuelRecordAsync(Guid id);
    Task<FuelAnalyticsDto> GetFuelAnalyticsAsync(Guid? vehicleId, DateTime? fromDate, DateTime? toDate);
}
