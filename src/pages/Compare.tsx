import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowLeftRight, Zap, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ComparisonScenario from "@/components/ComparisonScenario";
import type { SimulationResult } from "@/data/mockScenarios";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Side = "left" | "right";

const Compare = () => {
  const [questionA, setQuestionA] = useState("");
  const [questionB, setQuestionB] = useState("");
  const [resultA, setResultA] = useState<SimulationResult | null>(null);
  const [resultB, setResultB] = useState<SimulationResult | null>(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const { user } = useAuth();

  const simulate = useCallback(async (question: string, side: Side) => {
    const setLoading = side === "left" ? setLoadingA : setLoadingB;
    const setResult = side === "left" ? setResultA : setResultB;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("simulate-decision", {
        body: { question },
      });
      if (error) throw new Error(error.message);
      if (data?.error) { toast.error(data.error); return; }

      const simResult: SimulationResult = { question: data.question, scenarios: data.scenarios };
      setResult(simResult);

      if (user) {
        await supabase.from("simulations").insert({
          user_id: user.id,
          question: simResult.question,
          scenarios: simResult.scenarios as any,
        });
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to simulate. Try again.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionA.trim() && !loadingA && !resultA) simulate(questionA.trim(), "left");
    if (questionB.trim() && !loadingB && !resultB) simulate(questionB.trim(), "right");
  };

  const bothReady = resultA && resultB;

  const handleReset = () => {
    setResultA(null);
    setResultB(null);
    setQuestionA("");
    setQuestionB("");
  };

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

      <div className="relative z-10 px-5 pt-5">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to simulator
        </Link>
      </div>

      <main className="relative flex-1 px-5 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-4">
              <ArrowLeftRight className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-display uppercase tracking-widest text-primary">
                Compare Mode
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Compare Two Paths
            </h1>
            <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
              Enter two different decisions and see how their outcomes stack up side by side.
            </p>
          </motion.div>

          {/* Input form */}
          {!bothReady && (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
            >
              {/* Decision A */}
              <div>
                <label className="text-[10px] font-display uppercase tracking-widest text-glow-best mb-2 block">
                  Path A
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={questionA}
                    onChange={(e) => setQuestionA(e.target.value)}
                    placeholder="What if I..."
                    disabled={loadingA || !!resultA}
                    className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-glow-best/50 disabled:opacity-50"
                  />
                  {resultA && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-display text-glow-best">✓ Done</span>
                  )}
                </div>
              </div>

              {/* Decision B */}
              <div>
                <label className="text-[10px] font-display uppercase tracking-widest text-glow-likely mb-2 block">
                  Path B
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={questionB}
                    onChange={(e) => setQuestionB(e.target.value)}
                    placeholder="What if I..."
                    disabled={loadingB || !!resultB}
                    className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-glow-likely/50 disabled:opacity-50"
                  />
                  {resultB && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-display text-glow-likely">✓ Done</span>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 flex justify-center">
                <button
                  type="submit"
                  disabled={!questionA.trim() || !questionB.trim() || (loadingA && loadingB)}
                  className="px-8 py-3 bg-primary text-primary-foreground font-display text-sm font-semibold rounded-lg disabled:opacity-30 hover:brightness-110 transition-all flex items-center gap-2"
                >
                  {(loadingA || loadingB) ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Simulating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Simulate Both
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}

          {/* Results comparison */}
          <AnimatePresence>
            {bothReady && resultA && resultB && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex justify-center mb-8">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 text-xs font-display text-muted-foreground hover:text-foreground border border-border rounded-lg hover:border-primary/40 transition-all"
                  >
                    New Comparison
                  </button>
                </div>

                {/* Side by side headers */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-[10px] font-display uppercase tracking-widest text-glow-best mb-1">Path A</p>
                    <h3 className="text-sm md:text-base font-display font-bold text-foreground leading-tight">
                      "{resultA.question}"
                    </h3>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-display uppercase tracking-widest text-glow-likely mb-1">Path B</p>
                    <h3 className="text-sm md:text-base font-display font-bold text-foreground leading-tight">
                      "{resultB.question}"
                    </h3>
                  </div>
                </div>

                {/* Scenario rows */}
                {(["best", "worst", "likely"] as const).map((type, ri) => {
                  const scenA = resultA.scenarios.find((s) => s.type === type);
                  const scenB = resultB.scenarios.find((s) => s.type === type);
                  if (!scenA || !scenB) return null;

                  return (
                    <motion.div
                      key={type}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: ri * 0.15 }}
                      className="grid grid-cols-2 gap-4 mb-4"
                    >
                      <div className="rounded-xl border border-border bg-card p-4">
                        <ComparisonScenario scenario={scenA} side="left" />
                        <div className="flex flex-wrap gap-1 mt-3">
                          {scenA.keyOutcomes.slice(0, 3).map((o, i) => (
                            <span key={i} className="px-2 py-0.5 text-[9px] font-body bg-muted rounded text-muted-foreground">
                              {o}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-xl border border-border bg-card p-4">
                        <ComparisonScenario scenario={scenB} side="right" />
                        <div className="flex flex-wrap gap-1 mt-3">
                          {scenB.keyOutcomes.slice(0, 3).map((o, i) => (
                            <span key={i} className="px-2 py-0.5 text-[9px] font-body bg-muted rounded text-muted-foreground">
                              {o}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Probability comparison bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="rounded-xl border border-border bg-card p-5 mt-6"
                >
                  <h4 className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-4 text-center">
                    "Most Likely" Probability Comparison
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] font-display mb-1">
                        <span className="text-glow-best">Path A</span>
                        <span className="text-glow-best">
                          {resultA.scenarios.find((s) => s.type === "likely")?.probability ?? 0}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${resultA.scenarios.find((s) => s.type === "likely")?.probability ?? 0}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-glow-best rounded-full"
                        />
                      </div>
                    </div>
                    <ArrowLeftRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] font-display mb-1">
                        <span className="text-glow-likely">Path B</span>
                        <span className="text-glow-likely">
                          {resultB.scenarios.find((s) => s.type === "likely")?.probability ?? 0}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${resultB.scenarios.find((s) => s.type === "likely")?.probability ?? 0}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-glow-likely rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-center text-[10px] font-display uppercase tracking-widest text-muted-foreground mt-8"
                >
                  Side-by-side comparison • Not financial advice
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Compare;
