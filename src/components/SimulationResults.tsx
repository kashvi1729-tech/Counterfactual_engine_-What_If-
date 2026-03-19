import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import ScenarioCard from "./ScenarioCard";
import ProbabilityDistribution from "./ProbabilityDistribution";
import TimelineVisualization from "./TimelineVisualization";
import type { SimulationResult } from "@/data/mockScenarios";

interface SimulationResultsProps {
  result: SimulationResult;
  onReset: () => void;
}

const SimulationResults = ({ result, onReset }: SimulationResultsProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
        >
          <ArrowLeft className="w-4 h-4" />
          New simulation
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-display"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-10"
      >
        <p className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-2">
          Simulating
        </p>
        <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">
          "{result.question}"
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {result.scenarios.map((scenario, i) => (
          <ScenarioCard key={scenario.type} scenario={scenario} index={i} />
        ))}
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        <ProbabilityDistribution scenarios={result.scenarios} />
        <TimelineVisualization scenarios={result.scenarios} />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center text-[10px] font-display uppercase tracking-widest text-muted-foreground mt-10"
      >
        Scenarios generated using probabilistic modeling • Not financial advice
      </motion.p>
    </div>
  );
};

export default SimulationResults;
