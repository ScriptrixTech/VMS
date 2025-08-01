` tags.

```xml
<replit_final_file>
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Route based on user role
        if (user.roles.includes('Admin')) {
          router.replace('/(admin)');
        } else if (user.roles.includes('Driver')) {
          router.replace('/(driver)');
        } else {
          router.replace('/(tabs)');
        }
      } else {
        router.replace('/(auth)/driver-login');
      }
    }
  }, [isAuthenticated, isLoading, user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return null;
}