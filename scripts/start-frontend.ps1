# Script para iniciar el frontend
# Uso: .\scripts\start-frontend.ps1

Write-Host "🎨 Iniciando Frontend de AcquaFit..." -ForegroundColor Cyan
Write-Host ""

$frontendPath = Join-Path $PSScriptRoot "..\frontend"
Set-Location $frontendPath

# Verificar que node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

Write-Host "🌐 Frontend iniciará en: http://localhost:4200" -ForegroundColor Green
Write-Host "📊 Logs de Angular:" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Gray
Write-Host ""

npm start

