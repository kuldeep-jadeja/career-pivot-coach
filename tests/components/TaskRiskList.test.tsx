import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ScoreInterpretation } from '@/app/_components/results/ScoreInterpretation';
import { TaskRiskList, type TaskWithRisk } from '@/app/_components/results/TaskRiskList';

const tasks: TaskWithRisk[] = [
  {
    taskId: 'task-low',
    description: 'Coach team members through ambiguous stakeholder conflict',
    riskLevel: 'LOW',
    automationProbability: 0.2,
  },
  {
    taskId: 'task-high',
    description: 'Compile weekly status reports from spreadsheet data',
    riskLevel: 'HIGH',
    automationProbability: 0.9,
  },
  {
    taskId: 'task-medium',
    description: 'Review incoming tickets and assign priority labels',
    riskLevel: 'MEDIUM',
    automationProbability: 0.5,
  },
];

describe('TaskRiskList', () => {
  it('renders tasks sorted by automation risk (highest first)', () => {
    render(<TaskRiskList tasks={tasks} />);

    const descriptions = screen.getAllByText(/Compile weekly status reports|Review incoming tickets|Coach team members/i);
    expect(descriptions[0]).toHaveTextContent('Compile weekly status reports from spreadsheet data');
    expect(descriptions[1]).toHaveTextContent('Review incoming tickets and assign priority labels');
    expect(descriptions[2]).toHaveTextContent('Coach team members through ambiguous stakeholder conflict');
  });

  it('shows risk badges for each task', () => {
    render(<TaskRiskList tasks={tasks} />);

    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    expect(screen.getByText('LOW')).toBeInTheDocument();
  });

  it('renders empty state when no tasks available', () => {
    render(<TaskRiskList tasks={[]} />);
    expect(screen.getByText('No task data available for this occupation.')).toBeInTheDocument();
  });
});

describe('ScoreInterpretation', () => {
  it('shows very high risk interpretation for high scores', () => {
    render(<ScoreInterpretation score={92} jobTitle="Accountant" />);
    expect(screen.getByText('Your role is highly exposed to AI automation')).toBeInTheDocument();
    expect(screen.getByText(/Accountant/)).toBeInTheDocument();
  });

  it('shows low risk interpretation for low scores', () => {
    render(<ScoreInterpretation score={15} jobTitle="Therapist" />);
    expect(
      screen.getByText('Your role shows strong resilience to AI automation')
    ).toBeInTheDocument();
  });
});

