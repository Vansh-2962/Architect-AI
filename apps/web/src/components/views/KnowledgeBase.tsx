import { useState, useRef, useEffect } from 'react';
import { Search, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { KNOWLEDGE_DOCS, KNOWLEDGE_CATEGORIES } from '@/lib/mock-data';
import { cx } from '@/lib/helpers';

export function KnowledgeBase() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filtered = KNOWLEDGE_DOCS.filter((d) => {
    const matchesQuery = !query ||
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.summary.toLowerCase().includes(query.toLowerCase());
    const matchesCat = !category || d.category === category;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[800px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={14} className="text-[var(--accent-primary)]" strokeWidth={1.8} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">KNOWLEDGE BASE</span>
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-[var(--text-primary)]">Technical References</h1>
          <p className="font-mono text-[11px] text-[var(--text-muted)] mt-1">{KNOWLEDGE_DOCS.length} articles · {KNOWLEDGE_CATEGORIES.length} categories</p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2 mb-4">
          <Search size={15} className="text-[var(--text-muted)] shrink-0" strokeWidth={1.6} />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="flex-1 bg-transparent outline-none text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />
          <kbd className="font-mono text-[10px] text-[var(--text-muted)] border border-[var(--border-default)] px-1.5 py-0.5">/</kbd>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          <button
            onClick={() => setCategory(null)}
            className={cx(
              'px-2.5 py-1 text-[11px] font-medium border transition-colors',
              !category
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-glow)]'
                : 'border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            )}
          >
            All
          </button>
          {KNOWLEDGE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cx(
                'px-2.5 py-1 text-[11px] font-medium border transition-colors',
                category === cat
                  ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-glow)]'
                  : 'border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Documents */}
        <div className="border-t border-[var(--border-subtle)]">
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">No articles found</span>
            </div>
          )}
          {filtered.map((doc, i) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(selectedDoc === doc.id ? null : doc.id)}
              className={cx(
                'group flex items-start gap-4 px-3 py-3.5 cursor-pointer transition-colors hover:bg-[var(--bg-elevated)]',
                i > 0 && 'border-t border-[var(--border-subtle)]'
              )}
            >
              <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
                <div className="w-7 h-7 border border-[var(--border-default)] bg-[var(--bg-surface)] flex items-center justify-center">
                  <BookOpen size={13} className="text-[var(--text-secondary)]" strokeWidth={1.6} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[13px] font-medium text-[var(--text-primary)] truncate">{doc.title}</span>
                </div>
                <p className="text-[12px] text-[var(--text-secondary)] line-clamp-2 mb-1">{doc.summary}</p>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{doc.category}</span>
                  <span className="flex items-center gap-1 font-mono text-[10px] text-[var(--text-muted)]">
                    <Clock size={10} /> {doc.readTime}
                  </span>
                </div>
              </div>
              <ArrowRight size={14} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
