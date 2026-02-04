import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'unidos_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    enableKeepAlive: true,
    keepAliveInitialDelayMs: 0
});

pool.on('error', (err) => {
    console.error('Error en pool de conexiones:', err);
});

// Crear tablas si no existen
export async function initializeDatabase() {
    let connection;
    try {
        connection = await pool.getConnection();
        
        // Tabla usuarios
        await connection.query(`
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
        `);

        // Tabla clientes
        await connection.query(`
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
        `);

        // Tabla paquetes
        await connection.query(`
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
        `);

        // Tabla pagos
        await connection.query(`
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
        `);

        // Tabla recaudos
        await connection.query(`
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
        `);

        console.log('✅ Base de datos MySQL inicializada correctamente');
        connection.release();
    } catch (err) {
        console.error('❌ Error inicializando base de datos:', err);
        if (connection) connection.release();
        throw err;
    }
}

export { pool };
