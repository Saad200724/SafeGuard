import 'package:flutter/material.dart';

class ActivityScreen extends StatefulWidget {
  const ActivityScreen({Key? key}) : super(key: key);

  @override
  State<ActivityScreen> createState() => _ActivityScreenState();
}

class _ActivityScreenState extends State<ActivityScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  
  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 6, vsync: this);
  }
  
  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Tab bar
        Container(
          color: Theme.of(context).colorScheme.surface,
          child: TabBar(
            controller: _tabController,
            labelColor: Theme.of(context).primaryColor,
            unselectedLabelColor: Colors.grey,
            indicatorColor: Theme.of(context).primaryColor,
            tabs: const [
              Tab(text: 'All'),
              Tab(text: 'Apps'),
              Tab(text: 'Web'),
              Tab(text: 'Location'),
              Tab(text: 'Screen'),
              Tab(text: 'Audio'),
            ],
          ),
        ),
        
        // Tab content
        Expanded(
          child: TabBarView(
            controller: _tabController,
            children: [
              _buildActivityList('all'),
              _buildActivityList('apps'),
              _buildActivityList('web'),
              _buildActivityList('location'),
              _buildActivityList('screen'),
              _buildActivityList('audio'),
            ],
          ),
        ),
      ],
    );
  }
  
  Widget _buildActivityList(String type) {
    // This would normally load data from a service
    final activities = _getDummyActivitiesForType(type);
    
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: activities.length,
      itemBuilder: (context, index) {
        final activity = activities[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(
                      _getIconForType(activity['type'] as String),
                      color: _getColorForType(activity['type'] as String),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      activity['title'] as String,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(activity['details'] as String),
                const SizedBox(height: 4),
                Text(
                  activity['timestamp'] as String,
                  style: TextStyle(
                    color: Colors.grey.shade600,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
  
  IconData _getIconForType(String type) {
    switch (type) {
      case 'web':
        return Icons.language;
      case 'location':
        return Icons.location_on;
      case 'app':
        return Icons.apps;
      case 'screen':
        return Icons.screen_share;
      case 'audio':
        return Icons.mic;
      case 'checkin':
        return Icons.check_circle;
      default:
        return Icons.info;
    }
  }
  
  Color _getColorForType(String type) {
    switch (type) {
      case 'web':
        return Colors.blue;
      case 'location':
        return Colors.orange;
      case 'app':
        return Colors.purple;
      case 'screen':
        return Colors.teal;
      case 'audio':
        return Colors.red;
      case 'checkin':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }
  
  List<Map<String, String>> _getDummyActivitiesForType(String type) {
    // This would typically load from a real data source
    // For demo purposes only - in real app, use provider/bloc to load actual activities
    
    final allActivities = [
      {
        'type': 'web',
        'title': 'Web Browsing',
        'details': 'example.com',
        'timestamp': '3:45 PM, May 7, 2025'
      },
      {
        'type': 'location',
        'title': 'Location Update',
        'details': 'Lat: 37.7749, Lng: -122.4',
        'timestamp': '3:30 PM, May 7, 2025'
      },
      {
        'type': 'app',
        'title': 'App Usage',
        'details': 'TikTok - 15 minutes',
        'timestamp': '3:15 PM, May 7, 2025'
      },
      {
        'type': 'checkin',
        'title': 'Check-In',
        'details': 'I\'m at school',
        'timestamp': '2:30 PM, May 7, 2025'
      },
      {
        'type': 'app',
        'title': 'App Usage',
        'details': 'YouTube - 30 minutes',
        'timestamp': '2:00 PM, May 7, 2025'
      },
      {
        'type': 'location',
        'title': 'Location Update',
        'details': 'School (500m radius)',
        'timestamp': '1:30 PM, May 7, 2025'
      },
      {
        'type': 'screen',
        'title': 'Screen Capture',
        'details': 'Homework app',
        'timestamp': '1:15 PM, May 7, 2025'
      },
      {
        'type': 'audio',
        'title': 'Audio Recording',
        'details': '30 second clip',
        'timestamp': '1:00 PM, May 7, 2025'
      },
    ];
    
    if (type == 'all') {
      return allActivities;
    } else if (type == 'apps') {
      return allActivities.where((a) => a['type'] == 'app').toList();
    } else if (type == 'web') {
      return allActivities.where((a) => a['type'] == 'web').toList();
    } else if (type == 'location') {
      return allActivities.where((a) => a['type'] == 'location').toList();
    } else if (type == 'screen') {
      return allActivities.where((a) => a['type'] == 'screen').toList();
    } else if (type == 'audio') {
      return allActivities.where((a) => a['type'] == 'audio').toList();
    }
    
    return [];
  }
}