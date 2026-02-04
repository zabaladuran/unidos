import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './api/auth.js';
import paquetesRoutes from './api/paquetes.js';
import reportesRoutes from './api/reportes.js';
import { verificarToken } from './middleware/auth.js';
import { initializeDatabase } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// Rutas públicas
app.use('/api/auth', authRoutes);

// Rutas protegidas
app.use('/api/paquetes', verificarToken, paquetesRoutes);
app.use('/api/reportes', verificarToken, reportesRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor'
    });
});

// Inicializar BD y arrancar servidor
async function iniciar() {
    try {
        console.log('🔧 Inicializando base de datos...');
        await initializeDatabase();
        console.log('✅ Base de datos lista');

        app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
            console.log(`📦 UNIDOS - Sistema de Gestión de Paquetería`);
            console.log(`🔗 API: http://localhost:${PORT}/api`);
            console.log(`📊 Health: http://localhost:${PORT}/api/health`);
        });
    } catch (err) {
        console.error('❌ Error al iniciar:', err);
        process.exit(1);
    }
}

iniciar();
