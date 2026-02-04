# 📘 Guía de Deploy en Vercel

## ¿Qué es Vercel?

Vercel es una plataforma moderna para desplegar aplicaciones web. Es gratuita, rápida y se integra perfectamente con GitHub.

## 📋 Requisitos Previos

1. Cuenta en GitHub (https://github.com)
2. Cuenta en Aiven (https://aiven.io) - para la BD PostgreSQL
3. Cuenta en Vercel (https://vercel.com)
4. Tener pusheado el código a GitHub

## 🚀 Pasos de Deploy

### Paso 1: Preparar Aiven PostgreSQL

1. **Ir a https://aiven.io**
2. **Crear cuenta** (tiene 300 créditos gratis)
3. **Crear servicio PostgreSQL**:
   - Click en "Create Service"
   - Seleccionar "PostgreSQL"
   - Escoger plan gratuito
   - Nombre: `unidos-db`
   - Región: Cerca tuyo (ej: South America)
   - Click "Create"

4. **Obtener Connection String**:
   - Ir a "Overview"
   - Buscar "Service URI"
   - Copiar algo como: `postgresql://avnadmin:xxxx@host:5432/defaultdb?sslmode=require`
   - Guardar este dato ⭐

### Paso 2: Preparar GitHub

```bash
# Desde la carpeta del proyecto
cd c:\Users\elsek\Desktop\unidos

# Verificar que todo esté en Git
git status

# Si hay cambios, commitear
git add -A
git commit -m "Preparado para deploy"

# Push a GitHub
git push origin main
```

### Paso 3: Conectar Vercel a GitHub

1. **Ir a https://vercel.com**
2. **Hacer login** (o crear cuenta)
3. **Click en "New Project"**
4. **Seleccionar el repositorio `unidos`**
5. **Configuración del proyecto:**
   - Root Directory: (dejar en blanco)
   - Framework: Next.js (aunque no lo usamos, Vercel lo detecta)
   - Build Command: `npm run build`
   - Output Directory: (dejar en blanco)

### Paso 4: Agregar Variables de Entorno

En la página de configuración de Vercel, antes de hacer Deploy:

1. **Buscar sección "Environment Variables"**
2. **Agregar cada variable:**

```
Nombre: DATABASE_URL
Valor: postgresql://avnadmin:xxxxx@host:5432/defaultdb?sslmode=require
(Copiar la que obtuviste de Aiven)

Nombre: JWT_SECRET
Valor: mi-clave-super-secreta-minimo-32-caracteres-aleatorios-2024

Nombre: NODE_ENV
Valor: production

Nombre: CORS_ORIGIN
Valor: https://tu-proyecto.vercel.app,https://www.tu-proyecto.vercel.app
```

### Paso 5: Deploy

1. **Click en "Deploy"**
2. **Esperar a que termine** (5-10 minutos)
3. **Cuando vea ✅ "Production"** → ¡Listo!
4. **Copiar la URL** que aparece (ej: `https://unidos.vercel.app`)

### Paso 6: Actualizar CORS en Vercel

1. En Vercel, ir a Settings → Environment Variables
2. Editar `CORS_ORIGIN` y agregar tu URL:
   ```
   https://tu-proyecto.vercel.app,https://www.tu-proyecto.vercel.app
   ```
3. Hacer redeploy

## 🔄 Redeploy Automático

Desde ahora, cada vez que hagas push a GitHub:

```bash
git add .
git commit -m "Cambios"
git push origin main
```

**Vercel automáticamente**:
1. Detecta los cambios
2. Compila el código
3. Lo despliega en producción
4. ¡Sin hacer nada manualmente!

## ✅ Verificar que Funciona

1. **Abre**: `https://tu-proyecto.vercel.app`
2. **Deberías ver**: Página principal de UNIDOS
3. **Click en "Crear Cuenta"**
4. **Completa el formulario y registrate**
5. **Login con tus credenciales**
6. **¡Listo!**

## 🐛 Troubleshooting de Deploy

### Error: "Build failed"
- Verificar que `package.json` tenga todas las dependencias
- Asegurar que la sintaxis de los archivos sea correcta
- Revisar los logs de Vercel

### Error: "Database connection failed"
- Verificar `DATABASE_URL` en variables de entorno
- Asegurar que la IP de Vercel esté permitida en Aiven
- En Aiven: Settings → IP Allowlist → Agregar `0.0.0.0/0` (aunque no es seguro)

### Error: "CORS error"
- Verificar `CORS_ORIGIN` incluya la URL de Vercel
- Hacer redeploy después de cambiar variables

### Página en blanco
- Limpiar caché del navegador (Ctrl+Shift+Del)
- Verificar que frontend esté correctamente configurado
- Revisar console.log en DevTools (F12)

## 📊 Monitoreo

En Vercel puedes:
- Ver logs en tiempo real
- Monitorear rendimiento
- Ver análiticos
- Rollback a versiones anteriores

## 🔐 Seguridad

**IMPORTANTE:**
- Nunca compartir `JWT_SECRET`
- Usar HTTPS siempre (Vercel lo da gratis)
- Cambiar contraseña de BD regularmente
- Revisar logs de Aiven periódicamente

## 💰 Costos

- **Vercel**: Gratis hasta cierto uso
- **Aiven PostgreSQL**: Gratis con 300 créditos (suficiente 2-3 meses)
- **Total inicial**: $0

Cuando crezcas puedes pagar por más recursos.

## 🆘 Soporte Técnico

Si algo falla:
1. Revisar los logs de Vercel (Deployments → Build Logs)
2. Revisar los logs de Aiven
3. Revisar la consola del navegador (F12)
4. Preguntar en: https://vercel.com/support

---

**¡Felicidades! Tu sistema UNIDOS está en la nube! 🎉**
