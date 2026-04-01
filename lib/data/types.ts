/**
 * O*NET Data Type Definitions
 * 
 * Strongly-typed interfaces for O*NET occupational data.
 */

/**
 * Core occupation definition
 */
export interface OnetOccupation {
  socCode: string;           // O*NET-SOC Code (e.g., "15-1252.00")
  title: string;             // Occupation title (e.g., "Software Developers")
  description: string;       // Full occupation description
  alternateTitles?: string[]; // Common alternative titles (optional)
  lastModified?: string;     // Last update date (for freshness)
}

/**
 * Task statement for an occupation
 */
export interface OnetTask {
  socCode: string;           // Associated occupation code
  taskId: string;            // Unique task identifier
  description: string;       // Task description
  importance?: number;       // Importance rating (1-5 scale)
  lastModified?: string;     // Last update date
}

/**
 * Skill requirement for an occupation
 */
export interface OnetSkill {
  socCode: string;           // Associated occupation code
  skillId: string;           // Skill element ID
  name: string;              // Skill name (e.g., "Programming")
  description?: string;      // Detailed skill description
  level: number;             // Skill level required (0-7 scale)
  importance: number;        // Importance rating (1-5 scale)
  lastModified?: string;     // Last update date
}

/**
 * Work activity rating for an occupation
 */
export interface OnetWorkActivity {
  socCode: string;           // Associated occupation code
  activityId: string;        // Activity element ID
  name: string;              // Activity name
  description?: string;      // Detailed activity description
  importance: number;        // Importance rating (1-5 scale)
  lastModified?: string;     // Last update date
}

/**
 * Dataset metadata and version information
 */
export interface OnetManifest {
  version: string;           // O*NET database version (e.g., "28.3")
  releaseDate: string;       // Official O*NET release date
  downloadDate: string;      // Date data was downloaded/processed
  source: string;            // Source URL
  occupationCount: number;   // Total occupations in dataset
  taskCount: number;         // Total tasks in dataset
  skillCount: number;        // Total skills in dataset
  workActivityCount: number; // Total work activities in dataset
}

/**
 * Data freshness levels for transparency
 */
export type DataFreshnessLevel = 'fresh' | 'aging' | 'stale';

/**
 * Current version pointer
 */
export interface CurrentVersion {
  version: string;           // Active version number
  path: string;              // Path to versioned data directory
}
