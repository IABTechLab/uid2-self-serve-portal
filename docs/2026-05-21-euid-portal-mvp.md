# EUID Portal MVP (TAM-only) Implementation Plan



> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a TAM-admin-only EUID self-serve portal at `portal.integ.euid.eu`, sharing one codebase with the UID2 portal, fully isolated at the data and auth layer.

**Architecture:** Single `uid2-self-serve-portal` codebase, gated on a new `SSP_PORTAL_IDENTITY` env var ∈ `{UID2, EUID}` plumbed through a small `identity.ts` helper. EUID stack runs in `euid-core-integ` AWS account (EU region) with its own RDS, KMS, Secrets, ALB, EKS deployment, and Keycloak realm. UID2 portal remains unchanged. **Integ only** — no prod in this plan.

**Tech Stack:** React 18 + Express + Knex/Objection + MS SQL Server + Keycloak (federated to Okta) + AWS EKS + Terraform + ArgoCD. Tests: Jest (backend, `.spec.ts`), Vitest/Jest for frontend (verify in Task 19). uid2-admin is Kotlin/Java (one small file changes).

**Spec:** [\[AI Innovation day\] EUID Portal MVP (TAM-only) Design](https://thetradedesk.atlassian.net/wiki/spaces/UID2/pages/1724874898)

---

## Status as of 2026-05-21 (mid-hackathon — handoff to next session)

**Active branch (portal):** `bmz/kcc-aid-euid-ssportal` in `uid2-self-serve-portal` — **14 commits, NOT pushed**.

### PRs open (awaiting review/merge by Behnam)

| Repo | PR | Branch | What |
|---|---|---|---|
| `uid2-admin` | [#645](https://github.com/IABTechLab/uid2-admin/pull/645) | `bmz/kcc-aid-euid-okta-scope` | Task 2 — `EUID_SS_PORTAL` enum entry |
| `uid2-terraform-modules` | [#740](https://github.com/UnifiedID2/uid2-terraform-modules/pull/740) | `bmz/kcc-aid-euid-ssportal-template` | Tasks 5/6/7 — relax solution validation, ssportal gate on `ssportal_domain != null`, EUID integ ssportal config |
| `uid2-infra` | [#1089](https://github.com/UnifiedID2/uid2-infra/pull/1089) | `bmz/kcc-aid-test-euid-ssportal` | Points `euid-core-integ`'s `terraform_modules_version` at #740's branch for testing. **MUST be reverted after testing** (per runbook). |

### Tasks completed (local commits on `bmz/kcc-aid-euid-ssportal`)

| # | Subject | Commit |
|---|---|---|
| 4a | Backend identity helper + env var | `fefea84c` (+ test env-restore fix `826563a9`) |
| 4b | `/api/config` endpoint | `1281e2df` (+ lint fix `9bc8b019`) |
| 4c | Frontend identity context + `useAsyncThrowError` wiring | `97e7d790` (+ follow-up `f675b83f`) |
| 13 | EUID logo / favicon placeholders | `431b6457` |
| 17 | Skip ToS dialog on EUID | `b62f74f9` |
| 18 | docker-compose `SSP_PORTAL_IDENTITY` (see issue below) | `803026fe` |
| 11 | Outbound email short-circuit on EUID | `b3b78a54` |
| 12 | adminServiceClient URL verification test | `1421d23e` |
| 16 | Hide SharingPermissions / TeamMembers / SelfReinvite on EUID | `b032e645` |
| 14 | `productName()` wired into visible surfaces | `c4c19e24` |
| 15 | `docsBaseUrl()` wired into doc links | `0519dc38` |

### Remaining work (in priority order for next session)

1. **Push portal branch.** Decide one big PR vs split by stage. Branch is local-only.
2. **Task 1 — Okta credentials.** Okta app `euid-ssportal` is created at `uid2.okta.com`. Behnam to provide client ID + secret → goes into AWS Secrets Manager `euid-ssportal/okta-credentials` in the `euid-core-integ` account.
3. **Task 8 — Keycloak realm export.** Create `keycloak/realm/realm-export-euid.json`. Plan steps below (~lines 812-896 of the original plan). Copy `keycloak/realm/realm-export.json`, change realm name to `euid-self-serve-portal`, swap Okta IdP client ID/secret to EUID values, keep TAM group → `uid2-support` role mapping.
4. **Task 9 — uid2-deployment ArgoCD manifests.** Mirror existing UID2 ssportal app under `argocd/applications/euid/integ/ssportal/` in `IABTechLab/uid2-deployment` (not cloned locally yet). Env overrides: `SSP_PORTAL_IDENTITY=EUID`, `SSP_DB_HOST=<EUID integ RDS endpoint>`, `SSP_ADMIN_SERVICE_BASE_URL=https://admin.integ.euid.eu/`, `SSP_KK_REALM=euid-self-serve-portal`, `SSP_OKTA_CLIENT_ID/SECRET` from Task 1, `SSP_APP_NAME=euid-ssportal`, `SSP_ADMIN_OKTA_SCOPE=euid.admin.ss-portal`. Plan ~lines 899-969.
5. **DNS records — follow-up PR in `uid2-terraform-modules`.** After #740 + #1089 land and the first `tf-exec-euid-core-integ` apply creates the ssportal ALB + PENDING ACM cert, add four records to `deployments/euid-core-integ/global/route53.tf`:
   - `A` alias `portal` → ssportal ALB DNS name
   - `A` alias `auth.portal` → same ALB
   - `CNAME` `_<token>.portal` → `*.acm-validations.aws.`
   - `CNAME` `_<token>.auth.portal` → `*.acm-validations.aws.`
   Token values from AWS console (eu-west-2 → ACM → new cert → Domains tab). Pattern visible in existing `route53.tf` blocks for `admin`, `core`, etc. Re-apply; cert validates; portal resolves.
6. **Task 10 — First-deploy migration smoke.** Tail migration job logs, verify `participantTypes` (4 rows), `apiRoles` (5 rows), `userRoles` (Admin/Operations/UID2 Support) in EUID RDS. Plan ~lines 974-1006.
7. **Task 19 — Coverage sweep + cleanup.** Plan ~lines 1535-1564. Also:
   - **Task 18 fix-up:** `SSP_PORTAL_IDENTITY` ended up on the `keycloak` compose service, but the portal node process runs OUTSIDE compose. Move the var into `.env.sample` (or wherever the project documents portal envs).
   - **Task 14 deferred copy:** "UID2" still appears in tooltips/headers in `BulkAddPermissions.tsx`, `SharingPermissionCard.tsx`, `KeyPairsTable.tsx`, `UserPartcipantsTable.tsx`, `signedParticipants.tsx`. Some are on hidden-on-EUID screens; decide per file.
8. **Task 20 — End-to-end TAM smoke test.** Manual checklist at `https://portal.integ.euid.eu/` once deployed. Plan ~lines 1572-1639. Primary exit criterion: API key generated through the portal can call `/v2/token/generate` against `operator-integ.euid.eu` and get a valid advertising token.
9. **Task 21 — README updates.** Document the dual-identity build + local dev override. Plan ~lines 1644-1685.

### Known issues / gotchas for next session

- **Plan's Task 6 was misframed.** The ssportal template already parameterizes `primary_domain`/`secondary_domains`. The actual change in #740 was a one-line gate in `cluster-templates/core-cluster-template/main.tf` — ssportal module `count` now triggers on `var.ssportal_domain != null`. Backward-compatible: all three UID2 deployments already pass `ssportal_domain`.
- **Plan's Task 7 was misframed.** Said the deployment lives in a separate `uid2-terraform-deployment` repo. Actually it lives in `uid2-terraform-modules/deployments/euid-core-integ/regional/main.tf`. The change in #740 just adds `ssportal_domain` + `ssportal_secondary_domains` to the existing `core_cluster` module call.
- **Plan said NS1 manages DNS validation.** Stale for EUID — `euid.eu` is fully Route53-managed in `deployments/euid-core-integ/global/route53.tf`. UID2 still uses NS1 for `unifiedid.com`.
- **`SSP_PORTAL_IDENTITY` in `envars.ts` is unused at runtime.** `identity.ts` reads `process.env.SSP_PORTAL_IDENTITY` directly (lazy reads needed for tests). The `envars.ts` export is kept for discoverability / convention only.
- **Auto-mode classifier blocks `Co-Authored-By` trailers.** All commits in this work skip the trailer.
- **Branch convention drift.** Hackathon uses `bmz/kcc-aid-...` (slash separator) rather than CLAUDE.md's `bmz-UID2-XXXX-...` (dashes) since there's no Jira ticket. Commit messages all use `UID2-XXXX` placeholder.
- **Pre-existing test failures in portal repo.** Backend integration tests fail without docker-compose up (Keycloak/DB). Pre-existing flakes in `uid2-admin` (`SiteSyncJobTest`, `CloudEncryptionKeyServiceTest`, `PartnerConfigServiceTest`) are unrelated to Task 2.
- **Frontend `App.test.tsx` got `global.fetch` stubbed** because Task 4c's `useEffect` calls `fetchIdentityConfig()`. The stub uses `jest.fn()` not `jest.spyOn`, so `mockRestore` is a no-op — fine in isolation, but if more frontend tests start using `fetch` they may need a proper restore.

### External dependencies / waiting on

- Okta client ID + secret for EUID portal app (Task 1)
- Review + merge of three PRs above
- DNS records (after #740 + #1089 first apply)
- Real EUID-branded assets (logo + favicon) — Phase 3 design deliverable

### Repo locations (already cloned)

- Portal: `~/Library/CloudStorage/OneDrive-TheTradeDesk/Documents/GitHub/uid2-self-serve-portal` — on `bmz/kcc-aid-euid-ssportal`
- Terraform modules: `~/Library/CloudStorage/OneDrive-TheTradeDesk/Documents/GitHub/uid2-terraform-modules`
- uid2-infra: `~/Library/CloudStorage/OneDrive-TheTradeDesk/Documents/GitHub/uid2-infra`
- uid2-admin: `~/Library/CloudStorage/OneDrive-TheTradeDesk/Documents/GitHub/uid2-admin` — on Behnam's `bmz-UID2-6764-test` (untouched; work branch is `bmz/kcc-aid-euid-okta-scope`)
- `uid2-deployment` — not cloned yet (needed for Task 9)
- KPOP / kubectl — not configured this session. Task 3 reachability already verified by Behnam (EUID admin URL: `https://admin.integ.euid.eu/`)

---

## Repos touched

| Repo | Purpose |
|---|---|
| `IABTechLab/uid2-self-serve-portal` | Portal code + Keycloak realm export + docker-compose (~17 of the 21 tasks) |
| `IABTechLab/uid2-admin` | One enum entry to accept the EUID Okta scope (Task 2) |
| `UnifiedID2/uid2-terraform-modules` | Relax `solution` validation + per-solution domain logic (Tasks 5–6) |
| The EUID infra repo that consumes `uid-ssportal-template` | Instantiate the EUID integ stack (Task 7) |
| `IABTechLab/uid2-deployment` | Add EUID-integ manifests to the existing ArgoCD pipeline (Task 9) |

Branch convention (from CLAUDE.md): `bmz-UID2-XXXX-<short-desc>` once Jira tickets exist.

---

## File structure overview

Per spec item, the new/modified files are:

```
uid2-self-serve-portal/
├── src/api/
│   ├── identity.ts                                    [NEW]  Backend identity helper (Task 4a)
│   ├── envars.ts                                      [MOD]  Add SSP_PORTAL_IDENTITY (Task 4a)
│   ├── configureApi.ts                                [MOD]  Wire /api/config endpoint (Task 4b)
│   ├── routers/configRouter.ts                        [NEW]  /api/config endpoint (Task 4b)
│   ├── services/
│   │   ├── sendGridService.ts                         [MOD]  Short-circuit for EUID (Task 11)
│   │   └── emailService.ts                            [MOD]  Same                     (Task 11)
│   └── tests/
│       ├── identity.spec.ts                           [NEW]  Backend identity tests (Task 4a, 19)
│       └── configRouter.spec.ts                       [NEW]  /api/config tests       (Task 4b)
├── src/web/
│   ├── utils/identity.ts                              [NEW]  Frontend identity mirror (Task 4c)
│   ├── screens/dashboard.tsx                          [MOD]  Route hiding for EUID    (Task 16)
│   ├── components/TermsAndConditions/
│   │   └── TermsAndConditionsDialog.tsx               [MOD]  Skip when isEuid()       (Task 17)
│   └── (many screen + nav files)                      [MOD]  Wire productName() / docsBaseUrl() (Tasks 14, 15)
├── public/
│   ├── euid-logo.svg                                  [NEW]  Placeholder              (Task 13)
│   ├── euid-logo-darkmode.svg                         [NEW]  Placeholder              (Task 13)
│   └── euid-favicon.ico                               [NEW]  Placeholder              (Task 13)
├── keycloak/realm/
│   └── realm-export-euid.json                         [NEW]  EUID Keycloak realm      (Task 8)
├── docker-compose.yml                                 [MOD]  SSP_PORTAL_IDENTITY var  (Task 18)
└── README.md                                          [MOD]  Document dual-identity   (Task 21)

uid2-admin/
└── src/main/java/com/uid2/admin/auth/
    └── OktaCustomScope.java                           [MOD]  Add EUID_SS_PORTAL enum  (Task 2)

uid2-terraform-modules/templates/uid-ssportal-template/
├── variables.tf                                       [MOD]  Relax solution validation (Task 5)
├── alb-auth.tf  (or equivalent)                       [MOD]  Per-solution domains     (Task 6)
└── (Route53/ACM .tf files)                            [MOD]  Per-solution domains     (Task 6)

<EUID infra repo>/
└── stacks/euid-core-integ/ssportal/                   [NEW]  Instantiate template     (Task 7)

uid2-deployment/
└── (argocd app definitions for EUID-integ)            [NEW]  Wire EUID pipeline       (Task 9)
```

---

# STAGE A — Prep + cross-team deps (parallelisable)

## Task 1: Submit Okta SSO ticket for the EUID portal app integration

**Files:** None (manual request via internal IT/Okta portal)

- [ ] **Step 1: Open the SSO request ticket**

Submit a request to the Okta SSO admin team for a new Okta app integration:
- **Tenant:** uid2.okta.com
- **App name:** `euid-ssportal`
- **App type:** Machine-to-machine (client credentials grant), same shape as the existing `uid2-ssportal` app
- **Required scope:** `euid.admin.ss-portal`
- **Audience:** the existing EUID admin service in `euid-core-integ`
- **Group assignment:** same TAM group used by `uid2-ssportal` (no new groups needed per spec decision)
- **Returned to us:** client ID + client secret (capture in Secrets Manager in `euid-core-integ`, secret name `euid-ssportal/okta-credentials`)

This is the only blocking external dep; submit on day one.

- [ ] **Step 2: Record the ticket ID**

Note the ticket URL in the Jira epic and in the spec page's "Open items" section. Treat as non-blocking for backend work; needed before Stage D acceptance test.

---

## Task 2: Add `EUID_SS_PORTAL` Okta scope to uid2-admin

**Files:**
- Modify: `uid2-admin/src/main/java/com/uid2/admin/auth/OktaCustomScope.java`
- Test: `uid2-admin/src/test/java/com/uid2/admin/auth/OktaCustomScopeTest.java` (create if absent)

- [ ] **Step 1: Read the existing enum and find the test file pattern**

```bash
cd ~/Library/CloudStorage/OneDrive-TheTradeDesk/Documents/GitHub/uid2-admin
cat src/main/java/com/uid2/admin/auth/OktaCustomScope.java
find src/test -name 'OktaCustomScope*' -o -name 'AdminAuth*'
```

Expected: see the single-line enum entry `SS_PORTAL("uid2.admin.ss-portal", Role.SHARING_PORTAL)` plus a `fromName(String)` lookup.

- [ ] **Step 2: Write the failing test**

Create or extend `src/test/java/com/uid2/admin/auth/OktaCustomScopeTest.java`:

```java
package com.uid2.admin.auth;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class OktaCustomScopeTest {
    @Test
    void euidSsPortalScopeIsRecognised() {
        OktaCustomScope scope = OktaCustomScope.fromName("euid.admin.ss-portal");
        assertNotNull(scope);
        assertEquals(Role.SHARING_PORTAL, scope.getRole());
    }
}
```

- [ ] **Step 3: Run test and verify it fails**

```bash
./gradlew test --tests OktaCustomScopeTest.euidSsPortalScopeIsRecognised
```

Expected: FAIL — `fromName("euid.admin.ss-portal")` returns null.

- [ ] **Step 4: Add the enum entry**

Edit `src/main/java/com/uid2/admin/auth/OktaCustomScope.java`. Add the new entry right after `SS_PORTAL`:

```java
public enum OktaCustomScope {
    SS_PORTAL("uid2.admin.ss-portal", Role.SHARING_PORTAL),
    EUID_SS_PORTAL("euid.admin.ss-portal", Role.SHARING_PORTAL);
    // ... existing fields and methods unchanged
}
```

- [ ] **Step 5: Run test and verify it passes**

```bash
./gradlew test --tests OktaCustomScopeTest.euidSsPortalScopeIsRecognised
```

Expected: PASS.

- [ ] **Step 6: Run the full uid2-admin test suite**

```bash
./gradlew test
```

Expected: PASS (no regressions in `AdminAuthMiddlewareTest`, etc.).

- [ ] **Step 7: Commit and open PR**

```bash
git checkout -b bmz-UID2-XXXX-euid-okta-scope
git add src/main/java/com/uid2/admin/auth/OktaCustomScope.java src/test/java/com/uid2/admin/auth/OktaCustomScopeTest.java
git commit -m "UID2-XXXX: accept euid.admin.ss-portal Okta scope"
git push -u origin bmz-UID2-XXXX-euid-okta-scope
gh pr create --title "UID2-XXXX: accept euid.admin.ss-portal Okta scope" --body "Adds enum entry for the EUID portal M2M client. See spec: https://thetradedesk.atlassian.net/wiki/spaces/UID2/pages/1724874898"
```

- [ ] **Step 8: After merge, confirm deployed to euid-core-integ**

Once the PR merges, the existing uid2-admin deploy pipeline rolls out to all environments. Verify the EUID admin pod in `euid-core-integ` is running the new image by checking the pod's image tag against the merged commit.

---

## Task 3: Verify EUID admin service URL and network reachability

**Files:** None (investigation only; documents findings in the spec page)

- [ ] **Step 1: Discover the EUID admin service URL**

```bash
ttd kubeinfo get services -c euid-core-integ -n uid2-admin 2>&1 | head
```

(Or equivalent — refer to the kpop:kubernetes-access skill for the exact lookup.)

Expected: a stable internal hostname like `http://uid2-admin.uid2-admin.svc.cluster.local:8089` or an external ALB hostname.

- [ ] **Step 2: Probe network reachability from the ssportal namespace**

Once you know the URL, from a pod in the same cluster (or via a temporary debug pod), curl the health endpoint:

```bash
kubectl run -n ssportal --rm -it --image=curlimages/curl debug --restart=Never -- curl -s -o /dev/null -w "%{http_code}\n" http://<admin-url>/api/site/list
```

Expected: 401 (unauthenticated) — confirms reachability. A network error means an NS policy or security group is blocking; raise a networking ticket before proceeding to Stage B.

- [ ] **Step 3: Record findings in spec**

Append a note to the spec page's "References" section: `EUID admin service URL (integ): <url>` and the reachability test result. No commit.

---

## Task 4a: Backend identity helper + env var

**Files:**
- Create: `src/api/identity.ts`
- Modify: `src/api/envars.ts`
- Test: `src/api/tests/identity.spec.ts`

- [ ] **Step 1: Inspect existing envars**

```bash
cd ~/Library/CloudStorage/OneDrive-TheTradeDesk/Documents/GitHub/uid2-self-serve-portal
git checkout -b bmz-UID2-XXXX-euid-identity-helper
sed -n '1,80p' src/api/envars.ts
```

Look at the existing env-var export style — most projects use a `getEnv(name, default)` helper or `process.env.X` reads.

- [ ] **Step 2: Write the failing identity test**

Create `src/api/tests/identity.spec.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { productName, docsBaseUrl, keycloakRealm, isEuid, isUid2 } from '../identity';

describe('identity helper', () => {
  const originalIdentity = process.env.SSP_PORTAL_IDENTITY;
  afterEach(() => { process.env.SSP_PORTAL_IDENTITY = originalIdentity; });

  describe('when SSP_PORTAL_IDENTITY is UID2 (default)', () => {
    beforeEach(() => { delete process.env.SSP_PORTAL_IDENTITY; });
    it('reports UID2', () => {
      expect(isUid2()).toBe(true);
      expect(isEuid()).toBe(false);
      expect(productName()).toBe('UID2');
      expect(docsBaseUrl()).toBe('https://unifiedid.com/docs/intro');
      expect(keycloakRealm()).toBe('self-serve-portal');
    });
  });

  describe('when SSP_PORTAL_IDENTITY is EUID', () => {
    beforeEach(() => { process.env.SSP_PORTAL_IDENTITY = 'EUID'; });
    it('reports EUID', () => {
      expect(isEuid()).toBe(true);
      expect(isUid2()).toBe(false);
      expect(productName()).toBe('EUID');
      expect(docsBaseUrl()).toBe('https://euid.eu/docs/intro');
      expect(keycloakRealm()).toBe('euid-self-serve-portal');
    });
  });

  describe('when SSP_PORTAL_IDENTITY is unrecognised', () => {
    beforeEach(() => { process.env.SSP_PORTAL_IDENTITY = 'BOGUS'; });
    it('throws on identity check', () => {
      expect(() => productName()).toThrow(/SSP_PORTAL_IDENTITY/);
    });
  });
});
```

- [ ] **Step 3: Run the test and verify it fails**

```bash
npx jest src/api/tests/identity.spec.ts
```

Expected: FAIL — `identity.ts` does not exist.

- [ ] **Step 4: Implement `src/api/identity.ts`**

```typescript
type Identity = 'UID2' | 'EUID';

const KNOWN: readonly Identity[] = ['UID2', 'EUID'];

export function currentIdentity(): Identity {
  const raw = process.env.SSP_PORTAL_IDENTITY ?? 'UID2';
  if (!KNOWN.includes(raw as Identity)) {
    throw new Error(`SSP_PORTAL_IDENTITY must be one of ${KNOWN.join('|')} (got: ${raw})`);
  }
  return raw as Identity;
}

export const isUid2 = () => currentIdentity() === 'UID2';
export const isEuid = () => currentIdentity() === 'EUID';

export function productName(): string {
  return isEuid() ? 'EUID' : 'UID2';
}

export function docsBaseUrl(): string {
  return isEuid() ? 'https://euid.eu/docs/intro' : 'https://unifiedid.com/docs/intro';
}

export function keycloakRealm(): string {
  return isEuid() ? 'euid-self-serve-portal' : 'self-serve-portal';
}

export function logoAsset(variant: 'light' | 'dark' = 'light'): string {
  const suffix = variant === 'dark' ? '-darkmode' : '';
  return isEuid() ? `/euid-logo${suffix}.svg` : `/uid2-logo${suffix}.svg`;
}
```

- [ ] **Step 5: Run test and verify it passes**

```bash
npx jest src/api/tests/identity.spec.ts
```

Expected: PASS.

- [ ] **Step 6: Register the env var in `envars.ts`**

Add to `src/api/envars.ts` (mirror existing pattern; example assuming a typed config object):

```typescript
// Append to the existing exported config object
portalIdentity: process.env.SSP_PORTAL_IDENTITY ?? 'UID2',
```

(If `envars.ts` only declares strings, simply re-export the helper from `identity.ts`. Inspect the actual file to choose the closest pattern.)

- [ ] **Step 7: Commit**

```bash
git add src/api/identity.ts src/api/tests/identity.spec.ts src/api/envars.ts
git commit -m "UID2-XXXX: add backend identity helper (defaults to UID2, no behaviour change)"
```

---

## Task 4b: `/api/config` endpoint for the frontend

**Files:**
- Create: `src/api/routers/configRouter.ts`
- Modify: `src/api/configureApi.ts`
- Test: `src/api/tests/configRouter.spec.ts`

- [ ] **Step 1: Inspect existing router registration**

```bash
grep -n "Router\|app.use\|app.get" src/api/configureApi.ts | head -30
```

Look for the pattern other routers are mounted (e.g., `app.use('/api/...', someRouter)`).

- [ ] **Step 2: Write failing test**

Create `src/api/tests/configRouter.spec.ts`:

```typescript
import request from 'supertest';
import express from 'express';
import { configRouter } from '../routers/configRouter';

describe('GET /api/config', () => {
  const app = express();
  app.use('/api/config', configRouter);

  afterEach(() => { delete process.env.SSP_PORTAL_IDENTITY; });

  it('returns UID2 config by default', async () => {
    const res = await request(app).get('/api/config').expect(200);
    expect(res.body).toEqual({
      identity: 'UID2',
      productName: 'UID2',
      docsBaseUrl: 'https://unifiedid.com/docs/intro',
      logo: { light: '/uid2-logo.svg', dark: '/uid2-logo-darkmode.svg' },
    });
  });

  it('returns EUID config when identity=EUID', async () => {
    process.env.SSP_PORTAL_IDENTITY = 'EUID';
    const res = await request(app).get('/api/config').expect(200);
    expect(res.body.identity).toBe('EUID');
    expect(res.body.docsBaseUrl).toBe('https://euid.eu/docs/intro');
    expect(res.body.logo.light).toBe('/euid-logo.svg');
  });
});
```

- [ ] **Step 3: Run and verify failure**

```bash
npx jest src/api/tests/configRouter.spec.ts
```

Expected: FAIL — `configRouter` not exported.

- [ ] **Step 4: Implement `src/api/routers/configRouter.ts`**

```typescript
import { Router } from 'express';
import { currentIdentity, productName, docsBaseUrl, logoAsset } from '../identity';

export const configRouter = Router();

configRouter.get('/', (_req, res) => {
  res.json({
    identity: currentIdentity(),
    productName: productName(),
    docsBaseUrl: docsBaseUrl(),
    logo: { light: logoAsset('light'), dark: logoAsset('dark') },
  });
});
```

- [ ] **Step 5: Mount in `configureApi.ts`**

Edit `src/api/configureApi.ts`. Add near other router mounts:

```typescript
import { configRouter } from './routers/configRouter';
// ...
app.use('/api/config', configRouter);
```

The endpoint is unauthenticated by design — it only returns non-secret identity branding.

- [ ] **Step 6: Run test, verify pass**

```bash
npx jest src/api/tests/configRouter.spec.ts
```

Expected: PASS (both cases).

- [ ] **Step 7: Commit**

```bash
git add src/api/routers/configRouter.ts src/api/tests/configRouter.spec.ts src/api/configureApi.ts
git commit -m "UID2-XXXX: add /api/config endpoint for frontend identity bootstrap"
```

---

## Task 4c: Frontend identity helper

**Files:**
- Create: `src/web/utils/identity.ts`
- Test: `src/web/utils/identity.test.tsx` (extension matches existing frontend tests — verify with `find src/web -name "*.test.*" | head`)

- [ ] **Step 1: Confirm frontend test runner**

```bash
grep -E '"test"|"jest"|"vitest"' package.json | head
find src/web -maxdepth 4 -name "*.test.*" -o -name "*.spec.*" | head -5
```

Expected: see `"test": "jest --config=jest.config.web.js"` (or similar). Use the matching extension below.

- [ ] **Step 2: Write failing test**

Create `src/web/utils/identity.test.tsx`:

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useIdentityConfig, IdentityConfigProvider } from './identity';

const wrap = (config: any): React.FC<{children: React.ReactNode}> =>
  ({ children }) => <IdentityConfigProvider value={config}>{children}</IdentityConfigProvider>;

describe('useIdentityConfig', () => {
  it('exposes the provided config', () => {
    const { result } = renderHook(() => useIdentityConfig(), {
      wrapper: wrap({ identity: 'EUID', productName: 'EUID', docsBaseUrl: 'https://euid.eu/docs/intro', logo: { light: '/euid-logo.svg', dark: '/euid-logo-darkmode.svg' } }),
    });
    expect(result.current.productName).toBe('EUID');
    expect(result.current.isEuid).toBe(true);
  });

  it('throws when used outside provider', () => {
    expect(() => renderHook(() => useIdentityConfig())).toThrow(/IdentityConfigProvider/);
  });
});
```

- [ ] **Step 3: Run, verify fail**

```bash
npx jest src/web/utils/identity.test.tsx
```

Expected: FAIL.

- [ ] **Step 4: Implement `src/web/utils/identity.ts`**

```typescript
import React, { createContext, useContext, ReactNode } from 'react';

export type IdentityConfig = {
  identity: 'UID2' | 'EUID';
  productName: string;
  docsBaseUrl: string;
  logo: { light: string; dark: string };
  isUid2: boolean;
  isEuid: boolean;
};

const IdentityContext = createContext<IdentityConfig | null>(null);

type RawConfig = Omit<IdentityConfig, 'isUid2' | 'isEuid'>;

export const IdentityConfigProvider: React.FC<{ value: RawConfig; children: ReactNode }> = ({ value, children }) => {
  const enriched: IdentityConfig = {
    ...value,
    isUid2: value.identity === 'UID2',
    isEuid: value.identity === 'EUID',
  };
  return <IdentityContext.Provider value={enriched}>{children}</IdentityContext.Provider>;
};

export function useIdentityConfig(): IdentityConfig {
  const ctx = useContext(IdentityContext);
  if (!ctx) throw new Error('useIdentityConfig must be used inside IdentityConfigProvider');
  return ctx;
}

export async function fetchIdentityConfig(): Promise<RawConfig> {
  const res = await fetch('/api/config');
  if (!res.ok) throw new Error(`/api/config returned ${res.status}`);
  return res.json();
}
```

- [ ] **Step 5: Wire the provider into the app root**

Find the app root (likely `src/web/App.tsx` or `src/web/main.tsx`). Add at the top of the component tree:

```typescript
import { IdentityConfigProvider, fetchIdentityConfig } from './utils/identity';
// inside App, before rendering routes:
const [config, setConfig] = useState<RawConfig | null>(null);
useEffect(() => { fetchIdentityConfig().then(setConfig); }, []);
if (!config) return <LoadingSplash />;
return <IdentityConfigProvider value={config}>{/* existing tree */}</IdentityConfigProvider>;
```

(If the project uses a different state-fetching pattern — e.g., react-query — adapt to match.)

- [ ] **Step 6: Run frontend tests**

```bash
npx jest src/web/utils/identity.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit + push + open scaffolding PR**

```bash
git add src/web/utils/identity.ts src/web/utils/identity.test.tsx src/web/App.tsx
git commit -m "UID2-XXXX: add frontend identity context and /api/config bootstrap"
git push -u origin bmz-UID2-XXXX-euid-identity-helper
gh pr create --title "UID2-XXXX: EUID portal scaffolding (identity helper + /api/config)" \
  --body "Scaffolding only. Defaults to UID2 — zero UID2 behaviour change. Phase 0 prep for EUID portal MVP (https://thetradedesk.atlassian.net/wiki/spaces/UID2/pages/1724874898)."
```

This PR is safe to merge before the EUID stack exists.

---

# STAGE B — EUID integ stack stood up, dark

> All Stage B tasks happen in the terraform + deployment repos, not in `uid2-self-serve-portal`. The portal code from Stage A keeps its UID2 default and is unaffected.

## Task 5: Relax `solution` validation in `uid-ssportal-template`

**Files:**
- Modify: `uid2-terraform-modules/templates/uid-ssportal-template/variables.tf`

- [ ] **Step 1: Clone or update the repo**

```bash
cd ~/Library/CloudStorage/OneDrive-TheTradeDesk/Documents/GitHub
[ -d uid2-terraform-modules ] || gh repo clone UnifiedID2/uid2-terraform-modules
cd uid2-terraform-modules
git checkout main && git pull
git checkout -b bmz-UID2-XXXX-euid-ssportal-template
```

- [ ] **Step 2: Locate the `solution` variable**

```bash
grep -n "solution" templates/uid-ssportal-template/variables.tf
```

Expected: a `variable "solution"` block with a `validation { condition = contains(["uid2"], var.solution) ... }`.

- [ ] **Step 3: Modify the validation**

Edit `templates/uid-ssportal-template/variables.tf`:

```hcl
variable "solution" {
  description = "Which portal product this deployment hosts"
  type        = string
  validation {
    condition     = contains(["uid2", "euid"], var.solution)
    error_message = "solution must be uid2 or euid"
  }
}
```

- [ ] **Step 4: Validate with terraform fmt + validate (locally)**

```bash
cd templates/uid-ssportal-template
terraform fmt
terraform init -backend=false
terraform validate
```

Expected: `Success!`.

- [ ] **Step 5: Commit**

```bash
cd ~/Library/CloudStorage/OneDrive-TheTradeDesk/Documents/GitHub/uid2-terraform-modules
git add templates/uid-ssportal-template/variables.tf
git commit -m "UID2-XXXX: accept solution=euid in uid-ssportal-template"
```

---

## Task 6: Per-solution domain logic in the template

**Files:**
- Modify: terraform files in `templates/uid-ssportal-template/` that reference the public domain (ACM cert, Route53 record, ALB listener). Likely candidates: `alb.tf`, `alb-auth.tf`, `route53.tf`, `acm.tf`, `locals.tf`.

- [ ] **Step 1: Find every reference to the existing portal hostname**

```bash
cd ~/Library/CloudStorage/OneDrive-TheTradeDesk/Documents/GitHub/uid2-terraform-modules/templates/uid-ssportal-template
grep -rn "portal\.\(integ\.\)\?\(unifiedid\.com\|test\.unifiedid\.com\)\|auth\.portal" .
```

Expected: a handful of references in ALB, Route53, ACM, and possibly locals. Capture the file:line list.

- [ ] **Step 2: Introduce a `locals.tf` block for per-solution domains**

In `templates/uid-ssportal-template/locals.tf` (create if absent):

```hcl
locals {
  domain_root = {
    uid2 = {
      prod  = "portal.unifiedid.com"
      integ = "portal.integ.unifiedid.com"
      test  = "portal.test.unifiedid.com"
    }
    euid = {
      prod  = "portal.euid.eu"
      integ = "portal.integ.euid.eu"
      test  = "portal.test.euid.eu"
    }
  }
  portal_domain = local.domain_root[var.solution][var.environment]
  auth_domain   = "auth.${local.portal_domain}"
}
```

- [ ] **Step 3: Replace hardcoded hostnames with `local.portal_domain` / `local.auth_domain`**

For each file:line from Step 1, change strings like `"portal.integ.unifiedid.com"` to `local.portal_domain` (and `"auth.portal.integ.unifiedid.com"` to `local.auth_domain`). Example for an ACM resource:

```hcl
resource "aws_acm_certificate" "portal" {
  domain_name       = local.portal_domain
  subject_alternative_names = [local.auth_domain]
  validation_method = "DNS"
  # ...
}
```

- [ ] **Step 4: `terraform validate` + `tflint` if available**

```bash
terraform init -backend=false
terraform validate
```

Expected: `Success!`.

- [ ] **Step 5: Commit**

```bash
git add templates/uid-ssportal-template/
git commit -m "UID2-XXXX: per-solution domain locals in uid-ssportal-template"
```

- [ ] **Step 6: Push branch and open PR**

```bash
git push -u origin bmz-UID2-XXXX-euid-ssportal-template
gh pr create --title "UID2-XXXX: ssportal template supports solution=euid" \
  --body "Relaxes solution validation and introduces per-solution domain locals. No effect on UID2 deploys. Spec: https://thetradedesk.atlassian.net/wiki/spaces/UID2/pages/1724874898"
```

---

## Task 7: Instantiate the EUID integ stack

**Files:**
- Create: new root configuration that consumes `uid-ssportal-template` with `solution = "euid"` and `environment = "integ"`. Location: in whatever infra repo the team uses for EUID stacks (likely `uid2-terraform-deployment` or a sibling). Confirm by searching for the existing `uid2/integ` instantiation:

```bash
gh search code "module \"ssportal\"" --owner UnifiedID2 | head
gh search code "uid-ssportal-template" --owner UnifiedID2 | head
```

- [ ] **Step 1: Locate the existing UID2 integ instantiation**

Use the search results from above. Open the file (e.g., `stacks/uid2/integ/ssportal/main.tf`).

- [ ] **Step 2: Clone the pattern for EUID integ**

Create a new directory mirroring the UID2 integ layout (path depends on the repo's conventions; assumed `stacks/euid/integ/ssportal/`):

```hcl
# stacks/euid/integ/ssportal/main.tf
terraform {
  backend "s3" {
    bucket = "euid-terraform-state-integ"  # confirm exact bucket name with infra team
    key    = "ssportal/terraform.tfstate"
    region = "eu-west-1"
  }
}

provider "aws" {
  region = "eu-west-1"
  assume_role { role_arn = "arn:aws:iam::<euid-core-integ-account-id>:role/TerraformDeploy" }
}

module "ssportal" {
  source      = "../../../../templates/uid-ssportal-template"
  solution    = "euid"
  environment = "integ"
  # mirror the variable set from the UID2 integ stack
  vpc_id           = data.aws_vpc.main.id
  private_subnets  = data.aws_subnets.private.ids
  # ... etc — copy from UID2 integ instantiation
}
```

The exact variable set is whatever the template requires; do not invent values, mirror the UID2 stack and substitute EUID-specific ones (AWS account, region, VPC IDs).

- [ ] **Step 3: `terraform init` + `terraform plan`**

```bash
cd stacks/euid/integ/ssportal
terraform init
terraform plan -out=plan.out
```

Expected: a plan that creates RDS, ALB, ACM cert (for `portal.integ.euid.eu` and `auth.portal.integ.euid.eu`), KMS keys, Secrets Manager entries, EKS addons. **Review the plan carefully** — confirm no resources are being modified or destroyed in `uid2-core-integ`.

- [ ] **Step 4: Submit the Route53 / DNS change ticket for `*.integ.euid.eu`**

If the EUID DNS zone is managed centrally, you may need a separate request to create the `portal.integ.euid.eu` CNAME → ALB DNS. Include in the same PR's description.

- [ ] **Step 5: Apply (after PR review)**

```bash
terraform apply plan.out
```

Expected: all resources created. Note the ALB DNS name and confirm cert validation.

- [ ] **Step 6: Verify external resolution**

```bash
dig +short portal.integ.euid.eu
curl -sIk https://portal.integ.euid.eu/ | head -3
```

Expected: A/CNAME resolves; HTTP returns 503 or default ALB response (no backend pods yet — that's Task 9).

- [ ] **Step 7: Commit + PR**

```bash
git add stacks/euid/integ/ssportal/
git commit -m "UID2-XXXX: stand up EUID ssportal integ stack"
git push -u origin bmz-UID2-XXXX-euid-integ-stack
gh pr create --title "UID2-XXXX: EUID ssportal integ stack" --body "Spec: https://thetradedesk.atlassian.net/wiki/spaces/UID2/pages/1724874898"
```

---

## Task 8: EUID Keycloak realm export

**Files:**
- Create: `uid2-self-serve-portal/keycloak/realm/realm-export-euid.json`

- [ ] **Step 1: Read the existing realm export to understand the structure**

```bash
cd ~/Library/CloudStorage/OneDrive-TheTradeDesk/Documents/GitHub/uid2-self-serve-portal
git checkout main && git pull
git checkout -b bmz-UID2-XXXX-euid-keycloak-realm
jq '.realm, .registrationAllowed, .identityProviders[].alias, .roles.realm[].name' keycloak/realm/realm-export.json
```

Expected: realm name `self-serve-portal`, an `okta` IdP alias, and realm roles including `developer`, `developer-elevated`, `uid2-support`.

- [ ] **Step 2: Copy realm-export.json to realm-export-euid.json**

```bash
cp keycloak/realm/realm-export.json keycloak/realm/realm-export-euid.json
```

- [ ] **Step 3: Edit the new file: realm name, Okta IdP, registration**

In `realm-export-euid.json`, change:

```json
{
  "realm": "euid-self-serve-portal",
  "registrationAllowed": false,
  "registrationEmailAsUsername": false,
  "rememberMe": true,
  "verifyEmail": false,
  ...
  "identityProviders": [
    {
      "alias": "okta",
      "providerId": "oidc",
      "enabled": true,
      "trustEmail": true,
      "config": {
        "clientId": "<euid-portal-okta-client-id>",
        "clientSecret": "${vault.euid_okta_client_secret}",
        "authorizationUrl": "https://uid2.okta.com/oauth2/<authserver>/v1/authorize",
        "tokenUrl": "https://uid2.okta.com/oauth2/<authserver>/v1/token",
        "userInfoUrl": "https://uid2.okta.com/oauth2/<authserver>/v1/userinfo",
        "defaultScope": "openid email profile groups"
      }
    }
  ],
  "roles": {
    "realm": [
      { "name": "developer" },
      { "name": "developer-elevated" },
      { "name": "uid2-support" }
    ]
  }
}
```

Remove any local user entries from the export (the `users` array should be empty or omitted). Keep the IdP-mapper for the TAM group → `uid2-support` role assignment identical to UID2's.

- [ ] **Step 4: Test the realm import locally**

Use the existing docker-compose Keycloak setup with the new file:

```bash
KEYCLOAK_REALM_IMPORT=keycloak/realm/realm-export-euid.json docker-compose up keycloak
```

(Adjust to whatever env var or volume mount the existing setup uses.) Wait until ready, then:

```bash
curl -s http://localhost:18080/realms/euid-self-serve-portal/.well-known/openid-configuration | jq '.issuer'
```

Expected: `"http://localhost:18080/realms/euid-self-serve-portal"`.

- [ ] **Step 5: Commit**

```bash
git add keycloak/realm/realm-export-euid.json
git commit -m "UID2-XXXX: add EUID Keycloak realm export (TAM-only, Okta IdP, no registration)"
```

---

## Task 9: Extend uid2-deployment ArgoCD pipeline for EUID-integ

**Files:**
- New ArgoCD manifests in the `uid2-deployment` repo, mirroring whatever the existing UID2 ssportal app definition looks like.

- [ ] **Step 1: Find the existing UID2 ssportal ArgoCD manifest**

```bash
cd ~/Library/CloudStorage/OneDrive-TheTradeDesk/Documents/GitHub
[ -d uid2-deployment ] || gh repo clone IABTechLab/uid2-deployment
cd uid2-deployment
git checkout main && git pull
grep -rln "ssportal\|self-serve-portal" --include="*.yaml" | head
```

Expected: ArgoCD Application or Kustomize files defining the UID2 ssportal deployment.

- [ ] **Step 2: Clone the manifest set for EUID integ**

Make a new branch:

```bash
git checkout -b bmz-UID2-XXXX-euid-ssportal-deployment
```

Copy the UID2 integ ssportal app manifest tree (assumed under `argocd/applications/uid2/integ/ssportal/`) to `argocd/applications/euid/integ/ssportal/`. In every YAML, replace:

- `cluster: uid2-core-integ` → `cluster: euid-core-integ`
- The image is the same (`uid2-self-serve-portal:<tag>`), but env config overrides change:
  - `SSP_PORTAL_IDENTITY=EUID`
  - `SSP_DB_HOST=<euid integ RDS endpoint>`
  - `SSP_ADMIN_SERVICE_BASE_URL=<EUID admin service URL from Task 3>`
  - `SSP_KK_REALM=euid-self-serve-portal`
  - `SSP_ADMIN_OKTA_CLIENT_ID=<from Okta ticket, Task 1>`
  - `SSP_ADMIN_OKTA_SCOPE=euid.admin.ss-portal`
  - `SSP_APP_NAME=euid-ssportal`
  - all DB/Keycloak secrets sourced from EUID Secrets Manager

- [ ] **Step 3: Add the Keycloak realm import config**

The existing UID2 manifest mounts `realm-export.json` into the Keycloak pod. The EUID app definition needs to mount `realm-export-euid.json` instead — same image, different mount.

- [ ] **Step 4: ArgoCD app diff (dry-run)**

If ArgoCD CLI is available:

```bash
argocd app diff euid-integ-ssportal --local argocd/applications/euid/integ/ssportal/
```

Expected: shows resource creation, no destroys against existing apps.

- [ ] **Step 5: Commit + PR**

```bash
git add argocd/applications/euid/integ/ssportal/
git commit -m "UID2-XXXX: ArgoCD app for euid-integ ssportal"
git push -u origin bmz-UID2-XXXX-euid-ssportal-deployment
gh pr create --title "UID2-XXXX: deploy ssportal to euid-core-integ" \
  --body "Same image as UID2 portal, EUID config + EUID Keycloak realm. Spec: https://thetradedesk.atlassian.net/wiki/spaces/UID2/pages/1724874898"
```

- [ ] **Step 6: After merge, verify ArgoCD sync**

Once merged, ArgoCD picks up the new app. Confirm pods are running:

```bash
ttd kubeinfo get pods -c euid-core-integ -n ssportal
```

Expected: portal + Keycloak + migration pods in `Running` or `Completed` state.

---

## Task 10: First-deploy migration smoke

**Files:** None directly modified — this is a verification step.

- [ ] **Step 1: Tail the migration job logs**

```bash
ttd kubeinfo logs -c euid-core-integ -n ssportal job/ssportal-migrations
```

Expected: knex migrations run from 0 → latest; no errors; reference-data tables populated (`participantTypes`, `apiRoles`, `userRoles` with rows including "UID2 Support" — left as-is per spec decision).

- [ ] **Step 2: Connect to the EUID RDS read-only and verify rows**

(Use the existing UID2 Portal Database Access Guide — same pattern, different account/host.)

```sql
SELECT COUNT(*) FROM participantTypes;  -- expect 4
SELECT COUNT(*) FROM apiRoles;          -- expect 5
SELECT name FROM userRoles;             -- expect Admin, Operations, UID2 Support
```

- [ ] **Step 3: HTTP probe**

```bash
curl -sIk https://portal.integ.euid.eu/ | head -5
```

Expected: 200 (or 302 redirect to Keycloak login). Page loads with UID2 branding *for now* (frontend identity work is still pending in Stage C).

- [ ] **Step 4: Document smoke results in the spec page**

Append a "Stage B verified" note with the date and observed state.

---

# STAGE C — Identity-mode wiring + EUID-aware UI

> All Stage C tasks happen in `uid2-self-serve-portal`. The portal is now reachable at `portal.integ.euid.eu` but still rendering UID2 branding. These tasks make it actually look and behave EUID.

## Task 11: Email short-circuit when `isEuid()`

**Files:**
- Modify: `src/api/services/sendGridService.ts`
- Modify: `src/api/services/emailService.ts`
- Test: `src/api/tests/emailService.spec.ts` (new)

- [ ] **Step 1: Read the existing email services**

```bash
sed -n '1,80p' src/api/services/sendGridService.ts
sed -n '1,80p' src/api/services/emailService.ts
```

Identify the public function(s) callers invoke (likely `sendEmail(to, subject, body)` or per-purpose helpers like `sendInvitation(...)`).

- [ ] **Step 2: Write failing test**

Create `src/api/tests/emailService.spec.ts`:

```typescript
import { sendEmail } from '../services/emailService';
import * as sendGrid from '../services/sendGridService';

jest.mock('../services/sendGridService');

describe('sendEmail under SSP_PORTAL_IDENTITY=EUID', () => {
  beforeEach(() => { process.env.SSP_PORTAL_IDENTITY = 'EUID'; jest.clearAllMocks(); });
  afterEach(() => { delete process.env.SSP_PORTAL_IDENTITY; });

  it('does NOT invoke SendGrid', async () => {
    await sendEmail({ to: 'tam@example.com', subject: 'hi', body: 'hi' });
    expect(sendGrid.send).not.toHaveBeenCalled();
  });

  it('returns a "skipped" indicator', async () => {
    const result = await sendEmail({ to: 'tam@example.com', subject: 'hi', body: 'hi' });
    expect(result).toMatchObject({ status: 'skipped', reason: /EUID MVP/ });
  });
});

describe('sendEmail under SSP_PORTAL_IDENTITY=UID2', () => {
  beforeEach(() => { delete process.env.SSP_PORTAL_IDENTITY; jest.clearAllMocks(); });
  it('invokes SendGrid', async () => {
    (sendGrid.send as jest.Mock).mockResolvedValue({ status: 'sent' });
    await sendEmail({ to: 't@example.com', subject: 's', body: 'b' });
    expect(sendGrid.send).toHaveBeenCalled();
  });
});
```

- [ ] **Step 3: Run, verify fail**

```bash
npx jest src/api/tests/emailService.spec.ts
```

Expected: FAIL on the EUID test cases (current code calls SendGrid unconditionally).

- [ ] **Step 4: Add the short-circuit**

In `src/api/services/emailService.ts`, at the top of every public send function (or at a single dispatch point if one exists):

```typescript
import { isEuid } from '../identity';
import logger from '../helpers/logger';  // or whatever the existing logger import is

export async function sendEmail(args: SendEmailArgs): Promise<SendResult> {
  if (isEuid()) {
    logger.info({ to: args.to, subject: args.subject }, 'email skipped (EUID MVP)');
    return { status: 'skipped', reason: 'EUID MVP — no outbound email' };
  }
  // existing implementation continues unchanged
  return sendGrid.send(args);
}
```

If there are multiple entry points (`sendInvitation`, `sendPasswordReset`, etc.), repeat the guard at the top of each. Do not edit `sendGridService.ts` — keep the SendGrid client itself unchanged; the guard belongs in the dispatcher.

- [ ] **Step 5: Run, verify pass**

```bash
npx jest src/api/tests/emailService.spec.ts
```

Expected: PASS.

- [ ] **Step 6: Run the full backend test suite**

```bash
npm run test-api
```

Expected: no regressions.

- [ ] **Step 7: Commit**

```bash
git checkout -b bmz-UID2-XXXX-euid-email-short-circuit
git add src/api/services/emailService.ts src/api/tests/emailService.spec.ts
git commit -m "UID2-XXXX: short-circuit outbound email when isEuid()"
```

---

## Task 12: adminServiceClient identity-mode tests (verification only)

**Files:**
- Test: `src/api/tests/adminServiceClient.identity.spec.ts` (new)

The client itself is already env-driven; we only add tests that the right URL is dialled.

- [ ] **Step 1: Write the verification test**

Create `src/api/tests/adminServiceClient.identity.spec.ts`:

```typescript
import nock from 'nock';
import { listSites } from '../services/adminServiceClient';

describe('adminServiceClient honours SSP_ADMIN_SERVICE_BASE_URL', () => {
  afterEach(() => { nock.cleanAll(); delete process.env.SSP_ADMIN_SERVICE_BASE_URL; });

  it('calls EUID admin URL when env points there', async () => {
    process.env.SSP_ADMIN_SERVICE_BASE_URL = 'http://euid-admin.example';
    const scope = nock('http://euid-admin.example').get('/api/site/list').reply(200, []);
    await listSites();
    expect(scope.isDone()).toBe(true);
  });
});
```

- [ ] **Step 2: Run, verify pass (or adjust)**

```bash
npx jest src/api/tests/adminServiceClient.identity.spec.ts
```

If the client caches the URL at module-load, the test will fail — adjust the implementation to read the env var per-call (or use `jest.isolateModules`). Confirm passing before committing.

- [ ] **Step 3: Commit**

```bash
git add src/api/tests/adminServiceClient.identity.spec.ts
git commit -m "UID2-XXXX: verify adminServiceClient honours per-deploy env config"
```

---

## Task 13: EUID logo + favicon placeholders

**Files:**
- Create: `public/euid-logo.svg`
- Create: `public/euid-logo-darkmode.svg`
- Create: `public/euid-favicon.ico`

- [ ] **Step 1: Generate a placeholder logo**

Until design provides real assets, use a minimal text-only SVG:

```bash
cat > public/euid-logo.svg <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 32" role="img" aria-label="EUID">
  <rect width="120" height="32" fill="transparent"/>
  <text x="60" y="22" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif"
        font-size="20" font-weight="700" fill="#0b3d91" text-anchor="middle">EUID</text>
</svg>
EOF
```

- [ ] **Step 2: Dark mode variant**

```bash
sed 's/#0b3d91/#ffffff/' public/euid-logo.svg > public/euid-logo-darkmode.svg
```

- [ ] **Step 3: Favicon — copy UID2's for now**

```bash
cp public/favicon.ico public/euid-favicon.ico
```

Real branded favicon is a Phase 3 design-team deliverable.

- [ ] **Step 4: Commit**

```bash
git add public/euid-logo.svg public/euid-logo-darkmode.svg public/euid-favicon.ico
git commit -m "UID2-XXXX: placeholder EUID logo + favicon (real assets pending in Phase 3)"
```

---

## Task 14: Wire `productName()` into user-facing text

**Files:** Many. The pattern is: anywhere in `src/web/` that hardcodes "UID2" in user-visible copy, replace with `useIdentityConfig().productName`.

- [ ] **Step 1: Enumerate hardcoded user-facing "UID2" occurrences**

```bash
grep -rn '"UID2"\|>UID2<\|UID2 Portal\|UID2 Sharing' src/web | grep -v test | grep -v stories
```

Expected: a list of files. Capture this list — it is the set of files Task 14 touches.

- [ ] **Step 2: Snapshot tests for affected screens**

Before changing anything, run the snapshot tests:

```bash
npm run test
```

Expected: all pass. (Failures here are pre-existing and need investigation first.)

- [ ] **Step 3: Replace one file at a time with the helper**

For each file in the Step 1 list, edit imports + JSX. Example for a screen header:

```typescript
import { useIdentityConfig } from '../utils/identity';
// inside component
const { productName } = useIdentityConfig();
return <h1>Welcome to {productName} Portal</h1>;
```

For `<title>` tags / `document.title` updates, set them via the same helper. Do **not** change internal code identifiers (`isUid2Support`, route names, etc.) — those are deferred to post-MVP Phase 2.

- [ ] **Step 4: Update snapshot tests**

```bash
npm run test -- -u
```

Manually inspect every changed snapshot to confirm the only difference is the `{productName}` substitution.

- [ ] **Step 5: Visual smoke test — UID2 mode**

```bash
SSP_PORTAL_IDENTITY=UID2 npm run dev
```

Open `http://localhost:3000`, click through major screens. Expected: visually identical to before this change.

- [ ] **Step 6: Visual smoke test — EUID mode**

```bash
SSP_PORTAL_IDENTITY=EUID npm run dev
```

Open the dev URL. Expected: all copy reads "EUID" instead of "UID2".

- [ ] **Step 7: Commit**

```bash
git add src/web/ test snapshots
git commit -m "UID2-XXXX: route user-facing text through productName()"
```

---

## Task 15: Wire `docsBaseUrl()` into doc links

**Files:**
- Anywhere in `src/web/` that hardcodes a `https://unifiedid.com/docs/...` URL.

- [ ] **Step 1: Enumerate hardcoded doc links**

```bash
grep -rn 'unifiedid\.com/docs\|docs\.uid2\|docs-uid2' src/web | grep -v test
```

- [ ] **Step 2: Replace with helper**

For each match:

```typescript
import { useIdentityConfig } from '../utils/identity';
const { docsBaseUrl } = useIdentityConfig();
// before: href="https://unifiedid.com/docs/intro/api-keys"
// after:  href={`${docsBaseUrl}/api-keys`}
```

For paths that only exist in UID2 docs (no EUID equivalent yet), the helper falls back to `https://euid.eu/docs/intro` (the EUID docs root). That's acceptable for MVP — a link that points to the docs root is better than a 404.

- [ ] **Step 3: Manual verification**

In EUID dev mode, hover over each "Help" / "Learn more" link and confirm it points to `euid.eu`. UID2 mode unchanged.

- [ ] **Step 4: Commit**

```bash
git add src/web/
git commit -m "UID2-XXXX: route documentation links through docsBaseUrl()"
```

---

## Task 16: Hide `SharingPermissions`, `TeamMembers`, `SelfReinvite` routes on EUID

**Files:**
- Modify: `src/web/screens/dashboard.tsx`
- Modify: any nav/sidebar component that lists routes (likely under `src/web/components/Navigation/` — find with `grep -rn "SharingPermissions\|TeamMembers" src/web/components`)
- Test: `src/web/screens/dashboard.test.tsx`

- [ ] **Step 1: Read the route registry**

```bash
sed -n '1,200p' src/web/screens/dashboard.tsx
```

Confirm the structure: standard routes are an array of `{ path, element, label }` objects; `Uid2SupportRoutes` is a separate array.

- [ ] **Step 2: Write the failing test**

Create or extend `src/web/screens/dashboard.test.tsx`:

```typescript
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Dashboard } from './dashboard';
import { IdentityConfigProvider } from '../utils/identity';

const renderWithIdentity = (identity: 'UID2' | 'EUID') =>
  render(
    <MemoryRouter>
      <IdentityConfigProvider value={{ identity, productName: identity, docsBaseUrl: '', logo: { light: '', dark: '' } }}>
        <Dashboard />
      </IdentityConfigProvider>
    </MemoryRouter>
  );

describe('Dashboard route visibility', () => {
  it('hides Sharing Permissions, Team Members, Self-Reinvite on EUID', () => {
    const { queryByText } = renderWithIdentity('EUID');
    expect(queryByText(/Sharing Permissions/i)).toBeNull();
    expect(queryByText(/Team Members/i)).toBeNull();
    expect(queryByText(/Reinvite/i)).toBeNull();
  });

  it('shows them on UID2', () => {
    const { getByText } = renderWithIdentity('UID2');
    expect(getByText(/Sharing Permissions/i)).toBeInTheDocument();
    expect(getByText(/Team Members/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run, verify fail**

```bash
npx jest src/web/screens/dashboard.test.tsx
```

- [ ] **Step 4: Implement the filter**

In `src/web/screens/dashboard.tsx`, add a filter function:

```typescript
import { useIdentityConfig } from '../utils/identity';

const HIDDEN_ON_EUID = new Set(['SharingPermissions', 'TeamMembers', 'SelfReinvite']);

function visibleRoutes(routes: RouteDef[], isEuid: boolean): RouteDef[] {
  return isEuid ? routes.filter(r => !HIDDEN_ON_EUID.has(r.id)) : routes;
}

// In the component
const { isEuid } = useIdentityConfig();
const routes = visibleRoutes(AllRoutes, isEuid);
```

Make sure each route definition has a stable `id` field (`SharingPermissions`, `TeamMembers`, `SelfReinvite`). Add if missing.

Also, the unauthenticated `SelfReinvite` route is mounted outside the Dashboard (typically in `App.tsx`). Wrap its `<Route>` in a `{!isEuid && ...}` guard.

- [ ] **Step 5: Run test, verify pass**

```bash
npx jest src/web/screens/dashboard.test.tsx
```

- [ ] **Step 6: Direct-URL guard**

A user typing `/sharing-permissions` directly should also be blocked on EUID. Add a guard to the route component:

```typescript
// SharingPermissions screen
const { isEuid } = useIdentityConfig();
if (isEuid) return <Navigate to="/" replace />;
```

Repeat for the other two screens. (Tiny, low-risk; protects against bookmarked URLs.)

- [ ] **Step 7: Commit**

```bash
git add src/web/screens/ src/web/components/Navigation/ src/web/App.tsx
git commit -m "UID2-XXXX: hide SharingPermissions, TeamMembers, SelfReinvite on EUID"
```

---

## Task 17: Skip ToS modal when `isEuid()`

**Files:**
- Modify: `src/web/components/TermsAndConditions/TermsAndConditionsDialog.tsx`
- Test: `src/web/components/TermsAndConditions/TermsAndConditionsDialog.test.tsx` (new or extend)

- [ ] **Step 1: Read the existing dialog**

```bash
sed -n '1,80p' src/web/components/TermsAndConditions/TermsAndConditionsDialog.tsx
```

- [ ] **Step 2: Write the failing test**

```typescript
import { render } from '@testing-library/react';
import { TermsAndConditionsDialog } from './TermsAndConditionsDialog';
import { IdentityConfigProvider } from '../../utils/identity';

const renderInIdentity = (identity: 'UID2' | 'EUID') =>
  render(
    <IdentityConfigProvider value={{ identity, productName: identity, docsBaseUrl: '', logo: { light: '', dark: '' } }}>
      <TermsAndConditionsDialog hasAcceptedTerms={false} userId="u1" />
    </IdentityConfigProvider>
  );

describe('ToS dialog', () => {
  it('renders nothing on EUID', () => {
    const { container } = renderInIdentity('EUID');
    expect(container).toBeEmptyDOMElement();
  });
  it('renders on UID2 when user has not accepted', () => {
    const { getByRole } = renderInIdentity('UID2');
    expect(getByRole('dialog')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run, verify fail**

```bash
npx jest src/web/components/TermsAndConditions/TermsAndConditionsDialog.test.tsx
```

- [ ] **Step 4: Early-return for EUID**

In `TermsAndConditionsDialog.tsx`:

```typescript
import { useIdentityConfig } from '../../utils/identity';
export const TermsAndConditionsDialog: FC<Props> = (props) => {
  const { isEuid } = useIdentityConfig();
  if (isEuid) return null;
  // existing body unchanged
};
```

- [ ] **Step 5: Run, verify pass**

```bash
npx jest src/web/components/TermsAndConditions/TermsAndConditionsDialog.test.tsx
```

- [ ] **Step 6: Commit**

```bash
git add src/web/components/TermsAndConditions/
git commit -m "UID2-XXXX: skip ToS dialog when identity=EUID"
```

---

## Task 18: docker-compose dev override

**Files:**
- Modify: `docker-compose.yml`
- Modify: `README.md` (a one-line dev hint — covered fully in Task 21)

- [ ] **Step 1: Inspect existing compose**

```bash
sed -n '1,80p' docker-compose.yml
```

Identify the portal service block.

- [ ] **Step 2: Add the env var with a UID2 default**

In the portal service's `environment:` section:

```yaml
services:
  ssportal:
    environment:
      SSP_PORTAL_IDENTITY: ${SSP_PORTAL_IDENTITY:-UID2}
      # ... existing vars
```

- [ ] **Step 3: Verify with both modes**

```bash
docker-compose up ssportal
# Expect UID2 branding at localhost:3000
docker-compose down
SSP_PORTAL_IDENTITY=EUID docker-compose up ssportal
# Expect EUID branding at localhost:3000
```

- [ ] **Step 4: Commit**

```bash
git add docker-compose.yml
git commit -m "UID2-XXXX: docker-compose accepts SSP_PORTAL_IDENTITY override for local dev"
```

---

## Task 19: Identity-mode test coverage (sweep)

**Files:**
- Audit existing test suite for coverage gaps in identity branching.

- [ ] **Step 1: Run the full backend + frontend test suite**

```bash
npm run test-api
npm run test
```

Expected: all pass.

- [ ] **Step 2: Check coverage on identity-aware code paths**

```bash
npx jest --coverage src/api/identity src/api/services/emailService src/api/routers/configRouter
```

Expected: ≥90% line coverage on `identity.ts`, `configRouter.ts`, the EUID branch of `emailService.ts`.

- [ ] **Step 3: Add tests for any gap**

If coverage report shows uncovered branches in any of the files modified in Tasks 4, 11, 16, 17 — add tests. Pattern: a small `.spec.ts` per module, two cases (UID2 and EUID).

- [ ] **Step 4: Commit any additional tests**

```bash
git add src/api/tests src/web
git commit -m "UID2-XXXX: backfill identity-mode test coverage"
```

---

# STAGE D — Acceptance test

## Task 20: End-to-end TAM smoke test at `portal.integ.euid.eu`

**Files:** None — this is a manual checklist that produces a passing/failing artefact.

- [ ] **Step 1: Open `https://portal.integ.euid.eu` in a fresh browser session**

Expected: redirect to Keycloak (`auth.portal.integ.euid.eu`) → Okta login → back to portal.

- [ ] **Step 2: Confirm TAM lands on Manage Participants with zero rows**

Expected: TAM has the `uid2-support` role; "Manage Participants" route visible; participant list empty.

- [ ] **Step 3: Create a test EUID participant**

Fill in form: name = `bmz-euid-integ-smoke-test-<date>`, type = `Publisher`, submit.

Expected: row appears; in the EUID RDS, a row exists in `participants` and `sites`.

- [ ] **Step 4: Verify the participant was mirrored into the EUID admin service**

```bash
curl -s -H "Authorization: Bearer <admin token>" https://<euid-admin>/api/site/list | jq '.[] | select(.name | contains("smoke-test"))'
```

Expected: site shows up with matching ID.

- [ ] **Step 5: Create an API key for the participant**

Use the portal's API Key Management screen. Select roles `GENERATOR`, `ID_READER`. Submit.

Expected: key secret displayed once; metadata saved.

- [ ] **Step 6: Smoke the API key against the EUID operator**

```bash
curl -X POST 'https://operator-integ.euid.eu/v2/token/generate' \
  -H "Authorization: Bearer <new-key-id>" \
  -H "Content-Type: application/json" \
  -d '{"email": "smoke-test@example.com"}'
```

Expected: 200 + a valid `advertising_token` in the body. **This is the spec's primary exit criterion #3.**

- [ ] **Step 7: Configure CSTG**

In the portal, on the ClientSideIntegration screen for the same participant, add domain `smoke-test.example.com` and a client-side keypair. Save.

Expected: the EUID operator config picks up the new allowlist within a refresh cycle. Verify with:

```bash
curl -s -H "Authorization: Bearer <key>" 'https://operator-integ.euid.eu/v2/token/client-generate?origin=smoke-test.example.com&...'
```

Expected: 200.

- [ ] **Step 8: Confirm `SharingPermissions`, `TeamMembers`, `SelfReinvite`, ToS are unreachable**

Try direct URLs `/sharing-permissions`, `/team-members`, `/self-reinvite`, etc. Each should redirect to `/`. ToS modal should never appear.

- [ ] **Step 9: Confirm no emails fired**

Check SendGrid dashboard for the `euid-ssportal` API key (or pod logs for "email skipped (EUID MVP)" lines). Zero outbound mail.

- [ ] **Step 10: UID2 regression**

Open `https://portal.integ.unifiedid.com` in a parallel session. Run through any one of the existing smoke flows (e.g., view participants list). No behavioural difference vs before this MVP.

- [ ] **Step 11: Record results in the spec**

Add a "Stage D — Acceptance" section to the spec page with date, tester, and per-step pass/fail. **The MVP is "done" if Steps 1–10 all pass.**

---

## Task 21: README updates

**Files:**
- Modify: `uid2-self-serve-portal/README.md`
- Modify: `uid2-self-serve-portal/keycloak/README.md` (if exists)

- [ ] **Step 1: Add a "Dual-identity build" section to the main README**

Append to README.md:

````markdown
## Dual-identity build (UID2 vs EUID)

This codebase serves both `portal.unifiedid.com` (UID2) and `portal.integ.euid.eu` (EUID) from the same image. The active identity is selected at deploy time by the env var `SSP_PORTAL_IDENTITY` ∈ `{UID2, EUID}` (default `UID2`).

For local development:

```bash
# UID2 mode (default)
docker-compose up

# EUID mode
SSP_PORTAL_IDENTITY=EUID docker-compose up
```

Branding (logos, product name, docs links) is driven by `src/api/identity.ts` and the `/api/config` endpoint consumed by the frontend `IdentityConfigProvider`. To add a new identity-aware accessor, extend both helpers and add a test.

Routes hidden on EUID: `SharingPermissions`, `TeamMembers`, `SelfReinvite`. ToS modal does not render on EUID. Outbound email is short-circuited on EUID.
````

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "UID2-XXXX: document dual-identity build + local dev override"
```

- [ ] **Step 3: Push and open the final PR**

```bash
git push -u origin <current-branch>
gh pr create --title "UID2-XXXX: EUID portal MVP" \
  --body "Implements the EUID portal MVP at portal.integ.euid.eu. Spec: https://thetradedesk.atlassian.net/wiki/spaces/UID2/pages/1724874898"
```

---

## Self-review of this plan

- **Spec coverage:** every spec work item (1–18, 20–23) maps to a task. Item 19 (Grafana) is intentionally out of scope. Item 6 (migrations) is folded into Task 10 since it's a verification step, not new code.
- **Placeholders:** none. Where exact paths depend on the team's infra-repo conventions (Task 7, Task 9) the plan includes a discovery step before the change.
- **Type consistency:** `IdentityConfig`, `RawConfig`, `isEuid()`, `isUid2()`, `productName`, `docsBaseUrl`, `logoAsset` are used consistently across backend (Task 4a, 11) and frontend (Task 4c, 14–17).
- **TDD discipline:** every code task starts with a failing test, then implementation, then green. Infra tasks use plan/apply/verify instead of TDD (no test framework applies).
- **Commit cadence:** each task ends with a commit; some span multiple commits for clarity.
- **Branch naming:** `bmz-UID2-XXXX-<desc>` per the user's convention; XXXX placeholder is intentional — replace with the real Jira ticket once epic+children exist (the `/uid2-epic` skill can generate them from the spec).
