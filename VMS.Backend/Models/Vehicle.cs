
using System.ComponentModel.DataAnnotations;

namespace VMS.Backend.Models;

public class Vehicle
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(17, MinimumLength = 17)]
    public string VIN { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string Make { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string Model { get; set; } = string.Empty;
    
    [Range(1900, 2030)]
    public int Year { get; set; }
    
    [StringLength(50)]
    public string Color { get; set; } = string.Empty;
    
    [StringLength(20)]
    public string LicensePlate { get; set; } = string.Empty;
    
    public int Mileage { get; set; }
    
    public VehicleStatus Status { get; set; } = VehicleStatus.Available;
    
    public string? OwnerId { get; set; }
    public virtual ApplicationUser? Owner { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual ICollection<MaintenanceRecord> MaintenanceRecords { get; set; } = new List<MaintenanceRecord>();
    public virtual ICollection<FuelRecord> FuelRecords { get; set; } = new List<FuelRecord>();
}

public enum VehicleStatus
{
    Available,
    InUse,
    Maintenance,
    OutOfService
}
