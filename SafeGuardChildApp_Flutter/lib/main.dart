import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'screens/splash_screen.dart';
import 'utils/app_theme.dart';
import 'utils/constants.dart';
import 'services/auth_service.dart';
import 'services/monitoring_service.dart';
import 'services/permission_service.dart';
import 'services/storage_service.dart';

Future<void> main() async {
  // Ensure Flutter is initialized
  WidgetsFlutterBinding.ensureInitialized();
  
  // Set preferred orientations
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  
  // Initialize Supabase
  await Supabase.initialize(
    url: Constants.supabaseUrl,
    anonKey: Constants.supabaseAnonKey,
    debug: false,
  );
  
  // Initialize shared preferences
  final prefs = await SharedPreferences.getInstance();
  
  // Start app
  runApp(MyApp(prefs: prefs));
}

class MyApp extends StatelessWidget {
  final SharedPreferences prefs;
  
  const MyApp({Key? key, required this.prefs}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => AuthService(supabase: Supabase.instance.client),
        ),
        ChangeNotifierProvider(
          create: (_) => PermissionService(),
        ),
        ChangeNotifierProvider(
          create: (_) => StorageService(prefs: prefs),
        ),
        ChangeNotifierProvider(
          create: (context) => MonitoringService(
            authService: Provider.of<AuthService>(context, listen: false),
            permissionService: Provider.of<PermissionService>(context, listen: false),
            storageService: Provider.of<StorageService>(context, listen: false),
          ),
        ),
      ],
      child: Consumer<AuthService>(
        builder: (context, authService, _) {
          return MaterialApp(
            title: 'SafeGuard Child',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: ThemeMode.system,
            home: const SplashScreen(),
          );
        },
      ),
    );
  }
}