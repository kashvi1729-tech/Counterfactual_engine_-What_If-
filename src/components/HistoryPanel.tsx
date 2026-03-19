import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, X, Trash2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { SimulationResult } from "@/data/mockScenarios";
import { toast } from "sonner";

interface HistoryEntry {
  id: string;
  question: string;
  scenarios: any;
  created_at: string;
}

interface HistoryPanelProps {
  onSelect: (result: SimulationResult) => void;
  refreshKey: number;
}

const HistoryPanel = ({ onSelect, refreshKey }: HistoryPanelProps) => {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("simulations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setEntries(data as HistoryEntry[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open && user) fetchHistory();
  }, [open, user, refreshKey]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase.from("simulations").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast.success("Simulation deleted");
    }
  };

  const handleSelect = (entry: HistoryEntry) => {
    onSelect({ question: entry.question, scenarios: entry.scenarios });
    setOpen(false);
  };

  if (!user) return null;

  return (
    <>
      {/* Trigger button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setOpen(true)}
        className="fixed top-5 right-5 z-40 flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all text-xs font-display"
      >
        <History className="w-3.5 h-3.5" />
        History
      </motion.button>

      {/* Overlay + Panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm border-l border-border bg-card flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-display font-bold text-foreground">
                    Simulation History
                  </h2>
                </div>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {loading ? (
                  <div className="text-center text-muted-foreground text-xs font-body py-10">Loading...</div>
                ) : entries.length === 0 ? (
                  <div className="text-center text-muted-foreground text-xs font-body py-10">
                    No simulations yet. Run one to get started!
                  </div>
                ) : (
                  entries.map((entry) => (
                    <motion.button
                      key={entry.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => handleSelect(entry)}
                      className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/30 bg-card hover:bg-muted/30 transition-all group"
                    >
                      <p className="text-sm font-body text-foreground line-clamp-2 mb-2">
                        {entry.question}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span className="text-[10px] font-display">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleDelete(entry.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default HistoryPanel;
