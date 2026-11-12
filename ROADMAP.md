# SAHAND — Master Development Roadmap

**Product:** SAHAND Personal Technology Hub (`https://sahandhaghi.site`)  
**Production architecture:** WordPress PHP theme (`sahand-theme`) + independent core plugin (`sahand-core`)  
**Languages:** Persian (`fa-IR`, RTL, Default), English (`en-US`, LTR), Turkish (`tr-TR`, LTR)  
**Revision:** 11 November 2026 (Audit & Hardening Milestone)

---

## Execution Principles

- WordPress CMS with `sahand-theme` and `sahand-core` is the mandatory production architecture.
- Full-stack Node/Express (`server.ts`) acts as the interactive development prototype and design validation engine.
- A phase or feature is marked **Verified** only after passing documented and repeatable tests.
- Defense-in-depth: zero-trust capability checks, atomic concurrency rate limiting, cryptographic nonces, and sanitized contexts protect all entry points.
- Shared hosting compatibility: zero dependency on unmanaged Node.js server processes or root privileges in production.

---

## Phase Status Matrix

| Phase | Workstream | Current Status | Implemented Artifacts & Evidence |
|---|---|---|---|
| 01 | Product Definition & Architecture | **Documented** | `docs/ARCHITECTURE_PHASE_01.md`, `docs/SECURITY.md`, `docs/ENVIRONMENT.md` |
| 02 | Multilingual Foundation | **Implemented** | `inc/multilingual.php`, hreflang generators, trilingual switcher, RTL/LTR body tags |
| 03 | Brand & Design System | **Verified** | Vector logo system, 16px favicon, Mount Sahand geological emblem, Vazirmatn/Inter typography |
| 04 | Homepage & Intro Experience | **Verified** | Approved neural canvas preserved, motion toggle accessible, language routing cards for `/fa/`, `/en/`, `/tr/` |
| 05 | WordPress Theme Templates | **Implemented** | Complete template hierarchy: `front-page.php`, `index.php`, `404.php`, `archive.php`, 4 CPT archives, 4 CPT singles, and 8 page templates |
| 06 | WordPress Core Plugin | **Implemented** | 4 CPTs registered (`sahand_project`, `sahand_product`, `sahand_ai_tool`, `sahand_insight`), taxonomies, meta boxes with object-level checks |
| 07 | Security & Threat Hardening | **Tested** | STRIDE threat model addressed; atomic MySQL rate limiter table; trusted proxy resolver; CSP Report-Only policy; upload folder execution lock |
| 08 | AI Integration Gateway | **Implemented** | Server-side Gemini 3.8 Flash gateway (`class-ai-gateway.php` & `server.ts`); client credentials never exposed; 8s circuit breaker |
| 09 | Testing and QA | **Tested** | 28/28 unit tests passing in Node test runner (`src/utils/*.test.ts`); TypeScript zero-error lint (`tsc --noEmit`) and clean build |
| 10 | SEO and Performance | **Tested** | Open Graph, Twitter Cards, Schema.org JSON-LD, hreflang tags, zero-layout-recalc Bézier math |
| 11 | Staging & Deployment | **Documented** | Comprehensive deployment runbook in `docs/DEPLOYMENT.md`; table DDL, rollback runbook, and package zips |
| 12 | Production Cutover | **Queued** | Final staging acceptance, SMTP mail server authentication, and live domain cutover to `https://sahandhaghi.site` |

---

## Status Definitions

- **Not Started:** No implementation evidence in the repository.
- **Documented:** Requirements or design are written; implementation is not established.
- **Prototype:** Demonstration behavior exists but is not connected to production services.
- **Partially Implemented:** Some source code exists; acceptance criteria remain incomplete.
- **Implemented:** Source code for the defined scope exists and adheres to architecture.
- **Tested:** A repeatable test has been run and its result recorded with verifiable output.
- **Verified:** Acceptance criteria passed in the target environment with evidence.
- **Blocked:** An external dependency prevents progress.
