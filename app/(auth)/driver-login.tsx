
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Text, TextInput, Button, Card, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import PhoneInput from 'react-native-phone-number-input';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { useAuth } from '../../contexts/AuthContext';

export default function DriverLogin() {
  const { login, isLoading } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState(false);
  
  useEffect(() => {
    checkBiometricSupport();
    checkSavedCredentials();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setIsBiometricSupported(compatible && enrolled);
  };

  const checkSavedCredentials = async () => {
    // Check if user has saved credentials for biometric login
    // This would typically check AsyncStorage or secure storage
    setSavedCredentials(true); // Placeholder
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login with biometrics',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use password',
        disableDeviceFallback: false,
      });

      if (result.success) {
        // Use saved credentials for automatic login
        const savedPhone = '+919876543210'; // This would come from secure storage
        const savedPassword = 'password123'; // This would be encrypted/hashed
        await login(savedPhone, savedPassword);
        router.replace('/(driver)');
      }
    } catch (error) {
      Alert.alert('Error', 'Biometric authentication failed');
    }
  };

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert('Error', 'Please enter both phone number and password');
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    try {
      // Convert phone number to email format for backend compatibility
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const emailFormat = `${cleanPhone}@phone.vms.com`;
      
      await login(emailFormat, password);
      router.replace('/(driver)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Login failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text variant="headlineMedium" style={styles.title}>
              Driver Login
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Sign in to access your dashboard
            </Text>

            <PhoneInput
              defaultCode="IN"
              layout="first"
              onChangeText={setPhoneNumber}
              onChangeFormattedText={setFormattedValue}
              placeholder="Enter phone number"
              containerStyle={styles.phoneContainer}
              textContainerStyle={styles.phoneTextContainer}
              textInputStyle={styles.phoneInput}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              mode="outlined"
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.loginButton}
            >
              Login
            </Button>

            {isBiometricSupported && savedCredentials && (
              <View style={styles.biometricSection}>
                <Text variant="bodyMedium" style={styles.orText}>
                  or
                </Text>
                <Button
                  mode="outlined"
                  onPress={handleBiometricLogin}
                  icon="fingerprint"
                  style={styles.biometricButton}
                >
                  Login with Biometrics
                </Button>
              </View>
            )}

            <Button
              mode="text"
              onPress={() => router.push('/(auth)/admin-login')}
              style={styles.switchButton}
            >
              Login as Admin
            </Button>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  cardContent: {
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  phoneContainer: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  phoneTextContainer: {
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  phoneInput: {
    fontSize: 16,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  biometricSection: {
    marginTop: 16,
    alignItems: 'center',
  },
  orText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  biometricButton: {
    marginBottom: 16,
  },
  switchButton: {
    marginTop: 8,
  },
});
