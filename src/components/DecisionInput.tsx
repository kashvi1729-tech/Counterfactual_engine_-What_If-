import { useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { examplePrompts } from "@/data/mockScenarios";

interface DecisionInputProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

const DecisionInput = ({ onSubmit, isLoading }: DecisionInputProps) => {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) onSubmit(question.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6"
        >
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-display uppercase tracking-widest text-primary">
            Counterfactual Engine
          </span>
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-4 text-foreground">
          What if<span className="text-primary">?</span>
        </h1>
        <p className="text-muted-foreground text-lg font-body max-w-md mx-auto">
          Simulate the outcomes of your life decisions. See best case, worst case, and most likely futures.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative mb-8">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center bg-card border border-border rounded-xl overflow-hidden">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What if I..."
              className="flex-1 bg-transparent px-5 py-4 text-foreground placeholder:text-muted-foreground font-body text-base focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!question.trim() || isLoading}
              className="m-2 px-5 py-2.5 bg-primary text-primary-foreground font-display text-sm font-semibold rounded-lg disabled:opacity-30 hover:brightness-110 transition-all"
            >
              {isLoading ? "Simulating..." : "Simulate"}
            </button>
          </div>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 justify-center">
        {examplePrompts.map((prompt, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            onClick={() => { setQuestion(prompt); onSubmit(prompt); }}
            className="px-3 py-1.5 text-xs font-body text-muted-foreground border border-border rounded-lg hover:border-primary/40 hover:text-foreground transition-all bg-card/50"
          >
            {prompt}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default DecisionInput;
