
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using VMS.Backend.Models;

namespace VMS.Backend.Data;

public class VMSDbContext : IdentityDbContext<ApplicationUser>
{
    public VMSDbContext(DbContextOptions<VMSDbContext> options) : base(options)
    {
    }

    public DbSet<Vehicle> Vehicles { get; set; }
    public DbSet<MaintenanceRecord> MaintenanceRecords { get; set; }
    public DbSet<FuelRecord> FuelRecords { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Vehicle configuration
        builder.Entity<Vehicle>()
            .HasIndex(v => v.VIN)
            .IsUnique();

        builder.Entity<Vehicle>()
            .HasIndex(v => v.LicensePlate)
            .IsUnique();

        builder.Entity<Vehicle>()
            .Property(v => v.Status)
            .HasConversion<string>();

        // MaintenanceRecord configuration
        builder.Entity<MaintenanceRecord>()
            .Property(m => m.Cost)
            .HasColumnType("decimal(18,2)");

        builder.Entity<MaintenanceRecord>()
            .Property(m => m.Status)
            .HasConversion<string>();

        builder.Entity<MaintenanceRecord>()
            .HasOne(m => m.Vehicle)
            .WithMany(v => v.MaintenanceRecords)
            .HasForeignKey(m => m.VehicleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<MaintenanceRecord>()
            .HasOne(m => m.PerformedBy)
            .WithMany(u => u.MaintenanceRecords)
            .HasForeignKey(m => m.PerformedById)
            .OnDelete(DeleteBehavior.SetNull);

        // FuelRecord configuration
        builder.Entity<FuelRecord>()
            .Property(f => f.FuelAmount)
            .HasColumnType("decimal(18,2)");

        builder.Entity<FuelRecord>()
            .Property(f => f.Cost)
            .HasColumnType("decimal(18,2)");

        builder.Entity<FuelRecord>()
            .Property(f => f.PricePerUnit)
            .HasColumnType("decimal(18,2)");

        builder.Entity<FuelRecord>()
            .Property(f => f.FuelEfficiency)
            .HasColumnType("decimal(18,2)");

        builder.Entity<FuelRecord>()
            .HasOne(f => f.Vehicle)
            .WithMany(v => v.FuelRecords)
            .HasForeignKey(f => f.VehicleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<FuelRecord>()
            .HasOne(f => f.RecordedBy)
            .WithMany()
            .HasForeignKey(f => f.RecordedById)
            .OnDelete(DeleteBehavior.SetNull);

        // ApplicationUser - Vehicle relationship
        builder.Entity<Vehicle>()
            .HasOne(v => v.Owner)
            .WithMany(u => u.Vehicles)
            .HasForeignKey(v => v.OwnerId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
