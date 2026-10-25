import { GitCompare, ArrowRight, Check } from 'lucide-react';
import { TRADEOFFS } from '@/lib/mock-data';
import { cx } from '@/lib/helpers';

const RATING_CONFIG: Record<string, { label: string; color: string; bars: number }> = {
  excellent: { label: 'Excellent', color: 'var(--accent-primary)', bars: 5 },
  good: { label: 'Good', color: 'var(--accent-primary)', bars: 4 },
  moderate: { label: 'Moderate', color: 'var(--warn)', bars: 3 },
  fair: { label: 'Fair', color: 'var(--warn)', bars: 2 },
  poor: { label: 'Poor', color: 'var(--error)', bars: 1 },
};

export function TradeOffs() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[800px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <GitCompare size={14} className="text-[var(--accent-primary)]" strokeWidth={1.8} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">TRADE-OFFS</span>
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-[var(--text-primary)]">Trade-off Analysis</h1>
          <p className="font-mono text-[11px] text-[var(--text-muted)] mt-1">{TRADEOFFS.length} key decisions analyzed</p>
        </div>

        {TRADEOFFS.map((to, idx) => (
          <div key={to.id} className="mb-8">
            {/* Decision label */}
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[9px] text-[var(--text-muted)]">0{idx + 1}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{to.decision}</span>
            </div>

            {/* Choice */}
            <div className="border border-[var(--border-default)] bg-[var(--bg-elevated)]">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <Check size={14} className="text-[var(--accent-primary)]" strokeWidth={2} />
                <span className="text-[15px] font-bold tracking-tight text-[var(--text-primary)]">{to.choice}</span>
                <span className="ml-auto font-mono text-[9px] uppercase tracking-wider text-[var(--accent-primary)] border border-[var(--accent-primary)] px-1.5 py-0.5">SELECTED</span>
              </div>

              {/* Attributes */}
              <div>
                {to.attributes.map((attr, i) => {
                  const cfg = RATING_CONFIG[attr.rating];
                  return (
                    <div
                      key={attr.label}
                      className={cx(
                        'flex items-center gap-4 px-4 py-2.5',
                        i > 0 && 'border-t border-[var(--border-subtle)]'
                      )}
                    >
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] w-40 shrink-0">{attr.label}</span>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <div
                              key={n}
                              className="w-5 h-1.5"
                              style={{
                                background: n <= cfg.bars ? cfg.color : 'var(--bg-surface-2)',
                              }}
                            />
                          ))}
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: cfg.color }}>
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reasoning */}
              <div className="border-t border-[var(--border-subtle)] p-4">
                <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2">Why?</div>
                <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">{to.reasoning}</p>
              </div>

              {/* Alternatives */}
              <div className="border-t border-[var(--border-subtle)] px-4 py-3">
                <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2">Alternatives</div>
                <div className="flex flex-wrap gap-2">
                  {to.alternatives.map((alt) => (
                    <span
                      key={alt}
                      className="flex items-center gap-1.5 px-2.5 py-1 border border-dashed border-[var(--border-default)] text-[11px] text-[var(--text-secondary)]"
                    >
                      <ArrowRight size={11} className="text-[var(--text-muted)]" />
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
