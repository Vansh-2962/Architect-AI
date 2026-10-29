export type NodeCategory =
  | "database"
  | "cache"
  | "queue"
  | "api"
  | "service"
  | "loadbalancer"
  | "cdn"
  | "storage"
  | "worker"
  | "auth"
  | "search"
  | "gateway"
  | "client"
  | "server";

export type NodeStatus = 'healthy' | 'warning' | 'failure' | 'inactive';

export interface ArchNode {
  id: string;
  label: string;
  category: NodeCategory;
  subtitle: string;
  metadata: string;
  x: number;
  y: number;
  width: number;
  height: number;
  status: NodeStatus;
}

export interface ArchConnection {
  id: string;
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
  failed?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export interface DesignProject {
  id: string;
  name: string;
  scale: string;
  users: string;
  updated: string;
  version: number;
  prompt: string;
}

export interface SavedDesign {
  id: string;
  name: string;
  scale: string;
  prompt: string;
  nodes: ArchNode[];
  edges: ArchConnection[];
  createdAt: string;
  updatedAt: string;
}

export interface DesignOverview {
  recentDesigns: SavedDesign[];
  stats: {
    designs: number;
    components: number;
    simulationsRun: number;
    averageLatencyMs: number;
  };
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  auth: string;
  request: string;
  response: string;
  status: number;
}

export interface DbTable {
  id: string;
  name: string;
  columns: { name: string; type: string; pk?: boolean; fk?: string }[];
}

export interface TradeOff {
  id: string;
  decision: string;
  choice: string;
  attributes: { label: string; rating: 'excellent' | 'good' | 'moderate' | 'poor' | 'fair' }[];
  reasoning: string;
  alternatives: string[];
}

export interface FailureScenario {
  id: string;
  title: string;
  target: string;
  cascade: { label: string; status: 'failure' | 'warning' | 'info' }[];
  outcome: string;
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  category: string;
  summary: string;
  readTime: string;
}

export type ViewKey =
  | 'overview' | 'my-designs' | 'templates' | 'knowledge' | 'interview'
  | 'new-design'
  | 'architecture' | 'requirements' | 'apis' | 'database' | 'capacity' | 'tradeoffs' | 'simulations';

export interface TemplateItem {
  id: string;
  name: string;
  description: string;
  users: string;
  icon: string;
}
