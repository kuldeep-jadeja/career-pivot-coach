/**
 * O*NET Raw Data Type Definitions
 * 
 * These types match the structure of O*NET tab-delimited files.
 */

export interface RawOccupation {
  'O*NET-SOC Code': string;
  'Title': string;
  'Description': string;
}

export interface RawTask {
  'O*NET-SOC Code': string;
  'Task ID': string;
  'Task': string;
  'Task Type': string;
  'Incumbents Responding': string;
  'Date': string;
  'Domain Source': string;
}

export interface RawSkill {
  'O*NET-SOC Code': string;
  'Element ID': string;
  'Element Name': string;
  'Scale ID': string;
  'Data Value': string;
  'N': string;
  'Standard Error': string;
  'Lower CI Bound': string;
  'Upper CI Bound': string;
  'Recommend Suppress': string;
  'Not Relevant': string;
  'Date': string;
  'Domain Source': string;
}

export interface RawWorkActivity {
  'O*NET-SOC Code': string;
  'Element ID': string;
  'Element Name': string;
  'Scale ID': string;
  'Data Value': string;
  'N': string;
  'Standard Error': string;
  'Lower CI Bound': string;
  'Upper CI Bound': string;
  'Recommend Suppress': string;
  'Not Relevant': string;
  'Date': string;
  'Domain Source': string;
}
