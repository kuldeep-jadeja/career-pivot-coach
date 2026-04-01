/**
 * Job Matcher Unit Tests
 * 
 * Tests fuzzy job title matching with mocked O*NET data.
 * Validates Levenshtein distance, similarity scoring, and disambiguation.
 */

import { describe, it, expect } from 'vitest';
import { findJobMatchesSync } from '../job-matcher';
import type { OnetOccupation } from '@/lib/data/types';

/**
 * Mock O*NET occupations for testing
 * Includes common titles, variants, and edge cases
 */
const MOCK_OCCUPATIONS: OnetOccupation[] = [
  {
    socCode: '15-1252.00',
    title: 'Software Developers',
    description: 'Research, design, and develop computer and network software or specialized utility programs.',
    alternateTitles: ['Software Engineer', 'Programmer', 'Developer', 'Software Dev'],
  },
  {
    socCode: '15-1251.00',
    title: 'Computer Programmers',
    description: 'Create, modify, and test the code and scripts that allow computer applications to run.',
    alternateTitles: ['Coder', 'Application Programmer'],
  },
  {
    socCode: '29-1141.00',
    title: 'Registered Nurses',
    description: 'Assess patient health problems and needs, develop and implement nursing care plans.',
    alternateTitles: ['RN', 'Staff Nurse', 'Clinical Nurse'],
  },
  {
    socCode: '25-2021.00',
    title: 'Elementary School Teachers',
    description: 'Teach academic and social skills to students at the elementary school level.',
    alternateTitles: ['Elementary Teacher', 'Grade School Teacher', 'Primary Teacher'],
  },
  {
    socCode: '43-9061.00',
    title: 'Office Clerks, General',
    description: 'Perform duties too varied and diverse to be classified in any specific office clerical occupation.',
    alternateTitles: ['Office Assistant', 'Administrative Clerk', 'Office Worker'],
  },
  {
    socCode: '47-2111.00',
    title: 'Electricians',
    description: 'Install, maintain, and repair electrical wiring, equipment, and fixtures.',
    alternateTitles: ['Electrical Contractor', 'Maintenance Electrician'],
  },
  {
    socCode: '11-1011.00',
    title: 'Chief Executives',
    description: 'Determine and formulate policies and provide overall direction of companies or private and public sector organizations.',
    alternateTitles: ['CEO', 'President', 'Executive Director', 'Managing Director'],
  },
  {
    socCode: '27-1024.00',
    title: 'Graphic Designers',
    description: 'Design or create graphics to meet specific commercial or promotional needs.',
    alternateTitles: ['Visual Designer', 'UI Designer', 'Graphic Artist'],
  },
];

describe('Job Matcher', () => {
  describe('exact matches', () => {
    it('returns perfect confidence for exact title match', () => {
      const matches = findJobMatchesSync('Software Developers', MOCK_OCCUPATIONS, 5);
      
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].title).toBe('Software Developers');
      expect(matches[0].confidence).toBe(1.0);
    });

    it('is case-insensitive', () => {
      const matches = findJobMatchesSync('SOFTWARE DEVELOPERS', MOCK_OCCUPATIONS, 5);
      
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].title).toBe('Software Developers');
      expect(matches[0].confidence).toBe(1.0);
    });

    it('handles extra whitespace', () => {
      const matches = findJobMatchesSync('  Software   Developers  ', MOCK_OCCUPATIONS, 5);
      
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].title).toBe('Software Developers');
      expect(matches[0].confidence).toBe(1.0);
    });
  });

  describe('alternate title matching', () => {
    it('matches against alternate titles', () => {
      const matches = findJobMatchesSync('Software Engineer', MOCK_OCCUPATIONS, 5);
      
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].socCode).toBe('15-1252.00');
      expect(matches[0].confidence).toBeGreaterThan(0.8);
    });

    it('prefers better alternate title match', () => {
      const matches = findJobMatchesSync('CEO', MOCK_OCCUPATIONS, 5);
      
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].socCode).toBe('11-1011.00'); // Chief Executives
      expect(matches[0].confidence).toBeGreaterThan(0.8);
    });

    it('handles abbreviated titles', () => {
      const matches = findJobMatchesSync('RN', MOCK_OCCUPATIONS, 5);
      
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].socCode).toBe('29-1141.00'); // Registered Nurses
      expect(matches[0].confidence).toBeGreaterThan(0.8);
    });
  });

  describe('fuzzy matching', () => {
    it('handles minor typos', () => {
      const matches = findJobMatchesSync('Softwar Developer', MOCK_OCCUPATIONS, 5);
      
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].socCode).toBe('15-1252.00');
      expect(matches[0].confidence).toBeGreaterThan(0.5);
    });

    it('handles partial matches', () => {
      const matches = findJobMatchesSync('Developer', MOCK_OCCUPATIONS, 5);
      
      expect(matches.length).toBeGreaterThan(0);
      // Should match Software Developers
      const softwareDevMatch = matches.find(m => m.socCode === '15-1252.00');
      expect(softwareDevMatch).toBeDefined();
      expect(softwareDevMatch!.confidence).toBeGreaterThan(0.5);
    });

    it('handles word order variations', () => {
      const matches = findJobMatchesSync('Teacher Elementary', MOCK_OCCUPATIONS, 5);
      
      expect(matches.length).toBeGreaterThan(0);
      // Should still match Elementary School Teachers
      const teacherMatch = matches.find(m => m.socCode === '25-2021.00');
      expect(teacherMatch).toBeDefined();
    });
  });

  describe('substring matching', () => {
    it('matches when query is substring of title', () => {
      const matches = findJobMatchesSync('Graphic', MOCK_OCCUPATIONS, 5);
      
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].socCode).toBe('27-1024.00'); // Graphic Designers
      expect(matches[0].confidence).toBeGreaterThan(0.8);
    });

    it('matches when title is substring of query', () => {
      const matches = findJobMatchesSync('Registered Nurses Specialist', MOCK_OCCUPATIONS, 5);
      
      expect(matches.length).toBeGreaterThan(0);
      const nurseMatch = matches.find(m => m.socCode === '29-1141.00');
      expect(nurseMatch).toBeDefined();
      expect(nurseMatch!.confidence).toBeGreaterThan(0.7);
    });
  });

  describe('result ordering', () => {
    it('returns results sorted by confidence descending', () => {
      const matches = findJobMatchesSync('Developer', MOCK_OCCUPATIONS, 5);
      
      expect(matches.length).toBeGreaterThan(1);
      
      // Check that each match has lower or equal confidence than previous
      for (let i = 1; i < matches.length; i++) {
        expect(matches[i].confidence).toBeLessThanOrEqual(matches[i - 1].confidence);
      }
    });

    it('limits results to maxResults parameter', () => {
      const matches = findJobMatchesSync('Developer', MOCK_OCCUPATIONS, 3);
      
      expect(matches.length).toBeLessThanOrEqual(3);
    });

    it('returns fewer results if not enough good matches', () => {
      const matches = findJobMatchesSync('xyz123nonsensejob', MOCK_OCCUPATIONS, 5);
      
      // Should return 0 results for completely unrelated string
      expect(matches.length).toBe(0);
    });
  });

  describe('confidence thresholds', () => {
    it('filters out very low confidence matches', () => {
      const matches = findJobMatchesSync('Astronaut', MOCK_OCCUPATIONS, 5);
      
      // Should filter out matches below 0.3 threshold
      for (const match of matches) {
        expect(match.confidence).toBeGreaterThanOrEqual(0.3);
      }
    });

    it('includes medium confidence matches', () => {
      const matches = findJobMatchesSync('Nurse', MOCK_OCCUPATIONS, 5);
      
      expect(matches.length).toBeGreaterThan(0);
      const nurseMatch = matches.find(m => m.socCode === '29-1141.00');
      expect(nurseMatch).toBeDefined();
      expect(nurseMatch!.confidence).toBeGreaterThan(0.4);
    });
  });

  describe('return value structure', () => {
    it('includes all required fields', () => {
      const matches = findJobMatchesSync('Software Developer', MOCK_OCCUPATIONS, 5);
      
      expect(matches.length).toBeGreaterThan(0);
      
      const match = matches[0];
      expect(match).toHaveProperty('socCode');
      expect(match).toHaveProperty('title');
      expect(match).toHaveProperty('description');
      expect(match).toHaveProperty('confidence');
      expect(match).toHaveProperty('alternateTitles');
    });

    it('confidence is rounded to 2 decimal places', () => {
      const matches = findJobMatchesSync('Software Developer', MOCK_OCCUPATIONS, 5);
      
      for (const match of matches) {
        // Check that confidence has at most 2 decimal places
        const decimalPart = match.confidence.toString().split('.')[1];
        if (decimalPart) {
          expect(decimalPart.length).toBeLessThanOrEqual(2);
        }
      }
    });

    it('preserves alternate titles from source', () => {
      const matches = findJobMatchesSync('Software Developer', MOCK_OCCUPATIONS, 5);
      
      const devMatch = matches.find(m => m.socCode === '15-1252.00');
      expect(devMatch).toBeDefined();
      expect(devMatch!.alternateTitles).toBeDefined();
      expect(devMatch!.alternateTitles!.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('handles empty query', () => {
      const matches = findJobMatchesSync('', MOCK_OCCUPATIONS, 5);
      
      // Empty query should not match anything well
      expect(matches.length).toBe(0);
    });

    it('handles query with special characters', () => {
      const matches = findJobMatchesSync('Software/Developer', MOCK_OCCUPATIONS, 5);
      
      expect(matches.length).toBeGreaterThan(0);
      // Should still find software developer despite special char
      const devMatch = matches.find(m => m.socCode === '15-1252.00');
      expect(devMatch).toBeDefined();
    });

    it('handles very long query strings', () => {
      const longQuery = 'Software Developer with extensive experience in full-stack development';
      const matches = findJobMatchesSync(longQuery, MOCK_OCCUPATIONS, 5);
      
      expect(matches.length).toBeGreaterThan(0);
      // Should still match based on important words
      const devMatch = matches.find(m => m.socCode === '15-1252.00');
      expect(devMatch).toBeDefined();
    });

    it('handles queries with numbers', () => {
      const matches = findJobMatchesSync('Software Developer 2', MOCK_OCCUPATIONS, 5);
      
      expect(matches.length).toBeGreaterThan(0);
      const devMatch = matches.find(m => m.socCode === '15-1252.00');
      expect(devMatch).toBeDefined();
    });
  });

  describe('real-world job titles', () => {
    it('matches common informal titles', () => {
      const informalTitles = [
        'Coder',
        'Programmer',
        'Software Dev',
        'Office Assistant',
        'Visual Designer',
      ];
      
      for (const title of informalTitles) {
        const matches = findJobMatchesSync(title, MOCK_OCCUPATIONS, 5);
        expect(matches.length).toBeGreaterThan(0);
        expect(matches[0].confidence).toBeGreaterThan(0.6);
      }
    });

    it('disambiguates similar titles', () => {
      const matches = findJobMatchesSync('Programmer', MOCK_OCCUPATIONS, 5);
      
      expect(matches.length).toBeGreaterThan(0);
      
      // Should match both Software Developers and Computer Programmers
      const socCodes = matches.map(m => m.socCode);
      expect(socCodes).toContain('15-1251.00'); // Computer Programmers
      
      // Programmer alternate title should give high confidence to Computer Programmers
      const programmerMatch = matches.find(m => m.socCode === '15-1251.00');
      expect(programmerMatch!.confidence).toBeGreaterThan(0.7);
    });
  });
});
