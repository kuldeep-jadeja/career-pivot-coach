/**
 * AI Exposure Research Data
 * 
 * Pre-computed AI exposure scores based on published research:
 * - Eloundou et al. "GPTs are GPTs: An Early Look at the Labor Market Impact Potential of LLMs" (2023)
 * - Felten et al. "Occupational Exposure to AI" (2023)
 * 
 * Scores normalized to 0-100 scale where:
 * - 0-20: Very low AI exposure (manual, physical, highly contextual work)
 * - 21-40: Low AI exposure (interpersonal, creative, physical problem-solving)
 * - 41-60: Moderate AI exposure (mixed cognitive/manual, some routine tasks)
 * - 61-80: High AI exposure (knowledge work with routine elements)
 * - 81-100: Very high AI exposure (highly routine, repetitive, text-based)
 * 
 * These are approximations based on research findings. Full research integration
 * with complete SOC coverage is planned for Phase 2 refinement.
 */

export const AI_EXPOSURE_SCORES: Record<string, number> = {
  // Technology & Computer Occupations (High Exposure)
  '15-1252.00': 78,  // Software Developers, Applications
  '15-1251.00': 80,  // Computer Programmers
  '15-1211.00': 82,  // Computer Systems Analysts
  '15-2051.00': 85,  // Data Scientists
  '15-1212.00': 76,  // Information Security Analysts
  '15-1244.00': 72,  // Network and Computer Systems Administrators
  '15-1299.08': 88,  // Web Developers (high automation potential)
  
  // Administrative & Office Support (Very High Exposure)
  '43-9061.00': 88,  // Office Clerks, General
  '43-4051.00': 75,  // Customer Service Representatives
  '43-6014.00': 92,  // Secretaries and Administrative Assistants
  '43-3031.00': 90,  // Bookkeeping, Accounting, and Auditing Clerks
  '43-4171.00': 85,  // Receptionists and Information Clerks
  '43-5061.00': 94,  // Production, Planning, and Expediting Clerks
  
  // Business & Financial Operations (High Exposure)
  '13-2011.00': 70,  // Accountants and Auditors
  '13-2051.00': 68,  // Financial Analysts
  '11-3031.00': 55,  // Financial Managers
  '13-1161.00': 72,  // Market Research Analysts
  '13-1111.00': 65,  // Management Analysts
  
  // Healthcare Practitioners (Low-Moderate Exposure)
  '29-1141.00': 35,  // Registered Nurses
  '29-1215.00': 28,  // Family Medicine Physicians
  '29-1218.00': 30,  // Obstetricians and Gynecologists
  '29-2061.00': 42,  // Licensed Practical Nurses
  '29-1071.00': 38,  // Physician Assistants
  '29-1122.00': 32,  // Occupational Therapists
  '29-1123.00': 34,  // Physical Therapists
  
  // Healthcare Support (Moderate Exposure)
  '31-1120.00': 25,  // Home Health Aides
  '31-9092.00': 40,  // Medical Assistants
  '31-9097.00': 48,  // Phlebotomists
  
  // Education (Low-Moderate Exposure)
  '25-2021.00': 32,  // Elementary School Teachers
  '25-2031.00': 35,  // Secondary School Teachers
  '25-1011.00': 45,  // Business Teachers, Postsecondary
  '25-1194.00': 48,  // Career/Technical Education Teachers, Postsecondary
  '25-3011.00': 38,  // Adult Basic Education Teachers
  '25-9045.00': 55,  // Teaching Assistants, Postsecondary
  
  // Construction & Extraction (Very Low Exposure)
  '47-2111.00': 15,  // Electricians
  '47-2152.00': 12,  // Plumbers, Pipefitters, and Steamfitters
  '47-2061.00': 18,  // Construction Laborers
  '47-2031.00': 20,  // Carpenters
  '49-9071.00': 22,  // Maintenance and Repair Workers, General
  '47-2073.00': 16,  // Operating Engineers and Other Construction Equipment Operators
  
  // Transportation (Moderate-High Exposure - autonomous vehicle potential)
  '53-3032.00': 58,  // Heavy and Tractor-Trailer Truck Drivers
  '53-3033.00': 60,  // Light Truck Drivers
  '53-3041.00': 52,  // Taxi Drivers
  '53-6051.00': 65,  // Transportation Inspectors
  
  // Food Service (Low Exposure)
  '35-3023.00': 22,  // Fast Food and Counter Workers
  '35-2014.00': 24,  // Cooks, Restaurant
  '35-3031.00': 20,  // Waiters and Waitresses
  '35-1012.00': 28,  // First-Line Supervisors of Food Preparation and Serving Workers
  
  // Retail Sales (Moderate Exposure)
  '41-2031.00': 45,  // Retail Salespersons
  '41-1011.00': 42,  // First-Line Supervisors of Retail Sales Workers
  '41-2011.00': 50,  // Cashiers
  '43-5081.00': 68,  // Stock Clerks and Order Fillers
  
  // Management (Low-Moderate Exposure)
  '11-1011.00': 38,  // Chief Executives
  '11-2021.00': 48,  // Marketing Managers
  '11-3021.00': 52,  // Computer and Information Systems Managers
  '11-9111.00': 35,  // Medical and Health Services Managers
  
  // Legal (High Exposure)
  '23-1011.00': 62,  // Lawyers
  '23-2011.00': 88,  // Paralegals and Legal Assistants
  '23-2093.00': 75,  // Title Examiners, Abstractors, and Searchers
  
  // Arts & Design (Moderate-High Exposure)
  '27-1024.00': 65,  // Graphic Designers
  '27-3043.00': 72,  // Writers and Authors
  '27-1014.00': 58,  // Multimedia Artists and Animators
  '27-3091.00': 70,  // Interpreters and Translators
  
  // Personal Care & Service (Very Low Exposure)
  '39-5012.00': 18,  // Hairdressers, Hairstylists, and Cosmetologists
  '39-9011.00': 15,  // Childcare Workers
  '39-9021.00': 12,  // Personal Care Aides
  
  // Protective Service (Low Exposure)
  '33-3051.00': 25,  // Police and Sheriff's Patrol Officers
  '33-2011.00': 18,  // Firefighters
  '33-9032.00': 35,  // Security Guards
  
  // Default for unmapped occupations (middle of scale)
  '_default': 50,
};

/**
 * Get AI exposure score for an occupation
 * 
 * @param socCode - O*NET SOC code (e.g., "15-1252.00")
 * @returns AI exposure score (0-100)
 */
export function getAIExposureScore(socCode: string): number {
  return AI_EXPOSURE_SCORES[socCode] ?? AI_EXPOSURE_SCORES['_default'];
}

/**
 * Get average AI exposure for an occupation family (first 5 digits of SOC code)
 * Used as fallback when specific occupation is not found
 * 
 * @param familyCode - First 5 digits of SOC code (e.g., "15-12")
 * @returns Average exposure score for the family, or default if no family members
 */
export function getAIExposureByFamily(familyCode: string): number {
  const familyScores = Object.entries(AI_EXPOSURE_SCORES)
    .filter(([code]) => code.startsWith(familyCode))
    .map(([, score]) => score);
  
  if (familyScores.length === 0) {
    return AI_EXPOSURE_SCORES['_default'];
  }
  
  return Math.round(familyScores.reduce((sum, score) => sum + score, 0) / familyScores.length);
}
