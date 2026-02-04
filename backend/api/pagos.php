<?php
// backend/api/pagos.php

require __DIR__ . '/../config/Database.php';
require __DIR__ . '/../middleware/Auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$user = Auth::requireAuth();

$db = new Database();
$conn = $db->connect();

if ($method === 'GET') {
    // Obtener pagos del usuario
    $stmt = $conn->prepare(
        "SELECT p.id, p.id_paquete, p.monto, p.metodo_pago, p.estado, 
                pk.cliente, pk.created_at
         FROM pagos p
         JOIN paquetes pk ON p.id_paquete = pk.id
         WHERE pk.id_usuario = ?
         ORDER BY p.created_at DESC"
    );
    $stmt->execute([$user['user_id']]);
    $pagos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($pagos);
}

elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $id_paquete = $data['id_paquete'] ?? 0;
    $monto = $data['monto'] ?? 0;
    $metodo_pago = $data['metodo_pago'] ?? '';
    
    if (!$id_paquete || !$monto) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
        exit;
    }
    
    // Verificar paquete pertenece al usuario
    $stmt = $conn->prepare("SELECT id_usuario FROM paquetes WHERE id = ?");
    $stmt->execute([$id_paquete]);
    $paquete = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$paquete || $paquete['id_usuario'] != $user['user_id']) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'No autorizado']);
        exit;
    }
    
    // Insertar pago
    $stmt = $conn->prepare(
        "INSERT INTO pagos (id_paquete, monto, metodo_pago, estado, created_at)
         VALUES (?, ?, ?, 'pendiente', NOW())"
    );
    
    try {
        $stmt->execute([$id_paquete, $monto, $metodo_pago]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Pago registrado'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error registrando pago']);
    }
}

elseif ($method === 'PUT') {
    // Actualizar pago
    $id = $_GET['id'] ?? 0;
    $data = json_decode(file_get_contents("php://input"), true);
    
    $estado = $data['estado'] ?? '';
    
    if (!$id || !$estado) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
        exit;
    }
    
    // Actualizar
    $stmt = $conn->prepare("UPDATE pagos SET estado = ?, updated_at = NOW() WHERE id = ?");
    
    try {
        $stmt->execute([$estado, $id]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Pago actualizado'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error actualizando']);
    }
}

else {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Endpoint no encontrado']);
}
?>
