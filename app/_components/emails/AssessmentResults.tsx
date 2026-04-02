import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Hr,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface AssessmentResultsEmailProps {
  jobTitle: string;
  riskScore: number;
  resultsUrl: string;
  riskLevel: string;
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '580px',
};

const heading = {
  fontSize: '24px',
  fontWeight: 600 as const,
  color: '#0f172a',
  marginBottom: '24px',
};

const scoreSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
  padding: '32px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
};

const scoreText = {
  fontSize: '72px',
  fontWeight: 700 as const,
  margin: '0',
  lineHeight: '1',
};

const riskLevelText = {
  fontSize: '20px',
  color: '#64748b',
  margin: '12px 0 0 0',
};

const jobTitleText = {
  fontSize: '18px',
  color: '#475569',
  margin: '16px 0 0 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#374151',
  margin: '16px 0',
};

const list = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#374151',
  paddingLeft: '20px',
  margin: '16px 0',
};

const button = {
  backgroundColor: '#18181b',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 600 as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 24px',
  margin: '32px auto',
  maxWidth: '280px',
};

const footer = {
  fontSize: '12px',
  color: '#64748b',
  lineHeight: '20px',
  marginTop: '32px',
  textAlign: 'center' as const,
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 0',
};

export function getScoreColor(score: number): string {
  if (score <= 20) return '#16a34a';
  if (score <= 40) return '#ca8a04';
  if (score <= 60) return '#ea580c';
  if (score <= 80) return '#dc2626';
  return '#b91c1c';
}

export function AssessmentResultsEmail({
  jobTitle,
  riskScore,
  resultsUrl,
  riskLevel,
}: AssessmentResultsEmailProps) {
  const scoreColor = getScoreColor(riskScore);

  return (
    <Html>
      <Head />
      <Preview>{`Your ${riskScore}% AI displacement risk score for ${jobTitle}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Your AI Risk Assessment Results</Heading>

          <Section style={scoreSection}>
            <Text style={{ ...scoreText, color: scoreColor }}>{riskScore}%</Text>
            <Text style={riskLevelText}>{riskLevel}</Text>
            <Text style={jobTitleText}>{jobTitle}</Text>
          </Section>

          <Text style={paragraph}>
            Your <strong>{jobTitle}</strong> role has a {riskScore}% AI displacement risk score
            based on our 4-layer analysis:
          </Text>

          <ul style={list}>
            <li>Task-level AI exposure analysis</li>
            <li>Automation potential assessment</li>
            <li>Industry adoption speed factor</li>
            <li>Experience protection modifier</li>
          </ul>

          <Link href={resultsUrl} style={button}>
            View Full Results →
          </Link>

          <Hr style={hr} />

          <Text style={footer}>
            This assessment is based on O*NET occupational data and published AI exposure research
            from Eloundou et al. and Felten et al.
            <br />
            <br />
            <Link href="https://unautomatable.ai/help" style={{ color: '#64748b' }}>
              Learn more about our methodology
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default AssessmentResultsEmail;
