#!/bin/sh
set -e

# Configure port for Nginx (Render sets $PORT dynamically, default to 80)
PORT="${PORT:-80}"
echo "Configuring Nginx to listen on port ${PORT}..."
sed -i "s/LISTEN_PORT/${PORT}/g" /etc/nginx/http.d/default.conf

# Ensure storage directories exist with proper permissions
mkdir -p /var/www/html/storage/framework/cache/data \
         /var/www/html/storage/framework/sessions \
         /var/www/html/storage/framework/views \
         /var/www/html/storage/logs \
         /var/www/html/bootstrap/cache

chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Ensure APP_KEY exists to prevent 500 error on boot
if [ -z "$APP_KEY" ]; then
    echo "WARNING: APP_KEY is not set in environment variables! Generating a runtime application key..."
    export APP_KEY=$(php artisan key:generate --show 2>/dev/null || echo "")
fi

# Create storage symlink
php artisan storage:link --force 2>/dev/null || true

# Production optimization cache
if [ "${APP_ENV:-production}" = "production" ]; then
    echo "Caching Laravel configuration, routes, and views..."
    php artisan config:cache || echo "Config caching skipped or failed."
    php artisan route:cache || echo "Route caching skipped or failed."
    php artisan view:cache || echo "View caching skipped or failed."
fi

# Run migrations if enabled or if Railway MySQL is detected
if [ "${AUTO_MIGRATE:-false}" = "true" ] || [ "${RUN_MIGRATIONS:-false}" = "true" ] || [ -n "${MYSQLHOST}" ]; then
    echo "Running database migrations..."
    php artisan migrate --force || echo "Migration encountered an issue, proceeding anyway..."
fi

# Optional initial seeder
if [ "${AUTO_SEED:-false}" = "true" ]; then
    echo "Running database seeder..."
    php artisan db:seed --force || echo "Seeder encountered an issue, proceeding anyway..."
fi

echo "Starting Nginx and PHP-FPM via Supervisord..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
