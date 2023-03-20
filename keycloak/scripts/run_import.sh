#!/bin/sh

echo "Importing self-serve-portal..."
/opt/keycloak/keycloak/bin/kc.sh import --dir=/opt/keycloak/data/import/ --override true 2>/dev/null 

### Resume normal execution
/opt/keycloak/scripts/keycloak/run.sh