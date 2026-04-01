#!/usr/bin/env node
/**
 * Parse O*NET CSV Files to JSON
 * 
 * Transforms tab-delimited O*NET files into structured JSON for the application.
 * Run: npx tsx data-processing/scripts/parse-onet.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import type { RawOccupation, RawTask, RawSkill, RawWorkActivity } from './types';

// Configuration
const RAW_DIR = path.join(__dirname, '../raw');
const OUTPUT_DIR = path.join(__dirname, '../../public/data');
const VERSION = '28.3';

// Output types for our application
interface OnetOccupation {
  socCode: string;
  title: string;
  description: string;
}

interface OnetTask {
  socCode: string;
  taskId: string;
  description: string;
  lastModified: string;
}

interface OnetSkill {
  socCode: string;
  skillId: string;
  name: string;
  level: number;
  importance: number;
  lastModified: string;
}

interface OnetWorkActivity {
  socCode: string;
  activityId: string;
  name: string;
  importance: number;
  lastModified: string;
}

interface Manifest {
  version: string;
  releaseDate: string;
  downloadDate: string;
  source: string;
  occupationCount: number;
  taskCount: number;
  skillCount: number;
  workActivityCount: number;
}

/**
 * Parse Occupation Data file
 */
function parseOccupations(): OnetOccupation[] {
  const filePath = path.join(RAW_DIR, 'Occupation Data.txt');
  
  if (!fs.existsSync(filePath)) {
    console.log('⚠️  Occupation Data.txt not found. Using sample data.');
    return generateSampleOccupations();
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const records = parse(content, { 
    columns: true, 
    delimiter: '\t',
    skip_empty_lines: true 
  }) as RawOccupation[];
  
  return records.map((r) => ({
    socCode: r['O*NET-SOC Code'],
    title: r['Title'],
    description: r['Description'],
  }));
}

/**
 * Parse Task Statements file
 */
function parseTasks(): OnetTask[] {
  const filePath = path.join(RAW_DIR, 'Task Statements.txt');
  
  if (!fs.existsSync(filePath)) {
    console.log('⚠️  Task Statements.txt not found. Using sample data.');
    return generateSampleTasks();
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const records = parse(content, { 
    columns: true, 
    delimiter: '\t',
    skip_empty_lines: true 
  }) as RawTask[];
  
  return records.map((r) => ({
    socCode: r['O*NET-SOC Code'],
    taskId: r['Task ID'],
    description: r['Task'],
    lastModified: r['Date'],
  }));
}

/**
 * Parse Skills file
 */
function parseSkills(): OnetSkill[] {
  const filePath = path.join(RAW_DIR, 'Skills.txt');
  
  if (!fs.existsSync(filePath)) {
    console.log('⚠️  Skills.txt not found. Using sample data.');
    return generateSampleSkills();
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const records = parse(content, { 
    columns: true, 
    delimiter: '\t',
    skip_empty_lines: true 
  }) as RawSkill[];
  
  // Filter for "Level" scale and only keep relevant records
  return records
    .filter(r => r['Scale ID'] === 'LV' && r['Recommend Suppress'] !== 'Y')
    .map((r) => ({
      socCode: r['O*NET-SOC Code'],
      skillId: r['Element ID'],
      name: r['Element Name'],
      level: parseFloat(r['Data Value']) || 0,
      importance: parseFloat(r['N']) || 0,
      lastModified: r['Date'],
    }));
}

/**
 * Parse Work Activities file
 */
function parseWorkActivities(): OnetWorkActivity[] {
  const filePath = path.join(RAW_DIR, 'Work Activities.txt');
  
  if (!fs.existsSync(filePath)) {
    console.log('⚠️  Work Activities.txt not found. Using sample data.');
    return generateSampleWorkActivities();
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const records = parse(content, { 
    columns: true, 
    delimiter: '\t',
    skip_empty_lines: true 
  }) as RawWorkActivity[];
  
  // Filter for "Importance" scale
  return records
    .filter(r => r['Scale ID'] === 'IM' && r['Recommend Suppress'] !== 'Y')
    .map((r) => ({
      socCode: r['O*NET-SOC Code'],
      activityId: r['Element ID'],
      name: r['Element Name'],
      importance: parseFloat(r['Data Value']) || 0,
      lastModified: r['Date'],
    }));
}

/**
 * Generate sample occupations for development
 */
function generateSampleOccupations(): OnetOccupation[] {
  return [
    {
      socCode: '15-1252.00',
      title: 'Software Developers',
      description: 'Research, design, and develop computer and network software or specialized utility programs.',
    },
    {
      socCode: '11-1021.00',
      title: 'General and Operations Managers',
      description: 'Plan, direct, or coordinate the operations of public or private sector organizations.',
    },
    {
      socCode: '29-1141.00',
      title: 'Registered Nurses',
      description: 'Assess patient health problems and needs, develop and implement nursing care plans, and maintain medical records.',
    },
    {
      socCode: '13-2011.00',
      title: 'Accountants and Auditors',
      description: 'Examine, analyze, and interpret accounting records to prepare financial statements, give advice, or audit and evaluate statements prepared by others.',
    },
    {
      socCode: '41-3099.00',
      title: 'Sales Representatives, Services, All Other',
      description: 'All sales representatives, services not listed separately.',
    },
  ];
}

/**
 * Generate sample tasks for development
 */
function generateSampleTasks(): OnetTask[] {
  return [
    {
      socCode: '15-1252.00',
      taskId: '1',
      description: 'Develop and direct software system testing and validation procedures.',
      lastModified: '2023-01-15',
    },
    {
      socCode: '15-1252.00',
      taskId: '2',
      description: 'Modify existing software to correct errors, adapt to new hardware, or improve performance.',
      lastModified: '2023-01-15',
    },
    {
      socCode: '15-1252.00',
      taskId: '3',
      description: 'Design and develop software systems, using scientific analysis and mathematical models.',
      lastModified: '2023-01-15',
    },
    {
      socCode: '11-1021.00',
      taskId: '4',
      description: 'Direct and coordinate activities of businesses or departments concerned with production, pricing, sales, or distribution.',
      lastModified: '2023-02-10',
    },
    {
      socCode: '11-1021.00',
      taskId: '5',
      description: 'Review financial statements, sales or activity reports, and other performance data.',
      lastModified: '2023-02-10',
    },
  ];
}

/**
 * Generate sample skills for development
 */
function generateSampleSkills(): OnetSkill[] {
  return [
    {
      socCode: '15-1252.00',
      skillId: '2.A.1.a',
      name: 'Programming',
      level: 5.5,
      importance: 4.8,
      lastModified: '2023-01-15',
    },
    {
      socCode: '15-1252.00',
      skillId: '2.A.1.b',
      name: 'Systems Analysis',
      level: 4.8,
      importance: 4.5,
      lastModified: '2023-01-15',
    },
    {
      socCode: '15-1252.00',
      skillId: '2.A.1.c',
      name: 'Critical Thinking',
      level: 5.2,
      importance: 4.6,
      lastModified: '2023-01-15',
    },
    {
      socCode: '11-1021.00',
      skillId: '2.B.1.a',
      name: 'Management of Personnel Resources',
      level: 5.0,
      importance: 4.7,
      lastModified: '2023-02-10',
    },
    {
      socCode: '11-1021.00',
      skillId: '2.B.1.b',
      name: 'Time Management',
      level: 4.5,
      importance: 4.3,
      lastModified: '2023-02-10',
    },
  ];
}

/**
 * Generate sample work activities for development
 */
function generateSampleWorkActivities(): OnetWorkActivity[] {
  return [
    {
      socCode: '15-1252.00',
      activityId: '4.A.2.a.1',
      name: 'Working with Computers',
      importance: 4.9,
      lastModified: '2023-01-15',
    },
    {
      socCode: '15-1252.00',
      activityId: '4.A.2.a.2',
      name: 'Thinking Creatively',
      importance: 4.5,
      lastModified: '2023-01-15',
    },
    {
      socCode: '15-1252.00',
      activityId: '4.A.2.a.3',
      name: 'Analyzing Data or Information',
      importance: 4.7,
      lastModified: '2023-01-15',
    },
    {
      socCode: '11-1021.00',
      activityId: '4.A.2.b.1',
      name: 'Making Decisions and Solving Problems',
      importance: 4.8,
      lastModified: '2023-02-10',
    },
    {
      socCode: '11-1021.00',
      activityId: '4.A.2.b.2',
      name: 'Guiding, Directing, and Motivating Subordinates',
      importance: 4.6,
      lastModified: '2023-02-10',
    },
  ];
}

/**
 * Main execution
 */
async function main() {
  console.log('O*NET Data Parser');
  console.log('==================\n');
  console.log(`Version: ${VERSION}`);
  console.log(`Source: ${RAW_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);
  
  // Create output directory
  const versionDir = path.join(OUTPUT_DIR, `onet-v${VERSION}`);
  fs.mkdirSync(versionDir, { recursive: true });
  console.log(`Created: ${versionDir}\n`);
  
  // Parse occupations
  console.log('Parsing occupations...');
  const occupations = parseOccupations();
  const occupationsPath = path.join(versionDir, 'occupations.json');
  fs.writeFileSync(occupationsPath, JSON.stringify(occupations, null, 2));
  console.log(`  ✓ ${occupations.length} occupations → occupations.json`);
  
  // Parse tasks
  console.log('Parsing tasks...');
  const tasks = parseTasks();
  const tasksPath = path.join(versionDir, 'tasks.json');
  fs.writeFileSync(tasksPath, JSON.stringify(tasks, null, 2));
  console.log(`  ✓ ${tasks.length} tasks → tasks.json`);
  
  // Parse skills
  console.log('Parsing skills...');
  const skills = parseSkills();
  const skillsPath = path.join(versionDir, 'skills.json');
  fs.writeFileSync(skillsPath, JSON.stringify(skills, null, 2));
  console.log(`  ✓ ${skills.length} skills → skills.json`);
  
  // Parse work activities
  console.log('Parsing work activities...');
  const workActivities = parseWorkActivities();
  const workActivitiesPath = path.join(versionDir, 'work_activities.json');
  fs.writeFileSync(workActivitiesPath, JSON.stringify(workActivities, null, 2));
  console.log(`  ✓ ${workActivities.length} work activities → work_activities.json`);
  
  // Generate manifest
  console.log('\nGenerating manifest...');
  const manifest: Manifest = {
    version: VERSION,
    releaseDate: '2024-01-15', // O*NET 28.3 release date
    downloadDate: new Date().toISOString().split('T')[0],
    source: 'https://www.onetcenter.org/database.html',
    occupationCount: occupations.length,
    taskCount: tasks.length,
    skillCount: skills.length,
    workActivityCount: workActivities.length,
  };
  
  const manifestPath = path.join(versionDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('  ✓ manifest.json created');
  
  // Summary
  console.log('\n✅ Parsing complete!');
  console.log('\nOutput files:');
  console.log(`  ${occupationsPath}`);
  console.log(`  ${tasksPath}`);
  console.log(`  ${skillsPath}`);
  console.log(`  ${workActivitiesPath}`);
  console.log(`  ${manifestPath}`);
  
  console.log('\nManifest:');
  console.log(JSON.stringify(manifest, null, 2));
  
  console.log('\n📝 Note: Using sample data for development.');
  console.log('   To use real O*NET data, run: npm run data:download');
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
