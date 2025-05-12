import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../services/auth_service.dart';
import '../../services/monitoring_service.dart';
import '../../utils/app_theme.dart';
import '../../widgets/custom_button.dart';
import '../auth/login_screen.dart';
import 'activity_screen.dart';
import 'check_in_screen.dart';
import 'settings_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  final List<Widget> _screens = [
    const _HomeContent(),
    const ActivityScreen(),
    const CheckInScreen(),
    const SettingsScreen(),
  ];
  
  final List<String> _titles = [
    'Home',
    'Activities',
    'Check-in',
    'Settings',
  ];
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_titles[_currentIndex]),
        actions: [
          // Emergency button
          IconButton(
            icon: const Icon(
              Icons.warning_amber_rounded,
              color: Colors.red,
            ),
            onPressed: () {
              _showEmergencyDialog();
            },
          ),
        ],
      ),
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.history_outlined),
            activeIcon: Icon(Icons.history),
            label: 'Activities',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.check_circle_outline),
            activeIcon: Icon(Icons.check_circle),
            label: 'Check-in',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings_outlined),
            activeIcon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
  
  void _showEmergencyDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Emergency Alert'),
        content: const Text(
          'Do you want to send an emergency alert to your parent or guardian?',
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
            },
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
            ),
            onPressed: () {
              // Send emergency alert
              Navigator.pop(context);
              _sendEmergencyAlert();
            },
            child: const Text('Send Alert'),
          ),
        ],
      ),
    );
  }
  
  void _sendEmergencyAlert() {
    // Send emergency alert logic would go here
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Emergency alert sent to your parent/guardian'),
        backgroundColor: Colors.red,
        duration: Duration(seconds: 3),
      ),
    );
  }
}

class _HomeContent extends StatefulWidget {
  const _HomeContent({Key? key}) : super(key: key);

  @override
  State<_HomeContent> createState() => _HomeContentState();
}

class _HomeContentState extends State<_HomeContent> {
  @override
  Widget build(BuildContext context) {
    final monitoringService = Provider.of<MonitoringService>(context);
    final authService = Provider.of<AuthService>(context);
    
    final user = authService.currentUser;
    final userName = user?.userMetadata?['full_name'] as String? ?? 'Child';
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Welcome card
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Welcome,',
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              color: Colors.grey,
                            ),
                          ),
                          Text(
                            userName,
                            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const Icon(
                        Icons.phone_android,
                        size: 28,
                        color: AppTheme.primaryColor,
                      ),
                    ],
                  ),
                  const Divider(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Protection Status',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      Switch(
                        value: monitoringService.isMonitoringActive,
                        onChanged: (value) {
                          monitoringService.setMonitoringActive(value);
                        },
                        activeColor: AppTheme.primaryColor,
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Container(
                        width: 12,
                        height: 12,
                        decoration: BoxDecoration(
                          color: monitoringService.isMonitoringActive
                              ? Colors.green
                              : Colors.red,
                          borderRadius: BorderRadius.circular(6),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        monitoringService.isMonitoringActive
                            ? 'Protected'
                            : 'Not Protected',
                        style: TextStyle(
                          color: monitoringService.isMonitoringActive
                              ? Colors.green
                              : Colors.red,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Monitoring services
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Monitoring Services',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Location tracking
                  _buildMonitoringItem(
                    icon: Icons.location_on_outlined,
                    title: 'Location Tracking',
                    isEnabled: monitoringService.isLocationTrackingEnabled,
                    onChanged: monitoringService.setLocationTrackingEnabled,
                  ),
                  
                  const Divider(height: 24),
                  
                  // App usage monitoring
                  _buildMonitoringItem(
                    icon: Icons.timer_outlined,
                    title: 'App Usage Monitoring',
                    isEnabled: monitoringService.isAppUsageMonitoringEnabled,
                    onChanged: monitoringService.setAppUsageMonitoringEnabled,
                  ),
                  
                  const Divider(height: 24),
                  
                  // Web history monitoring
                  _buildMonitoringItem(
                    icon: Icons.web_outlined,
                    title: 'Web History Monitoring',
                    isEnabled: monitoringService.isWebHistoryMonitoringEnabled,
                    onChanged: monitoringService.setWebHistoryMonitoringEnabled,
                  ),
                  
                  const Divider(height: 24),
                  
                  // Screen monitoring
                  _buildMonitoringItem(
                    icon: Icons.mobile_screen_share_outlined,
                    title: 'Screen Monitoring',
                    isEnabled: monitoringService.isScreenMonitoringEnabled,
                    onChanged: monitoringService.setScreenMonitoringEnabled,
                  ),
                  
                  const Divider(height: 24),
                  
                  // Audio monitoring
                  _buildMonitoringItem(
                    icon: Icons.mic_outlined,
                    title: 'Audio Monitoring',
                    isEnabled: monitoringService.isAudioMonitoringEnabled,
                    onChanged: monitoringService.setAudioMonitoringEnabled,
                  ),
                ],
              ),
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Emergency contact card
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(
                        Icons.emergency_outlined,
                        color: Colors.red,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Emergency Contact',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  CustomButton(
                    text: 'Contact Parent',
                    backgroundColor: Colors.red,
                    icon: Icons.call,
                    onPressed: () {
                      _showEmergencyContact();
                    },
                  ),
                ],
              ),
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Logout button
          CustomButton(
            text: 'Logout',
            isOutlined: true,
            onPressed: () async {
              final authService = Provider.of<AuthService>(context, listen: false);
              await authService.signOut();
              
              if (mounted) {
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                );
              }
            },
          ),
        ],
      ),
    );
  }
  
  Widget _buildMonitoringItem({
    required IconData icon,
    required String title,
    required bool isEnabled,
    required Function(bool) onChanged,
  }) {
    return Row(
      children: [
        Icon(
          icon,
          color: isEnabled ? AppTheme.primaryColor : Colors.grey,
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            title,
            style: TextStyle(
              fontSize: 16,
              fontWeight: isEnabled ? FontWeight.w600 : FontWeight.normal,
              color: isEnabled ? AppTheme.primaryColor : Colors.grey.shade700,
            ),
          ),
        ),
        Switch(
          value: isEnabled,
          onChanged: onChanged,
          activeColor: AppTheme.primaryColor,
        ),
      ],
    );
  }
  
  void _showEmergencyContact() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Emergency Contact'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const ListTile(
              leading: CircleAvatar(
                child: Icon(Icons.person),
              ),
              title: Text('Parent Name'),
              subtitle: Text('+1 123-456-7890'),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildContactButton(
                  icon: Icons.call,
                  label: 'Call',
                  onPressed: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Calling parent...'),
                      ),
                    );
                  },
                ),
                _buildContactButton(
                  icon: Icons.message,
                  label: 'Message',
                  onPressed: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Messaging parent...'),
                      ),
                    );
                  },
                ),
                _buildContactButton(
                  icon: Icons.warning_amber_rounded,
                  label: 'SOS',
                  color: Colors.red,
                  onPressed: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Emergency alert sent'),
                        backgroundColor: Colors.red,
                      ),
                    );
                  },
                ),
              ],
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
            },
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }
  
  Widget _buildContactButton({
    required IconData icon,
    required String label,
    required VoidCallback onPressed,
    Color? color,
  }) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        IconButton(
          icon: Icon(icon),
          onPressed: onPressed,
          color: color ?? AppTheme.primaryColor,
          style: IconButton.styleFrom(
            backgroundColor: (color ?? AppTheme.primaryColor).withOpacity(0.1),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            color: color ?? AppTheme.primaryColor,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}