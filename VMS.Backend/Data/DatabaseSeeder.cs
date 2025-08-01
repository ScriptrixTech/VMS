
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using VMS.Backend.Models;

namespace VMS.Backend.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(VMSDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        await context.Database.EnsureCreatedAsync();

        // Seed roles
        await SeedRolesAsync(roleManager);

        // Seed users
        await SeedUsersAsync(userManager);

        // Seed vehicles
        await SeedVehiclesAsync(context, userManager);

        // Seed maintenance records
        await SeedMaintenanceRecordsAsync(context, userManager);

        // Seed fuel records
        await SeedFuelRecordsAsync(context, userManager);

        await context.SaveChangesAsync();
    }

    private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
    {
        string[] roles = { "Admin", "User", "Driver" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }

    private static async Task SeedUsersAsync(UserManager<ApplicationUser> userManager)
    {
        // Admin user
        if (await userManager.FindByEmailAsync("admin@vms.com") == null)
        {
            var admin = new ApplicationUser
            {
                UserName = "admin@vms.com",
                Email = "admin@vms.com",
                EmailConfirmed = true,
                FirstName = "System",
                LastName = "Administrator",
                PhoneNumber = "+1234567890",
                IsActive = true
            };

            var result = await userManager.CreateAsync(admin, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, "Admin");
            }
        }

        // Sample drivers
        var drivers = new[]
        {
            new { Email = "john.driver@vms.com", FirstName = "John", LastName = "Driver", Phone = "+1234567891" },
            new { Email = "jane.driver@vms.com", FirstName = "Jane", LastName = "Smith", Phone = "+1234567892" },
            new { Email = "mike.driver@vms.com", FirstName = "Mike", LastName = "Johnson", Phone = "+1234567893" },
            new { Email = "sarah.driver@vms.com", FirstName = "Sarah", LastName = "Wilson", Phone = "+1234567894" },
        };

        foreach (var driverInfo in drivers)
        {
            if (await userManager.FindByEmailAsync(driverInfo.Email) == null)
            {
                var driver = new ApplicationUser
                {
                    UserName = driverInfo.Email,
                    Email = driverInfo.Email,
                    EmailConfirmed = true,
                    FirstName = driverInfo.FirstName,
                    LastName = driverInfo.LastName,
                    PhoneNumber = driverInfo.Phone,
                    IsActive = true
                };

                var result = await userManager.CreateAsync(driver, "Driver123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(driver, "Driver");
                }
            }
        }

        // Sample users
        var users = new[]
        {
            new { Email = "user1@vms.com", FirstName = "Robert", LastName = "Brown", Phone = "+1234567895" },
            new { Email = "user2@vms.com", FirstName = "Emily", LastName = "Davis", Phone = "+1234567896" },
        };

        foreach (var userInfo in users)
        {
            if (await userManager.FindByEmailAsync(userInfo.Email) == null)
            {
                var user = new ApplicationUser
                {
                    UserName = userInfo.Email,
                    Email = userInfo.Email,
                    EmailConfirmed = true,
                    FirstName = userInfo.FirstName,
                    LastName = userInfo.LastName,
                    PhoneNumber = userInfo.Phone,
                    IsActive = true
                };

                var result = await userManager.CreateAsync(user, "User123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "User");
                }
            }
        }
    }

    private static async Task SeedVehiclesAsync(VMSDbContext context, UserManager<ApplicationUser> userManager)
    {
        if (await context.Vehicles.AnyAsync()) return;

        var drivers = await userManager.GetUsersInRoleAsync("Driver");
        var users = await userManager.GetUsersInRoleAsync("User");
        var allUsers = drivers.Concat(users).ToList();

        var vehicles = new[]
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
                Status = VehicleStatus.Available,
                OwnerId = allUsers.Count > 0 ? allUsers[0].Id : null
            },
            new Vehicle
            {
                VIN = "2T1BURHE5JC014726",
                Make = "Toyota",
                Model = "Corolla",
                Year = 2021,
                Color = "White",
                LicensePlate = "XYZ789",
                Mileage = 22000,
                Status = VehicleStatus.InUse,
                OwnerId = allUsers.Count > 1 ? allUsers[1].Id : null
            },
            new Vehicle
            {
                VIN = "1FTFW1ET5DFC10312",
                Make = "Ford",
                Model = "F-150",
                Year = 2023,
                Color = "Red",
                LicensePlate = "DEF456",
                Mileage = 8500,
                Status = VehicleStatus.Available,
                OwnerId = allUsers.Count > 2 ? allUsers[2].Id : null
            },
            new Vehicle
            {
                VIN = "1G1ZD5ST8JF123456",
                Make = "Chevrolet",
                Model = "Malibu",
                Year = 2020,
                Color = "Black",
                LicensePlate = "GHI789",
                Mileage = 35000,
                Status = VehicleStatus.Maintenance,
                OwnerId = allUsers.Count > 3 ? allUsers[3].Id : null
            },
            new Vehicle
            {
                VIN = "JN1AZ4EH8JM123456",
                Make = "Nissan",
                Model = "Altima",
                Year = 2019,
                Color = "Silver",
                LicensePlate = "JKL012",
                Mileage = 45000,
                Status = VehicleStatus.Available,
                OwnerId = allUsers.Count > 4 ? allUsers[4].Id : null
            },
            new Vehicle
            {
                VIN = "WBAPL33569A123456",
                Make = "BMW",
                Model = "3 Series",
                Year = 2022,
                Color = "Gray",
                LicensePlate = "MNO345",
                Mileage = 12000,
                Status = VehicleStatus.InUse,
                OwnerId = allUsers.Count > 0 ? allUsers[0].Id : null
            },
            new Vehicle
            {
                VIN = "WA1VAAFE8JD123456",
                Make = "Audi",
                Model = "A4",
                Year = 2021,
                Color = "Blue",
                LicensePlate = "PQR678",
                Mileage = 18000,
                Status = VehicleStatus.Available,
                OwnerId = allUsers.Count > 1 ? allUsers[1].Id : null
            },
            new Vehicle
            {
                VIN = "1C4PJMCS0JW123456",
                Make = "Jeep",
                Model = "Grand Cherokee",
                Year = 2023,
                Color = "Green",
                LicensePlate = "STU901",
                Mileage = 5500,
                Status = VehicleStatus.Available,
                OwnerId = allUsers.Count > 2 ? allUsers[2].Id : null
            },
            new Vehicle
            {
                VIN = "5N1AT2MT0JC123456",
                Make = "Nissan",
                Model = "Rogue",
                Year = 2020,
                Color = "White",
                LicensePlate = "VWX234",
                Mileage = 28000,
                Status = VehicleStatus.Maintenance,
                OwnerId = allUsers.Count > 3 ? allUsers[3].Id : null
            },
            new Vehicle
            {
                VIN = "2HKRM4H75JH123456",
                Make = "Honda",
                Model = "Pilot",
                Year = 2021,
                Color = "Black",
                LicensePlate = "YZA567",
                Mileage = 19500,
                Status = VehicleStatus.Available,
                OwnerId = allUsers.Count > 4 ? allUsers[4].Id : null
            }
        };

        context.Vehicles.AddRange(vehicles);
        await context.SaveChangesAsync();
    }

    private static async Task SeedMaintenanceRecordsAsync(VMSDbContext context, UserManager<ApplicationUser> userManager)
    {
        if (await context.MaintenanceRecords.AnyAsync()) return;

        var vehicles = await context.Vehicles.ToListAsync();
        var drivers = await userManager.GetUsersInRoleAsync("Driver");

        var random = new Random();
        var serviceTypes = new[] { "Oil Change", "Tire Rotation", "Brake Inspection", "Engine Tune-up", "Transmission Service", "Battery Replacement" };
        var providers = new[] { "AutoCare Center", "Quick Lube Express", "Main Street Garage", "Elite Auto Service", "Precision Motors" };
        var statuses = new[] { MaintenanceStatus.Completed, MaintenanceStatus.Pending, MaintenanceStatus.InProgress };

        for (int i = 0; i < 25; i++)
        {
            var vehicle = vehicles[random.Next(vehicles.Count)];
            var serviceType = serviceTypes[random.Next(serviceTypes.Length)];
            var provider = providers[random.Next(providers.Length)];
            var status = statuses[random.Next(statuses.Length)];
            var serviceDate = DateTime.UtcNow.AddDays(-random.Next(0, 365));
            var nextServiceDate = serviceDate.AddDays(random.Next(30, 180));

            var maintenance = new MaintenanceRecord
            {
                VehicleId = vehicle.Id,
                Title = $"{serviceType} - {vehicle.Make} {vehicle.Model}",
                Description = $"Routine {serviceType.ToLower()} service performed by {provider}",
                ServiceType = serviceType,
                Cost = (decimal)(random.NextDouble() * 500 + 50), // $50-$550
                ServiceDate = serviceDate,
                NextServiceDate = status == MaintenanceStatus.Completed ? nextServiceDate : null,
                Status = status,
                PerformedById = drivers.Count > 0 ? drivers[random.Next(drivers.Count)].Id : null,
                ServiceProvider = provider,
                Mileage = vehicle.Mileage - random.Next(0, 5000)
            };

            context.MaintenanceRecords.Add(maintenance);
        }

        await context.SaveChangesAsync();
    }

    private static async Task SeedFuelRecordsAsync(VMSDbContext context, UserManager<ApplicationUser> userManager)
    {
        if (await context.FuelRecords.AnyAsync()) return;

        var vehicles = await context.Vehicles.ToListAsync();
        var drivers = await userManager.GetUsersInRoleAsync("Driver");

        var random = new Random();
        var locations = new[] { "Shell Station", "BP Gas", "Exxon", "Chevron", "Mobil", "Speedway", "Circle K" };

        for (int i = 0; i < 50; i++)
        {
            var vehicle = vehicles[random.Next(vehicles.Count)];
            var location = locations[random.Next(locations.Length)];
            var fuelAmount = (decimal)(random.NextDouble() * 20 + 5); // 5-25 gallons
            var pricePerUnit = (decimal)(random.NextDouble() * 2 + 3); // $3-$5 per gallon
            var cost = fuelAmount * pricePerUnit;
            var fuelDate = DateTime.UtcNow.AddDays(-random.Next(0, 180));
            var mileage = vehicle.Mileage - random.Next(0, 10000);
            var fuelEfficiency = mileage > 0 ? (decimal)(random.NextDouble() * 15 + 20) : 0; // 20-35 MPG

            var fuelRecord = new FuelRecord
            {
                VehicleId = vehicle.Id,
                FuelAmount = fuelAmount,
                Cost = cost,
                PricePerUnit = pricePerUnit,
                Mileage = mileage,
                FuelEfficiency = fuelEfficiency,
                FuelDate = fuelDate,
                Location = location,
                RecordedById = drivers.Count > 0 ? drivers[random.Next(drivers.Count)].Id : null
            };

            context.FuelRecords.Add(fuelRecord);
        }

        await context.SaveChangesAsync();
    }
}
