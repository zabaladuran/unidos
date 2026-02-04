import express from 'express';
import { pool } from '../config/database.js';
import { verificarRol } from '../middleware/auth.js';

const router = express.Router();

// Crear paquete (trabajador)
router.post('/', verificarRol('trabajador', 'admin'), async (req, res) => {
    let connection;
    try {
        const { cliente_id, descripcion, precio, tipo_pago, observaciones } = req.body;
        const trabajador_id = req.usuario.id;

        if (!cliente_id || !descripcion || !precio || !tipo_pago) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        // Validar tipo de pago
        const tiposPago = ['contado', 'contraentrega', 'credito', 'nequi'];
        if (!tiposPago.includes(tipo_pago)) {
            return res.status(400).json({ error: 'Tipo de pago inválido' });
        }

        connection = await pool.getConnection();

        const [resultado] = await connection.query(
            `INSERT INTO paquetes 
            (cliente_id, trabajador_id, descripcion, precio, tipo_pago, observaciones) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [cliente_id, trabajador_id, descripcion, precio, tipo_pago, observaciones || null]
        );

        connection.release();

        res.status(201).json({
            mensaje: 'Paquete registrado exitosamente',
            paquete: {
                id: resultado.insertId,
                cliente_id,
                trabajador_id,
                descripcion,
                precio,
                tipo_pago,
                estado: 'pendiente'
            }
        });
    } catch (err) {
        if (connection) connection.release();
        console.error('Error al crear paquete:', err);
        res.status(500).json({ error: 'Error al registrar paquete' });
    }
});

// Obtener paquetes del trabajador
router.get('/mis-paquetes', verificarRol('trabajador', 'admin'), async (req, res) => {
    let connection;
    try {
        const trabajador_id = req.usuario.id;
        const { estado } = req.query;

        connection = await pool.getConnection();

        let sql = `
            SELECT p.*, c.nombre as cliente_nombre, c.telefono as cliente_telefono
            FROM paquetes p
            LEFT JOIN clientes c ON p.cliente_id = c.id
            WHERE p.trabajador_id = ?
        `;
        let params = [trabajador_id];

        if (estado) {
            sql += ` AND p.estado = ?`;
            params.push(estado);
        }

        sql += ` ORDER BY p.fecha_registro DESC`;

        const [paquetes] = await connection.query(sql, params);
        connection.release();

        res.json({
            total: paquetes.length,
            paquetes: paquetes
        });
    } catch (err) {
        if (connection) connection.release();
        console.error('Error al obtener paquetes:', err);
        res.status(500).json({ error: 'Error al obtener paquetes' });
    }
});

// Obtener todos los paquetes (admin/jefe)
router.get('/', verificarRol('admin', 'jefe'), async (req, res) => {
    let connection;
    try {
        const { trabajador_id, estado, fecha_inicio, fecha_fin } = req.query;

        connection = await pool.getConnection();

        let sql = `
            SELECT p.*, 
                   c.nombre as cliente_nombre, 
                   u.nombre as trabajador_nombre
            FROM paquetes p
            LEFT JOIN clientes c ON p.cliente_id = c.id
            LEFT JOIN usuarios u ON p.trabajador_id = u.id
            WHERE 1=1
        `;
        let params = [];

        if (trabajador_id) {
            sql += ` AND p.trabajador_id = ?`;
            params.push(trabajador_id);
        }

        if (estado) {
            sql += ` AND p.estado = ?`;
            params.push(estado);
        }

        if (fecha_inicio) {
            sql += ` AND DATE(p.fecha_registro) >= ?`;
            params.push(fecha_inicio);
        }

        if (fecha_fin) {
            sql += ` AND DATE(p.fecha_registro) <= ?`;
            params.push(fecha_fin);
        }

        sql += ` ORDER BY p.fecha_registro DESC`;

        const [paquetes] = await connection.query(sql, params);
        connection.release();

        res.json({
            total: paquetes.length,
            paquetes: paquetes
        });
    } catch (err) {
        if (connection) connection.release();
        console.error('Error al obtener paquetes:', err);
        res.status(500).json({ error: 'Error al obtener paquetes' });
    }
});

// Marcar paquete como entregado
router.patch('/:id/entregar', verificarRol('trabajador', 'admin'), async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const trabajador_id = req.usuario.id;

        connection = await pool.getConnection();

        const [resultado] = await connection.query(
            `UPDATE paquetes 
            SET estado = 'entregado', fecha_entrega = NOW()
            WHERE id = ? AND trabajador_id = ?`,
            [id, trabajador_id]
        );

        if (resultado.affectedRows === 0) {
            connection.release();
            return res.status(404).json({ error: 'Paquete no encontrado' });
        }

        const [paquete] = await connection.query(
            'SELECT * FROM paquetes WHERE id = ?',
            [id]
        );

        connection.release();

        res.json({
            mensaje: 'Paquete marcado como entregado',
            paquete: paquete[0]
        });
    } catch (err) {
        if (connection) connection.release();
        console.error('Error al entregar paquete:', err);
        res.status(500).json({ error: 'Error al entregar paquete' });
    }
});

// Registrar pago
router.post('/:id/pagar', async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const { monto } = req.body;

        connection = await pool.getConnection();

        // Actualizar paquete
        const [resultado] = await connection.query(
            `UPDATE paquetes 
            SET estado = 'pagado', fecha_pago = NOW()
            WHERE id = ?`,
            [id]
        );

        if (resultado.affectedRows === 0) {
            connection.release();
            return res.status(404).json({ error: 'Paquete no encontrado' });
        }

        // Obtener paquete
        const [paquetes] = await connection.query(
            'SELECT * FROM paquetes WHERE id = ?',
            [id]
        );

        const paquete = paquetes[0];

        // Registrar pago
        await connection.query(
            `INSERT INTO pagos (paquete_id, cliente_id, monto, tipo_pago)
            VALUES (?, ?, ?, ?)`,
            [id, paquete.cliente_id, monto, paquete.tipo_pago]
        );

        connection.release();

        res.json({
            mensaje: 'Pago registrado exitosamente',
            paquete
        });
    } catch (err) {
        if (connection) connection.release();
        console.error('Error al registrar pago:', err);
        res.status(500).json({ error: 'Error al registrar pago' });
    }
});

export default router;
