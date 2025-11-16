#!/bin/bash
# Script para inicializar la base de datos en el contenedor Docker

echo "🚀 Inicializando base de datos SQL Server en Docker..."

# Nombre del contenedor (ajustar si es diferente)
CONTAINER_NAME="acquafit-windows-database-1"

# Verificar que el contenedor existe y está corriendo
if ! docker ps | grep -q $CONTAINER_NAME; then
    echo "❌ Error: El contenedor $CONTAINER_NAME no está corriendo"
    echo "   Ejecuta: docker-compose -f docker-compose-dev.yml up -d database"
    exit 1
fi

echo "⏳ Esperando a que SQL Server esté listo..."
sleep 10

# Ejecutar scripts SQL en orden
echo "📝 Ejecutando 01_create_database.sql..."
docker exec -i $CONTAINER_NAME /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "AcquaFit2024!" < database/01_create_database.sql

echo "📝 Ejecutando 02_create_tables.sql..."
docker exec -i $CONTAINER_NAME /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "AcquaFit2024!" < database/02_create_tables.sql

echo "📝 Ejecutando 03_user_favorites.sql..."
docker exec -i $CONTAINER_NAME /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "AcquaFit2024!" < database/03_user_favorites.sql

echo "✅ Base de datos inicializada correctamente!"
echo ""
echo "🔍 Verificando tablas creadas..."
docker exec -i $CONTAINER_NAME /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "AcquaFit2024!" -Q "USE acquafit; SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' ORDER BY TABLE_NAME;"

echo ""
echo "✨ ¡Listo! Puedes iniciar el backend y frontend ahora."

