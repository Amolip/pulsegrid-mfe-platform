import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
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
import { PulseGridService } from './pulsegrid.service';

@Resolver()
export class PulseGridResolver {
  constructor(private readonly pulseGridService: PulseGridService) {}

  @Query(() => [RemoteModuleManifestItem])
  federationManifest(
    @Args('role', { defaultValue: 'STAFF_ARCHITECT' }) role: string,
  ): RemoteModuleManifestItem[] {
    return this.pulseGridService.getFederationManifest(role);
  }

  @Query(() => [NotificationItemModel])
  notifications(): NotificationItemModel[] {
    return this.pulseGridService.getNotifications();
  }

  @Query(() => NotificationQueueMetricsModel)
  queueMetrics(): NotificationQueueMetricsModel {
    return this.pulseGridService.getQueueMetrics();
  }

  @Query(() => FinOpsTelemetrySnapshotModel)
  finopsTelemetry(
    @Args('tenantId', { defaultValue: 'acme-fintech' }) tenantId: string,
    @Args('environment', { defaultValue: 'prod-us-east' }) environment: string,
  ): FinOpsTelemetrySnapshotModel {
    return this.pulseGridService.getFinOpsSnapshot(tenantId, environment);
  }

  @Query(() => [IncidentCardModel])
  incidents(): IncidentCardModel[] {
    return this.pulseGridService.getIncidents();
  }

  @Query(() => [SduiStepSchemaModel])
  sduiRuleSchema(): SduiStepSchemaModel[] {
    return this.pulseGridService.getSduiRuleSchema();
  }

  @Mutation(() => NotificationItemModel)
  dispatchNotification(
    @Args('input') input: DispatchNotificationInput,
  ): NotificationItemModel {
    return this.pulseGridService.enqueueNotification(input);
  }

  @Mutation(() => NotificationQueueMetricsModel)
  dispatchNotificationBurst(
    @Args('burstSize', { type: () => Int, defaultValue: 50 }) burstSize: number,
    @Args('scenario', { defaultValue: 'DUPLICATE_STORM' }) scenario: string,
  ): NotificationQueueMetricsModel {
    return this.pulseGridService.dispatchStormBurst(burstSize, scenario);
  }

  @Mutation(() => [NotificationItemModel])
  acknowledgeNotifications(
    @Args('ids', { type: () => [String] }) ids: string[],
  ): NotificationItemModel[] {
    return this.pulseGridService.acknowledgeNotifications(ids);
  }

  @Mutation(() => OfflineOutboxReplayResultModel)
  replayOfflineOutbox(
    @Args('items', { type: () => [OfflineOutboxItemInput] })
    items: OfflineOutboxItemInput[],
  ): OfflineOutboxReplayResultModel {
    return this.pulseGridService.replayOfflineOutbox(items);
  }

  @Mutation(() => IncidentCardModel)
  updateIncidentStatus(
    @Args('incidentId') incidentId: string,
    @Args('newStatus') newStatus: string,
  ): IncidentCardModel {
    return this.pulseGridService.updateIncidentStatus(incidentId, newStatus);
  }

  @Mutation(() => RemoteModuleManifestItem)
  toggleRemoteCircuitBreaker(
    @Args('remoteId') remoteId: string,
    @Args('tripped') tripped: boolean,
  ): RemoteModuleManifestItem {
    return this.pulseGridService.toggleRemoteCircuitBreaker(remoteId, tripped);
  }
}
