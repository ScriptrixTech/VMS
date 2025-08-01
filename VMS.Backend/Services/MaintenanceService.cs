
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using VMS.Backend.Data;
using VMS.Backend.DTOs;
using VMS.Backend.Models;

namespace VMS.Backend.Services;

public class MaintenanceService : IMaintenanceService
{
    private readonly VMSDbContext _context;

    public MaintenanceService(VMSDbContext context)
    {
        _context = context;
    }

    public async Task<MaintenanceRecordResponseDto> CreateMaintenanceRecordAsync(CreateMaintenanceRecordDto createDto, ClaimsPrincipal user)
    {
        var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var maintenanceRecord = new MaintenanceRecord
        {
            VehicleId = createDto.VehicleId,
            Title = createDto.Title,
            Description = createDto.Description,
            ServiceType = createDto.ServiceType,
            Cost = createDto.Cost,
            ServiceDate = createDto.ServiceDate,
            NextServiceDate = createDto.NextServiceDate,
            Status = createDto.Status,
            PerformedById = userId,
            ServiceProvider = createDto.ServiceProvider,
            Mileage = createDto.Mileage
        };

        _context.MaintenanceRecords.Add(maintenanceRecord);
        await _context.SaveChangesAsync();

        return await GetMaintenanceRecordResponseDto(maintenanceRecord);
    }

    public async Task<MaintenanceRecordResponseDto?> GetMaintenanceRecordByIdAsync(Guid id)
    {
        var record = await _context.MaintenanceRecords
            .Include(m => m.Vehicle)
            .Include(m => m.PerformedBy)
            .FirstOrDefaultAsync(m => m.Id == id);

        return record == null ? null : await GetMaintenanceRecordResponseDto(record);
    }

    public async Task<PagedResult<MaintenanceRecordResponseDto>> GetMaintenanceRecordsAsync(
        int pageNumber, int pageSize, Guid? vehicleId, string? serviceType, MaintenanceStatus? status)
    {
        var query = _context.MaintenanceRecords
            .Include(m => m.Vehicle)
            .Include(m => m.PerformedBy)
            .AsQueryable();

        if (vehicleId.HasValue)
        {
            query = query.Where(m => m.VehicleId == vehicleId.Value);
        }

        if (!string.IsNullOrEmpty(serviceType))
        {
            query = query.Where(m => m.ServiceType == serviceType);
        }

        if (status.HasValue)
        {
            query = query.Where(m => m.Status == status.Value);
        }

        var totalCount = await query.CountAsync();
        var records = await query
            .OrderByDescending(m => m.ServiceDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var recordDtos = new List<MaintenanceRecordResponseDto>();
        foreach (var record in records)
        {
            recordDtos.Add(await GetMaintenanceRecordResponseDto(record));
        }

        return new PagedResult<MaintenanceRecordResponseDto>
        {
            Items = recordDtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<MaintenanceRecordResponseDto?> UpdateMaintenanceRecordAsync(Guid id, UpdateMaintenanceRecordDto updateDto)
    {
        var record = await _context.MaintenanceRecords.FindAsync(id);
        if (record == null) return null;

        record.Title = updateDto.Title;
        record.Description = updateDto.Description;
        record.ServiceType = updateDto.ServiceType;
        record.Cost = updateDto.Cost;
        record.ServiceDate = updateDto.ServiceDate;
        record.NextServiceDate = updateDto.NextServiceDate;
        record.Status = updateDto.Status;
        record.ServiceProvider = updateDto.ServiceProvider;
        record.Mileage = updateDto.Mileage;
        record.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return await GetMaintenanceRecordResponseDto(record);
    }

    public async Task<bool> DeleteMaintenanceRecordAsync(Guid id)
    {
        var record = await _context.MaintenanceRecords.FindAsync(id);
        if (record == null) return false;

        _context.MaintenanceRecords.Remove(record);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<MaintenanceRecordResponseDto>> GetOverdueMaintenanceAsync()
    {
        var overdueRecords = await _context.MaintenanceRecords
            .Include(m => m.Vehicle)
            .Include(m => m.PerformedBy)
            .Where(m => m.NextServiceDate.HasValue && 
                       m.NextServiceDate.Value < DateTime.UtcNow && 
                       m.Status != MaintenanceStatus.Completed)
            .OrderBy(m => m.NextServiceDate)
            .ToListAsync();

        var recordDtos = new List<MaintenanceRecordResponseDto>();
        foreach (var record in overdueRecords)
        {
            recordDtos.Add(await GetMaintenanceRecordResponseDto(record));
        }

        return recordDtos;
    }

    public async Task<List<MaintenanceRecordResponseDto>> GetUpcomingMaintenanceAsync(int days = 30)
    {
        var upcomingDate = DateTime.UtcNow.AddDays(days);
        var upcomingRecords = await _context.MaintenanceRecords
            .Include(m => m.Vehicle)
            .Include(m => m.PerformedBy)
            .Where(m => m.NextServiceDate.HasValue && 
                       m.NextServiceDate.Value >= DateTime.UtcNow && 
                       m.NextServiceDate.Value <= upcomingDate &&
                       m.Status != MaintenanceStatus.Completed)
            .OrderBy(m => m.NextServiceDate)
            .ToListAsync();

        var recordDtos = new List<MaintenanceRecordResponseDto>();
        foreach (var record in upcomingRecords)
        {
            recordDtos.Add(await GetMaintenanceRecordResponseDto(record));
        }

        return recordDtos;
    }

    private async Task<MaintenanceRecordResponseDto> GetMaintenanceRecordResponseDto(MaintenanceRecord record)
    {
        if (record.Vehicle == null)
        {
            record.Vehicle = await _context.Vehicles.FindAsync(record.VehicleId);
        }

        if (record.PerformedBy == null && record.PerformedById != null)
        {
            record.PerformedBy = await _context.Users.FindAsync(record.PerformedById);
        }

        return new MaintenanceRecordResponseDto
        {
            Id = record.Id,
            VehicleId = record.VehicleId,
            VehicleInfo = record.Vehicle != null ? $"{record.Vehicle.Make} {record.Vehicle.Model} ({record.Vehicle.LicensePlate})" : "Unknown Vehicle",
            Title = record.Title,
            Description = record.Description,
            ServiceType = record.ServiceType,
            Cost = record.Cost,
            ServiceDate = record.ServiceDate,
            NextServiceDate = record.NextServiceDate,
            Status = record.Status,
            PerformedById = record.PerformedById,
            PerformedByName = record.PerformedBy != null ? $"{record.PerformedBy.FirstName} {record.PerformedBy.LastName}" : null,
            ServiceProvider = record.ServiceProvider,
            Mileage = record.Mileage,
            CreatedAt = record.CreatedAt,
            UpdatedAt = record.UpdatedAt
        };
    }
}
