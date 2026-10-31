import { Injectable, computed, linkedSignal, signal } from '@angular/core';

export type GlobalRole = 'STAFF_ARCHITECT' | 'SRE_LEAD' | 'FINOPS_ANALYST';
export type EnvironmentId = 'prod-us-east' | 'prod-eu-central' | 'staging-canary';
export type TenantId = 'acme-fintech' | 'nebula-ai-cloud' | 'quant-velocity';

export interface CrossMfeBusEvent {
  id: string;
  timestamp: string;
  sourceMfe: string;
  targetMfe: string | 'ALL_REMOTES';
  eventType:
    | 'CONTEXT_CHANGED'
    | 'BUDGET_BREACH_EMITTED'
    | 'INCIDENT_STATUS_MUTATED'
    | 'REMOTE_CIRCUIT_TRIPPED'
    | 'SDUI_RULE_DEPLOYED'
    | 'STORM_SIMULATION_TRIGGERED';
  payloadSummary: string;
}

@Injectable({ providedIn: 'root' })
export class SharedMfeContextService {
  readonly activeTenant = signal<TenantId>('acme-fintech');
  readonly activeEnvironment = signal<EnvironmentId>('prod-us-east');
  readonly activeRole = signal<GlobalRole>('STAFF_ARCHITECT');
  readonly isOfflineSimulated = signal<boolean>(false);
  readonly doNotDisturb = signal<boolean>(false);
  readonly backendMode = signal<'LIVE_NESTJS_GRAPHQL' | 'BROWSER_EDGE_ENGINE'>(
    'BROWSER_EDGE_ENGINE',
  );

  /**
   * Angular 22 linkedSignal: automatically resets the selected region cluster badge
   * whenever activeEnvironment changes, while still allowing manual overrides.
   */
  readonly activeClusterShard = linkedSignal<EnvironmentId, string>({
    source: this.activeEnvironment,
    computation: (env) => {
      if (env === 'prod-us-east') return 'eks-us-east-1a (Primary)';
      if (env === 'prod-eu-central') return 'eks-eu-central-1b (Frankfurt)';
      return 'eks-staging-canary-01';
    },
  });

  readonly busEvents = signal<CrossMfeBusEvent[]>([
    {
      id: 'evt-init-1',
      timestamp: new Date(Date.now() - 45_000).toISOString(),
      sourceMfe: 'shell-host',
      targetMfe: 'ALL_REMOTES',
      eventType: 'CONTEXT_CHANGED',
      payloadSummary:
        'Initialized singleton SignalStore contract across 3 federated remotes (Zoneless mode).',
    },
    {
      id: 'evt-init-2',
      timestamp: new Date(Date.now() - 18_000).toISOString(),
      sourceMfe: 'mfe-finops-telemetry',
      targetMfe: 'mfe-notification-studio',
      eventType: 'BUDGET_BREACH_EMITTED',
      payloadSummary:
        'Anthropic Claude 4 Sonnet burn rate ($418.40/hr) breached $350/hr ceiling.',
    },
  ]);

  readonly contextBadgeSummary = computed(
    () =>
      `${this.activeTenant()} · ${this.activeEnvironment()} · Role: ${this.activeRole()}`,
  );

  setTenant(tenant: TenantId): void {
    this.activeTenant.set(tenant);
    this.publishBusEvent(
      'shell-host',
      'ALL_REMOTES',
      'CONTEXT_CHANGED',
      `Switched active tenant context to '${tenant}' across all mounted remotes.`,
    );
  }

  setEnvironment(env: EnvironmentId): void {
    this.activeEnvironment.set(env);
    this.publishBusEvent(
      'shell-host',
      'ALL_REMOTES',
      'CONTEXT_CHANGED',
      `Switched environment to '${env}' -> cluster '${this.activeClusterShard()}'.`,
    );
  }

  setRole(role: GlobalRole): void {
    this.activeRole.set(role);
    this.publishBusEvent(
      'shell-host',
      'ALL_REMOTES',
      'CONTEXT_CHANGED',
      `Updated RBAC Role to '${role}'. Re-evaluating runtime federation manifest permissions.`,
    );
  }

  toggleOfflineMode(offline: boolean): void {
    this.isOfflineSimulated.set(offline);
    this.publishBusEvent(
      'shell-host',
      'mfe-notification-studio',
      'CONTEXT_CHANGED',
      offline
        ? 'Network switched to OFFLINE mode — queuing UI acknowledgments in IndexedDB/LocalStorage Outbox.'
        : 'Network ONLINE — replaying queued outbox mutations with idempotency keys.',
    );
  }

  publishBusEvent(
    sourceMfe: string,
    targetMfe: string | 'ALL_REMOTES',
    eventType: CrossMfeBusEvent['eventType'],
    payloadSummary: string,
  ): void {
    const entry: CrossMfeBusEvent = {
      id: `bus-${Date.now()}-${Math.floor(Math.random() * 999)}`,
      timestamp: new Date().toISOString(),
      sourceMfe,
      targetMfe,
      eventType,
      payloadSummary,
    };
    this.busEvents.update((list) => [entry, ...list.slice(0, 39)]);
  }
}
