# PulseGrid — Federated Micro-Frontend & Real-Time UI Notification Queue Platform

[![Angular 22](https://img.shields.io/badge/Angular-22.2_Zoneless_Signals-dd0031?logo=angular)](https://angular.dev)
[![Module Federation](https://img.shields.io/badge/Micro--Frontends-Runtime_Module_Federation-a855f7)](https://angular.dev)
[![Angular Material](https://img.shields.io/badge/Material_22-CDK_VirtualScroll_%26_DragDrop-0ea5e9)](https://material.angular.io)
[![NestJS](https://img.shields.io/badge/NestJS-11_%2B_Apollo_GraphQL-e0234e?logo=nestjs)](https://nestjs.com)

An enterprise **Micro-Frontend (Module Federation) & Real-Time UI Notification Priority Queue Platform** engineered with **Angular 22 Zoneless Signals (`signal`, `computed`, `linkedSignal`, `@defer`)**, **Angular Material 22 + CDK (`CdkVirtualScrollViewport`, `CdkDropList`, `MatStepper`)**, and **NestJS 11 + Apollo GraphQL**.

🔗 **Live Interactive Workbench:** [https://amolip.github.io/pulsegrid-mfe-platform/](https://amolip.github.io/pulsegrid-mfe-platform/)

---

## System Design Challenges Solved in This Repository

| System Design Problem | Architectural Pattern Implemented | Key Files |
| :--- | :--- | :--- |
| **1. Design a Real-Time UI Notification System & Queue at Scale** | **4-Lane Priority Queue (`P0`–`P3`) + 60s Fingerprint Coalescer (`dedupeKey`) + Token-Bucket Rate Limiter + Active HUD Concurrency Cap (Max 3 Toasts) + P0 Preemption** | `web/src/app/core/notification-queue/notification-queue.service.ts` |
| **2. Design a Micro-Frontend Architecture (Module Federation)** | **Runtime Federation Manifest Loader + Route & Widget Composition (`NgComponentOutlet` + `@defer`) + RBAC Role Guarding** | `web/src/app/federation/federation-runtime.service.ts` |
| **3. MFE Fault Isolation & Circuit Breakers** | **Per-Remote Error Boundary Wrapper** — injecting a crash in `mfe-finops-telemetry` isolates the failure to a fallback card without crashing the Host Shell or sibling remotes | `web/src/app/federation/federated-remote-slot.component.ts` |
| **4. Cross-MFE Reactive State Sharing (Zero Zone.js Conflicts)** | **100% Zoneless Angular 22 (`provideZonelessChangeDetection()`)** + Singleton Signal Event Bus (`signal`, `computed`, `linkedSignal`) | `web/src/app/core/shared-context/shared-mfe-context.service.ts` |
| **5. High-Volume Notification Inbox & Offline Resilience** | **Angular CDK `CdkVirtualScrollViewport` (60fps with 5,000+ rows)** + **Optimistic UI** + **Idempotent Offline Mutation Outbox Replay** | `web/src/app/remotes/notification-studio/notification-studio-remote.component.ts` |
| **6. Interactive Incident Triage & Server-Driven UI (SDUI)** | **Angular CDK Drag & Drop (`CdkDropList`)** Kanban + Dynamic **Server-Driven `MatStepper`** Rule Engine backed by NestJS GraphQL | `web/src/app/remotes/incident-war-room/incident-war-room-remote.component.ts` |

---

## Quick Start (Full-Stack Local Mode)

```bash
# 1. Start the NestJS 11 + Apollo GraphQL API on port 3344
cd api
npm install --legacy-peer-deps
npm test
npm run start:dev

# 2. Start the Angular 22 Zoneless MFE Host & Remotes on port 4202
cd ../web
npm install --legacy-peer-deps
npm start
```

Open **`http://localhost:4202`** in your browser.
- When the NestJS GraphQL API is running on `http://localhost:3344/graphql`, the Host Shell connects in **`LIVE NestJS GraphQL :3344`** mode.
- When hosted statically on GitHub Pages, the workbench seamlessly runs its **In-Browser Deterministic Queue & Federation Engine** so all storm simulations, P0 preemptions, CDK drag-and-drop boards, and circuit breakers work zero-setup.
