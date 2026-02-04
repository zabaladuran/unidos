# UNIDOS - Carpeta SRC

## ✅ Estructura dentro de SRC

```
SRC/
├── index.html              (PÁGINA PRINCIPAL - AQUÍ EMPEZAR)
├── frontend/
│   ├── login.html
│   ├── registro.html
│   ├── dashboard.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── login.js
│   │   ├── registro.js
│   │   └── dashboard.js
│   └── vercel.json
├── backend/
│   ├── index.php
│   ├── setup.php
│   ├── .env
│   ├── config/
│   ├── middleware/
│   ├── api/
│   └── database/
└── README.md
```

## 🚀 Cómo usar

### Para desarrollo local:
```bash
# Backend
cd SRC/backend
php -S localhost:5000

# Frontend (otra terminal)
cd SRC
# Abre index.html en navegador
```

### Para Vercel:
- **Frontend:** Root directory = `SRC`
- **Backend:** Root directory = `SRC/backend`

## 📄 Archivo Principal
Abre `SRC/index.html` para empezar
