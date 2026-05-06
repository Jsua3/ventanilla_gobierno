#!/bin/bash
# VentanillaGov - Deploy script (Ubuntu 20/22/24 + Amazon Linux 2/2023)

REPO="https://github.com/Jsua3/ventanilla_gobierno.git"
APP_DIR="/home/ubuntu/ventanillagov"
LOG="/var/log/ventanillagov-deploy.log"

exec > "$LOG" 2>&1
echo "=== Deploy iniciado: $(date) ==="

# 1. Swap
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# 2. Docker (metodo universal - funciona en Ubuntu y Amazon Linux)
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com | bash
fi
systemctl enable --now docker

# 3. Clonar o actualizar repo
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" pull origin master
else
  git clone "$REPO" "$APP_DIR"
fi

# 4. .env
python3 -c "
content = 'MYSQL_PASSWORD=ventanilla2025\nJWT_SECRET=VentanillaGovSecret2025\n'
open('$APP_DIR/.env', 'w').write(content)
print('.env creado')
"

# 5. Docker Compose
cd "$APP_DIR"
docker compose up -d --build

echo "=== Deploy completado: $(date) ==="
IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "18.230.85.195")
echo "Frontend: http://$IP"
echo "Backend:  http://$IP:8080/api/tipos-tramite"
echo "Admin:    admin@gov.co / admin123"
echo "Func:     func@gov.co  / func123"
echo "User:     user@gov.co  / user123"
