import { Search, Check, ChevronRight, Command, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { cx } from '@/lib/helpers';
import { useEffect, useState } from 'react';

interface TopBarProps {
  breadcrumb: string[];
  onCommandPalette: () => void;
  version: number;
  userName: string;
  onSignOut: () => void;
  signingOut: boolean;
  signOutError: string | null;
}

export function TopBar({
  breadcrumb,
  onCommandPalette,
  version,
  userName,
  onSignOut,
  signingOut,
  signOutError,
}: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const [saveState, setSaveState] = useState<'saved' | 'saving'>('saved');
  const initials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';

  useEffect(() => {
    const interval = setInterval(() => {
      setSaveState('saving');
      setTimeout(() => setSaveState('saved'), 1200);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center h-11 px-3 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] gap-3 shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 min-w-0">
        {breadcrumb.map((crumb, i) => (
          <div key={i} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <ChevronRight size={13} className="text-[var(--text-muted)] shrink-0" />}
            <span
              className={cx(
                'text-[12px] truncate',
                i === breadcrumb.length - 1
                  ? 'font-medium text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)]'
              )}
            >
              {crumb}
            </span>
          </div>
        ))}
      </div>

      <div className="flex-1" />

      {/* Search trigger */}
      <button
        onClick={onCommandPalette}
        className="hidden md:flex items-center gap-2 h-7 px-2.5 border border-[var(--border-default)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-2)] transition-colors text-[var(--text-muted)] text-[12px] min-w-[180px]"
      >
        <Search size={13} strokeWidth={1.6} />
        <span>Search...</span>
        <span className="ml-auto flex items-center gap-0.5 font-mono text-[10px]">
          <Command size={10} />K
        </span>
      </button>

      {/* Version */}
      <div className="hidden sm:flex items-center font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
        v{version.toFixed(1)}
      </div>

      {/* Save status */}
      <div className="flex items-center gap-1.5">
        {saveState === 'saving' ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--warn)] animate-pulse-dot" />
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider hidden sm:inline">Saving...</span>
          </>
        ) : (
          <>
            <Check size={12} className="text-[var(--accent-primary)]" strokeWidth={2} />
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider hidden sm:inline">Saved</span>
          </>
        )}
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="w-7 h-7 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-default)] bg-[var(--bg-surface)]"
        title="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={14} strokeWidth={1.6} /> : <Moon size={14} strokeWidth={1.6} />}
      </button>

      {/* Avatar */}
      <div
        aria-label={userName}
        className="w-7 h-7 rounded-full bg-[var(--bg-surface-2)] border border-[var(--border-default)] flex items-center justify-center shrink-0"
        title={userName}
      >
        <span className="font-mono text-[10px] font-semibold text-[var(--text-secondary)]">{initials}</span>
      </div>
      <button
        className="border border-[var(--border-default)] bg-[var(--bg-surface)] px-2 py-1 text-[11px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] disabled:opacity-50"
        disabled={signingOut}
        onClick={onSignOut}
        title={signOutError ?? 'Sign out'}
        type="button"
      >
        {signingOut ? 'Signing out...' : 'Sign out'}
      </button>
      {signOutError && (
        <span
          aria-live="polite"
          className="max-w-40 truncate text-[10px] text-[var(--error)]"
          role="alert"
          title={signOutError}
        >
          {signOutError}
        </span>
      )}
    </header>
  );
}
