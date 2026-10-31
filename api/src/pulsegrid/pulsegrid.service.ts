import { Injectable } from '@nestjs/common';
import {
  DispatchNotificationInput,
  FinOpsTelemetrySnapshotModel,
  IncidentCardModel,
  NotificationItemModel,
  NotificationQueueMetricsModel,
  OfflineOutboxItemInput,
  OfflineOutboxReplayResultModel,
  RemoteModuleManifestItem,
  SduiStepSchemaModel,
} from './pulsegrid.models';

const PRIORITY_RANK_MAP: Record<string, number> = {
  P0_CRITICAL: 0,
  P1_HIGH: 1,
  P2_NORMAL: 2,
  P3_LOW: 3,
};

@Injectable()
export class PulseGridService {
  private readonly coalesceWindowMs = 60_000;
  private totalReceived = 18;
  private coalescedDuplicatesSaved = 142;
  private preemptionsExecuted = 7;
  private replayedOutboxMutations = 0;
  private readonly processedOutboxIds = new Set<string>();

  private remotes: RemoteModuleManifestItem[] = [
    {
      remoteId: 'mfe-notification-studio',
      displayName: 'Notification Queue & Storm Studio',
      remoteEntryUrl: 'http://localhost:4202/remoteEntry.json',
      exposedModule: './NotificationStudioRemote',
      version: '22.2.0',
      owningSquad: 'Platform Core & Messaging',
      requiredRoles: ['STAFF_ARCHITECT', 'SRE_LEAD', 'FINOPS_ANALYST'],
      status: 'HEALTHY',
      bundleSizeKb: 64,
      avgHydrationMs: 14.2,
      circuitBreakerTripped: false,
    },
    {
      remoteId: 'mfe-finops-telemetry',
      displayName: 'Cloud & AI Token FinOps Telemetry',
      remoteEntryUrl: 'http://localhost:4203/remoteEntry.json',
      exposedModule: './FinOpsTelemetryRemote',
      version: '22.2.1',
      owningSquad: 'Cloud Economics & AI Infra',
      requiredRoles: ['STAFF_ARCHITECT', 'FINOPS_ANALYST'],
      status: 'HEALTHY',
      bundleSizeKb: 78,
      avgHydrationMs: 18.6,
      circuitBreakerTripped: false,
    },
    {
      remoteId: 'mfe-incident-war-room',
      displayName: 'Incident War-Room & SDUI Rule Engine',
      remoteEntryUrl: 'http://localhost:4204/remoteEntry.json',
      exposedModule: './IncidentWarRoomRemote',
      version: '22.2.0',
      owningSquad: 'Reliability & Chaos Engineering',
      requiredRoles: ['STAFF_ARCHITECT', 'SRE_LEAD'],
      status: 'HEALTHY',
      bundleSizeKb: 71,
      avgHydrationMs: 16.4,
      circuitBreakerTripped: false,
    },
  ];

  private notifications: NotificationItemModel[] = [
    {
      id: 'notif-1001',
      dedupeKey: 'mfe-finops-telemetry:BUDGET_BREACH:anthropic-claude-prod',
      priority: 'P0_CRITICAL',
      priorityRank: 0,
      title: 'AI Token Spend Exceeded Hourly Ceiling ($420/hr)',
      message:
        'Anthropic Claude 4 Sonnet token burn jumped +184% on prod-us-east due to recursive agent loop.',
      sourceMfe: 'mfe-finops-telemetry',
      category: 'BUDGET_BREACH',
      environment: 'prod-us-east',
      tenantId: 'acme-fintech',
      occurrences: 38,
      read: false,
      acknowledged: false,
      createdAt: new Date(Date.now() - 180_000).toISOString(),
      lastOccurredAt: new Date(Date.now() - 12_000).toISOString(),
    },
    {
      id: 'notif-1002',
      dedupeKey: 'mfe-incident-war-room:SLO_BURN:checkout-graphql-subgraph',
      priority: 'P0_CRITICAL',
      priorityRank: 0,
      title: 'P99 Latency > 1,450ms on Checkout GraphQL Subgraph',
      message:
        'Connection pool saturation detected in DataLoader batching tier; auto-scaling read replicas.',
      sourceMfe: 'mfe-incident-war-room',
      category: 'SLO_BURN',
      environment: 'prod-us-east',
      tenantId: 'acme-fintech',
      occurrences: 64,
      read: false,
      acknowledged: false,
      createdAt: new Date(Date.now() - 320_000).toISOString(),
      lastOccurredAt: new Date(Date.now() - 25_000).toISOString(),
    },
    {
      id: 'notif-1003',
      dedupeKey: 'mfe-notification-studio:QUEUE_BACKPRESSURE:toast-scheduler',
      priority: 'P1_HIGH',
      priorityRank: 1,
      title: 'Fingerprint Coalescer Suppressed 142 Duplicate Alerts',
      message:
        'Deduplication window (60s) coalesced 142 identical Redis timeout warnings into 1 notification.',
      sourceMfe: 'mfe-notification-studio',
      category: 'QUEUE_BACKPRESSURE',
      environment: 'prod-us-east',
      tenantId: 'acme-fintech',
      occurrences: 14,
      read: false,
      acknowledged: false,
      createdAt: new Date(Date.now() - 540_000).toISOString(),
      lastOccurredAt: new Date(Date.now() - 50_000).toISOString(),
    },
    {
      id: 'notif-1004',
      dedupeKey: 'mfe-finops-telemetry:SPOT_RECLAIM:eks-worker-pool-b',
      priority: 'P2_NORMAL',
      priorityRank: 2,
      title: 'AWS EKS Spot Node Rebalance Notice',
      message:
        '3 GPU inference nodes in eks-worker-pool-b scheduled for graceful drain in 120 seconds.',
      sourceMfe: 'mfe-finops-telemetry',
      category: 'SPOT_RECLAIM',
      environment: 'prod-eu-central',
      tenantId: 'acme-fintech',
      occurrences: 3,
      read: false,
      acknowledged: false,
      createdAt: new Date(Date.now() - 900_000).toISOString(),
      lastOccurredAt: new Date(Date.now() - 400_000).toISOString(),
    },
    {
      id: 'notif-1005',
      dedupeKey: 'shell-host:MFE_MANIFEST:federation-sync',
      priority: 'P3_LOW',
      priorityRank: 3,
      title: 'Runtime Federation Manifest Verified (3 Remotes)',
      message:
        'All remoteEntry.json bundles passed singleton Angular 22.2 & Material version integrity checks.',
      sourceMfe: 'shell-host',
      category: 'MFE_MANIFEST',
      environment: 'prod-us-east',
      tenantId: 'acme-fintech',
      occurrences: 1,
      read: true,
      acknowledged: true,
      createdAt: new Date(Date.now() - 1_800_000).toISOString(),
      lastOccurredAt: new Date(Date.now() - 1_800_000).toISOString(),
    },
  ];

  private incidents: IncidentCardModel[] = [
    {
      id: 'INC-4091',
      severity: 'SEV1',
      title: 'Recursive LLM Agent Token Spike on Payment Copilot',
      affectedService: 'ai-gateway-subgraph',
      owningSquad: 'Cloud Economics & AI Infra',
      status: 'TRIGGERED',
      assignee: 'Amol P.',
      updatedAt: new Date(Date.now() - 95_000).toISOString(),
    },
    {
      id: 'INC-4090',
      severity: 'SEV1',
      title: 'Redis Cluster Failover Causing Notification Storm',
      affectedService: 'realtime-pubsub-broker',
      owningSquad: 'Platform Core & Messaging',
      status: 'INVESTIGATING',
      assignee: 'Priya S.',
      updatedAt: new Date(Date.now() - 410_000).toISOString(),
    },
    {
      id: 'INC-4088',
      severity: 'SEV2',
      title: 'Remote Bundle CDN Edge Cache Miss Spike in EU-Central',
      affectedService: 'mfe-finops-telemetry',
      owningSquad: 'Frontend Platform',
      status: 'MITIGATED',
      assignee: 'Rohan K.',
      updatedAt: new Date(Date.now() - 1_200_000).toISOString(),
    },
    {
      id: 'INC-4084',
      severity: 'SEV3',
      title: 'GraphQL Schema Deprecation Warning on Legacy Field',
      affectedService: 'billing-ledger-service',
      owningSquad: 'FinOps Core',
      status: 'RESOLVED',
      assignee: 'Amol P.',
      updatedAt: new Date(Date.now() - 3_600_000).toISOString(),
    },
  ];

  getFederationManifest(role = 'STAFF_ARCHITECT'): RemoteModuleManifestItem[] {
    return this.remotes.filter((remote) => remote.requiredRoles.includes(role));
  }

  toggleRemoteCircuitBreaker(
    remoteId: string,
    tripped: boolean,
  ): RemoteModuleManifestItem {
    const target = this.remotes.find((r) => r.remoteId === remoteId);
    if (!target) {
      throw new Error(`Remote MFE '${remoteId}' not found in manifest`);
    }
    target.circuitBreakerTripped = tripped;
    target.status = tripped ? 'CIRCUIT_OPEN' : 'HEALTHY';

    this.enqueueNotification({
      priority: tripped ? 'P0_CRITICAL' : 'P2_NORMAL',
      title: tripped
        ? `MFE Circuit Breaker OPEN: ${target.displayName}`
        : `MFE Circuit Breaker Restored: ${target.displayName}`,
      message: tripped
        ? `Fault-isolation boundary isolated ${target.remoteId}. Host shell and sibling remotes remain unaffected.`
        : `Remote bundle ${target.remoteId} passed health probe and re-mounted cleanly.`,
      sourceMfe: 'shell-host',
      category: 'MFE_CIRCUIT_BREAKER',
      environment: 'prod-us-east',
      tenantId: 'acme-fintech',
      dedupeKey: `shell-host:CIRCUIT:${remoteId}:${tripped ? 'OPEN' : 'CLOSED'}`,
    });

    return target;
  }

  getNotifications(): NotificationItemModel[] {
    return [...this.notifications].sort((a, b) => {
      if (a.read !== b.read) {
        return a.read ? 1 : -1;
      }
      if (a.priorityRank !== b.priorityRank) {
        return a.priorityRank - b.priorityRank;
      }
      return (
        new Date(b.lastOccurredAt).getTime() -
        new Date(a.lastOccurredAt).getTime()
      );
    });
  }

  getQueueMetrics(): NotificationQueueMetricsModel {
    const laneBreakdown = {
      p0Critical: 0,
      p1High: 0,
      p2Normal: 0,
      p3Low: 0,
    };

    for (const item of this.notifications) {
      if (item.priority === 'P0_CRITICAL') laneBreakdown.p0Critical++;
      else if (item.priority === 'P1_HIGH') laneBreakdown.p1High++;
      else if (item.priority === 'P2_NORMAL') laneBreakdown.p2Normal++;
      else laneBreakdown.p3Low++;
    }

    return {
      totalReceived: this.totalReceived,
      coalescedDuplicatesSaved: this.coalescedDuplicatesSaved,
      preemptionsExecuted: this.preemptionsExecuted,
      unreadCount: this.notifications.filter((n) => !n.read).length,
      activeToastCap: 3,
      tokenBucketRatePerSec: 4,
      replayedOutboxMutations: this.replayedOutboxMutations,
      laneBreakdown,
    };
  }

  enqueueNotification(input: DispatchNotificationInput): NotificationItemModel {
    this.totalReceived++;
    const nowIso = new Date().toISOString();
    const nowMs = Date.now();
    const priorityRank = PRIORITY_RANK_MAP[input.priority] ?? 2;
    const dedupeKey =
      input.dedupeKey ||
      `${input.sourceMfe}:${input.category}:${input.title.toLowerCase().slice(0, 32)}`;

    const existing = this.notifications.find((item) => {
      if (item.dedupeKey !== dedupeKey || item.acknowledged) {
        return false;
      }
      const ageMs = nowMs - new Date(item.lastOccurredAt).getTime();
      return ageMs <= this.coalesceWindowMs;
    });

    if (existing) {
      existing.occurrences += 1;
      existing.lastOccurredAt = nowIso;
      existing.read = false;
      if (priorityRank < existing.priorityRank) {
        existing.priority = input.priority;
        existing.priorityRank = priorityRank;
        this.preemptionsExecuted++;
      }
      this.coalescedDuplicatesSaved++;
      return existing;
    }

    if (priorityRank === 0) {
      this.preemptionsExecuted++;
    }

    const created: NotificationItemModel = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      dedupeKey,
      priority: input.priority,
      priorityRank,
      title: input.title,
      message: input.message,
      sourceMfe: input.sourceMfe,
      category: input.category,
      environment: input.environment,
      tenantId: input.tenantId,
      occurrences: 1,
      read: false,
      acknowledged: false,
      createdAt: nowIso,
      lastOccurredAt: nowIso,
    };

    this.notifications.unshift(created);
    return created;
  }

  dispatchStormBurst(
    burstSize: number,
    scenario: string,
    environment = 'prod-us-east',
    tenantId = 'acme-fintech',
  ): NotificationQueueMetricsModel {
    const safeCount = Math.max(1, Math.min(burstSize, 250));
    for (let i = 0; i < safeCount; i++) {
      if (scenario === 'DUPLICATE_STORM') {
        this.enqueueNotification({
          priority: i % 15 === 0 ? 'P0_CRITICAL' : 'P1_HIGH',
          title: 'Redis PubSub Socket Read Timeout (ECONNRESET)',
          message:
            'Cluster shard redis-03 timed out during high-frequency telemetry fan-out.',
          sourceMfe: 'mfe-finops-telemetry',
          category: 'INFRA_STORM',
          environment,
          tenantId,
          dedupeKey: `${environment}:redis-03:ECONNRESET`,
        });
      } else {
        const priorities = ['P0_CRITICAL', 'P1_HIGH', 'P2_NORMAL', 'P3_LOW'];
        const chosenPriority = priorities[i % priorities.length];
        this.enqueueNotification({
          priority: chosenPriority,
          title: `[${chosenPriority}] Multi-MFE Telemetry Event #${i + 1}`,
          message: `Priority queue test packet routed via token-bucket scheduler (${scenario}).`,
          sourceMfe:
            i % 2 === 0 ? 'mfe-finops-telemetry' : 'mfe-incident-war-room',
          category: 'PRIORITY_MIX',
          environment,
          tenantId,
          dedupeKey: `${scenario}:unique-key-${i % 8}`,
        });
      }
    }

    return this.getQueueMetrics();
  }

  acknowledgeNotifications(ids: string[]): NotificationItemModel[] {
    const idSet = new Set(ids);
    for (const item of this.notifications) {
      if (idSet.has(item.id)) {
        item.read = true;
        item.acknowledged = true;
      }
    }
    return this.getNotifications();
  }

  replayOfflineOutbox(
    items: OfflineOutboxItemInput[],
  ): OfflineOutboxReplayResultModel {
    let processedCount = 0;
    let dedupedIdempotentCount = 0;
    const appliedOutboxIds: string[] = [];

    for (const entry of items) {
      if (this.processedOutboxIds.has(entry.outboxId)) {
        dedupedIdempotentCount++;
        continue;
      }
      this.processedOutboxIds.add(entry.outboxId);
      appliedOutboxIds.push(entry.outboxId);
      processedCount++;
      this.replayedOutboxMutations++;

      if (entry.actionType === 'MARK_ALL_READ') {
        for (const n of this.notifications) {
          n.read = true;
        }
      } else {
        const targetSet = new Set(entry.notificationIds);
        for (const n of this.notifications) {
          if (targetSet.has(n.id)) {
            n.read = true;
            if (entry.actionType === 'ACK_SINGLE') {
              n.acknowledged = true;
            }
          }
        }
      }
    }

    return {
      processedCount,
      dedupedIdempotentCount,
      appliedOutboxIds,
      syncedAt: new Date().toISOString(),
    };
  }

  getFinOpsSnapshot(
    tenantId = 'acme-fintech',
    environment = 'prod-us-east',
  ): FinOpsTelemetrySnapshotModel {
    return {
      tenantId,
      environment,
      currentHourlyBurnUsd: 418.4,
      budgetCeilingUsd: 350.0,
      series: [
        {
          timestamp: '10:00',
          cloudSpendUsdPerHr: 162,
          aiTokenSpendUsdPerHr: 98,
          budgetThresholdUsdPerHr: 350,
          llmTokensPerSec: 14200,
        },
        {
          timestamp: '10:10',
          cloudSpendUsdPerHr: 168,
          aiTokenSpendUsdPerHr: 112,
          budgetThresholdUsdPerHr: 350,
          llmTokensPerSec: 16800,
        },
        {
          timestamp: '10:20',
          cloudSpendUsdPerHr: 174,
          aiTokenSpendUsdPerHr: 145,
          budgetThresholdUsdPerHr: 350,
          llmTokensPerSec: 21900,
        },
        {
          timestamp: '10:30',
          cloudSpendUsdPerHr: 181,
          aiTokenSpendUsdPerHr: 196,
          budgetThresholdUsdPerHr: 350,
          llmTokensPerSec: 31400,
        },
        {
          timestamp: '10:40',
          cloudSpendUsdPerHr: 186,
          aiTokenSpendUsdPerHr: 232.4,
          budgetThresholdUsdPerHr: 350,
          llmTokensPerSec: 38900,
        },
      ],
      services: [
        {
          serviceName: 'ai-agent-orchestrator',
          provider: 'Anthropic Claude 4 Sonnet',
          hourlyBurnUsd: 164.8,
          deltaPercent: 184.2,
          anomalyState: 'BREACH',
        },
        {
          serviceName: 'semantic-vector-indexer',
          provider: 'OpenAI Embeddings + Pinecone',
          hourlyBurnUsd: 67.6,
          deltaPercent: 42.5,
          anomalyState: 'ELEVATED',
        },
        {
          serviceName: 'eks-graphql-mesh-cluster',
          provider: 'AWS EKS (c7g.4xlarge)',
          hourlyBurnUsd: 118.0,
          deltaPercent: 8.4,
          anomalyState: 'NORMAL',
        },
        {
          serviceName: 'clickhouse-telemetry-store',
          provider: 'AWS EBS + ClickHouse Cloud',
          hourlyBurnUsd: 68.0,
          deltaPercent: 3.1,
          anomalyState: 'NORMAL',
        },
      ],
    };
  }

  getIncidents(): IncidentCardModel[] {
    return this.incidents;
  }

  updateIncidentStatus(incidentId: string, newStatus: string): IncidentCardModel {
    const incident = this.incidents.find((item) => item.id === incidentId);
    if (!incident) {
      throw new Error(`Incident '${incidentId}' not found`);
    }
    const previousStatus = incident.status;
    incident.status = newStatus;
    incident.updatedAt = new Date().toISOString();

    this.enqueueNotification({
      priority: newStatus === 'TRIGGERED' ? 'P0_CRITICAL' : 'P1_HIGH',
      title: `Incident ${incident.id} moved ${previousStatus} -> ${newStatus}`,
      message: `${incident.title} (${incident.affectedService}) updated in War-Room board.`,
      sourceMfe: 'mfe-incident-war-room',
      category: 'INCIDENT_STATE_CHANGE',
      environment: 'prod-us-east',
      tenantId: 'acme-fintech',
      dedupeKey: `incident:${incident.id}:${newStatus}`,
    });

    return incident;
  }

  getSduiRuleSchema(): SduiStepSchemaModel[] {
    return [
      {
        stepId: 'step-trigger-source',
        title: '1. Telemetry Source & Anomaly Condition',
        description:
          'Server-Driven schema step defining which federated domain and metric threshold triggers the rule.',
        fields: [
          {
            key: 'ruleName',
            label: 'Escalation Rule Name',
            controlType: 'TEXT',
            required: true,
            defaultValue: 'LLM Hourly Burn Circuit Breaker',
            helperText: 'Unique identifier broadcast in notification headers',
          },
          {
            key: 'sourceMfe',
            label: 'Originating Micro-Frontend Domain',
            controlType: 'SELECT',
            required: true,
            defaultValue: 'mfe-finops-telemetry',
            options: [
              'mfe-finops-telemetry',
              'mfe-incident-war-room',
              'mfe-notification-studio',
            ],
          },
          {
            key: 'thresholdUsd',
            label: 'Hourly Spend Threshold ($ USD/hr)',
            controlType: 'NUMBER',
            required: true,
            defaultValue: '350',
          },
        ],
      },
      {
        stepId: 'step-queue-policy',
        title: '2. Notification Queue & Coalescing Policy',
        description:
          'Configure priority lane assignment, deduplication window, and preemption behavior.',
        fields: [
          {
            key: 'priority',
            label: 'Target Priority Queue Lane',
            controlType: 'SELECT',
            required: true,
            defaultValue: 'P0_CRITICAL',
            options: ['P0_CRITICAL', 'P1_HIGH', 'P2_NORMAL', 'P3_LOW'],
          },
          {
            key: 'coalesceWindowSec',
            label: 'Fingerprint Deduplication Window (Seconds)',
            controlType: 'NUMBER',
            required: true,
            defaultValue: '60',
            helperText:
              'Collapses identical alerts within this window into an occurrence badge (xN)',
          },
          {
            key: 'preemptActiveToasts',
            label: 'Preempt Lower-Priority Active Toasts in HUD',
            controlType: 'TOGGLE',
            required: false,
            defaultValue: 'true',
          },
        ],
      },
    ];
  }
}
