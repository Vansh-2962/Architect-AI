import { Calculator, TrendingUp, Database, HardDrive, Zap } from 'lucide-react';
import { formatNumber } from '@/lib/helpers';
import { cx } from '@/lib/helpers';

const INPUTS = [
  { label: 'DAU', value: '100,000,000', display: '100M' },
  { label: 'Requests / user / day', value: '50', display: '50' },
  { label: 'Peak multiplier', value: '3×', display: '3×' },
  { label: 'Media upload / user / day', value: '2', display: '2' },
  { label: 'Avg media size', value: '1.2 MB', display: '1.2 MB' },
];

const OUTPUTS = [
  { label: 'Average RPS', value: 57870, icon: Zap, highlight: false },
  { label: 'Peak RPS', value: 173610, icon: TrendingUp, highlight: true },
  { label: 'Daily storage', value: '2.4 TB', icon: HardDrive, highlight: false },
  { label: 'Monthly storage', value: '72 TB', icon: Database, highlight: false },
  { label: 'Daily requests', value: '5B', icon: Calculator, highlight: false },
  { label: 'Bandwidth', value: '8.2 Gbps', icon: TrendingUp, highlight: false },
];

export function CapacityPlanner() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[800px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">CAPACITY</span>
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-[var(--text-primary)]">Capacity Estimation</h1>
          <p className="font-mono text-[11px] text-[var(--text-muted)] mt-1">Auto-calculated from requirements</p>
        </div>

        {/* Inputs */}
        <div className="mb-6">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-3">Inputs</div>
          <div className="border border-[var(--border-subtle)]">
            {INPUTS.map((input, i) => (
              <div
                key={input.label}
                className={cx(
                  'flex items-center justify-between px-4 py-3',
                  i > 0 && 'border-t border-[var(--border-subtle)]'
                )}
              >
                <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">{input.label}</span>
                <span className="font-mono text-[15px] font-semibold text-[var(--text-primary)]">{input.display}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider with calculation */}
        <div className="flex items-center gap-3 my-6">
          <span className="h-px flex-1 bg-[var(--border-subtle)]" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Calculated</span>
          <span className="h-px flex-1 bg-[var(--border-subtle)]" />
        </div>

        {/* Outputs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-[var(--border-subtle)]">
          {OUTPUTS.map((out) => (
            <div
              key={out.label}
              className={cx(
                'p-4',
                out.highlight ? 'bg-[var(--accent-subtle)]' : 'bg-[var(--bg-base)]'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <out.icon
                  size={13}
                  className={out.highlight ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}
                  strokeWidth={1.6}
                />
                <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">{out.label}</span>
              </div>
              <div className={cx(
                'text-[20px] font-bold tracking-tight',
                out.highlight ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'
              )}>
                {typeof out.value === 'number' ? formatNumber(out.value) : out.value}
              </div>
            </div>
          ))}
        </div>

        {/* Calculation breakdown */}
        <div className="mt-8">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-3">Calculation Breakdown</div>
          <div className="border border-dashed border-[var(--border-default)] p-4 font-mono text-[11px] text-[var(--text-secondary)] leading-relaxed space-y-1">
            <div><span className="text-[var(--text-muted)]">avg_rps</span> = dau × req_per_user / 86400</div>
            <div><span className="text-[var(--text-muted)]">avg_rps</span> = 100M × 50 / 86400 = <span className="text-[var(--text-primary)] font-semibold">57,870</span></div>
            <div className="h-2" />
            <div><span className="text-[var(--text-muted)]">peak_rps</span> = avg_rps × peak_multiplier</div>
            <div><span className="text-[var(--text-muted)]">peak_rps</span> = 57,870 × 3 = <span className="text-[var(--accent-primary)] font-semibold">173,610</span></div>
            <div className="h-2" />
            <div><span className="text-[var(--text-muted)]">daily_storage</span> = dau × uploads × avg_size</div>
            <div><span className="text-[var(--text-muted)]">daily_storage</span> = 100M × 2 × 1.2MB = <span className="text-[var(--text-primary)] font-semibold">2.4 TB</span></div>
          </div>
        </div>

        {/* Visualization */}
        <div className="mt-8">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-3">Traffic Distribution (24h)</div>
          <div className="border border-[var(--border-subtle)] p-4">
            <div className="flex items-end gap-1 h-32">
              {[30, 25, 20, 18, 22, 35, 55, 72, 85, 78, 65, 58, 62, 68, 75, 82, 95, 100, 88, 70, 55, 45, 38, 32].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 transition-all hover:opacity-80"
                  style={{
                    height: `${h}%`,
                    background: h > 85 ? 'var(--accent-primary)' : h > 60 ? 'var(--accent-primary)' : 'var(--border-strong)',
                    opacity: h > 85 ? 1 : 0.6,
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 font-mono text-[9px] text-[var(--text-muted)]">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:59</span>
            </div>
            <div className="mt-3 flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--text-muted)]">
                <span className="w-2 h-2 bg-[var(--accent-primary)]" /> Peak hours
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--text-muted)]">
                <span className="w-2 h-2 bg-[var(--border-strong)]" /> Off-peak
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
