import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, Surface, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@vms.com');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const { login, user } = useAuth();

  React.useEffect(() => {
    if (user && user.roles.includes('Admin')) {
      router.replace('/(admin)');
    }
  }, [user]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);

      // Check if user has admin role
      const currentUser = user;
      if (currentUser && currentUser.roles.includes('Admin')) {
        router.replace('/(admin)');
      } else {
        Alert.alert('Error', 'Access denied. Admin privileges required.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.primary }]}>
              VMS Admin
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Sign in to admin dashboard
            </Text>
          </View>

          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={styles.input}
                left={<TextInput.Icon icon="email" />}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                autoComplete="password"
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon 
                    icon={showPassword ? "eye-off" : "eye"} 
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
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Button
                mode="text"
                onPress={() => router.push('/(auth)/driver-login')}
                style={styles.switchButton}
              >
                Switch to Driver Login
              </Button>
            </Card.Content>
          </Card>

          <Surface style={styles.footer} elevation={0}>
            <Text variant="bodySmall" style={styles.footerText}>
              Vehicle Management System v1.0
            </Text>
            <Text variant="bodySmall" style={styles.footerText}>
              Default Admin: admin@vms.com / Admin@123
            </Text>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}