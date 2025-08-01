
using System.ComponentModel.DataAnnotations;

namespace VMS.Backend.DTOs;

public class CreateFuelRecordDto
{
    [Required]
    public Guid VehicleId { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Fuel amount must be greater than 0")]
    public decimal FuelAmount { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Cost must be greater than 0")]
    public decimal Cost { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price per unit must be greater than 0")]
    public decimal PricePerUnit { get; set; }

    [Required]
    [Range(0, double.MaxValue, ErrorMessage = "Mileage must be non-negative")]
    public decimal Mileage { get; set; }

    [Required]
    public DateTime FuelDate { get; set; }

    [StringLength(200)]
    public string? Location { get; set; }
}

public class UpdateFuelRecordDto
{
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Fuel amount must be greater than 0")]
    public decimal FuelAmount { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Cost must be greater than 0")]
    public decimal Cost { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price per unit must be greater than 0")]
    public decimal PricePerUnit { get; set; }

    [Required]
    [Range(0, double.MaxValue, ErrorMessage = "Mileage must be non-negative")]
    public decimal Mileage { get; set; }

    [Required]
    public DateTime FuelDate { get; set; }

    [StringLength(200)]
    public string? Location { get; set; }
}

public class FuelRecordResponseDto
{
    public Guid Id { get; set; }
    public Guid VehicleId { get; set; }
    public string VehicleInfo { get; set; } = string.Empty;
    public decimal FuelAmount { get; set; }
    public decimal Cost { get; set; }
    public decimal PricePerUnit { get; set; }
    public decimal Mileage { get; set; }
    public decimal? FuelEfficiency { get; set; }
    public DateTime FuelDate { get; set; }
    public string? Location { get; set; }
    public string? RecordedById { get; set; }
    public string? RecordedByName { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class FuelAnalyticsDto
{
    public decimal TotalCost { get; set; }
    public decimal TotalFuelAmount { get; set; }
    public decimal AveragePricePerUnit { get; set; }
    public decimal AverageFuelEfficiency { get; set; }
    public int TotalRecords { get; set; }
}
