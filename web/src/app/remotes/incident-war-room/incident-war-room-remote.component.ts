import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedMfeContextService } from '../../core/shared-context/shared-mfe-context.service';
import {
  NotificationPriority,
  NotificationQueueService,
} from '../../core/notification-queue/notification-queue.service';

export interface WarRoomIncident {
  id: string;
  severity: 'SEV1' | 'SEV2' | 'SEV3';
  title: string;
  service: string;
  assignee: string;
}

@Component({
  selector: 'app-incident-war-room-remote',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    MatStepperModule,
    MatTabsModule,
  ],
  template: `
    <div class="remote-card war-room-remote">
      <div class="remote-header">
        <div>
          <span class="mfe-pill pill-amber">REMOTE 3 · mfe-incident-war-room:22.2.0</span>
          <h3>Incident War-Room (CDK Drag-Drop) &amp; Server-Driven UI (SDUI) Engine</h3>
          <p class="remote-sub">
            Drag incident cards between triage lanes to trigger optimistic GraphQL mutations and cross-MFE notifications, or configure dynamic SDUI escalation rules via Angular Material <code>MatStepper</code>.
          </p>
        </div>
        <div class="mode-tabs">
          <button
            class="pill-btn"
            [class.active]="activeTab() === 'KANBAN'"
            (click)="activeTab.set('KANBAN')"
          >
            CDK Drag &amp; Drop Triage Board
          </button>
          <button
            class="pill-btn"
            [class.active]="activeTab() === 'SDUI'"
            (click)="activeTab.set('SDUI')"
          >
            Server-Driven UI (MatStepper Rule Engine)
          </button>
        </div>
      </div>

      @if (activeTab() === 'KANBAN') {
        <div class="kanban-grid" cdkDropListGroup>
          <!-- Column 1: TRIGGERED -->
          <div class="kanban-col">
            <div class="col-header triggered">
              <span>TRIGGERED (P0)</span>
              <span class="col-count">{{ triggeredList().length }}</span>
            </div>
            <div
              cdkDropList
              [cdkDropListData]="triggeredList()"
              class="drop-zone"
              (cdkDropListDropped)="onDrop($event, 'TRIGGERED')"
            >
              @for (item of triggeredList(); track item.id) {
                <div class="incident-card" cdkDrag>
                  <div class="inc-top">
                    <span class="sev-badge" [ngClass]="item.severity.toLowerCase()">
                      {{ item.severity }}
                    </span>
                    <span class="mono inc-id">{{ item.id }}</span>
                  </div>
                  <div class="inc-title">{{ item.title }}</div>
                  <div class="inc-meta">
                    <span>{{ item.service }}</span>
                    <span>Owner: {{ item.assignee }}</span>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Column 2: INVESTIGATING -->
          <div class="kanban-col">
            <div class="col-header investigating">
              <span>INVESTIGATING</span>
              <span class="col-count">{{ investigatingList().length }}</span>
            </div>
            <div
              cdkDropList
              [cdkDropListData]="investigatingList()"
              class="drop-zone"
              (cdkDropListDropped)="onDrop($event, 'INVESTIGATING')"
            >
              @for (item of investigatingList(); track item.id) {
                <div class="incident-card" cdkDrag>
                  <div class="inc-top">
                    <span class="sev-badge" [ngClass]="item.severity.toLowerCase()">
                      {{ item.severity }}
                    </span>
                    <span class="mono inc-id">{{ item.id }}</span>
                  </div>
                  <div class="inc-title">{{ item.title }}</div>
                  <div class="inc-meta">
                    <span>{{ item.service }}</span>
                    <span>Owner: {{ item.assignee }}</span>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Column 3: MITIGATED -->
          <div class="kanban-col">
            <div class="col-header mitigated">
              <span>MITIGATED / RESOLVED</span>
              <span class="col-count">{{ mitigatedList().length }}</span>
            </div>
            <div
              cdkDropList
              [cdkDropListData]="mitigatedList()"
              class="drop-zone"
              (cdkDropListDropped)="onDrop($event, 'MITIGATED')"
            >
              @for (item of mitigatedList(); track item.id) {
                <div class="incident-card" cdkDrag>
                  <div class="inc-top">
                    <span class="sev-badge" [ngClass]="item.severity.toLowerCase()">
                      {{ item.severity }}
                    </span>
                    <span class="mono inc-id">{{ item.id }}</span>
                  </div>
                  <div class="inc-title">{{ item.title }}</div>
                  <div class="inc-meta">
                    <span>{{ item.service }}</span>
                    <span>Owner: {{ item.assignee }}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      } @else {
        <!-- Server-Driven UI (SDUI) Dynamic Form rendered inside Angular Material MatStepper -->
        <div class="sdui-container">
          <div class="sdui-banner">
            <span class="mono">SDUI GraphQL Schema -> Dynamic Angular Material Stepper</span>
            <span>Rules compiled at runtime and dispatched into the Notification Queue</span>
          </div>

          <mat-stepper [linear]="false" class="pulsegrid-stepper">
            <mat-step label="1. Telemetry Source & Condition">
              <div class="sdui-step-body">
                <label class="sdui-field">
                  <span>Escalation Rule Name *</span>
                  <input type="text" [(ngModel)]="sduiRuleName" class="ctrl-input" />
                </label>
                <label class="sdui-field">
                  <span>Source Federated Remote *</span>
                  <select [(ngModel)]="sduiSourceMfe" class="ctrl-select">
                    <option value="mfe-finops-telemetry">mfe-finops-telemetry</option>
                    <option value="mfe-incident-war-room">mfe-incident-war-room</option>
                    <option value="mfe-notification-studio">mfe-notification-studio</option>
                  </select>
                </label>
              </div>
            </mat-step>

            <mat-step label="2. Queue Priority & Coalescing Policy">
              <div class="sdui-step-body">
                <label class="sdui-field">
                  <span>Target Priority Queue Lane *</span>
                  <select [(ngModel)]="sduiPriority" class="ctrl-select">
                    <option value="P0_CRITICAL">P0_CRITICAL (Preempt Active Toasts)</option>
                    <option value="P1_HIGH">P1_HIGH</option>
                    <option value="P2_NORMAL">P2_NORMAL</option>
                  </select>
                </label>
                <label class="sdui-field">
                  <span>Deduplication Key Template *</span>
                  <input type="text" [(ngModel)]="sduiDedupeKey" class="ctrl-input mono" />
                </label>
                <button class="action-btn btn-accent" (click)="deploySduiRule()">
                  Deploy SDUI Rule &amp; Emit Test Alert
                </button>
              </div>
            </mat-step>
          </mat-stepper>
        </div>
      }
    </div>
  `,
})
export class IncidentWarRoomRemoteComponent {
  readonly shared = inject(SharedMfeContextService);
  private readonly notificationQueue = inject(NotificationQueueService);

  readonly activeTab = signal<'KANBAN' | 'SDUI'>('KANBAN');

  readonly triggeredList = signal<WarRoomIncident[]>([
    {
      id: 'INC-4091',
      severity: 'SEV1',
      title: 'Recursive LLM Agent Token Spike on Payment Copilot',
      service: 'ai-gateway-subgraph',
      assignee: 'Amol P.',
    },
    {
      id: 'INC-4092',
      severity: 'SEV1',
      title: 'Connection Pool Exhaustion on Primary Ledger Replica',
      service: 'ledger-graphql-api',
      assignee: 'Vikram D.',
    },
  ]);

  readonly investigatingList = signal<WarRoomIncident[]>([
    {
      id: 'INC-4090',
      severity: 'SEV1',
      title: 'Redis Cluster Failover Causing Notification Storm',
      service: 'realtime-pubsub-broker',
      assignee: 'Priya S.',
    },
  ]);

  readonly mitigatedList = signal<WarRoomIncident[]>([
    {
      id: 'INC-4088',
      severity: 'SEV2',
      title: 'Remote Bundle CDN Edge Cache Miss Spike in EU-Central',
      service: 'mfe-finops-telemetry',
      assignee: 'Rohan K.',
    },
  ]);

  // SDUI Form state
  sduiRuleName = 'AutomatedSEV1PagerEscalation';
  sduiSourceMfe = 'mfe-incident-war-room';
  sduiPriority: NotificationPriority = 'P0_CRITICAL';
  sduiDedupeKey = 'sdui:sev1:pager-escalation';

  onDrop(
    event: CdkDragDrop<WarRoomIncident[]>,
    targetStatus: 'TRIGGERED' | 'INVESTIGATING' | 'MITIGATED',
  ): void {
    if (event.previousContainer === event.container) {
      const copy = [...event.container.data];
      moveItemInArray(copy, event.previousIndex, event.currentIndex);
      this.setListByStatus(targetStatus, copy);
      return;
    }

    const prevCopy = [...event.previousContainer.data];
    const currCopy = [...event.container.data];
    transferArrayItem(
      prevCopy,
      currCopy,
      event.previousIndex,
      event.currentIndex,
    );

    // Update source & target signals
    this.syncAllLists(event.previousContainer.data, prevCopy);
    this.setListByStatus(targetStatus, currCopy);

    const movedItem = currCopy[event.currentIndex];
    if (!movedItem) return;

    this.shared.publishBusEvent(
      'mfe-incident-war-room',
      'mfe-notification-studio',
      'INCIDENT_STATUS_MUTATED',
      `Incident ${movedItem.id} dragged to ${targetStatus} via Angular CDK Drag & Drop.`,
    );

    this.notificationQueue.ingestNotification({
      priority: targetStatus === 'TRIGGERED' ? 'P0_CRITICAL' : 'P1_HIGH',
      title: `Incident ${movedItem.id} -> ${targetStatus}`,
      message: `${movedItem.title} (${movedItem.service}) moved to ${targetStatus}.`,
      sourceMfe: 'mfe-incident-war-room',
      category: 'INCIDENT_TRIAGE',
      dedupeKey: `incident:${movedItem.id}:${targetStatus}`,
    });
  }

  deploySduiRule(): void {
    this.shared.publishBusEvent(
      'mfe-incident-war-room',
      'ALL_REMOTES',
      'SDUI_RULE_DEPLOYED',
      `Deployed Server-Driven Rule '${this.sduiRuleName}' targeting lane ${this.sduiPriority}.`,
    );

    this.notificationQueue.ingestNotification({
      priority: this.sduiPriority,
      title: `[SDUI Rule Active] ${this.sduiRuleName}`,
      message: `Server-Driven UI rule compiled for ${this.sduiSourceMfe} with dedupeKey '${this.sduiDedupeKey}'.`,
      sourceMfe: this.sduiSourceMfe,
      category: 'SDUI_AUTOMATION',
      dedupeKey: this.sduiDedupeKey,
    });
  }

  private syncAllLists(
    originalRef: WarRoomIncident[],
    updated: WarRoomIncident[],
  ): void {
    if (originalRef === this.triggeredList()) this.triggeredList.set(updated);
    else if (originalRef === this.investigatingList())
      this.investigatingList.set(updated);
    else if (originalRef === this.mitigatedList())
      this.mitigatedList.set(updated);
  }

  private setListByStatus(
    status: 'TRIGGERED' | 'INVESTIGATING' | 'MITIGATED',
    updated: WarRoomIncident[],
  ): void {
    if (status === 'TRIGGERED') this.triggeredList.set(updated);
    else if (status === 'INVESTIGATING') this.investigatingList.set(updated);
    else this.mitigatedList.set(updated);
  }
}
