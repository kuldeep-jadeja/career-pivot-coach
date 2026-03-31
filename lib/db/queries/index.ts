/**
 * Database Queries Index
 * 
 * Purpose: Centralized export of all database query functions
 * Import from this file to access type-safe database operations
 * 
 * Usage:
 *   import { createAssessment, getUserPivotPlans } from '@/lib/db/queries';
 */

// Assessment queries
export {
  createAssessment,
  getAssessmentById,
  getUserAssessments,
  getAssessmentByAnonymousId,
  updateAssessmentScore,
  linkAssessmentToUser,
  deleteAssessment,
  getAssessmentWithPivotPlan,
} from './assessments';

// Pivot plan queries
export {
  createPivotPlan,
  getPivotPlanById,
  getPivotPlanByAssessmentId,
  getUserPivotPlans,
  unlockPivotPlan,
  updatePivotPlanStatus,
  updatePivotPlanPaths,
  isPivotPlanUnlocked,
  deletePivotPlan,
} from './pivot-plans';

// Payment queries
export {
  createPayment,
  getPaymentById,
  getPaymentByStripeId,
  getUserPayments,
  getPaymentByAssessmentId,
  updatePaymentStatus,
  hasUserPaidForAssessment,
  getTotalRevenue,
  getPaymentCountByStatus,
} from './payments';
