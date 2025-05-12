#!/bin/bash

# This script is run by Netlify during the build process

echo "Running build script for Netlify deployment..."

# Make sure dependencies are installed
npm install

# Build the frontend
echo "Building the frontend..."
npm run build

# Copy necessary files for serverless functions
echo "Setting up serverless functions..."

# Ensure necessary dependencies for functions
if [ ! -f netlify/functions/package.json ]; then
  echo "Creating package.json for functions..."
  echo '{
  "name": "safeguard-serverless-functions",
  "version": "1.0.0",
  "dependencies": {
    "@supabase/supabase-js": "^2.0.0"
  }
}' > netlify/functions/package.json
fi

echo "Build script completed successfully!"
