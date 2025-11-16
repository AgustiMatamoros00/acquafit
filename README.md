# AcquaFit - Windows Version (SQL Server)

Aplicación de tracking de entrenamientos de gimnasio. Esta versión ha sido adaptada para funcionar en Windows con SQL Server, sin usar Docker.

## 🏗️ Arquitectura

- **Backend**: Node.js + Express + SQL Server
- **Frontend**: Angular 17 (Standalone Components)
- **Base de Datos**: SQL Server 2022

## 📋 Requisitos Previos

### Software Necesario

1. **Node.js** (v18 o superior)
   - Descargar desde: https://nodejs.org/

2. **SQL Server 2022** (ya tienes uno en Docker)
   - Tu instancia en Docker: `localhost:1433`
   - Usuario: `sa`
   - Contraseña: `sapwd`

3. **Angular CLI** (se instalará con npm)

## 🚀 Instalación

### 1. Configurar la Base de Datos

Ejecuta los scripts SQL en orden en tu SQL Server:

```bash
# Conéctate a SQL Server (puedes usar Azure Data Studio, SQL Server Management Studio, o sqlcmd)

# Ejecuta los siguientes scripts en orden:
database/01_create_schema.sql
database/02_create_tables.sql
database/03_user_favorites.sql
```

**Opción con sqlcmd (desde PowerShell/CMD):**

```powershell
# Navega a la carpeta database
cd database

# Ejecuta cada script
sqlcmd -S localhost -U sa -P sapwd -i 01_create_schema.sql
sqlcmd -S localhost -U sa -P sapwd -i 02_create_tables.sql
sqlcmd -S localhost -U sa -P sapwd -i 03_user_favorites.sql
```

**Opción con Azure Data Studio:**
1. Abre Azure Data Studio
2. Conecta a: `localhost,1433` (usuario: `sa`, password: `sapwd`)
3. Abre cada archivo .sql y ejecútalo en orden

### 2. Configurar el Backend

```powershell
# Navega a la carpeta backend
cd backend

# Instala las dependencias
npm install

# Crea el archivo .env (copia del ejemplo)
Copy-Item .env.example .env

# Edita el archivo .env si necesitas cambiar la configuración
# Por defecto ya está configurado para tu SQL Server:
# DB_HOST=localhost
# DB_PORT=1433
# DB_USER=sa
# DB_PASSWORD=sapwd
# DB_NAME=master
```

### 3. Configurar el Frontend

```powershell
# Navega a la carpeta frontend
cd ../frontend

# Instala las dependencias
npm install
```

## ▶️ Ejecutar la Aplicación

### Modo Desarrollo

Necesitas **2 terminales separadas**:

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
# El backend estará en: http://localhost:3000
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
# El frontend estará en: http://localhost:4200
```

### Verificar que Funciona

1. Abre tu navegador en: `http://localhost:4200`
2. Deberías ver la pantalla de login de AcquaFit
3. Primero necesitas registrar un usuario usando la API

### Crear el Primer Usuario

Usa Postman, Insomnia, o curl para registrar un usuario:

```powershell
# Con PowerShell (Invoke-RestMethod)
$body = @{
    email = "test@example.com"
    password = "password123"
    name = "Test"
    surname = "User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/auth/register" -Method POST -Body $body -ContentType "application/json"
```

```bash
# Con curl (desde Git Bash o WSL)
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test",
    "surname": "User"
  }'
```

Ahora puedes hacer login en la interfaz web con esas credenciales.

## 🔧 Configuración

### Variables de Entorno (backend/.env)

```env
# Configuración de SQL Server
DB_HOST=localhost          # Host del servidor SQL
DB_PORT=1433              # Puerto (1433 por defecto)
DB_USER=sa                # Usuario de SQL Server
DB_PASSWORD=sapwd         # Contraseña
DB_NAME=master            # Base de datos

# Configuración del servidor
PORT=3000                 # Puerto del backend

# Seguridad
JWT_SECRET=tu-clave-secreta-aqui  # Cambia esto en producción
```

### Proxy del Frontend

El frontend usa un proxy configurado en `frontend/proxy.conf.js` que redirige las peticiones API al backend:

- `/auth/*` → `http://localhost:3000`
- `/users/*` → `http://localhost:3000`
- `/workouts/*` → `http://localhost:3000`
- `/exercises/*` → `http://localhost:3000`
- `/sets/*` → `http://localhost:3000`
- `/workout_x_exercise/*` → `http://localhost:3000`

## 📚 API Endpoints

### Autenticación

- **POST** `/auth/register` - Registrar usuario
- **POST** `/auth/login` - Iniciar sesión

### Usuarios (requiere autenticación)

- **GET** `/users` - Listar usuarios (solo superadmin)
- **GET** `/users/:id` - Obtener usuario
- **PATCH** `/users/:id` - Actualizar usuario
- **DELETE** `/users/:id` - Eliminar usuario

### Workouts (requiere autenticación)

- **GET** `/workouts` - Listar workouts del usuario
- **POST** `/workouts` - Crear workout
- **GET** `/workouts/:id` - Obtener workout específico
- **PATCH** `/workouts/:id` - Actualizar workout
- **DELETE** `/workouts/:id` - Eliminar workout

### Ejercicios (requiere autenticación)

- **GET** `/exercises` - Listar todos los ejercicios
- **POST** `/exercises` - Crear ejercicio (solo superadmin)
- **GET** `/exercises/:id` - Obtener ejercicio
- **PATCH** `/exercises/:id` - Actualizar ejercicio (solo superadmin)
- **DELETE** `/exercises/:id` - Eliminar ejercicio (solo superadmin)
- **GET** `/exercises/favorites` - Ejercicios favoritos del usuario
- **POST** `/exercises/favorites/:exerciseId` - Añadir a favoritos
- **DELETE** `/exercises/favorites/:exerciseId` - Quitar de favoritos

### Sets (requiere autenticación)

- **GET** `/sets/:setId` - Obtener set
- **POST** `/sets` - Crear set
- **PATCH** `/sets/:setId` - Actualizar set
- **DELETE** `/sets/:setId` - Eliminar set

### Workout x Exercise (requiere autenticación)

- **GET** `/workout_x_exercise/:id` - Obtener relación
- **POST** `/workout_x_exercise` - Añadir ejercicio a workout
- **PATCH** `/workout_x_exercise/:id` - Actualizar
- **DELETE** `/workout_x_exercise/:id` - Eliminar

## 🔐 Autenticación

La API usa **JWT (JSON Web Tokens)** para autenticación.

Después de hacer login, incluye el token en las peticiones:

```
Authorization: Bearer {tu-token-jwt}
```

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

- `acquafit.[user]` - Usuarios del sistema
- `acquafit.user_token` - Tokens de sesión
- `acquafit.workout` - Entrenamientos
- `acquafit.exercise` - Catálogo de ejercicios
- `acquafit.workout_x_exercise` - Relación workout-ejercicio
- `acquafit.[set]` - Sets de ejercicios
- `acquafit.note` - Notas sobre workouts/ejercicios
- `acquafit.user_favorite_exercise` - Ejercicios favoritos

## 🆚 Diferencias con la Versión Original

### Cambios de PostgreSQL a SQL Server

1. **Tipos de Datos:**
   - `SERIAL` → `INT IDENTITY(1,1)`
   - `TEXT` → `NVARCHAR(MAX)` / `NVARCHAR(255)`
   - `TIMESTAMP(0)` → `DATETIME2(0)`
   - `ENUM` → `CHECK` constraints

2. **Sintaxis SQL:**
   - `RETURNING *` → `OUTPUT INSERTED.*`
   - `"user"` (comillas dobles) → `[user]` (corchetes)
   - `LIMIT 1` → `TOP 1`
   - `ON CONFLICT` → manejo con TRY-CATCH

3. **Driver de Base de Datos:**
   - `pg-promise` → `mssql`

### Sin Docker

- No hay archivos `Dockerfile`
- No hay `docker-compose.yml`
- Instalación y ejecución directa con Node.js
- Base de datos externa (tu SQL Server en Docker)

## 🐛 Solución de Problemas

### Error: "Cannot connect to SQL Server"

1. Verifica que tu contenedor de SQL Server esté corriendo:
   ```powershell
   docker ps
   ```

2. Verifica la configuración en `backend/.env`

3. Prueba la conexión:
   ```powershell
   sqlcmd -S localhost -U sa -P sapwd -Q "SELECT @@VERSION"
   ```

### Error: "Port 3000 already in use"

Cambia el puerto en `backend/.env`:
```env
PORT=3001
```

Y actualiza el proxy del frontend en `frontend/proxy.conf.js`:
```javascript
target: "http://localhost:3001"
```

### Error: "Module not found"

Reinstala las dependencias:
```powershell
# Backend
cd backend
Remove-Item -Recurse -Force node_modules
npm install

# Frontend
cd ../frontend
Remove-Item -Recurse -Force node_modules
npm install
```

## 📦 Scripts Disponibles

### Backend

```powershell
npm start       # Iniciar servidor
npm run dev     # Iniciar con nodemon (reinicio automático)
```

### Frontend

```powershell
npm start       # Servidor de desarrollo (localhost:4200)
npm run build   # Build de producción
npm test        # Ejecutar tests
```

## 🔒 Seguridad

⚠️ **IMPORTANTE para Producción:**

1. Cambia `JWT_SECRET` en el archivo `.env`
2. Usa contraseñas seguras para SQL Server
3. No expongas el puerto de SQL Server públicamente
4. Implementa rate limiting en la API
5. Habilita HTTPS
6. Valida y sanitiza todas las entradas

## 📝 Notas Adicionales

- El schema `acquafit` contiene todas las tablas
- Los passwords se almacenan hasheados con bcrypt (10 rounds)
- Los tokens JWT expiran en 24 horas
- Las cascadas de DELETE están configuradas en las FK

## 🤝 Créditos

Migrado de PostgreSQL + Docker a SQL Server + Windows
Versión: 1.0.0

---

**¿Problemas?** Revisa la consola del backend y frontend para ver los errores específicos.

