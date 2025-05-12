#!/bin/bash

# Color codes for better output
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
BLUE="\033[0;34m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${BLUE}=== SafeGuard Parent Dashboard - Netlify Deployment Helper ===${NC}\n"

# Check if nodejs is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed. Please install npm first.${NC}"
    exit 1
fi

# Step 1: Install the archiver package if not already installed
echo -e "${YELLOW}Step 1: Checking if archiver package is installed...${NC}"

if ! npm list -g archiver &> /dev/null; then
    echo "Installing archiver package..."
    npm install --save-dev archiver
fi

# Step 2: Run the deployment script
echo -e "\n${YELLOW}Step 2: Creating deployment package...${NC}"
node --experimental-modules scripts/deploy-to-netlify.js

# Step 3: Provide instructions
echo -e "\n${GREEN}=== Next steps for Netlify deployment ===${NC}"
echo -e "1. Log in to your Netlify account at ${BLUE}https://app.netlify.com/${NC}"
echo -e "2. Click on 'Add new site' > 'Deploy manually'"
echo -e "3. Drag and drop the ${BLUE}SafeGuard-ParentDashboard-Netlify.zip${NC} file from this directory"
echo -e "4. Once deployed, go to 'Site settings' > 'Build & deploy' > 'Environment'"
echo -e "5. Add the following environment variables:"
echo -e "   - ${YELLOW}VITE_SUPABASE_URL${NC} = your Supabase project URL"
echo -e "   - ${YELLOW}VITE_SUPABASE_ANON_KEY${NC} = your Supabase anonymous key"
echo -e "6. In your Supabase dashboard, go to Authentication > URL Configuration"
echo -e "7. Add your Netlify domain (e.g., ${BLUE}https://your-site-name.netlify.app${NC}) to the allowed redirect URLs"
echo -e "8. Add ${BLUE}https://your-site-name.netlify.app/auth/callback${NC} to the redirect URLs"

echo -e "\n${GREEN}✅ Deployment preparation complete!${NC}"
echo -e "For more detailed instructions, refer to the ${BLUE}NETLIFY_DEPLOYMENT.md${NC} file."
