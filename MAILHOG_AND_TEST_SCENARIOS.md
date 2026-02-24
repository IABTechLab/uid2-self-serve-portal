# MailHog and test scenarios (invite flow for internal users)

## Running everything locally

1. **Start Docker Desktop** (required for portal DB, Keycloak, and MailHog).
2. **Start the portal stack:**
   ```bash
   cd uid2-self-serve-portal
   docker compose up -d
   ```
   - First time: MSSQL can take ~5 minutes to become healthy. If Keycloak fails to start, run:
     ```bash
     docker compose restart keycloak
     ```
3. **Migrations and seed** (if needed):
   ```bash
   npm run knex:migrate:latest
   npm run knex:seed:run
   ```
4. **Start the portal:**
   ```bash
   npm run dev
   ```
   - Portal: http://localhost:3000  
   - API: port 6540 (default)
5. **uid2-admin** (optional, for full API Keys / sharing): run per its README; ensure site IDs for your participants exist in admin.

---

## Using MailHog

MailHog is a fake SMTP server that catches all emails sent by the portal locally. Nothing is sent to real inboxes.

- **Web UI:** http://localhost:18025  
  Open this in your browser to see every email the portal sends (invites, password resets, etc.).
- **SMTP:** The portal sends mail to `localhost:11025`; MailHog listens there when Docker is running.

**Flow:**
1. Trigger an action that sends email (e.g. add user, resend invite, forgot password).
2. Open http://localhost:18025 and refresh.
3. You’ll see the message(s) with subject, body, and recipient. Click a message to view full content.

---

## Scenarios to test (invite flow for internal users)

### 1. **TTD internal – no invite email (new user)**

- **Setup:** Add a **new** team member with an email ending in `@thetradedesk.com`.
- **Action:** In the portal, add the user (e.g. Team → Add user with email like `someone@thetradedesk.com`).
- **Expect:** User is created and appears in the team. **No email** appears in MailHog (http://localhost:18025).
- **Why:** `isTTDInternal` in `usersService` skips sending the “new user” invite for `@thetradedesk.com`.

### 2. **TTD internal – no resend-invite email (existing pending user)**

- **Setup:** Have an existing team member with `@thetradedesk.com` who has not accepted terms (pending).
- **Action:** Use “Resend invite” for that user (if the button is visible; see scenario 4).
- **Expect:** **No email** in MailHog.
- **Why:** Same `isTTDInternal` check skips “resend invite” for TTD addresses.

### 3. **Non-internal user – invite and resend emails sent**

- **Setup:** Add or resend invite for a user whose email is **not** `@thetradedesk.com` (e.g. `someone@gmail.com` or `someone@example.com`).
- **Action:** Add user or click “Resend invite” for a pending user.
- **Expect:** MailHog shows the invite (or resend) email to that address.
- **Why:** Only TTD internal addresses skip emails; everyone else gets them.

### 4. **Resend invite button hidden for internal (unifiedid + tradedesk)**

- **Where:** Team member list; user with “Pending” (hasn’t accepted terms).
- **Expect:**
  - For `@unifiedid.com` or `@thetradedesk.com`: **No “Resend invite” button** (or it’s hidden).
  - For other domains: **“Resend invite” button visible** for pending users.
- **Why:** `TeamMember.tsx` uses a local `isUid2InternalEmail` that treats both `@unifiedid.com` and `@thetradedesk.com` as internal and hides the button.

### 5. **Password reset (sanity check)**

- **Action:** From the login page, use “Forgot Password” with an existing user email (e.g. seed user).
- **Expect:** MailHog shows a “Reset Password” email from `noreply@unifiedid.com`. This confirms MailHog and SMTP are working.

---

## Quick checklist

| Scenario | Email domain | Action | Expected |
|---------|--------------|--------|----------|
| New user invite | `*@thetradedesk.com` | Add user | No email in MailHog |
| New user invite | Other (e.g. `@example.com`) | Add user | Email in MailHog |
| Resend invite | `*@thetradedesk.com` | Resend invite | No email in MailHog |
| Resend invite | Other | Resend invite | Email in MailHog |
| UI | `@unifiedid.com` or `@thetradedesk.com` | View pending team member | No “Resend invite” button |
| UI | Other | View pending team member | “Resend invite” button shown |

---

## If Keycloak or DB didn’t start

- **Keycloak “dependency failed: mssql is unhealthy”**  
  Wait a few minutes for MSSQL to finish starting, then:
  ```bash
  docker compose restart keycloak
  ```
- **Seed fails**  
  You may already have data; try `npm run dev` and log in with an existing user. Use “Forgot Password” and MailHog to set a password if needed.
- **uid2-admin**  
  Run it from its repo when you need to test API Keys or participant/site linking; it’s separate from MailHog.
