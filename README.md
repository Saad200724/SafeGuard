# SafeGuard - Parental Monitoring Dashboard

![SafeGuard Logo](client/public/logo.png)

## Project Overview

SafeGuard is a comprehensive parent monitoring application designed to provide insights into children's online activities while maintaining a positive and engaging user experience. The application allows parents to monitor and manage their children's digital activities across devices, ensuring a safe online environment.

## Key Features

### 📱 Dashboard
A comprehensive dashboard that gives parents a quick overview of their child's activities, device status, and important alerts.

### 📍 Location Tracking
Real-time location monitoring with history and geofencing capabilities to ensure children are where they're supposed to be.

### 🌐 Browsing History
Detailed browsing history with categorization of websites visited and time spent on different types of content.

### 🚫 Site Blocking
Advanced content filtering and website blocking to prevent access to inappropriate websites and content.

### 👁️ Screen Monitoring
Periodic screenshots and activity monitoring to ensure children are engaging with appropriate content.

### 🎧 Audio Monitoring
Monitor audio usage and detect concerning conversations or content through audio analysis.

### ⚙️ Customizable Controls
Parents can customize settings per child, adjusting restrictions based on age, device, and time of day.

## Technology Stack

### Frontend
- **React**: For building the user interface
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For modern, responsive styling
- **Shadcn UI**: For accessible, reusable components
- **Lucide Icons**: For clear, consistent iconography
- **React Query**: For efficient data fetching and state management

### Backend
- **Node.js**: For the server environment
- **Express**: For API routing and middleware
- **PostgreSQL**: For secure, persistent data storage
- **Firebase Realtime Database**: For database interactions
- **Firebase Auth**: For secure user authentication

## Security and Privacy

SafeGuard is built with security and privacy as core principles:

- End-to-end encryption for all sensitive data
- Strict authentication and authorization controls
- Clear privacy policies and data usage transparency
- Compliant with child data protection regulations
- Regular security audits and updates

## Getting Started

### Local Development
See [LOCALDEV.md](LOCALDEV.md) for detailed instructions on setting up the project locally for development or demonstration purposes.

### Netlify Deployment
For competition presentations or public access, you can deploy this application to Netlify.
See [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md) for detailed instructions on deploying the application to Netlify.

## Project Structure

```
├── client/               # Frontend application
│   ├── src/              # Source files
│   │   ├── components/   # Reusable UI components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Page components
│   │   └── types/        # TypeScript types
├── server/               # Backend server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data storage
└── shared/               # Shared code
    └── schema.ts         # Database schema
```

## Future Enhancements

- Mobile application for child devices with monitoring agents
- AI-powered content analysis for more accurate filtering
- Expanded reporting and analytics on digital habits
- Integration with popular educational platforms
- Screen time scheduling and automated enforcement

## Acknowledgements

Developed as a solution for digital parenting challenges in the modern world. Special thanks to all contributors and testers who helped refine the application.