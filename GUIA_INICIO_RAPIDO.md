# 🚀 GUÍA RÁPIDA - UNIDOS

## Inicio Rápido (5 minutos)

### 1. Base de Datos MySQL Aiven (YA CONFIGURADA)

Tu MySQL ya está creado en Aiven con estos datos:

```
Host: mysql-9adc554-calculadora-imc.g.aivencloud.com
Puerto: 12731
Usuario: avnadmin
Contraseña: AVfS_3ZYFyJhrvSGTHdZ-1U
Base de datos: defaultdb
```

**Pasos:**
1. Ve a archivo `script-crear-tablas-usuarios.sql` en la raíz del proyecto
2. Copia TODO el contenido
3. Ve a Aiven → tu servicio MySQL → phpmyadmin
4. Pega en la pestaña "SQL"
5. Ejecuta

Más detalles en: `INSTRUCCIONES_CREAR_BD.md`

### 2. Configurar Proyecto Localmente

```bash
# Copiar archivo de configuración
cp .env.example .env

# Los datos de BD ya están en .env.example
# Solo cambiar JWT_SECRET si quieres
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Iniciar Servidor

```bash
npm run dev
```

Estará en: `http://localhost:5000`

Verás:
```
🚀 Servidor ejecutándose en puerto 5000
📦 UNIDOS - Sistema de Gestión de Paquetería
🔗 API: http://localhost:5000/api
📊 Health: http://localhost:5000/api/health
```

### 5. Acceder a la App

Opción A - Abrir en navegador:
```
file:///C:/Users/elsek/Desktop/unidos/SRC/index.html
```

Opción B - Servir con Python (recomendado):
```bash
cd SRC
python -m http.server 3000
# Luego abre http://localhost:3000
```

### 6. Login

Usa estas credenciales:

| Usuario | Email | Contraseña |
|---------|-------|-----------|
| Admin | admin@unidos.com | admin123 |
| Jefe | jefe@unidos.com | jefe123 |
| Trabajador 1 | juan@unidos.com | juan123 |
| Trabajador 2 | pedro@unidos.com | pedro123 |

---

## 🌐 Desplegar en Vercel (2 pasos)

### Paso 1: Push a GitHub

```bash
git add .
git commit -m "Sistema UNIDOS con MySQL Aiven"
git push origin main
```

### Paso 2: Conectar Vercel

1. Ir a https://vercel.com
2. Click "New Project"
3. Seleccionar repo de GitHub
4. Agregar Environment Variables:
   ```
   DB_HOST=mysql-9adc554-calculadora-imc.g.aivencloud.com
   DB_PORT=12731
   DB_USER=avnadmin
   DB_PASSWORD=AVfS_3ZYFyJhrvSGTHdZ-1U
   DB_NAME=defaultdb
   JWT_SECRET=tu_clave_super_secreta
   NODE_ENV=production
   ```
5. Deploy ✅

---

## 📱 Accesos por Rol

| Rol | Email | Contraseña | Funciones |
|-----|-------|-----------|-----------|
| **Admin** | admin@unidos.com | admin123 | Todo el sistema |
| **Jefe** | jefe@unidos.com | jefe123 | Ver recaudos, reportes |
| **Trabajador** | juan@unidos.com | juan123 | Registrar paquetes |
| **Trabajador** | pedro@unidos.com | pedro123 | Registrar paquetes |

---

## 📊 Flujo de Trabajo

```
Trabajador registra paquete
    ↓
Marca como entregado
    ↓
Registra pago (tipo: contado/contraentrega/nequi/crédito)
    ↓
Jefe ve reporte de recaudos
    ↓
Verifica lo que le debe cada trabajador
    ↓
Admin revisa todo el sistema
```

---

## 🔗 Archivos Importantes

- `script-crear-tablas-usuarios.sql` - Crear BD y usuarios
- `INSTRUCCIONES_CREAR_BD.md` - Pasos detallados
- `CONEXION_MYSQL_AIVEN.md` - Datos de conexión
- `SRC/index.html` - Página principal
- `SRC/frontend/login.html` - Login
- `SRC/backend/index.js` - Servidor API

---

## ⚡ Comandos Útiles

```bash
# Desarrollar
npm run dev

# Ver logs
node SRC/backend/index.js

# Deploy Vercel
npm i -g vercel
vercel
```

---

## ❓ Problemas Frecuentes

**Error: "Cannot find module mysql2"**
```bash
npm install mysql2
```

**Error: "Database connection failed"**
- Verifica que .env tenga los datos correctos
- Verifica que los datos de Aiven sean exactos

**Error: "CORS error"**
- Agregar tu URL a CORS_ORIGIN en .env

---

## 📞 Soporte

- Documentación completa: `README_COMPLETO.md`
- Deploy Vercel: `DEPLOY_VERCEL.md`
- API endpoints: `API_ENDPOINTS.md`

---

¡Listo! Ya tienes un sistema profesional de gestión de paquetería. 🎉
