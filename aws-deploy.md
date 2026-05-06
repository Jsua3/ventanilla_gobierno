# Despliegue en AWS

Stack: **ECR + EC2 (t2.micro) + RDS MySQL (db.t3.micro)** — todo capa gratuita.

---

## Pre-requisitos

```bash
# Instalar AWS CLI
aws configure
# Access Key ID, Secret Access Key, región (ej: us-east-1), formato: json
```

---

## Paso 1 — Crear repositorio en ECR

```bash
# Crear repositorio
aws ecr create-repository \
  --repository-name ventanillagov-backend \
  --region us-east-1

# Autenticarse en ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS \
  --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
```

---

## Paso 2 — Build y Push de la imagen

```bash
# Build
docker build -t ventanillagov-backend ./backend

# Tag
docker tag ventanillagov-backend:latest \
  <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/ventanillagov-backend:latest

# Push
docker push \
  <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/ventanillagov-backend:latest
```

Reemplaza `<ACCOUNT_ID>` con tu ID de cuenta AWS (12 dígitos).

---

## Paso 3 — Crear RDS MySQL (capa gratuita)

```bash
# Crear subnet group (si no existe)
aws rds create-db-subnet-group \
  --db-subnet-group-name ventanillagov-subnet \
  --db-subnet-group-description "VentanillaGov DB Subnet" \
  --subnet-ids subnet-xxxxxxxx subnet-yyyyyyyy

# Crear instancia RDS MySQL
aws rds create-db-instance \
  --db-instance-identifier ventanillagov-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0 \
  --master-username ventanilla \
  --master-user-password "TuPasswordSegura2025!" \
  --db-name ventanillagov \
  --allocated-storage 20 \
  --no-multi-az \
  --publicly-accessible \
  --db-subnet-group-name ventanillagov-subnet

# Esperar a que esté disponible (~5 min)
aws rds wait db-instance-available --db-instance-identifier ventanillagov-db

# Obtener el endpoint
aws rds describe-db-instances \
  --db-instance-identifier ventanillagov-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text
```

---

## Paso 4 — Crear instancia EC2 (t2.micro, capa gratuita)

### 4.1 Security Group

```bash
# Crear security group
aws ec2 create-security-group \
  --group-name ventanillagov-sg \
  --description "VentanillaGov Security Group"

# Guardar el GroupId devuelto: sg-xxxxxxxxxx

# Reglas de entrada
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxxx \
  --protocol tcp --port 22 --cidr 0.0.0.0/0      # SSH

aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxxx \
  --protocol tcp --port 8080 --cidr 0.0.0.0/0    # Backend API

aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxxx \
  --protocol tcp --port 80 --cidr 0.0.0.0/0      # HTTP
```

### 4.2 Lanzar instancia EC2

```bash
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \   # Amazon Linux 2023 (us-east-1)
  --instance-type t2.micro \
  --key-name tu-key-pair \
  --security-group-ids sg-xxxxxxxxxx \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=ventanillagov}]' \
  --count 1

# Obtener IP pública
aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=ventanillagov" \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text
```

---

## Paso 5 — Configurar EC2 y desplegar el backend

```bash
# Conectarse por SSH
ssh -i tu-key-pair.pem ec2-user@<EC2_PUBLIC_IP>

# Dentro de la instancia EC2:

# Instalar Docker
sudo dnf update -y
sudo dnf install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Instalar AWS CLI (ya viene en Amazon Linux)
# Autenticarse en ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS \
  --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Correr el contenedor del backend
docker run -d \
  --name ventanillagov-backend \
  --restart unless-stopped \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e SPRING_DATASOURCE_URL="jdbc:mysql://<RDS_ENDPOINT>:3306/ventanillagov?useSSL=true&serverTimezone=America/Bogota" \
  -e SPRING_DATASOURCE_USERNAME=ventanilla \
  -e SPRING_DATASOURCE_PASSWORD="TuPasswordSegura2025!" \
  -e JWT_SECRET="TuJwtSecretDeProduccionMinimo32Caracteres!!" \
  <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/ventanillagov-backend:latest
```

---

## Paso 6 — Configurar firewall de RDS para EC2

```bash
# Permitir que EC2 acceda a RDS en el puerto 3306
aws ec2 authorize-security-group-ingress \
  --group-id <RDS_SECURITY_GROUP_ID> \
  --protocol tcp --port 3306 \
  --source-group <EC2_SECURITY_GROUP_ID>
```

---

## Variables de entorno requeridas

| Variable | Valor |
|---|---|
| `SPRING_PROFILES_ACTIVE` | `docker` |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://<RDS_ENDPOINT>:3306/ventanillagov?useSSL=true&serverTimezone=America/Bogota` |
| `SPRING_DATASOURCE_USERNAME` | `ventanilla` |
| `SPRING_DATASOURCE_PASSWORD` | Tu contraseña segura |
| `JWT_SECRET` | Clave aleatoria mínimo 32 caracteres |

---

## Verificar despliegue

```bash
# Logs del contenedor
docker logs -f ventanillagov-backend

# Health check
curl http://<EC2_PUBLIC_IP>:8080/api/tipos-tramite

# La API quedará en:
# http://<EC2_PUBLIC_IP>:8080
```

---

## Costos estimados (capa gratuita)

| Servicio | Capa gratuita |
|---|---|
| EC2 t2.micro | 750 h/mes por 12 meses |
| RDS db.t3.micro | 750 h/mes por 12 meses |
| ECR | 500 MB/mes gratis |
| Transferencia de datos | 15 GB/mes salida gratis |

> **Nota:** Detén las instancias cuando no las uses para conservar las horas gratuitas.

```bash
# Detener instancias
aws ec2 stop-instances --instance-ids i-xxxxxxxxxx
aws rds stop-db-instance --db-instance-identifier ventanillagov-db

# Iniciar instancias
aws ec2 start-instances --instance-ids i-xxxxxxxxxx
aws rds start-db-instance --db-instance-identifier ventanillagov-db
```
