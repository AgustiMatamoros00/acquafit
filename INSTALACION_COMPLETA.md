# 🎯 Instalación Completa - Paso a Paso

Esta guía te llevará desde 0 hasta tener AcquaFit funcionando completamente.

## ✅ Pre-requisitos

Antes de empezar, asegúrate de tener:

- [x] **Windows 10/11**
- [x] **Node.js 18+** instalado
- [x] **SQL Server** corriendo (tienes uno en Docker en `localhost:1433`)
- [x] **PowerShell** (viene con Windows)

## 📥 Paso 1: Verificar Requisitos

Abre PowerShell y ejecuta:

```powershell
# Verificar Node.js
node --version
# Debe mostrar v18.x.x o superior

# Verificar npm
npm --version

# Verificar SQL Server
docker ps | findstr sql
# Debe mostrar tu contenedor 'sql' corriendo
```

Si algo falla, instala lo necesario primero.

## 📂 Paso 2: Navegar al Proyecto

```powershell
cd C:\Users\AgustíMatamoros\Repositories\acquafit-windows
```

## 🔧 Paso 3: Instalación Automática

Ejecuta el script de instalación completa:

```powershell
.\scripts\install-all.ps1
```

Este script:
- ✅ Instala dependencias del backend
- ✅ Instala dependencias del frontend
- ✅ Crea el archivo .env
- ⏱️ Tarda ~3-5 minutos

## 🗄️ Paso 4: Configurar Base de Datos

Ejecuta el script de setup de BD:

```powershell
.\scripts\setup-database.ps1
```

Este script:
- ✅ Conecta a tu SQL Server (localhost:1433)
- ✅ Crea el schema `acquafit`
- ✅ Crea todas las tablas
- ✅ Crea índices
- ⏱️ Tarda ~30 segundos

Si ves errores, verifica que tu contenedor Docker esté corriendo.

## 🚀 Paso 5: Iniciar Aplicación

Necesitas **2 terminales PowerShell**:

### Terminal 1 - Backend

```powershell
cd C:\Users\AgustíMatamoros\Repositories\acquafit-windows
.\scripts\start-backend.ps1
```

Espera a ver:
```
✅ Connected to SQL Server successfully
🚀 Server is running on port 3000
```

### Terminal 2 - Frontend

```powershell
cd C:\Users\AgustíMatamoros\Repositories\acquafit-windows
.\scripts\start-frontend.ps1
```

Espera a ver:
```
✔ Browser application bundle generation complete.
** Angular Live Development Server is listening on localhost:4200 **
```

## 👤 Paso 6: Crear Usuario

En una **tercera terminal** (o después de que arranque todo):

```powershell
.\scripts\create-first-user.ps1
```

Esto crea:
- 📧 Email: `admin@acquafit.com`
- 🔑 Password: `admin123`

O crea un usuario personalizado:

```powershell
.\scripts\create-first-user.ps1 -Email "tu@email.com" -Password "tupassword" -Name "Tu" -Surname "Nombre"
```

## 🎉 Paso 7: Probar la Aplicación

1. Abre tu navegador en: **http://localhost:4200**
2. Deberías ver la pantalla de login de AcquaFit
3. Ingresa:
   - Email: `admin@acquafit.com`
   - Password: `admin123`
4. ¡Listo!

## 🔍 Verificación Completa

### Verificar Backend

Abre en el navegador o usa curl:

```powershell
# Endpoint público
curl http://localhost:3000

# Debería responder:
# {"message":"Welcome to AcquaFit API - Windows Version with SQL Server"}
```

### Verificar Base de Datos

Conecta con Azure Data Studio o sqlcmd:

```powershell
sqlcmd -S localhost -U sa -P sapwd -Q "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='acquafit'"
```

Deberías ver 8 tablas.

### Verificar Frontend

Si abres http://localhost:4200 y ves la interfaz de login, ¡funciona!

## ❌ Solución de Problemas

### Error: "Cannot connect to SQL Server"

```powershell
# Verifica que el contenedor esté corriendo
docker ps

# Si no está, inícialo
docker start sql

# Verifica que puedas conectarte
sqlcmd -S localhost -U sa -P sapwd -Q "SELECT @@VERSION"
```

### Error: "Port 3000 is already in use"

```powershell
# Encuentra qué proceso usa el puerto
netstat -ano | findstr :3000

# Mata el proceso (cambia PID por el número que encontraste)
taskkill /PID <PID> /F

# O cambia el puerto en backend/.env
# PORT=3001
```

### Error: "Module not found"

```powershell
# Reinstala dependencias
cd backend
Remove-Item -Recurse -Force node_modules
npm install

cd ../frontend
Remove-Item -Recurse -Force node_modules
npm install
```

### Frontend no carga / Error de proxy

Verifica que el backend esté corriendo ANTES de iniciar el frontend.

### Error al crear usuario: "Email already registered"

El usuario ya existe. Intenta hacer login con ese email o usa otro email.

## 📱 Próximos Pasos

Ahora que todo funciona:

1. **Explora la API:** Lee el `README.md` para ver todos los endpoints
2. **Crea ejercicios:** Necesitas ser superadmin (modifica en BD)
3. **Desarrolla:** Modifica el código y verás cambios en tiempo real
4. **Deploy:** Cuando estés listo para producción, cambia:
   - `JWT_SECRET` en `.env`
   - Configuración de SQL Server
   - Build de producción del frontend

## 🎓 Recursos Adicionales

- **README.md** - Documentación completa
- **QUICK_START.md** - Guía rápida
- **MIGRATION_NOTES.md** - Detalles de la migración
- **ESTRUCTURA.md** - Estructura del proyecto
- **database/README.md** - Info sobre la base de datos

## 🆘 ¿Necesitas Ayuda?

Si algo no funciona:

1. Revisa los logs del backend (terminal 1)
2. Revisa los logs del frontend (terminal 2)
3. Verifica la consola del navegador (F12)
4. Lee la sección de "Solución de Problemas" en `README.md`

---

**¡Disfruta usando AcquaFit!** 💪🏋️‍♂️

