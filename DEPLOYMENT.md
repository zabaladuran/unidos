# GitHub y Vercel - Guía de Despliegue

## 1. Preparar Repositorio GitHub

### Paso 1: Crear repositorio vacío
1. Ve a https://github.com/new
2. Nombre: `unidos`
3. Descripción: "Sistema de gestión de paquetería"
4. **NO marques** "Initialize with README"
5. Clic en "Create repository"

### Paso 2: Subir código (primera vez)
```bash
cd c:\Users\elsek\desktop\unidos

# Configurar Git (si no está configurado)
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Inicializar y pushear
git init
git add .
git commit -m "Initial commit - UNIDOS v1.0"
git branch -M main
git remote add origin https://github.com/zabaladuran/unidos.git
git push -u origin main
```

### Paso 3: Updates posteriores
```bash
git add .
git commit -m "Descripción del cambio"
git push origin main
```

---

## 2. Desplegar Backend en Vercel

### Prerequisitos
- Tener cuenta en Vercel (https://vercel.com)
- Proyecto subido a GitHub

### Paso 1: Conectar a Vercel
1. Ve a https://vercel.com/dashboard
2. Clic en "Add New Project"
3. Selecciona "Import Git Repository"
4. Busca "unidos" y selecciona
5. Clic en "Import"

### Paso 2: Configurar Backend
1. **Project Name:** `unidos-backend`
2. **Framework Preset:** Other
3. **Root Directory:** `backend`
4. **Build Command:** dejar vacío
5. **Output Directory:** dejar vacío

### Paso 3: Añadir Variables de Entorno
1. Sección "Environment Variables"
2. Añade cada variable:
   - `DB_HOST` = tu-host.a.aivencloud.com
   - `DB_PORT` = 5432
   - `DB_NAME` = nombre_base_datos
   - `DB_USER` = usuario
   - `DB_PASSWORD` = contraseña
   - `JWT_SECRET` = clave_secreta_muy_segura
   - `APP_ENV` = production

3. Clic en "Deploy"

### Paso 4: Obtener URL
Después del deploy:
- Copia la URL, ejemplo: `https://unidos-backend.vercel.app`

---

## 3. Desplegar Frontend en Vercel

### Paso 1: Crear nuevo proyecto
1. Ve a https://vercel.com/dashboard
2. Clic en "Add New Project"
3. Selecciona "Import Git Repository"
4. Busca "unidos" de nuevo
5. Clic en "Import"

### Paso 2: Configurar Frontend
1. **Project Name:** `unidos-frontend`
2. **Framework Preset:** HTML/CSS/JavaScript
3. **Root Directory:** `frontend`
4. **Build Command:** dejar vacío
5. **Output Directory:** dejar vacío

### Paso 3: Deploy
Clic en "Deploy"

### Paso 4: Obtener URL
Después del deploy:
- Copia la URL, ejemplo: `https://unidos-frontend.vercel.app`

---

## 4. Conectar Frontend con Backend

### Actualizar archivo: `frontend/js/login.js`
```javascript
// Línea 2 - Cambiar:
const API_URL = 'https://unidos-backend.vercel.app/api';
```

### Actualizar archivo: `frontend/js/registro.js`
```javascript
// Línea 2 - Cambiar:
const API_URL = 'https://unidos-backend.vercel.app/api';
```

### Actualizar archivo: `frontend/js/dashboard.js`
```javascript
// Línea 2 - Cambiar:
const API_URL = 'https://unidos-backend.vercel.app/api';
```

### Hacer push de cambios
```bash
git add frontend/js/
git commit -m "Actualizar URLs de API a producción"
git push origin main
```

Vercel auto-deployará los cambios.

---

## 5. Verificar Despliegue

### Test del Backend
```
GET https://unidos-backend.vercel.app/api/auth
```
Debería retornar error 404 (endpoint no existe).

### Test del Frontend
1. Abre https://unidos-frontend.vercel.app
2. Deberías ver la página de bienvenida
3. Clic en "Crear Cuenta"
4. Completa el formulario
5. Clic en Registrarse
6. Si aparece "Registro exitoso", ¡funciona!

---

## 6. Dominio Personalizado (Opcional)

### Para ambos proyectos:
1. En Vercel → Proyecto → Settings
2. Sección "Domains"
3. Añade tu dominio
4. Sigue las instrucciones de DNS

---

## 7. Monitoreo

### En Vercel Dashboard:
- **Deployments:** Ver historial de despliegues
- **Logs:** Ver errores
- **Analytics:** Estadísticas de uso
- **Settings:** Configuración del proyecto

### En Aiven Dashboard:
- **Connections:** Verificar conexiones a BD
- **Metrics:** Monitoreo de base de datos
- **Backups:** Estado de respaldos

---

## 8. Troubleshooting

### "Deploy fallido"
- Revisa los logs en Vercel
- Verifica que backend/index.php existe
- Revisa variables de entorno

### "Error de conexión a BD"
- Verifica credenciales en Vercel
- En Aiven, confirma IP de Vercel está permitida
- Prueba conexión local primero

### "CORS errors en frontend"
- Verifica que `middleware/cors.php` existe
- Headers deben tener `Access-Control-Allow-Origin: *`

### "404 en endpoints API"
- Verifica que `backend/index.php` existe
- Revisa el router está bien
- Verifica que los archivos en `api/` existen

---

## 9. Mantenimiento

### Actualizar código
```bash
# Hacer cambios locales
# Luego:
git add .
git commit -m "Descripción del cambio"
git push origin main
# Vercel auto-deploya
```

### Actualizar variables de entorno
1. Vercel Dashboard → Proyecto → Settings
2. Environment Variables
3. Edita o añade
4. Auto-deploy

### Respaldos de BD
En Aiven:
1. Dashboard → Tu servicio
2. Backups
3. Crear backup manual

---

## 10. Seguridad

- ✅ Nunca commits `.env` (está en `.gitignore`)
- ✅ Cambiar `JWT_SECRET` en producción
- ✅ Usar HTTPS (Vercel lo hace automáticamente)
- ✅ Validar datos en backend
- ✅ Habilitar 2FA en GitHub y Vercel

---

## URLs Finales

Una vez deployado:
- **Frontend:** https://unidos-frontend.vercel.app
- **Backend API:** https://unidos-backend.vercel.app/api
- **GitHub:** https://github.com/zabaladuran/unidos
- **Admin Vercel:** https://vercel.com/dashboard

---

## Contacto de Soporte

- Vercel: https://vercel.com/support
- GitHub: https://github.com/support
- Aiven: https://aiven.io/support
