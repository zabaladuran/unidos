# 🚀 GUÍA RÁPIDA - UNIDOS

## Inicio Rápido (5 minutos)

### 1. Preparar Base de Datos Aiven

```
1. Ir a https://aiven.io
2. Registrarse (prueba gratis 300 creditos)
3. Crear "PostgreSQL" service
4. Copiar "Service URI"
5. Pegar en archivo .env como DATABASE_URL
```

### 2. Configurar Proyecto

```bash
# Copiar archivo de configuración
cp .env.example .env

# Editar .env con tus datos
# DATABASE_URL=postgresql://...
# JWT_SECRET=mi_clave_segura
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Probar Localmente

**Terminal 1 - Backend**
```bash
npm run dev
# Estará en http://localhost:5000
```

**Terminal 2 - Frontend (opcional)**
```bash
cd SRC
python -m http.server 3000
# Abre http://localhost:3000
```

### 5. Crear Cuentas de Prueba

**Opción A: Vía API**
```bash
curl -X POST http://localhost:5000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Trabajador",
    "email": "juan@example.com",
    "contraseña": "123456",
    "rol": "trabajador"
  }'
```

**Opción B: Vía Frontend**
1. Abre `SRC/index.html`
2. Clic en "Crear Cuenta"
3. Completa formulario

### 6. Login y Uso

1. Abre `SRC/frontend/login.html`
2. Usa las credenciales creadas
3. ¡Listo! Estás en tu dashboard

## 🌐 Desplegar en Vercel (2 pasos)

### Paso 1: Push a GitHub

```bash
git add .
git commit -m "Sistema UNIDOS completo"
git push origin main
```

### Paso 2: Conectar Vercel

1. Ir a https://vercel.com
2. Click "New Project"
3. Seleccionar repo de GitHub
4. Agregar Environment Variables:
   - `DATABASE_URL`: Tu URL de Aiven
   - `JWT_SECRET`: Tu clave secreta
   - `CORS_ORIGIN`: La URL de tu app
5. Deploy ✅

## 📱 Accesos por Rol

| Rol | Email | Contraseña | Funciones |
|-----|-------|-----------|-----------|
| Trabajador | juan@example.com | 123456 | Registrar paquetes, ver pagos |
| Jefe | jefe@example.com | 123456 | Ver recaudos, reportes |
| Admin | admin@example.com | 123456 | Gestionar usuarios, todo |

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

## 🎯 Tipos de Pago

- **Contado** ($): Cliente paga al recibir
- **Contraentrega**: Cobro al entregar
- **Nequi**: Transferencia por PXP
- **Crédito**: Pago después

## 🔗 URLs Importantes

- **Página Principal**: `SRC/index.html`
- **Login**: `SRC/frontend/login.html`
- **Registro**: `SRC/frontend/registro.html`
- **Dashboard Trabajador**: `SRC/frontend/dashboard-trabajador.html`
- **Dashboard Jefe**: `SRC/frontend/dashboard-jefe.html`
- **Dashboard Admin**: `SRC/frontend/dashboard-admin.html`

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

## ❓ Problemas Frecuentes

**Error: "Cannot find module"**
```bash
npm install
```

**Error: "Database connection failed"**
- Verifica DATABASE_URL en .env
- Comprueba que la IP esté permitida en Aiven

**Error: "CORS error"**
- Agrega tu URL a CORS_ORIGIN en .env

## 📞 Soporte

Revisa `README_COMPLETO.md` para documentación completa.

---

¡Listo! Ahora tienes un sistema profesional de gestión de paquetería. 🎉
