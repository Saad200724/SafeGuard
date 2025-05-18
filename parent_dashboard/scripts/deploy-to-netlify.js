/**
 * Script to prepare the project for Netlify deployment
 */
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a zip file of the project for Netlify deployment
const OUTPUT_ZIP = path.join(__dirname, '..', 'SafeGuard-ParentDashboard-Netlify.zip');
const INCLUDE_PATHS = [
  'client',
  'netlify',
  'server',
  'shared',
  '.env.example',
  'netlify.toml',
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  'tailwind.config.ts',
  'postcss.config.js',
  'drizzle.config.ts',
  'components.json',
];

// Function to create a zip file
async function createZipArchive() {
  const output = fs.createWriteStream(OUTPUT_ZIP);
  const archive = archiver('zip', { zlib: { level: 9 } }); // Maximum compression

  // Event listeners
  output.on('close', () => {
    console.log(`\n✅ Archive created successfully: ${OUTPUT_ZIP}`);
    console.log(`📦 Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
    console.log('\n📝 Next steps for Netlify deployment:');
    console.log('1. Create a new site on Netlify (New site from Git)');
    console.log('2. Connect your Git repository');
    console.log('3. Set the build command to: ./netlify/build.sh');
    console.log('4. Set the publish directory to: dist');
    console.log('5. Add environment variables:\n   - VITE_SUPABASE_URL\n   - VITE_SUPABASE_ANON_KEY');
    console.log('6. Deploy the site');
    console.log('\nAlternatively, you can manually upload this ZIP file through the Netlify UI "Deploy manually" option.');
  });

  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      console.warn('⚠️ Warning:', err);
    } else {
      throw err;
    }
  });

  archive.on('error', (err) => {
    throw err;
  });

  // Pipe the archive to the output file
  archive.pipe(output);

  // Add each path to the archive
  for (const includePath of INCLUDE_PATHS) {
    const fullPath = path.join(__dirname, '..', includePath);
    try {
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          archive.directory(fullPath, includePath);
          console.log(`📁 Adding directory: ${includePath}`);
        } else {
          archive.file(fullPath, { name: includePath });
          console.log(`📄 Adding file: ${includePath}`);
        }
      } else {
        console.warn(`⚠️ Path not found, skipping: ${includePath}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${includePath}:`, error);
    }
  }

  // Finalize the archive
  await archive.finalize();
}

// Create the deployment package
console.log('🚀 Creating deployment package for Netlify...');
createZipArchive();
