import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, FilePlus2, Network, Save, Trash2 } from "lucide-react";
import "@xyflow/react/dist/style.css";
import type {
  ArchConnection,
  ArchNode,
  NodeCategory,
  SavedDesign,
} from "@/lib/types";
import { COMPONENT_LIBRARY } from "@/lib/mock-data";
import { NODE_COLORS, NODE_ICONS, STATUS_COLORS } from "@/lib/node-icons";
import { createBlankDesign, saveDesign } from "@/lib/designs-api";
import { cx } from "@/lib/helpers";

interface ArchCanvasProps {
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  failureNode?: string | null;
  design?: SavedDesign | null;
  onDesignSaved: (design: SavedDesign) => void;
}

interface ArchitectureNodeData extends Record<string, unknown> {
  label: string;
  category: NodeCategory;
  subtitle: string;
  metadata: string;
  status: ArchNode["status"];
  isFailed?: boolean;
}

type ArchitectureFlowNode = Node<ArchitectureNodeData, "architecture">;
type ArchitectureFlowEdge = Edge<{ label?: string }, "smoothstep">;

function layoutNodes(
  nodes: ArchitectureFlowNode[],
  edges: ArchitectureFlowEdge[],
): ArchitectureFlowNode[] {
  const graph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: "LR",
    ranker: "network-simplex",
    nodesep: 56,
    edgesep: 32,
    ranksep: 112,
    marginx: 72,
    marginy: 72,
  });

  for (const node of nodes) {
    graph.setNode(node.id, {
      width: node.measured?.width ?? 220,
      height: node.measured?.height ?? 84,
    });
  }
  for (const edge of edges) {
    if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
      graph.setEdge(edge.source, edge.target);
    }
  }

  dagre.layout(graph);
  return nodes.map((node) => {
    const position = graph.node(node.id);
    return {
      ...node,
      position: {
        x: position.x - (node.measured?.width ?? 220) / 2,
        y: position.y - (node.measured?.height ?? 84) / 2,
      },
    };
  });
}

function hasGeneratedGridLayout(nodes: ArchNode[]): boolean {
  return (
    nodes.length > 1 &&
    nodes.every(
      (node, index) =>
        node.x === 100 + (index % 4) * 260 &&
        node.y === 100 + Math.floor(index / 4) * 130,
    )
  );
}

function toFlowNodes(design?: SavedDesign | null): ArchitectureFlowNode[] {
  const nodes = (design?.nodes ?? []).map(
    (node) =>
      ({
        id: node.id,
        type: "architecture",
        position: { x: node.x, y: node.y },
        data: {
          label: node.label,
          category: node.category,
          subtitle: node.subtitle,
          metadata: node.metadata,
          status: node.status,
        },
      }) satisfies ArchitectureFlowNode,
  );
  return design && hasGeneratedGridLayout(design.nodes)
    ? layoutNodes(nodes, toFlowEdges(design))
    : nodes;
}

function toFlowEdges(design?: SavedDesign | null): ArchitectureFlowEdge[] {
  return (design?.edges ?? []).map((edge) => ({
    id: edge.id,
    source: edge.from,
    target: edge.to,
    type: "smoothstep",
    label: edge.label,
    animated: edge.animated,
    data: { label: edge.label },
  }));
}

const ArchitectureNode = memo(function ArchitectureNode({
  data,
  selected,
}: NodeProps<ArchitectureFlowNode>) {
  const Icon = NODE_ICONS[data.category];
  return (
    <div
      className={cx(
        "relative w-[220px] border bg-[var(--bg-elevated)] px-3 py-2.5 shadow-md transition-colors",
        data.isFailed
          ? "border-[var(--error)]"
          : selected
            ? "border-[var(--accent-primary)]"
            : "border-[var(--border-default)]",
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2.5 !w-2.5 !border-[var(--bg-elevated)] !bg-[var(--accent-primary)]"
      />
      <div className="flex items-start gap-2">
        <Icon
          size={15}
          strokeWidth={1.6}
          style={{ color: NODE_COLORS[data.category] }}
          className="mt-0.5 shrink-0"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-1.5">
            <span className="truncate font-mono text-[11px] font-semibold text-[var(--text-primary)]">
              {data.label}
            </span>
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: STATUS_COLORS[data.status] }}
            />
          </div>
          <span className="truncate text-[10px] text-[var(--text-secondary)]">
            {data.subtitle}
          </span>
          {data.metadata && (
            <span className="mt-1 truncate font-mono text-[9px] text-[var(--text-muted)]">
              {data.metadata}
            </span>
          )}
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 h-0.5"
        style={{
          width: data.isFailed ? "100%" : "33%",
          background: data.isFailed
            ? "var(--error)"
            : NODE_COLORS[data.category],
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2.5 !w-2.5 !border-[var(--bg-elevated)] !bg-[var(--accent-primary)]"
      />
    </div>
  );
});

const NODE_TYPES = { architecture: ArchitectureNode };
const NODE_CATEGORIES = Object.keys(NODE_ICONS) as NodeCategory[];

function ArchCanvasFlow({
  selectedNodeId,
  onSelectNode,
  failureNode,
  design,
  onDesignSaved,
}: ArchCanvasProps) {
  const queryClient = useQueryClient();
  const { fitView, screenToFlowPosition } = useReactFlow<
    ArchitectureFlowNode,
    ArchitectureFlowEdge
  >();
  const [nodes, setNodes, onNodesChange] = useNodesState<ArchitectureFlowNode>(
    toFlowNodes(design),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<ArchitectureFlowEdge>(
    toFlowEdges(design),
  );
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setNodes(toFlowNodes(design));
    setEdges(toFlowEdges(design));
    setIsDirty(false);
    setSelectedEdgeId(null);
  }, [design, setEdges, setNodes]);

  useEffect(() => {
    setNodes((current) =>
      current.map((node) => {
        const isFailed = node.id === failureNode;
        return node.data.isFailed === isFailed
          ? node
          : { ...node, data: { ...node.data, isFailed } };
      }),
    );
  }, [design?.id, failureNode, setNodes]);

  const saveMutation = useMutation({
    mutationFn: () => {
      if (!design)
        throw new Error("Select a saved design before saving changes.");
      const savedNodes: ArchNode[] = nodes.map((node) => ({
        id: node.id,
        label: node.data.label,
        category: node.data.category,
        subtitle: node.data.subtitle,
        metadata: node.data.metadata,
        x: node.position.x,
        y: node.position.y,
        width: node.measured?.width ?? 200,
        height: node.measured?.height ?? 80,
        status: node.data.status,
      }));
      const savedEdges: ArchConnection[] = edges.map((edge) => ({
        id: edge.id,
        from: edge.source,
        to: edge.target,
        ...(typeof edge.label === "string" && edge.label
          ? { label: edge.label }
          : {}),
        ...(edge.animated ? { animated: true } : {}),
      }));
      return saveDesign(design.id, savedNodes, savedEdges);
    },
    onSuccess: async (savedDesign) => {
      onDesignSaved(savedDesign);
      setIsDirty(false);
      await queryClient.invalidateQueries({ queryKey: ["design-overview"] });
      await queryClient.invalidateQueries({ queryKey: ["designs"] });
    },
  });

  const blankMutation = useMutation({
    mutationFn: createBlankDesign,
    onSuccess: async (blankDesign) => {
      onDesignSaved(blankDesign);
      onSelectNode(null);
      setSelectedEdgeId(null);
      setIsDirty(false);
      await queryClient.invalidateQueries({ queryKey: ["design-overview"] });
      await queryClient.invalidateQueries({ queryKey: ["designs"] });
    },
  });

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const selectedEdge = edges.find((edge) => edge.id === selectedEdgeId);
  const renderedEdges = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        style:
          failureNode &&
          (edge.source === failureNode || edge.target === failureNode)
            ? { ...edge.style, stroke: "var(--error)" }
            : edge.style,
        animated:
          edge.animated ||
          Boolean(
            failureNode &&
            (edge.source === failureNode || edge.target === failureNode),
          ),
      })),
    [edges, failureNode],
  );

  const handleAutoArrange = useCallback(() => {
    setNodes((current) => layoutNodes(current, edges));
    setIsDirty(true);
    requestAnimationFrame(() => {
      void fitView({ padding: 0.18, duration: 300 });
    });
  }, [edges, fitView, setNodes]);

  const handleConnect = useCallback(
    (connection: Connection) => {
      setEdges((current) =>
        addEdge(
          {
            ...connection,
            id: crypto.randomUUID(),
            type: "smoothstep",
            data: {},
          },
          current,
        ),
      );
      setIsDirty(true);
      setSelectedEdgeId(null);
    },
    [setEdges],
  );

  const handleAddNode = useCallback(
    (category: NodeCategory, label: string) => {
      if (nodes.length >= 20) return;
      const bounds = document
        .querySelector(".react-flow")
        ?.getBoundingClientRect();
      const position = bounds
        ? screenToFlowPosition({
            x: bounds.left + bounds.width / 2,
            y: bounds.top + bounds.height / 2,
          })
        : { x: 100, y: 100 };
      const id = crypto.randomUUID();
      const newNode: ArchitectureFlowNode = {
        id,
        type: "architecture",
        position: {
          x: position.x + (nodes.length % 4) * 30,
          y: position.y + (nodes.length % 4) * 30,
        },
        data: {
          label,
          category,
          subtitle: label,
          metadata: "",
          status: "healthy",
        },
      };
      setNodes((current) => [
        ...current.map((node) => ({ ...node, selected: false })),
        { ...newNode, selected: true },
      ]);
      setEdges((current) =>
        current.map((edge) => ({ ...edge, selected: false })),
      );
      onSelectNode(id);
      setSelectedEdgeId(null);
      setIsDirty(true);
    },
    [nodes.length, onSelectNode, screenToFlowPosition, setEdges, setNodes],
  );

  const updateSelectedNode = useCallback(
    (updates: Partial<ArchitectureNodeData>) => {
      if (!selectedNodeId) return;
      setNodes((current) =>
        current.map((node) =>
          node.id === selectedNodeId
            ? { ...node, data: { ...node.data, ...updates } }
            : node,
        ),
      );
      setIsDirty(true);
    },
    [selectedNodeId, setNodes],
  );

  const updateSelectedEdge = useCallback(
    (updates: Partial<ArchitectureFlowEdge>) => {
      if (!selectedEdgeId) return;
      setEdges((current) =>
        current.map((edge) =>
          edge.id === selectedEdgeId ? { ...edge, ...updates } : edge,
        ),
      );
      setIsDirty(true);
    },
    [selectedEdgeId, setEdges],
  );

  const handleNodesChange: typeof onNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      if (
        changes.some(
          (change) => change.type === "position" || change.type === "remove",
        )
      ) {
        setIsDirty(true);
      }
    },
    [onNodesChange],
  );

  const handleEdgesChange: typeof onEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
      if (changes.some((change) => change.type === "remove")) setIsDirty(true);
    },
    [onEdgesChange],
  );

  return (
    <div className="flex h-full min-h-0">
      <aside className="w-44 shrink-0 overflow-y-auto border-r border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
        <div className="border-b border-[var(--border-subtle)] px-3 py-2.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            Components
          </span>
        </div>
        {COMPONENT_LIBRARY.map((group) => (
          <div key={group.category} className="py-2">
            <div className="px-3 pb-1">
              <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                {group.category}
              </span>
            </div>
            {group.items.map((item) => {
              const Icon = NODE_ICONS[item.type];
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => handleAddNode(item.type, item.label)}
                  disabled={nodes.length >= 20}
                  title={
                    nodes.length >= 20
                      ? "A design can contain at most 20 components"
                      : `Add ${item.label}`
                  }
                  className="group flex w-full items-center gap-2 px-3 py-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Icon
                    size={13}
                    strokeWidth={1.6}
                    style={{ color: NODE_COLORS[item.type] }}
                  />
                  <span className="text-left text-[11px] font-medium">
                    {item.label}
                  </span>
                  <span className="ml-auto font-mono text-[9px] opacity-0 transition-opacity group-hover:opacity-100">
                    +
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </aside>

      <div className="relative min-w-0 flex-1">
        <ReactFlow
          nodes={nodes}
          edges={renderedEdges}
          nodeTypes={NODE_TYPES}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={handleConnect}
          onNodeClick={(_, node) => {
            onSelectNode(node.id);
            setSelectedEdgeId(null);
          }}
          onEdgeClick={(_, edge) => {
            onSelectNode(null);
            setSelectedEdgeId(edge.id);
          }}
          onPaneClick={() => {
            onSelectNode(null);
            setSelectedEdgeId(null);
          }}
          fitView
          deleteKeyCode={["Backspace", "Delete"]}
          defaultEdgeOptions={{
            type: "smoothstep",
            style: { stroke: "var(--border-strong)", strokeWidth: 1.5 },
            labelStyle: {
              fill: "var(--text-secondary)",
              fontSize: 10,
              fontFamily: "var(--font-mono)",
            },
            labelBgStyle: {
              fill: "var(--bg-elevated)",
              fillOpacity: 0.95,
            },
            labelBgPadding: [4, 2],
            labelBgBorderRadius: 2,
          }}
          className="bg-(--bg-base)"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="var(--grid-dot)"
          />
          <Controls className="overflow-hidden! rounded-none! !border !border-[var(--border-default)] !bg-[var(--bg-elevated)] [&>button]:!border-[var(--border-subtle)] [&>button]:!bg-[var(--bg-elevated)] [&>button]:!fill-[var(--text-secondary)]" />
          <MiniMap
            nodeColor={(node) => {
              const category = (node.data as ArchitectureNodeData).category;
              return NODE_COLORS[category];
            }}
            className="!rounded-none !border !border-[var(--border-default)] !bg-[var(--bg-elevated)]"
          />
        </ReactFlow>
        <div className="absolute left-3 right-3 top-3 z-10 flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => blankMutation.mutate()}
              disabled={blankMutation.isPending}
              className="inline-flex h-8 items-center gap-1.5 border border-[var(--border-default)] bg-[var(--bg-elevated)] px-2.5 text-[10px] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] disabled:opacity-50"
              title="Start a separate empty design canvas"
            >
              <FilePlus2 size={13} />
              {blankMutation.isPending ? "Creating..." : "Blank Canvas"}
            </button>
            {blankMutation.error && (
              <span
                role="alert"
                className="max-w-56 text-[10px] text-[var(--error)]"
              >
                {blankMutation.error instanceof Error
                  ? blankMutation.error.message
                  : "Could not create a blank canvas."}
              </span>
            )}
          </div>
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-end gap-1 pt-1">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                Architecture Canvas
              </span>
              <span className="font-mono text-[9px] text-[var(--text-muted)]">
                {nodes.length} nodes · {edges.length} connections
              </span>
            </div>
            <button
              type="button"
              onClick={handleAutoArrange}
              disabled={nodes.length < 2}
              className="inline-flex h-8 items-center gap-1.5 border border-[var(--border-default)] bg-[var(--bg-elevated)] px-2.5 text-[10px] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] disabled:cursor-not-allowed disabled:opacity-40"
              title="Arrange connected components in clean left-to-right layers"
            >
              <Network size={12} />
              Auto arrange
            </button>
            <button
              type="button"
              onClick={() => saveMutation.mutate()}
              disabled={!design || !isDirty || saveMutation.isPending}
              className="inline-flex h-8 items-center gap-1.5 border border-[var(--border-default)] bg-[var(--bg-elevated)] px-2.5 text-[10px] text-[var(--accent-primary)] disabled:cursor-not-allowed disabled:opacity-40"
              title={
                !design ? "Select a design to enable saving" : "Save design"
              }
            >
              {saveMutation.isSuccess && !isDirty ? (
                <Check size={12} />
              ) : (
                <Save size={12} />
              )}
              {saveMutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
        {(saveMutation.error || (isDirty && !saveMutation.error)) && (
          <p
            role={saveMutation.error ? "alert" : undefined}
            className={cx(
              "absolute bottom-3 left-3 z-10 max-w-56 text-[10px]",
              saveMutation.error
                ? "text-[var(--error)]"
                : "text-[var(--text-muted)]",
            )}
          >
            {saveMutation.error instanceof Error
              ? saveMutation.error.message
              : saveMutation.error
                ? "Could not save the design."
                : "Unsaved changes"}
          </p>
        )}
        {selectedEdge && (
          <div className="absolute bottom-3 left-1/2 z-20 w-64 -translate-x-1/2 space-y-2 border border-[var(--border-default)] bg-[var(--bg-elevated)] p-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Connection
              </span>
              <button
                type="button"
                onClick={() => {
                  setEdges((current) =>
                    current.filter((edge) => edge.id !== selectedEdge.id),
                  );
                  setSelectedEdgeId(null);
                  setIsDirty(true);
                }}
                className="inline-flex items-center gap-1 text-[10px] text-[var(--error)]"
              >
                <Trash2 size={12} />
                Remove
              </button>
            </div>
            <label className="block">
              <span className="mb-1 block text-[10px] text-[var(--text-muted)]">
                From component
              </span>
              <select
                value={selectedEdge.source}
                onChange={(event) =>
                  updateSelectedEdge({ source: event.target.value })
                }
                className="w-full border border-[var(--border-default)] bg-[var(--bg-base)] px-2 py-1.5 text-[11px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
              >
                {nodes
                  .filter((node) => node.id !== selectedEdge.target)
                  .map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.data.label}
                    </option>
                  ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-[10px] text-[var(--text-muted)]">
                To component
              </span>
              <select
                value={selectedEdge.target}
                onChange={(event) =>
                  updateSelectedEdge({ target: event.target.value })
                }
                className="w-full border border-[var(--border-default)] bg-[var(--bg-base)] px-2 py-1.5 text-[11px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
              >
                {nodes
                  .filter((node) => node.id !== selectedEdge.source)
                  .map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.data.label}
                    </option>
                  ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-[10px] text-[var(--text-muted)]">
                Label
              </span>
              <input
                value={
                  typeof selectedEdge.label === "string"
                    ? selectedEdge.label
                    : ""
                }
                onChange={(event) =>
                  updateSelectedEdge({
                    label: event.target.value,
                    data: { label: event.target.value },
                  })
                }
                placeholder="e.g. HTTP, reads, events"
                className="w-full border border-[var(--border-default)] bg-[var(--bg-base)] px-2 py-1.5 text-[11px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
              />
            </label>
            <label className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={selectedEdge.animated ?? false}
                onChange={(event) =>
                  updateSelectedEdge({ animated: event.target.checked })
                }
                className="accent-[var(--accent-primary)]"
              />
              Animate connection
            </label>
          </div>
        )}
      </div>

      {selectedNode && (
        <aside className="w-60 shrink-0 overflow-y-auto border-l border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-3 py-2.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Properties
            </span>
            <button
              type="button"
              onClick={() => onSelectNode(null)}
              className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              Close
            </button>
          </div>

          <div className="space-y-3 p-3">
            {selectedNode ? (
              <>
                <label className="block">
                  <span className="mb-1 block text-[10px] text-[var(--text-muted)]">
                    Name
                  </span>
                  <input
                    value={selectedNode.data.label}
                    onChange={(event) =>
                      updateSelectedNode({ label: event.target.value })
                    }
                    className="w-full border border-[var(--border-default)] bg-[var(--bg-base)] px-2 py-1.5 text-[11px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] text-[var(--text-muted)]">
                    Subtitle
                  </span>
                  <input
                    value={selectedNode.data.subtitle}
                    onChange={(event) =>
                      updateSelectedNode({ subtitle: event.target.value })
                    }
                    className="w-full border border-[var(--border-default)] bg-[var(--bg-base)] px-2 py-1.5 text-[11px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] text-[var(--text-muted)]">
                    Details
                  </span>
                  <textarea
                    value={selectedNode.data.metadata}
                    onChange={(event) =>
                      updateSelectedNode({ metadata: event.target.value })
                    }
                    rows={3}
                    className="w-full resize-y border border-[var(--border-default)] bg-[var(--bg-base)] px-2 py-1.5 text-[11px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] text-[var(--text-muted)]">
                    Component type
                  </span>
                  <select
                    value={selectedNode.data.category}
                    onChange={(event) =>
                      updateSelectedNode({
                        category: event.target.value as NodeCategory,
                      })
                    }
                    className="w-full border border-[var(--border-default)] bg-[var(--bg-base)] px-2 py-1.5 text-[11px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                  >
                    {NODE_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setNodes((current) =>
                      current.filter((node) => node.id !== selectedNode.id),
                    );
                    setEdges((current) =>
                      current.filter(
                        (edge) =>
                          edge.source !== selectedNode.id &&
                          edge.target !== selectedNode.id,
                      ),
                    );
                    onSelectNode(null);
                    setIsDirty(true);
                  }}
                  className="inline-flex items-center gap-1.5 pt-1 text-[10px] text-[var(--error)]"
                >
                  <Trash2 size={12} />
                  Remove component
                </button>
              </>
            ) : selectedEdge ? (
              <>
                <label className="block">
                  <span className="mb-1 block text-[10px] text-[var(--text-muted)]">
                    From component
                  </span>
                  <select
                    value={selectedEdge.source}
                    onChange={(event) =>
                      updateSelectedEdge({ source: event.target.value })
                    }
                    className="w-full border border-[var(--border-default)] bg-[var(--bg-base)] px-2 py-1.5 text-[11px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                  >
                    {nodes
                      .filter((node) => node.id !== selectedEdge.target)
                      .map((node) => (
                        <option key={node.id} value={node.id}>
                          {node.data.label}
                        </option>
                      ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] text-[var(--text-muted)]">
                    To component
                  </span>
                  <select
                    value={selectedEdge.target}
                    onChange={(event) =>
                      updateSelectedEdge({ target: event.target.value })
                    }
                    className="w-full border border-[var(--border-default)] bg-[var(--bg-base)] px-2 py-1.5 text-[11px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                  >
                    {nodes
                      .filter((node) => node.id !== selectedEdge.source)
                      .map((node) => (
                        <option key={node.id} value={node.id}>
                          {node.data.label}
                        </option>
                      ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] text-[var(--text-muted)]">
                    Connection label
                  </span>
                  <input
                    value={
                      typeof selectedEdge.label === "string"
                        ? selectedEdge.label
                        : ""
                    }
                    onChange={(event) =>
                      updateSelectedEdge({
                        label: event.target.value,
                        data: { label: event.target.value },
                      })
                    }
                    placeholder="e.g. HTTP, reads, events"
                    className="w-full border border-[var(--border-default)] bg-[var(--bg-base)] px-2 py-1.5 text-[11px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                  />
                </label>
                <label className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)]">
                  <input
                    type="checkbox"
                    checked={selectedEdge.animated ?? false}
                    onChange={(event) =>
                      updateSelectedEdge({ animated: event.target.checked })
                    }
                    className="accent-[var(--accent-primary)]"
                  />
                  Animate connection
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setEdges((current) =>
                      current.filter((edge) => edge.id !== selectedEdge.id),
                    );
                    setSelectedEdgeId(null);
                    setIsDirty(true);
                  }}
                  className="inline-flex items-center gap-1.5 pt-1 text-[10px] text-[var(--error)]"
                >
                  <Trash2 size={12} />
                  Remove connection
                </button>
              </>
            ) : (
              <p className="text-[11px] leading-relaxed text-[var(--text-muted)]">
                Select a node or connection to edit it. Add components from the
                left panel, then drag between node handles to connect them.
              </p>
            )}
            {nodes.length >= 20 && (
              <p className="text-[10px] text-[var(--text-muted)]">
                Maximum of 20 components reached.
              </p>
            )}
            {saveMutation.error && (
              <p role="alert" className="text-[10px] text-[var(--error)]">
                {saveMutation.error instanceof Error
                  ? saveMutation.error.message
                  : "Could not save the design."}
              </p>
            )}
            {isDirty && !saveMutation.error && (
              <p className="text-[10px] text-[var(--text-muted)]">
                Unsaved changes
              </p>
            )}
            {failureNode && selectedNodeId === failureNode && (
              <p className="border-t border-[var(--border-subtle)] pt-2 text-[10px] text-[var(--error)]">
                This component is targeted by the active failure simulation.
              </p>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}

export function ArchCanvas(props: ArchCanvasProps) {
  return (
    <ReactFlowProvider>
      <ArchCanvasFlow {...props} />
    </ReactFlowProvider>
  );
}
