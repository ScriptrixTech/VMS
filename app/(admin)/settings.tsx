// Powered by OnSpace.AI
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Text, 
  Card, 
  Button, 
  Switch,
  List,
  Divider,
  IconButton,
  Menu
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface SystemSettings {
  notifications: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    maintenanceAlerts: boolean;
    paymentAlerts: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
  };
  system: {
    autoBackup: boolean;
    dataRetention: number;
    reportGeneration: boolean;
  };
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    notifications: {
      pushEnabled: true,
      emailEnabled: true,
      maintenanceAlerts: true,
      paymentAlerts: true,
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
    },
    system: {
      autoBackup: true,
      dataRetention: 365,
      reportGeneration: true,
    },
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const fetchSettings = async () => {
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSettings();
  };

  const updateSetting = async (category: keyof SystemSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    
    // TODO: Save to API
    console.log('Updating setting:', category, key, value);
  };

  const handleSystemAction = (action: string) => {
    setMenuVisible(false);
    
    switch (action) {
      case 'backup':
        Alert.alert(
          'Create Backup',
          'This will create a complete system backup. Continue?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Create Backup', onPress: () => console.log('Creating backup...') }
          ]
        );
        break;
      case 'restore':
        router.push('/(admin)/system-restore');
        break;
      case 'export':
        router.push('/(admin)/export-data');
        break;
      case 'import':
        router.push('/(admin)/import-data');
        break;
    }
  };

  const showChangePasswordDialog = () => {
    Alert.alert(
      'Change Password',
      'You will be redirected to change your admin password',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => console.log('Changing password...') }
      ]
    );
  };

  const showLogoutDialog = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from admin panel?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => router.replace('/(auth)/admin-login') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleSection}>
            <Text variant="headlineMedium" style={styles.title}>
              Admin Settings
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              System configuration and management
            </Text>
          </View>
          
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setMenuVisible(true)}
                iconColor="#1976D2"
              />
            }
          >
            <Menu.Item
              onPress={() => handleSystemAction('backup')}
              title="Create Backup"
              leadingIcon="cloud-upload"
            />
            <Menu.Item
              onPress={() => handleSystemAction('restore')}
              title="Restore Data"
              leadingIcon="cloud-download"
            />
            <Divider />
            <Menu.Item
              onPress={() => handleSystemAction('export')}
              title="Export Data"
              leadingIcon="export"
            />
            <Menu.Item
              onPress={() => handleSystemAction('import')}
              title="Import Data"
              leadingIcon="import"
            />
          </Menu>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Account Settings */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Account Settings
            </Text>
            
            <List.Section>
              <List.Item
                title="Profile Information"
                description="Update admin profile details"
                left={props => <List.Icon {...props} icon="account" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => router.push('/(admin)/profile')}
              />
              
              <List.Item
                title="Change Password"
                description="Update your login password"
                left={props => <List.Icon {...props} icon="lock" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={showChangePasswordDialog}
              />
              
              <List.Item
                title="Two-Factor Authentication"
                description="Enable 2FA for enhanced security"
                left={props => <List.Icon {...props} icon="shield-check" />}
                right={() => (
                  <Switch
                    value={settings.security.twoFactorEnabled}
                    onValueChange={(value) => updateSetting('security', 'twoFactorEnabled', value)}
                  />
                )}
              />
            </List.Section>
          </Card.Content>
        </Card>

        {/* Notification Settings */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Notification Settings
            </Text>
            
            <List.Section>
              <List.Item
                title="Push Notifications"
                description="Enable mobile push notifications"
                left={props => <List.Icon {...props} icon="bell" />}
                right={() => (
                  <Switch
                    value={settings.notifications.pushEnabled}
                    onValueChange={(value) => updateSetting('notifications', 'pushEnabled', value)}
                  />
                )}
              />
              
              <List.Item
                title="Email Notifications"
                description="Receive notifications via email"
                left={props => <List.Icon {...props} icon="email" />}
                right={() => (
                  <Switch
                    value={settings.notifications.emailEnabled}
                    onValueChange={(value) => updateSetting('notifications', 'emailEnabled', value)}
                  />
                )}
              />
              
              <List.Item
                title="Maintenance Alerts"
                description="Alerts for vehicle maintenance due"
                left={props => <List.Icon {...props} icon="wrench" />}
                right={() => (
                  <Switch
                    value={settings.notifications.maintenanceAlerts}
                    onValueChange={(value) => updateSetting('notifications', 'maintenanceAlerts', value)}
                  />
                )}
              />
              
              <List.Item
                title="Payment Alerts"
                description="Notifications for pending requests"
                left={props => <List.Icon {...props} icon="cash" />}
                right={() => (
                  <Switch
                    value={settings.notifications.paymentAlerts}
                    onValueChange={(value) => updateSetting('notifications', 'paymentAlerts', value)}
                  />
                )}
              />
            </List.Section>
          </Card.Content>
        </Card>

        {/* System Settings */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              System Settings
            </Text>
            
            <List.Section>
              <List.Item
                title="Auto Backup"
                description="Automatically backup system data"
                left={props => <List.Icon {...props} icon="backup-restore" />}
                right={() => (
                  <Switch
                    value={settings.system.autoBackup}
                    onValueChange={(value) => updateSetting('system', 'autoBackup', value)}
                  />
                )}
              />
              
              <List.Item
                title="Report Generation"
                description="Enable automatic report generation"
                left={props => <List.Icon {...props} icon="chart-line" />}
                right={() => (
                  <Switch
                    value={settings.system.reportGeneration}
                    onValueChange={(value) => updateSetting('system', 'reportGeneration', value)}
                  />
                )}
              />
              
              <List.Item
                title="Data Retention Policy"
                description="Manage how long data is stored"
                left={props => <List.Icon {...props} icon="database" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => router.push('/(admin)/data-retention')}
              />
            </List.Section>
          </Card.Content>
        </Card>

        {/* Management Tools */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Management Tools
            </Text>
            
            <List.Section>
              <List.Item
                title="User Management"
                description="Manage driver accounts and permissions"
                left={props => <List.Icon {...props} icon="account-group" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => router.push('/(admin)/user-management')}
              />
              
              <List.Item
                title="Document Templates"
                description="Manage document templates and formats"
                left={props => <List.Icon {...props} icon="file-document" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => router.push('/(admin)/document-templates')}
              />
              
              <List.Item
                title="System Health"
                description="Monitor system performance and health"
                left={props => <List.Icon {...props} icon="heart-pulse" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => router.push('/(admin)/system-health')}
              />
              
              <List.Item
                title="Audit Logs"
                description="View system activity and access logs"
                left={props => <List.Icon {...props} icon="history" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => router.push('/(admin)/audit-logs')}
              />
            </List.Section>
          </Card.Content>
        </Card>

        {/* Application Info */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Application Information
            </Text>
            
            <List.Section>
              <List.Item
                title="App Version"
                description="1.0.0 (Build 1)"
                left={props => <List.Icon {...props} icon="information" />}
              />
              
              <List.Item
                title="Last Backup"
                description="July 13, 2024 at 2:30 AM"
                left={props => <List.Icon {...props} icon="clock" />}
              />
              
              <List.Item
                title="Database Size"
                description="2.4 GB"
                left={props => <List.Icon {...props} icon="database" />}
              />
              
              <List.Item
                title="Support & Help"
                description="Get help and contact support"
                left={props => <List.Icon {...props} icon="help-circle" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => router.push('/(admin)/support')}
              />
            </List.Section>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            icon="logout"
            onPress={showLogoutDialog}
            style={[styles.actionButton, styles.logoutButton]}
            labelStyle={{ color: '#F44336' }}
          >
            Logout
          </Button>
        </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  settingsCard: {
    elevation: 2,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  actionButtons: {
    marginTop: 20,
    marginBottom: 20,
  },
  actionButton: {
    marginBottom: 12,
  },
  logoutButton: {
    borderColor: '#F44336',
  },
});