<?php
// backend/config/config.php

// Variables de entorno
require __DIR__ . '/../.env.php';

// Base de datos
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('DB_PORT') ?: 5432);
define('DB_NAME', getenv('DB_NAME') ?: 'paqueteria');
define('DB_USER', getenv('DB_USER') ?: 'postgres');
define('DB_PASSWORD', getenv('DB_PASSWORD') ?: 'password');

// Seguridad
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'tu_secreto_muy_seguro_aqui');
define('JWT_ALGORITHM', 'HS256');

// URL
define('APP_URL', getenv('APP_URL') ?: 'http://localhost:3000');
define('API_URL', getenv('API_URL') ?: 'http://localhost:5000');

// Configuración general
define('APP_NAME', 'UNIDOS');
define('APP_ENV', getenv('APP_ENV') ?: 'development');
?>
