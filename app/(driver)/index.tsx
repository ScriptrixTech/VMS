// Powered by OnSpace.AI
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Button, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface DriverData {
  name: string;
  id: string;
  todayStatus: 'present' | 'absent' | 'not-marked';
  assignedVehicle: string;
  todayRoute: string;
  earnings: {
    today: number;
    month: number;
  };
  attendance: {
    checkIn: string | null;
    checkOut: string | null;
  };
}

export default function DriverHome() {
  const [driverData, setDriverData] = useState<DriverData>({
    name: '',
    id: '',
    todayStatus: 'not-marked',
    assignedVehicle: '',
    todayRoute: '',
    earnings: { today: 0, month: 0 },
    attendance: { checkIn: null, checkOut: null },
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDriverData = async () => {
    // Simulate API call
    setTimeout(() => {
      setDriverData({
        name: 'Rajesh Kumar',
        id: 'DRV001',
        todayStatus: 'present',
        assignedVehicle: 'TN 09 AB 1234',
        todayRoute: 'Chennai - Coimbatore Route',
        earnings: { today: 800, month: 18500 },
        attendance: { checkIn: '09:15 AM', checkOut: null },
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return '#4CAF50';
      case 'absent': return '#F44336';
      default: return '#FF9800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return 'Present';
      case 'absent': return 'Absent';
      default: return 'Not Marked';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text variant="headlineMedium" style={styles.greeting}>
            Welcome, {driverData.name}
          </Text>
          <Text variant="bodyLarge" style={styles.driverId}>
            Driver ID: {driverData.id}
          </Text>
          <Chip 
            icon="circle" 
            style={[styles.statusChip, { backgroundColor: getStatusColor(driverData.todayStatus) }]}
            textStyle={styles.statusText}
          >
            {getStatusText(driverData.todayStatus)}
          </Chip>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Today's Schedule */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Today's Schedule
          </Text>
          <Card style={styles.scheduleCard}>
            <Card.Content>
              <View style={styles.scheduleRow}>
                <MaterialIcons name="local-shipping" size={24} color="#1976D2" />
                <View style={styles.scheduleInfo}>
                  <Text variant="bodyMedium" style={styles.scheduleLabel}>
                    Assigned Vehicle
                  </Text>
                  <Text variant="titleMedium" style={styles.scheduleValue}>
                    {driverData.assignedVehicle || 'Not Assigned'}
                  </Text>
                </View>
              </View>
              <View style={styles.scheduleRow}>
                <MaterialIcons name="route" size={24} color="#FF9800" />
                <View style={styles.scheduleInfo}>
                  <Text variant="bodyMedium" style={styles.scheduleLabel}>
                    Today's Route
                  </Text>
                  <Text variant="titleMedium" style={styles.scheduleValue}>
                    {driverData.todayRoute || 'No Route Assigned'}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Attendance Status */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Attendance Status
          </Text>
          <Card style={styles.attendanceCard}>
            <Card.Content>
              <View style={styles.attendanceRow}>
                <View style={styles.attendanceItem}>
                  <MaterialIcons name="login" size={24} color="#4CAF50" />
                  <Text variant="bodySmall" style={styles.attendanceLabel}>
                    Check In
                  </Text>
                  <Text variant="titleMedium" style={styles.attendanceValue}>
                    {driverData.attendance.checkIn || '--:--'}
                  </Text>
                </View>
                <View style={styles.attendanceItem}>
                  <MaterialIcons name="logout" size={24} color="#F44336" />
                  <Text variant="bodySmall" style={styles.attendanceLabel}>
                    Check Out
                  </Text>
                  <Text variant="titleMedium" style={styles.attendanceValue}>
                    {driverData.attendance.checkOut || '--:--'}
                  </Text>
                </View>
              </View>
              <Button
                mode="contained"
                style={styles.attendanceButton}
                onPress={() => router.push('/(driver)/attendance')}
                buttonColor="#FF9800"
              >
                Mark Attendance
              </Button>
            </Card.Content>
          </Card>
        </View>

        {/* Earnings Summary */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Earnings Summary
          </Text>
          <Card style={styles.earningsCard}>
            <Card.Content>
              <View style={styles.earningsRow}>
                <View style={styles.earningsItem}>
                  <MaterialIcons name="today" size={24} color="#4CAF50" />
                  <Text variant="bodySmall" style={styles.earningsLabel}>
                    Today's Earnings
                  </Text>
                  <Text variant="headlineSmall" style={styles.earningsValue}>
                    ₹{driverData.earnings.today}
                  </Text>
                </View>
                <View style={styles.earningsItem}>
                  <MaterialIcons name="calendar-month" size={24} color="#1976D2" />
                  <Text variant="bodySmall" style={styles.earningsLabel}>
                    Monthly Earnings
                  </Text>
                  <Text variant="headlineSmall" style={styles.earningsValue}>
                    ₹{driverData.earnings.month.toLocaleString()}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Quick Actions
          </Text>
          <View style={styles.actionGrid}>
            <Card style={styles.actionCard} onPress={() => router.push('/(driver)/requests')}>
              <Card.Content style={styles.actionContent}>
                <MaterialIcons name="request-quote" size={32} color="#FF9800" />
                <Text variant="bodyMedium" style={styles.actionLabel}>
                  Money Request
                </Text>
              </Card.Content>
            </Card>
            <Card style={styles.actionCard} onPress={() => router.push('/(driver)/attendance')}>
              <Card.Content style={styles.actionContent}>
                <MaterialIcons name="access-time" size={32} color="#4CAF50" />
                <Text variant="bodyMedium" style={styles.actionLabel}>
                  Attendance
                </Text>
              </Card.Content>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  greeting: {
    fontWeight: 'bold',
    color: '#FF9800',
  },
  driverId: {
    color: '#666',
    marginTop: 4,
  },
  statusChip: {
    marginTop: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  scheduleCard: {
    elevation: 2,
    borderRadius: 8,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scheduleInfo: {
    marginLeft: 12,
    flex: 1,
  },
  scheduleLabel: {
    color: '#666',
  },
  scheduleValue: {
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  attendanceCard: {
    elevation: 2,
    borderRadius: 8,
  },
  attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  attendanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  attendanceLabel: {
    color: '#666',
    marginTop: 4,
  },
  attendanceValue: {
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  attendanceButton: {
    marginTop: 8,
  },
  earningsCard: {
    elevation: 2,
    borderRadius: 8,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  earningsItem: {
    alignItems: 'center',
    flex: 1,
  },
  earningsLabel: {
    color: '#666',
    marginTop: 4,
  },
  earningsValue: {
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 2,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    elevation: 2,
    borderRadius: 8,
  },
  actionContent: {
    alignItems: 'center',
    padding: 16,
  },
  actionLabel: {
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
});