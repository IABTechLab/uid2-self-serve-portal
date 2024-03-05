import Keycloak from 'keycloak-js';

let keycloakInstance: Keycloak | null = null;

export const getKeycloakInstance = () => {
  if (!keycloakInstance) {
    throw new Error(
      'No Keycloak instance found. Please call createKeycloakInstance() to initialize one.'
    );
  }
  return keycloakInstance;
};

export const createKeycloakInstance = () => {
  if (keycloakInstance) {
    throw new Error('Keycloak instance already exists. Unable to create another instance.');
  }
  keycloakInstance = new Keycloak('/api/keycloak-config');
  return keycloakInstance;
};
