// Powered by OnSpace.AI
import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function DriverLoginScreen() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!mobile || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (mobile.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setLoading(false);
      // For demo purposes, accept any mobile/password
      if (mobile && password) {
        router.replace('/(driver)');
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    }, 1500);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Button 
              mode="text" 
              onPress={handleBack}
              contentStyle={styles.backButton}
            >
              <MaterialIcons name="arrow-back" size={24} color="#FF9800" />
            </Button>
            
            <MaterialIcons name="person" size={60} color="#FF9800" />
            <Text variant="headlineMedium" style={styles.title}>
              Driver Login
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Access your driver portal
            </Text>
          </View>

          <Card style={styles.loginCard}>
            <Card.Content style={styles.cardContent}>
              <TextInput
                label="Mobile Number"
                value={mobile}
                onChangeText={setMobile}
                mode="outlined"
                keyboardType="numeric"
                maxLength={10}
                style={styles.input}
                left={<TextInput.Icon icon="phone" />}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon 
                    icon={showPassword ? 'eye-off' : 'eye'} 
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.loginButton}
                contentStyle={styles.buttonContent}
                buttonColor="#FF9800"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Card.Content>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  title: {
    marginTop: 16,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },
  loginCard: {
    elevation: 4,
    borderRadius: 12,
  },
  cardContent: {
    padding: 24,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});