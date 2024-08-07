# Keycloak Advanced Setup

This document provides detailed instructions on more advanced Keycloak setup topics such as generating the SSP_KK_SECRET, resetting the realm, and enabling blocking account creation by free email providers.

## Keycloak Client Secret

The Client Secret used by the `self_serve_portal_apis` client must match the `SSP_KK_SECRET` that is stored in your `.env` file. You can check this by doing the following:

1. Login to the [Keycloak admin console](./README.md/#keycloak-admin-console).
1. Ensure the realm dropdown has 'self-serve-portal' selected (rather than 'master'), then navigate to the "Clients" page and select the `self-serve-portal-apis` client.
1. Click the "Credentials" tab, and reveal your Client Secret
1. Ensure this matches the value of `SSP_KK_SECRET` in your `.env` file

If it doesn't match, you can either [reset your realm](./KeycloakAdvancedSetup.md#reset-realm) or [generate a new client secret](#generating-a-new-client-secret)

### Generating a new Client Secret

It is preferred that you use the `SSP_KK_SECRET` that is stored in `.env`, and you set the secret in keycloak by [resetting your realm](./KeycloakAdvancedSetup.md#reset-realm).

However, if you must generate a new client secret, please do the following:

1. Perform the steps as above in [Keycloak Client Secret](#keycloak-client-secret) to view your Client Secret. 
1. Regenerate the Client secret by clicking "Regenerate".
1. Copy the new client secret and use it as the value of the `SSP_KK_SECRET` environment variable in your `.env` file.

## Reset Realm

You might need to do this if the realm configuration has been updated by someone on another branch. If you update your own Keycloak realm configuration, make sure you include the changes in your PR by exporting the realm and updating `keycloak\realm\realm-export.json`.

```
docker exec -it uid2_selfserve_keycloak /bin/sh -c "/opt/keycloak/bin/kc.sh import --file /opt/keycloak/data/import/realm-export.json --override true;exit 0"
docker compose restart keycloak
```

This script imports the [realm-export.json](https://github.com/IABTechLab/uid2-self-serve-portal/blob/main/keycloak/realm/realm-export.json) to the keycloak and override realm if exists.\
It is important to note that all the users in the realm will be removed. You may also need to re-generate your client secrets (see the main Keycloak setup entry above).

## Enable blocking account creation by free email providers

> Declarative User Profile is Technology Preview and is not fully supported.

1. Click on the `Realm Settings` on the left side menu and click the `User Profile` tab.
2. Click on `email`, scroll down to `validators` and click `create validator`.
3. Select `pattern` from the list and add `^(?!.*@(gmail|hotmail|yahoo)\.com$).+@.+\..+$` as pattern and `errorPatternNoMatch` as error message key
4. Click on the `Save` button

## Assign Role to a Particular User

The following instructions detail how to assign a specific role to a user in Keycloak:

1. Login to the [Keycloak admin console](./README.md/#keycloak-admin-console). 
1. Change the realm from `Keycloak` to `UID2 Portal`.
1. Select `Users` from the left side menu.
1. Locate the user from the user list. You can use the search bar if necessary.
1. Click on the desired username to open the user's detail page. Then, select the `Role Mapping` tab.
1. Click `Assign role`. If the role you want to assign isn't immediately visible, click `Filter by realm roles` to open the dropdown menu, and then select `Filter by clients`.
1. Locate the role in the client roles list. Note that you may have to use `Search by role name` or the table pagination to locate your desired role (e.g. `api-participant-member`). 
1. Tick the checkbox next to the role, and then click `Assign`.

Note that you will need the `api-participant-member` role for much of the portal functionality
