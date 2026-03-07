import { Question } from "../../types"

export const dbmsQuestions: Question[] = [
    { id: 'db_1', title: 'DBMS vs RDBMS vs NoSQL', difficulty: 'Concept', link: 'https://www.geeksforgeeks.org/difference-between-dbms-and-rdbms/' },
    { id: 'db_2', title: 'What is ACID in Transactions?', difficulty: 'Easy', link: 'https://en.wikipedia.org/wiki/ACID' },
    { id: 'db_3', title: 'Primary Key vs Unique Key vs Foreign Key', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/difference-between-primary-key-and-unique-key/' },
    { id: 'db_4', title: 'Super Key, Candidate Key, Composite Key', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/keys-in-relational-model-candidate-super-primary-alternate-and-foreign/' },
    { id: 'db_5', title: 'ER Model and ER Diagrams', difficulty: 'Concept', link: 'https://www.geeksforgeeks.org/er-model-in-dbms/' },

    { id: 'db_6', title: 'Normalization: 1NF, 2NF, 3NF, BCNF', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/database-normalization-normal-forms/' },
    { id: 'db_7', title: 'Denormalization and when to use it', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/denormalization-in-databases/' },
    { id: 'db_8', title: 'What is SQL Injection & How to prevent it?', difficulty: 'Medium', link: 'https://owasp.org/www-community/attacks/SQL_Injection' },
    { id: 'db_9', title: 'Difference between WHERE and HAVING', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/difference-between-where-and-having-clause-in-sql/' },
    { id: 'db_10', title: 'Clustered vs Non-clustered Index', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/difference-between-clustered-and-non-clustered-index/' },

    { id: 'db_11', title: 'What is an Index? B-Tree vs Hash Index', difficulty: 'Medium', link: 'https://use-the-index-luke.com/' },
    { id: 'db_12', title: 'Joins: INNER vs LEFT vs RIGHT vs FULL', difficulty: 'Easy', link: 'https://www.sqlshack.com/sql-join-inner-left-right-and-full-joins/' },
    { id: 'db_13', title: 'Self Join vs Cross Join', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/sql-joins/' },
    { id: 'db_14', title: 'Views vs Materialized Views', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/difference-between-view-and-materialized-view/' },
    { id: 'db_15', title: 'Stored Procedures vs Functions', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/difference-between-stored-procedure-and-function/' },

    { id: 'db_16', title: 'Triggers and Use Cases', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/triggers-in-sql/' },
    { id: 'db_17', title: 'Transactions & Commit/Rollback/Savepoint', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/transaction-control-commands-in-sql/' },
    { id: 'db_18', title: 'Explain Isolation Levels (Read Uncommitted → Serializable)', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/transaction-isolation-levels-dbms/' },
    { id: 'db_19', title: 'Deadlock Detection, Prevention, Recovery', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/deadlock-in-dbms/' },
    { id: 'db_20', title: 'Timestamp Ordering vs Two Phase Locking', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/locking-and-transaction/' },

    { id: 'db_21', title: 'What is Query Optimization?', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/query-processing-and-optimization/' },
    { id: 'db_22', title: 'Use of EXPLAIN Query Plan', difficulty: 'Medium', link: 'https://www.sqlshack.com/the-sql-explain-statement/' },
    { id: 'db_23', title: 'Cost-based vs Rule-based Optimizer', difficulty: 'Medium', link: 'https://use-the-index-luke.com/sql/optimizer-details' },
    { id: 'db_24', title: 'Hash Join vs Merge Join vs Nested Loop Join', difficulty: 'Hard', link: 'https://docs.oracle.com/cd/E11882_01/server.112/e25789/optimops.htm' },
    { id: 'db_25', title: 'Index Scan vs Index Seek vs Table Scan', difficulty: 'Medium', link: 'https://use-the-index-luke.com/sql/where-clause/the-equal-operator-index' },

    { id: 'db_26', title: 'Relational Algebra Operations (σ, π, ×, ∪, −)', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/introduction-to-relational-algebra/' },
    { id: 'db_27', title: 'Functional Dependencies in DBMS', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/functional-dependency-and-attribute-closure/' },
    { id: 'db_28', title: 'Lossless Join & Dependency Preservation', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/lossless-join-decomposition/' },
    { id: 'db_29', title: 'BCNF vs 3NF with examples', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/boyce-codd-normal-form-bcnf/' },
    { id: 'db_30', title: 'What is Surrogate Key vs Natural Key?', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/surrogate-key-in-dbms/' },

    { id: 'db_31', title: 'OLAP vs OLTP', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/difference-between-olap-and-oltp/' },
    { id: 'db_32', title: 'Star Schema vs Snowflake Schema', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/star-schema-vs-snowflake-schema/' },
    { id: 'db_33', title: 'What is Data Warehousing?', difficulty: 'Concept', link: 'https://www.geeksforgeeks.org/introduction-of-data-warehouse/' },
    { id: 'db_34', title: 'ETL vs ELT Data Pipelines', difficulty: 'Medium', link: 'https://awslabs.github.io/aws-orbit-workbench/etl-vs-elt/' },
    { id: 'db_35', title: 'Fact vs Dimension Tables', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/difference-between-dimension-and-fact-table/' },

    { id: 'db_36', title: 'CAP Theorem in Distributed Databases', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/cap-theorem-in-distributed-systems/' },
    { id: 'db_37', title: 'Sharding & Partitioning Strategies', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/data-sharding-in-dbms/' },
    { id: 'db_38', title: 'Replication vs Mirroring', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/database-replication/' },
    { id: 'db_39', title: 'Eventual Consistency vs Strong Consistency', difficulty: 'Medium', link: 'https://aws.amazon.com/builders-library/avoiding-fallbacks-in-distributed-systems/' },
    { id: 'db_40', title: 'What is Write-Ahead Logging (WAL)?', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/write-ahead-logging-wal-protocol-in-dbms/' },

    { id: 'db_41', title: 'Two Phase Commit (2PC) & Three Phase Commit (3PC)', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/two-phase-commit-protocol/' },
    { id: 'db_42', title: 'Consistent Snapshot Reads (MVCC)', difficulty: 'Hard', link: 'https://www.postgresql.org/docs/current/mvcc.html' },
    { id: 'db_43', title: 'Redo Log, Undo Log in Recovery', difficulty: 'Medium', link: 'https://www.javatpoint.com/database-recovery' },
    { id: 'db_44', title: 'Checkpointing & Recovery Methods', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/checkpoints-in-dbms/' },
    { id: 'db_45', title: 'Shadow Paging vs Logging', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/shadow-paging-vs-log-based-recovery/' },

    { id: 'db_46', title: 'Hashing Techniques: Extendible vs Linear Hashing', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/extendible-hashing-dynamic-hashing-technique/' },
    { id: 'db_47', title: 'Bitmap Index vs B-Tree Index', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/bitmap-indexing-in-data-warehousing/' },
    { id: 'db_48', title: 'Explain Inverted Index (Search Engines)', difficulty: 'Medium', link: 'https://www.elastic.co/guide/en/elasticsearch/guide/current/inverted-index.html' },
    { id: 'db_49', title: 'PostgreSQL vs MySQL vs MongoDB', difficulty: 'Medium', link: 'https://www.mongodb.com/compare/mongodb-postgresql' },
    { id: 'db_50', title: 'Redis vs MongoDB vs Cassandra', difficulty: 'Medium', link: 'https://aws.amazon.com/nosql/key-value/' },

    { id: 'db_51', title: 'Key-Value DB vs Column Store vs Document Store', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/types-of-nosql-databases/' },
    { id: 'db_52', title: 'MongoDB Aggregation Pipeline Basics', difficulty: 'Medium', link: 'https://www.mongodb.com/docs/manual/aggregation/' },
    { id: 'db_53', title: 'Cassandra Consistency Levels', difficulty: 'Hard', link: 'https://cassandra.apache.org/_/glossary.html#consistency-level' },
    { id: 'db_54', title: 'HBase vs Cassandra', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/difference-between-hbase-and-cassandra/' },
    { id: 'db_55', title: 'Graph Databases (Neo4j) Basics', difficulty: 'Medium', link: 'https://neo4j.com/developer/graph-database/' },

    { id: 'db_56', title: 'SQL Window Functions', difficulty: 'Hard', link: 'https://www.sqltutorial.org/sql-window-functions/' },
    { id: 'db_57', title: 'CTE vs Subqueries', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/sql-cte-vs-subquery/' },
    { id: 'db_58', title: 'GROUP BY vs PARTITION BY', difficulty: 'Medium', link: 'https://www.sqlservertutorial.net/sql-server-window-functions/sql-server-partition-by-clause/' },
    { id: 'db_59', title: 'UPSERT (MERGE / INSERT ON CONFLICT)', difficulty: 'Easy', link: 'https://www.postgresql.org/docs/current/sql-insert.html' },
    { id: 'db_60', title: 'CASE WHEN in SQL & Practical Uses', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/sql-case-statement/' },

    { id: 'db_61', title: 'Index Selectivity + Cardinality', difficulty: 'Hard', link: 'https://use-the-index-luke.com/sql/where-clause/cardinality' },
    { id: 'db_62', title: 'Parameter Sniffing Issue in SQL', difficulty: 'Hard', link: 'https://www.brentozar.com/archive/2018/01/what-is-parameter-sniffing/' },
    { id: 'db_63', title: 'Covering Index & Composite Index', difficulty: 'Medium', link: 'https://use-the-index-luke.com/sql/where-clause/multiple-columns' },
    { id: 'db_64', title: 'Index-only Scan Optimization', difficulty: 'Medium', link: 'https://www.postgresql.org/docs/current/indexes-index-only-scans.html' },
    { id: 'db_65', title: 'Cardinality Estimation Errors', difficulty: 'Hard', link: 'https://use-the-index-luke.com/sql/optimize/what-cardinality-estimates' },

    { id: 'db_66', title: 'Temp Tables vs CTE vs Views', difficulty: 'Medium', link: 'https://www.sqlservertutorial.net/sql-server-basics/sql-server-temporary-tables/' },
    { id: 'db_67', title: 'Pagination using OFFSET & LIMIT', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/sql-limit-clause/' },
    { id: 'db_68', title: 'SQL Pivot & Unpivot', difficulty: 'Medium', link: 'https://learn.microsoft.com/en-us/sql/t-sql/queries/from-using-pivot-and-unpivot' },
    { id: 'db_69', title: 'JSON Columns & Querying JSON in SQL', difficulty: 'Medium', link: 'https://www.postgresql.org/docs/current/functions-json.html' },
    { id: 'db_70', title: 'Explain FULL TEXT SEARCH', difficulty: 'Medium', link: 'https://www.postgresql.org/docs/current/textsearch-intro.html' },

    { id: 'db_71', title: 'ACID vs BASE in Distributed DBs', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/acids-in-dbms/' },
    { id: 'db_72', title: 'Write Skew, Dirty Read, Phantom Read', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/dirty-read-non-repeatable-read-and-phantom-read/' },
    { id: 'db_73', title: 'Optimistic vs Pessimistic Concurrency Control', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/concurrency-control-in-dbms/' },
    { id: 'db_74', title: 'Read Repair + Hinted Handoff (Cassandra)', difficulty: 'Hard', link: 'https://www.datastax.com/docs' },
    { id: 'db_75', title: 'Vector Databases (Pinecone/Chroma/Milvus)', difficulty: 'Medium', link: 'https://www.pinecone.io/learn/vector-databases/' },

    { id: 'db_76', title: 'Replication Types (Master-Slave, Multi-Master)', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/replication-in-dbms/' },
    { id: 'db_77', title: 'Leader Election (Raft, Paxos)', difficulty: 'Hard', link: 'https://raft.github.io/' },
    { id: 'db_78', title: 'Event Sourcing & CQRS Pattern', difficulty: 'Hard', link: 'https://martinfowler.com/bliki/CQRS.html' },
    { id: 'db_79', title: 'Time-series Databases (InfluxDB)', difficulty: 'Medium', link: 'https://www.influxdata.com/' },
    { id: 'db_80', title: 'Document vs Key-Value vs Columnar DB', difficulty: 'Easy', link: 'https://aws.amazon.com/nosql/' },

    { id: 'db_81', title: 'Database Vaulting, Backup & Restore', difficulty: 'Medium', link: 'https://www.javatpoint.com/database-backup-and-recovery' },
    { id: 'db_82', title: 'Point-in-Time Recovery (PITR)', difficulty: 'Medium', link: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html' },
    { id: 'db_83', title: 'Cold vs Hot vs Warm Backups', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/database-recovery/' },
    { id: 'db_84', title: 'Log-Structured Merge Trees (LSM)', difficulty: 'Hard', link: 'https://www.datastax.com/blog/what-is-lsm-tree' },
    { id: 'db_85', title: 'Bloom Filters in Databases', difficulty: 'Medium', link: 'https://en.wikipedia.org/wiki/Bloom_filter' },

    { id: 'db_86', title: 'Parallel Query Execution', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/query-processing-and-optimization/' },
    { id: 'db_87', title: 'Materialized View Refresh Strategy', difficulty: 'Medium', link: 'https://docs.oracle.com/database/121/DWHSG/schemas.htm' },
    { id: 'db_88', title: 'Triggers vs Constraints', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/difference-between-trigger-and-constraint/' },
    { id: 'db_89', title: 'Foreign Key Cascading Rules', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/foreign-key-in-sql/' },
    { id: 'db_90', title: 'GSI vs LSI in DynamoDB', difficulty: 'Medium', link: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html' },

    { id: 'db_91', title: 'Zookeeper role in Distributed DBs', difficulty: 'Hard', link: 'https://zookeeper.apache.org/doc/r3.4.13/zookeeperOverview.html' },
    { id: 'db_92', title: 'Partitioning Strategies (Range/Hash/List)', difficulty: 'Medium', link: 'https://www.postgresql.org/docs/current/ddl-partitioning.html' },
    { id: 'db_93', title: 'Hot vs Cold vs Warm Data Tiering', difficulty: 'Medium', link: 'https://www.ibm.com/cloud/learn/data-tiering' },
    { id: 'db_94', title: 'Columnar Storage (Parquet/ORC/Arrow)', difficulty: 'Medium', link: 'https://parquet.apache.org/' },
    { id: 'db_95', title: 'Query Federation & Polyglot Persistence', difficulty: 'Hard', link: 'https://martinfowler.com/bliki/PolyglotPersistence.html' },

    { id: 'db_96', title: 'What is Write Skew & Lost Update Problem?', difficulty: 'Hard', link: 'https://jepsen.io/consistency' },
    { id: 'db_97', title: 'Cache Aside vs Write Through vs Write Behind', difficulty: 'Medium', link: 'https://aws.amazon.com/caching/' },
    { id: 'db_98', title: 'Caching Layers (Redis/Memcached)', difficulty: 'Medium', link: 'https://redis.io/docs/' },
    { id: 'db_99', title: 'Hot Partition Problem & Avoiding It', difficulty: 'Hard', link: 'https://aws.amazon.com/premiumsupport/knowledge-center/dynamodb-hot-partitions/' },
    { id: 'db_100', title: 'Design a scalable distributed database', difficulty: 'Hard', link: 'https://aws.amazon.com/builders-library/' },
]

// --- DBMS SUB-TRACKS FOR INTERVIEW PREP ---
// Rough split by id ranges to keep code simple & non-repetitive.

export const dbmsFundamentals: Question[] = dbmsQuestions.filter(q => {
    const n = Number(q.id.split('_')[1]);
    return n >= 1 && n <= 35;  // Core SQL, keys, normalization, warehousing basics
});

export const dbmsAdvanced: Question[] = dbmsQuestions.filter(q => {
    const n = Number(q.id.split('_')[1]);
    return n >= 36 && n <= 70; // Indexing, optimization, NoSQL, advanced SQL features
});

export const dbmsSystemAndArchitecture: Question[] = dbmsQuestions.filter(q => {
    const n = Number(q.id.split('_')[1]);
    return n >= 71 && n <= 100; // Distributed DBs, consistency, caching, scalability, backups
});