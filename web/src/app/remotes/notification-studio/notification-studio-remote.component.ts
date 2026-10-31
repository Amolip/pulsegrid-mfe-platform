import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import {
  NotificationPriority,
  NotificationQueueService,
} from '../../core/notification-queue/notification-queue.service';
import { SharedMfeContextService } from '../../core/shared-context/shared-mfe-context.service';

@Component({
  selector: 'app-notification-studio-remote',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    MatButtonModule,
    MatTabsModule,
  ],
  template: `
    <div class="remote-card notif-studio-remote">
      <div class="remote-header">
        <div>
          <span class="mfe-pill">REMOTE 1 · mfe-notification-studio:22.2.0</span>
          <h3>Real-Time UI Notification Priority Queue &amp; Deduplication Engine</h3>
          <p class="remote-sub">
            Solves the Frontend System Design Notification Queue problem: 4-Lane Priority Preemption,
            60s Fingerprint Coalescing (<code>dedupeKey</code>), Token-Bucket Rate Limiting, CDK Virtual-Scrolled Inbox, and Offline Outbox Replay.
          </p>
        </div>
        <div class="storm-actions">
          <button
            class="action-btn btn-danger"
            (click)="queue.simulateNotificationStorm('DUPLICATE_STORM_50')"
          >
            Simulate 50x Duplicate Storm (Coalesce Test)
          </button>
          <button
            class="action-btn btn-warn"
            (click)="queue.simulateNotificationStorm('P0_PREEMPTION_TEST')"
          >
            Trigger P0 Priority Preemption
          </button>
          <button
            class="action-btn btn-primary"
            (click)="queue.simulateNotificationStorm('MIXED_PRIORITY_FLOOD_25')"
          >
            Enqueue 20x Mixed P0–P3 Burst
          </button>
        </div>
      </div>

      <!-- Queue Pipeline Architecture Telemetry Strip -->
      <div class="pipeline-grid">
        <div class="stage-box">
          <span class="stage-step">STAGE 1 · INGEST &amp; FINGERPRINT</span>
          <div class="stage-val">{{ queue.totalIngested() }}</div>
          <div class="stage-meta">
            Window: <strong>{{ queue.coalesceWindowSec() }}s</strong> · Saved DOM Nodes:
            <strong class="text-emerald">{{ queue.coalescedDuplicatesSaved() }}</strong>
          </div>
        </div>

        <div class="stage-box">
          <span class="stage-step">STAGE 2 · 4-LANE PRIORITY HEAP</span>
          <div class="lane-pills">
            <span class="lane-badge p0">P0: {{ queue.queueLaneCounts().p0 }}</span>
            <span class="lane-badge p1">P1: {{ queue.queueLaneCounts().p1 }}</span>
            <span class="lane-badge p2">P2: {{ queue.queueLaneCounts().p2 }}</span>
            <span class="lane-badge p3">P3: {{ queue.queueLaneCounts().p3 }}</span>
          </div>
          <div class="stage-meta">
            Waiting in Heap: <strong>{{ queue.waitingQueue().length }}</strong> · Preemptions:
            <strong class="text-amber">{{ queue.preemptionsExecuted() }}</strong>
          </div>
        </div>

        <div class="stage-box">
          <span class="stage-step">STAGE 3 · TOKEN BUCKET &amp; HUD CAP</span>
          <div class="stage-val">
            {{ queue.activeToasts().length }} / {{ queue.maxVisibleToasts() }}
            <span class="unit-label">Active Toasts</span>
          </div>
          <div class="stage-meta">
            Tokens: <strong>{{ queue.availableTokens() }}/{{ queue.tokenBucketRatePerSec() }}s</strong>
            · DND Suppressed: <strong>{{ queue.suppressedByDndCount() }}</strong>
          </div>
        </div>

        <div class="stage-box">
          <span class="stage-step">STAGE 4 · OFFLINE MUTATION OUTBOX</span>
          <div class="stage-val" [class.text-amber]="queue.offlineOutbox().length > 0">
            {{ queue.offlineOutbox().length }}
            <span class="unit-label">Queued Acks</span>
          </div>
          <div class="stage-meta">
            Idempotent Replays: <strong class="text-cyan">{{ queue.replayedOutboxCount() }}</strong>
            @if (queue.offlineOutbox().length > 0) {
              <button class="mini-link-btn" (click)="queue.flushOfflineOutbox()">
                Replay Now
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Custom Notification Composer + Queue Policy Controls -->
      <div class="composer-bar">
        <div class="composer-inputs">
          <select [(ngModel)]="customPriority" class="ctrl-select" aria-label="Notification Priority">
            <option value="P0_CRITICAL">P0_CRITICAL (Preempts HUD)</option>
            <option value="P1_HIGH">P1_HIGH</option>
            <option value="P2_NORMAL">P2_NORMAL</option>
            <option value="P3_LOW">P3_LOW</option>
          </select>
          <input
            type="text"
            [(ngModel)]="customTitle"
            placeholder="Custom alert title..."
            class="ctrl-input"
          />
          <input
            type="text"
            [(ngModel)]="customDedupeKey"
            placeholder="dedupeKey (same key coalesces xN)"
            class="ctrl-input mono"
          />
          <button class="action-btn btn-accent" (click)="dispatchCustom()">
            Dispatch into Queue
          </button>
        </div>
        <div class="composer-toggles">
          <button
            class="action-btn btn-ghost"
            (click)="queue.seedBulkDatasetForVirtualScroll(1000)"
          >
            +1,000 Rows (Virtual Scroll Stress Test)
          </button>
          <button
            class="action-btn btn-ghost"
            (click)="queue.markAllAsReadOptimistic()"
          >
            Mark All Read (Optimistic)
          </button>
        </div>
      </div>

      <!-- Filter Bar & CDK Virtual Scroll Inbox -->
      <div class="inbox-toolbar">
        <div class="filter-pills">
          <button
            class="pill-btn"
            [class.active]="queue.inboxFilter() === 'ALL'"
            (click)="queue.inboxFilter.set('ALL')"
          >
            All ({{ queue.inboxNotifications().length }})
          </button>
          <button
            class="pill-btn"
            [class.active]="queue.inboxFilter() === 'UNREAD'"
            (click)="queue.inboxFilter.set('UNREAD')"
          >
            Unread ({{ queue.unreadCount() }})
          </button>
          <button
            class="pill-btn"
            [class.active]="queue.inboxFilter() === 'P0_CRITICAL'"
            (click)="queue.inboxFilter.set('P0_CRITICAL')"
          >
            P0 Critical ({{ queue.inboxLaneBreakdown().p0 }})
          </button>
          <button
            class="pill-btn"
            [class.active]="queue.inboxFilter() === 'COALESCED'"
            (click)="queue.inboxFilter.set('COALESCED')"
          >
            Coalesced Duplicates (xN)
          </button>
        </div>
        <span class="virtual-scroll-tag">
          CdkVirtualScrollViewport · 60fps Constant DOM Nodes
        </span>
      </div>

      <cdk-virtual-scroll-viewport itemSize="78" class="notif-viewport">
        <div
          *cdkVirtualFor="let item of queue.filteredInbox(); trackBy: trackById"
          class="notif-row"
          [class.unread]="!item.read"
          [class.priority-p0]="item.priority === 'P0_CRITICAL'"
        >
          <div class="notif-left">
            <span class="prio-chip" [ngClass]="item.priority.toLowerCase()">
              {{ item.priority }}
            </span>
            @if (item.occurrences > 1) {
              <span class="coalesce-chip" title="Coalesced duplicate occurrences">
                ×{{ item.occurrences }} coalesced
              </span>
            }
            <span class="source-chip mono">{{ item.sourceMfe }}</span>
          </div>

          <div class="notif-center">
            <div class="notif-title">
              {{ item.title }}
              @if (!item.read) {
                <span class="unread-dot"></span>
              }
            </div>
            <div class="notif-msg">{{ item.message }}</div>
            <div class="notif-meta mono">
              dedupeKey: {{ item.dedupeKey }} · env: {{ item.environment }}
            </div>
          </div>

          <div class="notif-right">
            @if (!item.acknowledged) {
              <button
                class="ack-btn"
                (click)="queue.acknowledgeNotification(item.id)"
              >
                {{ shared.isOfflineSimulated() ? 'Queue Offline Ack' : 'Acknowledge' }}
              </button>
            } @else {
              <span class="acked-label">Acknowledged</span>
            }
          </div>
        </div>
      </cdk-virtual-scroll-viewport>
    </div>
  `,
})
export class NotificationStudioRemoteComponent {
  readonly queue = inject(NotificationQueueService);
  readonly shared = inject(SharedMfeContextService);

  customPriority: NotificationPriority = 'P0_CRITICAL';
  customTitle = 'Payment GraphQL Gateway P99 Latency Breach (1,820ms)';
  customDedupeKey = 'gateway:payment-subgraph:p99-breach';

  dispatchCustom(): void {
    if (!this.customTitle.trim()) return;
    this.queue.ingestNotification({
      priority: this.customPriority,
      title: this.customTitle.trim(),
      message: `Dispatched manually from Notification Studio (${this.shared.activeEnvironment()}) with dedupeKey '${this.customDedupeKey}'.`,
      sourceMfe: 'mfe-notification-studio',
      category: 'CUSTOM_DISPATCH',
      dedupeKey: this.customDedupeKey.trim() || undefined,
    });
  }

  trackById(_index: number, item: { id: string }): string {
    return item.id;
  }
}
