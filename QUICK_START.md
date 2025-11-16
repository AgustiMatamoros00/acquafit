# 🚀 Inicio Rápido - AcquaFit Windows

## Para tu SQL Server en Docker

Tu configuración actual:
- **Host:** `localhost` (172.18.8.89 en red Docker)
- **Puerto:** `1433`
- **Usuario:** `sa`
- **Password:** `sapwd`
- **Container:** `sql`

## 3 Pasos Rápidos

### 1️⃣ Crear la Base de Datos (5 minutos)

```powershell
# Opción A: Con sqlcmd
cd database
sqlcmd -S localhost -U sa -P sapwd -i 01_create_schema.sql
sqlcmd -S localhost -U sa -P sapwd -i 02_create_tables.sql
sqlcmd -S localhost -U sa -P sapwd -i 03_user_favorites.sql

# Opción B: Con Azure Data Studio
# 1. Conectar a localhost,1433 (sa/sapwd)
# 2. Ejecutar cada .sql en orden
```

### 2️⃣ Instalar Dependencias (3 minutos)

```powershell
# Backend
cd backend
npm install

# Frontend (en otra terminal)
cd frontend
npm install
```

### 3️⃣ Arrancar Todo (2 comandos)

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```

## ✅ Verificar

1. Abre: http://localhost:4200
2. Deberías ver la pantalla de login

## 👤 Crear Usuario

```powershell
# PowerShell
$body = @{
    email = "admin@acquafit.com"
    password = "admin123"
    name = "Admin"
    surname = "AcquaFit"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/auth/register" -Method POST -Body $body -ContentType "application/json"
```

Ahora inicia sesión con: `admin@acquafit.com` / `admin123`

## 🎉 ¡Listo!

Ya puedes usar AcquaFit sin Docker.

---

**¿Problemas?** Mira el README.md completo

