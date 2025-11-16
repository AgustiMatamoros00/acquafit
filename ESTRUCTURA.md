# Estructura del Proyecto AcquaFit-Windows

```
acquafit-windows/
│
├── backend/                          # Servidor Node.js + Express
│   ├── middleware/
│   │   └── auth.js                   # Middleware de autenticación JWT
│   ├── repositories/
│   │   └── db.js                     # Conexión y queries a SQL Server
│   ├── routes/
│   │   ├── index.js                  # Ruta principal
│   │   ├── auth_routes.js            # Login/Register
│   │   ├── users_routes.js           # CRUD usuarios
│   │   ├── workout_routes.js         # CRUD workouts
│   │   ├── exercise_routes.js        # CRUD ejercicios
│   │   ├── set_routes.js             # CRUD sets
│   │   └── workout_x_exercise_routes.js  # Relación workouts-ejercicios
│   ├── app.js                        # Punto de entrada del servidor
│   ├── package.json                  # Dependencias (mssql, express, jwt, bcrypt)
│   ├── env.example                   # Ejemplo de configuración
│   └── config.example.js             # Explicación de la configuración
│
├── frontend/                         # Aplicación Angular 17
│   ├── src/
│   │   ├── app/
│   │   │   ├── services/
│   │   │   │   └── api.service.ts    # Servicio para llamadas HTTP
│   │   │   ├── app.component.ts      # Componente principal
│   │   │   ├── app.component.html    # Template
│   │   │   ├── app.component.scss    # Estilos
│   │   │   ├── app.config.ts         # Configuración de Angular
│   │   │   └── app.routes.ts         # Rutas (vacío por ahora)
│   │   ├── index.html                # HTML principal
│   │   ├── main.ts                   # Bootstrap de Angular
│   │   └── styles.css                # Estilos globales
│   ├── angular.json                  # Configuración de Angular CLI
│   ├── package.json                  # Dependencias de Angular
│   ├── proxy.conf.js                 # Proxy para desarrollo (API → backend)
│   ├── tsconfig.json                 # Configuración TypeScript
│   └── tsconfig.app.json             # Config específica de la app
│
├── database/                         # Scripts SQL para SQL Server
│   ├── 00_test_connection.sql        # Verificar conexión
│   ├── 01_create_schema.sql          # Crear schema acquafit
│   ├── 02_create_tables.sql          # Crear todas las tablas
│   ├── 03_user_favorites.sql         # Tabla de favoritos
│   └── README.md                     # Instrucciones de BD
│
├── scripts/                          # Scripts PowerShell de automatización
│   ├── install-all.ps1               # Instalar todas las dependencias
│   ├── setup-database.ps1            # Configurar base de datos automáticamente
│   ├── start-backend.ps1             # Iniciar backend
│   ├── start-frontend.ps1            # Iniciar frontend
│   └── create-first-user.ps1         # Crear usuario inicial
│
├── .gitignore                        # Archivos ignorados por Git
├── package.json                      # Scripts NPM del proyecto raíz
├── README.md                         # Documentación completa
├── QUICK_START.md                    # Guía de inicio rápido
├── MIGRATION_NOTES.md                # Notas sobre la migración
└── ESTRUCTURA.md                     # Este archivo

```

## 📊 Base de Datos (Schema: acquafit)

### Tablas

1. **[USER]** - Usuarios del sistema
2. **USER_TOKEN** - Tokens de sesión (JWT)
3. **WORKOUT** - Entrenamientos
4. **EXERCISE** - Catálogo de ejercicios
5. **WORKOUT_X_EXERCISE** - Relación N:N workout-ejercicio
6. **[SET]** - Series de ejercicios (peso, reps, RIR)
7. **NOTE** - Notas sobre workouts/ejercicios/sets
8. **USER_FAVORITE_EXERCISES** - Ejercicios favoritos por usuario

### Relaciones

```
user (1) ────< (N) WORKOUT
user (1) ────< (N) USER_TOKEN
user (1) ────< (N) USER_FAVORITE_EXERCISE

WORKOUT (1) ────< (N) WORKOUT_X_EXERCISE
EXERCISE (1) ────< (N) WORKOUT_X_EXERCISE
EXERCISE (1) ────< (N) USER_FAVORITE_EXERCISE

WORKOUT_X_EXERCISE (1) ────< (N) SET

WORKOUT (1) ────< (N) NOTE
EXERCISE (1) ────< (N) NOTE
SET (1) ────< (N) NOTE
```

## 🔌 API Endpoints

### Públicos
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión

### Protegidos (requieren JWT)
- **Users:** `GET/PATCH/DELETE /users/:id`
- **Workouts:** `GET/POST/PATCH/DELETE /workouts`
- **Exercises:** `GET/POST/PATCH/DELETE /exercises`
- **Sets:** `GET/POST/PATCH/DELETE /sets`
- **Favorites:** `GET/POST/DELETE /exercises/favorites`

## 🚀 Comandos Rápidos

```powershell
# Instalación completa
.\scripts\install-all.ps1

# Setup de base de datos
.\scripts\setup-database.ps1

# Iniciar backend
.\scripts\start-backend.ps1

# Iniciar frontend (otra terminal)
.\scripts\start-frontend.ps1

# Crear primer usuario
.\scripts\create-first-user.ps1
```

## 🛠️ Tecnologías

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express 4.x
- **Database:** mssql 10.x (driver para SQL Server)
- **Auth:** jsonwebtoken 9.x + bcrypt 5.x
- **Env:** dotenv 16.x

### Frontend
- **Framework:** Angular 17 (standalone components)
- **HTTP:** RxJS + HttpClient
- **Styling:** CSS puro
- **Dev Server:** webpack-dev-server (incluido en Angular CLI)

### Base de Datos
- **DBMS:** SQL Server 2019+
- **Schema:** acquafit
- **Features:** 
  - IDENTITY para auto-incremento
  - CHECK constraints para validación
  - Foreign Keys con CASCADE
  - Índices en FK principales

## 📦 Dependencias Principales

### Backend (backend/package.json)
```json
{
  "express": "~4.16.1",
  "mssql": "^10.0.1",
  "bcrypt": "^5.1.0",
  "jsonwebtoken": "^9.0.2",
  "dotenv": "^16.3.1",
  "morgan": "~1.9.1",
  "cookie-parser": "~1.4.4"
}
```

### Frontend (frontend/package.json)
```json
{
  "@angular/core": "^17.0.0",
  "@angular/common": "^17.0.0",
  "@angular/forms": "^17.0.0",
  "@angular/router": "^17.0.0",
  "rxjs": "~7.8.0",
  "zone.js": "~0.14.2"
}
```

## 🔐 Seguridad

- ✅ Passwords hasheados con bcrypt (10 rounds)
- ✅ JWT tokens con expiración (24h)
- ✅ Parámetros SQL preparados (prevención SQL injection)
- ✅ Validación de permisos por usuario
- ✅ CORS configurado
- ⚠️ En producción: cambiar JWT_SECRET, usar HTTPS, habilitar encrypt en SQL

## 📝 Archivos de Configuración

- **backend/.env** - Variables de entorno (NO commitear)
- **backend/env.example** - Template de configuración
- **frontend/proxy.conf.js** - Proxy de desarrollo
- **angular.json** - Config de Angular CLI
- **tsconfig.json** - Config de TypeScript

## 🎯 Flujo de Desarrollo

1. Usuario hace login en Angular (localhost:4200)
2. Angular envía request a /auth/login
3. Proxy redirige a backend (localhost:3000)
4. Backend valida en SQL Server
5. Backend devuelve JWT token
6. Angular guarda token en localStorage
7. Requests siguientes incluyen token en header
8. Backend valida token y procesa request

---

**Total de archivos creados:** ~40
**Líneas de código (aprox):** 3,500+
**Tiempo de migración:** < 10 minutos 🚀

