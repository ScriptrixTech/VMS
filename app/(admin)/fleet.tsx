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
  Divider
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Vehicle } from '../../types';

interface FleetStats {
  total: number;
  available: number;
  inUse: number;
  maintenance: number;
  retired: number;
}

export default function FleetManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState<FleetStats>({
    total: 0,
    available: 0,
    inUse: 0,
    maintenance: 0,
    retired: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  const fetchFleetData = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockVehicles: Vehicle[] = [
        {
          id: '1',
          registrationNumber: 'KA01AB1234',
          model: 'Tata Ace',
          brand: 'Tata',
          year: 2022,
          capacity: '750 kg',
          fuelType: 'diesel',
          insuranceNumber: 'INS123456',
          insuranceExpiry: '2024-12-31',
          rcNumber: 'RC123456',
          status: 'available',
          assignedDriver: 'driver1',
          lastServiceDate: '2024-01-15',
          nextServiceDue: '2024-07-15',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-15'
        },
        {
          id: '2',
          registrationNumber: 'KA02CD5678',
          model: 'Mahindra Bolero',
          brand: 'Mahindra',
          year: 2021,
          capacity: '1000 kg',
          fuelType: 'diesel',
          insuranceNumber: 'INS789012',
          insuranceExpiry: '2024-11-30',
          rcNumber: 'RC789012',
          status: 'in-use',
          assignedDriver: 'driver2',
          lastServiceDate: '2024-02-01',
          nextServiceDue: '2024-08-01',
          createdAt: '2024-01-01',
          updatedAt: '2024-02-01'
        }
      ];

      setVehicles(mockVehicles);
      setStats({
        total: 25,
        available: 12,
        inUse: 8,
        maintenance: 3,
        retired: 2
      });
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    fetchFleetData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFleetData();
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#4CAF50';
      case 'in-use': return '#2196F3';
      case 'maintenance': return '#FF9800';
      case 'retired': return '#9E9E9E';
      default: return '#666';
    }
  };

  const handleVehicleAction = (vehicleId: string, action: string) => {
    setMenuVisible(null);
    
    switch (action) {
      case 'edit':
        router.push(`/(admin)/vehicle-details/${vehicleId}`);
        break;
      case 'maintenance':
        router.push(`/(admin)/maintenance/${vehicleId}`);
        break;
      case 'assign':
        router.push(`/(admin)/assign-vehicle/${vehicleId}`);
        break;
      case 'delete':
        Alert.alert(
          'Delete Vehicle',
          'Are you sure you want to delete this vehicle?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {} }
          ]
        );
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Fleet Management
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Manage your vehicle fleet
        </Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Fleet Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <Card style={[styles.statCard, { borderLeftColor: '#1976D2' }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.total}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Total Vehicles
                </Text>
              </Card.Content>
            </Card>
            
            <Card style={[styles.statCard, { borderLeftColor: '#4CAF50' }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.available}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Available
                </Text>
              </Card.Content>
            </Card>
          </View>
          
          <View style={styles.statsRow}>
            <Card style={[styles.statCard, { borderLeftColor: '#2196F3' }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.inUse}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  In Use
                </Text>
              </Card.Content>
            </Card>
            
            <Card style={[styles.statCard, { borderLeftColor: '#FF9800' }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.maintenance}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Maintenance
                </Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchSection}>
          <Searchbar
            placeholder="Search vehicles..."
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
              selected={statusFilter === 'available'}
              onPress={() => setStatusFilter('available')}
              style={styles.filterChip}
            >
              Available
            </Chip>
            <Chip
              selected={statusFilter === 'in-use'}
              onPress={() => setStatusFilter('in-use')}
              style={styles.filterChip}
            >
              In Use
            </Chip>
            <Chip
              selected={statusFilter === 'maintenance'}
              onPress={() => setStatusFilter('maintenance')}
              style={styles.filterChip}
            >
              Maintenance
            </Chip>
          </ScrollView>
        </View>

        {/* Vehicle List */}
        <View style={styles.vehicleList}>
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} style={styles.vehicleCard}>
              <Card.Content>
                <View style={styles.vehicleHeader}>
                  <View style={styles.vehicleInfo}>
                    <Text variant="titleMedium" style={styles.vehicleReg}>
                      {vehicle.registrationNumber}
                    </Text>
                    <Text variant="bodyMedium" style={styles.vehicleModel}>
                      {vehicle.brand} {vehicle.model} ({vehicle.year})
                    </Text>
                  </View>
                  
                  <View style={styles.vehicleActions}>
                    <Chip 
                      mode="outlined"
                      textStyle={{ color: getStatusColor(vehicle.status) }}
                      style={[styles.statusChip, { borderColor: getStatusColor(vehicle.status) }]}
                    >
                      {vehicle.status}
                    </Chip>
                    
                    <Menu
                      visible={menuVisible === vehicle.id}
                      onDismiss={() => setMenuVisible(null)}
                      anchor={
                        <IconButton
                          icon="dots-vertical"
                          onPress={() => setMenuVisible(vehicle.id)}
                        />
                      }
                    >
                      <Menu.Item
                        onPress={() => handleVehicleAction(vehicle.id, 'edit')}
                        title="Edit Details"
                        leadingIcon="pencil"
                      />
                      <Menu.Item
                        onPress={() => handleVehicleAction(vehicle.id, 'maintenance')}
                        title="Maintenance"
                        leadingIcon="wrench"
                      />
                      <Menu.Item
                        onPress={() => handleVehicleAction(vehicle.id, 'assign')}
                        title="Assign Driver"
                        leadingIcon="account-plus"
                      />
                      <Divider />
                      <Menu.Item
                        onPress={() => handleVehicleAction(vehicle.id, 'delete')}
                        title="Delete"
                        leadingIcon="delete"
                        titleStyle={{ color: '#F44336' }}
                      />
                    </Menu>
                  </View>
                </View>
                
                <View style={styles.vehicleDetails}>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="local-gas-station" size={16} color="#666" />
                    <Text variant="bodySmall" style={styles.detailText}>
                      {vehicle.fuelType.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="fitness-center" size={16} color="#666" />
                    <Text variant="bodySmall" style={styles.detailText}>
                      {vehicle.capacity}
                    </Text>
                  </View>
                  {vehicle.assignedDriver && (
                    <View style={styles.detailRow}>
                      <MaterialIcons name="person" size={16} color="#666" />
                      <Text variant="bodySmall" style={styles.detailText}>
                        Driver Assigned
                      </Text>
                    </View>
                  )}
                </View>
                
                {vehicle.nextServiceDue && (
                  <View style={styles.serviceAlert}>
                    <MaterialIcons name="schedule" size={16} color="#FF9800" />
                    <Text variant="bodySmall" style={styles.serviceText}>
                      Next service due: {new Date(vehicle.nextServiceDue).toLocaleDateString()}
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
        onPress={() => router.push('/(admin)/add-vehicle')}
        label="Add Vehicle"
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
  vehicleList: {
    gap: 12,
  },
  vehicleCard: {
    elevation: 2,
    borderRadius: 8,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleReg: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  vehicleModel: {
    color: '#666',
    marginTop: 2,
  },
  vehicleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusChip: {
    height: 28,
  },
  vehicleDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
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
  serviceAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  serviceText: {
    color: '#FF9800',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
    backgroundColor: '#1976D2',
  },
});