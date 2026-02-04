# 🗄️ Configurar MySQL en Aiven

## ¿Qué es Aiven?

Aiven es una plataforma de bases de datos en la nube que ofrece servicio gratuito para nuevas cuentas (300 créditos).

## 📋 Pasos para Crear MySQL en Aiven

### 1. Registrarse en Aiven

1. Ir a https://aiven.io
2. Click en "Sign Up"
3. Completar registro con:
   - Email
   - Contraseña
   - Información personal
4. Verificar email
5. Login en tu cuenta

### 2. Crear Servicio MySQL

1. Click en **"Create a new service"** o ir a Dashboard
2. Seleccionar **"MySQL"** de la lista
3. Configurar:
   - **Service Name**: `unidos-mysql` (o el que prefieras)
   - **Cloud Provider**: AWS (o el que prefieras)
   - **Region**: Selecciona cercano a ti (ej: South America)
   - **Plan**: Seleccionar el plan **gratis** o más economico
   - **MySQL Version**: La versión más reciente (ej: 8.0)
4. Click en **"Create service"**

### 3. Obtener Credenciales de Conexión

Una vez creado el servicio (espera 5 minutos):

1. Ve a tu servicio MySQL
2. Ir a la sección **"Overview"**
3. Buscar **"Connection information"** o **"Connection String"**
4. Copiar la URL en formato MySQL

Debería verse así:
```
mysql://avnadmin:xxxxxxxxxxxx@mysql-host.aivencloud.com:3306/defaultdb?ssl-mode=REQUIRED
```

### 4. Configurar el Archivo .env Local

Edita el archivo `.env` en la raíz del proyecto:

```env
# Para Aiven MySQL
DB_HOST=mysql-host.aivencloud.com
DB_PORT=3306
DB_USER=avnadmin
DB_PASSWORD=tu_password_aqui
DB_NAME=defaultdb

# O usar el formato URL
# DATABASE_URL=mysql://avnadmin:password@host:3306/defaultdb

# Otros
JWT_SECRET=tu_clave_super_secreta_minimo_32_caracteres
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000,http://localhost:5000
```

## 🔧 Primeros Pasos

### 1. Instalar Dependencias

```bash
npm install
```

Verifica que `mysql2` esté instalado:
```bash
npm list mysql2
```

### 2. Inicializar Base de Datos

Desde la carpeta raíz del proyecto:

```bash
npm run seed
```

Este comando:
- ✅ Crea las tablas necesarias
- ✅ Inserta usuarios de prueba
- ✅ Inserta clientes de ejemplo
- ✅ Inserta paquetes de prueba

Deberías ver:
```
✅ Base de datos MySQL inicializada correctamente con datos de prueba

📋 Usuarios de prueba:
├─ Admin: admin@unidos.com / admin123
├─ Jefe: jefe@unidos.com / jefe123
├─ Trabajador 1: juan@unidos.com / juan123
└─ Trabajador 2: pedro@unidos.com / pedro123
```

### 3. Iniciar Servidor

```bash
npm run dev
```

Deberías ver:
```
🚀 Servidor ejecutándose en puerto 5000
📦 UNIDOS - Sistema de Gestión de Paquetería
🔗 API: http://localhost:5000/api
📊 Health: http://localhost:5000/api/health
```

### 4. Probar API

En otra terminal:
```bash
curl http://localhost:5000/api/health
```

Respuesta esperada:
```json
{"status":"OK","timestamp":"2026-02-04T10:30:00.000Z"}
```

## 📊 Administrar MySQL en Aiven

### Acceder a phpMyAdmin o MySQL Workbench

1. En Aiven Dashboard, busca **"Connection Information"**
2. Copia **"JDBC URL"** o los datos de conexión
3. Usa una herramienta como:
   - **phpMyAdmin** (web)
   - **MySQL Workbench** (desktop)
   - **DBeaver** (desktop)
   - **VS Code Extension**: MySQL

### Exportar/Importar Datos

**Exportar backup:**
```bash
mysqldump -h host -u user -p database > backup.sql
```

**Importar datos:**
```bash
mysql -h host -u user -p database < backup.sql
```

## 🚀 Deploy a Vercel con Aiven MySQL

### 1. Actualizar Variables en Vercel

En tu proyecto Vercel, agregar estas variables de entorno:

```
DB_HOST=mysql-host.aivencloud.com
DB_PORT=3306
DB_USER=avnadmin
DB_PASSWORD=xxxxx
DB_NAME=defaultdb
JWT_SECRET=tu_clave_secreta
NODE_ENV=production
```

O usar DATABASE_URL:
```
DATABASE_URL=mysql://avnadmin:password@host:3306/defaultdb?ssl-mode=REQUIRED
```

### 2. Redeploy

```bash
git push origin main
```

Vercel automáticamente iniciará el redeploy.

## ⚠️ Problemas Comunes

### Error: "connect ECONNREFUSED"
- Verifica que DB_HOST y credenciales sean correctas
- Asegurate de estar conectado a internet
- En Aiven, permite IPs en la sección de seguridad

### Error: "SSL connection error"
- MySQL en Aiven requiere SSL
- El driver `mysql2` lo soporta automáticamente
- Si falla, agrega `?ssl-mode=REQUIRED` a la URL

### Error: "Access denied for user 'avnadmin'"
- Verifica la contraseña en Aiven
- Las contraseñas especiales pueden causar problemas, cópialas completas

### Error: "Unknown database"
- Asegurate que el nombre de la BD sea `defaultdb` (por defecto en Aiven)
- Si creaste otra, usa ese nombre en .env

## 💡 Tips Importantes

1. **Backup regular**: Exporta datos regularmente
2. **Cambiar contraseña**: Desde Aiven Dashboard
3. **Monitorear uso**: Aiven te muestra el uso de créditos
4. **Connection pooling**: `mysql2` ya lo incluye
5. **SSL**: Siempre usar SSL en producción (Aiven lo requiere)

## 🔗 Enlaces Útiles

- Aiven Dashboard: https://console.aiven.io
- MySQL Documentation: https://dev.mysql.com/doc/
- MySQL Workbench: https://www.mysql.com/products/workbench/

---

¡Listo! Ahora tienes MySQL en la nube. 🎉
