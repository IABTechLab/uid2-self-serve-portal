# EUID Portal Hackathon Spike — Findings (2026-05-21)

> Companion to `2026-05-21-euid-portal-hackathon-spike.md`. Local-only —
> fill in as you go, copy the summary into the [spec page] when done.
>
> [spec page]: https://thetradedesk.atlassian.net/wiki/spaces/UID2/pages/1724874898

## Resume from prep — start here

Prep done (Claude, 2026-05-21 lunchtime):
- `.env.euid-spike` written with correct env var names + `PASTE_…` placeholders.
- This findings doc skeleton created.
- Plan corrections captured in "Notes from prep" at the bottom — read them
  before following the original plan literally; the compose override and the
  `SSP_ADMIN_OKTA_*` env names from the plan are wrong.

Next steps in order:

1. **Fix KPOP** so `kubectl` works. The session-start reminder said:
   - `ttd kubeinfo get kubeconfig`
   - Add to shell profile: `export KUBECONFIG="$HOME/.kube/ttd:$HOME/.kube/config"`
   - Run any `ttd kubeinfo` command once (e.g. `ttd kubeinfo get clusters -o name`)
     to install `kubeinfo` on PATH.
   - Reload your shell, then restart Claude Code.

2. **Task 1 — discover EUID admin service** (Person A, ~10 min):
   ```bash
   ttd kubeinfo get clusters -o name | grep euid-core-integ
   kubectl --context=euid-core-integ -n uid2-admin get svc
   kubectl --context=euid-core-integ -n uid2-admin get pods
   # Record the svc name, then in its own terminal:
   kubectl --context=euid-core-integ -n uid2-admin port-forward svc/<name> 8089:<port>
   # In another terminal:
   curl -sI http://localhost:8089/api/site/list   # expect 401
   ```
   Record the svc name + port under "EUID admin service in euid-core-integ" below.

3. **Task 2 — pull the Okta credential** (Person A, ~5 min):
   ```bash
   aws --profile uid2-core-integ secretsmanager get-secret-value \
     --secret-id ssportal/okta-credentials --query SecretString --output text | jq
   ```
   Paste `clientId` → `SSP_OKTA_CLIENT_ID` and `clientSecret` → `SSP_OKTA_CLIENT_SECRET`
   in `.env.euid-spike`. (Sanity-test the token against EUID admin per Task 2 Step 3.)

4. **Task 4 — boot the portal against EUID admin** (Person B):
   ```bash
   cp .env .env.uid2-backup 2>/dev/null || true
   cp .env.euid-spike .env
   docker compose up -d                 # db + keycloak + mailhog
   npm run dev                          # portal on http://localhost:3000
   ```
   Note: do NOT use a `docker-compose.euid-spike.yml` override — the plan's
   approach is wrong (no `ssportal` service exists in compose). Portal runs
   on the host and dials `localhost:8089` directly.

5. **Tasks 5–7 — browser flow**: log in as `developer-elevated` via local
   Keycloak → Manage Participants → Add Participant → create API key →
   smoke-test the key against the EUID operator. Fill the sections below as
   you go.

6. **Task 8 — cleanup**: disable the spike participant + key in the UI, stop
   compose, kill the port-forward, restore `.env` from `.env.uid2-backup`.

7. **Task 9** — finalise this doc, then copy the summary into the spec page
   as a "Hackathon Spike (2026-05-21) — Findings" panel.

Files to keep local (don't `git add` — per CLAUDE.md convention):
`.env.euid-spike`, `.env.uid2-backup`, `docs/hackathon-spike-findings.md`.

---

## Outcome

- [ ] ✅ Succeeded (TAM → create participant → create key → operator returns advertising_token)
- [ ] ⚠️ Partial — got to Task ___ then ___
- [ ] ❌ Blocked at Task ___ Step ___

One-line summary:

---

## Auth model that worked

- Scope used: `uid2.admin.ss-portal` (hardcoded in `src/api/services/adminServiceClient.ts:50`)
- Okta credential source: AWS Secrets Manager `ssportal/okta-credentials` in `uid2-core-integ`
- Did the existing UID2 integ Okta client work against EUID admin? ___
- Fallback used (dev token / static creds / other)? ___

## EUID admin service in euid-core-integ

- Namespace: ___
- Service name: ___
- Port: ___
- Port-forward command that worked:

```bash
kubectl --context=euid-core-integ -n <ns> port-forward svc/<name> 8089:<port>
```

- Auth probe result: `curl -sI http://localhost:8089/api/site/list` → ___

## Spike participant + key

- Participant name: `bmz-hackathon-spike-___`
- Participant siteId returned by EUID admin: ___
- Key name: `hackathon-spike-key`
- Key id (first 6 chars): ___
- Roles: GENERATOR, ID_READER

## EUID operator smoke

- Operator URL tried: ___
- Auth scheme (plain bearer vs E2EE): ___
- Response (paste body or first 200 chars):

```
___
```

- Time from key creation to operator acceptance: ___ seconds

## Surprises / unexpected behaviour

1.

## Blockers that would need solving before integ deploy

- Networking: ___
- Secrets management: ___
- Okta scope / audience: ___
- Image / config divergence: ___
- Other: ___

## Decision: next step

- [ ] All green → start Task 1 of `2026-05-21-euid-portal-mvp.md` next sprint
- [ ] Auth blocker → bump main plan Task 2 (uid2-admin enum) to top of stack
- [ ] Networking blocker → add Stage 0 networking task to main plan
- [ ] Data-shape blocker → spike EUID-vs-UID2 admin diffs before MVP Stage C

## Cleanup checklist

- [ ] Spike API key disabled in EUID admin
- [ ] Spike participant disabled/deleted
- [ ] `docker compose down`
- [ ] kubectl port-forward terminated
- [ ] `.env` restored from `.env.uid2-backup` (if applicable)
- [ ] `git status` confirms `.env.euid-spike` and findings file are not tracked

---

## Notes from prep (Claude, 2026-05-21)

Things I noticed reading the codebase that the plan got slightly wrong — flagging here so the spike doesn't trip on them:

1. **No `ssportal` service in `docker-compose.yml`.** The compose file only defines `database`, `keycloak`, `mailhog`. The portal itself runs on the host via `npm run dev` (see `package.json`'s `dev` script). So the plan's `docker-compose.euid-spike.yml` override is unnecessary — and `host.docker.internal` is wrong; the host can reach `localhost:8089` directly.
2. **Env var names.** The plan used `SSP_ADMIN_OKTA_CLIENT_ID` etc., but the code uses `SSP_OKTA_CLIENT_ID` / `SSP_OKTA_CLIENT_SECRET` / `SSP_OKTA_AUTH_SERVER_URL` (no separate "admin" prefix). The `.env.euid-spike` template uses the real names.
3. **`SSP_OKTA_AUTH_DISABLED` defaults to `true`.** That bypasses Okta entirely and is fine for talking to a local stub admin — but the spike needs real Okta tokens to dial EUID admin, so the template flips it to `false`. If you forget this, every admin call returns whatever a missing bearer does at EUID admin (probably 401, and you'll waste time chasing it).
4. **Okta scope is baked in.** `adminServiceClient.ts:50` posts `scope=uid2.admin.ss-portal` directly — no env var. If EUID admin rejects that scope, the fix is a one-line source change, not a config tweak.
5. **`SSP_OKTA_AUTH_SERVER_URL`** is the full URL including the authserver path (`https://uid2.okta.com/oauth2/aus1oqu660mF7W3hi1d8`), not just the host. That's what the plan called `<authserver>`.
