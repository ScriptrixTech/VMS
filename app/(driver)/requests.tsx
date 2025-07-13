// Powered by OnSpace.AI
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Button, TextInput, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface Request {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  reason: string;
}

export default function RequestsScreen() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [customAmount, setCustomAmount] = useState('');
  const [reason, setReason] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const quickAmounts = [200, 500, 1000, 2000];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    // Simulate API call
    setTimeout(() => {
      setRequests([
        {
          id: '1',
          amount: 500,
          status: 'pending',
          date: '2024-01-15',
          reason: 'Fuel expense',
        },
        {
          id: '2',
          amount: 1000,
          status: 'approved',
          date: '2024-01-14',
          reason: 'Emergency medical',
        },
        {
          id: '3',
          amount: 200,
          status: 'rejected',
          date: '2024-01-13',
          reason: 'Personal expense',
        },
      ]);
    }, 500);
  };

  const handleQuickRequest = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleSubmitRequest = async () => {
    const amount = selectedAmount || parseFloat(customAmount);
    
    if (!amount || amount <= 0) {
      Alert.alert('Error', 'Please select or enter a valid amount');
      return;
    }

    if (!reason.trim()) {
      Alert.alert('Error', 'Please provide a reason for the request');
      return;
    }

    if (amount > 5000) {
      Alert.alert('Error', 'Maximum request amount is ₹5000');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newRequest: Request = {
        id: Date.now().toString(),
        amount,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        reason: reason.trim(),
      };

      setRequests(prev => [newRequest, ...prev]);
      setSelectedAmount(null);
      setCustomAmount('');
      setReason('');
      setLoading(false);

      Alert.alert('Success', 'Your request has been submitted and is pending approval');
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#4CAF50';
      case 'rejected': return '#F44336';
      default: return '#FF9800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return 'check-circle';
      case 'rejected': return 'cancel';
      default: return 'schedule';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Money Requests
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Request advance payments
          </Text>
        </View>

        <ScrollView style={styles.content}>
          {/* New Request Form */}
          <Card style={styles.requestCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>
                New Request
              </Text>

              {/* Quick Amount Buttons */}
              <View style={styles.amountSection}>
                <Text variant="bodyMedium" style={styles.sectionLabel}>
                  Quick Amounts
                </Text>
                <View style={styles.quickAmounts}>
                  {quickAmounts.map((amount) => (
                    <Chip
                      key={amount}
                      selected={selectedAmount === amount}
                      onPress={() => handleQuickRequest(amount)}
                      style={styles.amountChip}
                    >
                      ₹{amount}
                    </Chip>
                  ))}
                </View>
              </View>

              {/* Custom Amount */}
              <View style={styles.customAmountSection}>
                <Text variant="bodyMedium" style={styles.sectionLabel}>
                  Or Enter Custom Amount
                </Text>
                <TextInput
                  label="Amount (₹)"
                  value={customAmount}
                  onChangeText={handleCustomAmountChange}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="currency-inr" />}
                />
              </View>

              {/* Reason */}
              <View style={styles.reasonSection}>
                <TextInput
                  label="Reason for Request"
                  value={reason}
                  onChangeText={setReason}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  style={styles.input}
                  left={<TextInput.Icon icon="note-text" />}
                />
              </View>

              <Button
                mode="contained"
                onPress={handleSubmitRequest}
                loading={loading}
                disabled={loading}
                style={styles.submitButton}
                contentStyle={styles.buttonContent}
                buttonColor="#FF9800"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </Card.Content>
          </Card>

          {/* Request History */}
          <View style={styles.historySection}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Request History
            </Text>
            
            {requests.length === 0 ? (
              <Card style={styles.emptyCard}>
                <Card.Content style={styles.emptyContent}>
                  <MaterialIcons name="inbox" size={48} color="#666" />
                  <Text variant="bodyLarge" style={styles.emptyText}>
                    No requests yet
                  </Text>
                </Card.Content>
              </Card>
            ) : (
              requests.map((request) => (
                <Card key={request.id} style={styles.historyCard}>
                  <Card.Content>
                    <View style={styles.historyHeader}>
                      <View style={styles.historyInfo}>
                        <Text variant="titleMedium" style={styles.historyAmount}>
                          ₹{request.amount.toLocaleString()}
                        </Text>
                        <Text variant="bodyMedium" style={styles.historyReason}>
                          {request.reason}
                        </Text>
                        <Text variant="bodySmall" style={styles.historyDate}>
                          {new Date(request.date).toLocaleDateString('en-IN')}
                        </Text>
                      </View>
                      <View style={styles.historyStatus}>
                        <MaterialIcons 
                          name={getStatusIcon(request.status)} 
                          size={24} 
                          color={getStatusColor(request.status)} 
                        />
                        <Text 
                          variant="bodyMedium" 
                          style={[styles.statusText, { color: getStatusColor(request.status) }]}
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              ))
            )}
          </View>
        </ScrollView>
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
  subtitle: {
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  requestCard: {
    elevation: 2,
    borderRadius: 8,
    marginBottom: 24,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  amountSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontWeight: '500',
    marginBottom: 8,
    color: '#666',
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amountChip: {
    marginRight: 4,
  },
  customAmountSection: {
    marginBottom: 16,
  },
  reasonSection: {
    marginBottom: 16,
  },
  input: {
    marginTop: 8,
  },
  submitButton: {
    borderRadius: 8,
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  historySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  emptyCard: {
    elevation: 1,
    borderRadius: 8,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    marginTop: 8,
    color: '#666',
  },
  historyCard: {
    elevation: 2,
    borderRadius: 8,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  historyInfo: {
    flex: 1,
  },
  historyAmount: {
    fontWeight: 'bold',
    color: '#333',
  },
  historyReason: {
    color: '#666',
    marginTop: 2,
  },
  historyDate: {
    color: '#999',
    marginTop: 4,
  },
  historyStatus: {
    alignItems: 'center',
    marginLeft: 16,
  },
  statusText: {
    fontWeight: '500',
    marginTop: 2,
    fontSize: 12,
  },
});