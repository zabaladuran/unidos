import express from 'express';
import { pool } from '../config/database.js';
import { verificarRol } from '../middleware/auth.js';

const router = express.Router();

// Crear paquete (trabajador)
router.post('/', verificarRol('trabajador', 'admin'), async (req, res) => {
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

        const resultado = await pool.query(
            `INSERT INTO paquetes 
            (cliente_id, trabajador_id, descripcion, precio, tipo_pago, observaciones) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`,
            [cliente_id, trabajador_id, descripcion, precio, tipo_pago, observaciones || null]
        );

        res.status(201).json({
            mensaje: 'Paquete registrado exitosamente',
            paquete: resultado.rows[0]
        });
    } catch (err) {
        console.error('Error al crear paquete:', err);
        res.status(500).json({ error: 'Error al registrar paquete' });
    }
});

// Obtener paquetes del trabajador
router.get('/mis-paquetes', verificarRol('trabajador', 'admin'), async (req, res) => {
    try {
        const trabajador_id = req.usuario.id;
        const { estado } = req.query;

        let query = `
            SELECT p.*, c.nombre as cliente_nombre, c.telefono as cliente_telefono
            FROM paquetes p
            LEFT JOIN clientes c ON p.cliente_id = c.id
            WHERE p.trabajador_id = $1
        `;
        const params = [trabajador_id];

        if (estado) {
            query += ` AND p.estado = $2`;
            params.push(estado);
        }

        query += ` ORDER BY p.fecha_registro DESC`;

        const resultado = await pool.query(query, params);

        res.json({
            total: resultado.rows.length,
            paquetes: resultado.rows
        });
    } catch (err) {
        console.error('Error al obtener paquetes:', err);
        res.status(500).json({ error: 'Error al obtener paquetes' });
    }
});

// Obtener todos los paquetes (admin/jefe)
router.get('/', verificarRol('admin', 'jefe'), async (req, res) => {
    try {
        const { trabajador_id, estado, fecha_inicio, fecha_fin } = req.query;

        let query = `
            SELECT p.*, 
                   c.nombre as cliente_nombre, 
                   u.nombre as trabajador_nombre
            FROM paquetes p
            LEFT JOIN clientes c ON p.cliente_id = c.id
            LEFT JOIN usuarios u ON p.trabajador_id = u.id
            WHERE 1=1
        `;
        const params = [];
        let paramCount = 1;

        if (trabajador_id) {
            query += ` AND p.trabajador_id = $${paramCount}`;
            params.push(trabajador_id);
            paramCount++;
        }

        if (estado) {
            query += ` AND p.estado = $${paramCount}`;
            params.push(estado);
            paramCount++;
        }

        if (fecha_inicio) {
            query += ` AND p.fecha_registro >= $${paramCount}`;
            params.push(fecha_inicio);
            paramCount++;
        }

        if (fecha_fin) {
            query += ` AND p.fecha_registro <= $${paramCount}`;
            params.push(fecha_fin);
            paramCount++;
        }

        query += ` ORDER BY p.fecha_registro DESC`;

        const resultado = await pool.query(query, params);

        res.json({
            total: resultado.rows.length,
            paquetes: resultado.rows
        });
    } catch (err) {
        console.error('Error al obtener paquetes:', err);
        res.status(500).json({ error: 'Error al obtener paquetes' });
    }
});

// Marcar paquete como entregado
router.patch('/:id/entregar', verificarRol('trabajador', 'admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const trabajador_id = req.usuario.id;

        const resultado = await pool.query(
            `UPDATE paquetes 
            SET estado = 'entregado', fecha_entrega = CURRENT_TIMESTAMP
            WHERE id = $1 AND trabajador_id = $2
            RETURNING *`,
            [id, trabajador_id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Paquete no encontrado' });
        }

        res.json({
            mensaje: 'Paquete marcado como entregado',
            paquete: resultado.rows[0]
        });
    } catch (err) {
        console.error('Error al entregar paquete:', err);
        res.status(500).json({ error: 'Error al entregar paquete' });
    }
});

// Registrar pago
router.post('/:id/pagar', async (req, res) => {
    try {
        const { id } = req.params;
        const { monto } = req.body;

        // Actualizar paquete
        const resultado = await pool.query(
            `UPDATE paquetes 
            SET estado = 'pagado', fecha_pago = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Paquete no encontrado' });
        }

        const paquete = resultado.rows[0];

        // Registrar pago
        await pool.query(
            `INSERT INTO pagos (paquete_id, cliente_id, monto, tipo_pago)
            VALUES ($1, $2, $3, $4)`,
            [id, paquete.cliente_id, monto, paquete.tipo_pago]
        );

        res.json({
            mensaje: 'Pago registrado exitosamente',
            paquete
        });
    } catch (err) {
        console.error('Error al registrar pago:', err);
        res.status(500).json({ error: 'Error al registrar pago' });
    }
});

export default router;
