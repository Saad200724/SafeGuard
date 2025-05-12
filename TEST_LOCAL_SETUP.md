# Testing Your Local Setup

This guide helps you verify that your SafeGuard Parent Dashboard application is working correctly after transferring to VS Code.

## 1. Start the Application

First, ensure your application is running:

```bash
npm run dev
```

## 2. Test API Endpoints

Run these curl commands to test that your backend API is working correctly:

### Get Children Data
```bash
curl -s http://localhost:5000/api/children
```

Expected output: JSON array with children data, e.g.:
```json
[{"name":"Emma","age":12,"deviceId":"device-123","id":1},{"name":"Michael","age":9,"deviceId":"device-456","id":2}]
```

### Test Device Settings API
```bash
curl -s http://localhost:5000/api/device-settings/1
```

### Test Blocked Sites API
```bash
curl -s http://localhost:5000/api/blocked-sites/1
```

## 3. Test Frontend

Open your browser and navigate to:

```
http://localhost:5000
```

You should see the application loading correctly with no console errors.

### Key Pages to Test

Navigate to these pages to verify they're working properly:

- Dashboard: http://localhost:5000/dashboard
- Login: http://localhost:5000/login
- Site Blocker: http://localhost:5000/site-blocker
- Location: http://localhost:5000/location
- Browsing History: http://localhost:5000/browsing-history

## 4. Check Browser Console

Open your browser's developer tools (F12 or right-click > Inspect) and check the console for any errors.

## 5. Verify Environment Variables

If you experience issues with Supabase, ensure your `.env` file contains the correct credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 6. Common Issues & Solutions

### Server won't start
- Ensure port 5000 is not in use by another application
- Check if you've installed all dependencies with `npm install`
- Verify you have the cross-env package and updated scripts in package.json

### API endpoints return 404
- Check that the server started successfully
- Verify the route paths in server/routes.ts

### Frontend shows blank page
- Check browser console for errors
- Ensure the Vite development server is running
- Verify your React components are imported correctly

### Authentication issues
- Verify your Supabase credentials in .env file
- Check network requests in browser developer tools

## 7. Next Steps

Once everything is working correctly, you can start customizing the application:

1. Modify the UI components in client/src/components
2. Add new API endpoints in server/routes.ts
3. Create new pages in client/src/pages

Refer to the README.md and LOCALDEV.md for more detailed development guidance.