# Running SafeGuard Parent Dashboard in VS Code

This guide will help you set up and run the SafeGuard Parent Dashboard application locally in Visual Studio Code.

## Prerequisites

Before you begin, ensure you have the following installed on your computer:

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/) (optional, for version control)
- [PostgreSQL](https://www.postgresql.org/) (required for database functionality)

## Setup Instructions

### 1. Clone or Download the Project

You can download the project files or clone the repository if it's hosted on GitHub:

```bash
git clone [repository-url]
cd safeguard-parent-dashboard
```

Alternatively, download and extract the ZIP file from Replit, then navigate to the folder.

### 2. Install Dependencies

Open the project folder in VS Code and open a terminal (Terminal > New Terminal). Run:

```bash
npm install
```

This will install all the required dependencies specified in the package.json file.

### 3. Set Up Environment Variables

Create a `.env` file in the root directory of your project with the following content:

```env
DATABASE_URL=postgresql://[username]:[password]@localhost:5432/safeguard
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Replace `[username]` and `[password]` with your PostgreSQL credentials.

### 4. Set Up the Database

Create a PostgreSQL database named 'safeguard':

```bash
psql -U postgres
CREATE DATABASE safeguard;
\q
```

Then apply the database schema by running:

```bash
npm run db:push
```

### 5. Run the Development Server

Start the development server with:

```bash
npm run dev
```

This will start both the backend server and the Vite frontend development server.

### 6. Access the Application

Open your browser and navigate to:

```
http://localhost:5000
```

You should now see the SafeGuard Parent Dashboard application running locally.

## Project Structure Overview

- `/client`: Contains the frontend React application
  - `/src`: Source files for the frontend
    - `/components`: Reusable UI components
    - `/contexts`: React context providers (e.g., auth context)
    - `/hooks`: Custom React hooks
    - `/lib`: Utility functions and configuration
    - `/pages`: Page components for each route
    - `/types`: TypeScript type definitions
- `/server`: Contains the backend Express server
  - `index.ts`: Main server file
  - `routes.ts`: API route definitions
  - `storage.ts`: Data storage and database interactions
  - `db.ts`: Database connection setup
- `/shared`: Contains files shared between client and server
  - `schema.ts`: Database schema definitions using Drizzle ORM

## Recommended VS Code Extensions

For the best development experience, we recommend installing these VS Code extensions:

- ESLint: For JavaScript/TypeScript linting
- Prettier: For code formatting
- TypeScript Hero: For organizing imports
- Tailwind CSS IntelliSense: For CSS class autocompletion
- DotENV: For .env file syntax highlighting

## Authentication

The application uses Firebase for authentication. Make sure to:

1. Have a Firebase account with a project set up
2. Add your Firebase project ID, app ID, and API key to the .env file
3. Enable email/password and Google authentication in your Firebase dashboard
4. Set up authorized domains in your Firebase project for your local and deployed URLs

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues, ensure:

- PostgreSQL is running on your machine
- Your DATABASE_URL environment variable is correct
- You've created the 'safeguard' database

### PORT Already in Use

If you get an error that the port is already in use, you can either:

- Close the application using that port
- Modify the port in the server code (typically in server/index.ts)

## Deployment

For a competition or presentation, you may want to deploy your application to a hosting service.
Consider services like:

- [Vercel](https://vercel.com/): For the frontend
- [Railway](https://railway.app/): For both frontend and backend hosting  
- [Firebase Hosting](https://firebase.google.com/docs/hosting): For frontend hosting and authentication
- [Netlify](https://www.netlify.com/): For frontend with serverless functions

## For Further Assistance

If you need additional help or have questions, please refer to:

- The documentation within each source file
- The project README file
- Create an issue in the repository (if it's on GitHub)
