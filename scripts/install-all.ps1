# Script para instalar todas las dependencias
# Uso: .\scripts\install-all.ps1

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  AcquaFit - Instalación Completa" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = Join-Path $PSScriptRoot ".."

# Verificar Node.js
Write-Host "🔍 Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✅ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js no encontrado" -ForegroundColor Red
    Write-Host "   Descárgalo de: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Instalar Backend
Write-Host "📦 Instalando dependencias del Backend..." -ForegroundColor Cyan
$backendPath = Join-Path $rootPath "backend"
Set-Location $backendPath

npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Backend instalado correctamente" -ForegroundColor Green
} else {
    Write-Host "   ❌ Error al instalar backend" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Instalar Frontend
Write-Host "📦 Instalando dependencias del Frontend..." -ForegroundColor Cyan
$frontendPath = Join-Path $rootPath "frontend"
Set-Location $frontendPath

npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Frontend instalado correctamente" -ForegroundColor Green
} else {
    Write-Host "   ❌ Error al instalar frontend" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Crear .env si no existe
$envPath = Join-Path $backendPath ".env"
$envExamplePath = Join-Path $backendPath ".env.example"

if (-not (Test-Path $envPath)) {
    Write-Host "⚙️  Configurando archivo .env..." -ForegroundColor Yellow
    Copy-Item $envExamplePath $envPath
    Write-Host "   ✅ Archivo .env creado" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Archivo .env ya existe" -ForegroundColor Gray
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✅ Instalación completada" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Configurar la base de datos:" -ForegroundColor White
Write-Host "      .\scripts\setup-database.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Iniciar el backend (en una terminal):" -ForegroundColor White
Write-Host "      .\scripts\start-backend.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Iniciar el frontend (en otra terminal):" -ForegroundColor White
Write-Host "      .\scripts\start-frontend.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "   4. Crear tu primer usuario:" -ForegroundColor White
Write-Host "      .\scripts\create-first-user.ps1" -ForegroundColor Gray
Write-Host ""

Set-Location $rootPath

