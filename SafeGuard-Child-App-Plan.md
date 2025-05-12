# SafeGuard Child App - Planning Document

## Overview
The SafeGuard Child App will be an Android application installed on children's devices that works in conjunction with the SafeGuard Parent Dashboard. The app will run in the background and monitor device usage, location, and other activities, sending data to the parent dashboard.

## Features to Implement

### 1. Core Monitoring Features
- **Screen Time Tracking**: Monitor app usage and total screen time
- **Location Tracking**: Report real-time location to parents
- **Browsing History**: Track websites visited
- **App Usage**: Monitor which apps are being used and for how long
- **Screen Capture**: Periodic screenshots for parent review
- **Audio Monitoring**: Ambient sound detection capability

### 2. Restriction Features
- **Website Blocking**: Block specific websites as configured by parents
- **App Blocking**: Restrict access to specific applications
- **Screen Time Limits**: Enforce usage time limits set by parents
- **Remote Controls**: Allow parents to remotely lock device

### 3. Communication
- **Check-in System**: Allow children to check in with parents
- **SOS Feature**: Emergency button to alert parents
- **Notification System**: Alerts about restrictions or time limits

### 4. Technical Requirements
- **Background Service**: Run continuously in the background
- **Low Power Usage**: Optimize for battery performance
- **Secure Communication**: End-to-end encryption for data transfer
- **Persistence**: Prevent easy uninstallation
- **Device Admin**: Request device administration privileges

## Technology Stack

### Mobile App
- **Framework**: React Native (allows for potential iOS version later)
- **Database**: Local storage with SQLite
- **Authentication**: Supabase/Firebase (same as parent dashboard)
- **Location Services**: React Native Geolocation
- **Background Processing**: React Native Background Tasks
- **Secure Storage**: React Native Keychain

### Backend Integration
- **API**: RESTful API to communicate with parent dashboard backend
- **Real-time Updates**: WebSockets for immediate data transfer
- **Data Sync**: Regular syncing when online, queue when offline

## Development Phases

### Phase 1: Basic Setup and Authentication
- Project setup with React Native
- Integration with existing Supabase setup
- User authentication (child device registration)
- Basic UI for child app

### Phase 2: Core Monitoring Implementation
- Location tracking service
- Screen time and app usage monitoring
- Browsing history tracking
- Background service implementation

### Phase 3: Restriction Features
- Website blocking implementation
- App blocking capability
- Time limit enforcement
- Remote control API

### Phase 4: Finalization
- Performance optimization
- Security hardening
- Battery usage optimization
- Final testing and debugging

## Design Considerations
- Simple, child-friendly UI for visible components
- Minimal battery impact
- Clear privacy indicators when monitoring is active
- Unobtrusive operation

## Permissions Required
- Location (Fine & Background)
- Usage Statistics Access
- Overlay Permission
- Accessibility Services
- Device Administrator
- Notification Access
- Internet Access
- Storage Access

## Security & Privacy Considerations
- All data transmitted should be encrypted
- Local data should be securely stored
- Clear privacy policy for app store compliance
- COPPA compliance requirements
- Consider regional restrictions and legal requirements