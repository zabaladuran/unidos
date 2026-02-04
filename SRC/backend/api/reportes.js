import express from 'express';
import { pool } from '../config/database.js';
import { verificarRol } from '../middleware/auth.js';

const router = express.Router();

// Reporte de recaudos por trabajador (para jefe)
router.get('/recaudos-trabajador/:trabajador_id', verificarRol('jefe', 'admin'), async (req, res) => {
    try {
        const { trabajador_id } = req.params;
        const { fecha_inicio, fecha_fin } = req.query;

        let query = `
            SELECT 
                SUM(p.precio) as total_recaudado,
                COUNT(p.id) as cantidad_paquetes,
                COUNT(CASE WHEN p.estado = 'pagado' THEN 1 END) as paquetes_pagados,
                COUNT(CASE WHEN p.estado = 'pendiente' THEN 1 END) as paquetes_pendientes,
                COUNT(CASE WHEN p.tipo_pago = 'contado' THEN 1 END) as pagos_contado,
                COUNT(CASE WHEN p.tipo_pago = 'contraentrega' THEN 1 END) as pagos_contraentrega,
                COUNT(CASE WHEN p.tipo_pago = 'nequi' THEN 1 END) as pagos_nequi,
                COUNT(CASE WHEN p.tipo_pago = 'credito' THEN 1 END) as pagos_credito
            FROM paquetes p
            WHERE p.trabajador_id = $1
        `;
        const params = [trabajador_id];
        let paramCount = 2;

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

        const resultado = await pool.query(query, params);
        const resumen = resultado.rows[0];

        // Obtener detalle por cliente
        const detalleQuery = `
            SELECT 
                c.id,
                c.nombre,
                COUNT(p.id) as paquetes,
                SUM(p.precio) as monto_total,
                SUM(CASE WHEN p.estado = 'pagado' THEN p.precio ELSE 0 END) as monto_pagado,
                SUM(CASE WHEN p.estado = 'pendiente' THEN p.precio ELSE 0 END) as monto_pendiente
            FROM paquetes p
            LEFT JOIN clientes c ON p.cliente_id = c.id
            WHERE p.trabajador_id = $1
            GROUP BY c.id, c.nombre
            ORDER BY monto_total DESC
        `;

        const detalleResultado = await pool.query(detalleQuery, [trabajador_id]);

        res.json({
            resumen,
            detalleClientes: detalleResultado.rows
        });
    } catch (err) {
        console.error('Error al obtener reporte:', err);
        res.status(500).json({ error: 'Error al obtener reporte' });
    }
});

// Reporte de pagos por tipo
router.get('/pagos-por-tipo', verificarRol('jefe', 'admin'), async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;

        let query = `
            SELECT 
                tipo_pago,
                COUNT(*) as cantidad,
                SUM(monto) as total,
                AVG(monto) as promedio
            FROM pagos
            WHERE 1=1
        `;
        const params = [];
        let paramCount = 1;

        if (fecha_inicio) {
            query += ` AND fecha_pago >= $${paramCount}`;
            params.push(fecha_inicio);
            paramCount++;
        }

        if (fecha_fin) {
            query += ` AND fecha_pago <= $${paramCount}`;
            params.push(fecha_fin);
            paramCount++;
        }

        query += ` GROUP BY tipo_pago ORDER BY total DESC`;

        const resultado = await pool.query(query, params);

        res.json(resultado.rows);
    } catch (err) {
        console.error('Error en reporte de pagos:', err);
        res.status(500).json({ error: 'Error al obtener reporte' });
    }
});

// Reporte de recaudos totales
router.get('/recaudos-totales', verificarRol('jefe', 'admin'), async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;

        let query = `
            SELECT 
                u.id,
                u.nombre,
                COUNT(p.id) as total_paquetes,
                SUM(p.precio) as total_recaudado,
                SUM(CASE WHEN p.estado = 'pagado' THEN p.precio ELSE 0 END) as pagado,
                SUM(CASE WHEN p.estado = 'pendiente' THEN p.precio ELSE 0 END) as pendiente
            FROM usuarios u
            LEFT JOIN paquetes p ON u.id = p.trabajador_id
            WHERE u.rol = 'trabajador'
        `;
        const params = [];
        let paramCount = 1;

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

        query += ` GROUP BY u.id, u.nombre ORDER BY total_recaudado DESC`;

        const resultado = await pool.query(query, params);

        res.json(resultado.rows);
    } catch (err) {
        console.error('Error en reporte de recaudos:', err);
        res.status(500).json({ error: 'Error al obtener reporte' });
    }
});

export default router;
