import { Question } from "../../types"

export const sysQuestions: Question[] = [
    { id: 'sys_1', title: 'Explain CAP Theorem', difficulty: 'Concept', link: 'https://en.wikipedia.org/wiki/CAP_theorem' },
    { id: 'sys_2', title: 'Load Balancers (L4 vs L7)', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/system-design/layer-4-load-balancing-vs-layer-7-load-balancing/' },
    { id: 'sys_3', title: 'Design a URL Shortener (TinyURL)', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/system-design/system-design-url-shortening-service/' },
    { id: 'sys_4', title: 'SQL vs NoSQL: When to choose which?', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/difference-between-sql-and-nosql/' },
    { id: 'sys_5', title: 'Database Sharding and Consistent Hashing', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/system-design-sharding/' },
    { id: 'sys_6', title: 'CDN and Caching Strategies', difficulty: 'Medium', link: 'https://www.imperva.com/learn/performance/cdn-caching/' },

    { id: 'sys_7', title: 'Horizontal vs Vertical Scaling', difficulty: 'Concept', link: 'https://aws.amazon.com/blogs/database/horizontally-scaling-database-workloads/' },
    { id: 'sys_8', title: 'Design a Rate Limiter', difficulty: 'Medium', link: 'https://leetcode.com/discuss/interview-question/355932/Design-a-rate-limiter' },
    { id: 'sys_9', title: 'Caching: Write-through vs Write-back vs Write-around', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/cache-write-strategies-write-through-write-around-write-back/' },
    { id: 'sys_10', title: 'Explain Message Queues (Kafka/RabbitMQ)', difficulty: 'Concept', link: 'https://kafka.apache.org/intro' },

    { id: 'sys_11', title: 'Design a News Feed System (Facebook/Twitter)', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/design-news-feed-system/' },
    { id: 'sys_12', title: 'Design an Instagram-like System', difficulty: 'Hard', link: 'https://www.educative.io/answers/how-to-design-instagram' },
    { id: 'sys_13', title: 'Design WhatsApp/Chat Application', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/design-a-messaging-system-like-facebook-messenger/' },
    { id: 'sys_14', title: 'Design an E-commerce System', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/system-design-of-e-commerce-website/' },
    { id: 'sys_15', title: 'Design a File Storage System (Google Drive/Dropbox)', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/design-cloud-storage-system-like-google-drive/' },

    { id: 'sys_16', title: 'Explain ACID vs BASE properties', difficulty: 'Concept', link: 'https://www.geeksforgeeks.org/difference-between-acid-and-base-properties-of-database/' },
    { id: 'sys_17', title: 'Leader Election in Distributed Systems', difficulty: 'Hard', link: 'https://raft.github.io/' },
    { id: 'sys_18', title: 'Explain Consensus Algorithms (Raft/Paxos)', difficulty: 'Hard', link: 'https://raft.github.io/raft.pdf' },
    { id: 'sys_19', title: 'Design a Distributed Cache (like Redis Cluster)', difficulty: 'Hard', link: 'https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/' },
    { id: 'sys_20', title: 'Explain Replication (Master-Slave, Master-Master)', difficulty: 'Medium', link: 'https://mariadb.com/kb/en/replication-overview/' },

    { id: 'sys_21', title: 'Explain Event-Driven Architecture', difficulty: 'Concept', link: 'https://martinfowler.com/articles/201701-event-driven.html' },
    { id: 'sys_22', title: 'Design a Logging & Metrics System', difficulty: 'Medium', link: 'https://www.datadoghq.com/knowledge-center/what-is-logging/' },
    { id: 'sys_23', title: 'Design a Notification System (Email/SMS/Push)', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/design-a-notification-system/' },
    { id: 'sys_24', title: 'Explain API Gateway and its responsibilities', difficulty: 'Medium', link: 'https://microservices.io/patterns/apigateway.html' },
    { id: 'sys_25', title: 'Explain gRPC vs REST', difficulty: 'Medium', link: 'https://grpc.io/docs/what-is-grpc/introduction/' },

    { id: 'sys_26', title: 'Design a URL Crawler (Web Crawler)', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/design-a-web-crawler/' },
    { id: 'sys_27', title: 'Design a Search Autocomplete System', difficulty: 'Hard', link: 'https://leetcode.com/discuss/interview-question/system-design/125004/system-design-autocomplete-feature-of-search-engine' },
    { id: 'sys_28', title: 'Explain Bloom Filters and where to use them', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/bloom-filters-introduction-and-python-implementation/' },
    { id: 'sys_29', title: 'Explain APIs: REST, GraphQL, WebSockets', difficulty: 'Concept', link: 'https://graphql.org/learn/' },
    { id: 'sys_30', title: 'Explain Heartbeats and Health Checks', difficulty: 'Easy', link: 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/' },

    { id: 'sys_31', title: 'Explain Strong vs Eventual Consistency', difficulty: 'Concept', link: 'https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/data-store-overview#consistency' },
    { id: 'sys_32', title: 'Read Replicas and Read-Heavy Workloads', difficulty: 'Medium', link: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html' },
    { id: 'sys_33', title: 'Design a Leaderboard / Ranking System', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/design-leaderboard/' },
    { id: 'sys_34', title: 'Design a Commenting System', difficulty: 'Medium', link: 'https://www.educative.io/answers/how-to-design-a-commenting-system' },
    { id: 'sys_35', title: 'Explain Idempotency in APIs', difficulty: 'Medium', link: 'https://restfulapi.net/idempotent-rest-apis/' },

    { id: 'sys_36', title: 'Explain Back-of-the-envelope Capacity Estimation', difficulty: 'Medium', link: 'https://www.educative.io/blog/system-design-interview-capacity-estimation' },
    { id: 'sys_37', title: 'Explain Partitioning: Range vs Hash vs List', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/partitioning-in-databases/' },
    { id: 'sys_38', title: 'Design an Online Judge / Coding Platform', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/design-online-judge/' },
    { id: 'sys_39', title: 'Explain Retry, Timeout, and Circuit Breaker patterns', difficulty: 'Medium', link: 'https://martinfowler.com/bliki/CircuitBreaker.html' },
    { id: 'sys_40', title: 'Explain API Versioning Strategies', difficulty: 'Medium', link: 'https://martinfowler.com/articles/consumerDrivenContracts.html#versioning' },

    { id: 'sys_41', title: 'Design a Video Streaming System (YouTube/Netflix)', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/design-video-sharing-system-like-youtube/' },
    { id: 'sys_42', title: 'Explain CDN vs Reverse Proxy', difficulty: 'Medium', link: 'https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/' },
    { id: 'sys_43', title: 'Explain WebSockets and Real-time Messaging', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API' },
    { id: 'sys_44', title: 'Design a Real-time Chat System (Slack/Discord)', difficulty: 'Hard', link: 'https://sysdesign.dev/chat-system-design' },
    { id: 'sys_45', title: 'Explain OAuth2, OpenID Connect in system design', difficulty: 'Hard', link: 'https://oauth.net/2/' },

    { id: 'sys_46', title: 'Explain Distributed Locks (Redis/ZooKeeper)', difficulty: 'Hard', link: 'https://redis.io/docs/latest/develop/use/patterns/distributed-locks/' },
    { id: 'sys_47', title: 'Explain Dead Letter Queues', difficulty: 'Medium', link: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html' },
    { id: 'sys_48', title: 'Explain Exactly-once vs At-least-once Delivery', difficulty: 'Hard', link: 'https://kafka.apache.org/documentation/#semantics' },
    { id: 'sys_49', title: 'Design a Metrics & Monitoring System (Prometheus-like)', difficulty: 'Hard', link: 'https://prometheus.io/docs/introduction/overview/' },
    { id: 'sys_50', title: 'Explain Blue-Green and Canary Deployments', difficulty: 'Medium', link: 'https://martinfowler.com/bliki/BlueGreenDeployment.html' },

    { id: 'sys_51', title: 'Design a Job Scheduler / Cron Service', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/design-a-task-scheduler/' },
    { id: 'sys_52', title: 'Explain Microservices vs Monolith', difficulty: 'Concept', link: 'https://martinfowler.com/articles/microservices.html' },
    { id: 'sys_53', title: 'Service Discovery in Microservices', difficulty: 'Medium', link: 'https://microservices.io/patterns/service-registry.html' },
    { id: 'sys_54', title: 'Circuit Breaker and Bulkhead Patterns', difficulty: 'Hard', link: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker' },
    { id: 'sys_55', title: 'Explain API Rate Limiting (Token Bucket/Leaky Bucket)', difficulty: 'Medium', link: 'https://cloud.google.com/architecture/rate-limiting-strategies-techniques' },

    { id: 'sys_56', title: 'Design a Configuration Management Service', difficulty: 'Medium', link: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/external-configuration-store' },
    { id: 'sys_57', title: 'Explain Data Lake vs Data Warehouse', difficulty: 'Concept', link: 'https://aws.amazon.com/big-data/datalakes-and-analytics/what-is-a-data-lake/' },
    { id: 'sys_58', title: 'Explain Batch vs Stream Processing', difficulty: 'Concept', link: 'https://kafka.apache.org/documentation/streams' },
    { id: 'sys_59', title: 'Design a Real-time Analytics System', difficulty: 'Hard', link: 'https://aws.amazon.com/real-time-analytics/' },
    { id: 'sys_60', title: 'Explain Backpressure in Streaming Systems', difficulty: 'Hard', link: 'https://projectreactor.io/docs/core/release/reference/#reactor.hotBackpressure' },

    { id: 'sys_61', title: 'Design a URL Shortener with Analytics', difficulty: 'Hard', link: 'https://www.hellointerview.com/learn/system-design/problem-breakdowns/bitly' },
    { id: 'sys_62', title: 'Explain Data Replication: Sync vs Async', difficulty: 'Medium', link: 'https://aws.amazon.com/blogs/database/asynchronous-vs-synchronous-replication/' },
    { id: 'sys_63', title: 'Explain Two-phase Commit (2PC)', difficulty: 'Hard', link: 'https://en.wikipedia.org/wiki/Two-phase_commit_protocol' },
    { id: 'sys_64', title: 'Explain SAGA Pattern for Distributed Transactions', difficulty: 'Hard', link: 'https://microservices.io/patterns/data/saga.html' },
    { id: 'sys_65', title: 'Design a Distributed Lock Service', difficulty: 'Hard', link: 'https://zookeeper.apache.org/doc/r3.1.2/recipes.html#sc_recipes_Locks' },

    { id: 'sys_66', title: 'Design a Pastebin-like Service', difficulty: 'Medium', link: 'https://www.educative.io/answers/how-to-design-a-pastebin-service' },
    { id: 'sys_67', title: 'Explain Hot Key Problem in Caching', difficulty: 'Medium', link: 'https://blog.cloudflare.com/avoiding-origin-overload-with-hot-key-protection/' },
    { id: 'sys_68', title: 'Explain Distributed Tracing (Jaeger/Zipkin)', difficulty: 'Medium', link: 'https://www.jaegertracing.io/docs/latest/architecture/' },
    { id: 'sys_69', title: 'Design a Real-time Location Tracking System', difficulty: 'Hard', link: 'https://www.educative.io/answers/how-to-design-a-real-time-location-system' },
    { id: 'sys_70', title: 'Explain SLA, SLO, SLI in Reliability', difficulty: 'Concept', link: 'https://sre.google/sre-book/service-level-objectives/' },

    { id: 'sys_71', title: 'Explain Distributed Hash Table (DHT)', difficulty: 'Hard', link: 'https://en.wikipedia.org/wiki/Distributed_hash_table' },
    { id: 'sys_72', title: 'Design a Key-Value Store (like Redis)', difficulty: 'Hard', link: 'https://www.educative.io/answers/how-to-design-a-key-value-store' },
    { id: 'sys_73', title: 'Explain Gossip Protocol', difficulty: 'Hard', link: 'https://en.wikipedia.org/wiki/Gossip_protocol' },
    { id: 'sys_74', title: 'Explain Quorum Reads/Writes', difficulty: 'Hard', link: 'https://docs.datastax.com/en/cassandra-oss/3.x/cassandra/dml/dmlConfigConsistency.html' },
    { id: 'sys_75', title: 'Explain Time Series Databases Design', difficulty: 'Medium', link: 'https://www.influxdata.com/time-series-database/' },

    { id: 'sys_76', title: 'Design a Feature Flag Service', difficulty: 'Medium', link: 'https://martinfowler.com/articles/feature-toggles.html' },
    { id: 'sys_77', title: 'Explain Multi-tenancy in SaaS', difficulty: 'Medium', link: 'https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/what-is-multitenancy' },
    { id: 'sys_78', title: 'Design a Multi-tenant SaaS Application', difficulty: 'Hard', link: 'https://aws.amazon.com/blogs/apn/building-multi-tenant-saas-applications-on-aws/' },
    { id: 'sys_79', title: 'Explain Security in System Design (TLS, Hashing, Encryption)', difficulty: 'Hard', link: 'https://owasp.org/www-project-top-ten/' },
    { id: 'sys_80', title: 'Explain CSRF/XSS Mitigations at System Level', difficulty: 'Hard', link: 'https://owasp.org/www-community/attacks/' },

    { id: 'sys_81', title: 'Explain Distributed File Systems (HDFS, GFS)', difficulty: 'Hard', link: 'https://storage.googleapis.com/gweb-research2023-media/pubtools/pdf/36627.pdf' },
    { id: 'sys_82', title: 'Design an Analytics Event Ingestion Pipeline', difficulty: 'Hard', link: 'https://kafka.apache.org/documentation/' },
    { id: 'sys_83', title: 'Explain Schema Registry and Backward Compatibility', difficulty: 'Hard', link: 'https://docs.confluent.io/platform/current/schema-registry/index.html' },
    { id: 'sys_84', title: 'Explain Data Partitioning vs Replication Trade-offs', difficulty: 'Medium', link: 'https://learn.microsoft.com/en-us/azure/architecture/best-practices/data-partitioning' },
    { id: 'sys_85', title: 'Explain Event Sourcing vs CRUD', difficulty: 'Hard', link: 'https://martinfowler.com/eaaDev/EventSourcing.html' },

    { id: 'sys_86', title: 'Design a System for Distributed Locks using Redis', difficulty: 'Hard', link: 'https://redis.io/docs/latest/develop/use/patterns/distributed-locks/' },
    { id: 'sys_87', title: 'Explain Shadow Traffic and Dark Launching', difficulty: 'Hard', link: 'https://martinfowler.com/bliki/ParallelChange.html' },
    { id: 'sys_88', title: 'Explain Canary Releases & Feature Toggles combo', difficulty: 'Medium', link: 'https://martinfowler.com/articles/feature-toggles.html#ReleaseToggles' },
    { id: 'sys_89', title: 'Explain Data Migration Strategies (Online/Offline)', difficulty: 'Medium', link: 'https://martinfowler.com/bliki/StranglerFigApplication.html' },
    { id: 'sys_90', title: 'Explain Distributed Rate Limiting (across multiple servers)', difficulty: 'Hard', link: 'https://konghq.com/learning-center/api-gateway/rate-limiting' },

    { id: 'sys_91', title: 'Design a Content Recommendation System', difficulty: 'Hard', link: 'https://netflixtechblog.com/netflix-recommendations-beyond-the-5-stars-part-1-55838468f429' },
    { id: 'sys_92', title: 'Explain Write Amplification and Read Amplification', difficulty: 'Hard', link: 'https://en.wikipedia.org/wiki/Write_amplification' },
    { id: 'sys_93', title: 'Explain Data Locality and Its Importance', difficulty: 'Medium', link: 'https://en.wikipedia.org/wiki/Data_locality' },
    { id: 'sys_94', title: 'Explain Cold, Warm, and Hot Storage', difficulty: 'Concept', link: 'https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-storage-tiers' },
    { id: 'sys_95', title: 'Explain Vertical Partitioning (Microservices from Monolith)', difficulty: 'Hard', link: 'https://martinfowler.com/articles/break-monolith-into-microservices.html' },

    { id: 'sys_96', title: 'Design a Real-time Collaboration System (Google Docs)', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/design-google-docs-or-online-document-editor/' },
    { id: 'sys_97', title: 'Explain Operational Transformation vs CRDTs', difficulty: 'Hard', link: 'https://mattweidner.com/2019/07/10/ot-crdts.html' },
    { id: 'sys_98', title: 'Explain Data Backups and Disaster Recovery (RPO/RTO)', difficulty: 'Medium', link: 'https://aws.amazon.com/backup/recovery-point-objective-rpo/' },
    { id: 'sys_99', title: 'Explain Observability: Logs, Metrics, Traces', difficulty: 'Concept', link: 'https://opentelemetry.io/docs/what-is-opentelemetry/' },
    { id: 'sys_100', title: 'How to approach any System Design Interview', difficulty: 'Concept', link: 'https://bytebytego.com/courses/system-design-interview' },
]

// ========================= 1) SYSTEM DESIGN FUNDAMENTALS =========================
// Easy + Concept — scaling basics, consistency, microservices vs monolith, SLAs, etc.
export const sysFundamentals: Question[] = sysQuestions.filter(q =>
  ['Easy', 'Concept'].includes(q.difficulty)
);

// ========================= 2) SYSTEM DESIGN ADVANCED (PATTERNS & COMPONENTS) =========================
// Mostly Medium — caching, queues, APIs, patterns, infra concepts.
export const sysAdvanced: Question[] = sysQuestions.filter(q =>
  q.difficulty === 'Medium'
);

// ========================= 3) SYSTEM DESIGN DEEP DIVE / END-TO-END DESIGNS =========================
// Hard — full designs, distributed systems, consensus, locks, streaming, etc.
export const sysDeepDiveAndArchitecture: Question[] = sysQuestions.filter(q =>
  q.difficulty === 'Hard'
);