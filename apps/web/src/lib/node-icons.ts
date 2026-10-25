import {
  Database, Zap, ListOrdered, Server, Boxes, Network,
  Globe, HardDrive, Cpu, ShieldCheck, Search, Cloud,
  type LucideIcon,
} from 'lucide-react';
import type { NodeCategory } from './types';

export const NODE_ICONS: Record<NodeCategory, LucideIcon> = {
  database: Database,
  cache: Zap,
  queue: ListOrdered,
  api: Server,
  service: Boxes,
  loadbalancer: Network,
  cdn: Globe,
  storage: HardDrive,
  worker: Cpu,
  auth: ShieldCheck,
  search: Search,
  gateway: Cloud,
};

export const NODE_COLORS: Record<NodeCategory, string> = {
  database: 'var(--info)',
  cache: 'var(--accent-primary)',
  queue: 'var(--warn)',
  api: 'var(--accent-primary)',
  service: 'var(--accent-primary)',
  loadbalancer: 'var(--text-secondary)',
  cdn: 'var(--text-secondary)',
  storage: 'var(--info)',
  worker: 'var(--accent-primary)',
  auth: 'var(--warn)',
  search: 'var(--info)',
  gateway: 'var(--text-secondary)',
};

export const STATUS_COLORS: Record<string, string> = {
  healthy: 'var(--accent-primary)',
  warning: 'var(--warn)',
  failure: 'var(--error)',
  inactive: 'var(--text-muted)',
};
