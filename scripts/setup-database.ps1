# Script PowerShell para configurar la base de datos automáticamente
# Uso: .\scripts\setup-database.ps1

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  AcquaFit - Database Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Configuración de SQL Server
$server = "localhost"
$username = "sa"
$password = "sapwd"

Write-Host "🔍 Verificando conexión a SQL Server..." -ForegroundColor Yellow

# Probar conexión
$testQuery = "SELECT @@VERSION"
try {
    sqlcmd -S $server -U $username -P $password -Q $testQuery -h -1 | Out-Null
    Write-Host "✅ Conexión exitosa a SQL Server" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: No se puede conectar a SQL Server" -ForegroundColor Red
    Write-Host "   Verifica que el contenedor Docker esté corriendo:" -ForegroundColor Yellow
    Write-Host "   docker ps | findstr sql" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "📁 Ejecutando scripts SQL..." -ForegroundColor Yellow

# Cambiar al directorio database
$databasePath = Join-Path $PSScriptRoot "..\database"
Set-Location $databasePath

# Script 1: Crear schema
Write-Host "1️⃣  Creando schema acquafit..." -ForegroundColor Cyan
sqlcmd -S $server -U $username -P $password -i "01_create_schema.sql"
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Schema creado" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Error al crear schema (puede que ya exista)" -ForegroundColor Yellow
}

# Script 2: Crear tablas
Write-Host "2️⃣  Creando tablas..." -ForegroundColor Cyan
sqlcmd -S $server -U $username -P $password -i "02_create_tables.sql"
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Tablas creadas" -ForegroundColor Green
} else {
    Write-Host "   ❌ Error al crear tablas" -ForegroundColor Red
    exit 1
}

# Script 3: Crear tabla de favoritos
Write-Host "3️⃣  Creando tabla de favoritos..." -ForegroundColor Cyan
sqlcmd -S $server -U $username -P $password -i "03_user_favorites.sql"
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Tabla de favoritos creada" -ForegroundColor Green
} else {
    Write-Host "   ❌ Error al crear tabla de favoritos" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✅ Base de datos configurada exitosamente" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Tablas creadas:" -ForegroundColor Yellow
Write-Host "   - acquafit.[user]" -ForegroundColor Gray
Write-Host "   - acquafit.user_token" -ForegroundColor Gray
Write-Host "   - acquafit.workout" -ForegroundColor Gray
Write-Host "   - acquafit.exercise" -ForegroundColor Gray
Write-Host "   - acquafit.workout_x_exercise" -ForegroundColor Gray
Write-Host "   - acquafit.[set]" -ForegroundColor Gray
Write-Host "   - acquafit.note" -ForegroundColor Gray
Write-Host "   - acquafit.user_favorite_exercise" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. cd backend && npm install" -ForegroundColor White
Write-Host "   2. cd frontend && npm install" -ForegroundColor White
Write-Host "   3. Ejecutar backend: cd backend && npm start" -ForegroundColor White
Write-Host "   4. Ejecutar frontend: cd frontend && npm start" -ForegroundColor White
Write-Host ""

