# Keycloak Advanced Setup

This document provides detailed instructions on more advanced Keycloak setup topics such as generating the SSP_KK_SECRET, resetting the realm, and enabling blocking account creation by free email providers.

## Generating SSP_KK_SECRET

You can obtain the `SSP_KK_SECRET` by generating a new client secret in the Keycloak admin portal. Here's how you can do it:

1. Login to the Keycloak admin console.
2. Ensure the realm dropdown has 'self-serve-portal' selected (rather than 'master'), then navigate to the "Clients" page and select the `self-serve-portal-apis`.
3. Go to the "Credentials" tab and regenerate the Client secret by clicking "Regenerate".
4. Copy the new client secret and use it as the value of the `SSP_KK_SECRET` environment variable in your `.env` file.

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

1. From the Keycloak admin console, select `Users` from the left side menu.
2. Locate the user from the user list. You can use the search bar if necessary.
3. Click on the desired username to open the user's detail page. Then, select the `Role Mapping` tab.
4. Click Assign role. If the role you want to assign isn't immediately visible, select `Filter by realm roles` to open the dropdown menu, and then switch to `Filter by clients`.
5. Locate the role in the client roles list. Tick the checkbox next to the role, and then click `Assign`.
