import {
  CommonModule,
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NotificationQueueService,
  RangeValueAccessor,
  SharedMfeContextService
} from "./chunk-777GOC3Q.js";
import {
  Component,
  __spreadProps,
  __spreadValues,
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵcontrol,
  ɵɵcontrolCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-DTYMJ4NN.js";

// src/app/remotes/finops-telemetry/finops-telemetry-remote.component.ts
var _forTrack0 = ($index, $item) => $item.time;
var _forTrack1 = ($index, $item) => $item.name;
function FinOpsTelemetryRemoteComponent_For_61_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "circle", 34);
    \u0275\u0275elementStart(1, "text", 35);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pt_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275attribute("cx", pt_r1.x)("cy", pt_r1.totalY)("fill", pt_r1.totalUsd > ctx_r1.budgetCeiling() ? "#f43f5e" : "#10b981");
    \u0275\u0275advance();
    \u0275\u0275attribute("x", pt_r1.x);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", pt_r1.time, " ");
  }
}
function FinOpsTelemetryRemoteComponent_For_64_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 33)(1, "div")(2, "span", 36);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 37);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 38)(7, "span", 15);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 39);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const svc_r3 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(svc_r3.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(svc_r3.provider);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("$", svc_r3.burnUsd.toFixed(1), "/hr");
    \u0275\u0275advance();
    \u0275\u0275classProp("breach", svc_r3.state === "BREACH")("elevated", svc_r3.state === "ELEVATED");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", svc_r3.state, " (", svc_r3.delta, ") ");
  }
}
var FinOpsTelemetryRemoteComponent = class _FinOpsTelemetryRemoteComponent {
  shared = inject(SharedMfeContextService);
  notificationQueue = inject(NotificationQueueService);
  budgetCeiling = signal(
    350,
    ...ngDevMode ? [{ debugName: "budgetCeiling" }] : (
      /* istanbul ignore next */
      []
    )
  );
  series = signal(
    [
      { time: "10:10", cloudUsd: 162, aiTokenUsd: 98, tokensPerSec: 14200 },
      { time: "10:20", cloudUsd: 168, aiTokenUsd: 122, tokensPerSec: 18400 },
      { time: "10:30", cloudUsd: 174, aiTokenUsd: 158, tokensPerSec: 24900 },
      { time: "10:40", cloudUsd: 181, aiTokenUsd: 196, tokensPerSec: 31800 },
      { time: "10:50", cloudUsd: 186, aiTokenUsd: 232.4, tokensPerSec: 38900 },
      { time: "11:00", cloudUsd: 190, aiTokenUsd: 248, tokensPerSec: 42600 }
    ],
    ...ngDevMode ? [{ debugName: "series" }] : (
      /* istanbul ignore next */
      []
    )
  );
  services = signal(
    [
      {
        name: "ai-agent-orchestrator",
        provider: "Anthropic Claude 4 Sonnet",
        burnUsd: 178.4,
        delta: "+184%",
        state: "BREACH"
      },
      {
        name: "semantic-vector-indexer",
        provider: "OpenAI Embeddings + Pinecone",
        burnUsd: 69.6,
        delta: "+42%",
        state: "ELEVATED"
      },
      {
        name: "eks-graphql-mesh-cluster",
        provider: "AWS EKS (c7g.4xlarge)",
        burnUsd: 122,
        delta: "+8%",
        state: "NORMAL"
      }
    ],
    ...ngDevMode ? [{ debugName: "services" }] : (
      /* istanbul ignore next */
      []
    )
  );
  latestPoint = computed(
    () => {
      const list = this.series();
      return list[list.length - 1];
    },
    ...ngDevMode ? [{ debugName: "latestPoint" }] : (
      /* istanbul ignore next */
      []
    )
  );
  totalHourlyBurn = computed(
    () => {
      const pt = this.latestPoint();
      return pt.cloudUsd + pt.aiTokenUsd;
    },
    ...ngDevMode ? [{ debugName: "totalHourlyBurn" }] : (
      /* istanbul ignore next */
      []
    )
  );
  ceilingY = computed(
    () => {
      const maxUsd = 600;
      const ratio = Math.min(1, Math.max(0, this.budgetCeiling() / maxUsd));
      return Math.round(150 - ratio * 125);
    },
    ...ngDevMode ? [{ debugName: "ceilingY" }] : (
      /* istanbul ignore next */
      []
    )
  );
  chartCoordinates = computed(
    () => {
      const pts = this.series();
      const maxUsd = 600;
      return pts.map((pt, i) => {
        const x = 60 + i * (510 / Math.max(1, pts.length - 1));
        const totalUsd = pt.cloudUsd + pt.aiTokenUsd;
        const totalY = Math.round(150 - Math.min(1, totalUsd / maxUsd) * 125);
        const cloudY = Math.round(150 - Math.min(1, pt.cloudUsd / maxUsd) * 125);
        return __spreadProps(__spreadValues({}, pt), {
          x,
          totalUsd,
          totalY,
          cloudY
        });
      });
    },
    ...ngDevMode ? [{ debugName: "chartCoordinates" }] : (
      /* istanbul ignore next */
      []
    )
  );
  totalLinePoints = computed(
    () => this.chartCoordinates().map((c) => `${c.x},${c.totalY}`).join(" "),
    ...ngDevMode ? [{ debugName: "totalLinePoints" }] : (
      /* istanbul ignore next */
      []
    )
  );
  totalAreaPoints = computed(
    () => {
      const coords = this.chartCoordinates();
      if (coords.length === 0)
        return "";
      const firstX = coords[0].x;
      const lastX = coords[coords.length - 1].x;
      return `${firstX},150 ${this.totalLinePoints()} ${lastX},150`;
    },
    ...ngDevMode ? [{ debugName: "totalAreaPoints" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cloudLinePoints = computed(
    () => this.chartCoordinates().map((c) => `${c.x},${c.cloudY}`).join(" "),
    ...ngDevMode ? [{ debugName: "cloudLinePoints" }] : (
      /* istanbul ignore next */
      []
    )
  );
  updateCeiling(value) {
    this.budgetCeiling.set(Number(value));
    if (this.totalHourlyBurn() > Number(value)) {
      this.notificationQueue.ingestNotification({
        priority: "P1_HIGH",
        title: `FinOps Threshold Lowered Below Current Burn ($${value}/hr)`,
        message: `Current spend ($${this.totalHourlyBurn().toFixed(1)}/hr) exceeds new threshold on ${this.shared.activeEnvironment()}.`,
        sourceMfe: "mfe-finops-telemetry",
        category: "THRESHOLD_BREACH",
        dedupeKey: `finops:ceiling-breach:${this.shared.activeEnvironment()}`
      });
    }
  }
  triggerAiTokenSpike() {
    const nextAi = +(this.latestPoint().aiTokenUsd + 48.5).toFixed(1);
    const nextTokens = this.latestPoint().tokensPerSec + 9400;
    const timestamp = (/* @__PURE__ */ new Date()).toTimeString().slice(0, 5);
    this.series.update((prev) => [
      ...prev.slice(1),
      {
        time: timestamp,
        cloudUsd: 194,
        aiTokenUsd: nextAi,
        tokensPerSec: nextTokens
      }
    ]);
    const total = (194 + nextAi).toFixed(1);
    this.shared.publishBusEvent("mfe-finops-telemetry", "mfe-notification-studio", "BUDGET_BREACH_EMITTED", `AI Token spike emitted from Remote 2 ($${total}/hr, ${nextTokens.toLocaleString()} tok/s).`);
    this.notificationQueue.ingestNotification({
      priority: "P0_CRITICAL",
      title: `P0 FinOps Breach: AI Burn Hit $${total}/hr (${nextTokens.toLocaleString()} tok/s)`,
      message: `Cross-MFE Signal event emitted from mfe-finops-telemetry on ${this.shared.activeTenant()}.`,
      sourceMfe: "mfe-finops-telemetry",
      category: "BUDGET_BREACH",
      dedupeKey: `finops-spike:${this.shared.activeTenant()}:claude-sonnet`
    });
  }
  static \u0275fac = function FinOpsTelemetryRemoteComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FinOpsTelemetryRemoteComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FinOpsTelemetryRemoteComponent, selectors: [["app-finops-telemetry-remote"]], decls: 65, vars: 16, consts: [[1, "remote-card", "finops-remote"], [1, "remote-header"], [1, "mfe-pill", "pill-cyan"], [1, "remote-sub"], [1, "storm-actions"], [1, "action-btn", "btn-danger", 3, "click"], [1, "finops-kpi-row"], [1, "kpi-tile"], [1, "kpi-label"], [1, "kpi-value"], [1, "kpi-sub"], [1, "kpi-value", "text-cyan"], [1, "unit-label"], [1, "slider-wrap"], ["type", "range", "min", "220", "max", "550", "step", "10", 3, "ngModelChange", "ngModel"], [1, "mono"], [1, "svg-chart-box"], ["viewBox", "0 0 620 185", "role", "img", "aria-label", "Cloud and AI Spend Telemetry Chart", 1, "finops-svg"], ["id", "aiSpendGrad", "x1", "0", "y1", "0", "x2", "0", "y2", "1"], ["offset", "0%", "stop-color", "#f43f5e", "stop-opacity", "0.42"], ["offset", "100%", "stop-color", "#f43f5e", "stop-opacity", "0.02"], ["id", "cloudSpendGrad", "x1", "0", "y1", "0", "x2", "0", "y2", "1"], ["offset", "0%", "stop-color", "#06b6d4", "stop-opacity", "0.38"], ["offset", "100%", "stop-color", "#06b6d4", "stop-opacity", "0.02"], ["x1", "40", "y1", "30", "x2", "595", "y2", "30", "stroke", "#1e293b", "stroke-dasharray", "3 3"], ["x1", "40", "y1", "80", "x2", "595", "y2", "80", "stroke", "#1e293b", "stroke-dasharray", "3 3"], ["x1", "40", "y1", "130", "x2", "595", "y2", "130", "stroke", "#1e293b", "stroke-dasharray", "3 3"], ["x1", "40", "x2", "595", "stroke", "#f59e0b", "stroke-width", "1.8", "stroke-dasharray", "6 4"], ["x", "46", "fill", "#fbbf24", "font-size", "10", "font-family", "JetBrains Mono"], ["fill", "url(#aiSpendGrad)"], ["fill", "none", "stroke", "#f43f5e", "stroke-width", "2.6"], ["fill", "none", "stroke", "#06b6d4", "stroke-width", "2.2"], [1, "service-breakdown-list"], [1, "svc-row"], ["r", "4.5", "stroke", "#0f172a", "stroke-width", "1.5"], ["y", "172", "text-anchor", "middle", "fill", "#94a3b8", "font-size", "10", "font-family", "JetBrains Mono"], [1, "svc-name"], [1, "svc-provider"], [1, "svc-metrics"], [1, "anomaly-badge"]], template: function FinOpsTelemetryRemoteComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "span", 2);
      \u0275\u0275text(4, "REMOTE 2 \xB7 mfe-finops-telemetry:22.2.1");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "h3");
      \u0275\u0275text(6, "Cloud & AI Token FinOps Telemetry");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p", 3);
      \u0275\u0275text(8, " Reactive SVG Telemetry Stream subscribed to Host Shell Signal Bus (");
      \u0275\u0275elementStart(9, "code");
      \u0275\u0275text(10);
      \u0275\u0275elementEnd();
      \u0275\u0275text(11, " \xB7 ");
      \u0275\u0275elementStart(12, "code");
      \u0275\u0275text(13);
      \u0275\u0275elementEnd();
      \u0275\u0275text(14, "). ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "div", 4)(16, "button", 5);
      \u0275\u0275listener("click", function FinOpsTelemetryRemoteComponent_Template_button_click_16_listener() {
        return ctx.triggerAiTokenSpike();
      });
      \u0275\u0275text(17, " Simulate LLM Token Burn Spike (+Emit P0 Alert) ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(18, "div", 6)(19, "div", 7)(20, "span", 8);
      \u0275\u0275text(21, "CURRENT HOURLY BURN");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "div", 9);
      \u0275\u0275text(23);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "span", 10);
      \u0275\u0275text(25);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(26, "div", 7)(27, "span", 8);
      \u0275\u0275text(28, "LLM TOKEN THROUGHPUT");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "div", 11);
      \u0275\u0275text(30);
      \u0275\u0275elementStart(31, "span", 12);
      \u0275\u0275text(32, "tok/s");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(33, "span", 10);
      \u0275\u0275text(34, "Claude 4 Sonnet + OpenAI Embeddings");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(35, "div", 7)(36, "span", 8);
      \u0275\u0275text(37, "BUDGET ALERT THRESHOLD");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "div", 13)(39, "input", 14);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function FinOpsTelemetryRemoteComponent_Template_input_ngModelChange_39_listener($event) {
        return ctx.updateCeiling($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "span", 15);
      \u0275\u0275text(41);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(42, "div", 16);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(43, "svg", 17)(44, "defs")(45, "linearGradient", 18);
      \u0275\u0275element(46, "stop", 19)(47, "stop", 20);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(48, "linearGradient", 21);
      \u0275\u0275element(49, "stop", 22)(50, "stop", 23);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(51, "line", 24)(52, "line", 25)(53, "line", 26)(54, "line", 27);
      \u0275\u0275elementStart(55, "text", 28);
      \u0275\u0275text(56);
      \u0275\u0275elementEnd();
      \u0275\u0275element(57, "polygon", 29)(58, "polyline", 30)(59, "polyline", 31);
      \u0275\u0275repeaterCreate(60, FinOpsTelemetryRemoteComponent_For_61_Template, 3, 5, null, null, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(62, "div", 32);
      \u0275\u0275repeaterCreate(63, FinOpsTelemetryRemoteComponent_For_64_Template, 11, 9, "div", 33, _forTrack1);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate(ctx.shared.activeTenant());
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.shared.activeClusterShard());
      \u0275\u0275advance(9);
      \u0275\u0275classProp("text-rose", ctx.totalHourlyBurn() > ctx.budgetCeiling());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" $", ctx.totalHourlyBurn().toFixed(1), "/hr ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("Ceiling: $", ctx.budgetCeiling(), "/hr");
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1(" ", ctx.latestPoint().tokensPerSec.toLocaleString(), " ");
      \u0275\u0275advance(9);
      \u0275\u0275property("ngModel", ctx.budgetCeiling());
      \u0275\u0275control();
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("$", ctx.budgetCeiling(), "/hr");
      \u0275\u0275advance(13);
      \u0275\u0275attribute("y1", ctx.ceilingY())("y2", ctx.ceilingY());
      \u0275\u0275advance();
      \u0275\u0275attribute("y", ctx.ceilingY() - 5);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" Budget Ceiling ($", ctx.budgetCeiling(), "/hr) ");
      \u0275\u0275advance();
      \u0275\u0275attribute("points", ctx.totalAreaPoints());
      \u0275\u0275advance();
      \u0275\u0275attribute("points", ctx.totalLinePoints());
      \u0275\u0275advance();
      \u0275\u0275attribute("points", ctx.cloudLinePoints());
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.chartCoordinates());
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.services());
    }
  }, dependencies: [CommonModule, FormsModule, DefaultValueAccessor, RangeValueAccessor, NgControlStatus, NgModel], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FinOpsTelemetryRemoteComponent, [{
    type: Component,
    args: [{
      selector: "app-finops-telemetry-remote",
      standalone: true,
      imports: [CommonModule, FormsModule],
      template: `
    <div class="remote-card finops-remote">
      <div class="remote-header">
        <div>
          <span class="mfe-pill pill-cyan">REMOTE 2 \xB7 mfe-finops-telemetry:22.2.1</span>
          <h3>Cloud &amp; AI Token FinOps Telemetry</h3>
          <p class="remote-sub">
            Reactive SVG Telemetry Stream subscribed to Host Shell Signal Bus
            (<code>{{ shared.activeTenant() }}</code> \xB7 <code>{{ shared.activeClusterShard() }}</code>).
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
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FinOpsTelemetryRemoteComponent, { className: "FinOpsTelemetryRemoteComponent", filePath: "src/app/remotes/finops-telemetry/finops-telemetry-remote.component.ts", lineNumber: 170 });
})();
export {
  FinOpsTelemetryRemoteComponent
};
