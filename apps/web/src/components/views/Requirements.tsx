import { Check, Sparkles, AlertCircle } from 'lucide-react';
import { cx } from '@/lib/helpers';

const FUNCTIONAL = [
  { text: 'User authentication', ai: false },
  { text: 'Photo/media uploads', ai: false },
  { text: 'News feed generation', ai: false },
  { text: 'Like and comment system', ai: false },
  { text: 'Follow / unfollow users', ai: false },
  { text: 'Push notifications', ai: true },
  { text: 'Real-time direct messaging', ai: true },
];

const NON_FUNCTIONAL = [
  { label: 'Availability', value: '99.99%', bar: 99 },
  { label: 'Latency', value: '<100ms', bar: 90 },
  { label: 'Users', value: '10M DAU', bar: 70 },
  { label: 'Peak RPS', value: '120K', bar: 85 },
  { label: 'Region', value: 'Global', bar: 100 },
  { label: 'Storage', value: '72 TB/mo', bar: 60 },
];

export function Requirements() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[700px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">REQUIREMENTS</span>
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-[var(--text-primary)]">Instagram-like Platform</h1>
          <p className="font-mono text-[11px] text-[var(--text-muted)] mt-1">10M DAU · v4 · AI-analyzed</p>
        </div>

        {/* Functional */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold">Functional Requirements</span>
          </div>
          <div className="border-t border-[var(--border-subtle)]">
            {FUNCTIONAL.map((req, i) => (
              <div
                key={req.text}
                className={cx(
                  'flex items-center gap-3 px-3 py-2.5 border-b border-[var(--border-subtle)]',
                  i === 0 && 'border-t-0'
                )}
              >
                <div className="w-4 h-4 border border-[var(--accent-primary)] bg-[var(--accent-glow)] flex items-center justify-center shrink-0">
                  <Check size={11} className="text-[var(--accent-primary)]" strokeWidth={2.5} />
                </div>
                <span className="text-[13px] text-[var(--text-primary)] flex-1">{req.text}</span>
                {req.ai && (
                  <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[var(--accent-primary)] border border-[var(--accent-primary)] px-1.5 py-0.5">
                    <Sparkles size={9} /> AI detected
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Non-functional */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold">Non-Functional Requirements</span>
          </div>
          <div className="border border-[var(--border-subtle)]">
            {NON_FUNCTIONAL.map((req, i) => (
              <div
                key={req.label}
                className={cx(
                  'flex items-center gap-4 px-4 py-3',
                  i > 0 && 'border-t border-[var(--border-subtle)]'
                )}
              >
                <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] w-28 shrink-0">{req.label}</span>
                <span className="text-[14px] font-semibold text-[var(--text-primary)] w-24 shrink-0">{req.value}</span>
                <div className="flex-1 h-1 bg-[var(--bg-surface)] relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-[var(--accent-primary)] transition-all"
                    style={{ width: `${req.bar}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight */}
        <div className="border border-dashed border-[var(--accent-primary)] p-4 bg-[var(--accent-subtle)]">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={13} className="text-[var(--accent-primary)]" strokeWidth={1.8} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-primary)] font-semibold">AI Insight</span>
          </div>
          <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
            Based on your scale of 10M DAU, I've inferred two additional requirements: push notifications (typically expected at this scale) and real-time direct messaging (common for social platforms). The 99.99% availability target requires multi-AZ deployment with automated failover.
          </p>
        </div>

        {/* Constraints */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold">Constraints</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Budget: $10K/mo', 'Team: 8 engineers', 'Multi-region: us-east, eu-west', 'Compliance: GDPR', 'Mobile-first'].map((c) => (
              <span key={c} className="flex items-center gap-1.5 px-2.5 py-1 border border-[var(--border-default)] text-[11px] text-[var(--text-secondary)]">
                <AlertCircle size={11} className="text-[var(--text-muted)]" strokeWidth={1.6} />
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
