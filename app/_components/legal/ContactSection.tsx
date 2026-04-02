import { HelpCircle, Mail, MessageSquare } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/app/_components/ui/card';

export function ContactSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5" />
          Contact &amp; Support
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div>
            <p className="font-medium">Email Support</p>
            <p className="mb-2 text-sm text-muted-foreground">
              For questions about your assessment or technical issues
            </p>
            <a href="mailto:support@unautomatable.ai" className="text-primary hover:underline">
              support@unautomatable.ai
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div>
            <p className="font-medium">Methodology Questions</p>
            <p className="mb-2 text-sm text-muted-foreground">
              For questions about our research methodology or data sources
            </p>
            <a href="mailto:research@unautomatable.ai" className="text-primary hover:underline">
              research@unautomatable.ai
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
