import { useState } from 'react';
import { Key, Link2, Search, Table2, Database, ArrowRight } from 'lucide-react';
import { DB_TABLES } from '@/lib/mock-data';
import { cx } from '@/lib/helpers';

const TABS = ['Schema', 'ER Diagram', 'Indexes', 'Queries'] as const;
type Tab = typeof TABS[number];

const INDEXES = [
  { table: 'USERS', name: 'idx_users_email', columns: 'email', type: 'UNIQUE' },
  { table: 'USERS', name: 'idx_users_username', columns: 'username', type: 'UNIQUE' },
  { table: 'POSTS', name: 'idx_posts_user_id', columns: 'user_id, created_at DESC', type: 'BTREE' },
  { table: 'POSTS', name: 'idx_posts_created_at', columns: 'created_at', type: 'BTREE' },
  { table: 'LIKES', name: 'idx_likes_user_post', columns: 'user_id, post_id', type: 'UNIQUE' },
  { table: 'FOLLOWS', name: 'idx_follows_followee', columns: 'followee_id', type: 'BTREE' },
  { table: 'TIMELINE', name: 'idx_timeline_user_score', columns: 'user_id, score DESC', type: 'BTREE' },
];

const QUERIES = [
  { label: 'Get user feed', query: 'SELECT post_id FROM timeline\nWHERE user_id = $1\nORDER BY score DESC\nLIMIT 20;' },
  { label: 'Get user profile', query: 'SELECT id, username, name, avatar_url\nFROM users\nWHERE id = $1;' },
  { label: 'Get post with likes', query: 'SELECT p.*, COUNT(l.id) as likes\nFROM posts p\nLEFT JOIN likes l ON l.post_id = p.id\nWHERE p.id = $1\nGROUP BY p.id;' },
  { label: 'Get followers', query: 'SELECT follower_id FROM follows\nWHERE followee_id = $1\nORDER BY created_at DESC;' },
];

export function DatabaseView() {
  const [tab, setTab] = useState<Tab>('Schema');
  const [selectedTable, setSelectedTable] = useState<string | null>(DB_TABLES[0].id);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[900px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">DATABASE</span>
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-[var(--text-primary)]">Database Schema</h1>
          <p className="font-mono text-[11px] text-[var(--text-muted)] mt-1">PostgreSQL 17 · {DB_TABLES.length} tables · 7 indexes</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 border-b border-[var(--border-subtle)] mb-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cx(
                'px-3 py-2 text-[12px] font-medium transition-colors relative',
                tab === t
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              )}
            >
              {t}
              {tab === t && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent-primary)]" />}
            </button>
          ))}
        </div>

        {/* Schema view */}
        {tab === 'Schema' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DB_TABLES.map((table) => (
              <div key={table.id} className="border border-[var(--border-default)] bg-[var(--bg-elevated)]">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <Table2 size={13} className="text-[var(--accent-primary)]" strokeWidth={1.6} />
                  <span className="font-mono text-[12px] font-semibold text-[var(--text-primary)]">{table.name}</span>
                  <span className="ml-auto font-mono text-[9px] text-[var(--text-muted)]">{table.columns.length} cols</span>
                </div>
                <div>
                  {table.columns.map((col, i) => (
                    <div
                      key={col.name}
                      className={cx(
                        'flex items-center gap-2 px-3 py-1.5',
                        i > 0 && 'border-t border-[var(--border-subtle)]'
                      )}
                    >
                      {col.pk ? (
                        <Key size={11} className="text-[var(--warn)] shrink-0" strokeWidth={1.8} />
                      ) : col.fk ? (
                        <Link2 size={11} className="text-[var(--info)] shrink-0" strokeWidth={1.8} />
                      ) : (
                        <span className="w-[11px] shrink-0" />
                      )}
                      <span className={cx(
                        'font-mono text-[11px]',
                        col.pk ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-secondary)]'
                      )}>{col.name}</span>
                      <span className="font-mono text-[10px] text-[var(--text-muted)] ml-auto">{col.type}</span>
                      {col.pk && <span className="font-mono text-[8px] uppercase text-[var(--warn)] border border-[var(--warn)] px-1">PK</span>}
                      {col.fk && <span className="font-mono text-[8px] uppercase text-[var(--info)] border border-[var(--info)] px-1">FK</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ER Diagram */}
        {tab === 'ER Diagram' && (
          <div className="border border-dashed border-[var(--border-default)] p-6 bg-[var(--bg-elevated)] relative bg-grid-dots">
            <svg className="w-full h-[400px]" viewBox="0 0 800 400">
              {/* Connections */}
              <g stroke="var(--border-strong)" strokeWidth="1" fill="none" strokeDasharray="4 4">
                <line x1="150" y1="100" x2="400" y2="100" />
                <line x1="400" y1="130" x2="650" y2="130" />
                <line x1="400" y1="170" x2="650" y2="200" />
                <line x1="150" y1="300" x2="400" y2="170" />
                <line x1="150" y1="100" x2="150" y2="300" />
              </g>
              {/* Connection labels */}
              <g fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">
                <text x="275" y="95" textAnchor="middle">1:N</text>
                <text x="525" y="125" textAnchor="middle">1:N</text>
                <text x="525" y="195" textAnchor="middle">N:1</text>
                <text x="275" y="240" textAnchor="middle">N:M</text>
                <text x="160" y="200" textAnchor="start">self-ref</text>
              </g>
              {/* Table boxes */}
              {[
                { name: 'USERS', x: 50, y: 60, cols: ['id (PK)', 'email', 'username'] },
                { name: 'POSTS', x: 320, y: 70, cols: ['id (PK)', 'user_id (FK)', 'content'] },
                { name: 'LIKES', x: 580, y: 100, cols: ['id (PK)', 'user_id (FK)', 'post_id (FK)'] },
                { name: 'FOLLOWS', x: 580, y: 180, cols: ['id (PK)', 'follower_id', 'followee_id'] },
                { name: 'TIMELINE', x: 50, y: 270, cols: ['user_id (FK)', 'post_id (FK)', 'score'] },
              ].map((t) => (
                <g key={t.name}>
                  <rect x={t.x} y={t.y} width="170" height={20 + t.cols.length * 16} fill="var(--bg-elevated)" stroke="var(--accent-primary)" strokeWidth="1" />
                  <rect x={t.x} y={t.y} width="170" height="20" fill="var(--bg-surface)" />
                  <text x={t.x + 8} y={t.y + 14} fill="var(--text-primary)" fontSize="11" fontWeight="600" fontFamily="var(--font-mono)">{t.name}</text>
                  {t.cols.map((c, i) => (
                    <text key={c} x={t.x + 8} y={t.y + 34 + i * 16} fill="var(--text-secondary)" fontSize="10" fontFamily="var(--font-mono)">{c}</text>
                  ))}
                </g>
              ))}
            </svg>
          </div>
        )}

        {/* Indexes */}
        {tab === 'Indexes' && (
          <div className="border border-[var(--border-subtle)]">
            <div className="flex items-center gap-4 px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] w-20">Table</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] flex-1">Index Name</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] flex-1">Columns</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] w-20">Type</span>
            </div>
            {INDEXES.map((idx, i) => (
              <div
                key={idx.name}
                className={cx(
                  'flex items-center gap-4 px-4 py-2.5',
                  i > 0 && 'border-t border-[var(--border-subtle)]'
                )}
              >
                <span className="font-mono text-[11px] font-semibold text-[var(--accent-primary)] w-20">{idx.table}</span>
                <span className="font-mono text-[11px] text-[var(--text-primary)] flex-1">{idx.name}</span>
                <span className="font-mono text-[11px] text-[var(--text-secondary)] flex-1">{idx.columns}</span>
                <span className={cx(
                  'font-mono text-[9px] uppercase px-1.5 py-0.5 border w-20 text-center',
                  idx.type === 'UNIQUE'
                    ? 'border-[var(--warn)] text-[var(--warn)]'
                    : 'border-[var(--border-default)] text-[var(--text-muted)]'
                )}>{idx.type}</span>
              </div>
            ))}
          </div>
        )}

        {/* Queries */}
        {tab === 'Queries' && (
          <div className="space-y-4">
            {QUERIES.map((q) => (
              <div key={q.label} className="border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <Search size={12} className="text-[var(--text-muted)]" strokeWidth={1.6} />
                  <span className="text-[12px] font-medium text-[var(--text-secondary)]">{q.label}</span>
                </div>
                <pre className="px-3 py-3 font-mono text-[11px] text-[var(--text-primary)] leading-relaxed overflow-x-auto">
                  {q.query}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
