#! /usr/bin/env bash
CONTAINER_NAME='uid2_selfserve_keycloak'

CID=$(docker ps -q -f status=running -f name=^/${CONTAINER_NAME}$)
if [ ! "${CID}" ]; then
  echo "Container doesn't exist"
  exit 1;
fi
unset CID
docker exec -it ${CONTAINER_NAME} /bin/sh -c "/opt/keycloak/bin/kc.sh import --file /opt/keycloak/data/import/realm-export.json --override true;exit 0"
docker compose restart keycloak
