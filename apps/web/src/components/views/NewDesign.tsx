import { useState } from 'react';
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { TEMPLATES } from '@/lib/mock-data';
import type { SavedDesign, ViewKey } from '@/lib/types';
import { cx } from '@/lib/helpers';
import { Button } from "../ui/button";

interface NewDesignProps {
  onGenerate: (prompt: string, scale: string) => Promise<SavedDesign>;
  onNavigate: (v: ViewKey, design?: SavedDesign) => void;
}

const SCALES = [
  { id: 'startup', label: 'Startup', desc: '< 100K users' },
  { id: 'growth', label: 'Growth', desc: '100K — 1M users' },
  { id: 'large', label: 'Large Scale', desc: '1M — 50M users' },
  { id: 'internet', label: 'Internet Scale', desc: '50M+ users' },
];

export function NewDesign({ onGenerate, onNavigate }: NewDesignProps) {
  const [prompt, setPrompt] = useState('');
  const [scale, setScale] = useState('large');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || generating) return;
    setGenerating(true);
    setError(null);
    try {
      const design = await onGenerate(prompt.trim(), scale);
      onNavigate("architecture", design);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not generate this architecture.');
    } finally {
      setGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="h-full overflow-y-auto flex items-center justify-center">
      <div className="w-full max-w-[640px] px-6 py-8">
        {/* Label */}
        <div className="flex items-center gap-2 mb-4 justify-center">
          <Sparkles
            size={14}
            className="text-[var(--accent-primary)]"
            strokeWidth={1.8}
          />
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            AI-Powered System Design
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[26px] font-bold tracking-tight text-[var(--text-primary)] text-center mb-2">
          What do you want to design?
        </h1>
        <p className="text-[13px] text-[var(--text-secondary)] text-center mb-8">
          Describe your system, product, scale or constraints.
        </p>

        {/* Input */}
        <div
          className={cx(
            "border bg-[var(--bg-elevated)] transition-all",
            prompt
              ? "border-[var(--accent-primary)]"
              : "border-dashed border-[var(--border-default)]",
          )}
        >
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              "Design a WhatsApp-like messaging system for\n100 million users with low-latency messaging."
            }
            rows={5}
            maxLength={4000}
            className="w-full bg-transparent outline-none px-4 py-3 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none"
          />
          <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border-subtle)]">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
              {prompt.length} CHARS
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
              ⌘ + ENTER
            </span>
          </div>
        </div>

        {/* Scale selector */}
        <div className="mt-6">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2">
            Scale
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SCALES.map((s) => (
              <button
                key={s.id}
                onClick={() => setScale(s.id)}
                className={cx(
                  "px-3 py-2.5 border text-left transition-all",
                  scale === s.id
                    ? "border-[var(--accent-primary)] bg-[var(--accent-glow)]"
                    : "border-[var(--border-default)] hover:border-[var(--border-strong)]",
                )}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={cx(
                      "w-2 h-2 rounded-full",
                      scale === s.id
                        ? "bg-[var(--accent-primary)]"
                        : "bg-[var(--border-strong)]",
                    )}
                  />
                  <span
                    className={cx(
                      "text-[12px] font-medium",
                      scale === s.id
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)]",
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-[var(--text-muted)] ml-4">
                  {s.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div className="mt-6">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2">
            Quick Templates
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() =>
                  setPrompt(
                    `Design a ${t.name.toLowerCase()} for ${t.users} with high availability and low latency.`,
                  )
                }
                className="px-2.5 py-1.5 border border-dashed border-[var(--border-default)] text-[11px] font-medium text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || generating}
          className="group flex items-center gap-2 w-full my-5"
        >
          {generating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Generating Architecture...</span>
            </>
          ) : (
            <>
              <span>Generate Architecture</span>
              <ArrowRight
                size={15}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </>
          )}
        </Button>

        {error && (
          <p role="alert" className="mt-3 text-[12px] text-[var(--error)]">
            {error}
          </p>
        )}

        {/* Generating progress */}
        {generating && (
          <div className="mt-4 space-y-1.5 animate-fade-in">
            {[
              "Analyzing requirements...",
              "Selecting components...",
              "Estimating capacity...",
              "Drawing architecture...",
            ].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <Loader2
                  size={11}
                  className="animate-spin text-[var(--accent-primary)]"
                  style={{ animationDelay: `${i * 300}ms` }}
                />
                <span className="font-mono text-[10px] text-[var(--text-muted)]">
                  {step}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
