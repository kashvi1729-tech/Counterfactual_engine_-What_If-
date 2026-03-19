import { motion } from "framer-motion";
import type { Scenario } from "@/data/mockScenarios";

interface TimelineVisualizationProps {
  scenarios: Scenario[];
}

const typeConfig = {
  best: {
    dotClass: "bg-glow-best",
    lineClass: "bg-glow-best/30",
    textClass: "text-glow-best",
    label: "Best",
  },
  worst: {
    dotClass: "bg-glow-worst",
    lineClass: "bg-glow-worst/30",
    textClass: "text-glow-worst",
    label: "Worst",
  },
  likely: {
    dotClass: "bg-glow-likely",
    lineClass: "bg-glow-likely/30",
    textClass: "text-glow-likely",
    label: "Likely",
  },
};

const TimelineVisualization = ({ scenarios }: TimelineVisualizationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <h3 className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-1">
        Timeline Projection
      </h3>
      <p className="text-[10px] font-body text-muted-foreground mb-6">
        How each scenario unfolds over time
      </p>

      <div className="space-y-6">
        {scenarios.map((scenario, si) => {
          const cfg = typeConfig[scenario.type];
          const steps = scenario.reasoning;

          return (
            <div key={scenario.type}>
              {/* Scenario label */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
                <span className={`text-[10px] font-display font-semibold uppercase tracking-widest ${cfg.textClass}`}>
                  {cfg.label} — {scenario.timeframe}
                </span>
              </div>

              {/* Timeline */}
              <div className="relative ml-1">
                {/* Vertical line */}
                <div className={`absolute left-[3px] top-1 bottom-1 w-px ${cfg.lineClass}`} />

                <div className="space-y-3">
                  {steps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.9 + si * 0.2 + i * 0.12,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="flex items-start gap-3 pl-0"
                    >
                      {/* Dot */}
                      <div className="relative flex-shrink-0 mt-1.5">
                        <div className={`w-[7px] h-[7px] rounded-full ${cfg.dotClass}`} />
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.8, 0] }}
                          transition={{
                            delay: 0.9 + si * 0.2 + i * 0.12,
                            duration: 0.8,
                            ease: "easeOut",
                          }}
                          className={`absolute inset-0 rounded-full ${cfg.dotClass} opacity-30`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <span className={`text-[9px] font-display font-bold ${cfg.textClass} block mb-0.5`}>
                          Step {step.step}
                        </span>
                        <span className="text-xs font-body text-secondary-foreground leading-relaxed">
                          {step.text}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default TimelineVisualization;
