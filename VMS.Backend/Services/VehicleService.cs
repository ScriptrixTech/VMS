using Microsoft.EntityFrameworkCore;
using VMS.Backend.Data;
using VMS.Backend.DTOs;
using VMS.Backend.Models;

namespace VMS.Backend.Services;

public class VehicleService : IVehicleService
{
    private readonly VMSDbContext _context;

    public VehicleService(VMSDbContext context)
    {
        _context = context;
    }

    public async Task<VehicleResponseDto> CreateVehicleAsync(CreateVehicleDto createVehicleDto)
    {
        var vehicle = new Vehicle
        {
            VIN = createVehicleDto.VIN,
            Make = createVehicleDto.Make,
            Model = createVehicleDto.Model,
            Year = createVehicleDto.Year,
            Color = createVehicleDto.Color,
            LicensePlate = createVehicleDto.LicensePlate,
            Mileage = createVehicleDto.Mileage,
            Status = createVehicleDto.Status,
            OwnerId = createVehicleDto.OwnerId
        };

        _context.Vehicles.Add(vehicle);
        await _context.SaveChangesAsync();

        return await GetVehicleResponseDto(vehicle);
    }

    public async Task<VehicleResponseDto?> GetVehicleByIdAsync(Guid id)
    {
        var vehicle = await _context.Vehicles
            .Include(v => v.Owner)
            .FirstOrDefaultAsync(v => v.Id == id);

        return vehicle == null ? null : await GetVehicleResponseDto(vehicle);
    }

    public async Task<PagedResult<VehicleResponseDto>> GetVehiclesAsync(int pageNumber, int pageSize, string? searchTerm, VehicleStatus? status)
    {
        var query = _context.Vehicles.Include(v => v.Owner).AsQueryable();

        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(v => v.Make.Contains(searchTerm) ||
                                   v.Model.Contains(searchTerm) ||
                                   v.LicensePlate.Contains(searchTerm) ||
                                   v.VIN.Contains(searchTerm));
        }

        if (status.HasValue)
        {
            query = query.Where(v => v.Status == status.Value);
        }

        var totalCount = await query.CountAsync();
        var vehicles = await query
            .OrderByDescending(v => v.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var vehicleDtos = new List<VehicleResponseDto>();
        foreach (var vehicle in vehicles)
        {
            vehicleDtos.Add(await GetVehicleResponseDto(vehicle));
        }

        return new PagedResult<VehicleResponseDto>
        {
            Items = vehicleDtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<VehicleResponseDto?> UpdateVehicleAsync(Guid id, UpdateVehicleDto updateVehicleDto)
    {
        var vehicle = await _context.Vehicles.FindAsync(id);
        if (vehicle == null) return null;

        vehicle.Make = updateVehicleDto.Make;
        vehicle.Model = updateVehicleDto.Model;
        vehicle.Year = updateVehicleDto.Year;
        vehicle.Color = updateVehicleDto.Color;
        vehicle.LicensePlate = updateVehicleDto.LicensePlate;
        vehicle.Mileage = updateVehicleDto.Mileage;
        vehicle.Status = updateVehicleDto.Status;
        vehicle.OwnerId = updateVehicleDto.OwnerId;
        vehicle.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return await GetVehicleResponseDto(vehicle);
    }

    public async Task<bool> DeleteVehicleAsync(Guid id)
    {
        var vehicle = await _context.Vehicles.FindAsync(id);
        if (vehicle == null) return false;

        _context.Vehicles.Remove(vehicle);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> VehicleExistsAsync(Guid id)
    {
        return await _context.Vehicles.AnyAsync(v => v.Id == id);
    }

    public async Task<bool> IsVinUniqueAsync(string vin, Guid? excludeId = null)
    {
        return !await _context.Vehicles.AnyAsync(v => v.VIN == vin && (!excludeId.HasValue || v.Id != excludeId.Value));
    }

    public async Task<bool> IsLicensePlateUniqueAsync(string licensePlate, Guid? excludeId = null)
    {
        return !await _context.Vehicles.AnyAsync(v => v.LicensePlate == licensePlate && (!excludeId.HasValue || v.Id != excludeId.Value));
    }

    private async Task<VehicleResponseDto> GetVehicleResponseDto(Vehicle vehicle)
    {
        if (vehicle.Owner == null && vehicle.OwnerId != null)
        {
            vehicle.Owner = await _context.Users.FindAsync(vehicle.OwnerId);
        }

        return new VehicleResponseDto
        {
            Id = vehicle.Id,
            VIN = vehicle.VIN,
            Make = vehicle.Make,
            Model = vehicle.Model,
            Year = vehicle.Year,
            Color = vehicle.Color,
            LicensePlate = vehicle.LicensePlate,
            Mileage = vehicle.Mileage,
            Status = vehicle.Status,
            OwnerId = vehicle.OwnerId,
            OwnerName = vehicle.Owner != null ? $"{vehicle.Owner.FirstName} {vehicle.Owner.LastName}" : null,
            CreatedAt = vehicle.CreatedAt,
            UpdatedAt = vehicle.UpdatedAt
        };
    }
}