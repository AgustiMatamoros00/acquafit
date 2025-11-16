# Script para iniciar el backend
# Uso: .\scripts\start-backend.ps1

Write-Host "🚀 Iniciando Backend de AcquaFit..." -ForegroundColor Cyan
Write-Host ""

$backendPath = Join-Path $PSScriptRoot "..\backend"
Set-Location $backendPath

# Verificar que node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Verificar que existe .env
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Archivo .env no encontrado" -ForegroundColor Yellow
    Write-Host "   Copiando desde .env.example..." -ForegroundColor Gray
    Copy-Item ".env.example" ".env"
    Write-Host "   ✅ Archivo .env creado" -ForegroundColor Green
    Write-Host ""
}

Write-Host "🌐 Backend iniciará en: http://localhost:3000" -ForegroundColor Green
Write-Host "📊 Logs del servidor:" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Gray
Write-Host ""

npm start

