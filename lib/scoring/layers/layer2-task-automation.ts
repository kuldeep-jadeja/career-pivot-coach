/**
 * Layer 2: Task Automation Potential Analysis
 * 
 * Analyzes O*NET task descriptions to determine automation potential.
 * Uses keyword matching to identify routine vs. creative/interpersonal tasks.
 * 
 * This layer complements Layer 1's research baseline with occupation-specific
 * task analysis based on actual O*NET data.
 */

import type { OnetTask } from '@/lib/data/types';

/**
 * Keywords indicating HIGH automation potential
 * These suggest routine, repetitive, or rule-based tasks
 */
const HIGH_AUTOMATION_KEYWORDS = [
  'data entry', 'compile', 'record', 'file', 'schedule',
  'calculate', 'verify', 'process', 'transcribe', 'sort',
  'monitor', 'track', 'update', 'report', 'input',
  'document', 'maintain records', 'organize', 'catalog',
  'retrieve', 'summarize', 'tabulate', 'compute',
];

/**
 * Keywords indicating LOW automation potential
 * These suggest creative, interpersonal, or physical dexterity tasks
 */
const LOW_AUTOMATION_KEYWORDS = [
  'negotiate', 'counsel', 'diagnose', 'mentor', 'lead',
  'design', 'create', 'innovate', 'strategize', 'persuade',
  'empathize', 'judge', 'arbitrate', 'physical', 'repair',
  'construct', 'install', 'operate machinery', 'manual',
  'interpret', 'advocate', 'teach', 'motivate', 'inspire',
  'collaborate', 'facilitate', 'mediate', 'console',
];

/**
 * Calculate automation potential for a single task
 * 
 * @param taskDescription - Task description text
 * @returns Automation score 0-100
 */
function scoreTask(taskDescription: string): number {
  const description = taskDescription.toLowerCase();
  
  let score = 50; // Start at neutral
  
  // Check for high automation keywords (+10 each, max contribution)
  for (const keyword of HIGH_AUTOMATION_KEYWORDS) {
    if (description.includes(keyword)) {
      score += 10;
    }
  }
  
  // Check for low automation keywords (-10 each)
  for (const keyword of LOW_AUTOMATION_KEYWORDS) {
    if (description.includes(keyword)) {
      score -= 10;
    }
  }
  
  // Clamp to 0-100 range
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate task automation potential for an occupation
 * 
 * Strategy:
 * 1. Score each task individually based on keywords
 * 2. If user selected specific tasks, only analyze those
 * 3. Return average score across all analyzed tasks
 * 4. Return 50 (neutral) if no tasks available
 * 
 * @param tasks - Array of O*NET task objects
 * @param selectedTaskIds - Optional array of task IDs to analyze (user-selected)
 * @returns Task automation score (0-100)
 */
export function calculateTaskAutomation(
  tasks: OnetTask[],
  selectedTaskIds?: string[]
): number {
  if (!tasks || tasks.length === 0) {
    return 50; // Default middle score if no task data
  }
  
  // Filter to selected tasks if provided
  const relevantTasks = selectedTaskIds && selectedTaskIds.length > 0
    ? tasks.filter(t => selectedTaskIds.includes(t.taskId))
    : tasks;
  
  if (relevantTasks.length === 0) {
    return 50; // Default if filtered to nothing
  }
  
  // Score each task and average
  const taskScores = relevantTasks.map(task => scoreTask(task.description));
  const averageScore = taskScores.reduce((sum, score) => sum + score, 0) / taskScores.length;
  
  return Math.round(averageScore);
}

/**
 * Categorize tasks by automation risk for display/debugging
 * 
 * @param tasks - Array of O*NET task objects
 * @returns Tasks grouped by risk level
 */
export function getTaskBreakdown(tasks: OnetTask[]): {
  high_risk: OnetTask[];
  medium_risk: OnetTask[];
  low_risk: OnetTask[];
} {
  const categorized = {
    high_risk: [] as OnetTask[],
    medium_risk: [] as OnetTask[],
    low_risk: [] as OnetTask[],
  };
  
  for (const task of tasks) {
    const score = scoreTask(task.description);
    
    if (score >= 60) {
      categorized.high_risk.push(task);
    } else if (score >= 40) {
      categorized.medium_risk.push(task);
    } else {
      categorized.low_risk.push(task);
    }
  }
  
  return categorized;
}

/**
 * Get explanation of why a task has its automation score
 * Useful for debugging and user transparency
 * 
 * @param taskDescription - Task description
 * @returns Array of matched keywords (both high and low automation)
 */
export function explainTaskScore(taskDescription: string): {
  score: number;
  highAutomationMatches: string[];
  lowAutomationMatches: string[];
} {
  const description = taskDescription.toLowerCase();
  
  const highMatches: string[] = [];
  const lowMatches: string[] = [];
  
  for (const keyword of HIGH_AUTOMATION_KEYWORDS) {
    if (description.includes(keyword)) {
      highMatches.push(keyword);
    }
  }
  
  for (const keyword of LOW_AUTOMATION_KEYWORDS) {
    if (description.includes(keyword)) {
      lowMatches.push(keyword);
    }
  }
  
  return {
    score: scoreTask(taskDescription),
    highAutomationMatches: highMatches,
    lowAutomationMatches: lowMatches,
  };
}
