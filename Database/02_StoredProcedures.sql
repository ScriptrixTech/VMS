
USE VehicleManagementSystem;
GO

-- Vehicle Management Stored Procedures

-- Get all vehicles with pagination
CREATE OR ALTER PROCEDURE sp_GetVehicles
    @PageNumber INT = 1,
    @PageSize INT = 10,
    @SearchTerm NVARCHAR(100) = NULL,
    @Status NVARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    SELECT 
        v.Id,
        v.VIN,
        v.Make,
        v.Model,
        v.Year,
        v.Color,
        v.LicensePlate,
        v.Mileage,
        v.Status,
        v.OwnerId,
        u.FirstName + ' ' + u.LastName AS OwnerName,
        v.CreatedAt,
        v.UpdatedAt,
        COUNT(*) OVER() AS TotalCount
    FROM Vehicles v
    LEFT JOIN Users u ON v.OwnerId = u.Id
    WHERE 
        (@SearchTerm IS NULL OR 
         v.Make LIKE '%' + @SearchTerm + '%' OR 
         v.Model LIKE '%' + @SearchTerm + '%' OR 
         v.LicensePlate LIKE '%' + @SearchTerm + '%')
        AND (@Status IS NULL OR v.Status = @Status)
    ORDER BY v.CreatedAt DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO

-- Get vehicle by ID
CREATE OR ALTER PROCEDURE sp_GetVehicleById
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        v.Id,
        v.VIN,
        v.Make,
        v.Model,
        v.Year,
        v.Color,
        v.LicensePlate,
        v.Mileage,
        v.Status,
        v.OwnerId,
        u.FirstName + ' ' + u.LastName AS OwnerName,
        v.CreatedAt,
        v.UpdatedAt
    FROM Vehicles v
    LEFT JOIN Users u ON v.OwnerId = u.Id
    WHERE v.Id = @Id;
END
GO

-- Create or update vehicle
CREATE OR ALTER PROCEDURE sp_UpsertVehicle
    @Id UNIQUEIDENTIFIER = NULL,
    @VIN NVARCHAR(17),
    @Make NVARCHAR(50),
    @Model NVARCHAR(50),
    @Year INT,
    @Color NVARCHAR(30),
    @LicensePlate NVARCHAR(20),
    @Mileage DECIMAL(18,2),
    @Status NVARCHAR(20),
    @OwnerId NVARCHAR(450) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @Id IS NULL OR NOT EXISTS(SELECT 1 FROM Vehicles WHERE Id = @Id)
    BEGIN
        -- Insert new vehicle
        SET @Id = NEWID();
        INSERT INTO Vehicles (Id, VIN, Make, Model, Year, Color, LicensePlate, Mileage, Status, OwnerId, CreatedAt)
        VALUES (@Id, @VIN, @Make, @Model, @Year, @Color, @LicensePlate, @Mileage, @Status, @OwnerId, GETUTCDATE());
    END
    ELSE
    BEGIN
        -- Update existing vehicle
        UPDATE Vehicles 
        SET VIN = @VIN,
            Make = @Make,
            Model = @Model,
            Year = @Year,
            Color = @Color,
            LicensePlate = @LicensePlate,
            Mileage = @Mileage,
            Status = @Status,
            OwnerId = @OwnerId,
            UpdatedAt = GETUTCDATE()
        WHERE Id = @Id;
    END
    
    -- Return the vehicle
    EXEC sp_GetVehicleById @Id;
END
GO

-- Delete vehicle
CREATE OR ALTER PROCEDURE sp_DeleteVehicle
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Vehicles WHERE Id = @Id;
    SELECT @@ROWCOUNT AS DeletedCount;
END
GO

-- Maintenance Records Stored Procedures

-- Get maintenance records for a vehicle
CREATE OR ALTER PROCEDURE sp_GetMaintenanceRecords
    @VehicleId UNIQUEIDENTIFIER = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 10
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    SELECT 
        m.Id,
        m.VehicleId,
        v.Make + ' ' + v.Model + ' (' + v.LicensePlate + ')' AS VehicleInfo,
        m.Title,
        m.Description,
        m.ServiceType,
        m.Cost,
        m.ServiceDate,
        m.NextServiceDate,
        m.Status,
        m.PerformedById,
        u.FirstName + ' ' + u.LastName AS PerformedByName,
        m.ServiceProvider,
        m.Mileage,
        m.CreatedAt,
        COUNT(*) OVER() AS TotalCount
    FROM MaintenanceRecords m
    LEFT JOIN Vehicles v ON m.VehicleId = v.Id
    LEFT JOIN Users u ON m.PerformedById = u.Id
    WHERE (@VehicleId IS NULL OR m.VehicleId = @VehicleId)
    ORDER BY m.ServiceDate DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO

-- Create maintenance record
CREATE OR ALTER PROCEDURE sp_CreateMaintenanceRecord
    @VehicleId UNIQUEIDENTIFIER,
    @Title NVARCHAR(200),
    @Description NVARCHAR(MAX),
    @ServiceType NVARCHAR(50),
    @Cost DECIMAL(18,2),
    @ServiceDate DATETIME2,
    @NextServiceDate DATETIME2 = NULL,
    @Status NVARCHAR(20),
    @PerformedById NVARCHAR(450) = NULL,
    @ServiceProvider NVARCHAR(200) = NULL,
    @Mileage DECIMAL(18,2) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Id UNIQUEIDENTIFIER = NEWID();
    
    INSERT INTO MaintenanceRecords 
    (Id, VehicleId, Title, Description, ServiceType, Cost, ServiceDate, NextServiceDate, 
     Status, PerformedById, ServiceProvider, Mileage, CreatedAt)
    VALUES 
    (@Id, @VehicleId, @Title, @Description, @ServiceType, @Cost, @ServiceDate, @NextServiceDate,
     @Status, @PerformedById, @ServiceProvider, @Mileage, GETUTCDATE());
    
    SELECT @Id AS Id;
END
GO

-- Fuel Records Stored Procedures

-- Get fuel records
CREATE OR ALTER PROCEDURE sp_GetFuelRecords
    @VehicleId UNIQUEIDENTIFIER = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 10
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    SELECT 
        f.Id,
        f.VehicleId,
        v.Make + ' ' + v.Model + ' (' + v.LicensePlate + ')' AS VehicleInfo,
        f.FuelAmount,
        f.Cost,
        f.PricePerUnit,
        f.Mileage,
        f.FuelEfficiency,
        f.FuelDate,
        f.Location,
        f.RecordedById,
        u.FirstName + ' ' + u.LastName AS RecordedByName,
        f.CreatedAt,
        COUNT(*) OVER() AS TotalCount
    FROM FuelRecords f
    LEFT JOIN Vehicles v ON f.VehicleId = v.Id
    LEFT JOIN Users u ON f.RecordedById = u.Id
    WHERE (@VehicleId IS NULL OR f.VehicleId = @VehicleId)
    ORDER BY f.FuelDate DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO

-- Create fuel record
CREATE OR ALTER PROCEDURE sp_CreateFuelRecord
    @VehicleId UNIQUEIDENTIFIER,
    @FuelAmount DECIMAL(18,2),
    @Cost DECIMAL(18,2),
    @PricePerUnit DECIMAL(18,2),
    @Mileage DECIMAL(18,2),
    @FuelDate DATETIME2,
    @Location NVARCHAR(200) = NULL,
    @RecordedById NVARCHAR(450) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Id UNIQUEIDENTIFIER = NEWID();
    DECLARE @FuelEfficiency DECIMAL(18,2) = NULL;
    
    -- Calculate fuel efficiency if possible
    DECLARE @PreviousMileage DECIMAL(18,2);
    SELECT TOP 1 @PreviousMileage = Mileage 
    FROM FuelRecords 
    WHERE VehicleId = @VehicleId AND FuelDate < @FuelDate 
    ORDER BY FuelDate DESC;
    
    IF @PreviousMileage IS NOT NULL AND @PreviousMileage < @Mileage
    BEGIN
        SET @FuelEfficiency = (@Mileage - @PreviousMileage) / @FuelAmount;
    END
    
    INSERT INTO FuelRecords 
    (Id, VehicleId, FuelAmount, Cost, PricePerUnit, Mileage, FuelEfficiency, 
     FuelDate, Location, RecordedById, CreatedAt)
    VALUES 
    (@Id, @VehicleId, @FuelAmount, @Cost, @PricePerUnit, @Mileage, @FuelEfficiency,
     @FuelDate, @Location, @RecordedById, GETUTCDATE());
    
    SELECT @Id AS Id;
END
GO

-- Dashboard Analytics Stored Procedures

-- Get dashboard statistics
CREATE OR ALTER PROCEDURE sp_GetDashboardStats
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Vehicle statistics
    SELECT 
        COUNT(*) AS TotalVehicles,
        COUNT(CASE WHEN Status = 'Available' THEN 1 END) AS AvailableVehicles,
        COUNT(CASE WHEN Status = 'In Use' THEN 1 END) AS InUseVehicles,
        COUNT(CASE WHEN Status = 'Maintenance' THEN 1 END) AS MaintenanceVehicles,
        AVG(Mileage) AS AverageMileage
    FROM Vehicles;
    
    -- Maintenance statistics
    SELECT 
        COUNT(*) AS TotalMaintenanceRecords,
        COUNT(CASE WHEN Status = 'Pending' THEN 1 END) AS PendingMaintenance,
        COUNT(CASE WHEN Status = 'In Progress' THEN 1 END) AS InProgressMaintenance,
        SUM(Cost) AS TotalMaintenanceCost,
        AVG(Cost) AS AverageMaintenanceCost
    FROM MaintenanceRecords
    WHERE ServiceDate >= DATEADD(MONTH, -12, GETUTCDATE());
    
    -- Fuel statistics
    SELECT 
        COUNT(*) AS TotalFuelRecords,
        SUM(Cost) AS TotalFuelCost,
        SUM(FuelAmount) AS TotalFuelAmount,
        AVG(PricePerUnit) AS AverageFuelPrice,
        AVG(FuelEfficiency) AS AverageFuelEfficiency
    FROM FuelRecords
    WHERE FuelDate >= DATEADD(MONTH, -12, GETUTCDATE());
END
GO

-- Get monthly cost trends
CREATE OR ALTER PROCEDURE sp_GetMonthlyCostTrends
    @Months INT = 12
AS
BEGIN
    SET NOCOUNT ON;
    
    WITH MonthlyData AS (
        SELECT 
            YEAR(ServiceDate) AS Year,
            MONTH(ServiceDate) AS Month,
            SUM(Cost) AS MaintenanceCost,
            0 AS FuelCost
        FROM MaintenanceRecords
        WHERE ServiceDate >= DATEADD(MONTH, -@Months, GETUTCDATE())
        GROUP BY YEAR(ServiceDate), MONTH(ServiceDate)
        
        UNION ALL
        
        SELECT 
            YEAR(FuelDate) AS Year,
            MONTH(FuelDate) AS Month,
            0 AS MaintenanceCost,
            SUM(Cost) AS FuelCost
        FROM FuelRecords
        WHERE FuelDate >= DATEADD(MONTH, -@Months, GETUTCDATE())
        GROUP BY YEAR(FuelDate), MONTH(FuelDate)
    )
    SELECT 
        Year,
        Month,
        DATENAME(MONTH, DATEFROMPARTS(Year, Month, 1)) + ' ' + CAST(Year AS NVARCHAR(4)) AS MonthYear,
        SUM(MaintenanceCost) AS MaintenanceCost,
        SUM(FuelCost) AS FuelCost,
        SUM(MaintenanceCost + FuelCost) AS TotalCost
    FROM MonthlyData
    GROUP BY Year, Month
    ORDER BY Year, Month;
END
GO
