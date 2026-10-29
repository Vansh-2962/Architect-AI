import {
  LayoutDashboard, FolderOpen, LayoutTemplate, BookOpen, GraduationCap,
  Boxes, FileText, Code2, Database, Calculator, GitCompare, Activity,
  Settings, Moon, Sun, ChevronsUpDown,
} from 'lucide-react';
import type { ViewKey } from '@/lib/types';
import { useTheme } from '@/lib/theme';
import { cx } from '@/lib/helpers';

interface SidebarProps {
  activeView: ViewKey;
  onNavigate: (v: ViewKey) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  userName: string;
  userEmail: string;
}

const NAV_MAIN: { key: ViewKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'my-designs', label: 'My Designs', icon: FolderOpen },
  { key: 'templates', label: 'Templates', icon: LayoutTemplate },
  { key: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
  { key: 'interview', label: 'Interview Mode', icon: GraduationCap },
];

const NAV_WORKSPACE: { key: ViewKey; label: string; icon: typeof Boxes }[] = [
  { key: 'architecture', label: 'Architecture', icon: Boxes },
  { key: 'requirements', label: 'Requirements', icon: FileText },
  { key: 'apis', label: 'APIs', icon: Code2 },
  { key: 'database', label: 'Database', icon: Database },
  { key: 'capacity', label: 'Capacity', icon: Calculator },
  { key: 'tradeoffs', label: 'Trade-offs', icon: GitCompare },
  { key: 'simulations', label: 'Simulations', icon: Activity },
];

function NavItem({
  label, icon: Icon, active, onClick, collapsed,
}: {
  label: string; icon: typeof LayoutDashboard; active: boolean; onClick: () => void; collapsed: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cx(
        'group flex w-full items-center gap-2.5 px-3 py-1.5 text-[13px] font-medium transition-all duration-150 relative',
        collapsed && 'justify-center',
        active
          ? 'text-[var(--text-primary)]'
          : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] bg-[var(--accent-primary)]" />
      )}
      <Icon
        size={15}
        className={cx('shrink-0 transition-colors', active && 'text-[var(--accent-primary)]')}
        strokeWidth={active ? 2 : 1.6}
      />
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}

function SectionLabel({ children, collapsed }: { children: React.ReactNode; collapsed: boolean }) {
  if (collapsed) return <div className="h-px w-6 mx-auto bg-[var(--border-subtle)] my-2" />;
  return (
    <div className="px-3 pt-4 pb-1.5">
      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
        {children}
      </span>
    </div>
  );
}

export function Sidebar({
  activeView,
  onNavigate,
  collapsed,
  onToggleCollapse,
  userName,
  userEmail,
}: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const workspaceActive = NAV_WORKSPACE.some((n) => n.key === activeView);
  const initials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';

  return (
    <aside
      className={cx(
        'flex flex-col h-full bg-[var(--bg-elevated)] border-r border-[var(--border-subtle)] transition-all duration-200',
        collapsed ? 'w-14' : 'w-52'
      )}
    >
      {/* Logo */}
      <div className={cx('flex items-center gap-2.5 px-3 h-12 border-b border-[var(--border-subtle)]', collapsed && 'justify-center')}>
        <div className="relative flex items-center justify-center w-7 h-7 shrink-0">
          <svg viewBox="0 0 28 28" className="w-7 h-7">
            <rect x="2" y="2" width="6" height="6" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" />
            <rect x="20" y="2" width="6" height="6" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" />
            <rect x="11" y="11" width="6" height="6" fill="var(--accent-primary)" opacity="0.9" />
            <rect x="2" y="20" width="6" height="6" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" />
            <rect x="20" y="20" width="6" height="6" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" />
            <line x1="8" y1="5" x2="11" y2="14" stroke="var(--accent-primary)" strokeWidth="1" opacity="0.5" />
            <line x1="20" y1="5" x2="17" y2="14" stroke="var(--accent-primary)" strokeWidth="1" opacity="0.5" />
            <line x1="14" y1="17" x2="5" y2="20" stroke="var(--accent-primary)" strokeWidth="1" opacity="0.5" />
            <line x1="14" y1="17" x2="23" y2="20" stroke="var(--accent-primary)" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-none">
            <span className="text-[13px] font-bold tracking-tight text-[var(--text-primary)]">ARCHITECT</span>
            <span className="font-mono text-[9px] tracking-wider text-[var(--text-muted)]">AI SYSTEM DESIGN</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <SectionLabel collapsed={collapsed}>Workspace</SectionLabel>
        {NAV_MAIN.map((item) => (
          <NavItem
            key={item.key}
            label={item.label}
            icon={item.icon}
            active={activeView === item.key}
            onClick={() => onNavigate(item.key)}
            collapsed={collapsed}
          />
        ))}

        <SectionLabel collapsed={collapsed}>Current Project</SectionLabel>
        {!collapsed && (
          <div className="mx-3 mb-2 px-2.5 py-1.5 border border-dashed border-[var(--border-default)] bg-[var(--bg-surface)]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse-dot" />
              <span className="text-[11px] font-medium text-[var(--text-secondary)] truncate">Instagram Clone</span>
            </div>
            <div className="font-mono text-[9px] text-[var(--text-muted)] mt-0.5">v4 · 10M DAU</div>
          </div>
        )}
        {NAV_WORKSPACE.map((item) => (
          <NavItem
            key={item.key}
            label={item.label}
            icon={item.icon}
            active={activeView === item.key}
            onClick={() => onNavigate(item.key)}
            collapsed={collapsed}
          />
        ))}
        {workspaceActive && !collapsed && (
          <div className="mx-3 mt-2 h-px bg-[var(--border-subtle)]" />
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--border-subtle)] py-2">
        <NavItem
          label="Settings"
          icon={Settings}
          active={false}
          onClick={() => {}}
          collapsed={collapsed}
        />
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          className={cx(
            'flex w-full items-center gap-2.5 px-3 py-1.5 text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors',
            collapsed && 'justify-center'
          )}
        >
          {theme === 'dark' ? <Sun size={15} strokeWidth={1.6} /> : <Moon size={15} strokeWidth={1.6} />}
          {!collapsed && <span>Theme</span>}
          {!collapsed && (
            <span className="ml-auto font-mono text-[10px] text-[var(--text-muted)] uppercase">
              {theme}
            </span>
          )}
        </button>
        <button
          onClick={onToggleCollapse}
          className={cx(
            'flex w-full items-center gap-2.5 px-3 py-1.5 text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <ChevronsUpDown size={15} strokeWidth={1.6} className={collapsed ? '' : 'rotate-90'} />
          {!collapsed && <span>Collapse</span>}
        </button>
        {/* User */}
        <div className={cx('flex items-center gap-2 px-3 pt-2 pb-1 mt-1 border-t border-[var(--border-subtle)]', collapsed && 'justify-center')}>
          <div className="w-6 h-6 rounded-full bg-[var(--bg-surface-2)] border border-[var(--border-default)] flex items-center justify-center shrink-0">
            <span className="font-mono text-[10px] font-semibold text-[var(--text-secondary)]">{initials}</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-none min-w-0">
              <span className="text-[11px] font-medium text-[var(--text-secondary)] truncate">{userName}</span>
              <span className="font-mono text-[9px] text-[var(--text-muted)] truncate">{userEmail}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
