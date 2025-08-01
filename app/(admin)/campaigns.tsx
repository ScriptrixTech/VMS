// Powered by OnSpace.AI
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Text, 
  Card, 
  Button, 
  FAB, 
  Searchbar, 
  Chip, 
  IconButton,
  Menu,
  Divider,
  ProgressBar
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Campaign } from '../../types';

interface CampaignStats {
  total: number;
  active: number;
  completed: number;
  planned: number;
  totalRevenue: number;
}

export default function CampaignManagement() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<CampaignStats>({
    total: 0,
    active: 0,
    completed: 0,
    planned: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  const fetchCampaignData = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockCampaigns: Campaign[] = [
        {
          id: 'camp1',
          clientName: 'ABC Electronics',
          campaignName: 'Product Launch Campaign',
          description: 'Mobile advertising campaign for new smartphone launch',
          startDate: '2024-07-01',
          endDate: '2024-07-31',
          route: 'Bangalore - Chennai - Hyderabad',
          assignedVehicles: ['KA01AB1234', 'KA02CD5678'],
          revenue: 150000,
          status: 'active',
          createdAt: '2024-06-15',
          updatedAt: '2024-07-10'
        },
        {
          id: 'camp2',
          clientName: 'XYZ Fashion',
          campaignName: 'Summer Collection Promo',
          description: 'Billboard advertising for summer fashion collection',
          startDate: '2024-06-15',
          endDate: '2024-06-30',
          route: 'Bangalore City Center',
          assignedVehicles: ['KA03EF9012'],
          revenue: 85000,
          status: 'completed',
          createdAt: '2024-06-01',
          updatedAt: '2024-06-30'
        }
      ];

      setCampaigns(mockCampaigns);
      setStats({
        total: 15,
        active: 8,
        completed: 5,
        planned: 2,
        totalRevenue: 2500000
      });
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    fetchCampaignData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCampaignData();
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.route.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return '#FF9800';
      case 'active': return '#4CAF50';
      case 'completed': return '#2196F3';
      case 'cancelled': return '#F44336';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planned': return 'schedule';
      case 'active': return 'play-circle-filled';
      case 'completed': return 'check-circle';
      case 'cancelled': return 'cancel';
      default: return 'help';
    }
  };

  const handleCampaignAction = (campaignId: string, action: string) => {
    setMenuVisible(null);
    
    switch (action) {
      case 'view':
        router.push(`/(admin)/campaign-details/${campaignId}`);
        break;
      case 'edit':
        router.push(`/(admin)/edit-campaign/${campaignId}`);
        break;
      case 'assign-vehicles':
        router.push(`/(admin)/assign-campaign-vehicles/${campaignId}`);
        break;
      case 'track':
        router.push(`/(admin)/campaign-tracking/${campaignId}`);
        break;
      case 'complete':
        Alert.alert(
          'Complete Campaign',
          'Mark this campaign as completed?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Complete', onPress: () => {} }
          ]
        );
        break;
      case 'cancel':
        Alert.alert(
          'Cancel Campaign',
          'Are you sure you want to cancel this campaign?',
          [
            { text: 'No', style: 'cancel' },
            { text: 'Yes', style: 'destructive', onPress: () => {} }
          ]
        );
        break;
    }
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

  const getCampaignProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    
    if (now < start) return 0;
    if (now > end) return 1;
    
    return (now - start) / (end - start);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Campaign Management
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Manage advertising campaigns
        </Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Campaign Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <Card style={[styles.statCard, { borderLeftColor: '#1976D2' }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.total}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Total Campaigns
                </Text>
              </Card.Content>
            </Card>
            
            <Card style={[styles.statCard, { borderLeftColor: '#4CAF50' }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.active}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Active
                </Text>
              </Card.Content>
            </Card>
          </View>
          
          <Card style={[styles.revenueCard, { borderLeftColor: '#FF9800' }]}>
            <Card.Content style={styles.revenueContent}>
              <MaterialIcons name="monetization-on" size={32} color="#FF9800" />
              <View style={styles.revenueInfo}>
                <Text variant="bodySmall" style={styles.revenueLabel}>
                  Total Revenue Generated
                </Text>
                <Text variant="headlineMedium" style={styles.revenueValue}>
                  {formatCurrency(stats.totalRevenue)}
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchSection}>
          <Searchbar
            placeholder="Search campaigns..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            <Chip
              selected={statusFilter === 'all'}
              onPress={() => setStatusFilter('all')}
              style={styles.filterChip}
            >
              All
            </Chip>
            <Chip
              selected={statusFilter === 'planned'}
              onPress={() => setStatusFilter('planned')}
              style={styles.filterChip}
            >
              Planned
            </Chip>
            <Chip
              selected={statusFilter === 'active'}
              onPress={() => setStatusFilter('active')}
              style={styles.filterChip}
            >
              Active
            </Chip>
            <Chip
              selected={statusFilter === 'completed'}
              onPress={() => setStatusFilter('completed')}
              style={styles.filterChip}
            >
              Completed
            </Chip>
          </ScrollView>
        </View>

        {/* Campaign List */}
        <View style={styles.campaignList}>
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} style={styles.campaignCard}>
              <Card.Content>
                <View style={styles.campaignHeader}>
                  <View style={styles.campaignInfo}>
                    <Text variant="titleMedium" style={styles.campaignName}>
                      {campaign.campaignName}
                    </Text>
                    <Text variant="bodyMedium" style={styles.clientName}>
                      {campaign.clientName}
                    </Text>
                  </View>
                  
                  <View style={styles.campaignActions}>
                    <Chip 
                      mode="outlined"
                      icon={getStatusIcon(campaign.status)}
                      textStyle={{ color: getStatusColor(campaign.status) }}
                      style={[styles.statusChip, { borderColor: getStatusColor(campaign.status) }]}
                    >
                      {campaign.status}
                    </Chip>
                    
                    <Menu
                      visible={menuVisible === campaign.id}
                      onDismiss={() => setMenuVisible(null)}
                      anchor={
                        <IconButton
                          icon="dots-vertical"
                          onPress={() => setMenuVisible(campaign.id)}
                        />
                      }
                    >
                      <Menu.Item
                        onPress={() => handleCampaignAction(campaign.id, 'view')}
                        title="View Details"
                        leadingIcon="eye"
                      />
                      <Menu.Item
                        onPress={() => handleCampaignAction(campaign.id, 'edit')}
                        title="Edit Campaign"
                        leadingIcon="pencil"
                      />
                      <Menu.Item
                        onPress={() => handleCampaignAction(campaign.id, 'assign-vehicles')}
                        title="Assign Vehicles"
                        leadingIcon="car"
                      />
                      <Menu.Item
                        onPress={() => handleCampaignAction(campaign.id, 'track')}
                        title="Track Progress"
                        leadingIcon="map"
                      />
                      <Divider />
                      {campaign.status === 'active' && (
                        <Menu.Item
                          onPress={() => handleCampaignAction(campaign.id, 'complete')}
                          title="Mark Complete"
                          leadingIcon="check"
                        />
                      )}
                      <Menu.Item
                        onPress={() => handleCampaignAction(campaign.id, 'cancel')}
                        title="Cancel"
                        leadingIcon="cancel"
                        titleStyle={{ color: '#F44336' }}
                      />
                    </Menu>
                  </View>
                </View>
                
                <Text variant="bodyMedium" style={styles.description}>
                  {campaign.description}
                </Text>
                
                <View style={styles.campaignDetails}>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="place" size={16} color="#666" />
                    <Text variant="bodySmall" style={styles.detailText}>
                      {campaign.route}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="directions-car" size={16} color="#666" />
                    <Text variant="bodySmall" style={styles.detailText}>
                      {campaign.assignedVehicles.length} vehicles assigned
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="attach-money" size={16} color="#666" />
                    <Text variant="bodySmall" style={styles.detailText}>
                      Revenue: {formatCurrency(campaign.revenue)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.dateSection}>
                  <Text variant="bodySmall" style={styles.dateText}>
                    {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                  </Text>
                  
                  {campaign.status === 'active' && (
                    <View style={styles.progressSection}>
                      <Text variant="bodySmall" style={styles.progressLabel}>
                        Progress
                      </Text>
                      <ProgressBar 
                        progress={getCampaignProgress(campaign.startDate, campaign.endDate)}
                        color="#4CAF50"
                        style={styles.progressBar}
                      />
                    </View>
                  )}
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/(admin)/create-campaign')}
        label="New Campaign"
      />
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
  revenueCard: {
    elevation: 2,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  revenueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  revenueInfo: {
    flex: 1,
  },
  revenueLabel: {
    color: '#666',
  },
  revenueValue: {
    fontWeight: 'bold',
    color: '#FF9800',
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
  campaignList: {
    gap: 12,
  },
  campaignCard: {
    elevation: 2,
    borderRadius: 8,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  campaignInfo: {
    flex: 1,
  },
  campaignName: {
    fontWeight: 'bold',
    color: '#333',
  },
  clientName: {
    color: '#1976D2',
    marginTop: 2,
  },
  campaignActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusChip: {
    height: 28,
  },
  description: {
    color: '#666',
    marginBottom: 12,
  },
  campaignDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    color: '#666',
  },
  dateSection: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  dateText: {
    color: '#666',
    marginBottom: 8,
  },
  progressSection: {
    gap: 4,
  },
  progressLabel: {
    color: '#666',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
    backgroundColor: '#1976D2',
  },
});