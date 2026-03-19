export interface ReasoningStep {
  step: number;
  text: string;
}

export interface Scenario {
  type: "best" | "worst" | "likely";
  title: string;
  summary: string;
  probability: number;
  timeframe: string;
  reasoning: ReasoningStep[];
  keyOutcomes: string[];
}

export interface SimulationResult {
  question: string;
  scenarios: Scenario[];
}

export const examplePrompts = [
  "What if I take a gap year before grad school?",
  "What if I switch from engineering to product design?",
  "What if I invest $10k in index funds vs. saving in a bank?",
  "What if I move to a new city with no connections?",
  "What if I start a side business while keeping my day job?",
];

export const mockResults: Record<string, SimulationResult> = {
  default: {
    question: "What if I take a gap year before grad school?",
    scenarios: [
      {
        type: "best",
        title: "Best Case",
        summary: "You gain clarity, build a portfolio of real-world experience, and enter grad school with stronger conviction and a competitive edge.",
        probability: 25,
        timeframe: "12-18 months",
        reasoning: [
          { step: 1, text: "Gap year provides time for self-directed exploration and skill-building" },
          { step: 2, text: "Real-world experience makes grad school applications more compelling" },
          { step: 3, text: "You discover a niche passion that aligns perfectly with a research lab" },
          { step: 4, text: "Enter grad school with published work or industry connections" },
        ],
        keyOutcomes: [
          "Stronger application narrative",
          "Industry network built early",
          "Clear research direction",
          "Potential scholarship opportunities",
        ],
      },
      {
        type: "worst",
        title: "Worst Case",
        summary: "You lose momentum, struggle to re-enter academic mode, and fall behind peers who went straight through.",
        probability: 15,
        timeframe: "12-24 months",
        reasoning: [
          { step: 1, text: "Without structure, gap year becomes unfocused drifting" },
          { step: 2, text: "Academic skills atrophy without consistent practice" },
          { step: 3, text: "Financial pressure from gap year costs creates stress" },
          { step: 4, text: "Re-application process feels demoralizing after time away" },
        ],
        keyOutcomes: [
          "Academic readiness decline",
          "Financial strain",
          "Motivation loss",
          "Delayed career timeline by 1-2 years",
        ],
      },
      {
        type: "likely",
        title: "Most Likely",
        summary: "A mixed experience — you gain some valuable perspective and skills, face some uncertainty, but ultimately return to grad school slightly better prepared.",
        probability: 60,
        timeframe: "12-15 months",
        reasoning: [
          { step: 1, text: "First 3 months: adjustment period with some productive exploration" },
          { step: 2, text: "Months 4-8: find a meaningful project or job that builds relevant skills" },
          { step: 3, text: "Months 9-12: begin re-application process with new experiences to draw from" },
          { step: 4, text: "Net result: slight advantage over straight-through path, with broader perspective" },
        ],
        keyOutcomes: [
          "Moderate skill development",
          "Better self-awareness",
          "Slightly delayed but more informed path",
          "Some financial trade-off",
        ],
      },
    ],
  },
};
