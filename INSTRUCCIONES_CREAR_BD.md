# 🗄️ Crear Tablas y Usuario Admin en MySQL Aiven

## 📋 Datos de Tu MySQL Aiven

```
Host: mysql-9adc554-calculadora-imc.g.aivencloud.com
Puerto: 12731
Usuario: avnadmin
Contraseña: AVfS_3ZYFyJhrvSGTHdZ-1U
Base de datos: defaultdb
SSL: REQUIRED
```

---

## 🚀 Opción 1: Usar phpMyAdmin (Más Fácil)

### Paso 1: Acceder a Aiven
1. Ve a https://console.aiven.io
2. Login con tu cuenta
3. Busca tu servicio MySQL: `mysql-9adc554`
4. Click en **"WebUI"** o **"MySQL Admin"**

### Paso 2: Ejecutar Script SQL

1. En phpMyAdmin, ve a la pestaña **"SQL"**
2. Copia todo el contenido de `script-crear-tablas-usuarios.sql`
3. Pégalo en la ventana SQL
4. Click en **"Go"** o **"Ejecutar"**

Deberías ver:
```
✓ Tabla usuarios creada
✓ Tabla clientes creada
✓ Tabla paquetes creada
✓ Tabla pagos creada
✓ Tabla recaudos creada
✓ Usuarios insertados
```

---

## 🖥️ Opción 2: Usar MySQL Workbench (Desktop)

### Paso 1: Descargar MySQL Workbench
- Ir a https://www.mysql.com/products/workbench/
- Descargar versión para tu SO (Windows/Mac/Linux)
- Instalar

### Paso 2: Crear Nueva Conexión

1. Abrir MySQL Workbench
2. Click en **"Database"** → **"Manage Connections"**
3. Click en **"New"**
4. Llenar datos:
   - **Connection Name**: `unidos-aiven`
   - **Hostname**: `mysql-9adc554-calculadora-imc.g.aivencloud.com`
   - **Port**: `12731`
   - **Username**: `avnadmin`
   - **Password**: `AVfS_3ZYFyJhrvSGTHdZ-1U`
   - **Default Schema**: `defaultdb`
5. Click en **"Test Connection"**
6. Si funciona, click en **"OK"**

### Paso 3: Ejecutar Script

1. Click en tu nueva conexión
2. Se abre un editor SQL
3. Ir a **"File"** → **"Open SQL Script"**
4. Seleccionar `script-crear-tablas-usuarios.sql`
5. Click en ▶ (ejecutar) o **Ctrl+Shift+Enter**

---

## 📱 Opción 3: Usar Línea de Comandos

Si tienes MySQL Client instalado:

```bash
# En tu terminal
mysql -h mysql-9adc554-calculadora-imc.g.aivencloud.com \
  -P 12731 \
  -u avnadmin \
  -p "AVfS_3ZYFyJhrvSGTHdZ-1U" \
  --ssl-mode=REQUIRED \
  defaultdb < script-crear-tablas-usuarios.sql
```

O copiar y pegar el script línea por línea.

---

## ✅ Verificar que Funciona

### En phpMyAdmin o Workbench:

```sql
USE defaultdb;
SELECT * FROM usuarios;
```

Deberías ver:

| id | nombre | email | rol |
|---|---|---|---|
| 1 | Administrador Sistema | admin@unidos.com | admin |
| 2 | Carlos Jefe | jefe@unidos.com | jefe |
| 3 | Juan Trabajador | juan@unidos.com | trabajador |
| 4 | Pedro Trabajador | pedro@unidos.com | trabajador |

---

## 🔑 Credenciales para Usar en la App

### Admin
```
Email: admin@unidos.com
Contraseña: admin123
```

### Jefe
```
Email: jefe@unidos.com
Contraseña: jefe123
```

### Trabajador 1
```
Email: juan@unidos.com
Contraseña: juan123
```

### Trabajador 2
```
Email: pedro@unidos.com
Contraseña: pedro123
```

---

## 🧪 Probar la API

Una vez que tengas el backend corriendo:

```bash
# Registrarse (si aún no existe)
curl -X POST http://localhost:5000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "email": "test@example.com",
    "contraseña": "test123",
    "rol": "trabajador"
  }'

# Login con admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@unidos.com",
    "contraseña": "admin123"
  }'
```

---

## ⚠️ Problemas Comunes

### Error: "SSL connection error"
- Aiven requiere SSL (ya configurado en el script)
- Asegúrate de incluir `--ssl-mode=REQUIRED`

### Error: "Access denied"
- Verifica que la contraseña sea exacta
- Ten cuidado con mayúsculas/minúsculas

### Error: "Can't connect"
- Verifica hostname: `mysql-9adc554-calculadora-imc.g.aivencloud.com`
- Verifica puerto: `12731`
- Verifica conexión a internet

### Las tablas no se crean
- Ejecuta el script en `defaultdb`, no en otra BD
- Si hay error de sintaxis, ejecuta línea por línea

---

## 🎉 ¡Listo!

Ya tienes:
- ✅ 5 tablas creadas
- ✅ 4 usuarios de prueba
- ✅ BD lista para usar

Ahora puedes:
1. Ejecutar `npm install`
2. Ejecutar `npm run dev`
3. Acceder a `http://localhost:5000/api/health`
4. Login en `SRC/frontend/login.html`

¡Éxito! 🚀
