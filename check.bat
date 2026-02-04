@echo off
REM Test script para verificar la estructura del proyecto (Windows)

echo Verificando estructura de UNIDOS...
echo.

setlocal enabledelayedexpansion

set success=0
set fail=0

REM Colores (Windows 10+)
set GREEN=[92m
set RED=[91m
set YELLOW=[93m
set NC=[0m

REM Funcion para verificar archivo
:check_file
if exist %1 (
    echo [92mO[0m %1
    set /a success+=1
) else (
    echo [91mX[0m %1 (NO ENCONTRADO)
    set /a fail+=1
)
exit /b

:check_dir
if exist %1\ (
    echo [92mO[0m %1\
    set /a success+=1
) else (
    echo [91mX[0m %1\ (NO ENCONTRADO)
    set /a fail+=1
)
exit /b

REM Verificar carpetas
echo 📁 Carpetas:
if exist frontend\ echo [92mO[0m frontend\ & set /a success+=1 || echo [91mX[0m frontend\ & set /a fail+=1
if exist frontend\css\ echo [92mO[0m frontend\css\ & set /a success+=1 || echo [91mX[0m frontend\css\ & set /a fail+=1
if exist frontend\js\ echo [92mO[0m frontend\js\ & set /a success+=1 || echo [91mX[0m frontend\js\ & set /a fail+=1
if exist backend\ echo [92mO[0m backend\ & set /a success+=1 || echo [91mX[0m backend\ & set /a fail+=1
if exist backend\api\ echo [92mO[0m backend\api\ & set /a success+=1 || echo [91mX[0m backend\api\ & set /a fail+=1
if exist backend\config\ echo [92mO[0m backend\config\ & set /a success+=1 || echo [91mX[0m backend\config\ & set /a fail+=1
if exist backend\middleware\ echo [92mO[0m backend\middleware\ & set /a success+=1 || echo [91mX[0m backend\middleware\ & set /a fail+=1
if exist backend\database\ echo [92mO[0m backend\database\ & set /a success+=1 || echo [91mX[0m backend\database\ & set /a fail+=1

echo.
echo 📄 Frontend HTML:
if exist frontend\index.html echo [92mO[0m frontend\index.html & set /a success+=1 || echo [91mX[0m frontend\index.html & set /a fail+=1
if exist frontend\login.html echo [92mO[0m frontend\login.html & set /a success+=1 || echo [91mX[0m frontend\login.html & set /a fail+=1
if exist frontend\registro.html echo [92mO[0m frontend\registro.html & set /a success+=1 || echo [91mX[0m frontend\registro.html & set /a fail+=1
if exist frontend\dashboard.html echo [92mO[0m frontend\dashboard.html & set /a success+=1 || echo [91mX[0m frontend\dashboard.html & set /a fail+=1

echo.
echo 📄 Frontend CSS:
if exist frontend\css\style.css echo [92mO[0m frontend\css\style.css & set /a success+=1 || echo [91mX[0m frontend\css\style.css & set /a fail+=1

echo.
echo 📄 Frontend JavaScript:
if exist frontend\js\login.js echo [92mO[0m frontend\js\login.js & set /a success+=1 || echo [91mX[0m frontend\js\login.js & set /a fail+=1
if exist frontend\js\registro.js echo [92mO[0m frontend\js\registro.js & set /a success+=1 || echo [91mX[0m frontend\js\registro.js & set /a fail+=1
if exist frontend\js\dashboard.js echo [92mO[0m frontend\js\dashboard.js & set /a success+=1 || echo [91mX[0m frontend\js\dashboard.js & set /a fail+=1

echo.
echo 📄 Backend PHP:
if exist backend\index.php echo [92mO[0m backend\index.php & set /a success+=1 || echo [91mX[0m backend\index.php & set /a fail+=1
if exist backend\api\auth.php echo [92mO[0m backend\api\auth.php & set /a success+=1 || echo [91mX[0m backend\api\auth.php & set /a fail+=1
if exist backend\api\paquetes.php echo [92mO[0m backend\api\paquetes.php & set /a success+=1 || echo [91mX[0m backend\api\paquetes.php & set /a fail+=1
if exist backend\api\pagos.php echo [92mO[0m backend\api\pagos.php & set /a success+=1 || echo [91mX[0m backend\api\pagos.php & set /a fail+=1
if exist backend\api\reportes.php echo [92mO[0m backend\api\reportes.php & set /a success+=1 || echo [91mX[0m backend\api\reportes.php & set /a fail+=1

echo.
echo ⚙️ Configuracion Backend:
if exist backend\config\config.php echo [92mO[0m backend\config\config.php & set /a success+=1 || echo [91mX[0m backend\config\config.php & set /a fail+=1
if exist backend\config\Database.php echo [92mO[0m backend\config\Database.php & set /a success+=1 || echo [91mX[0m backend\config\Database.php & set /a fail+=1
if exist backend\middleware\Auth.php echo [92mO[0m backend\middleware\Auth.php & set /a success+=1 || echo [91mX[0m backend\middleware\Auth.php & set /a fail+=1
if exist backend\middleware\cors.php echo [92mO[0m backend\middleware\cors.php & set /a success+=1 || echo [91mX[0m backend\middleware\cors.php & set /a fail+=1

echo.
echo 🗄️ Base de Datos:
if exist backend\database\schema.sql echo [92mO[0m backend\database\schema.sql & set /a success+=1 || echo [91mX[0m backend\database\schema.sql & set /a fail+=1
if exist backend\.env echo [92mO[0m backend\.env & set /a success+=1 || echo [91mX[0m backend\.env & set /a fail+=1

echo.
echo 📚 Documentacion:
if exist README.md echo [92mO[0m README.md & set /a success+=1 || echo [91mX[0m README.md & set /a fail+=1
if exist INSTALACION.md echo [92mO[0m INSTALACION.md & set /a success+=1 || echo [91mX[0m INSTALACION.md & set /a fail+=1
if exist ESTRUCTURA.md echo [92mO[0m ESTRUCTURA.md & set /a success+=1 || echo [91mX[0m ESTRUCTURA.md & set /a fail+=1
if exist GUIA_RAPIDA.md echo [92mO[0m GUIA_RAPIDA.md & set /a success+=1 || echo [91mX[0m GUIA_RAPIDA.md & set /a fail+=1
if exist API.md echo [92mO[0m API.md & set /a success+=1 || echo [91mX[0m API.md & set /a fail+=1
if exist DEPLOYMENT.md echo [92mO[0m DEPLOYMENT.md & set /a success+=1 || echo [91mX[0m DEPLOYMENT.md & set /a fail+=1
if exist RESUMEN.md echo [92mO[0m RESUMEN.md & set /a success+=1 || echo [91mX[0m RESUMEN.md & set /a fail+=1

echo.
echo ⚙️ Configuracion:
if exist .gitignore echo [92mO[0m .gitignore & set /a success+=1 || echo [91mX[0m .gitignore & set /a fail+=1
if exist .env.example echo [92mO[0m .env.example & set /a success+=1 || echo [91mX[0m .env.example & set /a fail+=1
if exist package.json echo [92mO[0m package.json & set /a success+=1 || echo [91mX[0m package.json & set /a fail+=1
if exist frontend\vercel.json echo [92mO[0m frontend\vercel.json & set /a success+=1 || echo [91mX[0m frontend\vercel.json & set /a fail+=1
if exist backend\vercel.json echo [92mO[0m backend\vercel.json & set /a success+=1 || echo [91mX[0m backend\vercel.json & set /a fail+=1

echo.
echo ================================================
echo Exitoso: %success%
echo Fallido: %fail%
echo ================================================

if %fail% equ 0 (
    echo.
    echo ✓ Proyecto completamente instalado!
    echo.
    echo Proximos pasos:
    echo 1. Lee GUIA_RAPIDA.md para iniciar rapido
    echo 2. Configura variables .env con tus credenciales Aiven
    echo 3. Ejecuta: cd backend ^&^& php -S localhost:5000
    echo 4. Abre: frontend/index.html en tu navegador
    exit /b 0
) else (
    echo.
    echo X Hay archivos faltantes. Verifica la instalacion.
    exit /b 1
)
