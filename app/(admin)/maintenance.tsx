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
  Badge
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MaintenanceRecord } from '../../types';

interface MaintenanceStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  totalCost: number;
}

export default function MaintenanceManagement() {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [stats, setStats] = useState<MaintenanceStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    totalCost: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  const fetchMaintenanceData = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockRecords: MaintenanceRecord[] = [
        {
          id: 'maint1',
          vehicleId: 'vehicle1',
          type: 'routine',
          description: 'Regular service and oil change',
          cost: 8000,
          serviceProvider: 'ABC Auto Service',
          date: '2024-07-15',
          nextServiceDue: '2024-10-15',
          parts: ['Engine Oil', 'Oil Filter', 'Air Filter'],
          status: 'completed',
          createdAt: '2024-07-10',
          updatedAt: '2024-07-15'
        },
        {
          id: 'maint2',
          vehicleId: 'vehicle2',
          type: 'repair',
          description: 'Brake system repair and replacement',
          cost: 15000,
          serviceProvider: 'XYZ Motors',
          date: '2024-07-20',
          parts: ['Brake Pads', 'Brake Fluid'],
          status: 'in-progress',
          createdAt: '2024-07-18',
          updatedAt: '2024-07-20'
        }
      ];

      setRecords(mockRecords);
      setStats({
        total: 45,
        pending: 12,
        inProgress: 8,
        completed: 20,
        overdue: 5,
        totalCost: 485000
      });
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMaintenanceData();
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.serviceProvider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesType = typeFilter === 'all' || record.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'in-progress': return '#2196F3';
      case 'completed': return '#4CAF50';
      default: return '#666';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'routine': return '#4CAF50';
      case 'repair': return '#FF9800';
      case 'inspection': return '#2196F3';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'schedule';
      case 'in-progress': return 'build';
      case 'completed': return 'check-circle';
      default: return 'help';
    }
  };

  const handleMaintenanceAction = (recordId: string, action: string) => {
    setMenuVisible(null);
    
    switch (action) {
      case 'view':
        router.push(`/(admin)/maintenance-details/${recordId}`);
        break;
      case 'edit':
        router.push(`/(admin)/edit-maintenance/${recordId}`);
        break;
      case 'complete':
        Alert.alert(
          'Complete Maintenance',
          'Mark this maintenance as completed?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Complete', onPress: () => {} }
          ]
        );
        break;
      case 'schedule':
        router.push(`/(admin)/schedule-maintenance/${recordId}`);
        break;
      case 'delete':
        Alert.alert(
          'Delete Record',
          'Are you sure you want to delete this maintenance record?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {} }
          ]
        );
        break;
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getVehicleNumber = (vehicleId: string) => {
    // In real app, this would be fetched from vehicle data
    const vehicleNumbers: { [key: string]: string } = {
      'vehicle1': 'KA01AB1234',
      'vehicle2': 'KA02CD5678'
    };
    return vehicleNumbers[vehicleId] || vehicleId;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleSection}>
            <Text variant="headlineMedium" style={styles.title}>
              Maintenance Management
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Vehicle service and repairs
            </Text>
          </View>
          
          {stats.overdue > 0 && (
            <Badge 
              style={styles.alertBadge}
              size={24}
            >
              {stats.overdue}
            </Badge>
          )}
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Maintenance Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <Card style={[styles.statCard, { borderLeftColor: '#1976D2' }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.total}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Total Records
                </Text>
              </Card.Content>
            </Card>
            
            <Card style={[styles.statCard, { borderLeftColor: '#FF9800' }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.pending}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Pending
                </Text>
              </Card.Content>
            </Card>
          </View>
          
          <View style={styles.statsRow}>
            <Card style={[styles.statCard, { borderLeftColor: '#2196F3' }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.inProgress}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  In Progress
                </Text>
              </Card.Content>
            </Card>
            
            <Card style={[styles.statCard, { borderLeftColor: '#F44336' }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.overdue}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Overdue
                </Text>
              </Card.Content>
            </Card>
          </View>
          
          <Card style={[styles.costCard, { borderLeftColor: '#4CAF50' }]}>
            <Card.Content style={styles.costContent}>
              <MaterialIcons name="account-balance-wallet" size={32} color="#4CAF50" />
              <View style={styles.costInfo}>
                <Text variant="bodySmall" style={styles.costLabel}>
                  Total Maintenance Cost (This Month)
                </Text>
                <Text variant="headlineMedium" style={styles.costValue}>
                  {formatCurrency(stats.totalCost)}
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Button
            mode="contained"
            icon="schedule"
            onPress={() => router.push('/(admin)/maintenance-alerts')}
            style={styles.quickButton}
          >
            View Alerts ({stats.overdue})
          </Button>
          <Button
            mode="outlined"
            icon="calendar"
            onPress={() => router.push('/(admin)/maintenance-schedule')}
            style={styles.quickButton}
          >
            Schedule Service
          </Button>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchSection}>
          <Searchbar
            placeholder="Search maintenance records..."
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
              All Status
            </Chip>
            <Chip
              selected={statusFilter === 'pending'}
              onPress={() => setStatusFilter('pending')}
              style={styles.filterChip}
            >
              Pending
            </Chip>
            <Chip
              selected={statusFilter === 'in-progress'}
              onPress={() => setStatusFilter('in-progress')}
              style={styles.filterChip}
            >
              In Progress
            </Chip>
            <Chip
              selected={statusFilter === 'completed'}
              onPress={() => setStatusFilter('completed')}
              style={styles.filterChip}
            >
              Completed
            </Chip>
          </ScrollView>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            <Chip
              selected={typeFilter === 'all'}
              onPress={() => setTypeFilter('all')}
              style={styles.filterChip}
            >
              All Types
            </Chip>
            <Chip
              selected={typeFilter === 'routine'}
              onPress={() => setTypeFilter('routine')}
              style={styles.filterChip}
            >
              Routine
            </Chip>
            <Chip
              selected={typeFilter === 'repair'}
              onPress={() => setTypeFilter('repair')}
              style={styles.filterChip}
            >
              Repair
            </Chip>
            <Chip
              selected={typeFilter === 'inspection'}
              onPress={() => setTypeFilter('inspection')}
              style={styles.filterChip}
            >
              Inspection
            </Chip>
          </ScrollView>
        </View>

        {/* Maintenance Records List */}
        <View style={styles.recordsList}>
          {filteredRecords.map((record) => (
            <Card key={record.id} style={styles.recordCard}>
              <Card.Content>
                <View style={styles.recordHeader}>
                  <View style={styles.recordInfo}>
                    <Text variant="titleMedium" style={styles.vehicleNumber}>
                      {getVehicleNumber(record.vehicleId)}
                    </Text>
                    <Text variant="bodyMedium" style={styles.serviceProvider}>
                      {record.serviceProvider}
                    </Text>
                  </View>
                  
                  <View style={styles.recordActions}>
                    <Chip 
                      mode="outlined"
                      textStyle={{ color: getTypeColor(record.type) }}
                      style={[styles.typeChip, { borderColor: getTypeColor(record.type) }]}
                    >
                      {record.type}
                    </Chip>
                    
                    <Chip 
                      mode="outlined"
                      icon={getStatusIcon(record.status)}
                      textStyle={{ color: getStatusColor(record.status) }}
                      style={[styles.statusChip, { borderColor: getStatusColor(record.status) }]}
                    >
                      {record.status}
                    </Chip>
                    
                    <Menu
                      visible={menuVisible === record.id}
                      onDismiss={() => setMenuVisible(null)}
                      anchor={
                        <IconButton
                          icon="dots-vertical"
                          onPress={() => setMenuVisible(record.id)}
                        />
                      }
                    >
                      <Menu.Item
                        onPress={() => handleMaintenanceAction(record.id, 'view')}
                        title="View Details"
                        leadingIcon="eye"
                      />
                      <Menu.Item
                        onPress={() => handleMaintenanceAction(record.id, 'edit')}
                        title="Edit Record"
                        leadingIcon="pencil"
                      />
                      {record.status !== 'completed' && (
                        <Menu.Item
                          onPress={() => handleMaintenanceAction(record.id, 'complete')}
                          title="Mark Complete"
                          leadingIcon="check"
                        />
                      )}
                      <Menu.Item
                        onPress={() => handleMaintenanceAction(record.id, 'schedule')}
                        title="Schedule Next"
                        leadingIcon="schedule"
                      />
                      <Divider />
                      <Menu.Item
                        onPress={() => handleMaintenanceAction(record.id, 'delete')}
                        title="Delete"
                        leadingIcon="delete"
                        titleStyle={{ color: '#F44336' }}
                      />
                    </Menu>
                  </View>
                </View>
                
                <Text variant="bodyMedium" style={styles.description}>
                  {record.description}
                </Text>
                
                <View style={styles.recordDetails}>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="calendar-today" size={16} color="#666" />
                    <Text variant="bodySmall" style={styles.detailText}>
                      Service Date: {formatDate(record.date)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="attach-money" size={16} color="#666" />
                    <Text variant="bodySmall" style={styles.detailText}>
                      Cost: {formatCurrency(record.cost)}
                    </Text>
                  </View>
                  {record.parts && record.parts.length > 0 && (
                    <View style={styles.detailRow}>
                      <MaterialIcons name="build" size={16} color="#666" />
                      <Text variant="bodySmall" style={styles.detailText}>
                        Parts: {record.parts.join(', ')}
                      </Text>
                    </View>
                  )}
                </View>
                
                {record.nextServiceDue && (
                  <View style={styles.nextServiceInfo}>
                    <MaterialIcons name="schedule" size={16} color="#FF9800" />
                    <Text variant="bodySmall" style={styles.nextServiceText}>
                      Next service due: {formatDate(record.nextServiceDue)}
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
        onPress={() => router.push('/(admin)/add-maintenance')}
        label="Add Record"
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  subtitle: {
    color: '#666',
    marginTop: 4,
  },
  alertBadge: {
    backgroundColor: '#F44336',
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
  costCard: {
    elevation: 2,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  costContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  costInfo: {
    flex: 1,
  },
  costLabel: {
    color: '#666',
  },
  costValue: {
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  quickButton: {
    flex: 1,
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
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  recordsList: {
    gap: 12,
  },
  recordCard: {
    elevation: 2,
    borderRadius: 8,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recordInfo: {
    flex: 1,
  },
  vehicleNumber: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  serviceProvider: {
    color: '#666',
    marginTop: 2,
  },
  recordActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeChip: {
    height: 28,
  },
  statusChip: {
    height: 28,
  },
  description: {
    color: '#333',
    marginBottom: 12,
  },
  recordDetails: {
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
  nextServiceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  nextServiceText: {
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