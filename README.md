# CATCHAM

> **Production-Grade Multi-Agency Whistleblowing, Incident Reporting, Investigation, Evidence & Case Management Platform for Nigeria.**

---

## 🏛️ Platform Overview

**CATCHAM** is a sovereign-grade digital justice, regulatory oversight, and incident management system engineered for multi-agency collaboration across Nigeria. It bridges citizens, whistleblowers, civil society, and government institutions including:

- **Law Enforcement Agencies** (e.g., Police, Anti-Graft Agencies, Drug Law Enforcement)
- **Regulatory Authorities** (e.g., Financial, Environmental, Consumer Protection)
- **Emergency & Security Services** (e.g., Disaster Management, Fire, Civil Defence)
- **Energy & Infrastructure Authorities** (e.g., Electricity Regulatory Commission, Pipeline Security)
- **Designated Private Partner Organizations** (authorized reporting corridors)

---

## 🏗️ Architecture & Philosophy

The project is structured as a **Modular Monolith** managed through **pnpm Workspaces** and **Turborepo**.

- **Clean Architecture & DDD**: Clear separation of Domain, Application, Infrastructure, and Presentation.
- **Strict Module Isolation**: Business domains are separated into `packages/*` without circular dependencies.
- **Workflow & Rules Engine Centric**: Case progression and jurisdiction resolution are governed by central workflow and rules engines rather than hard-coded logic.
- **Immutable Chain of Custody**: Cryptographically verifiable evidence storage (SHA-256) and append-only audit logging.
- **PostGIS Spatial Routing**: Jurisdiction boundaries, points-in-polygons, and automatic geo-routing across 36 states, FCT, and 774 LGAs.
- **Isolated AI Capabilities**: Machine learning, OCR, voice transcription, and classification assistance reside in an independent FastAPI service.

---

## 📂 Repository Layout

```text
catcham/
├── apps/
│   ├── api/            # NestJS Core Modular Monolith API
│   ├── web/            # Next.js 14 Role-Aware Web Portal
│   └── mobile/         # React Native (Expo) Whistleblower & Citizen App
├── services/
│   └── ai/             # Python FastAPI Service (OCR, STT, Vision, NLP)
├── packages/
│   ├── core/           # Workflow Engine, Rules Engine, Uploads, Security
│   ├── identity/       # Users, RBAC, Sessions, MFA, Permissions
│   ├── organization/   # Agencies, Departments, Offices, Jurisdictions
│   ├── reporting/      # Anonymous & Authenticated Reports, Routing
│   ├── investigation/  # Case Management, Tasks, Teams, Escalations
│   ├── evidence/       # Digital Evidence, SHA-256, Chain of Custody
│   ├── notification/   # Multi-Channel Alerts (Email, SMS, Push, In-App)
│   ├── audit/          # Append-Only Audit Trail & Compliance
│   ├── analytics/      # Metric Aggregations, Dashboards, SLAs
│   ├── search/         # Full-Text & Vector Search Abstraction
│   └── gis/            # PostGIS Spatial Queries & Geo-Fencing
├── infrastructure/     # Docker, Nginx, PostgreSQL, Redis, MinIO
├── prisma/             # Multi-Agency Database Schema, Migrations, Seeds
├── docs/               # Architecture Overviews & ADRs (ADR-0001 to ADR-0010)
├── scripts/            # Environment Setup & Database Seed Scripts
└── tests/              # E2E and Integration Test Suites
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js >= 20.x
- pnpm >= 9.x
- Docker & Docker Compose
- Python >= 3.11 (for AI service development)

### 2. Environment Setup
```bash
cp .env.example .env
pnpm install
```

### 3. Spin Up Infrastructure
```bash
pnpm db:up
```

### 4. Database Migration & Seed
```bash
pnpm prisma:migrate
pnpm prisma:seed
```

### 5. Launch Development
```bash
pnpm dev
```
