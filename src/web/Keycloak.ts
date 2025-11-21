// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
import Keycloak from 'keycloak-js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const keycloak = new Keycloak('/api/keycloak-config');

export default keycloak;
