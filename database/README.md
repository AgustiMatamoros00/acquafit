# Scripts de Base de Datos SQL Server

Estos scripts crean el schema y las tablas necesarias para AcquaFit en SQL Server.

## Orden de Ejecución

**Ejecutar en este orden:**

1. `01_create_schema.sql` - Crea el schema acquafit
2. `02_create_tables.sql` - Crea todas las tablas principales
3. `03_user_favorites.sql` - Crea tabla de favoritos

## Ejecutar con sqlcmd

```powershell
# Desde la carpeta database/
sqlcmd -S localhost -U sa -P sapwd -i 01_create_schema.sql
sqlcmd -S localhost -U sa -P sapwd -i 02_create_tables.sql
sqlcmd -S localhost -U sa -P sapwd -i 03_user_favorites.sql
```

## Ejecutar con Azure Data Studio

1. Conecta a tu servidor SQL: `localhost,1433`
2. Usuario: `sa`, Password: `sapwd`
3. Abre cada archivo `.sql` en orden
4. Presiona F5 o click en "Run" para ejecutar

## Verificar Instalación

Después de ejecutar los scripts, verifica que todo se creó correctamente:

```sql
-- Ver el schema
SELECT * FROM sys.schemas WHERE name = 'acquafit';

-- Ver las tablas
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'acquafit';

-- Deberías ver:
-- user
-- user_token
-- workout
-- exercise
-- workout_x_exercise
-- set
-- note
-- user_favorite_exercise
```

## Limpiar/Resetear

Si necesitas empezar de cero:

```sql
-- CUIDADO: Esto eliminará TODOS los datos
DROP SCHEMA acquafit CASCADE;
```

Luego vuelve a ejecutar los 3 scripts en orden.

