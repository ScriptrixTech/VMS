
using System.ComponentModel.DataAnnotations;

namespace VMS.Backend.Models;

public class MaintenanceRecord
{
    public int Id { get; set; }
    
    public int VehicleId { get; set; }
    public virtual Vehicle Vehicle { get; set; } = null!;
    
    [Required]
    [StringLength(50)]
    public string Type { get; set; } = string.Empty; // routine, repair, inspection
    
    [Required]
    [StringLength(500)]
    public string Description { get; set; } = string.Empty;
    
    [Range(0, double.MaxValue)]
    public decimal Cost { get; set; }
    
    [StringLength(200)]
    public string ServiceProvider { get; set; } = string.Empty;
    
    public DateTime ServiceDate { get; set; }
    public DateTime? NextServiceDue { get; set; }
    
    public string? Parts { get; set; } // JSON string of parts used
    
    public MaintenanceStatus Status { get; set; } = MaintenanceStatus.Completed;
    
    public string? ReceiptImagePath { get; set; }
    
    public string? PerformedById { get; set; }
    public virtual ApplicationUser? PerformedBy { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public enum MaintenanceStatus
{
    Pending,
    InProgress,
    Completed,
    Cancelled
}
