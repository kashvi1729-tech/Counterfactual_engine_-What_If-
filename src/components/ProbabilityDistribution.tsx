import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts";
import type { Scenario } from "@/data/mockScenarios";

interface ProbabilityDistributionProps {
  scenarios: Scenario[];
}

// Generate a bell-curve-like distribution for each scenario
function generateDistribution(mean: number, spread: number, color: string) {
  const points = [];
  for (let x = 0; x <= 100; x += 2) {
    const exponent = -0.5 * Math.pow((x - mean) / spread, 2);
    const y = Math.exp(exponent);
    points.push({ x, [color]: y });
  }
  return points;
}

function mergeDistributions(scenarios: Scenario[]) {
  const configs = {
    best: { spread: 12, key: "best" },
    worst: { spread: 10, key: "worst" },
    likely: { spread: 15, key: "likely" },
  };

  const merged: Record<string, number>[] = [];
  for (let x = 0; x <= 100; x += 2) {
    const point: Record<string, number> = { x };
    scenarios.forEach((s) => {
      const cfg = configs[s.type];
      const exponent = -0.5 * Math.pow((x - s.probability) / cfg.spread, 2);
      point[cfg.key] = Math.exp(exponent) * (s.probability / 100);
    });
    merged.push(point);
  }
  return merged;
}

const ProbabilityDistribution = ({ scenarios }: ProbabilityDistributionProps) => {
  const data = mergeDistributions(scenarios);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <h3 className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-1">
        Probability Distribution
      </h3>
      <p className="text-[10px] font-body text-muted-foreground mb-4">
        Likelihood curves for each scenario outcome
      </p>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <defs>
              <linearGradient id="gradBest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradWorst" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradLikely" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(210, 80%, 55%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(210, 80%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="x"
              tick={{ fontSize: 9, fill: "hsl(240, 5%, 50%)" }}
              tickFormatter={(v) => `${v}%`}
              axisLine={{ stroke: "hsl(240, 10%, 16%)" }}
              tickLine={false}
              interval={9}
            />
            <YAxis hide />
            {scenarios.map((s) => (
              <ReferenceLine
                key={s.type}
                x={s.probability}
                stroke={
                  s.type === "best"
                    ? "hsl(142, 70%, 45%)"
                    : s.type === "worst"
                    ? "hsl(0, 72%, 51%)"
                    : "hsl(210, 80%, 55%)"
                }
                strokeDasharray="3 3"
                strokeOpacity={0.5}
              />
            ))}
            <Area
              type="monotone"
              dataKey="best"
              stroke="hsl(142, 70%, 45%)"
              fill="url(#gradBest)"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive
              animationDuration={1200}
              animationBegin={400}
            />
            <Area
              type="monotone"
              dataKey="worst"
              stroke="hsl(0, 72%, 51%)"
              fill="url(#gradWorst)"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive
              animationDuration={1200}
              animationBegin={600}
            />
            <Area
              type="monotone"
              dataKey="likely"
              stroke="hsl(210, 80%, 55%)"
              fill="url(#gradLikely)"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive
              animationDuration={1200}
              animationBegin={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-3">
        {[
          { label: "Best Case", color: "bg-glow-best" },
          { label: "Worst Case", color: "bg-glow-worst" },
          { label: "Most Likely", color: "bg-glow-likely" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${item.color}`} />
            <span className="text-[10px] font-display text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProbabilityDistribution;
