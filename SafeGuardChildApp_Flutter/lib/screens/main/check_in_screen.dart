import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../services/auth_service.dart';
import '../../utils/app_theme.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_text_field.dart';

class CheckInScreen extends StatefulWidget {
  const CheckInScreen({Key? key}) : super(key: key);

  @override
  State<CheckInScreen> createState() => _CheckInScreenState();
}

class _CheckInScreenState extends State<CheckInScreen> {
  final _customMessageController = TextEditingController();
  bool _includeLocation = true;
  
  @override
  void dispose() {
    _customMessageController.dispose();
    super.dispose();
  }
  
  Future<void> _sendCheckIn(String message) async {
    // In a real app, this would send the check-in to the backend
    
    // Show success message
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Check-in sent successfully'),
        backgroundColor: Colors.green,
      ),
    );
    
    // Clear custom message if it's a preset message
    if (_customMessageController.text.isNotEmpty && 
        message != _customMessageController.text) {
      _customMessageController.clear();
    }
  }
  
  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Check-in icon
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(
                  Icons.check_circle_outline_rounded,
                  color: AppTheme.primaryColor,
                  size: 32,
                ),
              ),
              const SizedBox(width: 16),
              const Text(
                'Check In',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          
          const SizedBox(height: 16),
          
          // Description
          const Text(
            'Let your parents know you\'re safe by sending a quick check-in message.',
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey,
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Last check-in
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.green.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: Colors.green.withOpacity(0.3),
              ),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.access_time,
                  color: Colors.green,
                  size: 20,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Last Check-In: ',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const Text('2:30 PM'),
              ],
            ),
          ),
          
          const SizedBox(height: 24),
          
          // Quick check-in messages
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Quick Check-In Messages',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Row 1 of quick messages
                  Row(
                    children: [
                      Expanded(
                        child: _buildQuickCheckInCard(
                          'I\'m at school',
                          Icons.school_outlined,
                          Colors.blue,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _buildQuickCheckInCard(
                          'I\'m at home',
                          Icons.home_outlined,
                          Colors.green,
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 8),
                  
                  // Row 2 of quick messages
                  Row(
                    children: [
                      Expanded(
                        child: _buildQuickCheckInCard(
                          'I\'m at a friend\'s house',
                          Icons.people_outlined,
                          Colors.purple,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _buildQuickCheckInCard(
                          'On my way home',
                          Icons.directions_walk_outlined,
                          Colors.orange,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          
          const SizedBox(height: 24),
          
          // Custom message
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Custom Message',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Message input
                  CustomTextField(
                    controller: _customMessageController,
                    label: 'Enter your message',
                    hint: 'Example: I\'m staying late at the library',
                    maxLines: 3,
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Include location checkbox
                  Row(
                    children: [
                      Checkbox(
                        value: _includeLocation,
                        onChanged: (value) {
                          setState(() {
                            _includeLocation = value ?? true;
                          });
                        },
                        activeColor: AppTheme.primaryColor,
                      ),
                      const Text('Include my location'),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.green.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.location_on,
                              color: Colors.green,
                              size: 14,
                            ),
                            SizedBox(width: 4),
                            Text(
                              'Location available',
                              style: TextStyle(
                                color: Colors.green,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Send button
                  CustomButton(
                    text: 'Send Check-In',
                    onPressed: () {
                      if (_customMessageController.text.isNotEmpty) {
                        _sendCheckIn(_customMessageController.text);
                      } else {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Please enter a message'),
                            backgroundColor: Colors.red,
                          ),
                        );
                      }
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildQuickCheckInCard(String message, IconData icon, Color color) {
    return GestureDetector(
      onTap: () => _sendCheckIn(message),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: color.withOpacity(0.3),
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              color: color,
              size: 24,
            ),
            const SizedBox(height: 8),
            Text(
              message,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: color.withOpacity(0.8),
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}