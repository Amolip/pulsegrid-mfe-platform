import { PulseGridService } from './pulsegrid.service';

describe('PulseGridService — System Design Unit Suite', () => {
  let service: PulseGridService;

  beforeEach(() => {
    service = new PulseGridService();
  });

  it('1. coalesces duplicate notifications sharing the same dedupeKey within the 60s window instead of creating duplicate entries', () => {
    const initialCount = service.getNotifications().length;

    const first = service.enqueueNotification({
      priority: 'P1_HIGH',
      title: 'Database Connection Pool Warning',
      message: 'Pool utilization reached 88% on shard-02',
      sourceMfe: 'mfe-finops-telemetry',
      category: 'DB_POOL',
      environment: 'prod-us-east',
      tenantId: 'acme-fintech',
      dedupeKey: 'db-pool-shard-02-warning',
    });

    const second = service.enqueueNotification({
      priority: 'P1_HIGH',
      title: 'Database Connection Pool Warning',
      message: 'Pool utilization reached 91% on shard-02',
      sourceMfe: 'mfe-finops-telemetry',
      category: 'DB_POOL',
      environment: 'prod-us-east',
      tenantId: 'acme-fintech',
      dedupeKey: 'db-pool-shard-02-warning',
    });

    expect(service.getNotifications().length).toBe(initialCount + 1);
    expect(second.id).toBe(first.id);
    expect(second.occurrences).toBe(2);
  });

  it('2. upgrades priority & increments preemption counter when a coalesced duplicate arrives with higher priority (P0_CRITICAL)', () => {
    const first = service.enqueueNotification({
      priority: 'P2_NORMAL',
      title: 'API Gateway Latency Drift',
      message: 'P95 latency crossed 400ms',
      sourceMfe: 'mfe-incident-war-room',
      category: 'LATENCY',
      environment: 'prod-us-east',
      tenantId: 'acme-fintech',
      dedupeKey: 'gateway-latency-drift',
    });
    expect(first.priorityRank).toBe(2);

    const upgraded = service.enqueueNotification({
      priority: 'P0_CRITICAL',
      title: 'API Gateway Latency Drift',
      message: 'P95 latency crossed 2,000ms (SLO Breach)',
      sourceMfe: 'mfe-incident-war-room',
      category: 'LATENCY',
      environment: 'prod-us-east',
      tenantId: 'acme-fintech',
      dedupeKey: 'gateway-latency-drift',
    });

    expect(upgraded.id).toBe(first.id);
    expect(upgraded.priority).toBe('P0_CRITICAL');
    expect(upgraded.priorityRank).toBe(0);
    expect(upgraded.occurrences).toBe(2);
  });

  it('3. enforces idempotency when replaying the Offline Mutation Outbox so duplicate network retries are ignored', () => {
    const targetId = service.getNotifications()[0].id;

    const firstReplay = service.replayOfflineOutbox([
      {
        outboxId: 'outbox-uuid-9001',
        actionType: 'ACK_SINGLE',
        notificationIds: [targetId],
        clientTimestamp: new Date().toISOString(),
      },
    ]);

    expect(firstReplay.processedCount).toBe(1);
    expect(firstReplay.dedupedIdempotentCount).toBe(0);

    // Retry same outboxId
    const duplicateReplay = service.replayOfflineOutbox([
      {
        outboxId: 'outbox-uuid-9001',
        actionType: 'ACK_SINGLE',
        notificationIds: [targetId],
        clientTimestamp: new Date().toISOString(),
      },
    ]);

    expect(duplicateReplay.processedCount).toBe(0);
    expect(duplicateReplay.dedupedIdempotentCount).toBe(1);
  });

  it('4. filters Runtime Module Federation Manifest by RBAC Role and isolates circuit breaker state per remote', () => {
    const architectRemotes = service.getFederationManifest('STAFF_ARCHITECT');
    const finopsRemotes = service.getFederationManifest('FINOPS_ANALYST');

    expect(architectRemotes.length).toBe(3);
    expect(finopsRemotes.length).toBe(2);
    expect(
      finopsRemotes.some((r) => r.remoteId === 'mfe-incident-war-room'),
    ).toBe(false);

    const tripped = service.toggleRemoteCircuitBreaker(
      'mfe-finops-telemetry',
      true,
    );
    expect(tripped.circuitBreakerTripped).toBe(true);
    expect(tripped.status).toBe('CIRCUIT_OPEN');
  });
});
