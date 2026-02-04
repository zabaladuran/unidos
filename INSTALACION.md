# Guía de Instalación y Despliegue - UNIDOS

## 1. Configuración Inicial

### 1.1 Crear Cuenta en Aiven
1. Ve a https://aiven.io/
2. Crea una cuenta (puedes usar GitHub)
3. Crea un servicio PostgreSQL
4. Copia las credenciales:
   - Host
   - Puerto
   - Nombre de base de datos
   - Usuario
   - Contraseña

### 1.2 Crear la Base de Datos
1. Conecta a tu instancia PostgreSQL de Aiven
2. Ejecuta el script SQL:
   ```sql
   -- Ir a backend/database/schema.sql
   ```
3. Copia y pega el contenido en el editor de Aiven

### 1.3 Variables de Entorno
Actualiza los archivos `.env`:

**backend/.env:**
```
DB_HOST=tu-host-aiven.a.aivencloud.com
DB_PORT=5432
DB_NAME=nombre_base_datos
DB_USER=usuario
DB_PASSWORD=contraseña
JWT_SECRET=tu_clave_secreta_segura
```

**frontend/js/dashboard.js, login.js, registro.js:**
- Cambiar `const API_URL` según tu servidor

## 2. Desarrollo Local

### Backend (PHP)
```bash
cd backend
php -S localhost:5000
```

### Frontend
- Abre `frontend/login.html` en tu navegador
- O usa un servidor local simple

## 3. Despliegue en Vercel

### 3.1 Preparar GitHub
```bash
# Asegúrate de tener Git instalado
git init
git add .
git commit -m "Initial commit - UNIDOS"
```

### 3.2 Push a GitHub
1. Crea un repositorio en GitHub
2. Sigue las instrucciones para push

### 3.3 Conectar Vercel - Backend
1. Ve a https://vercel.com
2. Importa el repositorio
3. Configura root directory: `backend`
4. Añade variables de entorno
5. Deploy

### 3.4 Conectar Vercel - Frontend
1. Crea otro proyecto en Vercel
2. Importa el mismo repositorio
3. Configura root directory: `frontend`
4. Actualiza `API_URL` en archivos JS con tu URL de Vercel backend
5. Deploy

## 4. URLs Después del Deploy

**Frontend:** https://tu-frontend.vercel.app/
**Backend API:** https://tu-backend.vercel.app/api/

## 5. Funciones de la Aplicación

### Para Trabajadores
- ✅ Registrar paquetes entregados
- ✅ Registrar pagos (Contado, Contraentrega, Crédito, PXP Nequi)
- ✅ Ver mis paquetes
- ✅ Generar reportes por fecha
- ✅ Seguimiento de pagos

### Para Jefes
- 👀 Ver todos los paquetes de sus trabajadores
- 📊 Generar reportes consolidados
- 💰 Control total de recaudos

### Para Administrador
- 🔑 Control total del sistema
- 👥 Gestión de usuarios
- 📈 Reportes globales

## 6. Métodos de Pago

- **Contado:** Dinero en mano
- **Contraentrega:** Se cobra en la entrega
- **Crédito:** Facturación para cobrar después
- **PXP Nequi:** Pago por aplicación Nequi

## 7. Troubleshooting

### Error de conexión a BD
- Verifica IP en Aiven
- Confirma credenciales en .env
- Revisa firewall

### CORS errors
- Las headers CORS están configuradas en `middleware/cors.php`

### Token inválido
- Limpia localStorage en navegador
- Vuelve a hacer login

## 8. Documentación API

### POST /api/auth?action=register
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456",
  "rol": "trabajador"
}
```

### POST /api/auth?action=login
```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

### POST /api/paquetes
```json
{
  "cliente": "Juan López",
  "telefono": "3001234567",
  "descripcion": "Paquete para....",
  "precio": 15000,
  "metodoPago": "contado",
  "direccion": "Cra 1 #2-3"
}
```

### GET /api/paquetes
- Requiere token
- Retorna paquetes del usuario

### PUT /api/paquetes?id=1
```json
{
  "estado": "entregado"
}
```

## 9. Contacto y Soporte

Para más información, contacta al administrador.
