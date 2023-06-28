#!/usr/bin/env bash

# Deployment name
DEPLOYMENT_ARCHIVE="staging.tar"

# Deployment host
DEPLOYMENT_USER="staging"
DEPLOYMENT_HOST="staging-whitelists.thephoenix.finance"
DEPLOYMENT_SSH="${DEPLOYMENT_USER}@${DEPLOYMENT_HOST}"

# Verify build output available
if [ ! -e ../build ]; then
  echo "Build output missing at ../build. Quitting."
  exit
fi

# Compile and send deployment
rm -f "$DEPLOYMENT_ARCHIVE.gz"
tar cpf "$DEPLOYMENT_ARCHIVE" -C .. build
tar upf "$DEPLOYMENT_ARCHIVE" base
gzip "$DEPLOYMENT_ARCHIVE"
scp "${DEPLOYMENT_ARCHIVE}.gz" ${DEPLOYMENT_SSH}:

# Cleanly extract
# shellcheck disable=SC2087
ssh "${DEPLOYMENT_SSH}" /bin/bash <<EOF
  rm -rf /var/www/html/* /var/www/html/.??*
  tar xzpf "${DEPLOYMENT_ARCHIVE}.gz" --strip-components 1 -C /var/www/html
EOF
