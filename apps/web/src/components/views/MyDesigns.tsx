import { Plus, Clock, GitBranch, Boxes, ArrowRight } from "lucide-react";
import type { SavedDesign } from "@/lib/types";
import { cx } from "@/lib/helpers";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface MyDesignsProps {
  onNewDesign: () => void;
  designs: SavedDesign[];
  loading: boolean;
  error: string | null;
  onSelectDesign: (design: SavedDesign) => void;
}

const SCALE_LABELS: Record<string, string> = {
  startup: "Startup",
  growth: "Growth",
  large: "Large Scale",
  internet: "Internet Scale",
};

export function MyDesigns({
  onNewDesign,
  designs,
  loading,
  error,
  onSelectDesign,
}: MyDesignsProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-200 mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-(--text-muted)">
                MY DESIGNS
              </span>
              <span className="h-px w-16 bg-(--border-subtle)" />
            </div>
            <h1 className="text-[22px] font-bold tracking-tight text-(--text-primary)">
              All System Designs
            </h1>
            <p className="font-mono text-[11px] text-(--text-muted) mt-1">
              {designs.length}{" "}
              {designs.length === 1 ? "design" : "designs"}{" "}
            </p>
          </div>
          <Button
            onClick={onNewDesign}
            size={"sm"}
            className="group flex items-center gap-1 px-5 py-3.5 my-5"
          >
            <Plus size={14} strokeWidth={2} />
            <span>Design</span>
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-t hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead className="hidden w-32 sm:table-cell">Scale</TableHead>
              <TableHead className="hidden w-32 md:table-cell">
                Updated
              </TableHead>
              <TableHead className="w-20">Version</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {designs.map((design) => (
              <TableRow
                key={design.id}
                tabIndex={0}
                onClick={() => onSelectDesign(design)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectDesign(design);
                  }
                }}
                className="group cursor-pointer"
              >
                {/* Name */}
                <TableCell>
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--border-default)] bg-[var(--bg-surface)]">
                      <Boxes
                        size={14}
                        strokeWidth={1.6}
                        className="text-[var(--text-secondary)]"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-[13px] font-medium text-[var(--text-primary)]">
                        {design.name}
                      </span>
                      {/* sirf mobile pe dikhega, jab Scale/Updated columns hidden hain */}
                      <span className="font-mono text-[10px] text-[var(--text-muted)] sm:hidden">
                        {SCALE_LABELS[design.scale] ?? design.scale} ·{" "}
                        {new Date(design.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Scale */}
                <TableCell className="hidden font-mono text-[11px] text-[var(--text-secondary)] sm:table-cell">
                  {SCALE_LABELS[design.scale] ?? design.scale}
                </TableCell>

                {/* Updated */}
                <TableCell className="hidden md:table-cell">
                  <span className="flex items-center gap-1 font-mono text-[10px] text-[var(--text-muted)]">
                    <Clock size={10} />
                    {new Date(design.updatedAt).toLocaleDateString()}
                  </span>
                </TableCell>

                {/* Version */}
                <TableCell>
                  <span className="flex items-center gap-1 font-mono text-[10px] text-[var(--text-muted)]">
                    <GitBranch size={10} /> v1
                  </span>
                </TableCell>

                {/* Arrow */}
                <TableCell className="text-right">
                  <ArrowRight
                    size={14}
                    className="ml-auto text-[var(--text-muted)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {loading && (
          <p className="py-8 text-center text-[12px] text-[var(--text-muted)]">
            Loading your designs...
          </p>
        )}
        {error && (
          <p role="alert" className="py-4 text-[12px] text-[var(--error)]">
            {error}
          </p>
        )}
        {!loading && !error && designs.length === 0 && (
          <div className="mt-6 border border-dashed border-[var(--border-default)] p-6 text-center">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-2">
              NO DESIGNS YET
            </span>
            <p className="text-[12px] text-[var(--text-secondary)] mb-4">
              Start with a product requirement and let Architect AI turn it into
              an engineering blueprint.
            </p>
            <button
              onClick={onNewDesign}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--accent-primary)] text-[var(--accent-primary)] text-[12px] font-medium hover:bg-[var(--accent-glow)] transition-colors"
            >
              <Plus size={14} strokeWidth={2} />
              New System Design
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
