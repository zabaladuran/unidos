<?php
// backend/index.php

// CORS
require __DIR__ . '/middleware/cors.php';

// Cargar configuración
require __DIR__ . '/.env.php';
require __DIR__ . '/config/config.php';

// Router simple
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$base_path = '/api';

// Remover base path
$path = str_replace($base_path, '', $request_uri);
$path = trim($path, '/');

// Rutas
$parts = explode('/', $path);
$route = $parts[0] ?? '';

try {
    switch ($route) {
        case 'auth':
            require __DIR__ . '/api/auth.php';
            break;
        
        case 'paquetes':
            require __DIR__ . '/api/paquetes.php';
            break;
        
        case 'pagos':
            require __DIR__ . '/api/pagos.php';
            break;
        
        case 'reportes':
            require __DIR__ . '/api/reportes.php';
            break;
        
        default:
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Ruta no encontrada']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
}
?>
