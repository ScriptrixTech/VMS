
using System.ComponentModel.DataAnnotations;

namespace VMS.Backend.Models;

public class FuelRecord
{
    public int Id { get; set; }
    
    public int VehicleId { get; set; }
    public virtual Vehicle Vehicle { get; set; } = null!;
    
    [Range(0, double.MaxValue)]
    public decimal FuelAmount { get; set; } // in gallons or liters
    
    [Range(0, double.MaxValue)]
    public decimal Cost { get; set; }
    
    [Range(0, double.MaxValue)]
    public decimal PricePerUnit { get; set; }
    
    public int OdometerReading { get; set; }
    
    public decimal? FuelEfficiency { get; set; } // calculated MPG or KM/L
    
    [StringLength(200)]
    public string FuelStation { get; set; } = string.Empty;
    
    public DateTime FuelDate { get; set; }
    
    public string? ReceiptImagePath { get; set; }
    
    public string? RecordedById { get; set; }
    public virtual ApplicationUser? RecordedBy { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
