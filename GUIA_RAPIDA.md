# Guía Rápida - UNIDOS

## 🚀 Inicio Rápido (5 minutos)

### Paso 1: Configurar Aiven
```
1. Ir a https://aiven.io/
2. Crear cuenta y postgresql service
3. Copiar credenciales en backend/.env
4. Ejecutar backend/database/schema.sql
```

### Paso 2: Iniciar Backend
```bash
cd backend
php -S localhost:5000
```

### Paso 3: Abrir Frontend
```
- Abre frontend/login.html en navegador
- O usa: python -m http.server 3000 en carpeta frontend
```

### Paso 4: Crear Cuenta
- Clic en "Regístrate aquí"
- Completa los datos
- Login

### Paso 5: Registrar Paquete
- Click en "Registrar Paquete"
- Completa los datos del cliente
- Selecciona método de pago
- Confirma

## 📊 Funciones Principales

### Dashboard Trabajador
```
Inicio          → Estadísticas del día
Registrar Paq   → Nuevo paquete entregado
Mis Paquetes    → Tabla de todos tus paquetes
Reportes        → Por rango de fechas
Pagos           → Control de recaudos
```

### Campos al Registrar Paquete
```
Cliente         → Nombre del cliente
Teléfono        → Número de contacto
Descripción     → Qué va en el paquete
Precio          → Valor a cobrar
Método de Pago  → Contado / Contraentrega / Crédito / PXP Nequi
Dirección       → Dónde entregar
```

## 💾 Base de Datos

### Tablas
```
usuarios        → ID, nombre, email, password, rol
paquetes        → ID, cliente, precio, estado, metodo_pago
pagos           → ID, monto, estado, metodo_pago
```

### Estados de Paquete
- `pendiente`    → Aún no se entrega
- `entregado`    → Fue entregado
- `pagado`       → El cliente pagó

## 🔐 Seguridad

- Las contraseñas se guardan cifradas con bcrypt
- El login genera un token JWT válido por 7 días
- Cada solicitud debe incluir el token
- Las contraseñas deben tener mínimo 6 caracteres

## 🌐 Despliegue en Vercel

### 1. Subir a GitHub
```bash
git init
git add .
git commit -m "UNIDOS v1.0"
git push origin main
```

### 2. Backend en Vercel
- Proyecto nuevo
- Root: `backend`
- Variables de entorno (DB_HOST, etc)
- Deploy

### 3. Frontend en Vercel
- Proyecto nuevo
- Root: `frontend`
- Deploy

### 4. Actualizar URLs
En frontend/js/:
```javascript
const API_URL = 'https://tu-backend.vercel.app/api';
```

## 🐛 Errores Comunes

| Error | Solución |
|-------|----------|
| "No puedo conectar a BD" | Verifica credenciales Aiven en .env |
| "Token inválido" | Borra localStorage y haz login de nuevo |
| "CORS error" | Verifica que cors.php esté en middleware |
| "404 en API" | Revisa que el router en index.php sea correcto |

## 📞 Contacto

- Admin: zabaladuran
- Email: support@unidos.local
- Repo: https://github.com/zabaladuran/unidos

## ✅ Checklist Pre-Producción

- [ ] Variables .env configuradas
- [ ] Base de datos creada en Aiven
- [ ] JWT_SECRET cambiado
- [ ] SSL/HTTPS habilitado
- [ ] Tests realizados
- [ ] Subido a GitHub
- [ ] Deployado en Vercel
- [ ] URLs actualizadas en frontend

¡Listo para usar! 🎉
