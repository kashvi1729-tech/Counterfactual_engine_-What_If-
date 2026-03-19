import { useState, useCallback } from "react";
import { toast } from "sonner";
import DecisionInput from "@/components/DecisionInput";
import SimulationResults from "@/components/SimulationResults";
import type { SimulationResult } from "@/data/mockScenarios";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async (question: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("simulate-decision", {
        body: { question },
      });

      if (error) {
        throw new Error(error.message || "Failed to simulate");
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setResult({
        question: data.question,
        scenarios: data.scenarios,
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate simulation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
