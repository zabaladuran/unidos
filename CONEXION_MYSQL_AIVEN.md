// Código de Conexión MySQL - UNIDOS

// ============================================
// DATOS DE CONEXIÓN AIVEN MYSQL
// ============================================

const conexionMySQL = {
    host: 'mysql-9adc554-calculadora-imc.g.aivencloud.com',
    port: 12731,
    user: 'avnadmin',
    password: 'AVfS_3ZYFyJhrvSGTHdZ-1U',
    database: 'defaultdb',
    ssl: 'REQUIRED'
};

// ============================================
// PARA .env DEL PROYECTO
// ============================================

/*
DB_HOST=mysql-9adc554-calculadora-imc.g.aivencloud.com
DB_PORT=12731
DB_USER=avnadmin
DB_PASSWORD=AVfS_3ZYFyJhrvSGTHdZ-1U
DB_NAME=defaultdb

O USAR SERVICE URI:
mysql://avnadmin:AVfS_3ZYFyJhrvSGTHdZ-1U@mysql-9adc554-calculadora-imc.g.aivencloud.com:12731/defaultdb?ssl-mode=REQUIRED
*/

// ============================================
// SCRIPT PARA CREAR USUARIO ADMIN
// ============================================

/*
Ejecutar en MySQL (phpMyAdmin o MySQL Workbench):
*/

-- Cambiar a la base de datos
USE defaultdb;

-- Ver tablas existentes
SHOW TABLES;

-- Ver estructura de usuarios si existe
-- DESCRIBE usuarios;

-- Si la tabla usuarios no existe, crearla:
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'jefe', 'trabajador') NOT NULL DEFAULT 'trabajador',
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuario admin (contraseña encriptada con bcrypt)
-- NOTA: La contraseña debe estar encriptada con bcrypt
-- Contraseña original: admin123
-- Hash bcrypt: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/DiO
INSERT INTO usuarios (nombre, email, contraseña, rol, estado) 
VALUES (
    'Administrador Sistema',
    'admin@unidos.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/DiO',
    'admin',
    true
);

-- Verificar que se creó
SELECT * FROM usuarios;

-- ============================================
// USUARIOS DE PRUEBA DISPONIBLES
// ============================================

/*
Email: admin@unidos.com
Contraseña: admin123
Rol: admin

Email: jefe@unidos.com
Contraseña: jefe123
Rol: jefe

Email: juan@unidos.com
Contraseña: juan123
Rol: trabajador

Email: pedro@unidos.com
Contraseña: pedro123
Rol: trabajador
*/
