# Deployment steps

## Information

Ideally, all deployment steps should be automated - but some things (especially Keycloak configuration) need to be done manually. They should be documented here!

There are often easier ways to do this in dev if you don't want to follow the manual steps - [Reset your Keycloak realm](https://github.com/IABTechLab/uid2-self-serve-portal/blob/main/KeycloakAdvancedSetup.md#reset-realm). These are unsuitable for deployed environments (in that case, it deletes all current Keycloak users).

If you're creating a PR with manual steps, please add the steps to the Next section. When doing a deployment, increase the version in `package.json`, create a section for that version number, and move any pending manual changes to that new section.

Don't delete old sections - just leave them towards the bottom of the file, and add new things at the top.

## Next (pending changes for the next coming release)

## 0.6.0

1. Email templates need to be released to SendGrid. There are no new ones so mappings shouldn't need to be updated.
2. Keycloak needs to be updated to get the new Keycloak email theme.

## 0.4.0

### Keycloak manual changes

1. In realm settings, switch user profile enable to off ( UID2-1485 update keycloak templates )
2. Create api-participant-member role in self_serve_portal_apis client
3. Assign api-participant-member to existing users(UID2-1516 setup role check on endpoint) See [extra details](https://github.com/IABTechLab/uid2-self-serve-portal/blob/main/KeycloakAdvancedSetup.md#assign-role-to-a-particular-user)
4. Assign manage-clients to self_serve_portal_apis (UID2-1536 Assign api-partcipant-member when invited user accept T&C) (service account roles tab is in client as well)
5. then follow the step 4 and 5 from [the same doc](https://github.com/IABTechLab/uid2-self-serve-portal/blob/main/KeycloakAdvancedSetup.md#assign-role-to-a-particular-user).
