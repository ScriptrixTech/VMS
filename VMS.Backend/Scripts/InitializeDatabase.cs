
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using VMS.Backend.Data;
using VMS.Backend.Models;

namespace VMS.Backend.Scripts;

public static class DatabaseInitializer
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<VMSDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // Run migrations if any
        await context.Database.MigrateAsync();

        // Seed data
        await DatabaseSeeder.SeedAsync(context, userManager, roleManager);
    }

    public static async Task RecreateDatabase(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<VMSDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        // Delete and recreate database
        await context.Database.EnsureDeletedAsync();
        await context.Database.EnsureCreatedAsync();

        // Seed data
        await DatabaseSeeder.SeedAsync(context, userManager, roleManager);
    }
}
