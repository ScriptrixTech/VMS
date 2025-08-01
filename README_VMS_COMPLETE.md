
# Vehicle Management System (VMS) - Complete Implementation

A comprehensive, production-ready Vehicle Management System built with React Native (Expo), .NET Core 8, and SQLite, featuring JWT authentication, biometric login, real-time analytics, and complete CRUD operations.

## 🚀 Features

### Core Functionality
- **Fleet Management**: Complete vehicle lifecycle management
- **Maintenance Scheduling**: Calendar-based maintenance planning with reminders
- **Fuel Tracking**: Comprehensive fuel consumption and efficiency monitoring
- **User Management**: Role-based access control (Admin, Driver, User)
- **Real-time Analytics**: Dashboard with charts and performance metrics
- **Data Export**: CSV/PDF report generation
- **Biometric Authentication**: Fingerprint/Face ID login support

### Technical Features
- **JWT Authentication** with refresh tokens
- **Role-based Authorization** (Admin, Driver, User)
- **RESTful API** with OpenAPI/Swagger documentation
- **Real-time Dashboard** with interactive charts
- **Mobile-first Design** with responsive UI
- **Offline Capability** with local data caching
- **File Uploads** for maintenance documentation
- **Push Notifications** for maintenance reminders

## 🏗️ Architecture

### Backend (.NET Core 8)
```
VMS.Backend/
├── Controllers/         # API endpoints
├── Services/           # Business logic
├── Models/             # Data models
├── DTOs/              # Data transfer objects
├── Data/              # Database context & seeding
└── Scripts/           # Database initialization
```

### Frontend (React Native/Expo)
```
app/
├── (auth)/            # Authentication screens
├── (admin)/           # Admin dashboard
├── (driver)/          # Driver interface
├── (tabs)/            # Main navigation
├── contexts/          # React contexts
├── services/          # API services
└── components/        # Reusable components
```

### Database (SQLite)
```
Database/
├── 01_CreateTables.sql    # Schema definition
├── 02_StoredProcedures.sql # Database procedures
└── 03_SeedData.sql        # Sample data
```

## 🚀 Quick Start in Replit

### 1. Run the Application
Click the **Run** button in Replit to start both services:
- Frontend: http://localhost:8081
- Backend API: http://localhost:5000
- Swagger UI: http://localhost:5000/swagger

### 2. Test Credentials

#### Admin Access
- **Email**: admin@vms.com
- **Password**: Admin123!
- **Phone**: +1234567890

#### Driver Access
- **Email**: john.driver@vms.com
- **Password**: Driver123!
- **Phone**: +1234567891

#### Additional Test Users
- **jane.driver@vms.com** / Driver123! / +1234567892
- **mike.driver@vms.com** / Driver123! / +1234567893
- **user1@vms.com** / User123! / +1234567895

### 3. Sample Data Included
- **10 Vehicles** with different statuses
- **25 Maintenance Records** across all vehicles
- **50 Fuel Records** with efficiency calculations
- **6 Users** with different roles

## 📱 User Guide

### Admin Dashboard
1. **Overview Tab**
   - Fleet statistics and KPIs
   - Interactive charts (Pie, Bar, Line)
   - Real-time vehicle status distribution

2. **User Management Tab**
   - Create, edit, activate/deactivate users
   - Role assignment and management
   - User activity monitoring

3. **Fleet Management** (`/admin/fleet`)
   - Vehicle CRUD operations
   - Status management (Available, In Use, Maintenance)
   - Assignment and tracking

4. **Maintenance Scheduler** (`/admin/maintenance`)
   - Calendar view of all maintenance
   - Schedule new maintenance
   - Send reminders to drivers
   - Track service history

5. **Reports & Analytics** (`/admin/reports`)
   - Comprehensive analytics dashboard
   - Export data in CSV/PDF formats
   - Cost trend analysis
   - Vehicle utilization reports

### Driver Interface
1. **Dashboard** (`/driver`)
   - Assigned vehicles overview
   - Pending maintenance alerts
   - Quick actions (fuel entry, maintenance requests)

2. **Vehicle Details**
   - Real-time vehicle information
   - Maintenance history
   - Fuel efficiency tracking

3. **Attendance Tracking** (`/driver/attendance`)
   - Clock in/out functionality
   - Location-based verification
   - Hours tracking

### Authentication Features
1. **Standard Login**
   - Email/Phone + Password
   - Role-based redirection

2. **Biometric Login** (Mobile only)
   - Fingerprint authentication
   - Face ID support
   - Secure token storage

3. **JWT Security**
   - Access tokens (30 min expiry)
   - Refresh token rotation
   - Secure logout

## 🔧 API Documentation

### Authentication Endpoints
```
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
POST /api/auth/refresh-token  # Token refresh
POST /api/auth/logout         # User logout
```

### Vehicle Management
```
GET    /api/vehicles          # List all vehicles
GET    /api/vehicles/{id}     # Get vehicle details
POST   /api/vehicles          # Create vehicle
PUT    /api/vehicles/{id}     # Update vehicle
DELETE /api/vehicles/{id}     # Delete vehicle
PATCH  /api/vehicles/{id}/status # Update vehicle status
```

### Maintenance Management
```
GET    /api/maintenance                    # List maintenance records
GET    /api/maintenance/{id}               # Get maintenance details
POST   /api/maintenance                    # Create maintenance record
PUT    /api/maintenance/{id}               # Update maintenance
DELETE /api/maintenance/{id}               # Delete maintenance
POST   /api/maintenance/{id}/reminder      # Send reminder
GET    /api/maintenance/upcoming           # Upcoming maintenance
GET    /api/maintenance/overdue            # Overdue maintenance
```

### Fuel Management
```
GET    /api/fuel              # List fuel records
POST   /api/fuel              # Create fuel record
PUT    /api/fuel/{id}         # Update fuel record
DELETE /api/fuel/{id}         # Delete fuel record
GET    /api/fuel/efficiency   # Fuel efficiency report
```

### User Management
```
GET    /api/users             # List all users
GET    /api/users/{id}        # Get user details
POST   /api/users             # Create user
PUT    /api/users/{id}        # Update user
DELETE /api/users/{id}        # Delete user
PATCH  /api/users/{id}/status # Update user status
```

### Dashboard & Reports
```
GET    /api/dashboard/stats                # Dashboard statistics
GET    /api/reports/monthly-cost-trends    # Cost trend analysis
GET    /api/reports/vehicle-utilization    # Vehicle utilization
GET    /api/reports/top-maintenance        # Top maintenance vehicles
POST   /api/reports/export                 # Export reports
```

## 🛠️ Development

### Backend Development
```bash
cd VMS.Backend
dotnet restore
dotnet run
```

### Frontend Development
```bash
npm install
npm run start
```

### Database Management
The application uses SQLite with Entity Framework Core:
- **Auto-migration**: Database is created automatically
- **Seeding**: Sample data is populated on first run
- **Location**: `VMS.db` in the backend directory

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure stateless authentication
- **Role-based Access**: Admin, Driver, User roles
- **Password Hashing**: BCrypt with salt
- **Token Expiration**: 30-minute access tokens
- **Refresh Tokens**: Secure token renewal

### API Security
- **CORS Protection**: Configured for Replit domains
- **Rate Limiting**: 100 requests per minute
- **Input Validation**: Data annotation validation
- **SQL Injection Prevention**: Parameterized queries

### Mobile Security
- **Biometric Storage**: Secure keychain storage
- **SSL Pinning**: Certificate validation
- **Local Storage Encryption**: Sensitive data protection

## 📊 Performance Features

### Frontend Optimization
- **Lazy Loading**: Route-based code splitting
- **Image Optimization**: Compressed assets
- **Caching Strategy**: API response caching
- **Offline Support**: Local data persistence

### Backend Optimization
- **Database Indexing**: Optimized query performance
- **Response Compression**: Gzip compression
- **Connection Pooling**: Efficient database connections
- **Logging**: Structured logging with Serilog

## 🧪 Testing

### Manual Testing Scenarios

#### 1. Authentication Flow
1. Open the app → Should show login screen
2. Login with admin credentials → Should redirect to admin dashboard
3. Logout → Should return to login screen
4. Login with driver credentials → Should redirect to driver dashboard

#### 2. Vehicle Management (Admin)
1. Navigate to Fleet Management
2. Create a new vehicle with VIN validation
3. Edit vehicle details
4. Change vehicle status
5. Delete a vehicle

#### 3. Maintenance Scheduling
1. Navigate to Maintenance Scheduler
2. View calendar with existing maintenance
3. Schedule new maintenance
4. Send maintenance reminder
5. Mark maintenance as complete

#### 4. Data Export
1. Navigate to Reports
2. Select report type and date range
3. Export as CSV
4. Verify file download/sharing

#### 5. Biometric Login (Mobile)
1. Login with standard credentials
2. Enable biometric authentication
3. Logout and login with biometrics
4. Disable biometric authentication

## 🚀 Deployment

### Replit Deployment
The application is configured for automatic deployment on Replit:

1. **Frontend**: Expo development server on port 8081
2. **Backend**: .NET Core API on port 5000
3. **Database**: SQLite file in the backend directory

### Production Considerations
For production deployment, consider:

1. **Database**: Migrate to PostgreSQL or SQL Server
2. **File Storage**: Use cloud storage (AWS S3, Azure Blob)
3. **Environment Variables**: Secure configuration management
4. **SSL Certificates**: HTTPS enforcement
5. **Monitoring**: Application performance monitoring
6. **Backups**: Regular database backups

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/swagger`
- Review the test credentials above

---

**Ready to use!** Click the Run button in Replit and start exploring the complete Vehicle Management System.
