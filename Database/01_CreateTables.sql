
-- Vehicle Management System Database Schema
-- Create Database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'VehicleManagementSystem')
BEGIN
    CREATE DATABASE VehicleManagementSystem;
END
GO

USE VehicleManagementSystem;
GO

-- Create Users table (extends AspNetUsers)
CREATE TABLE Users (
    Id NVARCHAR(450) NOT NULL PRIMARY KEY,
    UserName NVARCHAR(256) NULL,
    NormalizedUserName NVARCHAR(256) NULL,
    Email NVARCHAR(256) NULL,
    NormalizedEmail NVARCHAR(256) NULL,
    EmailConfirmed BIT NOT NULL,
    PasswordHash NVARCHAR(MAX) NULL,
    SecurityStamp NVARCHAR(MAX) NULL,
    ConcurrencyStamp NVARCHAR(MAX) NULL,
    PhoneNumber NVARCHAR(MAX) NULL,
    PhoneNumberConfirmed BIT NOT NULL,
    TwoFactorEnabled BIT NOT NULL,
    LockoutEnd DATETIMEOFFSET(7) NULL,
    LockoutEnabled BIT NOT NULL,
    AccessFailedCount INT NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL
);

-- Create Vehicles table
CREATE TABLE Vehicles (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    VIN NVARCHAR(17) NOT NULL UNIQUE,
    Make NVARCHAR(50) NOT NULL,
    Model NVARCHAR(50) NOT NULL,
    Year INT NOT NULL,
    Color NVARCHAR(30) NULL,
    LicensePlate NVARCHAR(20) NOT NULL UNIQUE,
    Mileage DECIMAL(18,2) NOT NULL DEFAULT 0,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Available',
    OwnerId NVARCHAR(450) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    FOREIGN KEY (OwnerId) REFERENCES Users(Id) ON DELETE SET NULL
);

-- Create MaintenanceRecords table
CREATE TABLE MaintenanceRecords (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    VehicleId UNIQUEIDENTIFIER NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    ServiceType NVARCHAR(50) NOT NULL,
    Cost DECIMAL(18,2) NOT NULL DEFAULT 0,
    ServiceDate DATETIME2 NOT NULL,
    NextServiceDate DATETIME2 NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Completed',
    PerformedById NVARCHAR(450) NULL,
    ServiceProvider NVARCHAR(200) NULL,
    Mileage DECIMAL(18,2) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    FOREIGN KEY (VehicleId) REFERENCES Vehicles(Id) ON DELETE CASCADE,
    FOREIGN KEY (PerformedById) REFERENCES Users(Id) ON DELETE SET NULL
);

-- Create FuelRecords table
CREATE TABLE FuelRecords (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    VehicleId UNIQUEIDENTIFIER NOT NULL,
    FuelAmount DECIMAL(18,2) NOT NULL,
    Cost DECIMAL(18,2) NOT NULL,
    PricePerUnit DECIMAL(18,2) NOT NULL,
    Mileage DECIMAL(18,2) NOT NULL,
    FuelEfficiency DECIMAL(18,2) NULL,
    FuelDate DATETIME2 NOT NULL,
    Location NVARCHAR(200) NULL,
    RecordedById NVARCHAR(450) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (VehicleId) REFERENCES Vehicles(Id) ON DELETE CASCADE,
    FOREIGN KEY (RecordedById) REFERENCES Users(Id) ON DELETE SET NULL
);

-- Create RefreshTokens table
CREATE TABLE RefreshTokens (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    Token NVARCHAR(MAX) NOT NULL,
    UserId NVARCHAR(450) NOT NULL,
    ExpiryDate DATETIME2 NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsRevoked BIT NOT NULL DEFAULT 0,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Create Roles table
CREATE TABLE Roles (
    Id NVARCHAR(450) NOT NULL PRIMARY KEY,
    Name NVARCHAR(256) NULL,
    NormalizedName NVARCHAR(256) NULL,
    ConcurrencyStamp NVARCHAR(MAX) NULL
);

-- Create UserRoles table
CREATE TABLE UserRoles (
    UserId NVARCHAR(450) NOT NULL,
    RoleId NVARCHAR(450) NOT NULL,
    PRIMARY KEY (UserId, RoleId),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IX_Vehicles_VIN ON Vehicles(VIN);
CREATE INDEX IX_Vehicles_LicensePlate ON Vehicles(LicensePlate);
CREATE INDEX IX_Vehicles_OwnerId ON Vehicles(OwnerId);
CREATE INDEX IX_MaintenanceRecords_VehicleId ON MaintenanceRecords(VehicleId);
CREATE INDEX IX_MaintenanceRecords_ServiceDate ON MaintenanceRecords(ServiceDate);
CREATE INDEX IX_FuelRecords_VehicleId ON FuelRecords(VehicleId);
CREATE INDEX IX_FuelRecords_FuelDate ON FuelRecords(FuelDate);
CREATE INDEX IX_RefreshTokens_UserId ON RefreshTokens(UserId);
CREATE INDEX IX_RefreshTokens_Token ON RefreshTokens(Token);
