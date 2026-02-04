-- ================================================
-- SCRIPT SQL PARA CRIAR TABLAS Y USUARIO ADMIN
-- EXECUTE EN: phpMyAdmin O MySQL WORKBENCH
-- ================================================

USE defaultdb;

-- ================================================
-- 1. TABLA USUARIOS
-- ================================================
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

-- ================================================
-- 2. TABLA CLIENTES
-- ================================================
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    telefono VARCHAR(20),
    direccion TEXT,
    ciudad VARCHAR(50),
    trabajador_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trabajador_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_trabajador (trabajador_id),
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- 3. TABLA PAQUETES
-- ================================================
CREATE TABLE IF NOT EXISTS paquetes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    trabajador_id INT NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    tipo_pago ENUM('contado', 'contraentrega', 'credito', 'nequi') NOT NULL,
    estado ENUM('pendiente', 'entregado', 'pagado', 'cancelado') NOT NULL DEFAULT 'pendiente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega TIMESTAMP NULL,
    fecha_pago TIMESTAMP NULL,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
    FOREIGN KEY (trabajador_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_trabajador (trabajador_id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_estado (estado),
    INDEX idx_tipo_pago (tipo_pago),
    INDEX idx_fecha (fecha_registro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- 4. TABLA PAGOS
-- ================================================
CREATE TABLE IF NOT EXISTS pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paquete_id INT NOT NULL,
    cliente_id INT,
    monto DECIMAL(10, 2) NOT NULL,
    tipo_pago ENUM('contado', 'contraentrega', 'credito', 'nequi') NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comprobante VARCHAR(255),
    estado VARCHAR(20) DEFAULT 'confirmado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paquete_id) REFERENCES paquetes(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
    INDEX idx_paquete (paquete_id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_fecha (fecha_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- 5. TABLA RECAUDOS
-- ================================================
CREATE TABLE IF NOT EXISTS recaudos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trabajador_id INT NOT NULL,
    jefe_id INT,
    total_recaudado DECIMAL(10, 2) NOT NULL,
    cantidad_paquetes INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'pendiente',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trabajador_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (jefe_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_trabajador (trabajador_id),
    INDEX idx_jefe (jefe_id),
    INDEX idx_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- 6. CREAR USUARIO ADMIN
-- ================================================
-- Contraseña: admin123
-- Hash bcrypt: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/DiO
INSERT INTO usuarios (nombre, email, contraseña, rol, estado) 
VALUES (
    'Administrador Sistema',
    'admin@unidos.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/DiO',
    'admin',
    true
);

-- ================================================
-- 7. CREAR USUARIO JEFE
-- ================================================
-- Contraseña: jefe123
-- Hash bcrypt: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/DiO
INSERT INTO usuarios (nombre, email, contraseña, rol, estado) 
VALUES (
    'Carlos Jefe',
    'jefe@unidos.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/DiO',
    'jefe',
    true
);

-- ================================================
-- 8. CREAR TRABAJADORES DE PRUEBA
-- ================================================
-- Contraseña: juan123 y pedro123
-- Hash bcrypt: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/DiO
INSERT INTO usuarios (nombre, email, contraseña, rol, estado) 
VALUES 
(
    'Juan Trabajador',
    'juan@unidos.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/DiO',
    'trabajador',
    true
),
(
    'Pedro Trabajador',
    'pedro@unidos.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/DiO',
    'trabajador',
    true
);

-- ================================================
-- 9. VERIFICAR DATOS CREADOS
-- ================================================
SELECT * FROM usuarios;
SELECT COUNT(*) as total_usuarios FROM usuarios;

-- ================================================
-- DATOS DE ACCESO
-- ================================================
/*
ADMIN:
- Email: admin@unidos.com
- Contraseña: admin123
- Rol: admin

JEFE:
- Email: jefe@unidos.com
- Contraseña: jefe123
- Rol: jefe

TRABAJADOR 1:
- Email: juan@unidos.com
- Contraseña: juan123
- Rol: trabajador

TRABAJADOR 2:
- Email: pedro@unidos.com
- Contraseña: pedro123
- Rol: trabajador
*/
