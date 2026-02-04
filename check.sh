#!/bin/bash
# Test script para verificar la estructura del proyecto

echo "🔍 Verificando estructura de UNIDOS..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

success=0
fail=0

# Función para verificar archivo
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((success++))
    else
        echo -e "${RED}✗${NC} $1 (NO ENCONTRADO)"
        ((fail++))
    fi
}

# Función para verificar directorio
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        ((success++))
    else
        echo -e "${RED}✗${NC} $1/ (NO ENCONTRADO)"
        ((fail++))
    fi
}

echo "📁 Carpetas:"
check_dir "frontend"
check_dir "frontend/css"
check_dir "frontend/js"
check_dir "backend"
check_dir "backend/api"
check_dir "backend/config"
check_dir "backend/middleware"
check_dir "backend/database"

echo ""
echo "📄 Frontend HTML:"
check_file "frontend/index.html"
check_file "frontend/login.html"
check_file "frontend/registro.html"
check_file "frontend/dashboard.html"

echo ""
echo "📄 Frontend CSS:"
check_file "frontend/css/style.css"

echo ""
echo "📄 Frontend JavaScript:"
check_file "frontend/js/login.js"
check_file "frontend/js/registro.js"
check_file "frontend/js/dashboard.js"

echo ""
echo "📄 Backend PHP:"
check_file "backend/index.php"
check_file "backend/api/auth.php"
check_file "backend/api/paquetes.php"
check_file "backend/api/pagos.php"
check_file "backend/api/reportes.php"

echo ""
echo "⚙️ Configuración Backend:"
check_file "backend/config/config.php"
check_file "backend/config/Database.php"
check_file "backend/middleware/Auth.php"
check_file "backend/middleware/cors.php"

echo ""
echo "🗄️ Base de Datos:"
check_file "backend/database/schema.sql"
check_file "backend/.env"

echo ""
echo "📚 Documentación:"
check_file "README.md"
check_file "INSTALACION.md"
check_file "ESTRUCTURA.md"
check_file "GUIA_RAPIDA.md"
check_file "API.md"
check_file "DEPLOYMENT.md"
check_file "RESUMEN.md"

echo ""
echo "⚙️ Configuración:"
check_file ".gitignore"
check_file ".env.example"
check_file "package.json"
check_file "frontend/vercel.json"
check_file "backend/vercel.json"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ Exitoso: $success${NC}"
echo -e "${RED}✗ Fallido: $fail${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $fail -eq 0 ]; then
    echo -e "${GREEN}✅ ¡Proyecto completamente instalado!${NC}"
    echo ""
    echo "📝 Próximos pasos:"
    echo "1. Lee GUIA_RAPIDA.md para iniciar rápido"
    echo "2. Configura variables .env con tus credenciales Aiven"
    echo "3. Ejecuta: cd backend && php -S localhost:5000"
    echo "4. Abre: frontend/index.html en tu navegador"
    exit 0
else
    echo -e "${RED}❌ Hay archivos faltantes. Verifica la instalación.${NC}"
    exit 1
fi
