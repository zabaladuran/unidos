# Estructura de carpetas - UNIDOS

```
unidos/
│
├── frontend/                      # Aplicación Frontend (HTML/CSS/JS)
│   ├── index.html                # Página de inicio (redirige a login)
│   ├── login.html                # Página de login
│   ├── registro.html             # Página de registro
│   ├── dashboard.html            # Panel principal
│   ├── css/
│   │   └── style.css             # Estilos principales
│   ├── js/
│   │   ├── login.js              # Lógica de login
│   │   ├── registro.js           # Lógica de registro
│   │   └── dashboard.js          # Lógica principal
│   └── vercel.json               # Configuración Vercel
│
├── backend/                       # Aplicación Backend (PHP)
│   ├── index.php                 # Router principal
│   ├── .env                      # Variables de entorno (NO SUBIR A GIT)
│   ├── .env.php                  # Cargador de variables
│   ├── config/
│   │   ├── config.php            # Configuración general
│   │   └── Database.php          # Clase de conexión a BD
│   ├── middleware/
│   │   ├── Auth.php              # Autenticación y JWT
│   │   └── cors.php              # Headers CORS
│   ├── api/
│   │   ├── auth.php              # Endpoints de autenticación
│   │   ├── paquetes.php          # Endpoints de paquetes
│   │   ├── pagos.php             # Endpoints de pagos
│   │   └── reportes.php          # Endpoints de reportes
│   ├── database/
│   │   └── schema.sql            # Script de creación de tablas
│   └── vercel.json               # Configuración Vercel
│
├── .gitignore                     # Archivos a ignorar en Git
├── .env.example                   # Ejemplo de variables de entorno
├── package.json                   # Metadatos del proyecto
├── README.md                      # Este archivo
├── INSTALACION.md                 # Guía de instalación detallada
└── ESTRUCTURA.md                  # Este archivo

## Flujo de datos

### Login/Registro
1. Usuario ingresa credenciales en login.html
2. JavaScript envía POST a backend/api/auth.php
3. Backend valida y devuelve token JWT
4. Frontend almacena token en localStorage
5. Redirige a dashboard.html

### Registrar Paquete
1. Trabajador completa formulario en dashboard.html
2. JavaScript valida y envía POST a backend/api/paquetes.php
3. Backend inserta en tabla 'paquetes' de PostgreSQL
4. Retorna confirmación

### Reportes
1. Usuario selecciona rango de fechas
2. Solicita GET a backend/api/reportes.php
3. Backend consulta BD y calcula totales por cliente
4. Retorna JSON con resumen
5. Frontend genera tabla y permite imprimir

## Tabla de Roles

| Rol | Permisos |
|-----|----------|
| Trabajador | Registrar paquetes, ver sus reportes, registrar pagos |
| Jefe | Ver todos los paquetes, generar reportes consolidados |
| Administrador | Control total del sistema |

## Métodos de Pago

| Método | Descripción |
|--------|-------------|
| Contado | Pago en el momento de la entrega |
| Contraentrega | Se cobra al cliente en la entrega |
| Crédito | Se factura para cobrar después |
| PXP Nequi | Pago digital por Nequi |
