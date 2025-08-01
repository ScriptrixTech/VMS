
using Microsoft.AspNetCore.Identity;
using VMS.Backend.Models;

namespace VMS.Backend.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(VMSDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // Seed roles
        if (!await roleManager.RoleExistsAsync("Admin"))
        {
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        }

        if (!await roleManager.RoleExistsAsync("User"))
        {
            await roleManager.CreateAsync(new IdentityRole("User"));
        }

        if (!await roleManager.RoleExistsAsync("Driver"))
        {
            await roleManager.CreateAsync(new IdentityRole("Driver"));
        }

        // Seed admin user
        var adminEmail = "admin@vms.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);

        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FirstName = "System",
                LastName = "Administrator",
                EmailConfirmed = true,
                IsActive = true
            };

            var result = await userManager.CreateAsync(adminUser, "Admin@123");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }

        // Seed sample vehicles
        if (!context.Vehicles.Any())
        {
            var sampleVehicles = new List<Vehicle>
            {
                new Vehicle
                {
                    VIN = "1HGBH41JXMN109186",
                    Make = "Honda",
                    Model = "Civic",
                    Year = 2022,
                    Color = "Blue",
                    LicensePlate = "ABC123",
                    Mileage = 15000,
                    Status = VehicleStatus.Available
                },
                new Vehicle
                {
                    VIN = "1FTFW1ET5DFC10312",
                    Make = "Ford",
                    Model = "F-150",
                    Year = 2023,
                    Color = "Red",
                    LicensePlate = "XYZ789",
                    Mileage = 8500,
                    Status = VehicleStatus.Available
                }
            };

            context.Vehicles.AddRange(sampleVehicles);
            await context.SaveChangesAsync();
        }
    }
}
