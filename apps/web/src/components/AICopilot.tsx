import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Zap, AlertTriangle, TrendingUp, Lightbulb } from 'lucide-react';
import type { ChatMessage } from '@/lib/types';
import { INITIAL_CHAT } from '@/lib/mock-data';
import { cx } from '@/lib/helpers';

interface AICopilotProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AI_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['scale', '10x', 'capacity', 'grow', 'traffic'],
    response: "Scaling this architecture 10× would require:\n\n01  API: scale from 8 → 80 replicas\n02  PostgreSQL: add read replicas + sharding by user_id\n03  Redis: grow cluster from 3 → 6 shards\n04  Kafka: increase partitions from 3 → 12\n05  Estimated cost: ~$45K/month infrastructure\n\nThe main bottleneck would be PostgreSQL write throughput. Consider partitioning the posts table by created_at ranges and using a separate analytics DB for read-heavy feed queries.",
  },
  {
    keywords: ['fail', 'down', 'available', 'crash', 'outage'],
    response: "Key failure scenarios for this architecture:\n\n01  Redis failure → DB load spikes 340%, cascading failure risk\n02  PostgreSQL primary failure → 30-90s failover to replica\n03  Kafka broker failure → self-healing, minor latency spike\n04  Network partition → split-brain risk in multi-region\n\nRecommend implementing circuit breakers on all cache reads and graceful degradation for feed generation.",
  },
  {
    keywords: ['why', 'choose', 'why not', 'alternative', 'instead'],
    response: "Architecture decisions are driven by your scale and consistency requirements:\n\n01  PostgreSQL over MongoDB — you need ACID transactions for user data\n02  Redis over Memcached — sorted sets enable efficient feed generation\n03  Kafka over RabbitMQ — you need event replay and partition-level parallelism\n04  CDN over direct S3 — 240 PoPs reduce media latency from 200ms to <20ms\n\nEach choice has documented trade-offs in the Trade-offs tab.",
  },
  {
    keywords: ['explain', 'how', 'work', 'architecture'],
    response: "This architecture follows a classic layered pattern:\n\n01  CDN layer — serves static media from edge locations\n02  API Gateway — handles TLS, auth, rate limiting\n03  API Service — stateless, horizontally scalable\n04  Workers — consume Kafka events for async processing\n05  Data layer — PostgreSQL for writes, Redis for reads\n\nThe key insight is that the API layer is stateless, allowing horizontal scaling. Redis absorbs 90% of read traffic, protecting PostgreSQL from overload.",
  },
];

const CONTEXT_ACTIONS = [
  { label: 'Explain decision', icon: Lightbulb },
  { label: 'Show alternatives', icon: TrendingUp },
  { label: 'What could fail?', icon: AlertTriangle },
  { label: 'Scale this 10×', icon: Zap },
];

function generateResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const r of AI_RESPONSES) {
    if (r.keywords.some((k) => lower.includes(k))) return r.response;
  }
  return "That's a great question. Based on your current architecture, I'd analyze the specific component constraints and recommend the most balanced approach.\n\nConsider the following:\n01  Current load patterns and bottlenecks\n02  Consistency vs availability trade-offs\n03  Operational complexity vs team capacity\n\nWould you like me to dive deeper into any specific area?";
}

export function AICopilot({ collapsed, onToggle }: AICopilotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: `m${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
    setMessages((p) => [...p, userMsg]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `m${Date.now() + 1}`,
        role: 'ai',
        content: generateResponse(userMsg.content),
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      };
      setMessages((p) => [...p, aiMsg]);
      setThinking(false);
    }, 1200);
  };

  if (collapsed) {
    return (
      <button
        onClick={onToggle}
        className="flex flex-col items-center gap-1 w-10 h-12 border-l border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors shrink-0"
        title="Open AI Copilot"
      >
        <Sparkles size={15} className="mt-2" strokeWidth={1.6} />
        <span className="font-mono text-[8px] uppercase tracking-wider [writing-mode:vertical-rl] rotate-180">AI</span>
      </button>
    );
  }

  return (
    <aside className="flex flex-col w-80 h-full bg-[var(--bg-elevated)] border-l border-[var(--border-subtle)] shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 h-11 border-b border-[var(--border-subtle)] shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[var(--accent-primary)]" strokeWidth={1.8} />
          <span className="text-[12px] font-bold tracking-tight text-[var(--text-primary)]">ARCHITECT AI</span>
          <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[var(--accent-primary)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse-dot" /> Online
          </span>
        </div>
        <button onClick={onToggle} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors font-mono text-[14px] leading-none">
          ›
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
              <span className={cx(
                'font-mono text-[9px] uppercase tracking-wider font-semibold',
                msg.role === 'user' ? 'text-[var(--text-muted)]' : 'text-[var(--accent-primary)]'
              )}>
                {msg.role === 'user' ? 'YOU' : 'ARCHITECT AI'}
              </span>
              <span className="font-mono text-[9px] text-[var(--text-muted)]">{msg.timestamp}</span>
            </div>
            <div className={cx(
              'text-[12px] leading-relaxed whitespace-pre-line',
              msg.role === 'user' ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[var(--accent-primary)]">ARCHITECT AI</span>
              <span className="flex gap-1">
                <span className="w-1 h-1 rounded-full bg-[var(--accent-primary)] animate-pulse-dot" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 rounded-full bg-[var(--accent-primary)] animate-pulse-dot" style={{ animationDelay: '200ms' }} />
                <span className="w-1 h-1 rounded-full bg-[var(--accent-primary)] animate-pulse-dot" style={{ animationDelay: '400ms' }} />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Context actions */}
      <div className="px-3 py-2 border-t border-[var(--border-subtle)]">
        <div className="grid grid-cols-2 gap-1.5">
          {CONTEXT_ACTIONS.map((a) => (
            <button
              key={a.label}
              onClick={() => {
                setInput(a.label);
                setTimeout(() => send(), 0);
              }}
              className="flex items-center gap-1.5 px-2 py-1.5 border border-dashed border-[var(--border-default)] text-[11px] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              <a.icon size={12} strokeWidth={1.6} className="shrink-0" />
              <span className="truncate">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-3 pb-3 pt-1.5">
        <div className="flex items-end gap-2 border border-[var(--border-default)] bg-[var(--bg-surface)] p-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask about your architecture..."
            rows={2}
            className="flex-1 bg-transparent outline-none text-[12px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="w-7 h-7 flex items-center justify-center bg-[var(--accent-primary)] text-white disabled:opacity-30 transition-opacity shrink-0"
          >
            <Send size={13} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </aside>
  );
}
