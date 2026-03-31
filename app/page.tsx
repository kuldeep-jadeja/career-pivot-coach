import { Button } from "./_components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-8">
      <h1 className="text-4xl font-bold">Career Pivot Coach</h1>
      <div className="flex gap-4">
        <Button>Get Started</Button>
        <Button variant="outline">Learn More</Button>
        <Button variant="secondary">View Demo</Button>
      </div>
    </div>
  );
}

