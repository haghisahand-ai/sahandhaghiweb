# SAHAND — Master Development Roadmap

**Product:** SAHAND Personal Technology Hub (`https://sahandhaghi.site`)  
**Production architecture:** WordPress PHP theme (`sahand-theme`) + independent plugin (`sahand-core`)  
**Languages:** Persian (`fa-IR`, RTL), English (`en-US`, LTR), Turkish (`tr-TR`, LTR)

## Execution principles

- React/Vite is a prototype and design-validation environment, not the production application.
- Production rendering, content management, and business logic must run in WordPress/PHP.
- A phase is not **Verified** until its acceptance criteria have been tested in the target environment and evidence is recorded.
- Documentation, mock UI states, and source-code presence do not by themselves establish a working or secure feature.
- Production deployment requires staging validation, tested backups, rollback capability, and a security review.

## Phase status

| Phase | Workstream | Current status | Exit criteria |
|---|---|---|---|
| 01 | Product definition and architecture | Documented | Architecture decisions and hosting constraints confirmed |
| 02 | Multilingual foundation | Partially implemented | Real fa/en/tr routing, linked translations, correct language switch on equivalent pages |
| 03 | Brand and design system | Prototype implemented | Approved design implemented consistently in native WordPress templates |
| 04 | Homepage and intro experience | Prototype / partial theme implementation | Intro preserved and verified on WordPress across languages, devices, and reduced-motion settings |
| 05 | WordPress theme | Foundation implemented | Complete templates, navigation, responsive behavior, accessible components, and error pages |
| 06 | WordPress core plugin | Partially implemented | CPTs, taxonomies, metadata, REST routes, and role-based permissions tested |
| 07 | Portfolio and content sections | Not complete | Dynamic About, Projects, Engineering, Insights, and Contact templates |
| 08 | Launchpad | Not complete | Dynamic product archive/single pages, versioning, downloads, and changelogs |
| 09 | SEO and performance | Partially implemented | Correct canonical/hreflang, metadata, structured data, optimized assets, measured Core Web Vitals |
| 10 | AI integration | Prototype only | Server-side provider gateway, secret management, usage controls, error handling, and real inference tests |
| 11 | Security and quality assurance | Partially implemented; not verified | Automated tests, role/permission tests, abuse controls, CSP rollout, staging security assessment |
| 12 | Staging and production deployment | Not started | Reproducible deployment, TLS, backup/restore test, rollback, monitoring, production acceptance |

## Immediate priorities

1. Complete the code review and validation of the open security-fixes pull request.
2. Test WordPress meta-box permissions and contact delivery on staging.
3. Replace the non-atomic transient rate limiter with an atomic or edge-enforced control and define trusted proxy/IP handling.
4. Implement and test native WordPress page/CPT templates and real multilingual page relationships.
5. Remove prototype-only success claims from React UI or clearly label the UI as a demo until real endpoints exist.
6. Build the server-side AI gateway only after secret storage, quotas, abuse controls, and error handling are defined.
7. Run PHP syntax, WordPress coding standards, TypeScript checks, production build, accessibility, responsive, performance, backup/restore, and security tests.

## Status definitions

- **Not started:** No implementation evidence.
- **Documented:** Requirements or design are written; implementation is not established.
- **Prototype:** Demonstration behavior exists but is not connected to production services.
- **Partially implemented:** Some source code exists; acceptance criteria remain incomplete.
- **Implemented:** Source code for the defined scope exists.
- **Tested:** A repeatable test has been run and its result recorded.
- **Verified:** Acceptance criteria passed in the target environment with evidence.
- **Blocked:** An external dependency prevents progress.

See `PROJECT_STATUS.md` for the evidence-based status snapshot and `docs/TECHNICAL_AUDIT_2026-11-11.md` for the audit scope, findings, and validation checklist.
