// Powered by OnSpace.AI
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Text, 
  Card, 
  Button, 
  Searchbar, 
  Chip, 
  IconButton,
  Menu,
  Divider,
  Avatar,
  TextInput,
  Modal,
  Portal
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { MoneyRequest } from '../../types';

interface RequestStats {
  pending: number;
  approved: number;
  rejected: number;
  totalAmount: number;
}

export default function RequestManagement() {
  const [requests, setRequests] = useState<MoneyRequest[]>([]);
  const [stats, setStats] = useState<RequestStats>({
    pending: 0,
    approved: 0,
    rejected: 0,
    totalAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchRequestData = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockRequests: MoneyRequest[] = [
        {
          id: 'req1',
          driverId: 'driver1',
          amount: 5000,
          reason: 'Fuel advance for long route campaign',
          status: 'pending',
          requestDate: '2024-07-10',
          createdAt: '2024-07-10T10:00:00Z',
          updatedAt: '2024-07-10T10:00:00Z'
        },
        {
          id: 'req2',
          driverId: 'driver2',
          amount: 3000,
          reason: 'Vehicle maintenance emergency',
          status: 'pending',
          requestDate: '2024-07-11',
          createdAt: '2024-07-11T14:30:00Z',
          updatedAt: '2024-07-11T14:30:00Z'
        },
        {
          id: 'req3',
          driverId: 'driver1',
          amount: 2000,
          reason: 'Medical emergency advance',
          status: 'approved',
          requestDate: '2024-07-08',
          approvedBy: 'admin1',
          approvedDate: '2024-07-08',
          paymentMethod: 'bank_transfer',
          transactionId: 'TXN123456',
          createdAt: '2024-07-08T09:00:00Z',
          updatedAt: '2024-07-08T16:00:00Z'
        }
      ];

      setRequests(mockRequests);
      setStats({
        pending: 2,
        approved: 1,
        rejected: 0,
        totalAmount: 10000
      });
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    fetchRequestData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequestData();
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.driverId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'approved': return '#4CAF50';
      case 'rejected': return '#F44336';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'schedule';
      case 'approved': return 'check-circle';
      case 'rejected': return 'cancel';
      default: return 'help';
    }
  };

  const handleApproveRequest = (requestId: string) => {
    Alert.alert(
      'Approve Request',
      'Are you sure you want to approve this financial request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Approve', 
          style: 'default',
          onPress: () => {
            // TODO: Implement approval logic
            console.log('Approving request:', requestId);
          }
        }
      ]
    );
  };

  const handleRejectRequest = (requestId: string) => {
    setSelectedRequest(requestId);
    setRejectModalVisible(true);
  };

  const submitRejection = () => {
    if (!rejectionReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for rejection');
      return;
    }
    
    // TODO: Implement rejection logic
    console.log('Rejecting request:', selectedRequest, 'Reason:', rejectionReason);
    
    setRejectModalVisible(false);
    setSelectedRequest(null);
    setRejectionReason('');
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDriverName = (driverId: string) => {
    // In real app, this would be fetched from driver data
    const driverNames: { [key: string]: string } = {
      'driver1': 'Rajesh Kumar',
      'driver2': 'Suresh Reddy'
    };
    return driverNames[driverId] || driverId;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Financial Requests
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Manage driver money requests
        </Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Request Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <Card style={[styles.statCard, { borderLeftColor: '#FF9800' }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.pending}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Pending
                </Text>
              </Card.Content>
            </Card>
            
            <Card style={[styles.statCard, { borderLeftColor: '#4CAF50' }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.approved}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Approved
                </Text>
              </Card.Content>
            </Card>
          </View>
          
          <Card style={[styles.totalCard, { borderLeftColor: '#1976D2' }]}>
            <Card.Content style={styles.totalContent}>
              <MaterialIcons name="account-balance-wallet" size={32} color="#1976D2" />
              <View style={styles.totalInfo}>
                <Text variant="bodySmall" style={styles.totalLabel}>
                  Total Requested Amount
                </Text>
                <Text variant="headlineMedium" style={styles.totalValue}>
                  {formatCurrency(stats.totalAmount)}
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchSection}>
          <Searchbar
            placeholder="Search requests..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            <Chip
              selected={statusFilter === 'pending'}
              onPress={() => setStatusFilter('pending')}
              style={styles.filterChip}
            >
              Pending
            </Chip>
            <Chip
              selected={statusFilter === 'approved'}
              onPress={() => setStatusFilter('approved')}
              style={styles.filterChip}
            >
              Approved
            </Chip>
            <Chip
              selected={statusFilter === 'rejected'}
              onPress={() => setStatusFilter('rejected')}
              style={styles.filterChip}
            >
              Rejected
            </Chip>
            <Chip
              selected={statusFilter === 'all'}
              onPress={() => setStatusFilter('all')}
              style={styles.filterChip}
            >
              All
            </Chip>
          </ScrollView>
        </View>

        {/* Request List */}
        <View style={styles.requestList}>
          {filteredRequests.map((request) => (
            <Card key={request.id} style={styles.requestCard}>
              <Card.Content>
                <View style={styles.requestHeader}>
                  <View style={styles.requestInfo}>
                    <View style={styles.driverRow}>
                      <Avatar.Text 
                        size={32} 
                        label={getDriverName(request.driverId).split(' ').map(n => n[0]).join('')}
                        style={styles.avatar}
                      />
                      <View style={styles.driverInfo}>
                        <Text variant="titleMedium" style={styles.driverName}>
                          {getDriverName(request.driverId)}
                        </Text>
                        <Text variant="bodySmall" style={styles.requestDate}>
                          {formatDate(request.requestDate)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.amountSection}>
                    <Text variant="headlineSmall" style={styles.amount}>
                      {formatCurrency(request.amount)}
                    </Text>
                    <Chip 
                      mode="outlined"
                      icon={getStatusIcon(request.status)}
                      textStyle={{ color: getStatusColor(request.status) }}
                      style={[styles.statusChip, { borderColor: getStatusColor(request.status) }]}
                    >
                      {request.status}
                    </Chip>
                  </View>
                </View>
                
                <View style={styles.requestDetails}>
                  <Text variant="bodyMedium" style={styles.reason}>
                    {request.reason}
                  </Text>
                </View>
                
                {request.status === 'approved' && request.transactionId && (
                  <View style={styles.transactionInfo}>
                    <MaterialIcons name="receipt" size={16} color="#4CAF50" />
                    <Text variant="bodySmall" style={styles.transactionText}>
                      Transaction ID: {request.transactionId}
                    </Text>
                  </View>
                )}
                
                {request.status === 'rejected' && request.rejectionReason && (
                  <View style={styles.rejectionInfo}>
                    <MaterialIcons name="info" size={16} color="#F44336" />
                    <Text variant="bodySmall" style={styles.rejectionText}>
                      Rejection Reason: {request.rejectionReason}
                    </Text>
                  </View>
                )}
                
                {request.status === 'pending' && (
                  <View style={styles.actionButtons}>
                    <Button
                      mode="contained"
                      onPress={() => handleApproveRequest(request.id)}
                      style={[styles.actionButton, styles.approveButton]}
                      labelStyle={styles.buttonLabel}
                    >
                      Approve
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => handleRejectRequest(request.id)}
                      style={[styles.actionButton, styles.rejectButton]}
                      labelStyle={[styles.buttonLabel, { color: '#F44336' }]}
                    >
                      Reject
                    </Button>
                  </View>
                )}
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Rejection Modal */}
      <Portal>
        <Modal
          visible={rejectModalVisible}
          onDismiss={() => setRejectModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            Reject Request
          </Text>
          <Text variant="bodyMedium" style={styles.modalSubtitle}>
            Please provide a reason for rejecting this request
          </Text>
          
          <TextInput
            mode="outlined"
            label="Rejection Reason"
            value={rejectionReason}
            onChangeText={setRejectionReason}
            multiline
            numberOfLines={3}
            style={styles.reasonInput}
          />
          
          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setRejectModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={submitRejection}
              style={[styles.modalButton, styles.rejectSubmitButton]}
              buttonColor="#F44336"
            >
              Reject Request
            </Button>
          </View>
        </Modal>
      </Portal>
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
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    elevation: 2,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  statContent: {
    padding: 16,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    color: '#666',
    marginTop: 4,
  },
  totalCard: {
    elevation: 2,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  totalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  totalInfo: {
    flex: 1,
  },
  totalLabel: {
    color: '#666',
  },
  totalValue: {
    fontWeight: 'bold',
    color: '#1976D2',
    marginTop: 4,
  },
  searchSection: {
    marginBottom: 20,
  },
  searchbar: {
    marginBottom: 12,
    elevation: 2,
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterChip: {
    marginRight: 8,
  },
  requestList: {
    gap: 12,
  },
  requestCard: {
    elevation: 2,
    borderRadius: 8,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  requestInfo: {
    flex: 1,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    backgroundColor: '#1976D2',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontWeight: 'bold',
    color: '#333',
  },
  requestDate: {
    color: '#666',
    marginTop: 2,
  },
  amountSection: {
    alignItems: 'flex-end',
    gap: 8,
  },
  amount: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  statusChip: {
    height: 28,
  },
  requestDetails: {
    marginBottom: 12,
  },
  reason: {
    color: '#333',
    lineHeight: 20,
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  transactionText: {
    color: '#4CAF50',
  },
  rejectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  rejectionText: {
    color: '#F44336',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    borderColor: '#F44336',
  },
  buttonLabel: {
    color: '#FFFFFF',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalSubtitle: {
    color: '#666',
    marginBottom: 20,
  },
  reasonInput: {
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    minWidth: 100,
  },
  rejectSubmitButton: {
    backgroundColor: '#F44336',
  },
});