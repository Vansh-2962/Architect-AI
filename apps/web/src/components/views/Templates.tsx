import { Link, MessageSquare, Camera, Play, Car, CreditCard, Bell, ArrowRight } from 'lucide-react';
import { TEMPLATES } from '@/lib/mock-data';
import type { ViewKey } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';
import { cx } from '@/lib/helpers';

const ICONS: Record<string, LucideIcon> = {
  Link, MessageSquare, Camera, Play, Car, CreditCard, Bell,
};

interface TemplatesProps {
  onNavigate: (v: ViewKey) => void;
  onUseTemplate: (name: string) => void;
}

export function Templates({ onNavigate, onUseTemplate }: TemplatesProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[800px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">TEMPLATES</span>
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-[var(--text-primary)]">System Design Templates</h1>
          <p className="font-mono text-[11px] text-[var(--text-muted)] mt-1">{TEMPLATES.length} curated templates</p>
        </div>

        {/* Templates list */}
        <div className="border-t border-[var(--border-subtle)]">
          {TEMPLATES.map((t, i) => {
            const Icon = ICONS[t.icon] ?? Link;
            return (
              <div
                key={t.id}
                className={cx(
                  'group flex items-center gap-4 px-3 py-4 cursor-pointer transition-colors hover:bg-[var(--bg-elevated)]',
                  i > 0 && 'border-t border-[var(--border-subtle)]'
                )}
                onClick={() => { onUseTemplate(t.name); onNavigate('architecture'); }}
              >
                <div className="w-10 h-10 border border-[var(--border-default)] bg-[var(--bg-surface)] flex items-center justify-center shrink-0">
                  <Icon size={17} className="text-[var(--accent-primary)]" strokeWidth={1.6} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[14px] font-medium text-[var(--text-primary)]">{t.name}</span>
                    <span className="font-mono text-[10px] text-[var(--text-muted)] border border-[var(--border-default)] px-1.5 py-0.5">{t.users}</span>
                  </div>
                  <p className="text-[12px] text-[var(--text-secondary)]">{t.description}</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border-default)] text-[11px] font-medium text-[var(--text-secondary)] group-hover:border-[var(--accent-primary)] group-hover:text-[var(--accent-primary)] transition-colors shrink-0">
                  <span>Use</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
