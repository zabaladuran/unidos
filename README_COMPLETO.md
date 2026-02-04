# UNIDOS - Sistema de Gestión de Paquetería

Sistema completo para gestionar entregas de paquetes con control de pagos por tipo (Contado, Contraentrega, Nequi, Crédito). Ideal para empresas de paquetería.

## 🚀 Características

- **Autenticación segura** con JWT
- **3 roles de usuario**: Trabajador, Jefe, Administrador
- **Registro de paquetes** con descripción y precio
- **Tipos de pago**: Contado, Contraentrega, Nequi (PXP), Crédito
- **Reportes de recaudos** para el jefe
- **Seguimiento de pagos** por cliente
- **Dashboard personalizado** según rol
- **Base de datos PostgreSQL** en Aiven
- **Despliegue en Vercel**

## 📋 Stack Tecnológico

- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Backend**: Node.js, Express.js
- **Base de datos**: PostgreSQL (Aiven)
- **Hosting**: Vercel
- **Autenticación**: JWT
- **Control de versiones**: Git/GitHub

## 🛠️ Instalación Local

### Prerequisites

- Node.js 18+
- npm o yarn
- PostgreSQL (opcional, si quieres correr localmente)

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/zabaladuran/unidos.git
cd unidos
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus datos:
```
DATABASE_URL=postgresql://user:password@host:5432/unidos_db?sslmode=require
JWT_SECRET=tu_clave_muy_segura_minimo_32_caracteres
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:5000
```

4. **Iniciar servidor**
```bash
npm run dev
```

El servidor estará en `http://localhost:5000`

5. **Abrir frontend**
Abrir `SRC/index.html` en el navegador o servir con:
```bash
cd SRC
python -m http.server 3000
```

## 📦 Configurar Aiven PostgreSQL

1. Ir a https://aiven.io/
2. Crear cuenta gratuita
3. Crear servicio PostgreSQL
4. Copiar la URL de conexión en formato:
```
postgresql://user:password@host:5432/defaultdb?sslmode=require
```
5. Pegar en `.env` como `DATABASE_URL`

## 🚀 Despliegue en Vercel

### Opción 1: Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Opción 2: GitHub + Vercel Web

1. Push a GitHub
```bash
git add .
git commit -m "Setup inicial"
git push origin main
```

2. Ir a https://vercel.com
3. Conectar repositorio de GitHub
4. Configurar variables de entorno:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `CORS_ORIGIN`
5. Deploy automático

### Estructura para Vercel

Crear archivo `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "SRC/backend/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "SRC/frontend",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "SRC/backend/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "SRC/frontend/$1"
    }
  ]
}
```

## 📝 Estructura del Proyecto

```
unidos/
├── SRC/
│   ├── backend/
│   │   ├── index.js              # Servidor Express
│   │   ├── api/
│   │   │   ├── auth.js           # Rutas de autenticación
│   │   │   ├── paquetes.js       # Rutas de paquetes
│   │   │   └── reportes.js       # Rutas de reportes
│   │   ├── config/
│   │   │   └── database.js       # Configuración BD
│   │   └── middleware/
│   │       └── auth.js           # Middleware JWT
│   │
│   └── frontend/
│       ├── index.html            # Página principal
│       ├── login.html            # Login
│       ├── registro.html         # Registro
│       ├── dashboard-trabajador.html
│       ├── dashboard-jefe.html
│       ├── dashboard-admin.html
│       ├── css/
│       │   └── style.css         # Estilos globales
│       └── js/
│           └── api.js            # Cliente API
│
├── package.json
├── .env.example
├── vercel.json
└── README.md
```

## 👥 Roles y Permisos

### Trabajador
- Registrar nuevos paquetes
- Ver sus paquetes
- Marcar paquetes como entregados
- Registrar pagos
- Ver sus estadísticas

### Jefe
- Ver recaudos por trabajador
- Ver resumen de pagos
- Generar reportes
- Ver desempeño del equipo

### Administrador
- Crear usuarios
- Gestionar todos los paquetes
- Acceso a reportes completos
- Configuración del sistema

## 🔐 Seguridad

- Contraseñas encriptadas con bcrypt
- Tokens JWT con expiración
- CORS configurado
- Variables de entorno protegidas
- SSL en base de datos

## 📊 Tipos de Pago

1. **Contado**: Pago inmediato al recibir
2. **Contraentrega**: Se cobra al entregar
3. **Nequi (PXP)**: Pago por transferencia Nequi
4. **Crédito**: Pago a plazo

## 🐛 Troubleshooting

### Error: "No se ha podido acceder al archivo"
- Verificar que todos los archivos `.html` estén en `SRC/frontend/`
- Limpiar caché del navegador

### Error de conexión a BD
- Verificar que `DATABASE_URL` sea correcto
- Asegurar que la IP está permitida en Aiven

### CORS error
- Verificar `CORS_ORIGIN` en `.env`
- Incluir la URL del frontend

## 📞 Contacto y Soporte

- Email: tu@email.com
- GitHub: https://github.com/zabaladuran/unidos

## 📄 Licencia

MIT - Libre para usar en proyectos personales y comerciales.

---

**Última actualización**: 2026-02-04
**Versión**: 1.0.0
