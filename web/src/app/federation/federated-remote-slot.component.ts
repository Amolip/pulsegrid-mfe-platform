import {
  Component,
  OnInit,
  Type,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import {
  FederationRuntimeService,
  RemoteId,
} from './federation-runtime.service';

@Component({
  selector: 'app-federated-remote-slot',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  template: `
    @if (descriptor(); as meta) {
      <div
        class="mfe-slot-boundary"
        [class.circuit-open]="meta.circuitBreakerTripped"
      >
        <!-- Federation Boundary Telemetry Bar -->
        <div class="mfe-boundary-bar">
          <div class="mfe-boundary-left">
            <span
              class="status-dot"
              [class.healthy]="!meta.circuitBreakerTripped"
              [class.open]="meta.circuitBreakerTripped"
            ></span>
            <span class="mono mfe-entry-tag">
              {{ meta.remoteId }} ({{ meta.exposedModule }})
            </span>
            <span class="mfe-meta-chip">
              v{{ meta.version }} · {{ meta.bundleSizeKb }}kB ·
              {{ meta.avgHydrationMs }}ms hydration
            </span>
          </div>

          <div class="mfe-boundary-right">
            <span class="squad-label">Squad: {{ meta.owningSquad }}</span>
            <button
              class="fault-btn"
              [class.recover]="meta.circuitBreakerTripped"
              (click)="federation.toggleRemoteCircuitBreaker(remoteId())"
            >
              {{
                meta.circuitBreakerTripped
                  ? 'Close Circuit & Re-Hydrate Remote'
                  : 'Inject Remote Crash (Fault Boundary Test)'
              }}
            </button>
          </div>
        </div>

        <!-- RBAC Check -> Circuit Breaker Check -> Dynamic NgComponentOutlet -->
        @if (!isAuthorized()) {
          <div class="mfe-rbac-locked">
            <h4>RBAC Guard Blocked Remote Bundle Download</h4>
            <p>
              Current role does not have permission to mount
              <code>{{ meta.remoteId }}</code>. Required roles:
              <code>{{ meta.requiredRoles.join(', ') }}</code>.
            </p>
          </div>
        } @else if (meta.circuitBreakerTripped) {
          <div class="mfe-fault-fallback" role="alert">
            <div class="fault-badge">MFE ERROR BOUNDARY ACTIVE · CIRCUIT_OPEN</div>
            <h4>Isolated Remote Failure in {{ meta.displayName }}</h4>
            <p>
              <code>{{ meta.remoteEntryUrl }}</code> threw a simulated runtime exception.
              The Host Shell and sibling Micro-Frontends remain <strong>100% operational</strong>.
            </p>
            <button
              class="action-btn btn-accent"
              (click)="federation.toggleRemoteCircuitBreaker(remoteId())"
            >
              Reset Circuit Breaker &amp; Remount {{ meta.remoteId }}
            </button>
          </div>
        } @else if (remoteComponent()) {
          <ng-container *ngComponentOutlet="remoteComponent()!" />
        } @else {
          <div class="mfe-loading-skeleton">
            Streaming remote chunk <code>{{ meta.remoteEntryUrl }}</code>...
          </div>
        }
      </div>
    }
  `,
})
export class FederatedRemoteSlotComponent implements OnInit {
  readonly federation = inject(FederationRuntimeService);
  readonly remoteId = input.required<RemoteId>();

  readonly remoteComponent = signal<Type<unknown> | null>(null);

  readonly descriptor = computed(() =>
    this.federation.getRemoteDescriptor(this.remoteId()),
  );

  readonly isAuthorized = computed(() =>
    this.federation.isRemoteAuthorized(this.remoteId()),
  );

  async ngOnInit(): Promise<void> {
    const comp = await this.federation.loadRemoteComponent(this.remoteId());
    this.remoteComponent.set(comp);
  }
}
