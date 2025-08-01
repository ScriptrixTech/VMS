
using Microsoft.EntityFrameworkCore;
using VMS.Backend.Data;
using VMS.Backend.DTOs;

namespace VMS.Backend.Services;

public class ReportService : IReportService
{
    private readonly VMSDbContext _context;

    public ReportService(VMSDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsResponse> GetDashboardStatsAsync()
    {
        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1);

        var totalVehicles = await _context.Vehicles.CountAsync();
        var activeVehicles = await _context.Vehicles.CountAsync(v => v.Status == VehicleStatus.Available || v.Status == VehicleStatus.InUse);
        var vehiclesInMaintenance = await _context.Vehicles.CountAsync(v => v.Status == VehicleStatus.Maintenance);
        
        var overdueMaintenanceCount = await _context.MaintenanceRecords
            .CountAsync(m => m.NextServiceDue.HasValue && m.NextServiceDue.Value < now);

        var monthlyFuelCost = await _context.FuelRecords
            .Where(f => f.FuelDate >= startOfMonth)
            .SumAsync(f => f.Cost);

        var monthlyMaintenanceCost = await _context.MaintenanceRecords
            .Where(m => m.ServiceDate >= startOfMonth)
            .SumAsync(m => m.Cost);

        var averageVehicleAge = await _context.Vehicles
            .AverageAsync(v => now.Year - v.Year);

        var vehiclesByStatus = await _context.Vehicles
            .GroupBy(v => v.Status)
            .Select(g => new VehicleStatusCount
            {
                Status = g.Key.ToString(),
                Count = g.Count()
            })
            .ToListAsync();

        // Get last 6 months expenses
        var monthlyExpenses = new List<MonthlyExpense>();
        for (int i = 5; i >= 0; i--)
        {
            var monthStart = startOfMonth.AddMonths(-i);
            var monthEnd = monthStart.AddMonths(1);

            var fuelCost = await _context.FuelRecords
                .Where(f => f.FuelDate >= monthStart && f.FuelDate < monthEnd)
                .SumAsync(f => f.Cost);

            var maintenanceCost = await _context.MaintenanceRecords
                .Where(m => m.ServiceDate >= monthStart && m.ServiceDate < monthEnd)
                .SumAsync(m => m.Cost);

            monthlyExpenses.Add(new MonthlyExpense
            {
                Month = monthStart.ToString("MMM yyyy"),
                FuelCost = fuelCost,
                MaintenanceCost = maintenanceCost
            });
        }

        return new DashboardStatsResponse
        {
            TotalVehicles = totalVehicles,
            ActiveVehicles = activeVehicles,
            VehiclesInMaintenance = vehiclesInMaintenance,
            OverdueMaintenanceCount = overdueMaintenanceCount,
            MonthlyFuelCost = monthlyFuelCost,
            MonthlyMaintenanceCost = monthlyMaintenanceCost,
            AverageVehicleAge = (decimal)averageVehicleAge,
            VehiclesByStatus = vehiclesByStatus,
            MonthlyExpenses = monthlyExpenses
        };
    }

    public async Task<byte[]> GenerateVehicleReportAsync(ReportRequest request)
    {
        var vehicles = await _context.Vehicles
            .Include(v => v.Owner)
            .Where(v => request.VehicleIds == null || request.VehicleIds.Contains(v.Id))
            .ToListAsync();

        // For now, return a simple CSV format
        var csv = "VIN,Make,Model,Year,Status,Owner,Mileage,Created\n";
        foreach (var vehicle in vehicles)
        {
            var owner = vehicle.Owner != null ? $"{vehicle.Owner.FirstName} {vehicle.Owner.LastName}" : "";
            csv += $"{vehicle.VIN},{vehicle.Make},{vehicle.Model},{vehicle.Year},{vehicle.Status},{owner},{vehicle.Mileage},{vehicle.CreatedAt:yyyy-MM-dd}\n";
        }

        return System.Text.Encoding.UTF8.GetBytes(csv);
    }

    public async Task<byte[]> GenerateMaintenanceReportAsync(ReportRequest request)
    {
        var records = await _context.MaintenanceRecords
            .Include(m => m.Vehicle)
            .Include(m => m.PerformedBy)
            .Where(m => m.ServiceDate >= request.StartDate && m.ServiceDate <= request.EndDate)
            .Where(m => request.VehicleIds == null || request.VehicleIds.Contains(m.VehicleId))
            .ToListAsync();

        var csv = "Vehicle,Type,Description,Cost,ServiceProvider,ServiceDate,NextDue,Status,PerformedBy\n";
        foreach (var record in records)
        {
            var vehicle = $"{record.Vehicle?.Make} {record.Vehicle?.Model} ({record.Vehicle?.Year})";
            var performedBy = record.PerformedBy != null ? $"{record.PerformedBy.FirstName} {record.PerformedBy.LastName}" : "";
            csv += $"{vehicle},{record.Type},{record.Description},{record.Cost},{record.ServiceProvider},{record.ServiceDate:yyyy-MM-dd},{record.NextServiceDue?.ToString("yyyy-MM-dd")},{record.Status},{performedBy}\n";
        }

        return System.Text.Encoding.UTF8.GetBytes(csv);
    }

    public async Task<byte[]> GenerateFuelReportAsync(ReportRequest request)
    {
        var records = await _context.FuelRecords
            .Include(f => f.Vehicle)
            .Include(f => f.RecordedBy)
            .Where(f => f.FuelDate >= request.StartDate && f.FuelDate <= request.EndDate)
            .Where(f => request.VehicleIds == null || request.VehicleIds.Contains(f.VehicleId))
            .ToListAsync();

        var csv = "Vehicle,FuelAmount,Cost,PricePerUnit,OdometerReading,FuelEfficiency,FuelStation,FuelDate,RecordedBy\n";
        foreach (var record in records)
        {
            var vehicle = $"{record.Vehicle?.Make} {record.Vehicle?.Model} ({record.Vehicle?.Year})";
            var recordedBy = record.RecordedBy != null ? $"{record.RecordedBy.FirstName} {record.RecordedBy.LastName}" : "";
            csv += $"{vehicle},{record.FuelAmount},{record.Cost},{record.PricePerUnit},{record.OdometerReading},{record.FuelEfficiency},{record.FuelStation},{record.FuelDate:yyyy-MM-dd},{recordedBy}\n";
        }

        return System.Text.Encoding.UTF8.GetBytes(csv);
    }
}
