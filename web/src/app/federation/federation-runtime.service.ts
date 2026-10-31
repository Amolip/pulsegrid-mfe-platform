import { Injectable, Type, computed, inject, signal } from '@angular/core';
import {
  GlobalRole,
  SharedMfeContextService,
} from '../core/shared-context/shared-mfe-context.service';
import { NotificationQueueService } from '../core/notification-queue/notification-queue.service';

export type RemoteId =
  | 'mfe-notification-studio'
  | 'mfe-finops-telemetry'
  | 'mfe-incident-war-room';

export interface FederatedRemoteDescriptor {
  remoteId: RemoteId;
  displayName: string;
  remoteEntryUrl: string;
  exposedModule: string;
  version: string;
  owningSquad: string;
  requiredRoles: GlobalRole[];
  status: 'HEALTHY' | 'CIRCUIT_OPEN';
  bundleSizeKb: number;
  avgHydrationMs: number;
  circuitBreakerTripped: boolean;
}

@Injectable({ providedIn: 'root' })
export class FederationRuntimeService {
  private readonly sharedContext = inject(SharedMfeContextService);
  private readonly notificationQueue = inject(NotificationQueueService);

  readonly remotes = signal<FederatedRemoteDescriptor[]>([
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
  ]);

  readonly authorizedRemotes = computed(() => {
    const role = this.sharedContext.activeRole();
    return this.remotes().filter((r) => r.requiredRoles.includes(role));
  });

  isRemoteAuthorized(remoteId: RemoteId): boolean {
    const role = this.sharedContext.activeRole();
    const target = this.remotes().find((r) => r.remoteId === remoteId);
    return !!target && target.requiredRoles.includes(role);
  }

  getRemoteDescriptor(remoteId: RemoteId): FederatedRemoteDescriptor | undefined {
    return this.remotes().find((r) => r.remoteId === remoteId);
  }

  /**
   * Simulates a runtime crash / circuit breaker trip inside an individual Federated Remote
   * to demonstrate MFE Fault Isolation (Error Boundary) without crashing the Host Shell.
   */
  toggleRemoteCircuitBreaker(remoteId: RemoteId): void {
    let updatedRemote: FederatedRemoteDescriptor | undefined;
    this.remotes.update((list) =>
      list.map((r) => {
        if (r.remoteId !== remoteId) return r;
        const nextTripped = !r.circuitBreakerTripped;
        updatedRemote = {
          ...r,
          circuitBreakerTripped: nextTripped,
          status: nextTripped ? 'CIRCUIT_OPEN' : 'HEALTHY',
        };
        return updatedRemote;
      }),
    );

    if (!updatedRemote) return;

    this.sharedContext.publishBusEvent(
      'shell-host',
      remoteId,
      'REMOTE_CIRCUIT_TRIPPED',
      updatedRemote.circuitBreakerTripped
        ? `Circuit Breaker OPENED for ${remoteId}. Host Shell isolated fault and rendered fallback boundary.`
        : `Circuit Breaker CLOSED for ${remoteId}. Remote bundle re-hydrated cleanly.`,
    );

    this.notificationQueue.ingestNotification({
      priority: updatedRemote.circuitBreakerTripped ? 'P0_CRITICAL' : 'P2_NORMAL',
      title: updatedRemote.circuitBreakerTripped
        ? `MFE Fault Isolated: ${updatedRemote.displayName} Crashed`
        : `MFE Recovered: ${updatedRemote.displayName} Re-mounted`,
      message: updatedRemote.circuitBreakerTripped
        ? `Error boundary caught unhandled remote exception in ${remoteId} (${updatedRemote.exposedModule}). Sibling remotes unaffected.`
        : `Remote ${remoteId} passed health check and resumed normal Signal reactivity.`,
      sourceMfe: 'shell-host',
      category: 'MFE_FAULT_ISOLATION',
      dedupeKey: `circuit:${remoteId}:${updatedRemote.circuitBreakerTripped ? 'open' : 'closed'}`,
    });
  }

  /**
   * Dynamic runtime loader using ES dynamic import() (mirroring loadRemoteModule)
   */
  async loadRemoteComponent(remoteId: RemoteId): Promise<Type<unknown>> {
    if (remoteId === 'mfe-notification-studio') {
      const m = await import(
        '../remotes/notification-studio/notification-studio-remote.component'
      );
      return m.NotificationStudioRemoteComponent;
    }
    if (remoteId === 'mfe-finops-telemetry') {
      const m = await import(
        '../remotes/finops-telemetry/finops-telemetry-remote.component'
      );
      return m.FinOpsTelemetryRemoteComponent;
    }
    const m = await import(
      '../remotes/incident-war-room/incident-war-room-remote.component'
    );
    return m.IncidentWarRoomRemoteComponent;
  }
}
