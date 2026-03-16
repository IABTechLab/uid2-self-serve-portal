#!/bin/bash
set -e

# Process realm-export.json into a temp file so the source is never modified
PROCESSED=/tmp/realm-export.json
cp /opt/keycloak/realm-source/realm-export.json "$PROCESSED"
sed -i "s|__KEYCLOAK_OKTA_IDP_CLIENT_ID__|${KEYCLOAK_OKTA_IDP_CLIENT_ID}|g" "$PROCESSED"
sed -i "s|__KEYCLOAK_OKTA_IDP_CLIENT_SECRET__|${KEYCLOAK_OKTA_IDP_CLIENT_SECRET}|g" "$PROCESSED"

# Always overwrite the realm so restarts pick up config changes
/opt/keycloak/bin/kc.sh import --file "$PROCESSED" --override true

exec /opt/keycloak/bin/kc.sh start-dev \
  --spi-theme-static-max-age=-1 \
  --spi-theme-cache-themes=false \
  --spi-theme-cache-templates=false \
  --health-enabled=true \
  --metrics-enabled=true \
  --spi-connections-jpa-legacy-migration-strategy=update
