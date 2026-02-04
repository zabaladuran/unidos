import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

const router = express.Router();

// Registro
router.post('/registro', async (req, res) => {
    let connection;
    try {
        const { nombre, email, contraseña, rol } = req.body;

        if (!nombre || !email || !contraseña || !rol) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        // Validar rol
        if (!['admin', 'jefe', 'trabajador'].includes(rol)) {
            return res.status(400).json({ error: 'Rol inválido' });
        }

        connection = await pool.getConnection();

        // Verificar si el usuario existe
        const [existente] = await connection.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (existente.length > 0) {
            connection.release();
            return res.status(409).json({ error: 'El email ya está registrado' });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const contraseñaEncriptada = await bcrypt.hash(contraseña, salt);

        // Crear usuario
        const [resultado] = await connection.query(
            'INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES (?, ?, ?, ?)',
            [nombre, email, contraseñaEncriptada, rol]
        );

        const usuarioId = resultado.insertId;

        // Generar token
        const token = jwt.sign(
            { id: usuarioId, email: email, rol: rol },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        connection.release();

        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            usuario: {
                id: usuarioId,
                nombre: nombre,
                email: email,
                rol: rol
            },
            token
        });
    } catch (err) {
        if (connection) connection.release();
        console.error('Error en registro:', err);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Login
router.post('/login', async (req, res) => {
    let connection;
    try {
        const { email, contraseña } = req.body;

        if (!email || !contraseña) {
            return res.status(400).json({ error: 'Email y contraseña requeridos' });
        }

        connection = await pool.getConnection();

        // Buscar usuario
        const [rows] = await connection.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            connection.release();
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const usuario = rows[0];

        // Verificar contraseña
        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);

        if (!contraseñaValida) {
            connection.release();
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Verificar estado
        if (!usuario.estado) {
            connection.release();
            return res.status(403).json({ error: 'Usuario inactivo' });
        }

        // Generar token
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        connection.release();

        res.json({
            mensaje: 'Sesión iniciada exitosamente',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            },
            token
        });
    } catch (err) {
        if (connection) connection.release();
        console.error('Error en login:', err);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

export default router;
