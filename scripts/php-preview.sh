#!/usr/bin/env bash
# Serve the BUILT site (dist/client) with PHP 8.2 + Apache, like Hostinger, at http://localhost:8097.
# For testing /admin, /api/track.php and /api/contact.php locally. Run `bun run build` first.
# Data lives inside the container and disappears when it stops. Email is not sent from here.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
test -f "$ROOT/dist/client/admin/index.php" || { echo "Run 'bun run build' first." >&2; exit 1; }
docker rm -f nld-php-preview >/dev/null 2>&1 || true
exec docker run --rm --name nld-php-preview -p 8097:80 -v "$ROOT/dist/client":/var/www/html:ro php:8.2-apache bash -c \
  "a2enmod rewrite headers expires >/dev/null; sed -ri 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf; mkdir -p /var/www/nld-private && chown www-data /var/www/nld-private; apache2-foreground"
