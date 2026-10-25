import { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/mock-data';
import { cx } from '@/lib/helpers';

const METHOD_COLORS: Record<string, string> = {
  GET: 'var(--info)',
  POST: 'var(--accent-primary)',
  PUT: 'var(--warn)',
  DELETE: 'var(--error)',
  PATCH: 'var(--warn)',
};

export function ApiDesign() {
  const [selected, setSelected] = useState(API_ENDPOINTS[0].id);

  const endpoint = API_ENDPOINTS.find((e) => e.id === selected) ?? API_ENDPOINTS[0];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[900px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">API</span>
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-[var(--text-primary)]">API Design</h1>
          <p className="font-mono text-[11px] text-[var(--text-muted)] mt-1">REST · v1 · {API_ENDPOINTS.length} endpoints</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
          {/* Endpoint list */}
          <div className="border border-[var(--border-subtle)]">
            <div className="px-3 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Endpoints</span>
            </div>
            {API_ENDPOINTS.map((ep, i) => (
              <button
                key={ep.id}
                onClick={() => setSelected(ep.id)}
                className={cx(
                  'flex items-center gap-2 w-full px-3 py-2.5 text-left transition-colors',
                  i > 0 && 'border-t border-[var(--border-subtle)]',
                  selected === ep.id ? 'bg-[var(--accent-glow)]' : 'hover:bg-[var(--bg-surface)]'
                )}
              >
                <span
                  className="font-mono text-[9px] font-bold uppercase px-1.5 py-0.5 border shrink-0 min-w-[40px] text-center"
                  style={{ color: METHOD_COLORS[ep.method], borderColor: METHOD_COLORS[ep.method] }}
                >
                  {ep.method}
                </span>
                <span className={cx(
                  'font-mono text-[11px] truncate',
                  selected === ep.id ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                )}>{ep.path}</span>
              </button>
            ))}
          </div>

          {/* Endpoint detail */}
          <div className="border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
            {/* Path */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-subtle)]">
              <span
                className="font-mono text-[11px] font-bold uppercase px-2 py-1 border"
                style={{ color: METHOD_COLORS[endpoint.method], borderColor: METHOD_COLORS[endpoint.method] }}
              >
                {endpoint.method}
              </span>
              <span className="font-mono text-[13px] font-semibold text-[var(--text-primary)]">{endpoint.path}</span>
              <span className="font-mono text-[11px] text-[var(--accent-primary)] ml-auto border border-[var(--accent-primary)] px-1.5 py-0.5">
                {endpoint.status}
              </span>
            </div>

            <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
              <span className="text-[12px] text-[var(--text-secondary)]">{endpoint.description}</span>
            </div>

            {/* Auth */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border-subtle)]">
              <Lock size={12} className="text-[var(--text-muted)]" strokeWidth={1.6} />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Authentication:</span>
              <span className="font-mono text-[11px] text-[var(--text-secondary)]">{endpoint.auth}</span>
            </div>

            {/* Request */}
            {endpoint.request && (
              <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
                <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2">Request</div>
                <pre className="font-mono text-[11px] text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                  {endpoint.request}
                </pre>
              </div>
            )}

            {/* Response */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Response</span>
                <ArrowRight size={11} className="text-[var(--text-muted)]" />
                <span className="font-mono text-[10px] text-[var(--accent-primary)]">
                  {endpoint.status === 200 ? 'OK' : endpoint.status === 201 ? 'Created' : ''}
                </span>
              </div>
              <pre className="font-mono text-[11px] text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                {endpoint.response}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
