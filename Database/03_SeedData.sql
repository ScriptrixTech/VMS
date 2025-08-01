
USE VehicleManagementSystem;
GO

-- Insert default roles
IF NOT EXISTS (SELECT 1 FROM Roles WHERE Name = 'Admin')
BEGIN
    INSERT INTO Roles (Id, Name, NormalizedName) VALUES (NEWID(), 'Admin', 'ADMIN');
END

IF NOT EXISTS (SELECT 1 FROM Roles WHERE Name = 'User')
BEGIN
    INSERT INTO Roles (Id, Name, NormalizedName) VALUES (NEWID(), 'User', 'USER');
END

IF NOT EXISTS (SELECT 1 FROM Roles WHERE Name = 'Driver')
BEGIN
    INSERT INTO Roles (Id, Name, NormalizedName) VALUES (NEWID(), 'Driver', 'DRIVER');
END

-- Insert sample users (passwords will be handled by Identity)
DECLARE @AdminId NVARCHAR(450) = NEWID();
DECLARE @UserId NVARCHAR(450) = NEWID();
DECLARE @DriverId NVARCHAR(450) = NEWID();

IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'admin@vms.com')
BEGIN
    INSERT INTO Users (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, FirstName, LastName, IsActive)
    VALUES (@AdminId, 'admin@vms.com', 'ADMIN@VMS.COM', 'admin@vms.com', 'ADMIN@VMS.COM', 1, 'System', 'Administrator', 1);
    
    -- Assign admin role
    DECLARE @AdminRoleId NVARCHAR(450) = (SELECT Id FROM Roles WHERE Name = 'Admin');
    INSERT INTO UserRoles (UserId, RoleId) VALUES (@AdminId, @AdminRoleId);
END

IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'user@vms.com')
BEGIN
    INSERT INTO Users (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, FirstName, LastName, IsActive)
    VALUES (@UserId, 'user@vms.com', 'USER@VMS.COM', 'user@vms.com', 'USER@VMS.COM', 1, 'Test', 'User', 1);
    
    -- Assign user role
    DECLARE @UserRoleId NVARCHAR(450) = (SELECT Id FROM Roles WHERE Name = 'User');
    INSERT INTO UserRoles (UserId, RoleId) VALUES (@UserId, @UserRoleId);
END

IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'driver@vms.com')
BEGIN
    INSERT INTO Users (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, FirstName, LastName, IsActive)
    VALUES (@DriverId, 'driver@vms.com', 'DRIVER@VMS.COM', 'driver@vms.com', 'DRIVER@VMS.COM', 1, 'John', 'Driver', 1);
    
    -- Assign driver role
    DECLARE @DriverRoleId NVARCHAR(450) = (SELECT Id FROM Roles WHERE Name = 'Driver');
    INSERT INTO UserRoles (UserId, RoleId) VALUES (@DriverId, @DriverRoleId);
END

-- Insert sample vehicles
DECLARE @Vehicle1Id UNIQUEIDENTIFIER = NEWID();
DECLARE @Vehicle2Id UNIQUEIDENTIFIER = NEWID();
DECLARE @Vehicle3Id UNIQUEIDENTIFIER = NEWID();

IF NOT EXISTS (SELECT 1 FROM Vehicles WHERE VIN = '1HGBH41JXMN109186')
BEGIN
    INSERT INTO Vehicles (Id, VIN, Make, Model, Year, Color, LicensePlate, Mileage, Status, OwnerId)
    VALUES (@Vehicle1Id, '1HGBH41JXMN109186', 'Honda', 'Civic', 2022, 'Blue', 'ABC123', 15000, 'Available', @UserId);
END

IF NOT EXISTS (SELECT 1 FROM Vehicles WHERE VIN = '1FTFW1ET5DFC10312')
BEGIN
    INSERT INTO Vehicles (Id, VIN, Make, Model, Year, Color, LicensePlate, Mileage, Status)
    VALUES (@Vehicle2Id, '1FTFW1ET5DFC10312', 'Ford', 'F-150', 2023, 'Red', 'XYZ789', 8500, 'Available');
END

IF NOT EXISTS (SELECT 1 FROM Vehicles WHERE VIN = '1G1YY22G865123456')
BEGIN
    INSERT INTO Vehicles (Id, VIN, Make, Model, Year, Color, LicensePlate, Mileage, Status, OwnerId)
    VALUES (@Vehicle3Id, '1G1YY22G865123456', 'Chevrolet', 'Camaro', 2021, 'Black', 'CAM001', 22000, 'In Use', @DriverId);
END

-- Insert sample maintenance records
INSERT INTO MaintenanceRecords (VehicleId, Title, Description, ServiceType, Cost, ServiceDate, Status, ServiceProvider, Mileage)
VALUES 
    (@Vehicle1Id, 'Oil Change', 'Regular oil change and filter replacement', 'Routine', 75.00, DATEADD(DAY, -30, GETUTCDATE()), 'Completed', 'Quick Lube', 14500),
    (@Vehicle2Id, 'Brake Inspection', 'Annual brake system inspection', 'Inspection', 150.00, DATEADD(DAY, -15, GETUTCDATE()), 'Completed', 'Auto Center', 8000),
    (@Vehicle3Id, 'Tire Rotation', 'Rotate tires for even wear', 'Routine', 50.00, DATEADD(DAY, -10, GETUTCDATE()), 'Completed', 'Tire Shop', 21500);

-- Insert sample fuel records
INSERT INTO FuelRecords (VehicleId, FuelAmount, Cost, PricePerUnit, Mileage, FuelDate, Location, RecordedById)
VALUES 
    (@Vehicle1Id, 12.5, 45.50, 3.64, 15000, DATEADD(DAY, -5, GETUTCDATE()), 'Shell Station Main St', @UserId),
    (@Vehicle2Id, 18.2, 68.25, 3.75, 8500, DATEADD(DAY, -3, GETUTCDATE()), 'Exxon Highway 101', @AdminId),
    (@Vehicle3Id, 14.8, 52.30, 3.53, 22000, DATEADD(DAY, -1, GETUTCDATE()), 'BP Downtown', @DriverId);
