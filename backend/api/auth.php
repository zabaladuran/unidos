<?php
// backend/api/auth.php

require __DIR__ . '/../config/Database.php';
require __DIR__ . '/../middleware/Auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

$db = new Database();
$conn = $db->connect();

if ($method === 'POST' && $action === 'register') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $nombre = $data['nombre'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    $rol = $data['rol'] ?? 'trabajador';
    
    // Validaciones
    if (!$nombre || !$email || !$password) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
        exit;
    }
    
    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Contraseña muy corta']);
        exit;
    }
    
    // Verificar si existe el usuario
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'El email ya está registrado']);
        exit;
    }
    
    // Hash de contraseña
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    
    // Insertar usuario
    $stmt = $conn->prepare(
        "INSERT INTO usuarios (nombre, email, password, rol, created_at) 
         VALUES (?, ?, ?, ?, NOW())"
    );
    
    try {
        $stmt->execute([$nombre, $email, $passwordHash, $rol]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Usuario registrado exitosamente'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error en el servidor']);
    }
}

elseif ($method === 'POST' && $action === 'login') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    
    if (!$email || !$password) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email y contraseña requeridos']);
        exit;
    }
    
    // Buscar usuario
    $stmt = $conn->prepare("SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$usuario || !password_verify($password, $usuario['password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Email o contraseña incorrectos']);
        exit;
    }
    
    // Generar token
    $token = Auth::createToken($usuario['id'], $usuario['email']);
    
    echo json_encode([
        'success' => true,
        'message' => 'Login exitoso',
        'token' => $token,
        'usuario' => [
            'id' => $usuario['id'],
            'nombre' => $usuario['nombre'],
            'email' => $usuario['email'],
            'rol' => $usuario['rol']
        ]
    ]);
}

else {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Endpoint no encontrado']);
}
?>
