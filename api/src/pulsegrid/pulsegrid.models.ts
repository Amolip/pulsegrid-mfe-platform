import { Field, Float, ID, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoteModuleManifestItem {
  @Field(() => ID)
  remoteId: string;

  @Field()
  displayName: string;

  @Field()
  remoteEntryUrl: string;

  @Field()
  exposedModule: string;

  @Field()
  version: string;

  @Field()
  owningSquad: string;

  @Field(() => [String])
  requiredRoles: string[];

  @Field()
  status: string; // 'HEALTHY' | 'DEGRADED' | 'CIRCUIT_OPEN'

  @Field(() => Int)
  bundleSizeKb: number;

  @Field(() => Float)
  avgHydrationMs: number;

  @Field(() => Boolean)
  circuitBreakerTripped: boolean;
}

@ObjectType()
export class NotificationItemModel {
  @Field(() => ID)
  id: string;

  @Field()
  dedupeKey: string;

  @Field()
  priority: string; // 'P0_CRITICAL' | 'P1_HIGH' | 'P2_NORMAL' | 'P3_LOW'

  @Field(() => Int)
  priorityRank: number; // 0 = P0, 1 = P1, 2 = P2, 3 = P3

  @Field()
  title: string;

  @Field()
  message: string;

  @Field()
  sourceMfe: string;

  @Field()
  category: string;

  @Field()
  environment: string;

  @Field()
  tenantId: string;

  @Field(() => Int)
  occurrences: number;

  @Field(() => Boolean)
  read: boolean;

  @Field(() => Boolean)
  acknowledged: boolean;

  @Field()
  createdAt: string;

  @Field()
  lastOccurredAt: string;
}

@ObjectType()
export class PriorityLaneCountModel {
  @Field(() => Int)
  p0Critical: number;

  @Field(() => Int)
  p1High: number;

  @Field(() => Int)
  p2Normal: number;

  @Field(() => Int)
  p3Low: number;
}

@ObjectType()
export class NotificationQueueMetricsModel {
  @Field(() => Int)
  totalReceived: number;

  @Field(() => Int)
  coalescedDuplicatesSaved: number;

  @Field(() => Int)
  preemptionsExecuted: number;

  @Field(() => Int)
  unreadCount: number;

  @Field(() => Int)
  activeToastCap: number;

  @Field(() => Int)
  tokenBucketRatePerSec: number;

  @Field(() => Int)
  replayedOutboxMutations: number;

  @Field(() => PriorityLaneCountModel)
  laneBreakdown: PriorityLaneCountModel;
}

@ObjectType()
export class FinOpsMetricPointModel {
  @Field()
  timestamp: string;

  @Field(() => Float)
  cloudSpendUsdPerHr: number;

  @Field(() => Float)
  aiTokenSpendUsdPerHr: number;

  @Field(() => Float)
  budgetThresholdUsdPerHr: number;

  @Field(() => Int)
  llmTokensPerSec: number;
}

@ObjectType()
export class ServiceCostBreakdownModel {
  @Field()
  serviceName: string;

  @Field()
  provider: string; // 'AWS EKS' | 'Anthropic Claude' | 'OpenAI GPT' | 'GCP BigQuery'

  @Field(() => Float)
  hourlyBurnUsd: number;

  @Field(() => Float)
  deltaPercent: number;

  @Field()
  anomalyState: string; // 'NORMAL' | 'ELEVATED' | 'BREACH'
}

@ObjectType()
export class FinOpsTelemetrySnapshotModel {
  @Field()
  tenantId: string;

  @Field()
  environment: string;

  @Field(() => Float)
  currentHourlyBurnUsd: number;

  @Field(() => Float)
  budgetCeilingUsd: number;

  @Field(() => [FinOpsMetricPointModel])
  series: FinOpsMetricPointModel[];

  @Field(() => [ServiceCostBreakdownModel])
  services: ServiceCostBreakdownModel[];
}

@ObjectType()
export class IncidentCardModel {
  @Field(() => ID)
  id: string;

  @Field()
  severity: string; // 'SEV1' | 'SEV2' | 'SEV3'

  @Field()
  title: string;

  @Field()
  affectedService: string;

  @Field()
  owningSquad: string;

  @Field()
  status: string; // 'TRIGGERED' | 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED'

  @Field()
  assignee: string;

  @Field()
  updatedAt: string;
}

@ObjectType()
export class SduiFieldSchemaModel {
  @Field()
  key: string;

  @Field()
  label: string;

  @Field()
  controlType: string; // 'TEXT' | 'SELECT' | 'NUMBER' | 'TOGGLE'

  @Field(() => Boolean)
  required: boolean;

  @Field({ nullable: true })
  defaultValue?: string;

  @Field(() => [String], { nullable: true })
  options?: string[];

  @Field({ nullable: true })
  helperText?: string;
}

@ObjectType()
export class SduiStepSchemaModel {
  @Field()
  stepId: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [SduiFieldSchemaModel])
  fields: SduiFieldSchemaModel[];
}

@ObjectType()
export class OfflineOutboxReplayResultModel {
  @Field(() => Int)
  processedCount: number;

  @Field(() => Int)
  dedupedIdempotentCount: number;

  @Field(() => [String])
  appliedOutboxIds: string[];

  @Field()
  syncedAt: string;
}

@InputType()
export class DispatchNotificationInput {
  @Field()
  priority: string;

  @Field()
  title: string;

  @Field()
  message: string;

  @Field()
  sourceMfe: string;

  @Field()
  category: string;

  @Field()
  environment: string;

  @Field()
  tenantId: string;

  @Field({ nullable: true })
  dedupeKey?: string;
}

@InputType()
export class OfflineOutboxItemInput {
  @Field()
  outboxId: string;

  @Field()
  actionType: string; // 'ACK_SINGLE' | 'MARK_READ' | 'MARK_ALL_READ'

  @Field(() => [String])
  notificationIds: string[];

  @Field()
  clientTimestamp: string;
}
