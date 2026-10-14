#!/bin/sh
set -e

# 1. Configure port for Nginx (Railway/Render sets $PORT dynamically)
PORT="${PORT:-8080}"
echo "Configuring Nginx to listen on port ${PORT}..."
sed -i "s/LISTEN_PORT/${PORT}/g" /etc/nginx/http.d/default.conf

# 2. Hapus file public/hot DAN file .env lokal kalau gak sengaja kebawa ke Docker!
# (Biar Laravel 100% baca dari Variables Railway)
rm -f /var/www/html/public/hot
rm -f /var/www/html/.env

# 3. Pastikan folder storage & cache lengkap
mkdir -p /var/www/html/storage/framework/cache/data \
         /var/www/html/storage/framework/sessions \
         /var/www/html/storage/framework/views \
         /var/www/html/storage/logs \
         /var/www/html/bootstrap/cache

# 4. Bersihkan semua cache lama dulu biar fresh baca Variables dari Railway
echo "Clearing old Laravel caches..."
php artisan optimize:clear || true

# 5. Create storage symlink
php artisan storage:link --force 2>/dev/null || true

# 6. Run migrations kalau diaktifkan
if [ "${AUTO_MIGRATE:-false}" = "true" ] || [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
    echo "Running database migrations..."
    php artisan migrate --force || echo "Migration encountered an issue, proceeding anyway..."
fi

# 7. WAJIB PALING AKHIR SEBELUM SUPERVISORD:
# Bikin file laravel.log dan serahkan SEMUA hak akses ke www-data!
touch /var/www/html/storage/logs/laravel.log
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# 8. Tampilkan isi laravel.log langsung ke Deploy Logs Railway secara real-time!
tail -n 0 -F /var/www/html/storage/logs/laravel.log &

echo "Starting Nginx and PHP-FPM via Supervisord..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
