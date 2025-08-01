// Powered by OnSpace.AI
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Button, FAB } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface DashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  totalDrivers: number;
  activeDrivers: number;
  pendingRequests: number;
  todayRevenue: number;
  monthlyRevenue: number;
  fuelExpense: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    activeVehicles: 0,
    totalDrivers: 0,
    activeDrivers: 0,
    pendingRequests: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    fuelExpense: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalVehicles: 25,
        activeVehicles: 18,
        totalDrivers: 30,
        activeDrivers: 22,
        pendingRequests: 5,
        todayRevenue: 45000,
        monthlyRevenue: 850000,
        fuelExpense: 125000,
      });
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Admin Dashboard
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Varshini Media Solutions
        </Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Fleet Overview */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Fleet Overview
          </Text>
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <MaterialIcons name="local-shipping" size={32} color="#1976D2" />
                <Text variant="bodySmall" style={styles.statLabel}>
                  Total Vehicles
                </Text>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.totalVehicles}
                </Text>
              </Card.Content>
            </Card>

            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <MaterialIcons name="directions-car" size={32} color="#4CAF50" />
                <Text variant="bodySmall" style={styles.statLabel}>
                  Active Today
                </Text>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.activeVehicles}
                </Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* Workforce Overview */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Workforce Overview
          </Text>
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <MaterialIcons name="group" size={32} color="#FF9800" />
                <Text variant="bodySmall" style={styles.statLabel}>
                  Total Drivers
                </Text>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.totalDrivers}
                </Text>
              </Card.Content>
            </Card>

            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <MaterialIcons name="person" size={32} color="#4CAF50" />
                <Text variant="bodySmall" style={styles.statLabel}>
                  Present Today
                </Text>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.activeDrivers}
                </Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* Financial Overview */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Financial Overview
          </Text>
          <Card style={styles.wideCard}>
            <Card.Content>
              <View style={styles.financialRow}>
                <View style={styles.financialItem}>
                  <MaterialIcons name="today" size={24} color="#4CAF50" />
                  <Text variant="bodySmall" style={styles.financialLabel}>
                    Today's Revenue
                  </Text>
                  <Text variant="titleMedium" style={styles.revenueText}>
                    {formatCurrency(stats.todayRevenue)}
                  </Text>
                </View>
                <View style={styles.financialItem}>
                  <MaterialIcons name="calendar-month" size={24} color="#1976D2" />
                  <Text variant="bodySmall" style={styles.financialLabel}>
                    Monthly Revenue
                  </Text>
                  <Text variant="titleMedium" style={styles.revenueText}>
                    {formatCurrency(stats.monthlyRevenue)}
                  </Text>
                </View>
              </View>
              <View style={styles.expenseRow}>
                <MaterialIcons name="local-gas-station" size={24} color="#F44336" />
                <Text variant="bodyMedium" style={styles.expenseLabel}>
                  Monthly Fuel Expense: {formatCurrency(stats.fuelExpense)}
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Pending Requests */}
        <View style={styles.section}>
          <Card style={styles.alertCard} onPress={() => router.push('/(admin)/requests')}>
            <Card.Content style={styles.alertContent}>
              <MaterialIcons name="notifications-active" size={32} color="#FF5722" />
              <View style={styles.alertText}>
                <Text variant="titleMedium" style={styles.alertTitle}>
                  Pending Requests
                </Text>
                <Text variant="bodyMedium" style={styles.alertSubtitle}>
                  {stats.pendingRequests} financial requests need approval
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </Card.Content>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Quick Actions
          </Text>
          <View style={styles.actionRow}>
            <Button
              mode="contained"
              icon="add"
              style={styles.actionButton}
              onPress={() => {/* Navigate to add vehicle */}}
            >
              Add Vehicle
            </Button>
            <Button
              mode="outlined"
              icon="person-add"
              style={styles.actionButton}
              onPress={() => {/* Navigate to add driver */}}
            >
              Add Driver
            </Button>
          </View>
        </View>
      </ScrollView>

      <FAB
        icon="refresh"
        style={styles.fab}
        onPress={onRefresh}
        disabled={refreshing}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    elevation: 2,
    borderRadius: 8,
  },
  statContent: {
    alignItems: 'center',
    padding: 16,
  },
  statLabel: {
    marginTop: 8,
    color: '#666',
    textAlign: 'center',
  },
  statValue: {
    marginTop: 4,
    fontWeight: 'bold',
    color: '#333',
  },
  wideCard: {
    elevation: 2,
    borderRadius: 8,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  financialItem: {
    alignItems: 'center',
    flex: 1,
  },
  financialLabel: {
    marginTop: 4,
    color: '#666',
  },
  revenueText: {
    marginTop: 4,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  expenseLabel: {
    color: '#F44336',
  },
  alertCard: {
    elevation: 2,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5722',
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  alertText: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontWeight: 'bold',
    color: '#FF5722',
  },
  alertSubtitle: {
    color: '#666',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
    backgroundColor: '#1976D2',
  },
});