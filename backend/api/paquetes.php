<?php
// backend/api/paquetes.php

require __DIR__ . '/../config/Database.php';
require __DIR__ . '/../middleware/Auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$user = Auth::requireAuth();

$db = new Database();
$conn = $db->connect();

if ($method === 'GET') {
    // Obtener paquetes del usuario
    $stmt = $conn->prepare(
        "SELECT id, id_usuario, cliente, telefono, descripcion, precio, 
                metodo_pago, direccion, estado, created_at, updated_at
         FROM paquetes 
         WHERE id_usuario = ? 
         ORDER BY created_at DESC"
    );
    $stmt->execute([$user['user_id']]);
    $paquetes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($paquetes);
}

elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $cliente = $data['cliente'] ?? '';
    $telefono = $data['telefono'] ?? '';
    $descripcion = $data['descripcion'] ?? '';
    $precio = $data['precio'] ?? 0;
    $metodoPago = $data['metodoPago'] ?? '';
    $direccion = $data['direccion'] ?? '';
    
    // Validaciones
    if (!$cliente || !$descripcion || !$precio || !$metodoPago) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
        exit;
    }
    
    // Insertar paquete
    $stmt = $conn->prepare(
        "INSERT INTO paquetes 
         (id_usuario, cliente, telefono, descripcion, precio, metodo_pago, direccion, estado, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente', NOW())"
    );
    
    try {
        $stmt->execute([
            $user['user_id'],
            $cliente,
            $telefono,
            $descripcion,
            $precio,
            $metodoPago,
            $direccion
        ]);
        
        $id = $conn->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'message' => 'Paquete registrado',
            'id' => $id
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error registrando paquete']);
    }
}

elseif ($method === 'PUT') {
    // Actualizar paquete
    $id = $_GET['id'] ?? 0;
    $data = json_decode(file_get_contents("php://input"), true);
    
    $estado = $data['estado'] ?? '';
    
    if (!$id || !$estado) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
        exit;
    }
    
    // Verificar que pertenece al usuario
    $stmt = $conn->prepare("SELECT id_usuario FROM paquetes WHERE id = ?");
    $stmt->execute([$id]);
    $paquete = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$paquete || $paquete['id_usuario'] != $user['user_id']) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'No autorizado']);
        exit;
    }
    
    // Actualizar
    $stmt = $conn->prepare("UPDATE paquetes SET estado = ?, updated_at = NOW() WHERE id = ?");
    
    try {
        $stmt->execute([$estado, $id]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Paquete actualizado'
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
