import type {
  ArchNode, ArchConnection, ChatMessage, DesignProject,
  ApiEndpoint, DbTable, TradeOff, FailureScenario, KnowledgeDoc, TemplateItem, NodeCategory,
} from './types';

export const TEMPLATES: TemplateItem[] = [
  { id: 't1', name: 'URL Shortener', description: 'Short link generation with analytics', users: '500M users', icon: 'Link' },
  { id: 't2', name: 'Chat System', description: 'Real-time messaging platform', users: '100M users', icon: 'MessageSquare' },
  { id: 't3', name: 'Instagram', description: 'Photo sharing social platform', users: '10M DAU', icon: 'Camera' },
  { id: 't4', name: 'Netflix', description: 'Video streaming at scale', users: '200M users', icon: 'Play' },
  { id: 't5', name: 'Uber', description: 'Real-time ride matching', users: '50M users', icon: 'Car' },
  { id: 't6', name: 'Payment System', description: 'Distributed transaction processing', users: '30M users', icon: 'CreditCard' },
  { id: 't7', name: 'Notification System', description: 'Multi-channel delivery pipeline', users: '80M users', icon: 'Bell' },
];

export const RECENT_DESIGNS: DesignProject[] = [
  { id: 'd1', name: 'Instagram-like Platform', scale: '10M DAU', users: '10M DAU', updated: '2h ago', version: 4, prompt: 'Design a photo-sharing platform for 10M daily active users with media uploads, feeds, and notifications.' },
  { id: 'd2', name: 'Real-time Chat System', scale: '100M users', users: '100M users', updated: 'Yesterday', version: 7, prompt: 'Design a WhatsApp-like messaging system for 100 million users with low-latency messaging.' },
  { id: 'd3', name: 'Video Streaming Platform', scale: '50M users', users: '50M users', updated: '3 days ago', version: 3, prompt: 'Design a video streaming platform for 50M users with CDN delivery and adaptive bitrate.' },
  { id: 'd4', name: 'Distributed Cache', scale: '20M RPS', users: '20M RPS', updated: '1 week ago', version: 2, prompt: 'Design a distributed caching layer for 20M requests per second with eviction policies.' },
];

export const ARCH_NODES: ArchNode[] = [
  { id: 'cdn', label: 'CDN', category: 'cdn', subtitle: 'Cloudflare CDN', metadata: 'Edge · 240 PoPs', x: 360, y: 30, width: 200, height: 80, status: 'healthy' },
  { id: 'gateway', label: 'API GATEWAY', category: 'gateway', subtitle: 'Load Balancer + Auth', metadata: '120K RPS · TLS', x: 360, y: 150, width: 200, height: 80, status: 'healthy' },
  { id: 'api', label: 'API SERVICE', category: 'api', subtitle: 'Go Microservice', metadata: '8 replicas · 14K RPS', x: 210, y: 280, width: 200, height: 80, status: 'healthy' },
  { id: 'worker', label: 'WORKER', category: 'worker', subtitle: 'Async Processor', metadata: '4 replicas', x: 510, y: 280, width: 200, height: 80, status: 'healthy' },
  { id: 'postgres', label: 'POSTGRESQL', category: 'database', subtitle: 'Primary Database', metadata: 'PostgreSQL 17 · 12K w/s', x: 150, y: 420, width: 200, height: 80, status: 'healthy' },
  { id: 'redis', label: 'REDIS', category: 'cache', subtitle: 'Cache Layer', metadata: 'Cluster · 99.9% hit', x: 420, y: 420, width: 200, height: 80, status: 'healthy' },
  { id: 'kafka', label: 'KAFKA', category: 'queue', subtitle: 'Event Streaming', metadata: '6 brokers · 3 partitions', x: 510, y: 150, width: 200, height: 80, status: 'warning' },
  { id: 's3', label: 'S3', category: 'storage', subtitle: 'Object Storage', metadata: 'Media · 72 TB', x: 690, y: 280, width: 200, height: 80, status: 'healthy' },
];

export const ARCH_CONNECTION: ArchConnection[] = [
  { id: 'c1', from: 'cdn', to: 'gateway', label: 'HTTPS' },
  { id: 'c2', from: 'gateway', to: 'api', label: 'REST' },
  { id: 'c3', from: 'gateway', to: 'worker', label: 'gRPC' },
  { id: 'c4', from: 'gateway', to: 'kafka', label: 'events' },
  { id: 'c5', from: 'api', to: 'postgres', label: 'SQL' },
  { id: 'c6', from: 'api', to: 'redis', label: 'cache' },
  { id: 'c7', from: 'worker', to: 'redis', label: 'read' },
  { id: 'c8', from: 'worker', to: 's3', label: 'upload' },
  { id: 'c9', from: 'kafka', to: 'worker', label: 'consume', animated: true },
];

export const COMPONENT_LIBRARY: {
  category: string;
  items: { type: NodeCategory; label: string }[];
}[] = [
  {
    category: "Compute",
    items: [
      { type: "client", label: "Client" },
      { type: "server", label: "Server" },
      { type: "api", label: "API Service" },
      { type: "worker", label: "Worker" },
      { type: "service", label: "Microservice" },
      { type: "loadbalancer", label: "Load Balancer" },
      { type: "gateway", label: "API Gateway" },
    ],
  },
  {
    category: "Data",
    items: [
      { type: "database", label: "Database" },
      { type: "cache", label: "Cache" },
      { type: "queue", label: "Message Queue" },
      { type: "search", label: "Search Index" },
    ],
  },
  {
    category: "Infra",
    items: [
      { type: "cdn", label: "CDN" },
      { type: "storage", label: "Object Storage" },
      { type: "auth", label: "Auth Service" },
    ],
  },
];

export const INITIAL_CHAT: ChatMessage[] = [
  { id: 'm1', role: 'ai', content: "I've generated the architecture for your Instagram-like platform. The design handles 10M DAU with a CDN-fronted API gateway, horizontal API scaling, Redis caching, and Kafka for async event processing.\n\nKey decisions:\n01  CDN for static media delivery\n02  Redis cache to reduce DB load by ~90%\n03  Kafka to decouple async workloads\n04  PostgreSQL for strong consistency on core data\n\nAsk me about any component or decision.", timestamp: '14:32' },
  { id: 'm2', role: 'user', content: 'Why did you choose Kafka here?', timestamp: '14:33' },
  { id: 'm3', role: 'ai', content: "Kafka is used to decouple asynchronous workloads from the API layer.\n\nPrimary reasons:\n01  High throughput — handles 100K+ events/s\n02  Event replay — durable log for recovery\n03  Consumer scalability — parallel consumers\n04  Fault tolerance — replicated partitions\n\nAlternative: RabbitMQ could work for lower-throughput scenarios, but lacks event replay and partition-level parallelism.", timestamp: '14:33' },
];

export const API_ENDPOINTS: ApiEndpoint[] = [
  { id: 'a1', method: 'POST', path: '/api/v1/posts', description: 'Create a new post', auth: 'Bearer Token', request: '{\n  "content": "string",\n  "mediaUrl": "string"\n}', response: '{\n  "id": "uuid",\n  "createdAt": "ISO-8601"\n}', status: 201 },
  { id: 'a2', method: 'GET', path: '/api/v1/feed', description: 'Get user feed', auth: 'Bearer Token', request: '?cursor=string&limit=20', response: '{\n  "posts": [...],\n  "nextCursor": "string"\n}', status: 200 },
  { id: 'a3', method: 'GET', path: '/api/v1/posts/:id', description: 'Get single post', auth: 'Bearer Token', request: '', response: '{\n  "id": "uuid",\n  "content": "string",\n  "author": {...}\n}', status: 200 },
  { id: 'a4', method: 'DELETE', path: '/api/v1/posts/:id', description: 'Delete a post', auth: 'Bearer Token', request: '', response: '{\n  "deleted": true\n}', status: 200 },
  { id: 'a5', method: 'POST', path: '/api/v1/likes', description: 'Like a post', auth: 'Bearer Token', request: '{\n  "postId": "uuid"\n}', response: '{\n  "liked": true\n}', status: 201 },
  { id: 'a6', method: 'GET', path: '/api/v1/users/:id', description: 'Get user profile', auth: 'Bearer Token', request: '', response: '{\n  "id": "uuid",\n  "name": "string",\n  "followers": 42\n}', status: 200 },
];

export const DB_TABLES: DbTable[] = [
  { id: 't1', name: 'USERS', columns: [
    { name: 'id', type: 'UUID', pk: true },
    { name: 'email', type: 'VARCHAR(255)' },
    { name: 'username', type: 'VARCHAR(50)' },
    { name: 'name', type: 'VARCHAR(100)' },
    { name: 'avatar_url', type: 'TEXT' },
    { name: 'created_at', type: 'TIMESTAMP' },
  ]},
  { id: 't2', name: 'POSTS', columns: [
    { name: 'id', type: 'UUID', pk: true },
    { name: 'user_id', type: 'UUID', fk: 'USERS.id' },
    { name: 'content', type: 'TEXT' },
    { name: 'media_url', type: 'TEXT' },
    { name: 'like_count', type: 'INT' },
    { name: 'created_at', type: 'TIMESTAMP' },
  ]},
  { id: 't3', name: 'LIKES', columns: [
    { name: 'id', type: 'UUID', pk: true },
    { name: 'user_id', type: 'UUID', fk: 'USERS.id' },
    { name: 'post_id', type: 'UUID', fk: 'POSTS.id' },
    { name: 'created_at', type: 'TIMESTAMP' },
  ]},
  { id: 't4', name: 'FOLLOWS', columns: [
    { name: 'id', type: 'UUID', pk: true },
    { name: 'follower_id', type: 'UUID', fk: 'USERS.id' },
    { name: 'followee_id', type: 'UUID', fk: 'USERS.id' },
    { name: 'created_at', type: 'TIMESTAMP' },
  ]},
  { id: 't5', name: 'TIMELINE', columns: [
    { name: 'user_id', type: 'UUID', fk: 'USERS.id' },
    { name: 'post_id', type: 'UUID', fk: 'POSTS.id' },
    { name: 'score', type: 'FLOAT' },
    { name: 'created_at', type: 'TIMESTAMP' },
  ]},
];

export const TRADEOFFS: TradeOff[] = [
  { id: 'to1', decision: 'DATABASE DECISION', choice: 'PostgreSQL', attributes: [
    { label: 'Consistency', rating: 'excellent' },
    { label: 'Transactions', rating: 'excellent' },
    { label: 'Horizontal Scale', rating: 'moderate' },
    { label: 'Operational Cost', rating: 'good' },
    { label: 'Query Flexibility', rating: 'excellent' },
  ], reasoning: "Strong relational consistency is critical for user data, posts, and social graph relationships. PostgreSQL's ACID compliance and mature ecosystem make it the safest choice for core data. Horizontal scaling challenges are mitigated by read replicas and connection pooling.", alternatives: ['Cassandra', 'DynamoDB', 'MongoDB'] },
  { id: 'to2', decision: 'CACHE DECISION', choice: 'Redis Cluster', attributes: [
    { label: 'Latency', rating: 'excellent' },
    { label: 'Throughput', rating: 'excellent' },
    { label: 'Data Structures', rating: 'excellent' },
    { label: 'Persistence', rating: 'good' },
    { label: 'Cluster Support', rating: 'good' },
  ], reasoning: "Redis provides sub-millisecond reads with rich data structures (sorted sets for feeds, hashes for user data). Cluster mode enables horizontal scaling. The 99.9% cache hit rate reduces database load by approximately 90%.", alternatives: ['Memcached', 'Hazelcast', 'Aerospike'] },
  { id: 'to3', decision: 'MESSAGING DECISION', choice: 'Apache Kafka', attributes: [
    { label: 'Throughput', rating: 'excellent' },
    { label: 'Durability', rating: 'excellent' },
    { label: 'Event Replay', rating: 'excellent' },
    { label: 'Latency', rating: 'good' },
    { label: 'Operational Complexity', rating: 'moderate' },
  ], reasoning: "Kafka's durable log architecture enables event replay for recovery and debugging. Partition-level parallelism allows independent consumer scaling. The trade-off is operational complexity, which is justified at 100K+ events/sec throughput.", alternatives: ['RabbitMQ', 'AWS SQS', 'NATS'] },
];

export const FAILURE_SCENARIOS: FailureScenario[] = [
  { id: 'f1', title: 'Redis becomes unavailable', target: 'Redis', cascade: [
    { label: 'Redis cache goes down', status: 'failure' },
    { label: 'Cache misses on all reads', status: 'warning' },
    { label: 'Database load increases 340%', status: 'warning' },
    { label: 'Query latency rises to 800ms+', status: 'warning' },
    { label: 'Connection pool exhaustion', status: 'failure' },
    { label: 'Potential cascading failure', status: 'failure' },
  ], outcome: 'Cascading database failure likely within 5 minutes. Recommend circuit breaker + cache warmup fallback.' },
  { id: 'f2', title: 'PostgreSQL primary goes down', target: 'PostgreSQL', cascade: [
    { label: 'Primary DB unreachable', status: 'failure' },
    { label: 'Write requests fail', status: 'failure' },
    { label: 'Reads failover to replica', status: 'warning' },
    { label: 'Promote replica to primary', status: 'info' },
    { label: 'Recovery time: 30-90s', status: 'info' },
  ], outcome: 'Failover to read replica with 30-90s downtime. Data loss limited to last WAL sync window.' },
  { id: 'f3', title: 'Kafka broker failure', target: 'Kafka', cascade: [
    { label: '1 of 6 brokers goes down', status: 'warning' },
    { label: 'Partition leadership transfers', status: 'info' },
    { label: 'Brief consumer rebalance', status: 'warning' },
    { label: 'No data loss (replication factor 3)', status: 'info' },
  ], outcome: 'Self-healing within seconds. No data loss. Minor latency spike during rebalance.' },
];

export const KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  { id: 'k1', title: 'Consistent Hashing Explained', category: 'Distributed Systems', summary: 'How consistent hashing distributes keys across nodes with minimal redistribution on topology changes.', readTime: '12 min' },
  { id: 'k2', title: 'Database Partitioning Strategies', category: 'Databases', summary: 'Range, hash, and directory-based sharding. When to partition and trade-offs of each approach.', readTime: '18 min' },
  { id: 'k3', title: 'Write-Through vs Write-Behind Caching', category: 'Caching', summary: 'Cache write strategies and their impact on consistency, latency, and throughput.', readTime: '8 min' },
  { id: 'k4', title: 'Kafka vs RabbitMQ: When to Choose', category: 'Messaging', summary: 'Comparison of streaming vs queueing semantics, durability guarantees, and scaling models.', readTime: '15 min' },
  { id: 'k5', title: 'Anycast vs Unicast Routing', category: 'Networking', summary: 'How anycast routing improves latency and availability for globally distributed services.', readTime: '10 min' },
  { id: 'k6', title: 'Horizontal vs Vertical Scaling', category: 'Scalability', summary: 'Scale-up vs scale-out decision framework including cost, complexity, and ceiling analysis.', readTime: '7 min' },
  { id: 'k7', title: 'CAP Theorem in Practice', category: 'Consistency', summary: 'Understanding consistency-availability trade-offs and what "eventually consistent" really means.', readTime: '14 min' },
  { id: 'k8', title: 'OAuth 2.0 and JWT Best Practices', category: 'Security', summary: 'Token-based auth flows, refresh tokens, and common security pitfalls in distributed auth.', readTime: '20 min' },
  { id: 'k9', title: 'Distributed Tracing with OpenTelemetry', category: 'Observability', summary: 'Cross-service request tracing, span propagation, and latency analysis in microservices.', readTime: '16 min' },
  { id: 'k10', title: 'Multi-Region Deployment Patterns', category: 'Cloud Infrastructure', summary: 'Active-active vs active-passive, data residency, and global traffic routing.', readTime: '22 min' },
  { id: 'k11', title: 'Redis Cluster Architecture', category: 'Caching', summary: 'Sharding, replication, and failover in Redis Cluster mode with slot-based routing.', readTime: '11 min' },
  { id: 'k12', title: 'Connection Pooling Deep Dive', category: 'Databases', summary: 'PgBouncer, Pgcat, and application-level pooling strategies for high-throughput databases.', readTime: '9 min' },
];

export const KNOWLEDGE_CATEGORIES = [
  'Distributed Systems', 'Databases', 'Caching', 'Messaging', 'Networking',
  'Scalability', 'Consistency', 'Security', 'Observability', 'Cloud Infrastructure',
];

export const INTERVIEW_QUESTIONS = [
  'Design a URL shortening service for 500 million users.',
  'Design a real-time chat system with delivery guarantees.',
  'Design a video streaming platform for 200M subscribers.',
  'Design a rate limiter for a high-traffic API.',
  'Design a distributed key-value store with eventual consistency.',
  'Design a notification system supporting 10M deliveries per minute.',
  'Design a ride-matching system for a global rideshare platform.',
];
