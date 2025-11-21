import Keycloak from 'keycloak-js';

const keycloak = new Keycloak('/api/keycloak-config');

export default keycloak;
