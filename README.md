# Varshini Fleet Manager

A comprehensive mobile application for fleet management and workforce management, designed for Varshini Media Solutions - an advertising agency operating mobile advertising services using trucks and vans.

## Features

### Phase 1 - Core Foundation (Current)
- **User Management System**
  - Role-based authentication (Admin/Driver)
  - Secure login with mobile number/email
  - User profile management

- **Fleet Management**
  - Vehicle registration and information
  - Basic vehicle status tracking
  - Vehicle assignment to drivers

- **Attendance System**
  - GPS-enabled check-in/check-out
  - Real-time location tracking
  - Attendance history and reports

- **Financial Request System**
  - Quick amount requests (₹200, ₹500, ₹1000, ₹2000)
  - Custom amount requests
  - Request approval workflow
  - Request history tracking

### Admin Features
- **Dashboard Overview**
  - Fleet status summary
  - Workforce overview
  - Financial metrics
  - Pending requests alerts

- **Fleet Management**
  - Add/edit/delete vehicles
  - Assign vehicles to drivers
  - Track vehicle status

- **Driver Management**
  - Add/edit driver profiles
  - View driver performance
  - Manage driver assignments

- **Request Management**
  - Approve/reject money requests
  - View request history
  - Financial reporting

### Driver Features
- **Personal Dashboard**
  - Today's schedule and assignments
  - Attendance status
  - Earnings summary

- **Attendance Management**
  - GPS-enabled attendance marking
  - Location verification
  - Attendance history

- **Money Requests**
  - Submit advance payment requests
  - Track request status
  - View request history

## Technology Stack

- **Frontend**: React Native with Expo
- **UI Library**: React Native Paper (Material Design)
- **Navigation**: Expo Router
- **State Management**: React Hooks (useState, useEffect)
- **Location Services**: Expo Location
- **Icons**: Expo Vector Icons
- **TypeScript**: Full type safety

## Project Structure

```
├── app/                     # App routes and screens
│   ├── (auth)/             # Authentication screens
│   ├── (admin)/            # Admin portal screens
│   ├── (driver)/           # Driver portal screens
│   └── _layout.tsx         # Root layout
├── components/             # Reusable UI components
├── services/               # API services and data management
├── types/                  # TypeScript type definitions
├── constants/              # App constants and colors
├── assets/                 # Images, fonts, and other assets
└── utils/                  # Utility functions
```

## Installation & Setup

1. **Prerequisites**
   ```bash
   # Install Node.js (16.x or later)
   # Install Expo CLI
   npm install -g @expo/cli
   ```

2. **Project Setup**
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd varshini-fleet-manager

   # Install dependencies
   npm install

   # Start development server
   expo start
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```
   EXPO_PUBLIC_API_URL=https://your-api-endpoint.com
   ```

## Usage

### Admin Login
- Access admin portal with email/password
- Manage fleet, drivers, and requests
- View comprehensive dashboard and reports

### Driver Login
- Access driver portal with mobile number/password
- Mark attendance with GPS verification
- Submit and track money requests
- View personal schedule and earnings

## Development Status

### ✅ Completed (Phase 1)
- Basic project structure and navigation
- User authentication system
- Admin and driver dashboards
- Attendance system with GPS
- Money request system
- Basic fleet management interface

### 🚧 Upcoming (Phase 2)
- Payment gateway integration
- Advanced GPS tracking
- Comprehensive reporting system
- Campaign management
- Document management system

### 📋 Future Enhancements (Phase 3)
- Real-time notifications
- Advanced analytics
- Client portal
- Mobile app optimization
- Performance monitoring

## API Integration

The app is designed to work with a REST API backend. Current implementation includes:
- Mock data for development and testing
- API client configuration
- Type-safe service layer
- Error handling and loading states

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is proprietary software developed for Varshini Media Solutions.

## Support

For technical support or feature requests, please contact the development team.

---

**Varshini Media Solutions**  
Digital Fleet & Workforce Management Solution  
Version 1.0.0