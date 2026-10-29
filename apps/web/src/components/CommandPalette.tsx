import { useEffect, useState, useRef } from 'react';
import {
  Search, ArrowRight, LayoutDashboard, FolderOpen, LayoutTemplate,
  BookOpen, Boxes, FileText, Code2, Database, Calculator, GitCompare,
  Activity, GraduationCap, Sun, Moon, Download, Sparkles, Play,
} from 'lucide-react';
import type { ViewKey } from '@/lib/types';
import { cx } from '@/lib/helpers';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (v: ViewKey) => void;
  onAction: (action: string) => void;
}

interface CmdItem {
  id: string;
  label: string;
  hint: string;
  icon: typeof Search;
  action: () => void;
  group: string;
}

export function CommandPalette({ open, onClose, onNavigate, onAction }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CmdItem[] = [
    { id: 'nav-overview', label: 'Overview', hint: 'Go to dashboard', icon: LayoutDashboard, action: () => onNavigate('overview'), group: 'Navigate' },
    { id: 'nav-mydesigns', label: 'My Designs', hint: 'View all designs', icon: FolderOpen, action: () => onNavigate('my-designs'), group: 'Navigate' },
    { id: 'nav-templates', label: 'Templates', hint: 'Browse templates', icon: LayoutTemplate, action: () => onNavigate('templates'), group: 'Navigate' },
    { id: 'nav-knowledge', label: 'Knowledge Base', hint: 'Technical references', icon: BookOpen, action: () => onNavigate('knowledge'), group: 'Navigate' },
    { id: 'nav-interview', label: 'Interview Mode', hint: 'Practice system design', icon: GraduationCap, action: () => onNavigate('interview'), group: 'Navigate' },
    { id: 'nav-arch', label: 'Architecture', hint: 'View architecture canvas', icon: Boxes, action: () => onNavigate('architecture'), group: 'Navigate' },
    { id: 'nav-req', label: 'Requirements', hint: 'View requirements', icon: FileText, action: () => onNavigate('requirements'), group: 'Navigate' },
    { id: 'nav-api', label: 'APIs', hint: 'View API design', icon: Code2, action: () => onNavigate('apis'), group: 'Navigate' },
    { id: 'nav-db', label: 'Database', hint: 'View database schema', icon: Database, action: () => onNavigate('database'), group: 'Navigate' },
    { id: 'nav-capacity', label: 'Capacity', hint: 'View capacity estimates', icon: Calculator, action: () => onNavigate('capacity'), group: 'Navigate' },
    { id: 'nav-tradeoffs', label: 'Trade-offs', hint: 'View trade-off analysis', icon: GitCompare, action: () => onNavigate('tradeoffs'), group: 'Navigate' },
    { id: 'nav-sim', label: 'Simulations', hint: 'Run failure simulation', icon: Activity, action: () => onNavigate('simulations'), group: 'Navigate' },
    { id: 'act-gen', label: 'Generate Architecture', hint: 'Create new design from prompt', icon: Sparkles, action: () => onAction('generate'), group: 'Actions' },
    { id: 'act-sim', label: 'Run Simulation', hint: 'Simulate failure scenario', icon: Play, action: () => onAction('simulate'), group: 'Actions' },
    { id: 'act-export', label: 'Export Design', hint: 'Export as PDF / JSON', icon: Download, action: () => onAction('export'), group: 'Actions' },
    { id: 'act-theme', label: 'Change Theme', hint: 'Toggle dark / light', icon: Sun, action: () => onAction('theme'), group: 'Actions' },
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.hint.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = filtered[selected];
        if (cmd) {
          cmd.action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, filtered, selected, onClose]);

  if (!open) return null;

  const groups = [...new Set(filtered.map((c) => c.group))];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 animate-fade-in" />
      <div
        className="relative w-full max-w-[560px] bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-lg-c animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 h-12 border-b border-[var(--border-subtle)]">
          <Search size={16} className="text-[var(--text-muted)] shrink-0" strokeWidth={1.6} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            placeholder="Search anything..."
            className="flex-1 bg-transparent outline-none text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />
          <kbd className="font-mono text-[10px] text-[var(--text-muted)] border border-[var(--border-default)] px-1.5 py-0.5">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto py-1">
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">No results found</span>
            </div>
          )}
          {groups.map((group) => (
            <div key={group}>
              <div className="px-3 pt-2 pb-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">{group}</span>
              </div>
              {filtered.filter((c) => c.group === group).map((cmd) => {
                const idx = filtered.indexOf(cmd);
                const isSelected = idx === selected;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => { cmd.action(); onClose(); }}
                    onMouseEnter={() => setSelected(idx)}
                    className={cx(
                      'flex w-full items-center gap-3 px-3 py-2 transition-colors',
                      isSelected && 'bg-[var(--bg-surface)]'
                    )}
                  >
                    <cmd.icon
                      size={15}
                      className={cx('shrink-0', isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]')}
                      strokeWidth={1.6}
                    />
                    <span className="text-[13px] text-[var(--text-primary)] font-medium">{cmd.label}</span>
                    <span className="text-[12px] text-[var(--text-muted)] truncate flex-1 text-right">{cmd.hint}</span>
                    {isSelected && <ArrowRight size={13} className="text-[var(--accent-primary)] shrink-0" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 h-9 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono text-[10px] text-[var(--text-muted)]">
              <kbd className="border border-[var(--border-default)] px-1 py-0.5">↑↓</kbd> navigate
            </span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-[var(--text-muted)]">
              <kbd className="border border-[var(--border-default)] px-1 py-0.5">↵</kbd> select
            </span>
          </div>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">ARCHITECT AI</span>
        </div>
      </div>
    </div>
  );
}
