/**
 * O*NET Data Loader
 * 
 * Utilities for loading O*NET data from versioned JSON files.
 * Uses static imports for server-side rendering.
 */

import type {
  OnetOccupation,
  OnetTask,
  OnetSkill,
  OnetWorkActivity,
  OnetManifest,
  CurrentVersion,
} from './types';

// Import current version pointer
import currentVersionData from '@/public/data/current.json';
const currentVersion = currentVersionData as CurrentVersion;

/**
 * Get the current O*NET version
 */
export function getCurrentVersion(): string {
  return currentVersion.version;
}

/**
 * Get the path to current version data
 */
export function getCurrentDataPath(): string {
  return currentVersion.path;
}

/**
 * Load all occupations
 * Server-side: Direct import for SSR/SSG
 * Client-side: Fetch from API
 */
export async function loadOccupations(): Promise<OnetOccupation[]> {
  if (typeof window === 'undefined') {
    // Server-side: Use dynamic import
    const data = await import('@/public/data/onet-v28.3/occupations.json');
    return data.default as OnetOccupation[];
  } else {
    // Client-side: Fetch from public directory
    const response = await fetch('/data/onet-v28.3/occupations.json');
    return response.json();
  }
}

/**
 * Load all tasks
 */
export async function loadTasks(): Promise<OnetTask[]> {
  if (typeof window === 'undefined') {
    const data = await import('@/public/data/onet-v28.3/tasks.json');
    return data.default as OnetTask[];
  } else {
    const response = await fetch('/data/onet-v28.3/tasks.json');
    return response.json();
  }
}

/**
 * Load all skills
 */
export async function loadSkills(): Promise<OnetSkill[]> {
  if (typeof window === 'undefined') {
    const data = await import('@/public/data/onet-v28.3/skills.json');
    return data.default as OnetSkill[];
  } else {
    const response = await fetch('/data/onet-v28.3/skills.json');
    return response.json();
  }
}

/**
 * Load all work activities
 */
export async function loadWorkActivities(): Promise<OnetWorkActivity[]> {
  if (typeof window === 'undefined') {
    const data = await import('@/public/data/onet-v28.3/work_activities.json');
    return data.default as OnetWorkActivity[];
  } else {
    const response = await fetch('/data/onet-v28.3/work_activities.json');
    return response.json();
  }
}

/**
 * Load manifest with dataset metadata
 */
export async function loadManifest(): Promise<OnetManifest> {
  if (typeof window === 'undefined') {
    const data = await import('@/public/data/onet-v28.3/manifest.json');
    return data.default as OnetManifest;
  } else {
    const response = await fetch('/data/onet-v28.3/manifest.json');
    return response.json();
  }
}

/**
 * Get tasks for a specific occupation
 */
export async function getTasksForOccupation(
  socCode: string
): Promise<OnetTask[]> {
  const tasks = await loadTasks();
  return tasks.filter((t) => t.socCode === socCode);
}

/**
 * Get skills for a specific occupation
 */
export async function getSkillsForOccupation(
  socCode: string
): Promise<OnetSkill[]> {
  const skills = await loadSkills();
  return skills.filter((s) => s.socCode === socCode);
}

/**
 * Get work activities for a specific occupation
 */
export async function getWorkActivitiesForOccupation(
  socCode: string
): Promise<OnetWorkActivity[]> {
  const activities = await loadWorkActivities();
  return activities.filter((a) => a.socCode === socCode);
}

/**
 * Find occupation by SOC code
 */
export async function getOccupationByCode(
  socCode: string
): Promise<OnetOccupation | undefined> {
  const occupations = await loadOccupations();
  return occupations.find((o) => o.socCode === socCode);
}

/**
 * Search occupations by title (case-insensitive)
 */
export async function searchOccupations(
  query: string
): Promise<OnetOccupation[]> {
  const occupations = await loadOccupations();
  const lowerQuery = query.toLowerCase();
  return occupations.filter((o) =>
    o.title.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get top N skills for an occupation (sorted by importance)
 */
export async function getTopSkills(
  socCode: string,
  limit: number = 10
): Promise<OnetSkill[]> {
  const skills = await getSkillsForOccupation(socCode);
  return skills
    .sort((a, b) => b.importance - a.importance)
    .slice(0, limit);
}

/**
 * Get top N work activities for an occupation (sorted by importance)
 */
export async function getTopWorkActivities(
  socCode: string,
  limit: number = 10
): Promise<OnetWorkActivity[]> {
  const activities = await getWorkActivitiesForOccupation(socCode);
  return activities
    .sort((a, b) => b.importance - a.importance)
    .slice(0, limit);
}
