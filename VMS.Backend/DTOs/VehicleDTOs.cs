
using System.ComponentModel.DataAnnotations;
using VMS.Backend.Models;

namespace VMS.Backend.DTOs;

public class VehicleRequest
{
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
}

public class VehicleResponse
{
    public int Id { get; set; }
    public string VIN { get; set; } = string.Empty;
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public string Color { get; set; } = string.Empty;
    public string LicensePlate { get; set; } = string.Empty;
    public int Mileage { get; set; }
    public VehicleStatus Status { get; set; }
    public string? OwnerId { get; set; }
    public string? OwnerName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class VehicleSearchRequest
{
    public string? Make { get; set; }
    public string? Model { get; set; }
    public int? Year { get; set; }
    public VehicleStatus? Status { get; set; }
    public string? SearchTerm { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class VehicleAssignRequest
{
    [Required]
    public string UserId { get; set; } = string.Empty;
}
