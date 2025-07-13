// Powered by OnSpace.AI
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Card } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const handleAdminLogin = () => {
    router.push('/(auth)/admin-login');
  };

  const handleDriverLogin = () => {
    router.push('/(auth)/driver-login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="local-shipping" size={80} color="#1976D2" />
          <Text variant="headlineLarge" style={styles.title}>
            Varshini Fleet Manager
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Digital Fleet & Workforce Management
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <Card style={styles.card} onPress={handleAdminLogin}>
            <Card.Content style={styles.cardContent}>
              <MaterialIcons name="admin-panel-settings" size={48} color="#1976D2" />
              <Text variant="headlineSmall" style={styles.cardTitle}>
                Admin Portal
              </Text>
              <Text variant="bodyMedium" style={styles.cardDescription}>
                Manage fleet, drivers, and operations
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.card} onPress={handleDriverLogin}>
            <Card.Content style={styles.cardContent}>
              <MaterialIcons name="person" size={48} color="#FF9800" />
              <Text variant="headlineSmall" style={styles.cardTitle}>
                Driver Portal
              </Text>
              <Text variant="bodyMedium" style={styles.cardDescription}>
                Attendance, requests, and schedules
              </Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.footerText}>
            Varshini Media Solutions
          </Text>
          <Text variant="bodySmall" style={styles.version}>
            Version 1.0.0
          </Text>
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
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    marginTop: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1976D2',
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },
  cardContainer: {
    gap: 16,
    marginVertical: 40,
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  cardContent: {
    alignItems: 'center',
    padding: 24,
  },
  cardTitle: {
    marginTop: 12,
    fontWeight: 'bold',
  },
  cardDescription: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },
  footer: {
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    color: '#666',
    fontWeight: '500',
  },
  version: {
    color: '#999',
  },
});