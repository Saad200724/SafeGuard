# Deploying SafeGuard Parent Dashboard to Netlify

This guide walks through deploying the SafeGuard Parent Dashboard application to Netlify, which will solve issues with email verification links and provide a publicly accessible URL for demonstration purposes.

## Prerequisites

1. A Netlify account (sign up at [netlify.com](https://netlify.com) if you don't have one)
2. Your Supabase project with authentication enabled
3. Your SafeGuard Parent Dashboard codebase ready for deployment

## Deployment Steps

### 1. Prepare Your Repository

Make sure your application code is in a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Connect to Netlify

1. Log in to your Netlify account
2. Click "New site from Git"
3. Choose your Git provider (GitHub, GitLab, etc.)
4. Select your repository

### 3. Configure Build Settings

Set up the build configuration in the Netlify dashboard:

- **Build command**: `./netlify/build.sh`
- **Publish directory**: `dist`

### 4. Environment Variables

Add the following environment variables in Netlify's dashboard under "Site Settings" > "Environment variables":

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase project anonymous key

### 5. Configure Supabase Auth Redirects

In your Supabase dashboard:

1. Go to "Authentication" > "URL Configuration"
2. Add your Netlify domain as an authorized site URL
3. Add redirect URLs in the format: `https://your-netlify-domain.netlify.app/auth/callback`

### 6. Deploy Your Site

1. Click "Deploy site" in Netlify
2. Wait for the build and deployment to complete
3. Once deployed, Netlify will provide a URL for your site (e.g., `https://safeguard-parent-dashboard.netlify.app`)

## Key Files for Netlify Deployment

These files in your project are specifically set up for Netlify deployment:

1. `netlify.toml` - Configuration for Netlify deployment
2. `netlify/build.sh` - Custom build script for deployment
3. `netlify/functions/api.js` - Serverless function to handle API requests

## Troubleshooting

### Auth Redirect Issues

If authentication redirects aren't working:

1. Double-check the redirect URLs in Supabase dashboard
2. Ensure environment variables are correctly set in Netlify
3. Check the browser console for any errors

### API Endpoint Issues

If API endpoints aren't working:

1. Verify the Netlify function is properly configured
2. Check Netlify function logs in the Netlify dashboard
3. Make sure all required environment variables are set

## Using for Your Tech Fest Presentation

The Netlify deployment provides several advantages for your tech fest presentation:

1. **Public URL**: Share your application with judges or attendees without setup
2. **Working Auth**: Email verification links will work correctly
3. **Professional Appearance**: Demonstrates deployment knowledge and provides a polished presentation

When presenting, make sure to highlight:

1. The complete authentication flow (signup, login, password reset)
2. How the application handles real-time data updates
3. The responsive design that works on all devices
4. The security features implemented

Good luck with your presentation!
