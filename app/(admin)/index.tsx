
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Button, ActivityIndicator, Chip, DataTable, IconButton, Menu, FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { apiService } from '../../services/api';

const { width } = Dimensions.get('window');

interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  inUseVehicles: number;
  maintenanceVehicles: number;
  averageMileage: number;
  totalMaintenanceRecords: number;
  pendingMaintenance: number;
  inProgressMaintenance: number;
  totalMaintenanceCost: number;
  averageMaintenanceCost: number;
  totalFuelRecords: number;
  totalFuelCost: number;
  totalFuelAmount: number;
  averageFuelPrice: number;
  averageFuelEfficiency: number;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  roles: string[];
  createdAt: string;
}

interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  mileage: number;
  status: string;
  ownerName: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, usersResponse, vehiclesResponse] = await Promise.all([
        apiService.get('/dashboard/stats'),
        apiService.get('/users'),
        apiService.get('/vehicles')
      ]);

      setStats(statsResponse.data);
      setUsers(usersResponse.data.items || []);
      setVehicles(vehiclesResponse.data.items || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleUserAction = async (userId: string, action: string) => {
    setMenuVisible(null);
    
    switch (action) {
      case 'edit':
        router.push(`/(admin)/user-details/${userId}`);
        break;
      case 'activate':
      case 'deactivate':
        try {
          await apiService.patch(`/users/${userId}/status`, { 
            isActive: action === 'activate' 
          });
          fetchDashboardData();
        } catch (error) {
          Alert.alert('Error', 'Failed to update user status');
        }
        break;
      case 'delete':
        Alert.alert(
          'Delete User',
          'Are you sure you want to delete this user?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Delete', 
              style: 'destructive', 
              onPress: async () => {
                try {
                  await apiService.delete(`/users/${userId}`);
                  fetchDashboardData();
                } catch (error) {
                  Alert.alert('Error', 'Failed to delete user');
                }
              }
            }
          ]
        );
        break;
    }
  };

  const renderOverview = () => (
    <View style={styles.content}>
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Text variant="headlineSmall" style={styles.sectionTitle}>Fleet Overview</Text>
        
        <View style={styles.statsRow}>
          <Card style={[styles.statCard, { borderLeftColor: '#2196F3' }]}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.statValue}>
                {stats?.totalVehicles || 0}
              </Text>
              <Text style={styles.statLabel}>Total Vehicles</Text>
            </Card.Content>
          </Card>
          
          <Card style={[styles.statCard, { borderLeftColor: '#4CAF50' }]}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.statValue}>
                {stats?.availableVehicles || 0}
              </Text>
              <Text style={styles.statLabel}>Available</Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.statsRow}>
          <Card style={[styles.statCard, { borderLeftColor: '#FF9800' }]}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.statValue}>
                {stats?.inUseVehicles || 0}
              </Text>
              <Text style={styles.statLabel}>In Use</Text>
            </Card.Content>
          </Card>
          
          <Card style={[styles.statCard, { borderLeftColor: '#F44336' }]}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.statValue}>
                {stats?.maintenanceVehicles || 0}
              </Text>
              <Text style={styles.statLabel}>Maintenance</Text>
            </Card.Content>
          </Card>
        </View>
      </View>

      {/* Charts */}
      {stats && (
        <View style={styles.chartsContainer}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>Analytics</Text>
          
          <Card style={styles.chartCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.chartTitle}>Vehicle Status Distribution</Text>
              <PieChart
                data={[
                  { name: 'Available', population: stats.availableVehicles, color: '#4CAF50', legendFontColor: '#7F7F7F' },
                  { name: 'In Use', population: stats.inUseVehicles, color: '#FF9800', legendFontColor: '#7F7F7F' },
                  { name: 'Maintenance', population: stats.maintenanceVehicles, color: '#F44336', legendFontColor: '#7F7F7F' }
                ]}
                width={width - 64}
                height={200}
                chartConfig={{
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
              />
            </Card.Content>
          </Card>

          <Card style={styles.chartCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.chartTitle}>Cost Analysis</Text>
              <BarChart
                data={{
                  labels: ['Maintenance', 'Fuel'],
                  datasets: [{
                    data: [stats.totalMaintenanceCost || 0, stats.totalFuelCost || 0]
                  }]
                }}
                width={width - 64}
                height={200}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                  style: {
                    borderRadius: 16
                  }
                }}
                style={styles.chart}
              />
            </Card.Content>
          </Card>
        </View>
      )}
    </View>
  );

  const renderUserManagement = () => (
    <View style={styles.content}>
      <View style={styles.sectionHeader}>
        <Text variant="headlineSmall" style={styles.sectionTitle}>User Management</Text>
        <Button
          mode="contained"
          onPress={() => router.push('/(admin)/add-user')}
          icon="plus"
        >
          Add User
        </Button>
      </View>

      <Card style={styles.tableCard}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Email</DataTable.Title>
            <DataTable.Title>Role</DataTable.Title>
            <DataTable.Title>Status</DataTable.Title>
            <DataTable.Title>Actions</DataTable.Title>
          </DataTable.Header>

          {users.map((user) => (
            <DataTable.Row key={user.id}>
              <DataTable.Cell>{`${user.firstName} ${user.lastName}`}</DataTable.Cell>
              <DataTable.Cell>{user.email}</DataTable.Cell>
              <DataTable.Cell>
                <Chip mode="outlined" compact>
                  {user.roles?.[0] || 'User'}
                </Chip>
              </DataTable.Cell>
              <DataTable.Cell>
                <Chip 
                  mode="outlined" 
                  compact
                  textStyle={{ color: user.isActive ? '#4CAF50' : '#F44336' }}
                  style={{ borderColor: user.isActive ? '#4CAF50' : '#F44336' }}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </Chip>
              </DataTable.Cell>
              <DataTable.Cell>
                <Menu
                  visible={menuVisible === user.id}
                  onDismiss={() => setMenuVisible(null)}
                  anchor={
                    <IconButton
                      icon="dots-vertical"
                      onPress={() => setMenuVisible(user.id)}
                    />
                  }
                >
                  <Menu.Item
                    onPress={() => handleUserAction(user.id, 'edit')}
                    title="Edit"
                    leadingIcon="pencil"
                  />
                  <Menu.Item
                    onPress={() => handleUserAction(user.id, user.isActive ? 'deactivate' : 'activate')}
                    title={user.isActive ? 'Deactivate' : 'Activate'}
                    leadingIcon={user.isActive ? 'account-off' : 'account-check'}
                  />
                  <Menu.Item
                    onPress={() => handleUserAction(user.id, 'delete')}
                    title="Delete"
                    leadingIcon="delete"
                  />
                </Menu>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Card>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Admin Dashboard
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Vehicle Management System Control Panel
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <Button
          mode={selectedTab === 'overview' ? 'contained' : 'outlined'}
          onPress={() => setSelectedTab('overview')}
          style={styles.tabButton}
        >
          Overview
        </Button>
        <Button
          mode={selectedTab === 'users' ? 'contained' : 'outlined'}
          onPress={() => setSelectedTab('users')}
          style={styles.tabButton}
        >
          Users
        </Button>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {selectedTab === 'overview' ? renderOverview() : renderUserManagement()}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/(admin)/fleet')}
        label="Manage Fleet"
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
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  tabButton: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  statsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  statValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    color: '#666',
    marginTop: 4,
  },
  chartsContainer: {
    gap: 16,
  },
  chartCard: {
    elevation: 2,
    borderRadius: 8,
  },
  chartTitle: {
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  chart: {
    borderRadius: 16,
  },
  tableCard: {
    elevation: 2,
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
