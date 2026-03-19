import { useState, useCallback } from "react";
import DecisionInput from "@/components/DecisionInput";
import SimulationResults from "@/components/SimulationResults";
import { mockResults, type SimulationResult } from "@/data/mockScenarios";

const Index = () => {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback((question: string) => {
    setIsLoading(true);
    // Simulate AI processing delay
    setTimeout(() => {
      setResult({
        ...mockResults.default,
        question,
      });
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <main className="relative flex-1 flex items-center justify-center px-5 py-16">
        {result ? (
          <SimulationResults result={result} onReset={handleReset} />
        ) : (
          <DecisionInput onSubmit={handleSubmit} isLoading={isLoading} />
        )}
      </main>
    </div>
  );
};

export default Index;
