/**
 * Database Types
 * 
 * Purpose: TypeScript type definitions for database tables
 * These types match the SQL schema defined in schema.sql
 */

// Database type - used by Supabase client
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      assessments: {
        Row: Assessment;
        Insert: AssessmentInsert;
        Update: AssessmentUpdate;
      };
      deeper_assessments: {
        Row: DeeperAssessment;
        Insert: DeeperAssessmentInsert;
        Update: DeeperAssessmentUpdate;
      };
      pivot_plans: {
        Row: PivotPlan;
        Insert: PivotPlanInsert;
        Update: PivotPlanUpdate;
      };
      payments: {
        Row: Payment;
        Insert: PaymentInsert;
        Update: PaymentUpdate;
      };
      onet_occupations: {
        Row: OnetOccupation;
        Insert: OnetOccupationInsert;
        Update: OnetOccupationUpdate;
      };
      onet_tasks: {
        Row: OnetTask;
        Insert: OnetTaskInsert;
        Update: OnetTaskUpdate;
      };
      onet_skills: {
        Row: OnetSkill;
        Insert: OnetSkillInsert;
        Update: OnetSkillUpdate;
      };
      onet_work_activities: {
        Row: OnetWorkActivity;
        Insert: OnetWorkActivityInsert;
        Update: OnetWorkActivityUpdate;
      };
    };
  };
}

// Profile (extends Supabase Auth user)
export interface Profile {
  id: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id: string;
  display_name?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileUpdate {
  display_name?: string | null;
  updated_at?: string;
}

// Assessment (free risk assessment)
export interface Assessment {
  id: string;
  user_id: string | null;
  anonymous_id: string | null;
  job_title: string;
  occupation_code: string | null;
  industry: string | null;
  years_experience: number | null;
  risk_score: number | null;
  layer_breakdown: LayerBreakdown | null;
  confidence: 'high' | 'medium' | 'low' | null;
  created_at: string;
  updated_at: string;
}

export interface AssessmentInsert {
  id?: string;
  user_id?: string | null;
  anonymous_id?: string | null;
  job_title: string;
  occupation_code?: string | null;
  industry?: string | null;
  years_experience?: number | null;
  risk_score?: number | null;
  layer_breakdown?: LayerBreakdown | null;
  confidence?: 'high' | 'medium' | 'low' | null;
  created_at?: string;
  updated_at?: string;
}

export interface AssessmentUpdate {
  job_title?: string;
  occupation_code?: string | null;
  industry?: string | null;
  years_experience?: number | null;
  risk_score?: number | null;
  layer_breakdown?: LayerBreakdown | null;
  confidence?: 'high' | 'medium' | 'low' | null;
  updated_at?: string;
}

export interface LayerBreakdown {
  layer1: number; // AI exposure
  layer2: number; // Task automation
  layer3: number; // Industry speed
  layer4: number; // Experience modifier
}

// Deeper Assessment (detailed user data with encryption)
export interface DeeperAssessment {
  id: string;
  assessment_id: string;
  user_id: string;
  skills: SkillData[] | null;
  salary_requirements_encrypted: string | null;
  location_encrypted: string | null;
  time_availability: number | null;
  industry_preferences: string[] | null;
  created_at: string;
}

export interface DeeperAssessmentInsert {
  id?: string;
  assessment_id: string;
  user_id: string;
  skills?: SkillData[] | null;
  salary_requirements_encrypted?: string | null;
  location_encrypted?: string | null;
  time_availability?: number | null;
  industry_preferences?: string[] | null;
  created_at?: string;
}

export interface DeeperAssessmentUpdate {
  skills?: SkillData[] | null;
  salary_requirements_encrypted?: string | null;
  location_encrypted?: string | null;
  time_availability?: number | null;
  industry_preferences?: string[] | null;
}

export interface SkillData {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years_experience?: number;
}

// Pivot Plan (generated career paths)
export interface PivotPlan {
  id: string;
  assessment_id: string;
  user_id: string;
  paths: CareerPath[];
  status: 'preview' | 'unlocked' | 'generating' | 'failed';
  created_at: string;
  unlocked_at: string | null;
}

export interface PivotPlanInsert {
  id?: string;
  assessment_id: string;
  user_id: string;
  paths: CareerPath[];
  status?: 'preview' | 'unlocked' | 'generating' | 'failed';
  created_at?: string;
  unlocked_at?: string | null;
}

export interface PivotPlanUpdate {
  paths?: CareerPath[];
  status?: 'preview' | 'unlocked' | 'generating' | 'failed';
  unlocked_at?: string | null;
}

export interface CareerPath {
  id: string;
  type: 'adjacent' | 'upskill' | 'pivot';
  title: string;
  target_occupation_code: string | null;
  risk_reduction: number; // How much risk is reduced
  narrative: string | null; // LLM-generated personalized narrative
  skill_gaps: SkillGap[];
  timeline_weeks: number;
  preview_visible: boolean; // True if visible in preview mode
}

export interface SkillGap {
  skill_name: string;
  current_level: string | null;
  required_level: string;
  time_estimate_hours: number;
  resources: LearningResource[];
}

export interface LearningResource {
  title: string;
  url: string;
  type: 'course' | 'certification' | 'book' | 'article';
  cost: number; // In cents, 0 for free
}

// Payment (Stripe integration)
export interface Payment {
  id: string;
  user_id: string | null;
  assessment_id: string | null;
  stripe_payment_id: string | null;
  stripe_checkout_session_id: string | null;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  completed_at: string | null;
}

export interface PaymentInsert {
  id?: string;
  user_id?: string | null;
  assessment_id?: string | null;
  stripe_payment_id?: string | null;
  stripe_checkout_session_id?: string | null;
  amount: number;
  currency?: string;
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at?: string;
  completed_at?: string | null;
}

export interface PaymentUpdate {
  stripe_payment_id?: string | null;
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  completed_at?: string | null;
}

// O*NET Occupation
export interface OnetOccupation {
  soc_code: string;
  title: string;
  description: string | null;
  alternate_titles: string[] | null;
  last_modified: string | null;
  created_at: string;
}

export interface OnetOccupationInsert {
  soc_code: string;
  title: string;
  description?: string | null;
  alternate_titles?: string[] | null;
  last_modified?: string | null;
  created_at?: string;
}

export interface OnetOccupationUpdate {
  title?: string;
  description?: string | null;
  alternate_titles?: string[] | null;
  last_modified?: string | null;
}

// O*NET Task
export interface OnetTask {
  id: string;
  soc_code: string;
  task_id: string | null;
  description: string;
  importance: number | null;
  created_at: string;
}

export interface OnetTaskInsert {
  id?: string;
  soc_code: string;
  task_id?: string | null;
  description: string;
  importance?: number | null;
  created_at?: string;
}

export interface OnetTaskUpdate {
  description?: string;
  importance?: number | null;
}

// O*NET Skill
export interface OnetSkill {
  id: string;
  soc_code: string;
  skill_id: string | null;
  name: string;
  description: string | null;
  level: number | null;
  importance: number | null;
  created_at: string;
}

export interface OnetSkillInsert {
  id?: string;
  soc_code: string;
  skill_id?: string | null;
  name: string;
  description?: string | null;
  level?: number | null;
  importance?: number | null;
  created_at?: string;
}

export interface OnetSkillUpdate {
  name?: string;
  description?: string | null;
  level?: number | null;
  importance?: number | null;
}

// O*NET Work Activity
export interface OnetWorkActivity {
  id: string;
  soc_code: string;
  activity_id: string | null;
  name: string;
  description: string | null;
  importance: number | null;
  created_at: string;
}

export interface OnetWorkActivityInsert {
  id?: string;
  soc_code: string;
  activity_id?: string | null;
  name: string;
  description?: string | null;
  importance?: number | null;
  created_at?: string;
}

export interface OnetWorkActivityUpdate {
  name?: string;
  description?: string | null;
  importance?: number | null;
}
