# Notas de Migración: PostgreSQL → SQL Server

Este documento detalla los cambios realizados al migrar de PostgreSQL a SQL Server.

## Cambios en la Base de Datos

### 1. Tipos de Datos

| PostgreSQL | SQL Server | Notas |
|------------|------------|-------|
| `SERIAL` | `INT IDENTITY(1,1)` | Auto-incremento |
| `TEXT` | `NVARCHAR(MAX)` o `NVARCHAR(255)` | Texto variable |
| `TIMESTAMP(0)` | `DATETIME2(0)` | Fecha/hora con precisión |
| `BOOLEAN` | `BIT` | SQL Server usa BIT para booleanos |

### 2. Tipos ENUM

PostgreSQL permite crear tipos ENUM personalizados. SQL Server no los tiene nativamente.

**Antes (PostgreSQL):**
```sql
CREATE TYPE acquafit.weight_units AS ENUM('kg', 'lbs');
CREATE TYPE acquafit.gym_muscles AS ENUM('Lats', 'Chest', ...);
```

**Después (SQL Server):**
```sql
-- Usando CHECK constraints
weight_unit NVARCHAR(10) NOT NULL CHECK (weight_unit IN ('kg', 'lbs'))
muscle NVARCHAR(50) NOT NULL CHECK (muscle IN ('Lats', 'Chest', ...))
```

### 3. Sintaxis de INSERT con RETURNING

**Antes (PostgreSQL):**
```sql
INSERT INTO table (col1, col2) 
VALUES ($1, $2) 
RETURNING *;
```

**Después (SQL Server):**
```sql
INSERT INTO table (col1, col2) 
OUTPUT INSERTED.*
VALUES (@param1, @param2);
```

### 4. Sintaxis de UPDATE con RETURNING

**Antes (PostgreSQL):**
```sql
UPDATE table 
SET col1 = $1 
WHERE id = $2 
RETURNING *;
```

**Después (SQL Server):**
```sql
UPDATE table 
SET col1 = @param1 
OUTPUT INSERTED.*
WHERE id = @param2;
```

### 5. Sintaxis de DELETE con RETURNING

**Antes (PostgreSQL):**
```sql
DELETE FROM table 
WHERE id = $1 
RETURNING id;
```

**Después (SQL Server):**
```sql
DELETE FROM table 
OUTPUT DELETED.id
WHERE id = @param1;
```

### 6. Identificadores Reservados

**PostgreSQL** usa comillas dobles para escapar palabras reservadas:
```sql
"user", "name", "set"
```

**SQL Server** usa corchetes:
```sql
[user], [name], [set]
```

### 7. LIMIT vs TOP

**Antes (PostgreSQL):**
```sql
SELECT * FROM table LIMIT 1;
```

**Después (SQL Server):**
```sql
SELECT TOP 1 * FROM table;
```

### 8. ON CONFLICT

PostgreSQL tiene `ON CONFLICT DO NOTHING` para manejar duplicados.

**Antes (PostgreSQL):**
```sql
INSERT INTO table (col1, col2) 
VALUES ($1, $2) 
ON CONFLICT (col1, col2) DO NOTHING;
```

**Después (SQL Server):**
```javascript
// Manejado en el código con TRY-CATCH
try {
    await db.none('INSERT INTO table...');
} catch (err) {
    // Ignorar error de constraint unique
}
```

### 9. Valores por Defecto

**Antes (PostgreSQL):**
```sql
CURRENT_TIMESTAMP
DEFAULT FALSE
```

**Después (SQL Server):**
```sql
GETDATE()  -- o GETUTCDATE()
DEFAULT 0  -- BIT usa 0/1
```

### 10. Cascadas en Foreign Keys

Ambos soportan `ON DELETE CASCADE`, pero SQL Server requiere especificarlo explícitamente:

```sql
REFERENCES acquafit.[user](id) ON DELETE CASCADE
```

## Cambios en el Backend (Node.js)

### 1. Driver de Base de Datos

**Antes:**
```javascript
const pgp = require('pg-promise')();
const db = pgp(config);
```

**Después:**
```javascript
const sql = require('mssql');
const poolPromise = new sql.ConnectionPool(config).connect();
```

### 2. Configuración de Conexión

**Antes (pg-promise):**
```javascript
const config = {
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
};
```

**Después (mssql):**
```javascript
const config = { // Esta configuración depende de lo que esté escrito en el db.js
    user: 'sa',
    password: 'password',
    server: 'localhost',  // 'host' → 'server'
    port: 1433,
    database: 'master',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};
```

### 3. Placeholders de Parámetros

**Antes (PostgreSQL):** `$1, $2, $3`
**Después (SQL Server):** `@param1, @param2, @param3`

El módulo `db.js` maneja la conversión automáticamente.

### 4. Métodos de Query

Se mantienen los mismos métodos para compatibilidad:
- `db.any()` - Múltiples resultados
- `db.one()` - Un resultado (error si no hay)
- `db.oneOrNone()` - Un resultado o null
- `db.none()` - Sin resultados esperados

## Cambios en package.json

**Dependencias cambiadas:**

```diff
- "pg-promise": "^11.13.0"
+ "mssql": "^10.0.1"
+ "dotenv": "^16.3.1"
```

## Sin Docker

### Antes (con Docker)

- `docker-compose.yml` definía 4 servicios
- Base de datos, backend y frontend en contenedores
- Variables de entorno en docker-compose

### Después (sin Docker)

- Ejecución directa con Node.js
- Base de datos externa (SQL Server existente)
- Variables de entorno en archivos `.env`
- Instalación manual de dependencias

## Frontend

**Sin cambios** - El frontend se comunica con el backend vía API REST, por lo que no requiere modificaciones.

Únicos cambios:
- `proxy.conf.js` ahora apunta a `localhost:3000` en lugar de `backend:3000`

## Pruebas

Para verificar que la migración funcionó correctamente:

1. **Conexión a BD:** Backend debe conectarse sin errores
2. **Registro:** Crear un usuario nuevo
3. **Login:** Obtener JWT token
4. **CRUD Workouts:** Crear, leer, actualizar, eliminar
5. **CRUD Exercises:** Operaciones básicas
6. **Favoritos:** Añadir/quitar ejercicios favoritos

## Performance

SQL Server generalmente ofrece:
- ✅ Mejor rendimiento en Windows
- ✅ Mejor integración con herramientas Microsoft
- ✅ Índices y optimización automática
- ✅ Transacciones ACID robustas

## Compatibilidad

Esta versión es compatible con:
- Windows 10/11
- Windows Server 2019+
- SQL Server 2019+
- Node.js 18+
- Angular 17+

## Próximos Pasos

Posibles mejoras futuras:
- [ ] Migraciones automáticas (TypeORM o similar)
- [ ] Stored Procedures para operaciones complejas
- [ ] Índices adicionales según uso
- [ ] Backup automático de base de datos
- [ ] Logs estructurados
- [ ] Monitoreo de performance

---

**Fecha de migración:** Noviembre 2025
**Versión original:** PostgreSQL + Docker
**Versión actual:** SQL Server + Windows

