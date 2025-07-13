// Powered by OnSpace.AI
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Text, 
  Card, 
  Button, 
  FAB, 
  Searchbar, 
  Chip, 
  IconButton,
  Menu,
  Divider,
  Avatar
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Driver } from '../../types';

interface DriverStats {
  total: number;
  active: number;
  inactive: number;
  onLeave: number;
  withVehicle: number;
}

export default function DriverManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [stats, setStats] = useState<DriverStats>({
    total: 0,
    active: 0,
    inactive: 0,
    onLeave: 0,
    withVehicle: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  const fetchDriverData = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockDrivers: Driver[] = [
        {
          id: 'driver1',
          name: 'Rajesh Kumar',
          email: 'rajesh@example.com',
          mobile: '+91 9876543210',
          role: 'driver',
          status: 'active',
          licenseNumber: 'KA123456789',
          licenseExpiry: '2025-12-31',
          emergencyContact: '+91 9876543211',
          address: '123 Main St, Bangalore',
          joiningDate: '2023-01-15',
          salary: 25000,
          assignedVehicle: 'KA01AB1234',
          createdAt: '2023-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: 'driver2',
          name: 'Suresh Reddy',
          email: 'suresh@example.com',
          mobile: '+91 9876543220',
          role: 'driver',
          status: 'active',
          licenseNumber: 'KA987654321',
          licenseExpiry: '2026-06-30',
          emergencyContact: '+91 9876543221',
          address: '456 Park Ave, Bangalore',
          joiningDate: '2023-03-01',
          salary: 28000,
          assignedVehicle: 'KA02CD5678',
          createdAt: '2023-03-01',
          updatedAt: '2024-02-01'
        }
      ];

      setDrivers(mockDrivers);
      setStats({
        total: 30,
        active: 22,
        inactive: 5,
        onLeave: 3,
        withVehicle: 18
      });
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    fetchDriverData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDriverData();
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         driver.mobile.includes(searchQuery) ||
                         driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'inactive': return '#F44336';
      case 'on-leave': return '#FF9800';
      default: return '#666';
    }
  };

  const isLicenseExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry <= 30;
  };

  const handleDriverAction = (driverId: string, action: string) => {
    setMenuVisible(null);
    
    switch (action) {
      case 'view':
        router.push(`/(admin)/driver-details/${driverId}`);
        break;
      case 'edit':
        router.push(`/(admin)/edit-driver/${driverId}`);
        break;
      case 'attendance':
        router.push(`/(admin)/driver-attendance/${driverId}`);
        break;
      case 'salary':
        router.push(`/(admin)/driver-salary/${driverId}`);
        break;
      case 'assign-vehicle':
        router.push(`/(admin)/assign-vehicle-to-driver/${driverId}`);
        break;
      case 'deactivate':
        Alert.alert(
          'Deactivate Driver',
          'Are you sure you want to deactivate this driver?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Deactivate', style: 'destructive', onPress: () => {} }
          ]
        );
        break;
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Driver Management
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Manage your workforce
        </Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Driver Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <Card style={[styles.statCard, { borderLeftColor: '#1976D2' }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.total}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Total Drivers
                </Text>
              </Card.Content>
            </Card>
            
            <Card style={[styles.statCard, { borderLeftColor: '#4CAF50' }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.active}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Active
                </Text>
              </Card.Content>
            </Card>
          </View>
          
          <View style={styles.statsRow}>
            <Card style={[styles.statCard, { borderLeftColor: '#FF9800' }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.onLeave}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  On Leave
                </Text>
              </Card.Content>
            </Card>
            
            <Card style={[styles.statCard, { borderLeftColor: '#2196F3' }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.withVehicle}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  With Vehicle
                </Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchSection}>
          <Searchbar
            placeholder="Search drivers..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            <Chip
              selected={statusFilter === 'all'}
              onPress={() => setStatusFilter('all')}
              style={styles.filterChip}
            >
              All
            </Chip>
            <Chip
              selected={statusFilter === 'active'}
              onPress={() => setStatusFilter('active')}
              style={styles.filterChip}
            >
              Active
            </Chip>
            <Chip
              selected={statusFilter === 'inactive'}
              onPress={() => setStatusFilter('inactive')}
              style={styles.filterChip}
            >
              Inactive
            </Chip>
            <Chip
              selected={statusFilter === 'on-leave'}
              onPress={() => setStatusFilter('on-leave')}
              style={styles.filterChip}
            >
              On Leave
            </Chip>
          </ScrollView>
        </View>

        {/* Driver List */}
        <View style={styles.driverList}>
          {filteredDrivers.map((driver) => (
            <Card key={driver.id} style={styles.driverCard}>
              <Card.Content>
                <View style={styles.driverHeader}>
                  <View style={styles.driverInfo}>
                    <View style={styles.driverNameRow}>
                      <Avatar.Text 
                        size={40} 
                        label={driver.name.split(' ').map(n => n[0]).join('')}
                        style={styles.avatar}
                      />
                      <View style={styles.nameInfo}>
                        <Text variant="titleMedium" style={styles.driverName}>
                          {driver.name}
                        </Text>
                        <Text variant="bodySmall" style={styles.driverMobile}>
                          {driver.mobile}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.driverActions}>
                    <Chip 
                      mode="outlined"
                      textStyle={{ color: getStatusColor(driver.status) }}
                      style={[styles.statusChip, { borderColor: getStatusColor(driver.status) }]}
                    >
                      {driver.status}
                    </Chip>
                    
                    <Menu
                      visible={menuVisible === driver.id}
                      onDismiss={() => setMenuVisible(null)}
                      anchor={
                        <IconButton
                          icon="dots-vertical"
                          onPress={() => setMenuVisible(driver.id)}
                        />
                      }
                    >
                      <Menu.Item
                        onPress={() => handleDriverAction(driver.id, 'view')}
                        title="View Profile"
                        leadingIcon="account"
                      />
                      <Menu.Item
                        onPress={() => handleDriverAction(driver.id, 'edit')}
                        title="Edit Details"
                        leadingIcon="pencil"
                      />
                      <Menu.Item
                        onPress={() => handleDriverAction(driver.id, 'attendance')}
                        title="Attendance"
                        leadingIcon="calendar-check"
                      />
                      <Menu.Item
                        onPress={() => handleDriverAction(driver.id, 'salary')}
                        title="Salary Details"
                        leadingIcon="cash"
                      />
                      <Menu.Item
                        onPress={() => handleDriverAction(driver.id, 'assign-vehicle')}
                        title="Assign Vehicle"
                        leadingIcon="car"
                      />
                      <Divider />
                      <Menu.Item
                        onPress={() => handleDriverAction(driver.id, 'deactivate')}
                        title="Deactivate"
                        leadingIcon="account-off"
                        titleStyle={{ color: '#F44336' }}
                      />
                    </Menu>
                  </View>
                </View>
                
                <View style={styles.driverDetails}>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="badge" size={16} color="#666" />
                    <Text variant="bodySmall" style={styles.detailText}>
                      License: {driver.licenseNumber}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="attach-money" size={16} color="#666" />
                    <Text variant="bodySmall" style={styles.detailText}>
                      Salary: {formatCurrency(driver.salary)}
                    </Text>
                  </View>
                  {driver.assignedVehicle && (
                    <View style={styles.detailRow}>
                      <MaterialIcons name="directions-car" size={16} color="#666" />
                      <Text variant="bodySmall" style={styles.detailText}>
                        Vehicle: {driver.assignedVehicle}
                      </Text>
                    </View>
                  )}
                </View>
                
                {isLicenseExpiringSoon(driver.licenseExpiry) && (
                  <View style={styles.licenseAlert}>
                    <MaterialIcons name="warning" size={16} color="#F44336" />
                    <Text variant="bodySmall" style={styles.alertText}>
                      License expires on {new Date(driver.licenseExpiry).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/(admin)/add-driver')}
        label="Add Driver"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  subtitle: {
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    elevation: 2,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  statContent: {
    padding: 16,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    color: '#666',
    marginTop: 4,
  },
  searchSection: {
    marginBottom: 20,
  },
  searchbar: {
    marginBottom: 12,
    elevation: 2,
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterChip: {
    marginRight: 8,
  },
  driverList: {
    gap: 12,
  },
  driverCard: {
    elevation: 2,
    borderRadius: 8,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    backgroundColor: '#1976D2',
  },
  nameInfo: {
    flex: 1,
  },
  driverName: {
    fontWeight: 'bold',
    color: '#333',
  },
  driverMobile: {
    color: '#666',
    marginTop: 2,
  },
  driverActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusChip: {
    height: 28,
  },
  driverDetails: {
    gap: 8,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    color: '#666',
  },
  licenseAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  alertText: {
    color: '#F44336',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
    backgroundColor: '#1976D2',
  },
});