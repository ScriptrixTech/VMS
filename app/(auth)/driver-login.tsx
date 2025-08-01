
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, TextInput, Button, HelperText, Snackbar, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import PhoneInput from 'react-native-phone-number-input';
import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rnBiometrics = new ReactNativeBiometrics();

export default function DriverLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    checkBiometricsAvailability();
    checkBiometricsEnabled();
  }, []);

  const checkBiometricsAvailability = async () => {
    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      setBiometricsAvailable(available);
      
      if (available) {
        console.log('Biometrics available:', biometryType);
      }
    } catch (error) {
      console.log('Biometrics not available:', error);
    }
  };

  const checkBiometricsEnabled = async () => {
    try {
      const enabled = await AsyncStorage.getItem('biometricsEnabled');
      setBiometricsEnabled(enabled === 'true');
    } catch (error) {
      console.log('Error checking biometrics setting:', error);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!phoneNumber || phoneNumber.length < 10) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await login({
        phoneNumber: formattedPhoneNumber || phoneNumber,
        password,
        userType: 'driver'
      });

      if (result.success) {
        // Offer to enable biometrics after successful login
        if (biometricsAvailable && !biometricsEnabled) {
          Alert.alert(
            'Enable Biometric Login',
            'Would you like to enable biometric authentication for faster login?',
            [
              { text: 'Not Now', style: 'cancel' },
              { 
                text: 'Enable', 
                onPress: () => enableBiometrics()
              }
            ]
          );
        }
        
        router.replace('/(driver)');
      } else {
        setSnackbarMessage(result.error || 'Login failed');
        setSnackbarVisible(true);
      }
    } catch (error) {
      setSnackbarMessage('An error occurred during login');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const enableBiometrics = async () => {
    try {
      const { success, signature } = await rnBiometrics.createSignature({
        promptMessage: 'Enable biometric authentication',
        payload: JSON.stringify({
          phoneNumber: formattedPhoneNumber || phoneNumber,
          timestamp: Date.now()
        })
      });

      if (success) {
        await AsyncStorage.setItem('biometricsEnabled', 'true');
        await AsyncStorage.setItem('biometricSignature', signature);
        await AsyncStorage.setItem('biometricPhoneNumber', formattedPhoneNumber || phoneNumber);
        setBiometricsEnabled(true);
        
        setSnackbarMessage('Biometric authentication enabled successfully');
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.log('Error enabling biometrics:', error);
      Alert.alert('Error', 'Failed to enable biometric authentication');
    }
  };

  const handleBiometricLogin = async () => {
    if (!biometricsAvailable || !biometricsEnabled) return;

    try {
      const storedPhoneNumber = await AsyncStorage.getItem('biometricPhoneNumber');
      if (!storedPhoneNumber) {
        Alert.alert('Error', 'No biometric data found. Please login with password first.');
        return;
      }

      const { success, signature } = await rnBiometrics.createSignature({
        promptMessage: 'Authenticate with biometrics',
        payload: JSON.stringify({
          phoneNumber: storedPhoneNumber,
          timestamp: Date.now()
        })
      });

      if (success) {
        setLoading(true);
        const result = await login({
          phoneNumber: storedPhoneNumber,
          biometricSignature: signature,
          userType: 'driver'
        });

        if (result.success) {
          router.replace('/(driver)');
        } else {
          setSnackbarMessage('Biometric authentication failed');
          setSnackbarVisible(true);
        }
      }
    } catch (error) {
      console.log('Biometric authentication error:', error);
      Alert.alert('Error', 'Biometric authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const disableBiometrics = async () => {
    try {
      await AsyncStorage.removeItem('biometricsEnabled');
      await AsyncStorage.removeItem('biometricSignature');
      await AsyncStorage.removeItem('biometricPhoneNumber');
      setBiometricsEnabled(false);
      
      setSnackbarMessage('Biometric authentication disabled');
      setSnackbarVisible(true);
    } catch (error) {
      console.log('Error disabling biometrics:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text variant="headlineMedium" style={styles.title}>
            Driver Login
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Sign in to access your dashboard
          </Text>
        </View>

        <Card style={styles.loginCard}>
          <Card.Content>
            <View style={styles.formContainer}>
              <Text variant="titleMedium" style={styles.inputLabel}>
                Phone Number
              </Text>
              <PhoneInput
                defaultCode="US"
                layout="first"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                onChangeFormattedText={setFormattedPhoneNumber}
                placeholder="Enter your phone number"
                containerStyle={styles.phoneContainer}
                textContainerStyle={styles.phoneTextContainer}
                textInputStyle={styles.phoneInput}
                flagButtonStyle={styles.flagButton}
              />
              <HelperText type="error" visible={!!errors.phoneNumber}>
                {errors.phoneNumber}
              </HelperText>

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                error={!!errors.password}
                style={styles.input}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
              <HelperText type="error" visible={!!errors.password}>
                {errors.password}
              </HelperText>

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.loginButton}
                contentStyle={styles.buttonContent}
              >
                Sign In
              </Button>

              {biometricsAvailable && (
                <View style={styles.biometricSection}>
                  <View style={styles.biometricHeader}>
                    <Text variant="titleSmall">Biometric Authentication</Text>
                    {biometricsEnabled && (
                      <IconButton
                        icon="cog"
                        size={20}
                        onPress={() => Alert.alert(
                          'Biometric Settings',
                          'Manage your biometric authentication',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            { 
                              text: 'Disable', 
                              style: 'destructive',
                              onPress: disableBiometrics
                            }
                          ]
                        )}
                      />
                    )}
                  </View>
                  
                  {biometricsEnabled ? (
                    <Button
                      mode="outlined"
                      onPress={handleBiometricLogin}
                      icon="fingerprint"
                      style={styles.biometricButton}
                    >
                      Login with Biometrics
                    </Button>
                  ) : (
                    <Button
                      mode="outlined"
                      onPress={enableBiometrics}
                      icon="fingerprint"
                      style={styles.biometricButton}
                      disabled={!phoneNumber || !password}
                    >
                      Enable Biometric Login
                    </Button>
                  )}
                </View>
              )}

              <View style={styles.linkContainer}>
                <Button
                  mode="text"
                  onPress={() => router.push('/(auth)/forgot-password')}
                  style={styles.linkButton}
                >
                  Forgot Password?
                </Button>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.switchContainer}>
          <Text variant="bodyMedium">Admin access?</Text>
          <Button
            mode="text"
            onPress={() => router.push('/(auth)/admin-login')}
            style={styles.switchButton}
          >
            Admin Login
          </Button>
        </View>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
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
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    color: '#1976D2',
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  loginCard: {
    elevation: 4,
    borderRadius: 12,
  },
  formContainer: {
    gap: 8,
  },
  inputLabel: {
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  phoneContainer: {
    backgroundColor: 'transparent',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  phoneTextContainer: {
    backgroundColor: 'transparent',
    borderRadius: 0,
  },
  phoneInput: {
    fontSize: 16,
  },
  flagButton: {
    borderRightWidth: 1,
    borderRightColor: '#CCCCCC',
  },
  input: {
    marginTop: 8,
  },
  loginButton: {
    marginTop: 24,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  biometricSection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  biometricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  biometricButton: {
    borderRadius: 8,
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkButton: {
    borderRadius: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  switchButton: {
    borderRadius: 8,
  },
});
