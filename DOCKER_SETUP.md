# 🐳 Guía de Desarrollo con Docker

Esta guía te ayudará a ejecutar AcquaFit usando Docker y SQL Server.

## 📋 Prerrequisitos

- Docker Desktop instalado y ejecutándose
- Docker Compose (incluido en Docker Desktop)
- Contenedores Linux habilitados en Docker Desktop

## 🚀 Inicio Rápido

### 1. Iniciar todos los servicios

```bash
docker-compose -f docker-compose-dev.yml up --build
```

Esto iniciará:
- **SQL Server 2022** en `localhost:1433`
- **Backend (Node.js/Express)** en `http://localhost:3000`
- **Frontend (Angular)** en `http://localhost:4200`

### 2. Acceder a la aplicación

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000
- Debug port (backend): 9229

### 3. Detener los servicios

```bash
docker-compose -f docker-compose-dev.yml down
```

Para eliminar también los volúmenes (datos de la base de datos):

```bash
docker-compose -f docker-compose-dev.yml down -v
```

## 🗄️ Configuración de la Base de Datos

### Credenciales por defecto:
- **Host**: localhost
- **Puerto**: 1433
- **Usuario**: sa
- **Password**: AcquaFit2024!
- **Database**: acquafit

### Inicializar la base de datos

Los scripts SQL en la carpeta `database/` deben ejecutarse manualmente la primera vez:

1. Conéctate al contenedor de SQL Server:

```bash
docker exec -it acquafit-windows-database-1 /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "AcquaFit2024!"
```

2. O usa un cliente SQL como Azure Data Studio o SQL Server Management Studio:
   - Servidor: `localhost,1433`
   - Usuario: `sa`
   - Password: `AcquaFit2024!`

3. Ejecuta los scripts en orden:
   - `01_create_database.sql`
   - `02_create_tables.sql`
   - `03_user_favorites.sql`

## 🔧 Comandos Útiles

### Ver logs de un servicio específico

```bash
# Backend
docker-compose -f docker-compose-dev.yml logs -f backend

# Frontend
docker-compose -f docker-compose-dev.yml logs -f frontend

# Database
docker-compose -f docker-compose-dev.yml logs -f database
```

### Reconstruir un servicio específico

```bash
# Backend
docker-compose -f docker-compose-dev.yml up --build backend

# Frontend
docker-compose -f docker-compose-dev.yml up --build frontend
```

### Reiniciar un servicio

```bash
docker-compose -f docker-compose-dev.yml restart backend
docker-compose -f docker-compose-dev.yml restart frontend
docker-compose -f docker-compose-dev.yml restart database
```

### Entrar en un contenedor

```bash
# Backend
docker-compose -f docker-compose-dev.yml exec backend sh

# Frontend
docker-compose -f docker-compose-dev.yml exec frontend sh

# Database
docker-compose -f docker-compose-dev.yml exec database bash
```

### Verificar el estado de los servicios

```bash
docker-compose -f docker-compose-dev.yml ps
```

## 🐛 Debugging

### Backend (Node.js)

El puerto 9229 está expuesto para debugging. Puedes conectar tu IDE:

**VS Code (launch.json):**

```json
{
  "type": "node",
  "request": "attach",
  "name": "Docker: Attach to Node",
  "port": 9229,
  "address": "localhost",
  "restart": true,
  "sourceMaps": true,
  "localRoot": "${workspaceFolder}/backend",
  "remoteRoot": "/app"
}
```

## 🔄 Hot Reload

- **Backend**: Usa `nodemon` para recargar automáticamente al guardar archivos `.js`
- **Frontend**: Angular CLI recompila automáticamente al guardar archivos

## 📦 Volúmenes

El proyecto usa volúmenes para:

1. **Código fuente**: Los cambios se reflejan inmediatamente (hot reload)
2. **node_modules**: Se mantienen dentro del contenedor para evitar conflictos
3. **sqlserver_data**: Persiste los datos de SQL Server entre reinicios

## ⚠️ Solución de Problemas

### El contenedor de database no inicia

1. Verifica que tienes al menos 2GB de RAM disponibles para Docker
2. Verifica los logs: `docker-compose -f docker-compose-dev.yml logs database`
3. Asegúrate de que el puerto 1433 no está ocupado

### Backend no puede conectarse a la base de datos

1. Espera a que el healthcheck de database sea `healthy`:
   ```bash
   docker-compose -f docker-compose-dev.yml ps
   ```
2. Verifica las credenciales en el docker-compose-dev.yml

### Frontend no puede conectarse al backend

1. Verifica que el backend esté corriendo: http://localhost:3000
2. Revisa el archivo `proxy.conf.js` en el frontend
3. Verifica los logs del frontend

### Error de permisos en Linux/Mac

```bash
# Dar permisos a los scripts SQL
chmod -R 755 database/
```

## 🔐 Seguridad

⚠️ **IMPORTANTE**: Las credenciales en este archivo son para desarrollo local únicamente. 

**NUNCA uses estas credenciales en producción.**

Para producción:
- Cambia todas las contraseñas
- Usa secrets de Docker o variables de entorno seguras
- Configura SSL/TLS para SQL Server
- Usa un usuario de base de datos específico (no `sa`)

## 📚 Más Información

- [Documentación de SQL Server en Docker](https://learn.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js en Docker](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Angular en Docker](https://angular.io/guide/deployment)

