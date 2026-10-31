import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  EnvironmentId,
  GlobalRole,
  SharedMfeContextService,
  TenantId,
} from './core/shared-context/shared-mfe-context.service';
import { NotificationQueueService } from './core/notification-queue/notification-queue.service';
import {
  FederationRuntimeService,
  RemoteId,
} from './federation/federation-runtime.service';
import { FederatedRemoteSlotComponent } from './federation/federated-remote-slot.component';

type WorkspaceViewMode = 'COMPOSITE_GRID' | RemoteId;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, FederatedRemoteSlotComponent],
  template: `
    <div class="shell-layout">
      <!-- Top Host Shell Navigation & Global Context Bar -->
      <header class="shell-header">
        <div class="brand-cluster">
          <div class="brand-logo">PG</div>
          <div>
            <div class="brand-title-row">
              <h1>PulseGrid</h1>
              <span class="arch-chip">Angular 22 Zoneless Signals</span>
              <span class="arch-chip chip-purple">Module Federation Host</span>
              <span
                class="arch-chip"
                [class.chip-emerald]="shared.backendMode() === 'LIVE_NESTJS_GRAPHQL'"
              >
                {{
                  shared.backendMode() === 'LIVE_NESTJS_GRAPHQL'
                    ? 'LIVE NestJS GraphQL :3344'
                    : 'In-Browser Deterministic Engine'
                }}
              </span>
            </div>
            <p class="brand-subtitle">
              Federated Micro-Frontend Workbench &amp; Real-Time UI Notification Priority Queue Engine
            </p>
          </div>
        </div>

        <!-- Global Singleton Signal Context Controls -->
        <div class="global-context-controls">
          <label class="ctx-ctrl">
            <span>Tenant</span>
            <select
              [ngModel]="shared.activeTenant()"
              (ngModelChange)="onTenantChange($event)"
              class="ctrl-select"
            >
              <option value="acme-fintech">acme-fintech</option>
              <option value="nebula-ai-cloud">nebula-ai-cloud</option>
              <option value="quant-velocity">quant-velocity</option>
            </select>
          </label>

          <label class="ctx-ctrl">
            <span>Environment</span>
            <select
              [ngModel]="shared.activeEnvironment()"
              (ngModelChange)="onEnvChange($event)"
              class="ctrl-select"
            >
              <option value="prod-us-east">prod-us-east</option>
              <option value="prod-eu-central">prod-eu-central</option>
              <option value="staging-canary">staging-canary</option>
            </select>
          </label>

          <label class="ctx-ctrl">
            <span>RBAC Role (Manifest Guard)</span>
            <select
              [ngModel]="shared.activeRole()"
              (ngModelChange)="onRoleChange($event)"
              class="ctrl-select"
            >
              <option value="STAFF_ARCHITECT">STAFF_ARCHITECT (All 3 Remotes)</option>
              <option value="FINOPS_ANALYST">FINOPS_ANALYST (2 Remotes)</option>
              <option value="SRE_LEAD">SRE_LEAD (2 Remotes)</option>
            </select>
          </label>

          <button
            class="toggle-pill"
            [class.active-warn]="shared.isOfflineSimulated()"
            (click)="shared.toggleOfflineMode(!shared.isOfflineSimulated())"
          >
            {{ shared.isOfflineSimulated() ? 'OFFLINE (Outbox Active)' : 'ONLINE Mode' }}
          </button>

          <button
            class="toggle-pill"
            [class.active-purple]="shared.doNotDisturb()"
            (click)="shared.doNotDisturb.set(!shared.doNotDisturb())"
          >
            {{ shared.doNotDisturb() ? 'DND: P0 Only' : 'DND: Off' }}
          </button>
        </div>
      </header>

      <!-- Sub-Header: Federation Perspective Switcher & System Design Matrix Toggle -->
      <nav class="perspective-bar" aria-label="Micro-frontend workspace perspective">
        <div class="view-buttons">
          <button
            class="view-tab"
            [class.active]="viewMode() === 'COMPOSITE_GRID'"
            (click)="viewMode.set('COMPOSITE_GRID')"
          >
            Unified Command Grid (All Federated Remotes)
          </button>
          <button
            class="view-tab"
            [class.active]="viewMode() === 'mfe-notification-studio'"
            (click)="viewMode.set('mfe-notification-studio')"
          >
            Remote 1: Notification Queue Studio
            <span class="badge-count">{{ queue.unreadCount() }}</span>
          </button>
          <button
            class="view-tab"
            [class.active]="viewMode() === 'mfe-finops-telemetry'"
            (click)="viewMode.set('mfe-finops-telemetry')"
          >
            Remote 2: FinOps &amp; AI Spend
          </button>
          <button
            class="view-tab"
            [class.active]="viewMode() === 'mfe-incident-war-room'"
            (click)="viewMode.set('mfe-incident-war-room')"
          >
            Remote 3: Incident War-Room &amp; SDUI
          </button>
        </div>

        <button
          class="arch-drawer-btn"
          (click)="showArchMatrix.set(!showArchMatrix())"
        >
          {{ showArchMatrix() ? 'Hide System Design Matrix' : 'Show System Design Matrix' }}
        </button>
      </nav>

      <!-- Collapsible System Design Interview Matrix -->
      @if (showArchMatrix()) {
        <section class="sysdesign-matrix-panel">
          <div class="matrix-card">
            <span class="matrix-tag">SYSTEM DESIGN #1 · UI NOTIFICATION QUEUE</span>
            <h4>4-Lane Priority Heap + Fingerprint Coalescer</h4>
            <p>
              Prevents DOM freezes during 50x alert storms by hashing <code>dedupeKey</code> within a 60s window into a single <code>×N</code> card, capping HUD overlays at 3, and preempting <code>P3_LOW</code> toasts when <code>P0_CRITICAL</code> arrives.
            </p>
          </div>
          <div class="matrix-card">
            <span class="matrix-tag">SYSTEM DESIGN #2 · MODULE FEDERATION</span>
            <h4>Runtime Manifest + Fault-Isolation Boundaries</h4>
            <p>
              Loads remote micro-frontends dynamically with RBAC role guards and per-remote circuit breakers. Crashing one remote renders an isolated recovery boundary without taking down the Host Shell.
            </p>
          </div>
          <div class="matrix-card">
            <span class="matrix-tag">SYSTEM DESIGN #3 · ZONELESS SIGNALS</span>
            <h4>Zero Zone.js Collisions Across Remotes</h4>
            <p>
              Bootstrapped with <code>provideZonelessChangeDetection()</code> and a singleton <code>SharedMfeContextService</code> using Angular 22 <code>signal()</code>, <code>computed()</code>, and <code>linkedSignal()</code>.
            </p>
          </div>
          <div class="matrix-card">
            <span class="matrix-tag">SYSTEM DESIGN #4 · OFFLINE OUTBOX &amp; SDUI</span>
            <h4>Optimistic UI + Idempotent Replay</h4>
            <p>
              Acknowledgments made while offline are queued with unique <code>outboxId</code> keys and replayed to the NestJS GraphQL API upon reconnection without duplicate side effects.
            </p>
          </div>
        </section>
      }

      <!-- Main Federated Workspace Canvas -->
      <main class="workspace-main">
        @if (viewMode() === 'COMPOSITE_GRID') {
          <div class="composite-mfe-grid">
            <!-- Primary Full-Width Slot: Notification Queue Studio -->
            <div class="grid-col-full">
              <app-federated-remote-slot remoteId="mfe-notification-studio" />
            </div>

            <!-- Secondary Split Slots loaded via Angular @defer -->
            @defer (on immediate) {
              <div class="grid-col-half">
                <app-federated-remote-slot remoteId="mfe-finops-telemetry" />
              </div>
            } @placeholder {
              <div class="mfe-loading-skeleton">Deferring FinOps Remote...</div>
            }

            @defer (on immediate) {
              <div class="grid-col-half">
                <app-federated-remote-slot remoteId="mfe-incident-war-room" />
              </div>
            } @placeholder {
              <div class="mfe-loading-skeleton">Deferring War-Room Remote...</div>
            }
          </div>
        } @else {
          <div class="single-mfe-stage">
            <app-federated-remote-slot [remoteId]="viewModeAsRemote()" />
          </div>
        }

        <!-- Cross-MFE Singleton Signal Event Bus Live Log -->
        <section class="signal-bus-console">
          <div class="bus-header">
            <span class="mono">
              CROSS-MFE SINGLETON SIGNAL EVENT BUS (@pulsegrid/shared-signal-bus)
            </span>
            <span class="mono">
              Active Cluster: {{ shared.activeClusterShard() }}
            </span>
          </div>
          <div class="bus-log-list">
            @for (evt of shared.busEvents().slice(0, 5); track evt.id) {
              <div class="bus-log-row mono">
                <span class="bus-time">{{ evt.timestamp.slice(11, 19) }}</span>
                <span class="bus-route">{{ evt.sourceMfe }} -> {{ evt.targetMfe }}</span>
                <span class="bus-type">{{ evt.eventType }}</span>
                <span class="bus-summary">{{ evt.payloadSummary }}</span>
              </div>
            }
          </div>
        </section>
      </main>

      <!-- Floating CDK-Style Toast Notification HUD (Capped at maxVisibleToasts = 3) -->
      <aside
        class="toast-hud-viewport"
        aria-live="polite"
        aria-label="Real-time priority toast notifications"
      >
        <div class="hud-header mono">
          <span>TOAST HUD ({{ queue.activeToasts().length }}/{{ queue.maxVisibleToasts() }} SLOTS)</span>
          <span>QUEUE: {{ queue.waitingQueue().length }} WAITING</span>
        </div>

        @for (toast of queue.activeToasts(); track toast.notification.id) {
          <div
            class="toast-card"
            [ngClass]="toast.notification.priority.toLowerCase()"
            (mouseenter)="queue.setToastHoverPause(toast.notification.id, true)"
            (mouseleave)="queue.setToastHoverPause(toast.notification.id, false)"
          >
            @if (toast.preemptedBanner) {
              <div class="preempt-banner">{{ toast.preemptedBanner }}</div>
            }
            <div class="toast-top">
              <span class="prio-chip" [ngClass]="toast.notification.priority.toLowerCase()">
                {{ toast.notification.priority }}
              </span>
              @if (toast.notification.occurrences > 1) {
                <span class="coalesce-chip">×{{ toast.notification.occurrences }} coalesced</span>
              }
              <span class="toast-paused-tag" *ngIf="toast.isPaused">PAUSED (Hover)</span>
              <button
                class="toast-close"
                (click)="queue.dismissToast(toast.notification.id)"
                aria-label="Dismiss toast"
              >
                ×
              </button>
            </div>
            <div class="toast-title">{{ toast.notification.title }}</div>
            <div class="toast-msg">{{ toast.notification.message }}</div>
            <div class="toast-footer">
              <span class="mono">{{ toast.notification.sourceMfe }}</span>
              <button
                class="toast-ack-btn"
                (click)="queue.acknowledgeNotification(toast.notification.id)"
              >
                Acknowledge
              </button>
            </div>
            <div class="toast-progress-track">
              <div
                class="toast-progress-bar"
                [style.width.%]="(toast.remainingMs / toast.totalDurationMs) * 100"
              ></div>
            </div>
          </div>
        }
      </aside>
    </div>
  `,
})
export class AppComponent {
  readonly shared = inject(SharedMfeContextService);
  readonly queue = inject(NotificationQueueService);
  readonly federation = inject(FederationRuntimeService);

  readonly viewMode = signal<WorkspaceViewMode>('COMPOSITE_GRID');
  readonly showArchMatrix = signal<boolean>(true);

  viewModeAsRemote(): RemoteId {
    const mode = this.viewMode();
    return mode === 'COMPOSITE_GRID' ? 'mfe-notification-studio' : mode;
  }

  onTenantChange(tenant: TenantId): void {
    this.shared.setTenant(tenant);
  }

  onEnvChange(env: EnvironmentId): void {
    this.shared.setEnvironment(env);
  }

  onRoleChange(role: GlobalRole): void {
    this.shared.setRole(role);
  }
}
