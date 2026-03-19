import { motion } from "framer-motion";
import { ArrowLeftRight } from "lucide-react";
import type { Scenario } from "@/data/mockScenarios";

interface ComparisonScenarioProps {
  scenario: Scenario;
  side: "left" | "right";
}

const typeConfig = {
  best: { textClass: "text-glow-best", barColor: "bg-glow-best", label: "BEST" },
  worst: { textClass: "text-glow-worst", barColor: "bg-glow-worst", label: "WORST" },
  likely: { textClass: "text-glow-likely", barColor: "bg-glow-likely", label: "LIKELY" },
};

const ComparisonScenario = ({ scenario, side }: ComparisonScenarioProps) => {
  const c = typeConfig[scenario.type];
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className={`text-[9px] font-display font-semibold tracking-widest ${c.textClass}`}>
          {c.label}
        </span>
        <span className={`text-[9px] font-display ${c.textClass}`}>{scenario.probability}%</span>
      </div>
      <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${scenario.probability}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full ${c.barColor} rounded-full`}
        />
      </div>
      <p className="text-[11px] font-body text-secondary-foreground leading-relaxed">{scenario.summary}</p>
    </div>
  );
};

export default ComparisonScenario;
