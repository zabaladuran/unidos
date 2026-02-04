<?php
// backend/api/reportes.php

require __DIR__ . '/../config/Database.php';
require __DIR__ . '/../middleware/Auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$user = Auth::requireAuth();

$db = new Database();
$conn = $db->connect();

if ($method === 'GET') {
    $fecha_inicio = $_GET['fecha_inicio'] ?? date('Y-m-d');
    $fecha_fin = $_GET['fecha_fin'] ?? date('Y-m-d');
    
    // Total de paquetes
    $stmt = $conn->prepare(
        "SELECT COUNT(*) as total FROM paquetes 
         WHERE id_usuario = ? AND DATE(created_at) BETWEEN ? AND ?"
    );
    $stmt->execute([$user['user_id'], $fecha_inicio, $fecha_fin]);
    $total_paquetes = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Total de ingresos
    $stmt = $conn->prepare(
        "SELECT COALESCE(SUM(precio), 0) as total FROM paquetes 
         WHERE id_usuario = ? AND estado = 'pagado' 
         AND DATE(created_at) BETWEEN ? AND ?"
    );
    $stmt->execute([$user['user_id'], $fecha_inicio, $fecha_fin]);
    $total_ingresos = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Pendientes
    $stmt = $conn->prepare(
        "SELECT COUNT(*) as total FROM paquetes 
         WHERE id_usuario = ? AND estado = 'pendiente'
         AND DATE(created_at) BETWEEN ? AND ?"
    );
    $stmt->execute([$user['user_id'], $fecha_inicio, $fecha_fin]);
    $pendientes = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Entregados
    $stmt = $conn->prepare(
        "SELECT COUNT(*) as total FROM paquetes 
         WHERE id_usuario = ? AND estado IN ('entregado', 'pagado')
         AND DATE(created_at) BETWEEN ? AND ?"
    );
    $stmt->execute([$user['user_id'], $fecha_inicio, $fecha_fin]);
    $entregados = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Por cliente
    $stmt = $conn->prepare(
        "SELECT cliente, COUNT(*) as paquetes, 
                COALESCE(SUM(precio), 0) as total,
                CASE WHEN estado = 'pagado' THEN TRUE ELSE FALSE END as pagado
         FROM paquetes 
         WHERE id_usuario = ? AND DATE(created_at) BETWEEN ? AND ?
         GROUP BY cliente, estado
         ORDER BY cliente"
    );
    $stmt->execute([$user['user_id'], $fecha_inicio, $fecha_fin]);
    $por_cliente = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'fecha_inicio' => $fecha_inicio,
        'fecha_fin' => $fecha_fin,
        'total_paquetes' => (int)$total_paquetes,
        'total_ingresos' => (float)$total_ingresos,
        'pendientes' => (int)$pendientes,
        'entregados' => (int)$entregados,
        'por_cliente' => $por_cliente
    ]);
}

else {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Endpoint no encontrado']);
}
?>
