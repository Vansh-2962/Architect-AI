import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import "./App.css";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { AICopilot } from "@/components/AICopilot";
import { CommandPalette } from "@/components/CommandPalette";
import { ArchCanvas } from "@/components/ArchCanvas";
import { Overview } from "@/components/views/Overview";
import { NewDesign } from "@/components/views/NewDesign";
import { Requirements } from "@/components/views/Requirements";
import { CapacityPlanner } from "@/components/views/CapacityPlanner";
import { DatabaseView } from "@/components/views/DatabaseView";
import { ApiDesign } from "@/components/views/ApiDesign";
import { TradeOffs } from "@/components/views/TradeOffs";
import { FailureSimulation } from "@/components/views/FailureSimulation";
import { InterviewMode } from "@/components/views/InterviewMode";
import { KnowledgeBase } from "@/components/views/KnowledgeBase";
import { Templates } from "@/components/views/Templates";
import { MyDesigns } from "@/components/views/MyDesigns";
import { AuthScreen } from "@/components/AuthScreen";
import type { ViewKey } from "@/lib/types";
import { useTheme } from "@/lib/theme";
import { authClient } from "@/lib/auth-client";
import { createDesign, fetchDesigns } from "@/lib/designs-api";
import type { SavedDesign } from "@/lib/types";
import { Loader2 } from "lucide-react";

const BREADCRUMBS: Record<ViewKey, string[]> = {
  overview: ["My Designs", "Overview"],
  "new-design": ["New Design"],
  "my-designs": ["My Designs"],
  templates: ["Templates"],
  knowledge: ["Knowledge Base"],
  interview: ["Interview Mode"],
  architecture: ["My Designs", "Instagram Clone", "Architecture"],
  requirements: ["My Designs", "Instagram Clone", "Requirements"],
  apis: ["My Designs", "Instagram Clone", "APIs"],
  database: ["My Designs", "Instagram Clone", "Database"],
  capacity: ["My Designs", "Instagram Clone", "Capacity"],
  tradeoffs: ["My Designs", "Instagram Clone", "Trade-offs"],
  simulations: ["My Designs", "Instagram Clone", "Simulations"],
};

const AI_PANEL_VIEWS: ViewKey[] = [
  "architecture",
  "requirements",
  "apis",
  "database",
  "capacity",
  "tradeoffs",
  "simulations",
];

function App() {
  const queryClient = useQueryClient();
  const { data: authSession, isPending: authPending } = authClient.useSession();
  const userId = authSession?.user.id ?? "";
  const [activeView, setActiveView] = useState<ViewKey>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiCollapsed, setAiCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [failureNode, setFailureNode] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [designsLoading, setDesignsLoading] = useState(false);
  const [designsError, setDesignsError] = useState<string | null>(null);
  const [currentDesign, setCurrentDesign] = useState<SavedDesign | null>(null);
  const [version] = useState(0.8);
  const { toggleTheme } = useTheme();

  useEffect(() => {
    if (!authSession?.user.id) return;
    let isActive = true;
    setDesignsLoading(true);
    setDesignsError(null);
    fetchDesigns()
      .then((savedDesigns) => {
        if (isActive) setDesigns(savedDesigns);
      })
      .catch((cause: unknown) => {
        if (isActive) {
          setDesignsError(
            cause instanceof Error
              ? cause.message
              : "Could not load your designs.",
          );
        }
      })
      .finally(() => {
        if (isActive) setDesignsLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, [authSession?.user.id]);

  const handleGenerateDesign = async (prompt: string, scale: string) => {
    const design = await createDesign(prompt, scale);
    setCurrentDesign(design);
    setDesigns((previous) => [
      design,
      ...previous.filter((existing) => existing.id !== design.id),
    ]);
    setDesignsError(null);
    await queryClient.invalidateQueries({ queryKey: ["design-overview"] });
    return design;
  };

  const handleSelectDesign = (design: SavedDesign) => {
    setCurrentDesign(design);
    setSelectedNode(null);
    handleNavigate("architecture");
  };

  const handleDesignSaved = (savedDesign: SavedDesign) => {
    setCurrentDesign(savedDesign);
    setDesigns((previous) => {
      const alreadyExists = previous.some(
        (design) => design.id === savedDesign.id,
      );
      return alreadyExists
        ? previous.map((design) =>
            design.id === savedDesign.id ? savedDesign : design,
          )
        : [savedDesign, ...previous];
    });
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError(null);
    try {
      const result = await authClient.signOut();
      if (result.error)
        setSignOutError(result.error.message ?? "Could not sign out.");
    } catch (cause) {
      setSignOutError(
        cause instanceof Error
          ? cause.message
          : "Could not reach the authentication server.",
      );
    } finally {
      setSigningOut(false);
    }
  };

  // Command palette keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Auto-collapse AI panel on non-workspace views
  useEffect(() => {
    if (!AI_PANEL_VIEWS.includes(activeView)) {
      setAiCollapsed(true);
    }
  }, [activeView]);

  const handleNavigate = (view: ViewKey) => {
    setActiveView(view);
    if (view === "simulations") setFailureNode(null);
  };

  const handleCommandAction = (action: string) => {
    switch (action) {
      case "generate":
        setActiveView("new-design");
        break;
      case "simulate":
        setActiveView("simulations");
        break;
      case "export":
        break;
      case "theme":
        toggleTheme();
        break;
    }
  };

  const renderView = () => {
    switch (activeView) {
      case "overview":
        return (
          <Overview
            userId={userId}
            onNavigate={handleNavigate}
            onNewDesign={() => setActiveView("new-design")}
            onSelectDesign={handleSelectDesign}
          />
        );
      case "new-design":
        return (
          <NewDesign
            onGenerate={handleGenerateDesign}
            onNavigate={handleNavigate}
          />
        );
      case "my-designs":
        return (
          <MyDesigns
            onNewDesign={() => setActiveView("new-design")}
            designs={designs}
            loading={designsLoading}
            error={designsError}
            onSelectDesign={handleSelectDesign}
          />
        );
      case "templates":
        return (
          <Templates onNavigate={handleNavigate} onUseTemplate={() => {}} />
        );
      case "knowledge":
        return <KnowledgeBase />;
      case "interview":
        return <InterviewMode />;
      case "architecture":
        return (
          <ArchCanvas
            selectedNodeId={selectedNode}
            onSelectNode={setSelectedNode}
            failureNode={failureNode}
            design={currentDesign}
            onDesignSaved={handleDesignSaved}
          />
        );
      case "requirements":
        return <Requirements />;
      case "apis":
        return <ApiDesign />;
      case "database":
        return <DatabaseView />;
      case "capacity":
        return <CapacityPlanner />;
      case "tradeoffs":
        return <TradeOffs />;
      case "simulations":
        return (
          <FailureSimulation
            onNavigate={handleNavigate}
            failureNode={failureNode}
            onSetFailure={setFailureNode}
          />
        );
      default:
        return (
          <Overview
            userId={userId}
            onNavigate={handleNavigate}
            onNewDesign={() => setActiveView("new-design")}
            onSelectDesign={handleSelectDesign}
          />
        );
    }
  };

  const showAiPanel = AI_PANEL_VIEWS.includes(activeView);

  if (authPending) {
    return (
      <div
        className="flex h-screen items-center justify-center bg-[var(--bg-base)]"
        role="status"
      >
        <Loader2
          className="animate-spin text-[var(--accent-primary)]"
          size={20}
        />
        <span className="sr-only">Checking your session</span>
      </div>
    );
  }

  if (!authSession) return <AuthScreen />;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-base)]">
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        userName={authSession.user.name || authSession.user.email}
        userEmail={authSession.user.email}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar
          breadcrumb={BREADCRUMBS[activeView]}
          onCommandPalette={() => setCommandOpen(true)}
          version={version}
          userName={authSession.user.name || authSession.user.email}
          onSignOut={handleSignOut}
          signingOut={signingOut}
          signOutError={signOutError}
        />

        {/* Workspace */}
        <div className="flex flex-1 min-h-0">
          <div className="flex-1 min-w-0 overflow-hidden">{renderView()}</div>

          {/* AI Copilot */}
          {showAiPanel && (
            <AICopilot
              collapsed={aiCollapsed}
              onToggle={() => setAiCollapsed((c) => !c)}
            />
          )}
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onNavigate={handleNavigate}
        onAction={handleCommandAction}
      />
    </div>
  );
}

export default App;
