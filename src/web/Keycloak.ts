import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  realm: 'self-serve-portal',
  url: 'http://localhost:18080/',
  clientId: 'self_serve_portal_web',
});

export default keycloak;
