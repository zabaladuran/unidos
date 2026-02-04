import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
    console.error('Error en pool de conexiones:', err);
});

// Crear tablas si no existen
export async function initializeDatabase() {
    try {
        const client = await pool.connect();
        
        // Tabla usuarios
        await client.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                contraseña VARCHAR(255) NOT NULL,
                rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'jefe', 'trabajador')),
                estado BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Tabla clientes
        await client.query(`
            CREATE TABLE IF NOT EXISTS clientes (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(100),
                telefono VARCHAR(20),
                direccion TEXT,
                ciudad VARCHAR(50),
                trabajador_id INT REFERENCES usuarios(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Tabla paquetes
        await client.query(`
            CREATE TABLE IF NOT EXISTS paquetes (
                id SERIAL PRIMARY KEY,
                cliente_id INT REFERENCES clientes(id),
                trabajador_id INT REFERENCES usuarios(id),
                descripcion TEXT NOT NULL,
                precio DECIMAL(10, 2) NOT NULL,
                tipo_pago VARCHAR(20) NOT NULL CHECK (tipo_pago IN ('contado', 'contraentrega', 'credito', 'nequi')),
                estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'entregado', 'pagado', 'cancelado')),
                fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                fecha_entrega TIMESTAMP,
                fecha_pago TIMESTAMP,
                observaciones TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Tabla pagos
        await client.query(`
            CREATE TABLE IF NOT EXISTS pagos (
                id SERIAL PRIMARY KEY,
                paquete_id INT REFERENCES paquetes(id),
                cliente_id INT REFERENCES clientes(id),
                monto DECIMAL(10, 2) NOT NULL,
                tipo_pago VARCHAR(20) NOT NULL,
                fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                comprobante VARCHAR(255),
                estado VARCHAR(20) DEFAULT 'confirmado',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Tabla recaudos
        await client.query(`
            CREATE TABLE IF NOT EXISTS recaudos (
                id SERIAL PRIMARY KEY,
                trabajador_id INT REFERENCES usuarios(id),
                jefe_id INT REFERENCES usuarios(id),
                total_recaudado DECIMAL(10, 2) NOT NULL,
                cantidad_paquetes INT NOT NULL,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                estado VARCHAR(20) DEFAULT 'pendiente',
                observaciones TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Índices
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_paquetes_trabajador ON paquetes(trabajador_id);
            CREATE INDEX IF NOT EXISTS idx_paquetes_cliente ON paquetes(cliente_id);
            CREATE INDEX IF NOT EXISTS idx_paquetes_estado ON paquetes(estado);
            CREATE INDEX IF NOT EXISTS idx_pagos_cliente ON pagos(cliente_id);
            CREATE INDEX IF NOT EXISTS idx_recaudos_trabajador ON recaudos(trabajador_id);
        `);

        console.log('✅ Base de datos inicializada correctamente');
        client.release();
    } catch (err) {
        console.error('❌ Error inicializando base de datos:', err);
        process.exit(1);
    }
}

export { pool };
