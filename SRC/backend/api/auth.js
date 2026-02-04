import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

const router = express.Router();

// Registro
router.post('/registro', async (req, res) => {
    try {
        const { nombre, email, contraseña, rol } = req.body;

        if (!nombre || !email || !contraseña || !rol) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        // Validar rol
        if (!['admin', 'jefe', 'trabajador'].includes(rol)) {
            return res.status(400).json({ error: 'Rol inválido' });
        }

        // Verificar si el usuario existe
        const existente = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );

        if (existente.rows.length > 0) {
            return res.status(409).json({ error: 'El email ya está registrado' });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const contraseñaEncriptada = await bcrypt.hash(contraseña, salt);

        // Crear usuario
        const resultado = await pool.query(
            'INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
            [nombre, email, contraseñaEncriptada, rol]
        );

        const usuario = resultado.rows[0];

        // Generar token
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            usuario,
            token
        });
    } catch (err) {
        console.error('Error en registro:', err);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, contraseña } = req.body;

        if (!email || !contraseña) {
            return res.status(400).json({ error: 'Email y contraseña requeridos' });
        }

        // Buscar usuario
        const resultado = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const usuario = resultado.rows[0];

        // Verificar contraseña
        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);

        if (!contraseñaValida) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Verificar estado
        if (!usuario.estado) {
            return res.status(403).json({ error: 'Usuario inactivo' });
        }

        // Generar token
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

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
        console.error('Error en login:', err);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

export default router;
