# 🛡️ SafeGuard

**SafeGuard** is a complete child monitoring and digital safety system designed to help parents supervise their child's digital habits and location in real-time.

> ✅ Includes: A web-based **Parent Dashboard** and a Flutter-based **Child App**

---

## 🔧 System Overview

### 🧭 Parent Dashboard (`/parent_dashboard`)
A responsive web application where parents can:
- View real-time data from the child's device
- Set restrictions (site block, usage limit, etc.)
- Monitor browsing history, location, screen activity

Built using:
- **Frontend**: React + Next.js
- **Backend**: Node.js + Firebase
- **Authentication**: Firebase Auth
- **Database**: Firebase Realtime Database

### 📱 Child App (`/child_app`)
An Android mobile app that runs in the child’s phone to:
- Monitor location, screen usage, apps, browsing
- Receive and apply parent settings
- Prevent unauthorized uninstallation

Built using:
- **Flutter** for cross-platform UI
- **Native Android integration** (Device Admin, Background services)
- **Firebase** for communication with the dashboard

---

## 🗂️ Folder Structure

SafeGuard/ # 🔵 Main project root
├── parent_dashboard/ # 🧭 Web app (admin dashboard)
│ ├── client/ # React/Next frontend
│ │ ├── src/
│ │ │ ├── components/ # Reusable UI
│ │ │ ├── contexts/ # React contexts
│ │ │ ├── hooks/ # Custom hooks
│ │ │ ├── lib/ # Utility functions
│ │ │ ├── pages/ # Routing pages
│ │ │ └── types/ # Type definitions
│ ├── server/ # Node.js backend
│ │ ├── index.ts # Server entry
│ │ ├── routes.ts # API endpoints
│ │ └── storage.ts # Local/server storage handler
│ └── shared/ # Shared logic
│ └── schema.ts # Shared DB schemas/types
│
├── child_app/ # 📱 Android Flutter App
│ ├── lib/ # Main Flutter code
│ ├── android/ # Native Android integration
│ └── pubspec.yaml # Flutter dependencies
│
├── .gitignore # Ignoring node_modules, secrets, etc.
├── .env.example # Example env variables
└── README.md # Project overview (this file)

yaml
Copy
Edit

---

## 🚀 Key Features

- 📍 **Real-Time Location Tracking** (with history & geofence alert)
- 🌐 **Browsing History & Site Blocking**
- ⏱️ **App Usage Limit & Monitoring**
- 👁️ **Screen Monitoring** (screenshots)
- 🔊 **Audio Monitoring** (planned)
- 📲 **Child Device Controls** (block apps, lock phone, etc.)
- 🔔 **Alerts via Firebase Notifications**
- 📊 **Activity Analytics on Dashboard**

---

## 🛠️ Technologies Used

| Feature           | Tech Used                                    |
|-------------------|-----------------------------------------------|
| Frontend UI       | React, Next.js                               |
| Backend           | Node.js, Express                             |
| Authentication    | Firebase Auth                                |
| Database          | Firebase Realtime DB                         |
| Mobile App        | Flutter, Dart                                |
| Native Control    | Android SDK, DevicePolicyManager, VPN, etc.  |
| Notifications     | Firebase Cloud Messaging (FCM)               |
| Hosting (Local)   | Node.js Localhost                            |

---

## 🔒 Security & Privacy

- Sensitive keys (e.g., `serviceAccountKey.json`, `.env`) are **not committed**
- App runs in **Device Admin mode** to avoid uninstallation
- All data sync is end-to-end via **Firebase**

---

## 📦 Setup Instructions

### 🔹 Parent Dashboard

```bash
cd parent_dashboard
npm install
npm run dev
🔹 Child App (Flutter)
bash
Copy
Edit
cd child_app
flutter pub get
flutter run
Important: Add Firebase config files manually (google-services.json, etc.)

✍️ Author
👤 Saad200724
GitHub: github.com/Saad200724

📌 Note
This is an educational and proof-of-concept project, built to demonstrate practical use of:

Mobile app development

Firebase integration

Real-time data sync

Modern child safety tools

Future versions may include ML-based voice analysis, remote phone lock, and offline caching.

📜 License
MIT License — Free to use for personal and non-commercial purposes.