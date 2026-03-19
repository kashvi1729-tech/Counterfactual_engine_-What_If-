import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Target, ChevronRight } from "lucide-react";
import type { Scenario } from "@/data/mockScenarios";

interface ScenarioCardProps {
  scenario: Scenario;
  index: number;
}

const config = {
  best: {
    icon: TrendingUp,
    glowClass: "glow-best",
    borderClass: "border-glow-best",
    textClass: "text-glow-best",
    barColor: "bg-glow-best",
    label: "BEST CASE",
  },
  worst: {
    icon: TrendingDown,
    glowClass: "glow-worst",
    borderClass: "border-glow-worst",
    textClass: "text-glow-worst",
    barColor: "bg-glow-worst",
    label: "WORST CASE",
  },
  likely: {
    icon: Target,
    glowClass: "glow-likely",
    borderClass: "border-glow-likely",
    textClass: "text-glow-likely",
    barColor: "bg-glow-likely",
    label: "MOST LIKELY",
  },
};

const ScenarioCard = ({ scenario, index }: ScenarioCardProps) => {
  const c = config[scenario.type];
  const Icon = c.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-xl border ${c.borderClass} bg-card p-6 ${c.glowClass} flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${c.textClass}`} />
          <span className={`text-xs font-display font-semibold tracking-widest ${c.textClass}`}>
            {c.label}
          </span>
        </div>
        <span className={`text-xs font-display ${c.textClass}`}>
          {scenario.probability}% probability
        </span>
      </div>

      {/* Probability bar */}
      <div className="w-full h-1 bg-muted rounded-full mb-5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${scenario.probability}%` }}
          transition={{ delay: index * 0.15 + 0.4, duration: 0.8, ease: "easeOut" }}
          className={`h-full ${c.barColor} rounded-full`}
        />
      </div>

      {/* Summary */}
      <p className="text-foreground font-body text-sm leading-relaxed mb-5">
        {scenario.summary}
      </p>

      {/* Reasoning chain */}
      <div className="mb-5 flex-1">
        <h4 className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-3">
          Reasoning Chain
        </h4>
        <div className="space-y-2">
          {scenario.reasoning.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 + 0.5 + i * 0.1 }}
              className="flex items-start gap-2"
            >
              <span className={`text-[10px] font-display font-bold mt-0.5 ${c.textClass} shrink-0`}>
                {String(r.step).padStart(2, "0")}
              </span>
              <ChevronRight className={`w-3 h-3 mt-0.5 ${c.textClass} shrink-0 opacity-50`} />
              <span className="text-xs text-secondary-foreground font-body leading-relaxed">
                {r.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Key outcomes */}
      <div>
        <h4 className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-2">
          Key Outcomes
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {scenario.keyOutcomes.map((outcome, i) => (
            <span
              key={i}
              className="px-2 py-1 text-[10px] font-body bg-muted rounded-md text-muted-foreground"
            >
              {outcome}
            </span>
          ))}
        </div>
      </div>

      {/* Timeframe */}
      <div className="mt-4 pt-3 border-t border-border">
        <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
          Timeframe: {scenario.timeframe}
        </span>
      </div>
    </motion.div>
  );
};

export default ScenarioCard;
