# UNIDOS - Quick Start PowerShell Script
# Script para iniciar el desarrollo rápidamente en Windows

$ScriptPath = Get-Location
$BackendPath = "$ScriptPath\backend"
$FrontendPath = "$ScriptPath\frontend"

Write-Host "╔════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   UNIDOS - Sistema de Paquetería   ║" -ForegroundColor Cyan
Write-Host "║      Quick Start Script (PS)        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar si PHP está instalado
Write-Host "🔍 Verificando requisitos..." -ForegroundColor Yellow

try {
    $phpVersion = php --version 2>$null
    if ($phpVersion) {
        Write-Host "✓ PHP está instalado" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ PHP no está instalado o no está en PATH" -ForegroundColor Red
    Write-Host "  Instala PHP desde: https://www.php.net/downloads" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Selecciona una opción:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Iniciar servidor backend (PHP)" -ForegroundColor White
Write-Host "2. Abrir frontend en navegador" -ForegroundColor White
Write-Host "3. Ver documentación (README)" -ForegroundColor White
Write-Host "4. Verificar estructura del proyecto" -ForegroundColor White
Write-Host "5. Salir" -ForegroundColor White
Write-Host ""

$option = Read-Host "Elige una opción (1-5)"

switch ($option) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Iniciando servidor backend..." -ForegroundColor Green
        Write-Host "📍 URL: http://localhost:5000" -ForegroundColor Cyan
        Write-Host "⚠️  Presiona Ctrl+C para detener" -ForegroundColor Yellow
        Write-Host ""
        
        Set-Location $BackendPath
        php -S localhost:5000
        Set-Location $ScriptPath
    }
    
    "2" {
        Write-Host ""
        Write-Host "🌐 Abriendo frontend en navegador..." -ForegroundColor Green
        
        $frontendFile = "$FrontendPath\index.html"
        
        if (Test-Path $frontendFile) {
            Start-Process "$frontendFile"
            Write-Host "✓ Abierto: $frontendFile" -ForegroundColor Green
        } else {
            Write-Host "✗ No se encontró: $frontendFile" -ForegroundColor Red
        }
    }
    
    "3" {
        Write-Host ""
        Write-Host "📖 Mostrando documentación..." -ForegroundColor Green
        
        if (Test-Path ".\README.md") {
            Get-Content ".\README.md" | Out-Host
        } else {
            Write-Host "✗ No se encontró README.md" -ForegroundColor Red
        }
    }
    
    "4" {
        Write-Host ""
        Write-Host "🔍 Verificando estructura del proyecto..." -ForegroundColor Green
        Write-Host ""
        
        $files = @(
            "frontend\index.html",
            "frontend\login.html",
            "frontend\dashboard.html",
            "frontend\css\style.css",
            "frontend\js\dashboard.js",
            "backend\index.php",
            "backend\api\auth.php",
            "backend\api\paquetes.php",
            "backend\database\schema.sql",
            "README.md",
            "GUIA_RAPIDA.md",
            "API.md"
        )
        
        $found = 0
        $missing = 0
        
        foreach ($file in $files) {
            if (Test-Path $file) {
                Write-Host "✓ $file" -ForegroundColor Green
                $found++
            } else {
                Write-Host "✗ $file (FALTANTE)" -ForegroundColor Red
                $missing++
            }
        }
        
        Write-Host ""
        Write-Host "Resumen: $found encontrados, $missing faltantes" -ForegroundColor Cyan
    }
    
    "5" {
        Write-Host ""
        Write-Host "👋 ¡Hasta luego!" -ForegroundColor Cyan
        exit 0
    }
    
    default {
        Write-Host ""
        Write-Host "⚠️  Opción no válida" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📚 Para más información, lee GUIA_RAPIDA.md" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
