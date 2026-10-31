import {
  DomRendererFactory2,
  bootstrapApplication,
  disableThrowOnSyntheticProps
} from "./chunk-MICHWVOH.js";
import {
  CommonModule,
  FormsModule,
  NgClass,
  NgComponentOutlet,
  NgControlStatus,
  NgIf,
  NgModel,
  NgSelectOption,
  NotificationQueueService,
  SelectControlValueAccessor,
  SharedMfeContextService,
  ɵNgSelectMultipleOption
} from "./chunk-777GOC3Q.js";
import {
  ANIMATION_MODULE_TYPE,
  ChangeDetectionScheduler,
  Component,
  DOCUMENT,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  NgZone,
  RendererFactory2,
  RuntimeError,
  __spreadProps,
  __spreadValues,
  computed,
  inject,
  input,
  makeEnvironmentProviders,
  performanceMarkFeature,
  provideZonelessChangeDetection,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontrol,
  ɵɵcontrolCreate,
  ɵɵdefer,
  ɵɵdeferOnImmediate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdomTemplate,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinvalidFactory,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3
} from "./chunk-DTYMJ4NN.js";

// ../../graphql-chaos-sandbox/web/node_modules/@angular/platform-browser/fesm2022/animations-async.mjs
var ANIMATION_PREFIX = "@";
var AsyncAnimationRendererFactory = class _AsyncAnimationRendererFactory {
  doc;
  delegate;
  zone;
  animationType;
  moduleImpl;
  _rendererFactoryPromise = null;
  scheduler = null;
  injector = inject(Injector);
  loadingSchedulerFn = inject(\u0275ASYNC_ANIMATION_LOADING_SCHEDULER_FN, {
    optional: true
  });
  _engine;
  constructor(doc, delegate, zone, animationType, moduleImpl) {
    this.doc = doc;
    this.delegate = delegate;
    this.zone = zone;
    this.animationType = animationType;
    this.moduleImpl = moduleImpl;
  }
  ngOnDestroy() {
    this._engine?.flush();
  }
  loadImpl() {
    const loadFn = () => this.moduleImpl ?? import("./chunk-TBBZXCDE.js").then((m) => m);
    let moduleImplPromise;
    if (this.loadingSchedulerFn) {
      moduleImplPromise = this.loadingSchedulerFn(loadFn);
    } else {
      moduleImplPromise = loadFn();
    }
    return moduleImplPromise.catch((e) => {
      throw new RuntimeError(5300, (typeof ngDevMode === "undefined" || ngDevMode) && "Async loading for animations package was enabled, but loading failed. Angular falls back to using regular rendering. No animations will be displayed and their styles won't be applied.");
    }).then(({
      \u0275createEngine,
      \u0275AnimationRendererFactory
    }) => {
      this._engine = \u0275createEngine(this.animationType, this.doc);
      const rendererFactory = new \u0275AnimationRendererFactory(this.delegate, this._engine, this.zone);
      this.delegate = rendererFactory;
      return rendererFactory;
    });
  }
  createRenderer(hostElement, rendererType) {
    const renderer = this.delegate.createRenderer(hostElement, rendererType);
    if (renderer.\u0275type === 0) {
      return renderer;
    }
    disableThrowOnSyntheticProps(renderer);
    const dynamicRenderer = new DynamicDelegationRenderer(renderer);
    if (rendererType?.data?.["animation"] && !this._rendererFactoryPromise) {
      this._rendererFactoryPromise = this.loadImpl();
    }
    this._rendererFactoryPromise?.then((animationRendererFactory) => {
      const animationRenderer = animationRendererFactory.createRenderer(hostElement, rendererType);
      dynamicRenderer.use(animationRenderer);
      this.scheduler ??= this.injector.get(ChangeDetectionScheduler, null, {
        optional: true
      });
      this.scheduler?.notify(10);
    }).catch((e) => {
      dynamicRenderer.use(renderer);
    });
    return dynamicRenderer;
  }
  begin() {
    this.delegate.begin?.();
  }
  end() {
    this.delegate.end?.();
  }
  whenRenderingDone() {
    return this.delegate.whenRenderingDone?.() ?? Promise.resolve();
  }
  componentReplaced(componentId) {
    this._engine?.flush();
    this.delegate.componentReplaced?.(componentId);
  }
  static \u0275fac = function AsyncAnimationRendererFactory_Factory(__ngFactoryType__) {
    \u0275\u0275invalidFactory();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _AsyncAnimationRendererFactory,
    factory: _AsyncAnimationRendererFactory.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AsyncAnimationRendererFactory, [{
    type: Injectable
  }], () => [{
    type: Document
  }, {
    type: RendererFactory2
  }, {
    type: NgZone
  }, {
    type: void 0
  }, {
    type: Promise
  }], null);
})();
var DynamicDelegationRenderer = class {
  delegate;
  replay = [];
  \u0275type = 1;
  constructor(delegate) {
    this.delegate = delegate;
  }
  use(impl) {
    this.delegate = impl;
    if (this.replay !== null) {
      for (const fn of this.replay) {
        fn(impl);
      }
      this.replay = null;
    }
  }
  get data() {
    return this.delegate.data;
  }
  destroy() {
    this.replay = null;
    this.delegate.destroy();
  }
  createElement(name, namespace) {
    return this.delegate.createElement(name, namespace);
  }
  createComment(value) {
    return this.delegate.createComment(value);
  }
  createText(value) {
    return this.delegate.createText(value);
  }
  get destroyNode() {
    return this.delegate.destroyNode;
  }
  appendChild(parent, newChild) {
    this.delegate.appendChild(parent, newChild);
  }
  insertBefore(parent, newChild, refChild, isMove) {
    this.delegate.insertBefore(parent, newChild, refChild, isMove);
  }
  removeChild(parent, oldChild, isHostElement, requireSynchronousElementRemoval) {
    this.delegate.removeChild(parent, oldChild, isHostElement, requireSynchronousElementRemoval);
  }
  selectRootElement(selectorOrNode, preserveContent) {
    return this.delegate.selectRootElement(selectorOrNode, preserveContent);
  }
  parentNode(node) {
    return this.delegate.parentNode(node);
  }
  nextSibling(node) {
    return this.delegate.nextSibling(node);
  }
  setAttribute(el, name, value, namespace) {
    this.delegate.setAttribute(el, name, value, namespace);
  }
  removeAttribute(el, name, namespace) {
    this.delegate.removeAttribute(el, name, namespace);
  }
  addClass(el, name) {
    this.delegate.addClass(el, name);
  }
  removeClass(el, name) {
    this.delegate.removeClass(el, name);
  }
  setStyle(el, style, value, flags) {
    this.delegate.setStyle(el, style, value, flags);
  }
  removeStyle(el, style, flags) {
    this.delegate.removeStyle(el, style, flags);
  }
  setProperty(el, name, value) {
    if (this.shouldReplay(name)) {
      this.replay.push((renderer) => renderer.setProperty(el, name, value));
    }
    this.delegate.setProperty(el, name, value);
  }
  setValue(node, value) {
    this.delegate.setValue(node, value);
  }
  listen(target, eventName, callback, options) {
    if (this.shouldReplay(eventName)) {
      this.replay.push((renderer) => renderer.listen(target, eventName, callback, options));
    }
    return this.delegate.listen(target, eventName, callback, options);
  }
  shouldReplay(propOrEventName) {
    return this.replay !== null && propOrEventName.startsWith(ANIMATION_PREFIX);
  }
};
var \u0275ASYNC_ANIMATION_LOADING_SCHEDULER_FN = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "async_animation_loading_scheduler_fn" : "");
function provideAnimationsAsync(type = "animations") {
  performanceMarkFeature("NgAsyncAnimations");
  if (false) {
    type = "noop";
  }
  return makeEnvironmentProviders([{
    provide: RendererFactory2,
    useFactory: () => {
      return new AsyncAnimationRendererFactory(inject(DOCUMENT), inject(DomRendererFactory2), inject(NgZone), type);
    }
  }, {
    provide: ANIMATION_MODULE_TYPE,
    useValue: type === "noop" ? "NoopAnimations" : "BrowserAnimations"
  }]);
}

// src/app/federation/federation-runtime.service.ts
var FederationRuntimeService = class _FederationRuntimeService {
  sharedContext = inject(SharedMfeContextService);
  notificationQueue = inject(NotificationQueueService);
  remotes = signal(
    [
      {
        remoteId: "mfe-notification-studio",
        displayName: "Notification Queue & Storm Studio",
        remoteEntryUrl: "http://localhost:4202/remoteEntry.json",
        exposedModule: "./NotificationStudioRemote",
        version: "22.2.0",
        owningSquad: "Platform Core & Messaging",
        requiredRoles: ["STAFF_ARCHITECT", "SRE_LEAD", "FINOPS_ANALYST"],
        status: "HEALTHY",
        bundleSizeKb: 64,
        avgHydrationMs: 14.2,
        circuitBreakerTripped: false
      },
      {
        remoteId: "mfe-finops-telemetry",
        displayName: "Cloud & AI Token FinOps Telemetry",
        remoteEntryUrl: "http://localhost:4203/remoteEntry.json",
        exposedModule: "./FinOpsTelemetryRemote",
        version: "22.2.1",
        owningSquad: "Cloud Economics & AI Infra",
        requiredRoles: ["STAFF_ARCHITECT", "FINOPS_ANALYST"],
        status: "HEALTHY",
        bundleSizeKb: 78,
        avgHydrationMs: 18.6,
        circuitBreakerTripped: false
      },
      {
        remoteId: "mfe-incident-war-room",
        displayName: "Incident War-Room & SDUI Rule Engine",
        remoteEntryUrl: "http://localhost:4204/remoteEntry.json",
        exposedModule: "./IncidentWarRoomRemote",
        version: "22.2.0",
        owningSquad: "Reliability & Chaos Engineering",
        requiredRoles: ["STAFF_ARCHITECT", "SRE_LEAD"],
        status: "HEALTHY",
        bundleSizeKb: 71,
        avgHydrationMs: 16.4,
        circuitBreakerTripped: false
      }
    ],
    ...ngDevMode ? [{ debugName: "remotes" }] : (
      /* istanbul ignore next */
      []
    )
  );
  authorizedRemotes = computed(
    () => {
      const role = this.sharedContext.activeRole();
      return this.remotes().filter((r) => r.requiredRoles.includes(role));
    },
    ...ngDevMode ? [{ debugName: "authorizedRemotes" }] : (
      /* istanbul ignore next */
      []
    )
  );
  isRemoteAuthorized(remoteId) {
    const role = this.sharedContext.activeRole();
    const target = this.remotes().find((r) => r.remoteId === remoteId);
    return !!target && target.requiredRoles.includes(role);
  }
  getRemoteDescriptor(remoteId) {
    return this.remotes().find((r) => r.remoteId === remoteId);
  }
  /**
   * Simulates a runtime crash / circuit breaker trip inside an individual Federated Remote
   * to demonstrate MFE Fault Isolation (Error Boundary) without crashing the Host Shell.
   */
  toggleRemoteCircuitBreaker(remoteId) {
    let updatedRemote;
    this.remotes.update((list) => list.map((r) => {
      if (r.remoteId !== remoteId)
        return r;
      const nextTripped = !r.circuitBreakerTripped;
      updatedRemote = __spreadProps(__spreadValues({}, r), {
        circuitBreakerTripped: nextTripped,
        status: nextTripped ? "CIRCUIT_OPEN" : "HEALTHY"
      });
      return updatedRemote;
    }));
    if (!updatedRemote)
      return;
    this.sharedContext.publishBusEvent("shell-host", remoteId, "REMOTE_CIRCUIT_TRIPPED", updatedRemote.circuitBreakerTripped ? `Circuit Breaker OPENED for ${remoteId}. Host Shell isolated fault and rendered fallback boundary.` : `Circuit Breaker CLOSED for ${remoteId}. Remote bundle re-hydrated cleanly.`);
    this.notificationQueue.ingestNotification({
      priority: updatedRemote.circuitBreakerTripped ? "P0_CRITICAL" : "P2_NORMAL",
      title: updatedRemote.circuitBreakerTripped ? `MFE Fault Isolated: ${updatedRemote.displayName} Crashed` : `MFE Recovered: ${updatedRemote.displayName} Re-mounted`,
      message: updatedRemote.circuitBreakerTripped ? `Error boundary caught unhandled remote exception in ${remoteId} (${updatedRemote.exposedModule}). Sibling remotes unaffected.` : `Remote ${remoteId} passed health check and resumed normal Signal reactivity.`,
      sourceMfe: "shell-host",
      category: "MFE_FAULT_ISOLATION",
      dedupeKey: `circuit:${remoteId}:${updatedRemote.circuitBreakerTripped ? "open" : "closed"}`
    });
  }
  /**
   * Dynamic runtime loader using ES dynamic import() (mirroring loadRemoteModule)
   */
  async loadRemoteComponent(remoteId) {
    if (remoteId === "mfe-notification-studio") {
      const m2 = await import("./chunk-WTRCO6IX.js");
      return m2.NotificationStudioRemoteComponent;
    }
    if (remoteId === "mfe-finops-telemetry") {
      const m2 = await import("./chunk-Y2VYR4TW.js");
      return m2.FinOpsTelemetryRemoteComponent;
    }
    const m = await import("./chunk-FXAAFET7.js");
    return m.IncidentWarRoomRemoteComponent;
  }
  static \u0275fac = function FederationRuntimeService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FederationRuntimeService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _FederationRuntimeService, factory: _FederationRuntimeService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FederationRuntimeService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/federation/federated-remote-slot.component.ts
function FederatedRemoteSlotComponent_Conditional_0_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10)(1, "h4");
    \u0275\u0275text(2, "RBAC Guard Blocked Remote Bundle Download");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, " Current role does not have permission to mount ");
    \u0275\u0275elementStart(5, "code");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275text(7, ". Required roles: ");
    \u0275\u0275elementStart(8, "code");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275text(10, ". ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(meta_r3.remoteId);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(meta_r3.requiredRoles.join(", "));
  }
}
function FederatedRemoteSlotComponent_Conditional_0_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 13);
    \u0275\u0275text(2, "MFE ERROR BOUNDARY ACTIVE \xB7 CIRCUIT_OPEN");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h4");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p")(6, "code");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275text(8, " threw a simulated runtime exception. The Host Shell and sibling Micro-Frontends remain ");
    \u0275\u0275elementStart(9, "strong");
    \u0275\u0275text(10, "100% operational");
    \u0275\u0275elementEnd();
    \u0275\u0275text(11, ". ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "button", 14);
    \u0275\u0275listener("click", function FederatedRemoteSlotComponent_Conditional_0_Conditional_14_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.federation.toggleRemoteCircuitBreaker(ctx_r1.remoteId()));
    });
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Isolated Remote Failure in ", meta_r3.displayName);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(meta_r3.remoteEntryUrl);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" Reset Circuit Breaker & Remount ", meta_r3.remoteId, " ");
  }
}
function FederatedRemoteSlotComponent_Conditional_0_Conditional_15_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function FederatedRemoteSlotComponent_Conditional_0_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, FederatedRemoteSlotComponent_Conditional_0_Conditional_15_ng_container_0_Template, 1, 0, "ng-container", 15);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngComponentOutlet", ctx_r1.remoteComponent());
  }
}
function FederatedRemoteSlotComponent_Conditional_0_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275text(1, " Streaming remote chunk ");
    \u0275\u0275elementStart(2, "code");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, "... ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const meta_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(meta_r3.remoteEntryUrl);
  }
}
function FederatedRemoteSlotComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div", 3);
    \u0275\u0275element(3, "span", 4);
    \u0275\u0275elementStart(4, "span", 5);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 6);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 7)(9, "span", 8);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "button", 9);
    \u0275\u0275listener("click", function FederatedRemoteSlotComponent_Conditional_0_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.federation.toggleRemoteCircuitBreaker(ctx_r1.remoteId()));
    });
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(13, FederatedRemoteSlotComponent_Conditional_0_Conditional_13_Template, 11, 2, "div", 10)(14, FederatedRemoteSlotComponent_Conditional_0_Conditional_14_Template, 14, 3, "div", 11)(15, FederatedRemoteSlotComponent_Conditional_0_Conditional_15_Template, 1, 1, "ng-container")(16, FederatedRemoteSlotComponent_Conditional_0_Conditional_16_Template, 5, 1, "div", 12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const meta_r3 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("circuit-open", meta_r3.circuitBreakerTripped);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("healthy", !meta_r3.circuitBreakerTripped)("open", meta_r3.circuitBreakerTripped);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", meta_r3.remoteId, " (", meta_r3.exposedModule, ") ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3(" v", meta_r3.version, " \xB7 ", meta_r3.bundleSizeKb, "kB \xB7 ", meta_r3.avgHydrationMs, "ms hydration ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Squad: ", meta_r3.owningSquad);
    \u0275\u0275advance();
    \u0275\u0275classProp("recover", meta_r3.circuitBreakerTripped);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", meta_r3.circuitBreakerTripped ? "Close Circuit & Re-Hydrate Remote" : "Inject Remote Crash (Fault Boundary Test)", " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.isAuthorized() ? 13 : meta_r3.circuitBreakerTripped ? 14 : ctx_r1.remoteComponent() ? 15 : 16);
  }
}
var FederatedRemoteSlotComponent = class _FederatedRemoteSlotComponent {
  federation = inject(FederationRuntimeService);
  remoteId = input.required(
    ...ngDevMode ? [{ debugName: "remoteId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  remoteComponent = signal(
    null,
    ...ngDevMode ? [{ debugName: "remoteComponent" }] : (
      /* istanbul ignore next */
      []
    )
  );
  descriptor = computed(
    () => this.federation.getRemoteDescriptor(this.remoteId()),
    ...ngDevMode ? [{ debugName: "descriptor" }] : (
      /* istanbul ignore next */
      []
    )
  );
  isAuthorized = computed(
    () => this.federation.isRemoteAuthorized(this.remoteId()),
    ...ngDevMode ? [{ debugName: "isAuthorized" }] : (
      /* istanbul ignore next */
      []
    )
  );
  async ngOnInit() {
    const comp = await this.federation.loadRemoteComponent(this.remoteId());
    this.remoteComponent.set(comp);
  }
  static \u0275fac = function FederatedRemoteSlotComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FederatedRemoteSlotComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FederatedRemoteSlotComponent, selectors: [["app-federated-remote-slot"]], inputs: { remoteId: [1, "remoteId"] }, decls: 1, vars: 1, consts: [[1, "mfe-slot-boundary", 3, "circuit-open"], [1, "mfe-slot-boundary"], [1, "mfe-boundary-bar"], [1, "mfe-boundary-left"], [1, "status-dot"], [1, "mono", "mfe-entry-tag"], [1, "mfe-meta-chip"], [1, "mfe-boundary-right"], [1, "squad-label"], [1, "fault-btn", 3, "click"], [1, "mfe-rbac-locked"], ["role", "alert", 1, "mfe-fault-fallback"], [1, "mfe-loading-skeleton"], [1, "fault-badge"], [1, "action-btn", "btn-accent", 3, "click"], [4, "ngComponentOutlet"]], template: function FederatedRemoteSlotComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, FederatedRemoteSlotComponent_Conditional_0_Template, 17, 16, "div", 0);
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275conditional((tmp_0_0 = ctx.descriptor()) ? 0 : -1, tmp_0_0);
    }
  }, dependencies: [CommonModule, NgComponentOutlet], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FederatedRemoteSlotComponent, [{
    type: Component,
    args: [{
      selector: "app-federated-remote-slot",
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
              v{{ meta.version }} \xB7 {{ meta.bundleSizeKb }}kB \xB7
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
            <div class="fault-badge">MFE ERROR BOUNDARY ACTIVE \xB7 CIRCUIT_OPEN</div>
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
  `
    }]
  }], null, { remoteId: [{ type: Input, args: [{ isSignal: true, alias: "remoteId", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FederatedRemoteSlotComponent, { className: "FederatedRemoteSlotComponent", filePath: "src/app/federation/federated-remote-slot.component.ts", lineNumber: 95 });
})();

// src/app/app.component.ts
var AppComponent_Conditional_68_Defer_5_DepsFn = () => [FederatedRemoteSlotComponent];
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.notification.id;
function AppComponent_Conditional_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 26)(1, "div", 38)(2, "span", 39);
    \u0275\u0275text(3, "SYSTEM DESIGN #1 \xB7 UI NOTIFICATION QUEUE");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h4");
    \u0275\u0275text(5, "4-Lane Priority Heap + Fingerprint Coalescer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7, " Prevents DOM freezes during 50x alert storms by hashing ");
    \u0275\u0275elementStart(8, "code");
    \u0275\u0275text(9, "dedupeKey");
    \u0275\u0275elementEnd();
    \u0275\u0275text(10, " within a 60s window into a single ");
    \u0275\u0275elementStart(11, "code");
    \u0275\u0275text(12, "\xD7N");
    \u0275\u0275elementEnd();
    \u0275\u0275text(13, " card, capping HUD overlays at 3, and preempting ");
    \u0275\u0275elementStart(14, "code");
    \u0275\u0275text(15, "P3_LOW");
    \u0275\u0275elementEnd();
    \u0275\u0275text(16, " toasts when ");
    \u0275\u0275elementStart(17, "code");
    \u0275\u0275text(18, "P0_CRITICAL");
    \u0275\u0275elementEnd();
    \u0275\u0275text(19, " arrives. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 38)(21, "span", 39);
    \u0275\u0275text(22, "SYSTEM DESIGN #2 \xB7 MODULE FEDERATION");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "h4");
    \u0275\u0275text(24, "Runtime Manifest + Fault-Isolation Boundaries");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "p");
    \u0275\u0275text(26, " Loads remote micro-frontends dynamically with RBAC role guards and per-remote circuit breakers. Crashing one remote renders an isolated recovery boundary without taking down the Host Shell. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div", 38)(28, "span", 39);
    \u0275\u0275text(29, "SYSTEM DESIGN #3 \xB7 ZONELESS SIGNALS");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "h4");
    \u0275\u0275text(31, "Zero Zone.js Collisions Across Remotes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "p");
    \u0275\u0275text(33, " Bootstrapped with ");
    \u0275\u0275elementStart(34, "code");
    \u0275\u0275text(35, "provideZonelessChangeDetection()");
    \u0275\u0275elementEnd();
    \u0275\u0275text(36, " and a singleton ");
    \u0275\u0275elementStart(37, "code");
    \u0275\u0275text(38, "SharedMfeContextService");
    \u0275\u0275elementEnd();
    \u0275\u0275text(39, " using Angular 22 ");
    \u0275\u0275elementStart(40, "code");
    \u0275\u0275text(41, "signal()");
    \u0275\u0275elementEnd();
    \u0275\u0275text(42, ", ");
    \u0275\u0275elementStart(43, "code");
    \u0275\u0275text(44, "computed()");
    \u0275\u0275elementEnd();
    \u0275\u0275text(45, ", and ");
    \u0275\u0275elementStart(46, "code");
    \u0275\u0275text(47, "linkedSignal()");
    \u0275\u0275elementEnd();
    \u0275\u0275text(48, ". ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(49, "div", 38)(50, "span", 39);
    \u0275\u0275text(51, "SYSTEM DESIGN #4 \xB7 OFFLINE OUTBOX & SDUI");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "h4");
    \u0275\u0275text(53, "Optimistic UI + Idempotent Replay");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "p");
    \u0275\u0275text(55, " Acknowledgments made while offline are queued with unique ");
    \u0275\u0275elementStart(56, "code");
    \u0275\u0275text(57, "outboxId");
    \u0275\u0275elementEnd();
    \u0275\u0275text(58, " keys and replayed to the NestJS GraphQL API upon reconnection without duplicate side effects. ");
    \u0275\u0275elementEnd()()();
  }
}
function AppComponent_Conditional_68_Defer_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42);
    \u0275\u0275element(1, "app-federated-remote-slot", 43);
    \u0275\u0275elementEnd();
  }
}
function AppComponent_Conditional_68_DeferPlaceholder_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 44);
    \u0275\u0275text(1, "Deferring FinOps Remote...");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_Conditional_68_Defer_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42);
    \u0275\u0275element(1, "app-federated-remote-slot", 45);
    \u0275\u0275elementEnd();
  }
}
function AppComponent_Conditional_68_DeferPlaceholder_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 44);
    \u0275\u0275text(1, "Deferring War-Room Remote...");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_Conditional_68_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28)(1, "div", 40);
    \u0275\u0275element(2, "app-federated-remote-slot", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275domTemplate(3, AppComponent_Conditional_68_Defer_3_Template, 2, 0)(4, AppComponent_Conditional_68_DeferPlaceholder_4_Template, 2, 0);
    \u0275\u0275defer(5, 3, AppComponent_Conditional_68_Defer_5_DepsFn, null, 4);
    \u0275\u0275deferOnImmediate();
    \u0275\u0275domTemplate(7, AppComponent_Conditional_68_Defer_7_Template, 2, 0)(8, AppComponent_Conditional_68_DeferPlaceholder_8_Template, 2, 0);
    \u0275\u0275defer(9, 7, AppComponent_Conditional_68_Defer_5_DepsFn, null, 8);
    \u0275\u0275deferOnImmediate();
    \u0275\u0275elementEnd();
  }
}
function AppComponent_Conditional_69_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 29);
    \u0275\u0275element(1, "app-federated-remote-slot", 46);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("remoteId", ctx_r0.viewModeAsRemote());
  }
}
function AppComponent_For_78_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34)(1, "span", 47);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 48);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 49);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 50);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const evt_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(evt_r2.timestamp.slice(11, 19));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", evt_r2.sourceMfe, " -> ", evt_r2.targetMfe);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(evt_r2.eventType);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(evt_r2.payloadSummary);
  }
}
function AppComponent_For_86_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 52);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const toast_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(toast_r4.preemptedBanner);
  }
}
function AppComponent_For_86_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 55);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const toast_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("\xD7", toast_r4.notification.occurrences, " coalesced");
  }
}
function AppComponent_For_86_span_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 64);
    \u0275\u0275text(1, "PAUSED (Hover)");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_For_86_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 51);
    \u0275\u0275listener("mouseenter", function AppComponent_For_86_Template_div_mouseenter_0_listener() {
      const toast_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.queue.setToastHoverPause(toast_r4.notification.id, true));
    })("mouseleave", function AppComponent_For_86_Template_div_mouseleave_0_listener() {
      const toast_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.queue.setToastHoverPause(toast_r4.notification.id, false));
    });
    \u0275\u0275conditionalCreate(1, AppComponent_For_86_Conditional_1_Template, 2, 1, "div", 52);
    \u0275\u0275elementStart(2, "div", 53)(3, "span", 54);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, AppComponent_For_86_Conditional_5_Template, 2, 1, "span", 55);
    \u0275\u0275template(6, AppComponent_For_86_span_6_Template, 2, 0, "span", 56);
    \u0275\u0275elementStart(7, "button", 57);
    \u0275\u0275listener("click", function AppComponent_For_86_Template_button_click_7_listener() {
      const toast_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.queue.dismissToast(toast_r4.notification.id));
    });
    \u0275\u0275text(8, " \xD7 ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 58);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 59);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 60)(14, "span", 32);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "button", 61);
    \u0275\u0275listener("click", function AppComponent_For_86_Template_button_click_16_listener() {
      const toast_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.queue.acknowledgeNotification(toast_r4.notification.id));
    });
    \u0275\u0275text(17, " Acknowledge ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 62);
    \u0275\u0275element(19, "div", 63);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const toast_r4 = ctx.$implicit;
    \u0275\u0275property("ngClass", toast_r4.notification.priority.toLowerCase());
    \u0275\u0275advance();
    \u0275\u0275conditional(toast_r4.preemptedBanner ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", toast_r4.notification.priority.toLowerCase());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", toast_r4.notification.priority, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(toast_r4.notification.occurrences > 1 ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", toast_r4.isPaused);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(toast_r4.notification.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(toast_r4.notification.message);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(toast_r4.notification.sourceMfe);
    \u0275\u0275advance(4);
    \u0275\u0275styleProp("width", toast_r4.remainingMs / toast_r4.totalDurationMs * 100, "%");
  }
}
var AppComponent = class _AppComponent {
  shared = inject(SharedMfeContextService);
  queue = inject(NotificationQueueService);
  federation = inject(FederationRuntimeService);
  viewMode = signal(
    "COMPOSITE_GRID",
    ...ngDevMode ? [{ debugName: "viewMode" }] : (
      /* istanbul ignore next */
      []
    )
  );
  showArchMatrix = signal(
    true,
    ...ngDevMode ? [{ debugName: "showArchMatrix" }] : (
      /* istanbul ignore next */
      []
    )
  );
  viewModeAsRemote() {
    const mode = this.viewMode();
    return mode === "COMPOSITE_GRID" ? "mfe-notification-studio" : mode;
  }
  onTenantChange(tenant) {
    this.shared.setTenant(tenant);
  }
  onEnvChange(env) {
    this.shared.setEnvironment(env);
  }
  onRoleChange(role) {
    this.shared.setRole(role);
  }
  static \u0275fac = function AppComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], decls: 87, vars: 28, consts: [[1, "shell-layout"], [1, "shell-header"], [1, "brand-cluster"], [1, "brand-logo"], [1, "brand-title-row"], [1, "arch-chip"], [1, "arch-chip", "chip-purple"], [1, "brand-subtitle"], [1, "global-context-controls"], [1, "ctx-ctrl"], [1, "ctrl-select", 3, "ngModelChange", "ngModel"], ["value", "acme-fintech"], ["value", "nebula-ai-cloud"], ["value", "quant-velocity"], ["value", "prod-us-east"], ["value", "prod-eu-central"], ["value", "staging-canary"], ["value", "STAFF_ARCHITECT"], ["value", "FINOPS_ANALYST"], ["value", "SRE_LEAD"], [1, "toggle-pill", 3, "click"], ["aria-label", "Micro-frontend workspace perspective", 1, "perspective-bar"], [1, "view-buttons"], [1, "view-tab", 3, "click"], [1, "badge-count"], [1, "arch-drawer-btn", 3, "click"], [1, "sysdesign-matrix-panel"], [1, "workspace-main"], [1, "composite-mfe-grid"], [1, "single-mfe-stage"], [1, "signal-bus-console"], [1, "bus-header"], [1, "mono"], [1, "bus-log-list"], [1, "bus-log-row", "mono"], ["aria-live", "polite", "aria-label", "Real-time priority toast notifications", 1, "toast-hud-viewport"], [1, "hud-header", "mono"], [1, "toast-card", 3, "ngClass"], [1, "matrix-card"], [1, "matrix-tag"], [1, "grid-col-full"], ["remoteId", "mfe-notification-studio"], [1, "grid-col-half"], ["remoteId", "mfe-finops-telemetry"], [1, "mfe-loading-skeleton"], ["remoteId", "mfe-incident-war-room"], [3, "remoteId"], [1, "bus-time"], [1, "bus-route"], [1, "bus-type"], [1, "bus-summary"], [1, "toast-card", 3, "mouseenter", "mouseleave", "ngClass"], [1, "preempt-banner"], [1, "toast-top"], [1, "prio-chip", 3, "ngClass"], [1, "coalesce-chip"], ["class", "toast-paused-tag", 4, "ngIf"], ["aria-label", "Dismiss toast", 1, "toast-close", 3, "click"], [1, "toast-title"], [1, "toast-msg"], [1, "toast-footer"], [1, "toast-ack-btn", 3, "click"], [1, "toast-progress-track"], [1, "toast-progress-bar"], [1, "toast-paused-tag"]], template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275text(4, "PG");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div")(6, "div", 4)(7, "h1");
      \u0275\u0275text(8, "PulseGrid");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "span", 5);
      \u0275\u0275text(10, "Angular 22 Zoneless Signals");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "span", 6);
      \u0275\u0275text(12, "Module Federation Host");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "span", 5);
      \u0275\u0275text(14);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "p", 7);
      \u0275\u0275text(16, " Federated Micro-Frontend Workbench & Real-Time UI Notification Priority Queue Engine ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(17, "div", 8)(18, "label", 9)(19, "span");
      \u0275\u0275text(20, "Tenant");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "select", 10);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function AppComponent_Template_select_ngModelChange_21_listener($event) {
        return ctx.onTenantChange($event);
      });
      \u0275\u0275elementStart(22, "option", 11);
      \u0275\u0275text(23, "acme-fintech");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "option", 12);
      \u0275\u0275text(25, "nebula-ai-cloud");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "option", 13);
      \u0275\u0275text(27, "quant-velocity");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(28, "label", 9)(29, "span");
      \u0275\u0275text(30, "Environment");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "select", 10);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function AppComponent_Template_select_ngModelChange_31_listener($event) {
        return ctx.onEnvChange($event);
      });
      \u0275\u0275elementStart(32, "option", 14);
      \u0275\u0275text(33, "prod-us-east");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "option", 15);
      \u0275\u0275text(35, "prod-eu-central");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "option", 16);
      \u0275\u0275text(37, "staging-canary");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(38, "label", 9)(39, "span");
      \u0275\u0275text(40, "RBAC Role (Manifest Guard)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "select", 10);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function AppComponent_Template_select_ngModelChange_41_listener($event) {
        return ctx.onRoleChange($event);
      });
      \u0275\u0275elementStart(42, "option", 17);
      \u0275\u0275text(43, "STAFF_ARCHITECT (All 3 Remotes)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "option", 18);
      \u0275\u0275text(45, "FINOPS_ANALYST (2 Remotes)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "option", 19);
      \u0275\u0275text(47, "SRE_LEAD (2 Remotes)");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(48, "button", 20);
      \u0275\u0275listener("click", function AppComponent_Template_button_click_48_listener() {
        return ctx.shared.toggleOfflineMode(!ctx.shared.isOfflineSimulated());
      });
      \u0275\u0275text(49);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "button", 20);
      \u0275\u0275listener("click", function AppComponent_Template_button_click_50_listener() {
        return ctx.shared.doNotDisturb.set(!ctx.shared.doNotDisturb());
      });
      \u0275\u0275text(51);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(52, "nav", 21)(53, "div", 22)(54, "button", 23);
      \u0275\u0275listener("click", function AppComponent_Template_button_click_54_listener() {
        return ctx.viewMode.set("COMPOSITE_GRID");
      });
      \u0275\u0275text(55, " Unified Command Grid (All Federated Remotes) ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "button", 23);
      \u0275\u0275listener("click", function AppComponent_Template_button_click_56_listener() {
        return ctx.viewMode.set("mfe-notification-studio");
      });
      \u0275\u0275text(57, " Remote 1: Notification Queue Studio ");
      \u0275\u0275elementStart(58, "span", 24);
      \u0275\u0275text(59);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(60, "button", 23);
      \u0275\u0275listener("click", function AppComponent_Template_button_click_60_listener() {
        return ctx.viewMode.set("mfe-finops-telemetry");
      });
      \u0275\u0275text(61, " Remote 2: FinOps & AI Spend ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(62, "button", 23);
      \u0275\u0275listener("click", function AppComponent_Template_button_click_62_listener() {
        return ctx.viewMode.set("mfe-incident-war-room");
      });
      \u0275\u0275text(63, " Remote 3: Incident War-Room & SDUI ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(64, "button", 25);
      \u0275\u0275listener("click", function AppComponent_Template_button_click_64_listener() {
        return ctx.showArchMatrix.set(!ctx.showArchMatrix());
      });
      \u0275\u0275text(65);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(66, AppComponent_Conditional_66_Template, 59, 0, "section", 26);
      \u0275\u0275elementStart(67, "main", 27);
      \u0275\u0275conditionalCreate(68, AppComponent_Conditional_68_Template, 11, 0, "div", 28)(69, AppComponent_Conditional_69_Template, 2, 1, "div", 29);
      \u0275\u0275elementStart(70, "section", 30)(71, "div", 31)(72, "span", 32);
      \u0275\u0275text(73, " CROSS-MFE SINGLETON SIGNAL EVENT BUS (@pulsegrid/shared-signal-bus) ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(74, "span", 32);
      \u0275\u0275text(75);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(76, "div", 33);
      \u0275\u0275repeaterCreate(77, AppComponent_For_78_Template, 9, 5, "div", 34, _forTrack0);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(79, "aside", 35)(80, "div", 36)(81, "span");
      \u0275\u0275text(82);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(83, "span");
      \u0275\u0275text(84);
      \u0275\u0275elementEnd()();
      \u0275\u0275repeaterCreate(85, AppComponent_For_86_Template, 20, 11, "div", 37, _forTrack1);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(13);
      \u0275\u0275classProp("chip-emerald", ctx.shared.backendMode() === "LIVE_NESTJS_GRAPHQL");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.shared.backendMode() === "LIVE_NESTJS_GRAPHQL" ? "LIVE NestJS GraphQL :3344" : "In-Browser Deterministic Engine", " ");
      \u0275\u0275advance(7);
      \u0275\u0275property("ngModel", ctx.shared.activeTenant());
      \u0275\u0275control();
      \u0275\u0275advance(10);
      \u0275\u0275property("ngModel", ctx.shared.activeEnvironment());
      \u0275\u0275control();
      \u0275\u0275advance(10);
      \u0275\u0275property("ngModel", ctx.shared.activeRole());
      \u0275\u0275control();
      \u0275\u0275advance(7);
      \u0275\u0275classProp("active-warn", ctx.shared.isOfflineSimulated());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.shared.isOfflineSimulated() ? "OFFLINE (Outbox Active)" : "ONLINE Mode", " ");
      \u0275\u0275advance();
      \u0275\u0275classProp("active-purple", ctx.shared.doNotDisturb());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.shared.doNotDisturb() ? "DND: P0 Only" : "DND: Off", " ");
      \u0275\u0275advance(3);
      \u0275\u0275classProp("active", ctx.viewMode() === "COMPOSITE_GRID");
      \u0275\u0275advance(2);
      \u0275\u0275classProp("active", ctx.viewMode() === "mfe-notification-studio");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.queue.unreadCount());
      \u0275\u0275advance();
      \u0275\u0275classProp("active", ctx.viewMode() === "mfe-finops-telemetry");
      \u0275\u0275advance(2);
      \u0275\u0275classProp("active", ctx.viewMode() === "mfe-incident-war-room");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1(" ", ctx.showArchMatrix() ? "Hide System Design Matrix" : "Show System Design Matrix", " ");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showArchMatrix() ? 66 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.viewMode() === "COMPOSITE_GRID" ? 68 : 69);
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate1(" Active Cluster: ", ctx.shared.activeClusterShard(), " ");
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.shared.busEvents().slice(0, 5));
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate2("TOAST HUD (", ctx.queue.activeToasts().length, "/", ctx.queue.maxVisibleToasts(), " SLOTS)");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("QUEUE: ", ctx.queue.waitingQueue().length, " WAITING");
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.queue.activeToasts());
    }
  }, dependencies: [CommonModule, NgClass, NgIf, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, SelectControlValueAccessor, NgControlStatus, NgModel, FederatedRemoteSlotComponent], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppComponent, [{
    type: Component,
    args: [{
      selector: "app-root",
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
            <span class="matrix-tag">SYSTEM DESIGN #1 \xB7 UI NOTIFICATION QUEUE</span>
            <h4>4-Lane Priority Heap + Fingerprint Coalescer</h4>
            <p>
              Prevents DOM freezes during 50x alert storms by hashing <code>dedupeKey</code> within a 60s window into a single <code>\xD7N</code> card, capping HUD overlays at 3, and preempting <code>P3_LOW</code> toasts when <code>P0_CRITICAL</code> arrives.
            </p>
          </div>
          <div class="matrix-card">
            <span class="matrix-tag">SYSTEM DESIGN #2 \xB7 MODULE FEDERATION</span>
            <h4>Runtime Manifest + Fault-Isolation Boundaries</h4>
            <p>
              Loads remote micro-frontends dynamically with RBAC role guards and per-remote circuit breakers. Crashing one remote renders an isolated recovery boundary without taking down the Host Shell.
            </p>
          </div>
          <div class="matrix-card">
            <span class="matrix-tag">SYSTEM DESIGN #3 \xB7 ZONELESS SIGNALS</span>
            <h4>Zero Zone.js Collisions Across Remotes</h4>
            <p>
              Bootstrapped with <code>provideZonelessChangeDetection()</code> and a singleton <code>SharedMfeContextService</code> using Angular 22 <code>signal()</code>, <code>computed()</code>, and <code>linkedSignal()</code>.
            </p>
          </div>
          <div class="matrix-card">
            <span class="matrix-tag">SYSTEM DESIGN #4 \xB7 OFFLINE OUTBOX &amp; SDUI</span>
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
                <span class="coalesce-chip">\xD7{{ toast.notification.occurrences }} coalesced</span>
              }
              <span class="toast-paused-tag" *ngIf="toast.isPaused">PAUSED (Hover)</span>
              <button
                class="toast-close"
                (click)="queue.dismissToast(toast.notification.id)"
                aria-label="Dismiss toast"
              >
                \xD7
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
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src/app/app.component.ts", lineNumber: 301 });
})();

// src/main.ts
bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideAnimationsAsync()
  ]
}).catch((err) => console.error(err));
