
namespace VMS.Backend.DTOs;

public class DashboardStatsDto
{
    public int TotalVehicles { get; set; }
    public int AvailableVehicles { get; set; }
    public int InUseVehicles { get; set; }
    public int MaintenanceVehicles { get; set; }
    public decimal AverageMileage { get; set; }
    public int TotalMaintenanceRecords { get; set; }
    public int PendingMaintenance { get; set; }
    public int InProgressMaintenance { get; set; }
    public decimal TotalMaintenanceCost { get; set; }
    public decimal AverageMaintenanceCost { get; set; }
    public int TotalFuelRecords { get; set; }
    public decimal TotalFuelCost { get; set; }
    public decimal TotalFuelAmount { get; set; }
    public decimal AverageFuelPrice { get; set; }
    public decimal AverageFuelEfficiency { get; set; }
}

public class MonthlyCostTrendDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public string MonthYear { get; set; } = string.Empty;
    public decimal MaintenanceCost { get; set; }
    public decimal FuelCost { get; set; }
    public decimal TotalCost { get; set; }
}

public class VehicleUtilizationDto
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal Percentage { get; set; }
}

public class TopMaintenanceVehicleDto
{
    public Guid VehicleId { get; set; }
    public string VehicleInfo { get; set; } = string.Empty;
    public int MaintenanceCount { get; set; }
    public decimal TotalCost { get; set; }
}

public class FuelEfficiencyReportDto
{
    public Guid VehicleId { get; set; }
    public string VehicleInfo { get; set; } = string.Empty;
    public decimal AverageEfficiency { get; set; }
    public decimal TotalFuelCost { get; set; }
    public decimal TotalFuelAmount { get; set; }
}

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage => PageNumber < TotalPages;
    public bool HasPreviousPage => PageNumber > 1;
}
