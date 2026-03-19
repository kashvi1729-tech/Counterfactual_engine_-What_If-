import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { LogIn, LogOut, User, ArrowLeftRight } from "lucide-react";
import DecisionInput from "@/components/DecisionInput";
import SimulationResults from "@/components/SimulationResults";
import HistoryPanel from "@/components/HistoryPanel";
import type { SimulationResult } from "@/data/mockScenarios";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const { user, signOut } = useAuth();

  const handleSubmit = useCallback(async (question: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("simulate-decision", {
        body: { question },
      });

      if (error) throw new Error(error.message || "Failed to simulate");
      if (data?.error) {
        toast.error(data.error);
        return;
      }

      const simResult: SimulationResult = {
        question: data.question,
        scenarios: data.scenarios,
      };

      setResult(simResult);

      // Save to database if logged in
      if (user) {
        const { error: saveError } = await supabase.from("simulations").insert({
          user_id: user.id,
          question: simResult.question,
          scenarios: simResult.scenarios as any,
        });
        if (saveError) {
          console.error("Failed to save simulation:", saveError);
        } else {
          setHistoryRefreshKey((k) => k + 1);
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate simulation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const handleReset = useCallback(() => {
    setResult(null);
  }, []);

  const handleSelectHistory = useCallback((r: SimulationResult) => {
    setResult(r);
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

      {/* Auth bar */}
      <div className="relative z-30 flex items-center justify-end gap-3 px-5 pt-4">
        {user ? (
          <>
            <span className="text-[10px] font-display text-muted-foreground flex items-center gap-1">
              <User className="w-3 h-3" />
              {user.email}
            </span>
            <button
              onClick={signOut}
              className="flex items-center gap-1 text-[10px] font-display text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-3 h-3" />
              Sign out
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/80 text-xs font-display text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
          >
            <LogIn className="w-3 h-3" />
            Sign in to save history
          </Link>
        )}
      </div>

      {/* History panel */}
      <HistoryPanel onSelect={handleSelectHistory} refreshKey={historyRefreshKey} />

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
