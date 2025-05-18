/**
 * Script to create a ZIP file of the project for local development
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the scripts directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname))){
  fs.mkdirSync(path.join(__dirname), { recursive: true });
}

console.log('Creating ZIP file of the SafeGuard project...');

try {
  // Create a temp directory to hold files to zip
  const tempDir = path.join(__dirname, 'temp');
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  // Copy files to temp directory, excluding node_modules and other files
  console.log('Copying project files...');
  execSync(`cp -r \
    client \
    server \
    shared \
    package.json \
    package-lock.json \
    tsconfig.json \
    vite.config.ts \
    tailwind.config.ts \
    postcss.config.js \
    components.json \
    drizzle.config.ts \
    README.md \
    LOCALDEV.md \
    ${tempDir}`);

  // Create a sample .env file with placeholders
  console.log('Creating sample .env file...');
  const envContent = `# Database connection string
DATABASE_URL=postgresql://postgres:password@localhost:5432/safeguard

# Supabase credentials
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key`;
  
  fs.writeFileSync(path.join(tempDir, '.env.example'), envContent);

  // Create the TAR file
  console.log('Creating TAR archive...');
  const outputFileName = 'SafeGuard-ParentDashboard.tar.gz';
  execSync(`cd ${tempDir} && tar -czvf ${path.join(__dirname, '..', outputFileName)} .`);

  // Clean up temp directory
  fs.rmSync(tempDir, { recursive: true, force: true });

  console.log(`\nTAR archive created successfully: ${outputFileName}`);
  console.log('You can now download this file and extract it to run locally in VS Code.');
  console.log('Follow the instructions in LOCALDEV.md to set up and run the project.');

} catch (error) {
  console.error('Error creating TAR archive:', error);
}
