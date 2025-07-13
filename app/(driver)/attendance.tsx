// Powered by OnSpace.AI
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

interface AttendanceData {
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  location: string;
  status: 'present' | 'absent' | 'partial';
}

export default function AttendanceScreen() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({
    date: new Date().toLocaleDateString('en-IN'),
    checkIn: null,
    checkOut: null,
    location: '',
    status: 'absent',
  });
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    fetchTodayAttendance();
    getCurrentLocation();
  }, []);

  const fetchTodayAttendance = async () => {
    // Simulate API call
    setTimeout(() => {
      setAttendanceData({
        date: new Date().toLocaleDateString('en-IN'),
        checkIn: '09:15 AM',
        checkOut: null,
        location: 'Varshini Office, Chennai',
        status: 'partial',
      });
    }, 500);
  };

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Location permission is required for attendance');
        setLocationLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      // Reverse geocoding to get address
      const address = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      
      if (address.length > 0) {
        const currentAddress = `${address[0].street || ''}, ${address[0].city || ''}`;
        setAttendanceData(prev => ({ ...prev, location: currentAddress }));
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to get current location');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!location) {
      Alert.alert('Error', 'Location is required for check-in');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const currentTime = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      
      setAttendanceData(prev => ({
        ...prev,
        checkIn: currentTime,
        status: 'partial',
      }));
      
      setLoading(false);
      Alert.alert('Success', 'Check-in recorded successfully!');
    }, 1500);
  };

  const handleCheckOut = async () => {
    if (!location) {
      Alert.alert('Error', 'Location is required for check-out');
      return;
    }

    if (!attendanceData.checkIn) {
      Alert.alert('Error', 'Please check-in first');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const currentTime = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      
      setAttendanceData(prev => ({
        ...prev,
        checkOut: currentTime,
        status: 'present',
      }));
      
      setLoading(false);
      Alert.alert('Success', 'Check-out recorded successfully!');
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return '#4CAF50';
      case 'partial': return '#FF9800';
      default: return '#F44336';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return 'Full Day Present';
      case 'partial': return 'Partial Attendance';
      default: return 'Absent';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Mark Attendance
        </Text>
        <Text variant="bodyLarge" style={styles.date}>
          {attendanceData.date}
        </Text>
      </View>

      <View style={styles.content}>
        {/* Current Status */}
        <Card style={styles.statusCard}>
          <Card.Content>
            <View style={styles.statusHeader}>
              <MaterialIcons 
                name="access-time" 
                size={32} 
                color={getStatusColor(attendanceData.status)} 
              />
              <View style={styles.statusInfo}>
                <Text variant="titleLarge" style={styles.statusTitle}>
                  Today's Status
                </Text>
                <Text 
                  variant="bodyLarge" 
                  style={[styles.statusText, { color: getStatusColor(attendanceData.status) }]}
                >
                  {getStatusText(attendanceData.status)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Location Info */}
        <Card style={styles.locationCard}>
          <Card.Content>
            <View style={styles.locationHeader}>
              <MaterialIcons name="location-on" size={24} color="#1976D2" />
              <Text variant="titleMedium" style={styles.locationTitle}>
                Current Location
              </Text>
            </View>
            {locationLoading ? (
              <View style={styles.locationLoading}>
                <ActivityIndicator size="small" color="#1976D2" />
                <Text variant="bodyMedium" style={styles.loadingText}>
                  Getting location...
                </Text>
              </View>
            ) : (
              <Text variant="bodyMedium" style={styles.locationText}>
                {attendanceData.location || 'Location not available'}
              </Text>
            )}
            <Button
              mode="text"
              onPress={getCurrentLocation}
              style={styles.refreshLocation}
              disabled={locationLoading}
            >
              Refresh Location
            </Button>
          </Card.Content>
        </Card>

        {/* Attendance Records */}
        <Card style={styles.recordCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.recordTitle}>
              Today's Records
            </Text>
            <View style={styles.recordRow}>
              <View style={styles.recordItem}>
                <MaterialIcons name="login" size={24} color="#4CAF50" />
                <Text variant="bodySmall" style={styles.recordLabel}>
                  Check In
                </Text>
                <Text variant="titleMedium" style={styles.recordValue}>
                  {attendanceData.checkIn || '--:--'}
                </Text>
              </View>
              <View style={styles.recordItem}>
                <MaterialIcons name="logout" size={24} color="#F44336" />
                <Text variant="bodySmall" style={styles.recordLabel}>
                  Check Out
                </Text>
                <Text variant="titleMedium" style={styles.recordValue}>
                  {attendanceData.checkOut || '--:--'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {!attendanceData.checkIn ? (
            <Button
              mode="contained"
              onPress={handleCheckIn}
              loading={loading}
              disabled={loading || locationLoading}
              style={styles.checkInButton}
              contentStyle={styles.buttonContent}
              buttonColor="#4CAF50"
            >
              {loading ? 'Recording...' : 'Check In'}
            </Button>
          ) : !attendanceData.checkOut ? (
            <Button
              mode="contained"
              onPress={handleCheckOut}
              loading={loading}
              disabled={loading || locationLoading}
              style={styles.checkOutButton}
              contentStyle={styles.buttonContent}
              buttonColor="#F44336"
            >
              {loading ? 'Recording...' : 'Check Out'}
            </Button>
          ) : (
            <View style={styles.completedContainer}>
              <MaterialIcons name="check-circle" size={48} color="#4CAF50" />
              <Text variant="titleMedium" style={styles.completedText}>
                Attendance completed for today
              </Text>
            </View>
          )}
        </View>
      </View>
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
    color: '#FF9800',
  },
  date: {
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statusCard: {
    elevation: 2,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusInfo: {
    marginLeft: 12,
    flex: 1,
  },
  statusTitle: {
    fontWeight: 'bold',
  },
  statusText: {
    fontWeight: '500',
    marginTop: 2,
  },
  locationCard: {
    elevation: 2,
    borderRadius: 8,
    marginBottom: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationTitle: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  locationLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#666',
  },
  locationText: {
    color: '#666',
    lineHeight: 20,
  },
  refreshLocation: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  recordCard: {
    elevation: 2,
    borderRadius: 8,
    marginBottom: 24,
  },
  recordTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  recordItem: {
    alignItems: 'center',
    flex: 1,
  },
  recordLabel: {
    color: '#666',
    marginTop: 4,
  },
  recordValue: {
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  actionButtons: {
    gap: 12,
  },
  checkInButton: {
    borderRadius: 8,
  },
  checkOutButton: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  completedContainer: {
    alignItems: 'center',
    padding: 24,
  },
  completedText: {
    marginTop: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});