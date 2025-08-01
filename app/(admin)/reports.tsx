// Powered by OnSpace.AI
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Text, 
  Card, 
  Button, 
  SegmentedButtons,
  IconButton,
  Menu,
  Divider
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { router } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

interface ReportData {
  revenueData: number[];
  expenseData: number[];
  vehicleUtilization: Array<{ name: string; population: number; color: string; legendFontColor: string; legendFontSize: number; }>;
  driverPerformance: Array<{ name: string; score: number; }>;
  fuelConsumption: number[];
  maintenanceCosts: number[];
}

export default function ReportsAnalytics() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [menuVisible, setMenuVisible] = useState(false);

  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#1976D2',
    },
  };

  const fetchReportData = async () => {
    // Simulate API call
    setTimeout(() => {
      setReportData({
        revenueData: [45000, 52000, 48000, 61000, 55000, 67000, 58000],
        expenseData: [25000, 28000, 31000, 35000, 29000, 33000, 30000],
        vehicleUtilization: [
          { name: 'Active', population: 18, color: '#4CAF50', legendFontColor: '#333', legendFontSize: 12 },
          { name: 'Maintenance', population: 3, color: '#FF9800', legendFontColor: '#333', legendFontSize: 12 },
          { name: 'Available', population: 4, color: '#2196F3', legendFontColor: '#333', legendFontSize: 12 },
        ],
        driverPerformance: [
          { name: 'Rajesh', score: 95 },
          { name: 'Suresh', score: 88 },
          { name: 'Kumar', score: 92 },
          { name: 'Ravi', score: 85 },
          { name: 'Mohan', score: 90 },
        ],
        fuelConsumption: [1200, 1350, 1180, 1420, 1280, 1380, 1250],
        maintenanceCosts: [15000, 22000, 18000, 28000, 20000, 25000, 19000],
      });
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReportData();
  };

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  const exportReport = (type: string) => {
    setMenuVisible(false);
    // TODO: Implement export functionality
    console.log('Exporting report as:', type);
  };

  if (loading || !reportData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text variant="bodyLarge">Loading reports...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleSection}>
            <Text variant="headlineMedium" style={styles.title}>
              Reports & Analytics
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Business insights and performance
            </Text>
          </View>
          
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="download"
                onPress={() => setMenuVisible(true)}
                iconColor="#1976D2"
              />
            }
          >
            <Menu.Item
              onPress={() => exportReport('pdf')}
              title="Export as PDF"
              leadingIcon="file-pdf-box"
            />
            <Menu.Item
              onPress={() => exportReport('excel')}
              title="Export as Excel"
              leadingIcon="file-excel-box"
            />
            <Divider />
            <Menu.Item
              onPress={() => router.push('/(admin)/custom-reports')}
              title="Custom Reports"
              leadingIcon="chart-box"
            />
          </Menu>
        </View>
        
        <SegmentedButtons
          value={selectedPeriod}
          onValueChange={setSelectedPeriod}
          buttons={[
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'quarter', label: 'Quarter' },
            { value: 'year', label: 'Year' },
          ]}
          style={styles.periodSelector}
        />
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Financial Overview */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.chartTitle}>
              Financial Overview
            </Text>
            <Text variant="bodyMedium" style={styles.chartSubtitle}>
              Revenue vs Expenses (Last 7 days)
            </Text>
            
            <LineChart
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                  {
                    data: reportData.revenueData,
                    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                    strokeWidth: 3,
                  },
                  {
                    data: reportData.expenseData,
                    color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`,
                    strokeWidth: 3,
                  },
                ],
                legend: ['Revenue', 'Expenses'],
              }}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        {/* Vehicle Utilization */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.chartTitle}>
              Vehicle Utilization
            </Text>
            <Text variant="bodyMedium" style={styles.chartSubtitle}>
              Current fleet status distribution
            </Text>
            
            <PieChart
              data={reportData.vehicleUtilization}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 10]}
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        {/* Driver Performance */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.chartTitle}>
              Top Driver Performance
            </Text>
            <Text variant="bodyMedium" style={styles.chartSubtitle}>
              Performance scores (out of 100)
            </Text>
            
            <BarChart
              data={{
                labels: reportData.driverPerformance.map(d => d.name),
                datasets: [{
                  data: reportData.driverPerformance.map(d => d.score),
                }],
              }}
              width={screenWidth - 64}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
              }}
              style={styles.chart}
              showValuesOnTopOfBars
            />
          </Card.Content>
        </Card>

        {/* Fuel Consumption Trend */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.chartTitle}>
              Fuel Consumption Trend
            </Text>
            <Text variant="bodyMedium" style={styles.chartSubtitle}>
              Daily fuel consumption (Liters)
            </Text>
            
            <LineChart
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                  data: reportData.fuelConsumption,
                  color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,
                  strokeWidth: 3,
                }],
              }}
              width={screenWidth - 64}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,
              }}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        {/* Maintenance Costs */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.chartTitle}>
              Maintenance Costs
            </Text>
            <Text variant="bodyMedium" style={styles.chartSubtitle}>
              Weekly maintenance expenses
            </Text>
            
            <BarChart
              data={{
                labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
                datasets: [{
                  data: reportData.maintenanceCosts,
                }],
              }}
              width={screenWidth - 64}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`,
              }}
              style={styles.chart}
              formatYLabel={(value) => formatCurrency(Number(value))}
            />
          </Card.Content>
        </Card>

        {/* Quick Report Actions */}
        <Card style={styles.actionCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.actionTitle}>
              Quick Reports
            </Text>
            
            <View style={styles.actionGrid}>
              <Button
                mode="outlined"
                icon="calendar-today"
                onPress={() => router.push('/(admin)/attendance-report')}
                style={styles.actionButton}
              >
                Attendance Report
              </Button>
              
              <Button
                mode="outlined"
                icon="local-gas-station"
                onPress={() => router.push('/(admin)/fuel-report')}
                style={styles.actionButton}
              >
                Fuel Report
              </Button>
              
              <Button
                mode="outlined"
                icon="account-balance-wallet"
                onPress={() => router.push('/(admin)/financial-report')}
                style={styles.actionButton}
              >
                Financial Report
              </Button>
              
              <Button
                mode="outlined"
                icon="wrench"
                onPress={() => router.push('/(admin)/maintenance-report')}
                style={styles.actionButton}
              >
                Maintenance Report
              </Button>
            </View>
          </Card.Content>
        </Card>
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
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  periodSelector: {
    borderRadius: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartCard: {
    elevation: 2,
    borderRadius: 12,
    marginBottom: 20,
  },
  chartTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  chartSubtitle: {
    color: '#666',
    marginBottom: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  actionCard: {
    elevation: 2,
    borderRadius: 12,
    marginBottom: 20,
  },
  actionTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
  },
});