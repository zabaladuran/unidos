<?php
/**
 * Setup Script - UNIDOS
 * Crea automáticamente las tablas en la base de datos
 * Ejecuta una sola vez al iniciar
 */

// Cargar configuración
require __DIR__ . '/.env.php';
require __DIR__ . '/config/config.php';
require __DIR__ . '/config/Database.php';

echo "╔════════════════════════════════════════════╗\n";
echo "║   UNIDOS - Setup de Base de Datos          ║\n";
echo "╚════════════════════════════════════════════╝\n\n";

$db = new Database();
$conn = $db->connect();

if (!$conn) {
    echo "❌ Error: No se pudo conectar a la base de datos\n";
    exit(1);
}

echo "✓ Conectado a PostgreSQL\n";
echo "  Host: " . getenv('DB_HOST') . "\n";
echo "  Base de datos: " . getenv('DB_NAME') . "\n\n";

// SQL para crear tablas
$sql = file_get_contents(__DIR__ . '/database/schema.sql');

try {
    echo "⏳ Creando tablas...\n\n";
    
    // Ejecutar cada comando SQL
    $statements = explode(';', $sql);
    $created = 0;
    
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (empty($statement)) {
            continue;
        }
        
        $conn->exec($statement);
        $created++;
        echo "  ✓ " . substr($statement, 0, 50) . "...\n";
    }
    
    echo "\n✅ ¡Base de datos configurada exitosamente!\n\n";
    echo "Tablas creadas:\n";
    echo "  ✓ usuarios\n";
    echo "  ✓ paquetes\n";
    echo "  ✓ pagos\n\n";
    
    echo "Ahora puedes:\n";
    echo "  1. Ejecutar: php -S localhost:5000\n";
    echo "  2. Abrir: frontend/index.html\n";
    echo "  3. Registrarte y usar la aplicación\n\n";
    
    // Eliminar este archivo después de ejecutarse
    echo "🧹 Limpiando...\n";
    if (file_exists(__FILE__)) {
        // En desarrollo, mejor no eliminar para poder re-ejecutar
        echo "   Puedes ejecutar este script nuevamente si es necesario\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Error creando tablas:\n";
    echo "   " . $e->getMessage() . "\n\n";
    
    // Si el error es que ya existen, no es problema
    if (strpos($e->getMessage(), 'already exists') !== false) {
        echo "✓ Las tablas ya existen en la base de datos\n";
    } else {
        exit(1);
    }
}

echo "\n═══════════════════════════════════════════════\n";
echo "Setup completado. ¡Vamos a empezar! 🚀\n";
echo "═══════════════════════════════════════════════\n";
?>
