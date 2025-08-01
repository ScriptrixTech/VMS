
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

    public async Task<DashboardStatsDto> GetDashboardStatsAsync()
    {
        var vehicleStats = await _context.Vehicles
            .GroupBy(v => 1)
            .Select(g => new
            {
                TotalVehicles = g.Count(),
                AvailableVehicles = g.Count(v => v.Status == VehicleStatus.Available),
                InUseVehicles = g.Count(v => v.Status == VehicleStatus.InUse),
                MaintenanceVehicles = g.Count(v => v.Status == VehicleStatus.Maintenance),
                AverageMileage = g.Average(v => v.Mileage)
            })
            .FirstOrDefaultAsync();

        var maintenanceStats = await _context.MaintenanceRecords
            .Where(m => m.ServiceDate >= DateTime.UtcNow.AddMonths(-12))
            .GroupBy(m => 1)
            .Select(g => new
            {
                TotalMaintenanceRecords = g.Count(),
                PendingMaintenance = g.Count(m => m.Status == MaintenanceStatus.Pending),
                InProgressMaintenance = g.Count(m => m.Status == MaintenanceStatus.InProgress),
                TotalMaintenanceCost = g.Sum(m => m.Cost),
                AverageMaintenanceCost = g.Average(m => m.Cost)
            })
            .FirstOrDefaultAsync();

        var fuelStats = await _context.FuelRecords
            .Where(f => f.FuelDate >= DateTime.UtcNow.AddMonths(-12))
            .GroupBy(f => 1)
            .Select(g => new
            {
                TotalFuelRecords = g.Count(),
                TotalFuelCost = g.Sum(f => f.Cost),
                TotalFuelAmount = g.Sum(f => f.FuelAmount),
                AverageFuelPrice = g.Average(f => f.PricePerUnit),
                AverageFuelEfficiency = g.Where(f => f.FuelEfficiency.HasValue).Average(f => f.FuelEfficiency)
            })
            .FirstOrDefaultAsync();

        return new DashboardStatsDto
        {
            TotalVehicles = vehicleStats?.TotalVehicles ?? 0,
            AvailableVehicles = vehicleStats?.AvailableVehicles ?? 0,
            InUseVehicles = vehicleStats?.InUseVehicles ?? 0,
            MaintenanceVehicles = vehicleStats?.MaintenanceVehicles ?? 0,
            AverageMileage = vehicleStats?.AverageMileage ?? 0,
            TotalMaintenanceRecords = maintenanceStats?.TotalMaintenanceRecords ?? 0,
            PendingMaintenance = maintenanceStats?.PendingMaintenance ?? 0,
            InProgressMaintenance = maintenanceStats?.InProgressMaintenance ?? 0,
            TotalMaintenanceCost = maintenanceStats?.TotalMaintenanceCost ?? 0,
            AverageMaintenanceCost = maintenanceStats?.AverageMaintenanceCost ?? 0,
            TotalFuelRecords = fuelStats?.TotalFuelRecords ?? 0,
            TotalFuelCost = fuelStats?.TotalFuelCost ?? 0,
            TotalFuelAmount = fuelStats?.TotalFuelAmount ?? 0,
            AverageFuelPrice = fuelStats?.AverageFuelPrice ?? 0,
            AverageFuelEfficiency = fuelStats?.AverageFuelEfficiency ?? 0
        };
    }

    public async Task<List<MonthlyCostTrendDto>> GetMonthlyCostTrendsAsync(int months = 12)
    {
        var startDate = DateTime.UtcNow.AddMonths(-months);

        var maintenanceCosts = await _context.MaintenanceRecords
            .Where(m => m.ServiceDate >= startDate)
            .GroupBy(m => new { m.ServiceDate.Year, m.ServiceDate.Month })
            .Select(g => new
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                MaintenanceCost = g.Sum(m => m.Cost)
            })
            .ToListAsync();

        var fuelCosts = await _context.FuelRecords
            .Where(f => f.FuelDate >= startDate)
            .GroupBy(f => new { f.FuelDate.Year, f.FuelDate.Month })
            .Select(g => new
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                FuelCost = g.Sum(f => f.Cost)
            })
            .ToListAsync();

        var allMonths = new List<MonthlyCostTrendDto>();
        for (int i = 0; i < months; i++)
        {
            var date = DateTime.UtcNow.AddMonths(-i);
            var year = date.Year;
            var month = date.Month;

            var maintenanceCost = maintenanceCosts.FirstOrDefault(m => m.Year == year && m.Month == month)?.MaintenanceCost ?? 0;
            var fuelCost = fuelCosts.FirstOrDefault(f => f.Year == year && f.Month == month)?.FuelCost ?? 0;

            allMonths.Add(new MonthlyCostTrendDto
            {
                Year = year,
                Month = month,
                MonthYear = $"{date:MMM yyyy}",
                MaintenanceCost = maintenanceCost,
                FuelCost = fuelCost,
                TotalCost = maintenanceCost + fuelCost
            });
        }

        return allMonths.OrderBy(m => m.Year).ThenBy(m => m.Month).ToList();
    }

    public async Task<List<VehicleUtilizationDto>> GetVehicleUtilizationAsync()
    {
        var utilization = await _context.Vehicles
            .GroupBy(v => v.Status)
            .Select(g => new VehicleUtilizationDto
            {
                Status = g.Key.ToString(),
                Count = g.Count(),
                Percentage = (decimal)g.Count() * 100 / _context.Vehicles.Count()
            })
            .ToListAsync();

        return utilization;
    }

    public async Task<List<TopMaintenanceVehicleDto>> GetTopMaintenanceVehiclesAsync(int topCount = 10)
    {
        var topVehicles = await _context.MaintenanceRecords
            .Where(m => m.ServiceDate >= DateTime.UtcNow.AddMonths(-12))
            .GroupBy(m => m.VehicleId)
            .Select(g => new
            {
                VehicleId = g.Key,
                MaintenanceCount = g.Count(),
                TotalCost = g.Sum(m => m.Cost)
            })
            .OrderByDescending(x => x.TotalCost)
            .Take(topCount)
            .ToListAsync();

        var result = new List<TopMaintenanceVehicleDto>();
        foreach (var item in topVehicles)
        {
            var vehicle = await _context.Vehicles.FindAsync(item.VehicleId);
            if (vehicle != null)
            {
                result.Add(new TopMaintenanceVehicleDto
                {
                    VehicleId = item.VehicleId,
                    VehicleInfo = $"{vehicle.Make} {vehicle.Model} ({vehicle.LicensePlate})",
                    MaintenanceCount = item.MaintenanceCount,
                    TotalCost = item.TotalCost
                });
            }
        }

        return result;
    }

    public async Task<List<FuelEfficiencyReportDto>> GetFuelEfficiencyReportAsync()
    {
        var fuelEfficiency = await _context.FuelRecords
            .Where(f => f.FuelEfficiency.HasValue && f.FuelDate >= DateTime.UtcNow.AddMonths(-12))
            .GroupBy(f => f.VehicleId)
            .Select(g => new
            {
                VehicleId = g.Key,
                AverageEfficiency = g.Average(f => f.FuelEfficiency),
                TotalFuelCost = g.Sum(f => f.Cost),
                TotalFuelAmount = g.Sum(f => f.FuelAmount)
            })
            .OrderByDescending(x => x.AverageEfficiency)
            .ToListAsync();

        var result = new List<FuelEfficiencyReportDto>();
        foreach (var item in fuelEfficiency)
        {
            var vehicle = await _context.Vehicles.FindAsync(item.VehicleId);
            if (vehicle != null)
            {
                result.Add(new FuelEfficiencyReportDto
                {
                    VehicleId = item.VehicleId,
                    VehicleInfo = $"{vehicle.Make} {vehicle.Model} ({vehicle.LicensePlate})",
                    AverageEfficiency = item.AverageEfficiency ?? 0,
                    TotalFuelCost = item.TotalFuelCost,
                    TotalFuelAmount = item.TotalFuelAmount
                });
            }
        }

        return result;
    }
}

public interface IReportService
{
    Task<DashboardStatsDto> GetDashboardStatsAsync();
    Task<List<MonthlyCostTrendDto>> GetMonthlyCostTrendsAsync(int months = 12);
    Task<List<VehicleUtilizationDto>> GetVehicleUtilizationAsync();
    Task<List<TopMaintenanceVehicleDto>> GetTopMaintenanceVehiclesAsync(int topCount = 10);
    Task<List<FuelEfficiencyReportDto>> GetFuelEfficiencyReportAsync();
}
