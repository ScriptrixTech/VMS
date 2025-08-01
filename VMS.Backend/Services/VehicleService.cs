
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

    public async Task<VehicleResponse> CreateVehicleAsync(VehicleRequest request)
    {
        // Validate VIN
        if (!await ValidateVINAsync(request.VIN))
        {
            throw new InvalidOperationException("Invalid VIN format");
        }

        // Check if VIN already exists
        if (await _context.Vehicles.AnyAsync(v => v.VIN == request.VIN))
        {
            throw new InvalidOperationException("Vehicle with this VIN already exists");
        }

        // Check if license plate already exists
        if (!string.IsNullOrEmpty(request.LicensePlate) && 
            await _context.Vehicles.AnyAsync(v => v.LicensePlate == request.LicensePlate))
        {
            throw new InvalidOperationException("Vehicle with this license plate already exists");
        }

        var vehicle = new Vehicle
        {
            VIN = request.VIN,
            Make = request.Make,
            Model = request.Model,
            Year = request.Year,
            Color = request.Color,
            LicensePlate = request.LicensePlate,
            Mileage = request.Mileage,
            Status = request.Status,
            OwnerId = request.OwnerId
        };

        _context.Vehicles.Add(vehicle);
        await _context.SaveChangesAsync();

        return await GetVehicleResponseAsync(vehicle);
    }

    public async Task<VehicleResponse> GetVehicleByIdAsync(int id)
    {
        var vehicle = await _context.Vehicles
            .Include(v => v.Owner)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (vehicle == null)
        {
            throw new NotFoundException("Vehicle not found");
        }

        return await GetVehicleResponseAsync(vehicle);
    }

    public async Task<List<VehicleResponse>> GetVehiclesAsync(VehicleSearchRequest searchRequest)
    {
        var query = _context.Vehicles.Include(v => v.Owner).AsQueryable();

        // Apply filters
        if (!string.IsNullOrEmpty(searchRequest.Make))
        {
            query = query.Where(v => v.Make.Contains(searchRequest.Make));
        }

        if (!string.IsNullOrEmpty(searchRequest.Model))
        {
            query = query.Where(v => v.Model.Contains(searchRequest.Model));
        }

        if (searchRequest.Year.HasValue)
        {
            query = query.Where(v => v.Year == searchRequest.Year.Value);
        }

        if (searchRequest.Status.HasValue)
        {
            query = query.Where(v => v.Status == searchRequest.Status.Value);
        }

        if (!string.IsNullOrEmpty(searchRequest.SearchTerm))
        {
            query = query.Where(v => 
                v.Make.Contains(searchRequest.SearchTerm) ||
                v.Model.Contains(searchRequest.SearchTerm) ||
                v.VIN.Contains(searchRequest.SearchTerm) ||
                v.LicensePlate.Contains(searchRequest.SearchTerm));
        }

        // Apply pagination
        var vehicles = await query
            .OrderByDescending(v => v.CreatedAt)
            .Skip((searchRequest.Page - 1) * searchRequest.PageSize)
            .Take(searchRequest.PageSize)
            .ToListAsync();

        var responses = new List<VehicleResponse>();
        foreach (var vehicle in vehicles)
        {
            responses.Add(await GetVehicleResponseAsync(vehicle));
        }

        return responses;
    }

    public async Task<VehicleResponse> UpdateVehicleAsync(int id, VehicleRequest request)
    {
        var vehicle = await _context.Vehicles.FindAsync(id);
        if (vehicle == null)
        {
            throw new NotFoundException("Vehicle not found");
        }

        // Validate VIN if changed
        if (vehicle.VIN != request.VIN)
        {
            if (!await ValidateVINAsync(request.VIN))
            {
                throw new InvalidOperationException("Invalid VIN format");
            }

            if (await _context.Vehicles.AnyAsync(v => v.VIN == request.VIN && v.Id != id))
            {
                throw new InvalidOperationException("Vehicle with this VIN already exists");
            }
        }

        // Check license plate if changed
        if (vehicle.LicensePlate != request.LicensePlate && 
            !string.IsNullOrEmpty(request.LicensePlate) &&
            await _context.Vehicles.AnyAsync(v => v.LicensePlate == request.LicensePlate && v.Id != id))
        {
            throw new InvalidOperationException("Vehicle with this license plate already exists");
        }

        vehicle.VIN = request.VIN;
        vehicle.Make = request.Make;
        vehicle.Model = request.Model;
        vehicle.Year = request.Year;
        vehicle.Color = request.Color;
        vehicle.LicensePlate = request.LicensePlate;
        vehicle.Mileage = request.Mileage;
        vehicle.Status = request.Status;
        vehicle.OwnerId = request.OwnerId;
        vehicle.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetVehicleResponseAsync(vehicle);
    }

    public async Task<bool> DeleteVehicleAsync(int id)
    {
        var vehicle = await _context.Vehicles.FindAsync(id);
        if (vehicle == null)
        {
            throw new NotFoundException("Vehicle not found");
        }

        _context.Vehicles.Remove(vehicle);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> AssignVehicleAsync(int vehicleId, VehicleAssignRequest request)
    {
        var vehicle = await _context.Vehicles.FindAsync(vehicleId);
        if (vehicle == null)
        {
            throw new NotFoundException("Vehicle not found");
        }

        var user = await _context.Users.FindAsync(request.UserId);
        if (user == null)
        {
            throw new NotFoundException("User not found");
        }

        vehicle.OwnerId = request.UserId;
        vehicle.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UnassignVehicleAsync(int vehicleId)
    {
        var vehicle = await _context.Vehicles.FindAsync(vehicleId);
        if (vehicle == null)
        {
            throw new NotFoundException("Vehicle not found");
        }

        vehicle.OwnerId = null;
        vehicle.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ValidateVINAsync(string vin)
    {
        // Basic VIN validation - 17 characters, alphanumeric except I, O, Q
        if (string.IsNullOrEmpty(vin) || vin.Length != 17)
        {
            return false;
        }

        var invalidChars = new[] { 'I', 'O', 'Q' };
        return vin.All(c => char.IsLetterOrDigit(c) && !invalidChars.Contains(char.ToUpper(c)));
    }

    private async Task<VehicleResponse> GetVehicleResponseAsync(Vehicle vehicle)
    {
        return new VehicleResponse
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
