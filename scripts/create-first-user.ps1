# Script para crear el primer usuario en AcquaFit
# Uso: .\scripts\create-first-user.ps1

param(
    [string]$Email = "admin@acquafit.com",
    [string]$Password = "admin123",
    [string]$Name = "Admin",
    [string]$Surname = "AcquaFit"
)

Write-Host "👤 Creando usuario en AcquaFit..." -ForegroundColor Cyan
Write-Host ""

# Verificar que el backend está corriendo
try {
    $testConnection = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
} catch {
    Write-Host "❌ Error: El backend no está corriendo" -ForegroundColor Red
    Write-Host "   Inicia el backend primero:" -ForegroundColor Yellow
    Write-Host "   cd backend && npm start" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

# Crear el usuario
$body = @{
    email = $Email
    password = $Password
    name = $Name
    surname = $Surname
} | ConvertTo-Json

Write-Host "📧 Email: $Email" -ForegroundColor Gray
Write-Host "🔑 Password: $Password" -ForegroundColor Gray
Write-Host "👤 Nombre: $Name $Surname" -ForegroundColor Gray
Write-Host ""
Write-Host "Enviando petición al backend..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/auth/register" -Method POST -Body $body -ContentType "application/json"
    
    Write-Host ""
    Write-Host "✅ Usuario creado exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Ya puedes iniciar sesión con:" -ForegroundColor Cyan
    Write-Host "   Email: $Email" -ForegroundColor White
    Write-Host "   Password: $Password" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 Abre: http://localhost:4200" -ForegroundColor Green
    Write-Host ""
    
} catch {
    $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
    
    if ($errorDetails.error -eq "Email already registered") {
        Write-Host "⚠️  El usuario ya existe" -ForegroundColor Yellow
        Write-Host "   Puedes iniciar sesión con:" -ForegroundColor Gray
        Write-Host "   Email: $Email" -ForegroundColor White
        Write-Host "   Password: (el que configuraste anteriormente)" -ForegroundColor White
    } else {
        Write-Host "❌ Error al crear usuario:" -ForegroundColor Red
        Write-Host "   $($errorDetails.error)" -ForegroundColor Gray
    }
    Write-Host ""
}

