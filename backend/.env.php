<?php
// backend/.env.php
// Cargar variables de entorno desde archivo .env

$envFile = __DIR__ . '/.env';

if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    foreach ($lines as $line) {
        if (strpos($line, '=') === false || strpos($line, '#') === 0) {
            continue;
        }
        
        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        
        // Remover comillas
        if (strpos($value, '"') === 0) {
            $value = substr($value, 1, -1);
        }
        
        putenv("$key=$value");
    }
}
?>
