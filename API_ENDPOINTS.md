# 📡 API REST - Documentación de Endpoints

## URL Base

- **Local**: `http://localhost:5000/api`
- **Producción**: `https://tu-proyecto.vercel.app/api`

---

## 🔐 Autenticación

### Registro de Usuario

**POST** `/auth/registro`

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "contraseña": "mi_contraseña_segura",
  "rol": "trabajador"
}
```

**Respuesta (201):**
```json
{
  "mensaje": "Usuario registrado exitosamente",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "trabajador"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

**POST** `/auth/login`

```json
{
  "email": "juan@example.com",
  "contraseña": "mi_contraseña_segura"
}
```

**Respuesta (200):**
```json
{
  "mensaje": "Sesión iniciada exitosamente",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "trabajador"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 📦 Paquetes

### Crear Paquete (Trabajador)

**POST** `/paquetes`

Headers:
```
Authorization: Bearer {token}
Content-Type: application/json
```

Body:
```json
{
  "cliente_id": 1,
  "descripcion": "Caja con electrónica",
  "precio": 150000,
  "tipo_pago": "contado",
  "observaciones": "Frágil - manejar con cuidado"
}
```

**Respuesta (201):**
```json
{
  "mensaje": "Paquete registrado exitosamente",
  "paquete": {
    "id": 5,
    "cliente_id": 1,
    "trabajador_id": 3,
    "descripcion": "Caja con electrónica",
    "precio": "150000.00",
    "tipo_pago": "contado",
    "estado": "pendiente",
    "fecha_registro": "2026-02-04T10:30:00.000Z"
  }
}
```

### Obtener Mis Paquetes (Trabajador)

**GET** `/paquetes/mis-paquetes`

Headers:
```
Authorization: Bearer {token}
```

Query Params (opcional):
```
?estado=pendiente
?estado=entregado
?estado=pagado
```

**Respuesta (200):**
```json
{
  "total": 5,
  "paquetes": [
    {
      "id": 5,
      "cliente_id": 1,
      "cliente_nombre": "Cliente A SAS",
      "cliente_telefono": "3001234567",
      "descripcion": "Caja con electrónica",
      "precio": "150000.00",
      "tipo_pago": "contado",
      "estado": "pendiente",
      "fecha_registro": "2026-02-04T10:30:00.000Z"
    }
  ]
}
```

### Obtener Todos los Paquetes (Admin/Jefe)

**GET** `/paquetes`

Headers:
```
Authorization: Bearer {token}
```

Query Params (opcional):
```
?trabajador_id=3
?estado=entregado
?fecha_inicio=2026-02-01
?fecha_fin=2026-02-04
```

**Respuesta (200):**
```json
{
  "total": 10,
  "paquetes": [...]
}
```

### Marcar Paquete como Entregado

**PATCH** `/paquetes/{id}/entregar`

Headers:
```
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "mensaje": "Paquete marcado como entregado",
  "paquete": {
    "id": 5,
    "estado": "entregado",
    "fecha_entrega": "2026-02-04T14:45:00.000Z"
  }
}
```

### Registrar Pago

**POST** `/paquetes/{id}/pagar`

Headers:
```
Authorization: Bearer {token}
Content-Type: application/json
```

Body:
```json
{
  "monto": 150000
}
```

**Respuesta (200):**
```json
{
  "mensaje": "Pago registrado exitosamente",
  "paquete": {
    "id": 5,
    "estado": "pagado",
    "fecha_pago": "2026-02-04T15:00:00.000Z"
  }
}
```

---

## 📊 Reportes

### Recaudos por Trabajador (Jefe)

**GET** `/reportes/recaudos-trabajador/{trabajador_id}`

Headers:
```
Authorization: Bearer {token}
```

Query Params (opcional):
```
?fecha_inicio=2026-02-01
?fecha_fin=2026-02-04
```

**Respuesta (200):**
```json
{
  "resumen": {
    "total_recaudado": "585000.00",
    "cantidad_paquetes": 4,
    "paquetes_pagados": 3,
    "paquetes_pendientes": 1,
    "pagos_contado": 2,
    "pagos_contraentrega": 1,
    "pagos_nequi": 1,
    "pagos_credito": 0
  },
  "detalleClientes": [
    {
      "id": 1,
      "nombre": "Cliente A SAS",
      "paquetes": 2,
      "monto_total": "235000.00",
      "monto_pagado": "150000.00",
      "monto_pendiente": "85000.00"
    }
  ]
}
```

### Pagos por Tipo

**GET** `/reportes/pagos-por-tipo`

Headers:
```
Authorization: Bearer {token}
```

Query Params (opcional):
```
?fecha_inicio=2026-02-01
?fecha_fin=2026-02-04
```

**Respuesta (200):**
```json
[
  {
    "tipo_pago": "contado",
    "cantidad": 2,
    "total": "250000.00",
    "promedio": "125000.00"
  },
  {
    "tipo_pago": "contraentrega",
    "cantidad": 1,
    "total": "85000.00",
    "promedio": "85000.00"
  },
  {
    "tipo_pago": "nequi",
    "cantidad": 1,
    "total": "250000.00",
    "promedio": "250000.00"
  }
]
```

### Recaudos Totales (Jefe/Admin)

**GET** `/reportes/recaudos-totales`

Headers:
```
Authorization: Bearer {token}
```

Query Params (opcional):
```
?fecha_inicio=2026-02-01
?fecha_fin=2026-02-04
```

**Respuesta (200):**
```json
[
  {
    "id": 3,
    "nombre": "Juan Trabajador",
    "total_paquetes": 4,
    "total_recaudado": "585000.00",
    "pagado": "435000.00",
    "pendiente": "150000.00"
  },
  {
    "id": 4,
    "nombre": "Pedro Trabajador",
    "total_paquetes": 2,
    "total_recaudado": "320000.00",
    "pagado": "320000.00",
    "pendiente": "0.00"
  }
]
```

---

## 🔑 Códigos de Error

| Código | Significado |
|--------|------------|
| 200 | OK - Exitoso |
| 201 | Created - Creado exitosamente |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token inválido/expirado |
| 403 | Forbidden - No tienes permiso |
| 404 | Not Found - Recurso no existe |
| 409 | Conflict - Email ya existe |
| 500 | Server Error - Error interno |

---

## 🧪 Pruebas con cURL

### Registro
```bash
curl -X POST http://localhost:5000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "email": "juan@example.com",
    "contraseña": "123456",
    "rol": "trabajador"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "contraseña": "123456"
  }'
```

### Obtener Paquetes
```bash
curl -X GET http://localhost:5000/api/paquetes/mis-paquetes \
  -H "Authorization: Bearer {tu_token}"
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

---

## 📝 Notas Importantes

- Todos los endpoints protegidos requieren `Authorization` header
- El formato es: `Authorization: Bearer {token}`
- Los tokens expiran en 30 días
- Guardar el token en `localStorage` en el navegador
- Cambiar `localhost:5000` por la URL de Vercel en producción

---

**Última actualización**: 2026-02-04
