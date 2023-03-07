# Keycloak login template

Customizing the login and registration pages in Keycloak using a customize template to provide consistency with the account creation flow in the self-serve portal.

## Status

Current

## Context

TThe self-serve portal requires users to create an account to access its features. This involves a multi-step account creation process that includes email verification, password creation, and user information collection. The portal also requires users to log in to access their account information and perform various actions.

The default login and registration pages provided by Keycloak do not match the visual style and user experience of the self-serve portal. This can create confusion for users and detract from the overall user experience.

## Decision

We will use a customized template to create a consistent visual style and user experience for the login and registration pages in Keycloak. The template will be based on the design of the account creation flow in the self-serve portal.

- We will use official [Keycloak theme](https://github.com/keycloak/keycloak/tree/main/themes/src/main/resources/theme) as a base for customizing the login and registration pages
  - make addictional CSS changes to the template
  - only copy the ones required for the customized pages to make maintenance easier and reduce the risk of compatibility issues with future versions of Keycloak.

## History

2023-02-08: Initial customize template
