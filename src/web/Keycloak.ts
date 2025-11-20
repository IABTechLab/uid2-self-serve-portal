import Keycloak from 'keycloak-js';

const keycloak: Keycloak = new Keycloak('/api/keycloak-config');

export default keycloak;
