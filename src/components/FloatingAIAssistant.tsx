"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const FloatingAIAssistant: React.FC = () => {
  const router = useRouter();

  const handleOpenAssistant = () => {
    router.push("/ai-assistant");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleOpenAssistant}
        aria-label="Open AI Assistant"
        title="Open AI Assistant"
        className="w-14 h-14 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] shadow-lg hover:shadow-xl hover:bg-[var(--color-accent)]/90 transition-all duration-300 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-display font-semibold text-sm relative">
          AI
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-[var(--color-primary)]" />
          </span>
        </div>
      </button>
    </div>
  );
};

export default FloatingAIAssistant;
