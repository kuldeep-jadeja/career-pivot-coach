#!/usr/bin/env node
/**
 * Download O*NET Database
 * 
 * Downloads the latest O*NET database release and extracts required files.
 * Run: npx tsx data-processing/scripts/download-onet.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';

// O*NET Database Configuration
const ONET_VERSION = '28_3'; // Update this when new versions are released
const DOWNLOAD_URL = `https://www.onetcenter.org/dl_files/database/db_${ONET_VERSION}_text.zip`;
const OUTPUT_DIR = path.join(__dirname, '../raw');
const ZIP_FILE = path.join(OUTPUT_DIR, 'onet_db.zip');

// Required files to extract
const REQUIRED_FILES = [
  'Occupation Data.txt',
  'Task Statements.txt',
  'Skills.txt',
  'Work Activities.txt',
];

async function downloadFile(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`Downloading from: ${url}`);
    console.log(`Saving to: ${outputPath}`);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          console.log(`Following redirect to: ${redirectUrl}`);
          downloadFile(redirectUrl, outputPath).then(resolve).catch(reject);
          return;
        }
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Download failed with status ${response.statusCode}`));
        return;
      }
      
      const fileStream = createWriteStream(outputPath);
      let downloadedBytes = 0;
      const totalBytes = parseInt(response.headers['content-length'] || '0', 10);
      
      response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        if (totalBytes > 0) {
          const percent = ((downloadedBytes / totalBytes) * 100).toFixed(1);
          process.stdout.write(`\r  Progress: ${percent}% (${(downloadedBytes / 1024 / 1024).toFixed(1)}MB)`);
        }
      });
      
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log('\n  Download complete!');
        resolve();
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(outputPath, () => reject(err));
      });
    }).on('error', reject);
  });
}

async function extractZip(zipPath: string, outputDir: string): Promise<void> {
  console.log('\nExtracting ZIP file...');
  
  // Check if unzip is available (cross-platform)
  try {
    const { execSync } = require('child_process');
    
    // Try unzip command (Unix/Mac/Git Bash on Windows)
    try {
      execSync(`unzip -o "${zipPath}" -d "${outputDir}"`, { stdio: 'inherit' });
      console.log('Extraction complete using unzip!');
      return;
    } catch (e) {
      // unzip not available, try PowerShell on Windows
      console.log('unzip not found, trying PowerShell...');
    }
    
    // Try PowerShell Expand-Archive (Windows)
    try {
      execSync(
        `powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${outputDir}' -Force"`,
        { stdio: 'inherit' }
      );
      console.log('Extraction complete using PowerShell!');
      return;
    } catch (e) {
      console.error('PowerShell extraction failed');
    }
  } catch (error) {
    console.error('Extraction failed. Please manually extract:', zipPath);
    throw error;
  }
}

function verifyFiles(outputDir: string): boolean {
  console.log('\nVerifying required files...');
  let allFound = true;
  
  for (const file of REQUIRED_FILES) {
    const filePath = path.join(outputDir, file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
      console.log(`  ✓ ${file} (${sizeMB}MB)`);
    } else {
      console.log(`  ✗ ${file} - NOT FOUND`);
      allFound = false;
    }
  }
  
  return allFound;
}

async function main() {
  console.log('O*NET Database Download Script');
  console.log('================================\n');
  console.log(`Version: ${ONET_VERSION.replace('_', '.')}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);
  
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  }
  
  // Download ZIP file
  try {
    await downloadFile(DOWNLOAD_URL, ZIP_FILE);
  } catch (error) {
    console.error('\n❌ Download failed:', error);
    console.log('\n📝 Manual Download Instructions:');
    console.log('1. Visit: https://www.onetcenter.org/database.html');
    console.log('2. Download: "Database (Excel)" or "Database (Text)"');
    console.log(`3. Extract to: ${OUTPUT_DIR}`);
    console.log('4. Run parse script: npm run data:parse');
    process.exit(1);
  }
  
  // Extract ZIP file
  try {
    await extractZip(ZIP_FILE, OUTPUT_DIR);
  } catch (error) {
    console.error('\n❌ Extraction failed:', error);
    console.log('\n📝 Please manually extract the ZIP file:');
    console.log(`   From: ${ZIP_FILE}`);
    console.log(`   To: ${OUTPUT_DIR}`);
    process.exit(1);
  }
  
  // Verify required files
  const allFilesPresent = verifyFiles(OUTPUT_DIR);
  
  if (allFilesPresent) {
    console.log('\n✅ Download complete! All required files present.');
    console.log('\nNext step: Run parse script');
    console.log('  npm run data:parse');
  } else {
    console.log('\n⚠️  Some required files are missing.');
    console.log('Please check the extraction or download manually.');
    process.exit(1);
  }
}

main().catch(console.error);
