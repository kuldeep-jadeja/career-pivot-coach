import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Risk Assessment | Unautomatable",
  description:
    "Assess your career AI displacement risk in under 5 minutes. Free, no account required.",
};

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-[640px] px-4 py-8">{children}</main>
    </div>
  );
}
