import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AnalysisResult } from '@/types';

interface AIContextValue {
  history: AnalysisResult[];
  addAnalysis: (result: AnalysisResult) => void;
  clearHistory: () => void;
}

const AIContext = createContext<AIContextValue | null>(null);

export function AIProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  const addAnalysis = (result: AnalysisResult) => {
    setHistory(prev => [result, ...prev]);
  };

  const clearHistory = () => setHistory([]);

  return (
    <AIContext.Provider value={{ history, addAnalysis, clearHistory }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error('useAI must be used within AIProvider');
  return ctx;
}
