import { pool, initializeDatabase } from './config/database.js';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
    let connection;
    try {
        console.log('🌱 Inicializando base de datos MySQL...');
        
        // Inicializar tablas
        await initializeDatabase();

        connection = await pool.getConnection();

        // Crear usuarios de prueba
        console.log('👥 Creando usuarios de prueba...');

        const usuarios = [
            {
                nombre: 'Admin Sistema',
                email: 'admin@unidos.com',
                contraseña: 'admin123',
                rol: 'admin'
            },
            {
                nombre: 'Carlos Jefe',
                email: 'jefe@unidos.com',
                contraseña: 'jefe123',
                rol: 'jefe'
            },
            {
                nombre: 'Juan Trabajador',
                email: 'juan@unidos.com',
                contraseña: 'juan123',
                rol: 'trabajador'
            },
            {
                nombre: 'Pedro Trabajador',
                email: 'pedro@unidos.com',
                contraseña: 'pedro123',
                rol: 'trabajador'
            }
        ];

        for (const usuario of usuarios) {
            const salt = await bcrypt.genSalt(10);
            const contraseñaEncriptada = await bcrypt.hash(usuario.contraseña, salt);

            await connection.query(
                'INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES (?, ?, ?, ?)',
                [usuario.nombre, usuario.email, contraseñaEncriptada, usuario.rol]
            );

            console.log(`✅ Usuario creado: ${usuario.email}`);
        }

        // Crear clientes de prueba
        console.log('🏪 Creando clientes de prueba...');

        const clientes = [
            {
                nombre: 'Cliente A SAS',
                email: 'clientea@email.com',
                telefono: '3001234567',
                ciudad: 'Bogotá',
                trabajador_id: 3
            },
            {
                nombre: 'Cliente B Ltda',
                email: 'clienteb@email.com',
                telefono: '3012345678',
                ciudad: 'Medellín',
                trabajador_id: 3
            },
            {
                nombre: 'Cliente C Importaciones',
                email: 'clientec@email.com',
                telefono: '3023456789',
                ciudad: 'Cali',
                trabajador_id: 4
            }
        ];

        for (const cliente of clientes) {
            await connection.query(
                'INSERT INTO clientes (nombre, email, telefono, ciudad, trabajador_id) VALUES (?, ?, ?, ?, ?)',
                [cliente.nombre, cliente.email, cliente.telefono, cliente.ciudad, cliente.trabajador_id]
            );

            console.log(`✅ Cliente creado: ${cliente.nombre}`);
        }

        // Crear paquetes de prueba
        console.log('📦 Creando paquetes de prueba...');

        const paquetes = [
            {
                cliente_id: 1,
                trabajador_id: 3,
                descripcion: 'Caja con electrónica',
                precio: 150000,
                tipo_pago: 'contado',
                estado: 'pagado'
            },
            {
                cliente_id: 2,
                trabajador_id: 3,
                descripcion: 'Paquete ropa',
                precio: 85000,
                tipo_pago: 'contraentrega',
                estado: 'entregado'
            },
            {
                cliente_id: 3,
                trabajador_id: 4,
                descripcion: 'Repuestos industriales',
                precio: 250000,
                tipo_pago: 'nequi',
                estado: 'pagado'
            },
            {
                cliente_id: 1,
                trabajador_id: 3,
                descripcion: 'Documentos importantes',
                precio: 25000,
                tipo_pago: 'credito',
                estado: 'entregado'
            }
        ];

        for (const paquete of paquetes) {
            await connection.query(
                `INSERT INTO paquetes 
                (cliente_id, trabajador_id, descripcion, precio, tipo_pago, estado, fecha_entrega, fecha_pago) 
                VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                [
                    paquete.cliente_id,
                    paquete.trabajador_id,
                    paquete.descripcion,
                    paquete.precio,
                    paquete.tipo_pago,
                    paquete.estado
                ]
            );

            console.log(`✅ Paquete creado: ${paquete.descripcion}`);
        }

        connection.release();

        console.log('\n✅ Base de datos MySQL inicializada correctamente con datos de prueba');
        console.log('\n📋 Usuarios de prueba:');
        console.log('├─ Admin: admin@unidos.com / admin123');
        console.log('├─ Jefe: jefe@unidos.com / jefe123');
        console.log('├─ Trabajador 1: juan@unidos.com / juan123');
        console.log('└─ Trabajador 2: pedro@unidos.com / pedro123');

        process.exit(0);
    } catch (err) {
        if (connection) connection.release();
        console.error('❌ Error inicializando BD:', err);
        process.exit(1);
    }
}

seedDatabase();
