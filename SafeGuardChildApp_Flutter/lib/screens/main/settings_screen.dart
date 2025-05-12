import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:package_info_plus/package_info_plus.dart';

import '../../services/auth_service.dart';
import '../../services/monitoring_service.dart';
import '../../utils/app_theme.dart';
import '../../widgets/custom_button.dart';
import '../auth/login_screen.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({Key? key}) : super(key: key);

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  String _appVersion = '';
  bool _isTimeRestrictionEnabled = true;
  TimeOfDay _startTime = const TimeOfDay(hour: 22, minute: 0);
  TimeOfDay _endTime = const TimeOfDay(hour: 7, minute: 0);
  
  @override
  void initState() {
    super.initState();
    _loadAppVersion();
  }
  
  Future<void> _loadAppVersion() async {
    try {
      final packageInfo = await PackageInfo.fromPlatform();
      if (mounted) {
        setState(() {
          _appVersion = packageInfo.version;
        });
      }
    } catch (e) {
      debugPrint('Error loading app version: $e');
    }
  }
  
  Future<void> _logout() async {
    final authService = Provider.of<AuthService>(context, listen: false);
    
    await authService.signOut();
    
    if (mounted) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const LoginScreen()),
      );
    }
  }
  
  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);
    final monitoringService = Provider.of<MonitoringService>(context);
    
    final user = authService.currentUser;
    final email = user?.email ?? 'No email';
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Account card
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Account',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // User avatar and info
                  Row(
                    children: [
                      CircleAvatar(
                        backgroundColor: AppTheme.primaryColor.withOpacity(0.1),
                        radius: 30,
                        child: const Icon(
                          Icons.person,
                          color: AppTheme.primaryColor,
                          size: 30,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              email,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            const Text(
                              'Child Account',
                              style: TextStyle(
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Sign out button
                  CustomButton(
                    text: 'Sign Out',
                    isOutlined: true,
                    onPressed: _logout,
                  ),
                ],
              ),
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Time restrictions card
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Time Restrictions',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Enable time restrictions switch
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Enable Time',
                            style: TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 16,
                            ),
                          ),
                          Text(
                            'Restrictions',
                            style: TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 16,
                            ),
                          ),
                        ],
                      ),
                      Switch(
                        value: _isTimeRestrictionEnabled,
                        onChanged: (value) {
                          setState(() {
                            _isTimeRestrictionEnabled = value;
                          });
                        },
                        activeColor: AppTheme.primaryColor,
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Time restriction settings
                  if (_isTimeRestrictionEnabled) ...[
                    const Text(
                      'Restricted Hours:',
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _buildTimeButton('From', _startTime, (newTime) {
                          setState(() {
                            _startTime = newTime;
                          });
                        }),
                        const Text('to'),
                        _buildTimeButton('To', _endTime, (newTime) {
                          setState(() {
                            _endTime = newTime;
                          });
                        }),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.amber.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: Colors.amber.withOpacity(0.3),
                        ),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.info_outline,
                            color: Colors.amber.shade800,
                            size: 20,
                          ),
                          const SizedBox(width: 8),
                          const Expanded(
                            child: Text(
                              'During these hours, device usage will be limited.',
                              style: TextStyle(
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Device information card
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Device Information',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Device info items
                  _buildInfoItem('Device Name', 'Pixel 6'),
                  const SizedBox(height: 8),
                  _buildInfoItem('Model', 'Pixel 6'),
                  const SizedBox(height: 8),
                  _buildInfoItem('OS Version', 'Android 13'),
                  const SizedBox(height: 8),
                  _buildInfoItem('App Version', _appVersion.isEmpty ? '1.0.0' : _appVersion),
                ],
              ),
            ),
          ),
          
          const SizedBox(height: 24),
          
          // Legal information
          const Text(
            '© 2025 SafeGuard Child Safety App. All rights reserved.',
            style: TextStyle(
              color: Colors.grey,
              fontSize: 12,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TextButton(
                onPressed: () {
                  // Show terms of service
                },
                child: const Text(
                  'Terms of Service',
                  style: TextStyle(
                    fontSize: 12,
                  ),
                ),
              ),
              const Text('•', style: TextStyle(color: Colors.grey)),
              TextButton(
                onPressed: () {
                  // Show privacy policy
                },
                child: const Text(
                  'Privacy Policy',
                  style: TextStyle(
                    fontSize: 12,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
  
  Widget _buildInfoItem(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: Colors.grey,
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
  
  Widget _buildTimeButton(
    String label,
    TimeOfDay time,
    Function(TimeOfDay) onTimeSelected,
  ) {
    return ElevatedButton(
      onPressed: () async {
        final newTime = await showTimePicker(
          context: context,
          initialTime: time,
        );
        
        if (newTime != null) {
          onTimeSelected(newTime);
        }
      },
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.grey.shade200,
        foregroundColor: Colors.black,
      ),
      child: Text(
        '${time.hour}:${time.minute.toString().padLeft(2, '0')}',
      ),
    );
  }
}