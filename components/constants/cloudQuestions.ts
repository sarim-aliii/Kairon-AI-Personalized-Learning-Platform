// src/components/constants/cloudQuestions.ts
import { Question } from "../../types"

export const cloudQuestions: Question[] = [
    { id: 'cld_1', title: 'Docker vs Virtual Machines', difficulty: 'Easy', link: 'https://docs.docker.com/get-started/overview/' },
    { id: 'cld_2', title: 'Explain Kubernetes Architecture', difficulty: 'Hard', link: 'https://kubernetes.io/docs/concepts/overview/components/' },
    { id: 'cld_3', title: 'Blue-Green Deployment vs Canary Release', difficulty: 'Medium', link: 'https://martinfowler.com/bliki/BlueGreenDeployment.html' },
    { id: 'cld_4', title: 'What is Infrastructure as Code (IaC)?', difficulty: 'Concept', link: 'https://learn.microsoft.com/en-us/devops/deliver/what-is-infrastructure-as-code' },

    { id: 'cld_5', title: 'Docker Images vs Containers', difficulty: 'Easy', link: 'https://docs.docker.com/get-started/' },
    { id: 'cld_6', title: 'Writing a Dockerfile: Best Practices', difficulty: 'Medium', link: 'https://docs.docker.com/develop/develop-images/dockerfile_best-practices/' },
    { id: 'cld_7', title: 'Docker Compose and Multi-container Apps', difficulty: 'Easy', link: 'https://docs.docker.com/compose/' },
    { id: 'cld_8', title: 'Container Networking Basics', difficulty: 'Medium', link: 'https://docs.docker.com/network/' },
    { id: 'cld_9', title: 'Container Volumes and Persistent Storage', difficulty: 'Medium', link: 'https://docs.docker.com/storage/volumes/' },
    { id: 'cld_10', title: 'Docker Registry vs Docker Hub vs ECR/GCR', difficulty: 'Concept', link: 'https://docs.docker.com/registry/' },

    { id: 'cld_11', title: 'Kubernetes Pods, Deployments, and ReplicaSets', difficulty: 'Medium', link: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/' },
    { id: 'cld_12', title: 'Kubernetes Services: ClusterIP, NodePort, LoadBalancer', difficulty: 'Medium', link: 'https://kubernetes.io/docs/concepts/services-networking/service/' },
    { id: 'cld_13', title: 'ConfigMaps vs Secrets in Kubernetes', difficulty: 'Medium', link: 'https://kubernetes.io/docs/concepts/configuration/configmap/' },
    { id: 'cld_14', title: 'Kubernetes Ingress and Ingress Controllers', difficulty: 'Hard', link: 'https://kubernetes.io/docs/concepts/services-networking/ingress/' },
    { id: 'cld_15', title: 'Kubernetes Namespaces and Multi-tenancy', difficulty: 'Medium', link: 'https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/' },

    { id: 'cld_16', title: 'StatefulSets vs Deployments in Kubernetes', difficulty: 'Hard', link: 'https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/' },
    { id: 'cld_17', title: 'PersistentVolumes and PersistentVolumeClaims', difficulty: 'Hard', link: 'https://kubernetes.io/docs/concepts/storage/persistent-volumes/' },
    { id: 'cld_18', title: 'Horizontal Pod Autoscaler (HPA)', difficulty: 'Medium', link: 'https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/' },
    { id: 'cld_19', title: 'Cluster Autoscaler Concepts', difficulty: 'Hard', link: 'https://github.com/kubernetes/autoscaler' },
    { id: 'cld_20', title: 'Kubernetes Probes: Liveness, Readiness, Startup', difficulty: 'Medium', link: 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/' },

    { id: 'cld_21', title: 'Service Mesh Basics (Istio/Linkerd)', difficulty: 'Hard', link: 'https://istio.io/latest/about/service-mesh/' },
    { id: 'cld_22', title: 'Sidecar Pattern in Cloud-native Apps', difficulty: 'Medium', link: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/sidecar' },
    { id: 'cld_23', title: 'Twelve-Factor App Principles', difficulty: 'Concept', link: 'https://12factor.net/' },
    { id: 'cld_24', title: 'Circuit Breaker Pattern in Microservices', difficulty: 'Medium', link: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker' },
    { id: 'cld_25', title: 'API Gateway in Microservices', difficulty: 'Medium', link: 'https://microservices.io/patterns/apigateway.html' },

    { id: 'cld_26', title: 'AWS Global Infrastructure: Regions, AZs, Edge Locations', difficulty: 'Concept', link: 'https://aws.amazon.com/about-aws/global-infrastructure/' },
    { id: 'cld_27', title: 'AWS EC2 Basics (Instances, AMIs, Security Groups)', difficulty: 'Easy', link: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html' },
    { id: 'cld_28', title: 'AWS S3 Basics (Buckets, Objects, Versioning)', difficulty: 'Easy', link: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html' },
    { id: 'cld_29', title: 'AWS Lambda and Serverless Computing', difficulty: 'Medium', link: 'https://docs.aws.amazon.com/lambda/latest/dg/welcome.html' },
    { id: 'cld_30', title: 'AWS RDS vs DynamoDB', difficulty: 'Medium', link: 'https://aws.amazon.com/nosql/dynamodb-vs-rds/' },

    { id: 'cld_31', title: 'GCP Compute Engine, App Engine, Cloud Run', difficulty: 'Medium', link: 'https://cloud.google.com/products/compute' },
    { id: 'cld_32', title: 'Azure VM, App Service, AKS Overview', difficulty: 'Medium', link: 'https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/compute-decision-tree' },
    { id: 'cld_33', title: 'Cloud Storage Classes (S3/Blob/Cloud Storage tiers)', difficulty: 'Medium', link: 'https://aws.amazon.com/s3/storage-classes/' },
    { id: 'cld_34', title: 'VPC, Subnets, and Security Groups', difficulty: 'Medium', link: 'https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html' },
    { id: 'cld_35', title: 'Cloud Load Balancers (ALB, NLB, ELB)', difficulty: 'Medium', link: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html' },

    { id: 'cld_36', title: 'Terraform Basics: Providers, Resources, State', difficulty: 'Medium', link: 'https://developer.hashicorp.com/terraform/intro' },
    { id: 'cld_37', title: 'Terraform vs CloudFormation vs Pulumi', difficulty: 'Concept', link: 'https://developer.hashicorp.com/terraform/intro/vs/cloudformation' },
    { id: 'cld_38', title: 'Writing Terraform Modules', difficulty: 'Medium', link: 'https://developer.hashicorp.com/terraform/language/modules/develop' },
    { id: 'cld_39', title: 'Terraform State and Remote Backends', difficulty: 'Hard', link: 'https://developer.hashicorp.com/terraform/language/state' },
    { id: 'cld_40', title: 'Ansible Basics: Playbooks, Inventory, Roles', difficulty: 'Medium', link: 'https://docs.ansible.com/ansible/latest/getting_started/index.html' },

    { id: 'cld_41', title: 'CI/CD Basics (Continuous Integration/Delivery)', difficulty: 'Concept', link: 'https://martinfowler.com/articles/continuousIntegration.html' },
    { id: 'cld_42', title: 'GitHub Actions Basics for CI/CD', difficulty: 'Easy', link: 'https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions' },
    { id: 'cld_43', title: 'Jenkins Pipelines Overview', difficulty: 'Medium', link: 'https://www.jenkins.io/doc/book/pipeline/' },
    { id: 'cld_44', title: 'GitLab CI/CD Overview', difficulty: 'Medium', link: 'https://docs.gitlab.com/ee/ci/' },
    { id: 'cld_45', title: 'Artifact Repositories (JFrog, Nexus, GitHub Packages)', difficulty: 'Concept', link: 'https://jfrog.com/knowledge-base/what-is-an-artifact-repository/' },

    { id: 'cld_46', title: 'Monitoring vs Logging vs Tracing', difficulty: 'Concept', link: 'https://opentelemetry.io/docs/what-is-opentelemetry/' },
    { id: 'cld_47', title: 'Prometheus Basics: Metrics, Scraping, Alerts', difficulty: 'Medium', link: 'https://prometheus.io/docs/introduction/overview/' },
    { id: 'cld_48', title: 'Grafana Dashboards for Observability', difficulty: 'Easy', link: 'https://grafana.com/docs/grafana/latest/getting-started/introduction/' },
    { id: 'cld_49', title: 'Centralized Logging (ELK / OpenSearch)', difficulty: 'Medium', link: 'https://www.elastic.co/what-is/elk-stack' },
    { id: 'cld_50', title: 'Distributed Tracing with Jaeger/Zipkin', difficulty: 'Hard', link: 'https://www.jaegertracing.io/docs/latest/' },

    { id: 'cld_51', title: 'Cloud Security Basics (Shared Responsibility Model)', difficulty: 'Concept', link: 'https://aws.amazon.com/compliance/shared-responsibility-model/' },
    { id: 'cld_52', title: 'IAM: Users, Roles, Policies, Permissions', difficulty: 'Medium', link: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html' },
    { id: 'cld_53', title: 'Secrets Management (AWS Secrets Manager, Vault)', difficulty: 'Medium', link: 'https://developer.hashicorp.com/vault/docs/what-is-vault' },
    { id: 'cld_54', title: 'Encrypting Data at Rest and In Transit', difficulty: 'Medium', link: 'https://learn.microsoft.com/en-us/azure/security/fundamentals/encryption-overview' },
    { id: 'cld_55', title: 'Cloud Network Security (NACLs, Firewalls, WAF)', difficulty: 'Hard', link: 'https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html' },

    { id: 'cld_56', title: 'Cost Optimization: Rightsizing and Autoscaling', difficulty: 'Medium', link: 'https://aws.amazon.com/aws-cost-management/' },
    { id: 'cld_57', title: 'Reserved Instances vs Spot Instances vs On-demand', difficulty: 'Medium', link: 'https://aws.amazon.com/ec2/pricing/' },
    { id: 'cld_58', title: 'Multi-cloud vs Single Cloud Strategies', difficulty: 'Concept', link: 'https://cloud.google.com/learn/what-is-multicloud' },
    { id: 'cld_59', title: 'Cloud-native vs Lift-and-Shift Migration', difficulty: 'Concept', link: 'https://azure.microsoft.com/en-us/resources/cloud-migration-strategy/' },
    { id: 'cld_60', title: 'FinOps and Cloud Cost Governance Basics', difficulty: 'Hard', link: 'https://www.finops.org/introduction/what-is-finops/' },

    { id: 'cld_61', title: 'Service Level Objectives (SLOs) and SLIs in Cloud', difficulty: 'Concept', link: 'https://sre.google/sre-book/service-level-objectives/' },
    { id: 'cld_62', title: 'High Availability vs Fault Tolerance vs Disaster Recovery', difficulty: 'Medium', link: 'https://learn.microsoft.com/en-us/azure/architecture/framework/resiliency/overview' },
    { id: 'cld_63', title: 'RPO and RTO in DR Planning', difficulty: 'Medium', link: 'https://aws.amazon.com/backup/recovery-point-objective-rpo/' },
    { id: 'cld_64', title: 'Multi-Region and Multi-AZ Architectures', difficulty: 'Hard', link: 'https://docs.aws.amazon.com/whitepapers/latest/aws-fault-isolation-boundaries/multi-region-deployments.html' },
    { id: 'cld_65', title: 'Chaos Engineering (Simian Army, Chaos Monkey)', difficulty: 'Hard', link: 'https://netflixtechblog.com/the-netflix-simian-army-16e57fbab116' },

    { id: 'cld_66', title: 'Serverless Architectures: Pros and Cons', difficulty: 'Concept', link: 'https://martinfowler.com/articles/serverless.html' },
    { id: 'cld_67', title: 'API Gateway + Lambda Integration', difficulty: 'Medium', link: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started.html' },
    { id: 'cld_68', title: 'Event-driven Architectures with Queues and Topics', difficulty: 'Medium', link: 'https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/event-driven' },
    { id: 'cld_69', title: 'Cloud Messaging: SQS, SNS, Pub/Sub, Service Bus', difficulty: 'Medium', link: 'https://docs.aws.amazon.com/sns/latest/dg/welcome.html' },
    { id: 'cld_70', title: 'Streaming Platforms (Kafka, Kinesis, Pub/Sub)', difficulty: 'Medium', link: 'https://kafka.apache.org/intro' },

    { id: 'cld_71', title: 'Istio for Traffic Management and Observability', difficulty: 'Hard', link: 'https://istio.io/latest/docs/overview/what-is-istio/' },
    { id: 'cld_72', title: 'Rate Limiting and Throttling at API Gateway', difficulty: 'Medium', link: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html' },
    { id: 'cld_73', title: 'Distributed Configuration (Config Server / Parameter Store)', difficulty: 'Medium', link: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html' },
    { id: 'cld_74', title: 'Edge Computing and CloudFront/Cloudflare', difficulty: 'Concept', link: 'https://aws.amazon.com/cloudfront/' },
    { id: 'cld_75', title: 'Content Delivery Networks (CDNs) and Caching', difficulty: 'Medium', link: 'https://www.cloudflare.com/learning/cdn/what-is-a-cdn/' },

    { id: 'cld_76', title: 'GitOps Basics (ArgoCD, Flux)', difficulty: 'Hard', link: 'https://argo-cd.readthedocs.io/en/stable/' },
    { id: 'cld_77', title: 'Helm Charts for Kubernetes Packaging', difficulty: 'Medium', link: 'https://helm.sh/docs/chart_template_guide/getting_started/' },
    { id: 'cld_78', title: 'Kustomize for Kubernetes Configuration Management', difficulty: 'Medium', link: 'https://kustomize.io/' },
    { id: 'cld_79', title: 'Canary Deployments with Kubernetes (Argo Rollouts, Flagger)', difficulty: 'Hard', link: 'https://argoproj.github.io/argo-rollouts/' },
    { id: 'cld_80', title: 'Progressive Delivery Concepts', difficulty: 'Hard', link: 'https://launchdarkly.com/blog/what-is-progressive-delivery/' },

    { id: 'cld_81', title: 'Cloud-native Logging Patterns (Sidecar, DaemonSet)', difficulty: 'Medium', link: 'https://kubernetes.io/docs/concepts/cluster-administration/logging/' },
    { id: 'cld_82', title: 'Multi-tenancy Strategies in Kubernetes', difficulty: 'Hard', link: 'https://kubernetes.io/docs/concepts/security/multi-tenancy/' },
    { id: 'cld_83', title: 'Pod Security Standards and Policies', difficulty: 'Hard', link: 'https://kubernetes.io/docs/concepts/security/pod-security-standards/' },
    { id: 'cld_84', title: 'Network Policies in Kubernetes', difficulty: 'Hard', link: 'https://kubernetes.io/docs/concepts/services-networking/network-policies/' },
    { id: 'cld_85', title: 'Service Discovery in Cloud-native Systems', difficulty: 'Medium', link: 'https://microservices.io/patterns/server-side-discovery.html' },

    { id: 'cld_86', title: 'Cloud-native Authentication and Authorization (OIDC, JWT)', difficulty: 'Hard', link: 'https://auth0.com/intro-to-iam/what-is-openid-connect-oidc' },
    { id: 'cld_87', title: 'SRE Practices: Error Budgets and Toil Reduction', difficulty: 'Hard', link: 'https://sre.google/sre-book/error-budgets/' },
    { id: 'cld_88', title: 'Incident Management and On-call Practices', difficulty: 'Medium', link: 'https://sre.google/sre-book/handling-overload/' },
    { id: 'cld_89', title: 'Runbooks and Playbooks for Production Issues', difficulty: 'Medium', link: 'https://learn.microsoft.com/en-us/azure/architecture/framework/operational-excellence/runbooks' },
    { id: 'cld_90', title: 'Security Scanning (Container, Dependency, Image)', difficulty: 'Medium', link: 'https://docs.docker.com/engine/scan/' },

    { id: 'cld_91', title: 'Designing Multi-tenant SaaS on Cloud', difficulty: 'Hard', link: 'https://aws.amazon.com/blogs/apn/building-multi-tenant-saas-applications-on-aws/' },
    { id: 'cld_92', title: 'Hybrid Cloud and On-prem Connectivity (VPN/Direct Connect)', difficulty: 'Medium', link: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpn-connections.html' },
    { id: 'cld_93', title: 'Cloud-native Data Pipelines (ETL/ELT)', difficulty: 'Medium', link: 'https://cloud.google.com/solutions/data-lakes' },
    { id: 'cld_94', title: 'Designing Highly Available Web Applications on Cloud', difficulty: 'Hard', link: 'https://aws.amazon.com/architecture/well-architected/' },
    { id: 'cld_95', title: 'Terraform + Kubernetes + Helm Workflow', difficulty: 'Hard', link: 'https://developer.hashicorp.com/terraform/tutorials/kubernetes/helm-provider' },

    { id: 'cld_96', title: 'Zero Trust Networking in Cloud', difficulty: 'Hard', link: 'https://cloud.google.com/zero-trust' },
    { id: 'cld_97', title: 'Policy-as-Code (OPA, Gatekeeper)', difficulty: 'Hard', link: 'https://www.openpolicyagent.org/docs/latest/kubernetes-introduction/' },
    { id: 'cld_98', title: 'Supply Chain Security (SBOM, Sigstore, Cosign)', difficulty: 'Hard', link: 'https://slsa.dev/' },
    { id: 'cld_99', title: 'Designing a Production-ready CI/CD Pipeline', difficulty: 'Hard', link: 'https://learn.microsoft.com/en-us/devops/pipelines/what-is-cicd' },
    { id: 'cld_100', title: 'How to Design a Cloud-native, Scalable Microservices Architecture', difficulty: 'Hard', link: 'https://microservices.io/patterns/microservices.html' },
]

// helper to reuse the same Question objects
const pick = (ids: string[]): Question[] =>
    cloudQuestions.filter(q => ids.includes(q.id))

// 🧩 Basic concepts, containers, core AWS/GCP/Azure, CI/CD, monitoring & security basics
export const cloudFundamentals: Question[] = pick([
    'cld_1', 'cld_4', 'cld_5', 'cld_7', 'cld_10',
    'cld_23', 'cld_26', 'cld_27', 'cld_28', 'cld_31', 'cld_32',
    'cld_33', 'cld_34', 'cld_35',
    'cld_36', 'cld_37', 'cld_40',
    'cld_41', 'cld_42', 'cld_45',
    'cld_46', 'cld_48',
    'cld_51', 'cld_54', 'cld_58', 'cld_59', 'cld_61', 'cld_66', 'cld_74', 'cld_75'
])

// 🚀 Deeper into k8s, Terraform, GitOps, observability, SRE & security
export const cloudAdvanced: Question[] = pick([
    'cld_2', 'cld_3', 'cld_6', 'cld_8', 'cld_9',
    'cld_11', 'cld_12', 'cld_13', 'cld_14', 'cld_15',
    'cld_16', 'cld_17', 'cld_18', 'cld_19', 'cld_20',
    'cld_21', 'cld_22', 'cld_24', 'cld_25',
    'cld_29', 'cld_30',
    'cld_38', 'cld_39',
    'cld_47', 'cld_49', 'cld_50',
    'cld_52', 'cld_53', 'cld_55',
    'cld_56', 'cld_57', 'cld_60',
    'cld_62', 'cld_63', 'cld_65',
    'cld_67', 'cld_68', 'cld_69', 'cld_70',
    'cld_71', 'cld_72', 'cld_73',
    'cld_76', 'cld_77', 'cld_78', 'cld_79', 'cld_80',
    'cld_81', 'cld_82', 'cld_83', 'cld_84', 'cld_85',
    'cld_86', 'cld_87', 'cld_88', 'cld_89', 'cld_90',
    'cld_95', 'cld_97', 'cld_98', 'cld_99'
])

// 🏗️ Big-picture architecture, HA/DR, multi-tenant SaaS, hybrid, zero-trust, microservices
export const cloudSystemAndArchitecture: Question[] = pick([
    'cld_61', 'cld_62', 'cld_63', 'cld_64', 'cld_65',
    'cld_71', 'cld_72', 'cld_73', 'cld_74', 'cld_75',
    'cld_58', 'cld_59', 'cld_60',
    'cld_91', 'cld_92', 'cld_93', 'cld_94', 'cld_95',
    'cld_96', 'cld_97', 'cld_98', 'cld_99', 'cld_100'
])
