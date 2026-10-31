import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedMfeContextService } from '../../core/shared-context/shared-mfe-context.service';
import { NotificationQueueService } from '../../core/notification-queue/notification-queue.service';

interface CostPoint {
  time: string;
  cloudUsd: number;
  aiTokenUsd: number;
  tokensPerSec: number;
}

@Component({
  selector: 'app-finops-telemetry-remote',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="remote-card finops-remote">
      <div class="remote-header">
        <div>
          <span class="mfe-pill pill-cyan">REMOTE 2 · mfe-finops-telemetry:22.2.1</span>
          <h3>Cloud &amp; AI Token FinOps Telemetry</h3>
          <p class="remote-sub">
            Reactive SVG Telemetry Stream subscribed to Host Shell Signal Bus
            (<code>{{ shared.activeTenant() }}</code> · <code>{{ shared.activeClusterShard() }}</code>).
          </p>
        </div>
        <div class="storm-actions">
          <button class="action-btn btn-danger" (click)="triggerAiTokenSpike()">
            Simulate LLM Token Burn Spike (+Emit P0 Alert)
          </button>
        </div>
      </div>

      <div class="finops-kpi-row">
        <div class="kpi-tile">
          <span class="kpi-label">CURRENT HOURLY BURN</span>
          <div class="kpi-value" [class.text-rose]="totalHourlyBurn() > budgetCeiling()">
            \${{ totalHourlyBurn().toFixed(1) }}/hr
          </div>
          <span class="kpi-sub">Ceiling: \${{ budgetCeiling() }}/hr</span>
        </div>
        <div class="kpi-tile">
          <span class="kpi-label">LLM TOKEN THROUGHPUT</span>
          <div class="kpi-value text-cyan">
            {{ latestPoint().tokensPerSec.toLocaleString() }} <span class="unit-label">tok/s</span>
          </div>
          <span class="kpi-sub">Claude 4 Sonnet + OpenAI Embeddings</span>
        </div>
        <div class="kpi-tile">
          <span class="kpi-label">BUDGET ALERT THRESHOLD</span>
          <div class="slider-wrap">
            <input
              type="range"
              min="220"
              max="550"
              step="10"
              [ngModel]="budgetCeiling()"
              (ngModelChange)="updateCeiling($event)"
            />
            <span class="mono">\${{ budgetCeiling() }}/hr</span>
          </div>
        </div>
      </div>

      <!-- Hardware-Accelerated Angular 22 Signal SVG Chart -->
      <div class="svg-chart-box">
        <svg viewBox="0 0 620 185" class="finops-svg" role="img" aria-label="Cloud and AI Spend Telemetry Chart">
          <defs>
            <linearGradient id="aiSpendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.42" />
              <stop offset="100%" stop-color="#f43f5e" stop-opacity="0.02" />
            </linearGradient>
            <linearGradient id="cloudSpendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.38" />
              <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.02" />
            </linearGradient>
          </defs>

          <!-- Horizontal Grid Lines -->
          <line x1="40" y1="30" x2="595" y2="30" stroke="#1e293b" stroke-dasharray="3 3" />
          <line x1="40" y1="80" x2="595" y2="80" stroke="#1e293b" stroke-dasharray="3 3" />
          <line x1="40" y1="130" x2="595" y2="130" stroke="#1e293b" stroke-dasharray="3 3" />

          <!-- Dynamic Budget Threshold Line -->
          <line
            x1="40"
            [attr.y1]="ceilingY()"
            x2="595"
            [attr.y2]="ceilingY()"
            stroke="#f59e0b"
            stroke-width="1.8"
            stroke-dasharray="6 4"
          />
          <text
            x="46"
            [attr.y]="ceilingY() - 5"
            fill="#fbbf24"
            font-size="10"
            font-family="JetBrains Mono"
          >
            Budget Ceiling (\${{ budgetCeiling() }}/hr)
          </text>

          <!-- Total Spend Area & Polyline -->
          <polygon [attr.points]="totalAreaPoints()" fill="url(#aiSpendGrad)" />
          <polyline
            [attr.points]="totalLinePoints()"
            fill="none"
            stroke="#f43f5e"
            stroke-width="2.6"
          />

          <!-- Cloud Spend Polyline -->
          <polyline
            [attr.points]="cloudLinePoints()"
            fill="none"
            stroke="#06b6d4"
            stroke-width="2.2"
          />

          <!-- Interactive Data Points -->
          @for (pt of chartCoordinates(); track pt.time) {
            <circle
              [attr.cx]="pt.x"
              [attr.cy]="pt.totalY"
              r="4.5"
              [attr.fill]="pt.totalUsd > budgetCeiling() ? '#f43f5e' : '#10b981'"
              stroke="#0f172a"
              stroke-width="1.5"
            />
            <text
              [attr.x]="pt.x"
              y="172"
              text-anchor="middle"
              fill="#94a3b8"
              font-size="10"
              font-family="JetBrains Mono"
            >
              {{ pt.time }}
            </text>
          }
        </svg>
      </div>

      <div class="service-breakdown-list">
        @for (svc of services(); track svc.name) {
          <div class="svc-row">
            <div>
              <span class="svc-name">{{ svc.name }}</span>
              <span class="svc-provider">{{ svc.provider }}</span>
            </div>
            <div class="svc-metrics">
              <span class="mono">\${{ svc.burnUsd.toFixed(1) }}/hr</span>
              <span
                class="anomaly-badge"
                [class.breach]="svc.state === 'BREACH'"
                [class.elevated]="svc.state === 'ELEVATED'"
              >
                {{ svc.state }} ({{ svc.delta }})
              </span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class FinOpsTelemetryRemoteComponent {
  readonly shared = inject(SharedMfeContextService);
  private readonly notificationQueue = inject(NotificationQueueService);

  readonly budgetCeiling = signal<number>(350);

  readonly series = signal<CostPoint[]>([
    { time: '10:10', cloudUsd: 162, aiTokenUsd: 98, tokensPerSec: 14200 },
    { time: '10:20', cloudUsd: 168, aiTokenUsd: 122, tokensPerSec: 18400 },
    { time: '10:30', cloudUsd: 174, aiTokenUsd: 158, tokensPerSec: 24900 },
    { time: '10:40', cloudUsd: 181, aiTokenUsd: 196, tokensPerSec: 31800 },
    { time: '10:50', cloudUsd: 186, aiTokenUsd: 232.4, tokensPerSec: 38900 },
    { time: '11:00', cloudUsd: 190, aiTokenUsd: 248.0, tokensPerSec: 42600 },
  ]);

  readonly services = signal([
    {
      name: 'ai-agent-orchestrator',
      provider: 'Anthropic Claude 4 Sonnet',
      burnUsd: 178.4,
      delta: '+184%',
      state: 'BREACH',
    },
    {
      name: 'semantic-vector-indexer',
      provider: 'OpenAI Embeddings + Pinecone',
      burnUsd: 69.6,
      delta: '+42%',
      state: 'ELEVATED',
    },
    {
      name: 'eks-graphql-mesh-cluster',
      provider: 'AWS EKS (c7g.4xlarge)',
      burnUsd: 122.0,
      delta: '+8%',
      state: 'NORMAL',
    },
  ]);

  readonly latestPoint = computed(() => {
    const list = this.series();
    return list[list.length - 1];
  });

  readonly totalHourlyBurn = computed(() => {
    const pt = this.latestPoint();
    return pt.cloudUsd + pt.aiTokenUsd;
  });

  readonly ceilingY = computed(() => {
    const maxUsd = 600;
    const ratio = Math.min(1, Math.max(0, this.budgetCeiling() / maxUsd));
    return Math.round(150 - ratio * 125);
  });

  readonly chartCoordinates = computed(() => {
    const pts = this.series();
    const maxUsd = 600;
    return pts.map((pt, i) => {
      const x = 60 + i * (510 / Math.max(1, pts.length - 1));
      const totalUsd = pt.cloudUsd + pt.aiTokenUsd;
      const totalY = Math.round(150 - Math.min(1, totalUsd / maxUsd) * 125);
      const cloudY = Math.round(150 - Math.min(1, pt.cloudUsd / maxUsd) * 125);
      return {
        ...pt,
        x,
        totalUsd,
        totalY,
        cloudY,
      };
    });
  });

  readonly totalLinePoints = computed(() =>
    this.chartCoordinates()
      .map((c) => `${c.x},${c.totalY}`)
      .join(' '),
  );

  readonly totalAreaPoints = computed(() => {
    const coords = this.chartCoordinates();
    if (coords.length === 0) return '';
    const firstX = coords[0].x;
    const lastX = coords[coords.length - 1].x;
    return `${firstX},150 ${this.totalLinePoints()} ${lastX},150`;
  });

  readonly cloudLinePoints = computed(() =>
    this.chartCoordinates()
      .map((c) => `${c.x},${c.cloudY}`)
      .join(' '),
  );

  updateCeiling(value: number): void {
    this.budgetCeiling.set(Number(value));
    if (this.totalHourlyBurn() > Number(value)) {
      this.notificationQueue.ingestNotification({
        priority: 'P1_HIGH',
        title: `FinOps Threshold Lowered Below Current Burn ($${value}/hr)`,
        message: `Current spend ($${this.totalHourlyBurn().toFixed(1)}/hr) exceeds new threshold on ${this.shared.activeEnvironment()}.`,
        sourceMfe: 'mfe-finops-telemetry',
        category: 'THRESHOLD_BREACH',
        dedupeKey: `finops:ceiling-breach:${this.shared.activeEnvironment()}`,
      });
    }
  }

  triggerAiTokenSpike(): void {
    const nextAi = +(this.latestPoint().aiTokenUsd + 48.5).toFixed(1);
    const nextTokens = this.latestPoint().tokensPerSec + 9400;
    const timestamp = new Date().toTimeString().slice(0, 5);

    this.series.update((prev) => [
      ...prev.slice(1),
      {
        time: timestamp,
        cloudUsd: 194,
        aiTokenUsd: nextAi,
        tokensPerSec: nextTokens,
      },
    ]);

    const total = (194 + nextAi).toFixed(1);

    // Emit across the Shared Signal Bus AND into the Notification Priority Queue
    this.shared.publishBusEvent(
      'mfe-finops-telemetry',
      'mfe-notification-studio',
      'BUDGET_BREACH_EMITTED',
      `AI Token spike emitted from Remote 2 ($${total}/hr, ${nextTokens.toLocaleString()} tok/s).`,
    );

    this.notificationQueue.ingestNotification({
      priority: 'P0_CRITICAL',
      title: `P0 FinOps Breach: AI Burn Hit $${total}/hr (${nextTokens.toLocaleString()} tok/s)`,
      message: `Cross-MFE Signal event emitted from mfe-finops-telemetry on ${this.shared.activeTenant()}.`,
      sourceMfe: 'mfe-finops-telemetry',
      category: 'BUDGET_BREACH',
      dedupeKey: `finops-spike:${this.shared.activeTenant()}:claude-sonnet`,
    });
  }
}
