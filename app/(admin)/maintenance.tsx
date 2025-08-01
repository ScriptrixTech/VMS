import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Button, ActivityIndicator, Chip, FAB, IconButton, Menu, Searchbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { apiService } from '../../services/api';

interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleInfo: string;
  title: string;
  description: string;
  serviceType: string;
  cost: number;
  serviceDate: string;
  nextServiceDate: string;
  status: string;
  serviceProvider: string;
  mileage: number;
}

interface CalendarMarking {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
  };
}

export default function MaintenanceScheduler() {
  const router = useRouter();
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  useEffect(() => {
    fetchMaintenanceRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [maintenanceRecords, searchQuery, statusFilter, selectedDate]);

  const fetchMaintenanceRecords = async () => {
    try {
      const response = await apiService.get('/maintenance');
      setMaintenanceRecords(response.data.items || []);
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
      Alert.alert('Error', 'Failed to load maintenance records');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterRecords = () => {
    let filtered = maintenanceRecords;

    if (searchQuery) {
      filtered = filtered.filter(record =>
        record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.vehicleInfo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.serviceProvider.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status.toLowerCase() === statusFilter);
    }

    if (selectedDate && viewMode === 'calendar') {
      filtered = filtered.filter(record => {
        const serviceDate = new Date(record.serviceDate).toISOString().split('T')[0];
        const nextServiceDate = record.nextServiceDate ? 
          new Date(record.nextServiceDate).toISOString().split('T')[0] : null;
        return serviceDate === selectedDate || nextServiceDate === selectedDate;
      });
    }

    setFilteredRecords(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMaintenanceRecords();
  };

  const getCalendarMarkings = (): CalendarMarking => {
    const markings: CalendarMarking = {};

    maintenanceRecords.forEach(record => {
      const serviceDate = new Date(record.serviceDate).toISOString().split('T')[0];
      const nextServiceDate = record.nextServiceDate ? 
        new Date(record.nextServiceDate).toISOString().split('T')[0] : null;

      // Mark service dates
      if (serviceDate) {
        markings[serviceDate] = {
          marked: true,
          dotColor: getStatusColor(record.status),
        };
      }

      // Mark next service dates
      if (nextServiceDate) {
        markings[nextServiceDate] = {
          marked: true,
          dotColor: '#FF9800',
        };
      }
    });

    // Highlight selected date
    if (selectedDate) {
      markings[selectedDate] = {
        ...markings[selectedDate],
        selected: true,
        selectedColor: '#2196F3',
      };
    }

    return markings;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'in progress': return '#2196F3';
      case 'cancelled': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const handleMaintenanceAction = async (recordId: string, action: string) => {
    setMenuVisible(null);

    switch (action) {
      case 'edit':
        router.push(`/(admin)/edit-maintenance/${recordId}`);
        break;
      case 'complete':
        try {
          await apiService.patch(`/maintenance/${recordId}/status`, { status: 'Completed' });
          fetchMaintenanceRecords();
        } catch (error) {
          Alert.alert('Error', 'Failed to update maintenance status');
        }
        break;
      case 'cancel':
        try {
          await apiService.patch(`/maintenance/${recordId}/status`, { status: 'Cancelled' });
          fetchMaintenanceRecords();
        } catch (error) {
          Alert.alert('Error', 'Failed to cancel maintenance');
        }
        break;
      case 'delete':
        Alert.alert(
          'Delete Maintenance Record',
          'Are you sure you want to delete this maintenance record?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Delete', 
              style: 'destructive', 
              onPress: async () => {
                try {
                  await apiService.delete(`/maintenance/${recordId}`);
                  fetchMaintenanceRecords();
                } catch (error) {
                  Alert.alert('Error', 'Failed to delete maintenance record');
                }
              }
            }
          ]
        );
        break;
      case 'schedule':
        router.push(`/(admin)/schedule-maintenance/${recordId}`);
        break;
    }
  };

  const sendMaintenanceReminder = async (recordId: string) => {
    try {
      await apiService.post(`/maintenance/${recordId}/reminder`);
      Alert.alert('Success', 'Maintenance reminder sent successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to send reminder');
    }
  };

  const renderCalendarView = () => (
    <View style={styles.calendarContainer}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={getCalendarMarkings()}
        theme={{
          selectedDayBackgroundColor: '#2196F3',
          todayTextColor: '#2196F3',
          arrowColor: '#2196F3',
          monthTextColor: '#2196F3',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
      />

      {selectedDate && (
        <View style={styles.selectedDateContainer}>
          <Text variant="titleMedium" style={styles.selectedDateTitle}>
            Maintenance for {selectedDate}
          </Text>

          {filteredRecords.length === 0 ? (
            <Text style={styles.noRecordsText}>No maintenance scheduled for this date</Text>
          ) : (
            <ScrollView style={styles.selectedDateRecords}>
              {filteredRecords.map(renderMaintenanceCard)}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );

  const renderMaintenanceCard = (record: MaintenanceRecord) => (
    <Card key={record.id} style={styles.maintenanceCard}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text variant="titleMedium" style={styles.maintenanceTitle}>
              {record.title}
            </Text>
            <Text variant="bodyMedium" style={styles.vehicleInfo}>
              {record.vehicleInfo}
            </Text>
            <Text variant="bodySmall" style={styles.serviceProvider}>
              Provider: {record.serviceProvider}
            </Text>
          </View>

          <View style={styles.cardActions}>
            <Chip 
              mode="outlined"
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
                onPress={() => handleMaintenanceAction(record.id, 'edit')}
                title="Edit"
                leadingIcon="pencil"
              />
              {record.status.toLowerCase() !== 'completed' && (
                <Menu.Item
                  onPress={() => handleMaintenanceAction(record.id, 'complete')}
                  title="Mark Complete"
                  leadingIcon="check"
                />
              )}
              <Menu.Item
                onPress={() => sendMaintenanceReminder(record.id)}
                title="Send Reminder"
                leadingIcon="bell"
              />
              <Menu.Item
                onPress={() => handleMaintenanceAction(record.id, 'schedule')}
                title="Schedule Next"
                leadingIcon="calendar-plus"
              />
              <Menu.Item
                onPress={() => handleMaintenanceAction(record.id, 'cancel')}
                title="Cancel"
                leadingIcon="cancel"
              />
              <Menu.Item
                onPress={() => handleMaintenanceAction(record.id, 'delete')}
                title="Delete"
                leadingIcon="delete"
              />
            </Menu>
          </View>
        </View>

        <View style={styles.cardDetails}>
          <Text variant="bodySmall">Service Date: {new Date(record.serviceDate).toLocaleDateString()}</Text>
          {record.nextServiceDate && (
            <Text variant="bodySmall">Next Service: {new Date(record.nextServiceDate).toLocaleDateString()}</Text>
          )}
          <Text variant="bodySmall">Cost: ${record.cost.toFixed(2)}</Text>
          <Text variant="bodySmall">Mileage: {record.mileage.toLocaleString()} miles</Text>
        </View>

        {record.description && (
          <Text variant="bodySmall" style={styles.description}>
            {record.description}
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  const renderListView = () => (
    <ScrollView style={styles.listContainer}>
      {filteredRecords.map(renderMaintenanceCard)}
    </ScrollView>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading maintenance records...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Maintenance Scheduler
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Schedule and track vehicle maintenance
        </Text>
      </View>

      <View style={styles.controls}>
        <Searchbar
          placeholder="Search maintenance records..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <View style={styles.filterContainer}>
          <View style={styles.statusFilters}>
            {['all', 'pending', 'in progress', 'completed'].map((status) => (
              <Chip
                key={status}
                mode={statusFilter === status ? 'flat' : 'outlined'}
                selected={statusFilter === status}
                onPress={() => setStatusFilter(status)}
                style={styles.filterChip}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Chip>
            ))}
          </View>

          <View style={styles.viewToggle}>
            <Button
              mode={viewMode === 'calendar' ? 'contained' : 'outlined'}
              onPress={() => setViewMode('calendar')}
              icon="calendar"
              compact
            >
              Calendar
            </Button>
            <Button
              mode={viewMode === 'list' ? 'contained' : 'outlined'}
              onPress={() => setViewMode('list')}
              icon="format-list-bulleted"
              compact
            >
              List
            </Button>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {viewMode === 'calendar' ? renderCalendarView() : renderListView()}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/(admin)/add-maintenance')}
        label="Schedule Maintenance"
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
  controls: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  searchbar: {
    marginBottom: 12,
    elevation: 2,
  },
  filterContainer: {
    gap: 12,
  },
  statusFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    marginRight: 4,
  },
  viewToggle: {
    flexDirection: 'row',
    gap: 8,
  },
  content: {
    flex: 1,
  },
  calendarContainer: {
    padding: 16,
  },
  selectedDateContainer: {
    marginTop: 16,
    maxHeight: 300,
  },
  selectedDateTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  selectedDateRecords: {
    maxHeight: 250,
  },
  noRecordsText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 20,
  },
  listContainer: {
    padding: 16,
  },
  maintenanceCard: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
  },
  maintenanceTitle: {
    fontWeight: 'bold',
    color: '#333',
  },
  vehicleInfo: {
    color: '#1976D2',
    marginTop: 2,
  },
  serviceProvider: {
    color: '#666',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusChip: {
    height: 28,
  },
  cardDetails: {
    gap: 4,
    marginBottom: 8,
  },
  description: {
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
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