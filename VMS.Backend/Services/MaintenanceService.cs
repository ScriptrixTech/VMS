
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using VMS.Backend.Data;
using VMS.Backend.DTOs;
using VMS.Backend.Models;

namespace VMS.Backend.Services;

public class MaintenanceService : IMaintenanceService
{
    private readonly VMSDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public MaintenanceService(VMSDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<List<MaintenanceRecordResponse>> GetMaintenanceRecordsAsync(int vehicleId)
    {
        var records = await _context.MaintenanceRecords
            .Include(m => m.Vehicle)
            .Include(m => m.PerformedBy)
            .Where(m => m.VehicleId == vehicleId)
            .OrderByDescending(m => m.ServiceDate)
            .ToListAsync();

        return records.Select(MapToResponse).ToList();
    }

    public async Task<MaintenanceRecordResponse> CreateMaintenanceRecordAsync(MaintenanceRecordRequest request)
    {
        var userId = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var record = new MaintenanceRecord
        {
            VehicleId = request.VehicleId,
            Type = request.Type,
            Description = request.Description,
            Cost = request.Cost,
            ServiceProvider = request.ServiceProvider,
            ServiceDate = request.ServiceDate,
            NextServiceDue = request.NextServiceDue,
            Parts = request.Parts,
            Status = request.Status,
            ReceiptImagePath = request.ReceiptImagePath,
            PerformedById = userId
        };

        _context.MaintenanceRecords.Add(record);
        await _context.SaveChangesAsync();

        // Update vehicle mileage and status if needed
        var vehicle = await _context.Vehicles.FindAsync(request.VehicleId);
        if (vehicle != null && request.Status == MaintenanceStatus.InProgress)
        {
            vehicle.Status = VehicleStatus.Maintenance;
            await _context.SaveChangesAsync();
        }

        return await GetMaintenanceRecordResponseAsync(record.Id);
    }

    public async Task<MaintenanceRecordResponse> UpdateMaintenanceRecordAsync(int id, MaintenanceRecordRequest request)
    {
        var record = await _context.MaintenanceRecords.FindAsync(id);
        if (record == null)
        {
            throw new NotFoundException("Maintenance record not found");
        }

        record.Type = request.Type;
        record.Description = request.Description;
        record.Cost = request.Cost;
        record.ServiceProvider = request.ServiceProvider;
        record.ServiceDate = request.ServiceDate;
        record.NextServiceDue = request.NextServiceDue;
        record.Parts = request.Parts;
        record.Status = request.Status;
        record.ReceiptImagePath = request.ReceiptImagePath;
        record.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetMaintenanceRecordResponseAsync(id);
    }

    public async Task<bool> DeleteMaintenanceRecordAsync(int id)
    {
        var record = await _context.MaintenanceRecords.FindAsync(id);
        if (record == null)
        {
            throw new NotFoundException("Maintenance record not found");
        }

        _context.MaintenanceRecords.Remove(record);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<List<MaintenanceRecordResponse>> GetUpcomingMaintenanceAsync()
    {
        var upcoming = await _context.MaintenanceRecords
            .Include(m => m.Vehicle)
            .Include(m => m.PerformedBy)
            .Where(m => m.NextServiceDue.HasValue && m.NextServiceDue.Value <= DateTime.UtcNow.AddDays(30))
            .OrderBy(m => m.NextServiceDue)
            .ToListAsync();

        return upcoming.Select(MapToResponse).ToList();
    }

    public async Task<List<MaintenanceRecordResponse>> GetOverdueMaintenanceAsync()
    {
        var overdue = await _context.MaintenanceRecords
            .Include(m => m.Vehicle)
            .Include(m => m.PerformedBy)
            .Where(m => m.NextServiceDue.HasValue && m.NextServiceDue.Value < DateTime.UtcNow)
            .OrderBy(m => m.NextServiceDue)
            .ToListAsync();

        return overdue.Select(MapToResponse).ToList();
    }

    private async Task<MaintenanceRecordResponse> GetMaintenanceRecordResponseAsync(int id)
    {
        var record = await _context.MaintenanceRecords
            .Include(m => m.Vehicle)
            .Include(m => m.PerformedBy)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (record == null)
        {
            throw new NotFoundException("Maintenance record not found");
        }

        return MapToResponse(record);
    }

    private static MaintenanceRecordResponse MapToResponse(MaintenanceRecord record)
    {
        return new MaintenanceRecordResponse
        {
            Id = record.Id,
            VehicleId = record.VehicleId,
            VehicleInfo = $"{record.Vehicle?.Make} {record.Vehicle?.Model} ({record.Vehicle?.Year})",
            Type = record.Type,
            Description = record.Description,
            Cost = record.Cost,
            ServiceProvider = record.ServiceProvider,
            ServiceDate = record.ServiceDate,
            NextServiceDue = record.NextServiceDue,
            Parts = record.Parts,
            Status = record.Status,
            ReceiptImagePath = record.ReceiptImagePath,
            PerformedById = record.PerformedById,
            PerformedByName = record.PerformedBy != null ? $"{record.PerformedBy.FirstName} {record.PerformedBy.LastName}" : null,
            CreatedAt = record.CreatedAt
        };
    }
}
