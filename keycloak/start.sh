#!/bin/bash
set -e

if [ -z "${SSP_KK_SECRET}" ]; then
  echo "ERROR: SSP_KK_SECRET is empty; refusing to import realm with a blank client secret." >&2
  exit 1
fi

# Process realm-export.json into a temp file so the source is never modified
PROCESSED=/tmp/realm-export.json
cp /opt/keycloak/realm-source/realm-export.json "$PROCESSED"
sed -i "s|__KEYCLOAK_OKTA_IDP_CLIENT_ID__|${KEYCLOAK_OKTA_IDP_CLIENT_ID}|g" "$PROCESSED"
sed -i "s|__KEYCLOAK_OKTA_IDP_CLIENT_SECRET__|${KEYCLOAK_OKTA_IDP_CLIENT_SECRET}|g" "$PROCESSED"
sed -i "s|__SSP_KK_CLIENT_SECRET__|${SSP_KK_SECRET}|g" "$PROCESSED"

# Always overwrite the realm so restarts pick up config changes.
# Enable schema migration on import too: on a fresh DB the schema doesn't exist
# yet and `import` (a non-server command) won't auto-migrate, so it fails with
# "Database not up-to-date" before start-dev ever runs.
/opt/keycloak/bin/kc.sh import --file "$PROCESSED" --override true --spi-connections-jpa-quarkus-migration-strategy=update

exec /opt/keycloak/bin/kc.sh start-dev \
  --spi-theme-static-max-age=-1 \
  --spi-theme-cache-themes=false \
  --spi-theme-cache-templates=false \
  --health-enabled=true \
  --metrics-enabled=true \
  --spi-connections-jpa-quarkus-migration-strategy=update
