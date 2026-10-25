import { useState } from 'react';
import { Play, AlertTriangle, ArrowDown, X, Check, AlertCircle, Zap, TrendingUp, Loader2 } from 'lucide-react';
import { FAILURE_SCENARIOS } from '@/lib/mock-data';
import type { ViewKey } from '@/lib/types';
import { cx } from '@/lib/helpers';

interface FailureSimProps {
  onNavigate: (v: ViewKey) => void;
  failureNode: string | null;
  onSetFailure: (id: string | null) => void;
}

const WHATIFS = [
  { label: 'What if traffic increases 10×?', icon: TrendingUp },
  { label: 'What if PostgreSQL goes down?', icon: AlertCircle },
  { label: 'What if Kafka becomes unavailable?', icon: AlertTriangle },
  { label: 'What if latency requirement becomes 50ms?', icon: Zap },
  { label: 'What if we move to multi-region?', icon: TrendingUp },
  { label: 'What if budget is $2,000/month?', icon: Zap },
];

const STATUS_CONFIG: Record<string, { color: string; icon: typeof X; bg: string }> = {
  failure: { color: 'var(--error)', icon: X, bg: 'var(--error-bg)' },
  warning: { color: 'var(--warn)', icon: AlertTriangle, bg: 'var(--warn-bg)' },
  info: { color: 'var(--info)', icon: Check, bg: 'var(--info-bg)' },
};

export function FailureSimulation({ onNavigate, failureNode, onSetFailure }: FailureSimProps) {
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [activeScenario, setActiveScenario] = useState(0);

  const scenario = FAILURE_SCENARIOS[activeScenario];

  const runSimulation = () => {
    setRunning(true);
    setCompleted(false);
    onSetFailure(null);
    setTimeout(() => {
      onSetFailure(scenario.target === 'Redis' ? 'redis' : scenario.target === 'PostgreSQL' ? 'postgres' : 'kafka');
      setRunning(false);
      setCompleted(true);
    }, 2000);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[800px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">SIMULATION</span>
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-[var(--text-primary)]">Failure Simulation</h1>
          <p className="font-mono text-[11px] text-[var(--text-muted)] mt-1">Test architecture resilience under adverse conditions</p>
        </div>

        {/* Scenario selector */}
        <div className="mb-6">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-3">Scenario</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {FAILURE_SCENARIOS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setActiveScenario(i); setCompleted(false); onSetFailure(null); }}
                className={cx(
                  'px-3 py-2.5 border text-left transition-all',
                  activeScenario === i
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-glow)]'
                    : 'border-[var(--border-default)] hover:border-[var(--border-strong)]'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={cx('w-1.5 h-1.5 rounded-full', activeScenario === i ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border-strong)]')} />
                  <span className="font-mono text-[9px] uppercase text-[var(--text-muted)]">Scenario 0{i + 1}</span>
                </div>
                <span className={cx(
                  'text-[11px] font-medium',
                  activeScenario === i ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                )}>{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Run button */}
        <button
          onClick={runSimulation}
          disabled={running}
          className="group flex items-center gap-2 px-4 py-2.5 bg-[var(--accent-primary)] text-white font-medium text-[12px] disabled:opacity-50 transition-all hover:brightness-110 mb-6"
        >
          {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} strokeWidth={2} />}
          <span>{running ? 'Running Simulation...' : 'Run Simulation'}</span>
        </button>

        {/* Cascade visualization */}
        <div className="border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Cascade Analysis</span>
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
            {completed && (
              <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[var(--error)]">
                <AlertTriangle size={11} /> Failure Detected
              </span>
            )}
          </div>

          <div className="space-y-0">
            {scenario.cascade.map((step, i) => {
              const cfg = STATUS_CONFIG[step.status];
              const isActive = running || completed;
              return (
                <div key={i} className="flex items-stretch gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={cx(
                        'w-7 h-7 flex items-center justify-center border shrink-0 transition-all',
                        isActive ? '' : 'opacity-30'
                      )}
                      style={{
                        borderColor: cfg.color,
                        background: isActive ? cfg.bg : 'transparent',
                        transitionDelay: `${i * 300}ms`,
                      }}
                    >
                      <cfg.icon size={13} style={{ color: cfg.color }} strokeWidth={2} />
                    </div>
                    {i < scenario.cascade.length - 1 && (
                      <div
                        className={cx(
                          'w-px flex-1 min-h-[28px] transition-all',
                          isActive ? '' : 'opacity-20'
                        )}
                        style={{
                          background: isActive ? cfg.color : 'var(--border-default)',
                          transitionDelay: `${i * 300 + 150}ms`,
                        }}
                      />
                    )}
                  </div>
                  <div className="py-1 flex-1">
                    <span
                      className={cx(
                        'text-[12px] transition-all',
                        isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                      )}
                      style={{ transitionDelay: `${i * 300}ms` }}
                    >
                      {step.label}
                    </span>
                  </div>
                  <div className="py-1.5">
                    <span
                      className={cx(
                        'font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border transition-all',
                        isActive ? '' : 'opacity-20'
                      )}
                      style={{
                        color: cfg.color,
                        borderColor: cfg.color,
                        transitionDelay: `${i * 300}ms`,
                      }}
                    >
                      {step.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Outcome */}
          {completed && (
            <div className="mt-4 pt-4 border-t border-dashed border-[var(--border-default)] animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Outcome</span>
              </div>
              <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">{scenario.outcome}</p>
              <button
                onClick={() => onNavigate('architecture')}
                className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-[var(--accent-primary)] hover:underline"
              >
                View on architecture canvas
                <ArrowDown size={11} />
              </button>
            </div>
          )}
        </div>

        {/* What If section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={13} className="text-[var(--accent-primary)]" strokeWidth={1.8} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">What If?</span>
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
          </div>
          <div className="border border-dashed border-[var(--border-default)] p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {WHATIFS.map((w) => (
                <button
                  key={w.label}
                  onClick={() => { setActiveScenario(0); setCompleted(false); runSimulation(); }}
                  className="group flex items-center gap-2 px-3 py-2 border border-[var(--border-default)] text-[12px] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors text-left"
                >
                  <w.icon size={13} strokeWidth={1.6} className="shrink-0" />
                  <span className="flex-1">{w.label}</span>
                  <Play size={11} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
