import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class AuthService with ChangeNotifier {
  final SupabaseClient supabase;
  
  User? _currentUser;
  bool _isLoading = false;
  String? _errorMessage;
  
  // Getters
  User? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _currentUser != null;
  String? get errorMessage => _errorMessage;
  
  // Constructor
  AuthService({required this.supabase}) {
    _init();
  }
  
  // Initialize the service
  Future<void> _init() async {
    _setLoading(true);
    
    try {
      // Check for existing session
      final session = supabase.auth.currentSession;
      
      if (session != null) {
        _currentUser = session.user;
        await refreshProfile();
      }
    } catch (e) {
      _setError('Failed to initialize auth: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }
  
  // Refresh user profile
  Future<void> refreshProfile() async {
    if (_currentUser == null) return;
    
    _setLoading(true);
    _clearError();
    
    try {
      // Get user profile from the database
      final response = await supabase
          .from('profiles')
          .select()
          .eq('id', _currentUser!.id)
          .single();
      
      // You would typically update a user profile model here
      // For now, we'll just get the user's metadata
      final user = supabase.auth.currentUser;
      if (user != null) {
        _currentUser = user;
      }
      
      notifyListeners();
    } catch (e) {
      _setError('Failed to refresh profile: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }
  
  // Sign up with email and password
  Future<User?> signUp({
    required String email, 
    required String password,
    Map<String, dynamic>? userData,
  }) async {
    _setLoading(true);
    _clearError();
    
    try {
      final response = await supabase.auth.signUp(
        email: email,
        password: password,
        data: userData,
      );
      
      _currentUser = response.user;
      
      if (_currentUser != null) {
        // Create profile record in the database
        await supabase.from('profiles').upsert({
          'id': _currentUser!.id,
          'email': email,
          'updated_at': DateTime.now().toIso8601String(),
          ...userData ?? {},
        });
      }
      
      notifyListeners();
      return _currentUser;
    } catch (e) {
      _setError('Failed to sign up: ${e.toString()}');
      return null;
    } finally {
      _setLoading(false);
    }
  }
  
  // Sign in with email and password
  Future<User?> signIn({required String email, required String password}) async {
    _setLoading(true);
    _clearError();
    
    try {
      final response = await supabase.auth.signInWithPassword(
        email: email,
        password: password,
      );
      
      _currentUser = response.user;
      
      if (_currentUser != null) {
        await refreshProfile();
      }
      
      notifyListeners();
      return _currentUser;
    } catch (e) {
      _setError('Failed to sign in: ${e.toString()}');
      return null;
    } finally {
      _setLoading(false);
    }
  }
  
  // Sign out
  Future<void> signOut() async {
    _setLoading(true);
    _clearError();
    
    try {
      await supabase.auth.signOut();
      _currentUser = null;
      notifyListeners();
    } catch (e) {
      _setError('Failed to sign out: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }
  
  // Reset password
  Future<bool> resetPassword(String email) async {
    _setLoading(true);
    _clearError();
    
    try {
      await supabase.auth.resetPasswordForEmail(email);
      return true;
    } catch (e) {
      _setError('Failed to reset password: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  // Update user password
  Future<bool> updatePassword(String newPassword) async {
    _setLoading(true);
    _clearError();
    
    try {
      await supabase.auth.updateUser(UserAttributes(
        password: newPassword,
      ));
      
      return true;
    } catch (e) {
      _setError('Failed to update password: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  // Set loading state
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
  
  // Set error message
  void _setError(String message) {
    _errorMessage = message;
    debugPrint('AuthService Error: $_errorMessage');
    notifyListeners();
  }
  
  // Clear error message
  void _clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}