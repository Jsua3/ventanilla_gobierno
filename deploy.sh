#!/bin/bash
set -e

echo "========================================"
echo "  VentanillaGov - Deploy en AWS EC2"
echo "========================================"

REPO="https://github.com/Jsua3/ventanilla_gobierno.git"
APP_DIR="/home/ubuntu/ventanillagov"

# ── 1. Swap (necesario para build Angular en t3.micro) ──────────────────────
if [ ! -f /swapfile ]; then
  echo "[1/6] Creando swap de 2GB..."
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
else
  echo "[1/6] Swap ya existe, OK"
fi

# ── 2. Instalar Docker ───────────────────────────────────────────────────────
if ! command -v docker &>/dev/null; then
  echo "[2/6] Instalando Docker..."
  sudo apt-get update -y
  sudo apt-get install -y docker.io docker-compose-plugin git curl
  sudo systemctl enable --now docker
  sudo usermod -aG docker ubuntu
else
  echo "[2/6] Docker ya instalado, OK"
fi

# ── 3. Verificar Docker Compose ──────────────────────────────────────────────
if ! sudo docker compose version &>/dev/null 2>&1; then
  echo "[3/6] Instalando Docker Compose plugin..."
  DOCKER_CONFIG=/root/.docker
  mkdir -p $DOCKER_CONFIG/cli-plugins
  curl -SL "https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-linux-x86_64" \
    -o $DOCKER_CONFIG/cli-plugins/docker-compose
  chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
else
  echo "[3/6] Docker Compose ya instalado, OK"
fi

# ── 4. Clonar o actualizar repositorio ──────────────────────────────────────
echo "[4/6] Obteniendo código desde GitHub..."
if [ -d "$APP_DIR" ]; then
  cd "$APP_DIR"
  git pull origin master
else
  git clone "$REPO" "$APP_DIR"
  cd "$APP_DIR"
fi

# ── 5. Variables de entorno ──────────────────────────────────────────────────
echo "[5/6] Configurando variables de entorno..."
if [ ! -f "$APP_DIR/.env" ]; then
cat > "$APP_DIR/.env" << 'ENVEOF'
MYSQL_PASSWORD=ventanilla2025
JWT_SECRET=VentanillaGovJwtSecretProduccion2025Colombia!!
ENVEOF
  echo ".env creado"
else
  echo ".env ya existe, OK"
fi

# ── 6. Levantar servicios ────────────────────────────────────────────────────
echo "[6/6] Levantando servicios con Docker Compose..."
echo "  (El build del frontend Angular puede tomar 10-15 minutos)"
cd "$APP_DIR"
sudo docker compose up -d --build

echo ""
echo "========================================"
echo "  Deploy completado!"
echo "========================================"
echo ""
echo "  Frontend:  http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "  Backend:   http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8080/api/tipos-tramite"
echo ""
echo "  Credenciales:"
echo "    Admin:       admin@gov.co / admin123"
echo "    Funcionario: func@gov.co  / func123"
echo "    Ciudadano:   user@gov.co  / user123"
echo ""
echo "  Ver logs:    sudo docker compose -f $APP_DIR/docker-compose.yml logs -f"
echo "  Ver estado:  sudo docker compose -f $APP_DIR/docker-compose.yml ps"
echo "========================================"
