
using System.ComponentModel.DataAnnotations;
using VMS.Backend.Models;

namespace VMS.Backend.DTOs;

public class MaintenanceRecordRequest
{
    [Required]
    public int VehicleId { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Type { get; set; } = string.Empty;
    
    [Required]
    [StringLength(500)]
    public string Description { get; set; } = string.Empty;
    
    [Range(0, double.MaxValue)]
    public decimal Cost { get; set; }
    
    [StringLength(200)]
    public string ServiceProvider { get; set; } = string.Empty;
    
    public DateTime ServiceDate { get; set; }
    public DateTime? NextServiceDue { get; set; }
    
    public string? Parts { get; set; }
    public MaintenanceStatus Status { get; set; } = MaintenanceStatus.Completed;
    public string? ReceiptImagePath { get; set; }
}

public class MaintenanceRecordResponse
{
    public int Id { get; set; }
    public int VehicleId { get; set; }
    public string VehicleInfo { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Cost { get; set; }
    public string ServiceProvider { get; set; } = string.Empty;
    public DateTime ServiceDate { get; set; }
    public DateTime? NextServiceDue { get; set; }
    public string? Parts { get; set; }
    public MaintenanceStatus Status { get; set; }
    public string? ReceiptImagePath { get; set; }
    public string? PerformedById { get; set; }
    public string? PerformedByName { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class FuelRecordRequest
{
    [Required]
    public int VehicleId { get; set; }
    
    [Range(0, double.MaxValue)]
    public decimal FuelAmount { get; set; }
    
    [Range(0, double.MaxValue)]
    public decimal Cost { get; set; }
    
    [Range(0, double.MaxValue)]
    public decimal PricePerUnit { get; set; }
    
    public int OdometerReading { get; set; }
    
    [StringLength(200)]
    public string FuelStation { get; set; } = string.Empty;
    
    public DateTime FuelDate { get; set; }
    public string? ReceiptImagePath { get; set; }
}

public class FuelRecordResponse
{
    public int Id { get; set; }
    public int VehicleId { get; set; }
    public string VehicleInfo { get; set; } = string.Empty;
    public decimal FuelAmount { get; set; }
    public decimal Cost { get; set; }
    public decimal PricePerUnit { get; set; }
    public int OdometerReading { get; set; }
    public decimal? FuelEfficiency { get; set; }
    public string FuelStation { get; set; } = string.Empty;
    public DateTime FuelDate { get; set; }
    public string? ReceiptImagePath { get; set; }
    public string? RecordedById { get; set; }
    public string? RecordedByName { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class FuelEfficiencyReport
{
    public int VehicleId { get; set; }
    public string VehicleInfo { get; set; } = string.Empty;
    public decimal AverageEfficiency { get; set; }
    public decimal TotalFuelConsumed { get; set; }
    public decimal TotalCost { get; set; }
    public int TotalDistance { get; set; }
    public List<FuelRecordResponse> Records { get; set; } = new();
}

public class DashboardStatsResponse
{
    public int TotalVehicles { get; set; }
    public int ActiveVehicles { get; set; }
    public int VehiclesInMaintenance { get; set; }
    public int OverdueMaintenanceCount { get; set; }
    public decimal MonthlyFuelCost { get; set; }
    public decimal MonthlyMaintenanceCost { get; set; }
    public decimal AverageVehicleAge { get; set; }
    public List<VehicleStatusCount> VehiclesByStatus { get; set; } = new();
    public List<MonthlyExpense> MonthlyExpenses { get; set; } = new();
}

public class VehicleStatusCount
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class MonthlyExpense
{
    public string Month { get; set; } = string.Empty;
    public decimal FuelCost { get; set; }
    public decimal MaintenanceCost { get; set; }
}

public class ReportRequest
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<int>? VehicleIds { get; set; }
    public string Format { get; set; } = "PDF"; // PDF or CSV
}

public class UserResponse
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public bool IsActive { get; set; }
    public List<string> Roles { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}
