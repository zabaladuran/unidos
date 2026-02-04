# API Documentation - UNIDOS

## Base URL
- **Development:** `http://localhost:5000/api`
- **Production:** `https://tu-backend.vercel.app/api`

## Autenticación
Todos los endpoints excepto `/auth` requieren un token JWT en el header:
```
Authorization: Bearer {token}
```

---

## 1. Autenticación

### Registro
```http
POST /auth?action=register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456",
  "rol": "trabajador"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "El email ya está registrado"
}
```

### Login
```http
POST /auth?action=login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "trabajador"
  }
}
```

---

## 2. Paquetes

### Listar Paquetes del Usuario
```http
GET /paquetes
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "id_usuario": 1,
    "cliente": "Carlos López",
    "telefono": "3001234567",
    "descripcion": "Electrónico - Teléfono Samsung",
    "precio": "450000.00",
    "metodo_pago": "contado",
    "direccion": "Cra 5 #10-20",
    "estado": "pagado",
    "created_at": "2024-02-04T10:30:00Z",
    "updated_at": "2024-02-04T11:00:00Z"
  }
]
```

### Crear Paquete
```http
POST /paquetes
Authorization: Bearer {token}
Content-Type: application/json

{
  "cliente": "María García",
  "telefono": "3009876543",
  "descripcion": "Documentos importantes",
  "precio": 25000,
  "metodoPago": "contraentrega",
  "direccion": "Cra 10 #5-15"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Paquete registrado",
  "id": 2
}
```

### Actualizar Estado de Paquete
```http
PUT /paquetes?id=1
Authorization: Bearer {token}
Content-Type: application/json

{
  "estado": "entregado"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Paquete actualizado"
}
```

**Estados válidos:**
- `pendiente` - Aún sin entregar
- `entregado` - Fue entregado
- `pagado` - Se recibió el pago

---

## 3. Pagos

### Listar Pagos del Usuario
```http
GET /pagos
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "id_paquete": 1,
    "monto": "450000.00",
    "metodo_pago": "contado",
    "estado": "pagado",
    "cliente": "Carlos López",
    "created_at": "2024-02-04T10:30:00Z"
  }
]
```

### Registrar Pago
```http
POST /pagos
Authorization: Bearer {token}
Content-Type: application/json

{
  "id_paquete": 1,
  "monto": 450000,
  "metodo_pago": "contado"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Pago registrado"
}
```

### Actualizar Estado de Pago
```http
PUT /pagos?id=1
Authorization: Bearer {token}
Content-Type: application/json

{
  "estado": "pagado"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Pago actualizado"
}
```

---

## 4. Reportes

### Generar Reporte
```http
GET /reportes?fecha_inicio=2024-01-01&fecha_fin=2024-02-04
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "fecha_inicio": "2024-01-01",
  "fecha_fin": "2024-02-04",
  "total_paquetes": 15,
  "total_ingresos": 3450000.00,
  "pendientes": 3,
  "entregados": 12,
  "por_cliente": [
    {
      "cliente": "Carlos López",
      "paquetes": 5,
      "total": 1200000.00,
      "pagado": true
    },
    {
      "cliente": "María García",
      "paquetes": 3,
      "total": 800000.00,
      "pagado": false
    }
  ]
}
```

---

## Códigos de Error

| Código | Mensaje | Causa |
|--------|---------|-------|
| 400 | Datos incompletos | Faltan campos requeridos |
| 401 | Token requerido | No se envió token |
| 401 | Token inválido | Token expirado o mal formado |
| 403 | No autorizado | Usuario no propietario del recurso |
| 404 | Endpoint no encontrado | Ruta no existe |
| 500 | Error en el servidor | Error interno |

---

## Ejemplos con cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth?action=login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@example.com","password":"123456"}'
```

### Listar Paquetes
```bash
curl -X GET http://localhost:5000/api/paquetes \
  -H "Authorization: Bearer {token}"
```

### Crear Paquete
```bash
curl -X POST http://localhost:5000/api/paquetes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "cliente":"Juan Pérez",
    "telefono":"3001234567",
    "descripcion":"Paquete de prueba",
    "precio":50000,
    "metodoPago":"contado",
    "direccion":"Cra 1 #2-3"
  }'
```

---

## Campos Permitidos

### Métodos de Pago
- `contado` - Pago inmediato
- `contraentrega` - Pago en entrega
- `credito` - Facturación posterior
- `pxp_nequi` - Pago digital Nequi

### Estados
- `pendiente` - Pendiente de entrega
- `entregado` - Ya fue entregado
- `pagado` - Pago confirmado

---

## Rate Limiting
No implementado en desarrollo. En producción: 100 requests/minuto por IP.

## Versionado
API v1.0 - Sin versionado actualmente

## Changelog
- **v1.0** (2024-02-04): Release inicial
