#!/bin/sh
set -eu

: "${VITE_API_URL:?VITE_API_URL environment variable must be set}"

cat > /var/www/html/config.js <<EOF
window.RUNTIME_CONFIG = {
    VITE_API_URL: "${VITE_API_URL}"
};
EOF

exec "$@"
