<?php
// backend/middleware/Auth.php

class Auth {
    public static function getToken() {
        $headers = getallheaders();
        
        if (isset($headers['Authorization'])) {
            $matches = [];
            if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
                return $matches[1];
            }
        }
        
        return null;
    }

    public static function verifyToken($token) {
        require __DIR__ . '/../config/config.php';
        
        try {
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                return false;
            }

            // Verificar firma (simplificado - usar librería JWT en producción)
            // Para desarrollo, guardamos el payload en base64
            $payload = json_decode(base64_decode($parts[1]), true);
            
            if (!$payload || !isset($payload['user_id'])) {
                return false;
            }

            // Verificar expiración
            if (isset($payload['exp']) && $payload['exp'] < time()) {
                return false;
            }

            return $payload;
        } catch (Exception $e) {
            return false;
        }
    }

    public static function createToken($user_id, $email) {
        require __DIR__ . '/../config/config.php';
        
        // Crear payload
        $payload = [
            'user_id' => $user_id,
            'email' => $email,
            'iat' => time(),
            'exp' => time() + (7 * 24 * 60 * 60) // 7 días
        ];

        // Simplificado - en producción usar una librería JWT
        // Este es solo para desarrollo
        $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $payload_encoded = base64_encode(json_encode($payload));
        
        // Crear firma
        $signature = hash_hmac(
            'sha256',
            "$header.$payload_encoded",
            JWT_SECRET,
            true
        );
        $signature_encoded = base64_encode($signature);

        return "$header.$payload_encoded.$signature_encoded";
    }

    public static function requireAuth() {
        $token = self::getToken();
        
        if (!$token) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Token requerido']);
            exit;
        }

        $payload = self::verifyToken($token);
        
        if (!$payload) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Token inválido']);
            exit;
        }

        return $payload;
    }
}
?>
