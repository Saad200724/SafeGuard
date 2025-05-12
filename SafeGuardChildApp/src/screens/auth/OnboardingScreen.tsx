import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type OnboardingScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Onboarding'>;

const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const { width } = useWindowDimensions();

  // Onboarding content
  const slides = [
    {
      id: 1,
      title: 'Welcome to SafeGuard',
      subtitle: 'Child Safety App',
      description: 'Keeping children safe in the digital world through intelligent monitoring and protection.',
    },
    {
      id: 2,
      title: 'Stay Connected',
      description: 'Keep parents informed with real-time location tracking, activity monitoring, and usage reports.',
    },
    {
      id: 3,
      title: 'Web Protection',
      description: 'Block harmful websites and monitor online activities to ensure a safe browsing experience.',
    },
    {
      id: 4,
      title: 'Time Management',
      description: 'Set screen time limits and manage application usage to promote healthy digital habits.',
    },
    {
      id: 5,
      title: 'Let\'s Get Started',
      description: 'Create an account or sign in to connect this device to your parent\'s SafeGuard dashboard.',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {slides.map((slide) => (
          <View 
            key={slide.id} 
            style={[styles.slide, { width }]}
          >
            <View style={styles.content}>
              <Text style={styles.title}>{slide.title}</Text>
              {slide.subtitle && (
                <Text style={styles.subtitle}>{slide.subtitle}</Text>
              )}
              <Text style={styles.description}>{slide.description}</Text>
            </View>
            
            {slide.id === slides.length && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, styles.registerButton]}
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === 2 && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
      
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4C84FF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#64748B',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#4C84FF',
    width: 16,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#4C84FF',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#4C84FF',
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;