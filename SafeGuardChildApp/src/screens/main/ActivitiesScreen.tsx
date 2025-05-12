import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../hooks/useAuth';

// Activity types and their respective icons
const ACTIVITY_ICONS = {
  app_usage: 'cellphone',
  web_browsing: 'web',
  location: 'map-marker',
  screenshot: 'cellphone-screenshot',
  audio_sample: 'microphone',
  emergency: 'alert-circle',
  system: 'cog',
};

// Format timestamp to readable date/time
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

// Get activity title based on type
const getActivityTitle = (type: string) => {
  switch (type) {
    case 'app_usage':
      return 'App Usage';
    case 'web_browsing':
      return 'Web Browsing';
    case 'location':
      return 'Location Update';
    case 'screenshot':
      return 'Screen Capture';
    case 'audio_sample':
      return 'Audio Recording';
    case 'emergency':
      return 'Emergency Alert';
    case 'system':
      return 'System Event';
    default:
      return 'Activity';
  }
};

const ActivitiesScreen = () => {
  const { user } = useAuth();
  
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  // Fetch activities from database
  const fetchActivities = async () => {
    try {
      if (!user) return;
      
      setLoading(true);
      
      let query = supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(50);
      
      // Apply filter if set
      if (filter) {
        query = query.eq('activity_type', filter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      
      // If we can't fetch real data, use empty array
      setActivities([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchActivities();
  };

  // Set filter and refresh
  const handleFilterChange = (newFilter: string | null) => {
    setFilter(filter === newFilter ? null : newFilter);
  };

  // Effect to fetch activities on mount and when filter changes
  useEffect(() => {
    fetchActivities();
  }, [user, filter]);

  // Render activity item
  const renderActivityItem = ({ item }: { item: any }) => {
    const activityType = item.activity_type || 'system';
    const iconName = ACTIVITY_ICONS[activityType as keyof typeof ACTIVITY_ICONS] || 'information-outline';
    let details = '';
    
    // Extract relevant details based on activity type
    if (item.data) {
      if (activityType === 'web_browsing' && item.data.url) {
        details = item.data.url;
      } else if (activityType === 'app_usage' && item.data.app_name) {
        details = item.data.app_name;
      } else if (activityType === 'location' && item.data.latitude && item.data.longitude) {
        details = `Lat: ${item.data.latitude.toFixed(4)}, Long: ${item.data.longitude.toFixed(4)}`;
      } else if (activityType === 'emergency' && item.data.message) {
        details = item.data.message;
      }
    }

    return (
      <View style={styles.activityItem}>
        <View style={[styles.activityIcon, { backgroundColor: getActivityColor(activityType) }]}>
          <Icon name={iconName} size={20} color="#FFFFFF" />
        </View>
        
        <View style={styles.activityContent}>
          <Text style={styles.activityTitle}>{getActivityTitle(activityType)}</Text>
          {details ? <Text style={styles.activityDetails}>{details}</Text> : null}
          <Text style={styles.activityTimestamp}>{formatTimestamp(item.timestamp)}</Text>
        </View>
      </View>
    );
  };

  // Get color based on activity type
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'app_usage':
        return '#4C84FF';
      case 'web_browsing':
        return '#9061F9';
      case 'location':
        return '#10B981';
      case 'screenshot':
        return '#F59E0B';
      case 'audio_sample':
        return '#6366F1';
      case 'emergency':
        return '#EF4444';
      case 'system':
        return '#64748B';
      default:
        return '#64748B';
    }
  };

  return (
    <View style={styles.container}>
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollableFilters 
          currentFilter={filter} 
          onFilterChange={handleFilterChange} 
        />
      </View>
      
      {/* Activity List */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4C84FF" />
          <Text style={styles.loadingText}>Loading activities...</Text>
        </View>
      ) : (
        <FlatList
          data={activities}
          renderItem={renderActivityItem}
          keyExtractor={(item) => `${item.id}`}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Icon name="tray" size={60} color="#94A3B8" />
              <Text style={styles.emptyText}>No activities to display</Text>
              <Text style={styles.emptySubtext}>
                {filter 
                  ? `Try removing the "${getActivityTitle(filter)}" filter` 
                  : 'Activities will appear here as they are recorded'}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

// Scrollable filter buttons component
const ScrollableFilters = ({ 
  currentFilter, 
  onFilterChange 
}: { 
  currentFilter: string | null, 
  onFilterChange: (filter: string | null) => void 
}) => {
  const filters = [
    { key: 'app_usage', label: 'Apps' },
    { key: 'web_browsing', label: 'Web' },
    { key: 'location', label: 'Location' },
    { key: 'screenshot', label: 'Screen' },
    { key: 'audio_sample', label: 'Audio' },
    { key: 'emergency', label: 'Emergency' },
  ];

  return (
    <View style={styles.scrollableFilters}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          currentFilter === null && styles.activeFilterButton,
        ]}
        onPress={() => onFilterChange(null)}
      >
        <Text
          style={[
            styles.filterButtonText,
            currentFilter === null && styles.activeFilterText,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>
      
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.key}
          style={[
            styles.filterButton,
            currentFilter === filter.key && styles.activeFilterButton,
          ]}
          onPress={() => onFilterChange(filter.key)}
        >
          <Text
            style={[
              styles.filterButtonText,
              currentFilter === filter.key && styles.activeFilterText,
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  filterContainer: {
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  scrollableFilters: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#F1F5F9',
  },
  activeFilterButton: {
    backgroundColor: '#4C84FF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#64748B',
    marginTop: 12,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  activityDetails: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  activityTimestamp: {
    fontSize: 12,
    color: '#94A3B8',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748B',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ActivitiesScreen;