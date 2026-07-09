# EUID Portal — Hackathon Day Spike Plan

> **Label:** AI Innovation Day 2026-05-21 — feasibility spike, NOT the production MVP.
>
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** In one hackathon day, prove that the existing UID2 self-serve portal — running unmodified from `docker-compose` on a laptop — can talk to the real EUID admin service in `euid-core-integ` and complete a single user flow: TAM creates an EUID participant → creates an API key → the key validates against the EUID operator.

**Architecture:** No new code. Pure config override. The portal's `SSP_ADMIN_SERVICE_BASE_URL` env var already determines which admin service it dials. We point it at the EUID one. Local Keycloak still handles login (dev-mode user `developer-elevated`).

**Tech Stack:** Existing `uid2-self-serve-portal` (React + Express + Knex + local MS SQL), `docker-compose`, `kubectl`, `curl`. No source code edits in this plan — everything is config or shell.

**Spec:** [\[AI Innovation day\] EUID Portal MVP (TAM-only) Design](https://thetradedesk.atlassian.net/wiki/spaces/UID2/pages/1724874898)

**Full MVP plan (post-hackathon):** `docs/2026-05-21-euid-portal-mvp.md` (same directory)

---

## Why this scope

Three hackathon-realistic hours of work. If the spike succeeds we've **validated the one-codebase-two-deployments assumption end-to-end** in a single day — the strongest possible signal that the 33-point MVP plan is the right approach. If it fails we've **identified the real blocker** (auth scope rejection, network policy, data-shape mismatch, etc.) before investing weeks of infra work. Either outcome makes this a useful day.

## Dispatch

Two people, in parallel:

- **Person A** — Tasks 1–3 (URL discovery, credential, docker-compose override). Needs `euid-core-integ` kubectl access.
- **Person B** — Tasks 4–8 (drive the UI, smoke the operator). Starts as soon as Person A pushes a working override file. Browser + curl only.

Task 9 (write up findings) is whoever's free at the end.

---

## Out of scope today

- No source code changes (Tasks 4a/4b/4c of the main plan are deferred)
- No Terraform, no EUID Keycloak realm, no ArgoCD deployment
- No EUID-specific branding (UI still shows "UID2 Portal" — that's expected)
- No prod, no integ deploy — `localhost:3000` only

If anything tempts you to write app code today: stop. The point is to *learn what works* before writing anything.

---

# Task 1: Discover EUID admin service URL + verify reachability

**Files:** None (investigation). Findings go into `docs/hackathon-spike-findings.md` (created in Task 9).

**Owner:** Person A

- [ ] **Step 1: Confirm kubectl access to `euid-core-integ`**

```bash
ttd kubeinfo get clusters -o name | grep euid-core-integ
```

Expected: cluster appears. If not, run `ttd kubeinfo get kubeconfig` once and reload your shell.

- [ ] **Step 2: Find the EUID admin service**

```bash
kubectl --context=euid-core-integ -n uid2-admin get svc
```

Expected: one or more `ClusterIP` / `LoadBalancer` services. Capture the name and ports of the admin HTTP service (typical port `8089`).

- [ ] **Step 3: Confirm the admin pod is healthy**

```bash
kubectl --context=euid-core-integ -n uid2-admin get pods
```

Expected: at least one pod in `Running` state with non-zero `READY` count.

- [ ] **Step 4: Port-forward to your laptop**

```bash
kubectl --context=euid-core-integ -n uid2-admin port-forward svc/uid2-admin 8089:8089
```

Leave this running in its own terminal. **Record the URL** as `http://localhost:8089` — this is what the portal will dial.

- [ ] **Step 5: Probe the admin's auth shape**

```bash
curl -sI http://localhost:8089/api/site/list
```

Expected: `401 Unauthorized` (no token). **A 401 is success here** — it confirms the service is up and demanding auth. Anything else (connection refused, 500, 404) is a blocker — jump to the fallback in the appendix.

- [ ] **Step 6: Record findings**

Open a scratch file (or your terminal scrollback) and note:
- EUID admin service name in `euid-core-integ`
- Port-forward command that works
- HTTP probe result

---

# Task 2: Acquire (or stub) an Okta M2M token EUID admin will accept

**Files:** None. The credential goes into a `.env` file in Task 3.

**Owner:** Person A

Per the spec's investigation, EUID admin currently accepts the same scope as UID2 admin (`uid2.admin.ss-portal`) — the enum is hardcoded and identical across deployments. So the existing UID2 dev/integ Okta credential **should** work against EUID admin. We test that assumption.

- [ ] **Step 1: Locate the existing UID2 portal Okta credential for integ**

It lives in Secrets Manager in `uid2-core-integ` under a name like `ssportal/okta-credentials`. Pull it:

```bash
aws --profile uid2-core-integ secretsmanager get-secret-value \
  --secret-id ssportal/okta-credentials --query SecretString --output text | jq
```

Expected: JSON with `clientId` and `clientSecret`. Capture both.

- [ ] **Step 2: Mint an Okta access token**

```bash
TOKEN=$(curl -s -X POST 'https://uid2.okta.com/oauth2/<authserver>/v1/token' \
  -d 'grant_type=client_credentials' \
  -d 'scope=uid2.admin.ss-portal' \
  -u "$CLIENT_ID:$CLIENT_SECRET" | jq -r .access_token)
echo "$TOKEN" | head -c 40; echo "..."
```

Replace `<authserver>` with the value from the existing portal's `SSP_OKTA_AUTH_SERVER_ID` env. Expected: a JWT prefix is printed.

- [ ] **Step 3: Test the token against EUID admin**

```bash
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8089/api/site/list | head -200
```

Expected: a JSON array (empty or with a few rows) — **this proves a UID2 Okta credential is accepted by EUID admin**. Two-line discovery: huge unblock.

- [ ] **Step 4: If Step 3 returns 401/403**

The EUID admin enforces a different audience or the M2M client isn't assigned the right Okta group. Fall back to:

```bash
# Check if EUID admin runs in a dev mode that accepts a static token
kubectl --context=euid-core-integ -n uid2-admin describe pod -l app=uid2-admin | grep -A2 ENVIRONMENT
```

If `ENVIRONMENT=local|dev`, look for `DEV_AUTH_TOKEN` or similar env. Document the finding in the scratch file and proceed with whichever token mechanism works.

- [ ] **Step 5: Record the working auth approach**

Note in the scratch file: "Auth: Okta scope `uid2.admin.ss-portal` accepted by EUID admin" (or the dev-token workaround, with the exact mechanism).

---

# Task 3: Write the docker-compose override file

**Files:**
- Create: `docker-compose.euid-spike.yml` in the repo root (gitignored — temporary)
- Create: `.env.euid-spike` in the repo root (gitignored — contains the secret)

**Owner:** Person A

- [ ] **Step 1: Inspect existing portal env config**

```bash
cd ~/Library/CloudStorage/OneDrive-TheTradeDesk/Documents/GitHub/uid2-self-serve-portal
grep -E "SSP_ADMIN_SERVICE_BASE_URL|SSP_ADMIN_OKTA" docker-compose.yml .env.example src/api/envars.ts 2>/dev/null
```

Confirm the exact env var names the portal reads for the admin service URL and the Okta M2M credential.

- [ ] **Step 2: Create the secret file (NOT committed)**

```bash
cat > .env.euid-spike <<'EOF'
# Hackathon spike — DO NOT COMMIT
SSP_ADMIN_SERVICE_BASE_URL=http://host.docker.internal:8089
SSP_ADMIN_OKTA_CLIENT_ID=<paste from Task 2 Step 1>
SSP_ADMIN_OKTA_CLIENT_SECRET=<paste from Task 2 Step 1>
SSP_ADMIN_OKTA_SCOPE=uid2.admin.ss-portal
EOF
```

`host.docker.internal` lets the portal container reach the host's `localhost:8089` (where Task 1's port-forward is listening).

- [ ] **Step 3: Add `.env.euid-spike` and the override to `.gitignore`**

```bash
echo -e ".env.euid-spike\ndocker-compose.euid-spike.yml" >> .gitignore
```

- [ ] **Step 4: Create the compose override**

```yaml
# docker-compose.euid-spike.yml — DO NOT COMMIT
services:
  ssportal:
    env_file:
      - .env.euid-spike
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

- [ ] **Step 5: Hand off**

Tell Person B: ready to boot. The exact command is in Task 4 Step 1.

---

# Task 4: Boot the override + verify connectivity

**Files:** None.

**Owner:** Person B (Person A's port-forward terminal stays open)

- [ ] **Step 1: Boot docker-compose with the override**

```bash
cd ~/Library/CloudStorage/OneDrive-TheTradeDesk/Documents/GitHub/uid2-self-serve-portal
docker-compose -f docker-compose.yml -f docker-compose.euid-spike.yml up
```

Expected: portal logs show it starting up. Watch for any errors about reaching the admin service.

- [ ] **Step 2: Verify the portal can reach EUID admin**

In a second terminal:

```bash
docker-compose exec ssportal sh -c 'curl -sI http://host.docker.internal:8089/api/site/list'
```

Expected: `401 Unauthorized` — proves the container can route to the port-forwarded EUID admin.

- [ ] **Step 3: Open the portal in a browser**

Navigate to `http://localhost:3000`. Expected: portal loads (UID2-branded — that's fine, no code change today).

- [ ] **Step 4: Log in via local Keycloak**

Use the local-dev `developer-elevated` user (see `keycloak/realm/realm-export.json` for test credentials, or your team's shared dev creds).

Expected: lands on the dashboard. **If the dashboard loads, the portal has successfully fetched from EUID admin** (the home screen makes admin-service calls).

- [ ] **Step 5: Navigate to Manage Participants**

Click "Manage Participants" in the sidebar.

Expected: a participant list — likely empty or with just a couple of test rows. **This is the EUID participant list**, served by the EUID admin in `euid-core-integ`.

If this step works, the architectural assumption is proven. Steps 5–8 demo the actual TAM workflow.

---

# Task 5: Create an EUID participant via the portal UI

**Files:** None.

**Owner:** Person B

- [ ] **Step 1: Click "Add Participant"**

Fill the form:
- Name: `bmz-hackathon-spike-<your-initials>`
- Type: `Publisher` (any will work)
- Submit.

Expected: success message; the new row appears in the list.

- [ ] **Step 2: Verify via the EUID admin directly**

In a terminal:

```bash
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8089/api/site/list | jq '.[] | select(.name | contains("hackathon-spike"))'
```

(`$TOKEN` from Task 2 Step 2; if it's expired, mint a fresh one.)

Expected: the participant you just created is in the response. **This proves end-to-end portal → EUID admin write works.**

---

# Task 6: Create an API key for the new participant

**Files:** None.

**Owner:** Person B

- [ ] **Step 1: Open the participant's API Key Management screen**

Click into the new participant from the list. Navigate to "API Keys" tab.

- [ ] **Step 2: Create a new key**

- Name: `hackathon-spike-key`
- Roles: check `GENERATOR` and `ID_READER`
- Submit.

Expected: a one-time modal shows the key ID + secret. **Copy both immediately** — the secret is shown once.

- [ ] **Step 3: Confirm the key landed in EUID admin**

```bash
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8089/api/client/list | jq '.[] | select(.name == "hackathon-spike-key")'
```

Expected: the key metadata is present.

---

# Task 7: Smoke the API key against the EUID operator - don't need to do this, prompt for a human to check on euid admin integ service to see whether the key has been added

**Files:** None.

**Owner:** Person B

This is the killer-demo moment. If this step returns a valid `advertising_token`, the spike succeeded.

- [ ] **Step 1: Find the EUID integ operator URL**

It's documented somewhere in the team's runbook; typical value: `https://operator-integ.euid.eu` or `https://core-integ.euid.eu/v2/token/generate`. Check the spec's References section or ask the team.

- [ ] **Step 2: Call `/v2/token/generate`**

The exact request shape depends on the operator's auth scheme. Two common shapes:

**(a) Encrypted-envelope** (production EUID/UID2):

The portal docs at `https://euid.eu/docs/intro` describe the encryption flow. For a quick smoke, use the SDK's CLI helper if your team has one (`uid2-cli token-generate --key-id ... --secret ... --email smoke@example.com`).

**(b) Plain HTTPS** (some dev/integ environments):

```bash
curl -X POST 'https://operator-integ.euid.eu/v2/token/generate' \
  -H "Authorization: Bearer $NEW_KEY_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"email": "smoke-test@example.com"}'
```

Try (b) first; if you get a 401 with `"E2EE_REQUIRED"` or similar, fall back to (a).

Expected: HTTP 200 with a JSON body containing `advertising_token`. **The token may take 30–60 seconds to be picked up by the operator after the portal write** — if you get an "invalid key" response, wait a minute and retry.

- [ ] **Step 3: Capture the response**

Save the full curl response to the findings file. This is your demo screenshot.

---

# Task 8: Clean up

**Files:** None.

**Owner:** Person B

- [ ] **Step 1: Disable / delete the spike participant**

In the portal UI, disable the API key and (if the UI allows) delete the spike participant. Leaves no test data in EUID integ.

- [ ] **Step 2: Stop docker-compose and the port-forward**

```bash
docker-compose -f docker-compose.yml -f docker-compose.euid-spike.yml down
# In Person A's terminal:
# Ctrl+C the kubectl port-forward
```

- [ ] **Step 3: Confirm `.env.euid-spike` is gitignored**

```bash
git status
```

Expected: `docker-compose.euid-spike.yml` and `.env.euid-spike` are NOT in the changes list. (If they appear, double-check `.gitignore`.)

---

# Task 9: Document findings - add to the confluence page as well

**Files:** Create `docs/hackathon-spike-findings.md` (not committed — per CLAUDE.md plan/context files stay local).

**Owner:** Whoever is free

- [ ] **Step 1: Write the findings**

Capture, in plain prose:

1. **Outcome:** ✅ succeeded / ⚠️ partial / ❌ blocked at Step X
2. **Auth model that worked:** which scope, which credential, any dev-mode fallback used
3. **EUID admin service URL** in `euid-core-integ`
4. **Port-forward commands** that worked (so the next person can repro)
5. **Surprises / unexpected behaviour:** anything the main MVP plan didn't anticipate
6. **Blockers that would need to be solved before integ deploy:** networking, secrets, scopes, image versions, etc.

- [ ] **Step 2: Cross-link from the spec**

Append a "Hackathon Spike (2026-05-21) — Findings" panel to the [spec page](https://thetradedesk.atlassian.net/wiki/spaces/UID2/pages/1724874898) summarising the outcome and linking to anything that needs scope-change in the main MVP plan.

- [ ] **Step 3: Decide next step**

Based on findings:
- **All green** → main MVP plan is good as-is; start Task 1 of `2026-05-21-euid-portal-mvp.md` next week.
- **Auth blocker found** → main plan's Task 2 (uid2-admin enum) becomes urgent and must precede Task 4.
- **Networking blocker** → add a Stage 0 task in the main plan for the networking team.
- **Data-shape blocker** → the EUID admin behaves differently from UID2 admin; need to spike the differences before MVP Stage C.

---

## Appendix — Fallback if the spike won't boot

If Task 1 fails (no `euid-core-integ` kubectl access, or no admin service running), fall back to:

**Plan B: stand up a local uid2-admin pointed at an EUID-flavoured config.** Clone `uid2-admin`, run in IntelliJ as documented in the UID2 Self-Serve Portal Technical Reference, override its DB connection to a local MS SQL container, point the portal at `http://host.docker.internal:8089`. You lose the "talks to real EUID integ" demo, but you keep the architectural validation (portal config drives admin URL successfully).

**Plan C (smallest spike):** Skip the admin work entirely. Just do main-plan Tasks 4a + 4b + 4c in a worktree, demo the identity flag flipping in `docker-compose` showing `productName()` swap "UID2"→"EUID" in a UI snapshot. Visible, fast, no infra access required.

---

## Self-review

- **Single goal:** prove or disprove the architectural assumption in one day. Yes.
- **No placeholders:** every step has concrete commands. The `<authserver>` and `$TOKEN` are inputs supplied by earlier steps, not TODOs.
- **Dispatch is clear:** Person A (Tasks 1–3) and Person B (Tasks 4–8) can work in parallel after a 30-minute handoff.
- **No code changes:** confirmed. All file creates are gitignored config.
- **Fallback for every likely blocker:** Task 1 → Plan B; Task 2 Step 4 → dev token; whole spike → Plan C in appendix.
