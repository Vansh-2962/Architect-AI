import {
  Plus,
  ArrowUpRight,
  Clock,
  GitBranch,
  TrendingUp,
  Zap,
  Activity,
  Boxes,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchDesignOverview } from "@/lib/designs-api";
import type { SavedDesign, ViewKey } from "@/lib/types";
import { cx } from "@/lib/helpers";
import { Button } from "../ui/button";

interface OverviewProps {
  userId: string;
  onNavigate: (v: ViewKey) => void;
  onNewDesign: () => void;
  onSelectDesign: (design: SavedDesign) => void;
}

const SCALE_LABELS: Record<string, string> = {
  startup: "Startup",
  growth: "Growth",
  large: "Large Scale",
  internet: "Internet Scale",
};

export function Overview({
  userId,
  onNavigate,
  onNewDesign,
  onSelectDesign,
}: OverviewProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["design-overview", userId],
    queryFn: fetchDesignOverview,
    enabled: userId.length > 0,
  });
  const statsData = data?.stats;
  const stats = [
    {
      label: "Designs",
      value: statsData?.designs ?? 0,
      icon: Boxes,
      trend: "created by you",
    },
    {
      label: "Components",
      value: statsData?.components ?? 0,
      icon: GitBranch,
      trend: "across all designs",
    },
    {
      label: "Simulations Run",
      value: statsData?.simulationsRun ?? 0,
      icon: Activity,
      trend: "no simulation data yet",
    },
    {
      label: "Avg Latency",
      value: `${statsData?.averageLatencyMs ?? 0}ms`,
      icon: Zap,
      trend: "no simulation data yet",
    },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[900px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              DASHBOARD
            </span>
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-[28px] font-bold tracking-tight text-[var(--text-primary)] leading-tight mb-2">
            SYSTEM DESIGN WORKSPACE
          </h1>
          <p className="text-[14px] text-[var(--text-secondary)]">
            Turn ideas into production-ready architectures.
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={onNewDesign}
          size={"sm"}
          className="group flex items-center gap-1 px-5 py-3.5  my-5"
        >
          <Plus size={14} strokeWidth={2} />
          <span>Design</span>
        </Button>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border-subtle)] mb-10">
          {stats.map((s) => (
            <div key={s.label} className="bg-[var(--bg-base)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <s.icon
                  size={13}
                  className="text-[var(--text-muted)]"
                  strokeWidth={1.6}
                />
                <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                  {s.label}
                </span>
              </div>
              <div className="text-[22px] font-bold tracking-tight text-[var(--text-primary)]">
                {s.value}
              </div>
              <div className="font-mono text-[10px] text-[var(--text-muted)] mt-1">
                {s.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Recent designs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Recent Designs
            </span>
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
            <button
              onClick={() => onNavigate("my-designs")}
              className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
            >
              View All →
            </button>
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)]">
          {(data?.recentDesigns ?? []).map((design, i) => (
            <button
              type="button"
              key={design.id}
              onClick={() => onSelectDesign(design)}
              className={cx(
                "group flex w-full items-center gap-4 px-3 py-3.5 text-left transition-colors hover:bg-[var(--bg-elevated)]",
                i > 0 && "border-t border-[var(--border-subtle)]",
              )}
            >
              <div className="w-8 h-8 border border-[var(--border-default)] bg-[var(--bg-surface)] flex items-center justify-center shrink-0">
                <Boxes
                  size={15}
                  className="text-[var(--text-secondary)]"
                  strokeWidth={1.6}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-[var(--text-primary)] truncate">
                    {design.name}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)] px-1.5 py-0.5 border border-[var(--border-default)]">
                    {design.nodes.length} components
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 font-mono text-[10px] text-[var(--text-muted)]">
                    <Clock size={10} />{" "}
                    {new Date(design.createdAt).toLocaleDateString()}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    Architecture · {SCALE_LABELS[design.scale] ?? design.scale}
                  </span>
                </div>
              </div>
              <ArrowUpRight
                size={15}
                className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              />
            </button>
          ))}
          {isLoading && (
            <p className="py-8 text-center text-[12px] text-[var(--text-muted)]">
              Loading your recent designs...
            </p>
          )}
          {error && (
            <p role="alert" className="py-4 text-[12px] text-[var(--error)]">
              {error instanceof Error
                ? error.message
                : "Could not load your overview."}
            </p>
          )}
          {!isLoading &&
            !error &&
            (data?.recentDesigns.length ?? 0) === 0 && (
              <p className="py-8 text-center text-[12px] text-[var(--text-muted)]">
                You have not created any designs yet.
              </p>
            )}
        </div>

        {/* What If section */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Quick Simulate
            </span>
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
          </div>
          <div className="border border-dashed border-[var(--border-default)] p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp
                size={14}
                className="text-[var(--accent-primary)]"
                strokeWidth={1.8}
              />
              <span className="text-[13px] font-medium text-[var(--text-primary)]">
                WHAT IF?
              </span>
            </div>
            <p className="text-[12px] text-[var(--text-secondary)] mb-4">
              Test your architecture against real-world scenarios before
              production.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "What if traffic increases 10×?",
                "What if PostgreSQL goes down?",
                "What if Kafka becomes unavailable?",
                "What if latency requirement becomes 50ms?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => onNavigate("simulations")}
                  className="text-left px-3 py-2 border border-[var(--border-default)] text-[12px] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
