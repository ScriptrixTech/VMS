
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Button, ActivityIndicator, Chip, TextInput, SegmentedButtons } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { apiService } from '../../services/api';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get('window');

interface ReportData {
  dashboardStats: any;
  monthlyCostTrends: any[];
  vehicleUtilization: any[];
  topMaintenanceVehicles: any[];
}

interface ExportOptions {
  format: 'csv' | 'pdf';
  reportType: 'vehicle' | 'maintenance' | 'fuel' | 'comprehensive';
  startDate: Date;
  endDate: Date;
}

export default function Reports() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedReport, setSelectedReport] = useState('overview');
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    reportType: 'comprehensive',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(),
  });
  const [datePickerOpen, setDatePickerOpen] = useState<'start' | 'end' | null>(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const [statsResponse, trendsResponse, utilizationResponse, topMaintenanceResponse] = await Promise.all([
        apiService.get('/dashboard/stats'),
        apiService.get('/reports/monthly-cost-trends'),
        apiService.get('/reports/vehicle-utilization'),
        apiService.get('/reports/top-maintenance-vehicles')
      ]);

      setReportData({
        dashboardStats: statsResponse.data,
        monthlyCostTrends: trendsResponse.data || [],
        vehicleUtilization: utilizationResponse.data || [],
        topMaintenanceVehicles: topMaintenanceResponse.data || []
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
      Alert.alert('Error', 'Failed to load report data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchReportData();
  };

  const generateCSV = (data: any[], headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header] || '').join(','))
    ].join('\n');
    return csvContent;
  };

  const exportReport = async () => {
    if (!reportData) return;
    
    setExporting(true);
    try {
      let content = '';
      let filename = '';
      
      switch (exportOptions.reportType) {
        case 'vehicle':
          const vehicleResponse = await apiService.get('/vehicles');
          content = generateCSV(vehicleResponse.data.items || [], [
            'vin', 'make', 'model', 'year', 'licensePlate', 'status', 'mileage'
          ]);
          filename = 'vehicle_report.csv';
          break;
          
        case 'maintenance':
          const maintenanceResponse = await apiService.get('/maintenance');
          content = generateCSV(maintenanceResponse.data.items || [], [
            'vehicleInfo', 'title', 'serviceType', 'cost', 'serviceDate', 'status'
          ]);
          filename = 'maintenance_report.csv';
          break;
          
        case 'fuel':
          const fuelResponse = await apiService.get('/fuel');
          content = generateCSV(fuelResponse.data.items || [], [
            'vehicleInfo', 'fuelAmount', 'cost', 'pricePerUnit', 'fuelDate', 'location'
          ]);
          filename = 'fuel_report.csv';
          break;
          
        case 'comprehensive':
          const comprehensiveData = {
            'Dashboard Statistics': reportData.dashboardStats,
            'Monthly Cost Trends': reportData.monthlyCostTrends,
            'Vehicle Utilization': reportData.vehicleUtilization,
            'Top Maintenance Vehicles': reportData.topMaintenanceVehicles
          };
          content = JSON.stringify(comprehensiveData, null, 2);
          filename = 'comprehensive_report.json';
          break;
      }

      // Save file to device
      const fileUri = FileSystem.documentDirectory + filename;
      await FileSystem.writeAsStringAsync(fileUri, content);
      
      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        // Fallback to share as text
        await Share.share({
          message: content,
          title: `VMS Report - ${exportOptions.reportType}`,
        });
      }
      
      Alert.alert('Success', 'Report exported successfully');
    } catch (error) {
      console.error('Error exporting report:', error);
      Alert.alert('Error', 'Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      {/* Summary Cards */}
      <View style={styles.summaryCards}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.summaryValue}>
              {reportData?.dashboardStats.totalVehicles || 0}
            </Text>
            <Text style={styles.summaryLabel}>Total Vehicles</Text>
          </Card.Content>
        </Card>
        
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.summaryValue}>
              ${reportData?.dashboardStats.totalMaintenanceCost?.toFixed(2) || '0.00'}
            </Text>
            <Text style={styles.summaryLabel}>Maintenance Cost</Text>
          </Card.Content>
        </Card>
        
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.summaryValue}>
              ${reportData?.dashboardStats.totalFuelCost?.toFixed(2) || '0.00'}
            </Text>
            <Text style={styles.summaryLabel}>Fuel Cost</Text>
          </Card.Content>
        </Card>
        
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.summaryValue}>
              {reportData?.dashboardStats.averageFuelEfficiency?.toFixed(1) || '0.0'} MPG
            </Text>
            <Text style={styles.summaryLabel}>Avg Fuel Efficiency</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Charts */}
      {reportData && reportData.monthlyCostTrends.length > 0 && (
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.chartTitle}>Monthly Cost Trends</Text>
            <LineChart
              data={{
                labels: reportData.monthlyCostTrends.slice(-6).map(item => item.monthYear),
                datasets: [
                  {
                    data: reportData.monthlyCostTrends.slice(-6).map(item => item.maintenanceCost),
                    color: () => '#FF6B6B',
                    strokeWidth: 2
                  },
                  {
                    data: reportData.monthlyCostTrends.slice(-6).map(item => item.fuelCost),
                    color: () => '#4ECDC4',
                    strokeWidth: 2
                  }
                ],
                legend: ['Maintenance', 'Fuel']
              }}
              width={width - 64}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16
                }
              }}
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      )}

      {reportData && reportData.vehicleUtilization.length > 0 && (
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.chartTitle}>Vehicle Utilization</Text>
            <BarChart
              data={{
                labels: reportData.vehicleUtilization.map(item => item.status),
                datasets: [{
                  data: reportData.vehicleUtilization.map(item => item.count)
                }]
              }}
              width={width - 64}
              height={220}
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
      )}
    </View>
  );

  const renderExportOptions = () => (
    <View style={styles.exportContainer}>
      <Text variant="titleLarge" style={styles.sectionTitle}>Export Reports</Text>
      
      <Card style={styles.exportCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.exportSectionTitle}>Report Type</Text>
          <SegmentedButtons
            value={exportOptions.reportType}
            onValueChange={(value) => setExportOptions(prev => ({ ...prev, reportType: value as any }))}
            buttons={[
              { value: 'vehicle', label: 'Vehicles' },
              { value: 'maintenance', label: 'Maintenance' },
              { value: 'fuel', label: 'Fuel' },
              { value: 'comprehensive', label: 'All' }
            ]}
            style={styles.segmentedButtons}
          />
          
          <Text variant="titleMedium" style={styles.exportSectionTitle}>Date Range</Text>
          <View style={styles.dateRange}>
            <Button
              mode="outlined"
              onPress={() => setDatePickerOpen('start')}
              style={styles.dateButton}
            >
              Start: {exportOptions.startDate.toLocaleDateString()}
            </Button>
            <Button
              mode="outlined"
              onPress={() => setDatePickerOpen('end')}
              style={styles.dateButton}
            >
              End: {exportOptions.endDate.toLocaleDateString()}
            </Button>
          </View>
          
          <Text variant="titleMedium" style={styles.exportSectionTitle}>Format</Text>
          <SegmentedButtons
            value={exportOptions.format}
            onValueChange={(value) => setExportOptions(prev => ({ ...prev, format: value as any }))}
            buttons={[
              { value: 'csv', label: 'CSV' },
              { value: 'pdf', label: 'PDF' }
            ]}
            style={styles.segmentedButtons}
          />
          
          <Button
            mode="contained"
            onPress={exportReport}
            loading={exporting}
            disabled={exporting}
            style={styles.exportButton}
            icon="download"
          >
            {exporting ? 'Exporting...' : 'Export Report'}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Reports & Analytics
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Vehicle fleet performance insights
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <Button
          mode={selectedReport === 'overview' ? 'contained' : 'outlined'}
          onPress={() => setSelectedReport('overview')}
          style={styles.tabButton}
        >
          Overview
        </Button>
        <Button
          mode={selectedReport === 'export' ? 'contained' : 'outlined'}
          onPress={() => setSelectedReport('export')}
          style={styles.tabButton}
        >
          Export
        </Button>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {selectedReport === 'overview' ? renderOverview() : renderExportOptions()}
      </ScrollView>

      <DatePickerModal
        locale="en"
        mode="single"
        visible={datePickerOpen !== null}
        onDismiss={() => setDatePickerOpen(null)}
        date={datePickerOpen === 'start' ? exportOptions.startDate : exportOptions.endDate}
        onConfirm={(params) => {
          if (params.date) {
            setExportOptions(prev => ({
              ...prev,
              [datePickerOpen === 'start' ? 'startDate' : 'endDate']: params.date
            }));
          }
          setDatePickerOpen(null);
        }}
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
  content: {
    flex: 1,
  },
  overviewContainer: {
    padding: 16,
  },
  summaryCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    elevation: 2,
    borderRadius: 8,
  },
  summaryValue: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  summaryLabel: {
    color: '#666',
    marginTop: 4,
  },
  chartCard: {
    elevation: 2,
    borderRadius: 8,
    marginBottom: 16,
  },
  chartTitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  chart: {
    borderRadius: 16,
  },
  exportContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  exportCard: {
    elevation: 2,
    borderRadius: 8,
  },
  exportSectionTitle: {
    marginBottom: 12,
    marginTop: 16,
    color: '#333',
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  dateRange: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dateButton: {
    flex: 1,
  },
  exportButton: {
    marginTop: 24,
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
});
