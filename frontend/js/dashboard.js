// Configuración
const API_URL = 'http://localhost:5000/api';

// Variables globales
let usuarioActual = null;
let paquetes = [];
let pagos = [];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    cargarDatos();
    configurarEventos();
    actualizarFecha();
    setInterval(actualizarFecha, 60000); // Actualizar cada minuto
});

// Verificar autenticación
function verificarAutenticacion() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    usuarioActual = JSON.parse(localStorage.getItem('usuario'));
    document.getElementById('userName').textContent = `Hola, ${usuarioActual.nombre}`;
}

// Cargar datos
async function cargarDatos() {
    try {
        const token = localStorage.getItem('token');
        
        // Cargar paquetes
        const resPaquetes = await fetch(`${API_URL}/paquetes`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (resPaquetes.ok) {
            paquetes = await resPaquetes.json();
            actualizarTablaPaquetes();
            actualizarEstadisticas();
        }
        
        // Cargar pagos
        const resPagos = await fetch(`${API_URL}/pagos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (resPagos.ok) {
            pagos = await resPagos.json();
            actualizarTablaPagos();
        }
    } catch (error) {
        console.error('Error cargando datos:', error);
    }
}

// Configurar eventos
function configurarEventos() {
    // Formulario de paquete
    document.getElementById('formPaquete')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const datos = {
            cliente: document.getElementById('cliente').value,
            telefono: document.getElementById('telefono').value,
            descripcion: document.getElementById('descripcion').value,
            precio: parseFloat(document.getElementById('precio').value),
            metodoPago: document.getElementById('metodoPago').value,
            direccion: document.getElementById('direccion').value
        };
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/paquetes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(datos)
            });
            
            if (response.ok) {
                alert('Paquete registrado exitosamente');
                document.getElementById('formPaquete').reset();
                cargarDatos();
            } else {
                alert('Error registrando paquete');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
    
    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = 'login.html';
    });
    
    // Filtros de paquetes
    document.getElementById('filtroCliente')?.addEventListener('input', filtrarPaquetes);
    document.getElementById('filtroEstado')?.addEventListener('change', filtrarPaquetes);
}

// Mostrar sección
function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    event.target?.classList.add('active');
}

// Actualizar tabla de paquetes
function actualizarTablaPaquetes() {
    const tbody = document.querySelector('#tablaPaquetes tbody');
    if (!tbody) return;
    
    tbody.innerHTML = paquetes.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.cliente}</td>
            <td>${p.descripcion}</td>
            <td>$${parseFloat(p.precio).toFixed(2)}</td>
            <td>
                <span class="badge badge-${p.metodo_pago}">
                    ${formatoMetodoPago(p.metodo_pago)}
                </span>
            </td>
            <td>
                <span class="badge badge-${p.estado}">
                    ${formatoEstado(p.estado)}
                </span>
            </td>
            <td>
                <button class="btn btn-warning" onclick="editarPaquete(${p.id})">Editar</button>
                <button class="btn btn-success" onclick="marcarEntregado(${p.id})">Entregado</button>
            </td>
        </tr>
    `).join('');
}

// Actualizar tabla de pagos
function actualizarTablaPagos() {
    const tbody = document.querySelector('#tablaPagos tbody');
    if (!tbody) return;
    
    tbody.innerHTML = pagos.map(p => `
        <tr>
            <td>${p.id_paquete}</td>
            <td>${p.cliente}</td>
            <td>$${parseFloat(p.monto).toFixed(2)}</td>
            <td>${formatoMetodoPago(p.metodo_pago)}</td>
            <td>
                <span class="badge badge-${p.estado}">
                    ${formatoEstado(p.estado)}
                </span>
            </td>
            <td>
                ${p.estado !== 'pagado' ? `
                    <button class="btn btn-secondary" onclick="marcarPagado(${p.id})">Marcar Pagado</button>
                ` : 'Completado'}
            </td>
        </tr>
    `).join('');
}

// Actualizar estadísticas
function actualizarEstadisticas() {
    const hoy = new Date().toISOString().split('T')[0];
    
    const paquetesHoy = paquetes.filter(p => p.fecha === hoy).length;
    const recaudosHoy = paquetes
        .filter(p => p.fecha === hoy && p.estado === 'pagado')
        .reduce((sum, p) => sum + parseFloat(p.precio), 0);
    
    const mesActual = new Date().getMonth() + 1;
    const añoActual = new Date().getFullYear();
    const totalMes = paquetes
        .filter(p => {
            const fecha = new Date(p.fecha);
            return fecha.getMonth() + 1 === mesActual && fecha.getFullYear() === añoActual && p.estado === 'pagado';
        })
        .reduce((sum, p) => sum + parseFloat(p.precio), 0);
    
    const pendientes = paquetes.filter(p => p.estado === 'pendiente').length;
    
    document.getElementById('paquetesHoy').textContent = paquetesHoy;
    document.getElementById('recaudosHoy').textContent = `$${recaudosHoy.toFixed(2)}`;
    document.getElementById('totalMes').textContent = `$${totalMes.toFixed(2)}`;
    document.getElementById('pendientes').textContent = pendientes;
}

// Filtrar paquetes
function filtrarPaquetes() {
    const cliente = document.getElementById('filtroCliente').value.toLowerCase();
    const estado = document.getElementById('filtroEstado').value;
    
    const filtrados = paquetes.filter(p => {
        return p.cliente.toLowerCase().includes(cliente) && 
               (!estado || p.estado === estado);
    });
    
    const tbody = document.querySelector('#tablaPaquetes tbody');
    tbody.innerHTML = filtrados.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.cliente}</td>
            <td>${p.descripcion}</td>
            <td>$${parseFloat(p.precio).toFixed(2)}</td>
            <td>${formatoMetodoPago(p.metodo_pago)}</td>
            <td>
                <span class="badge badge-${p.estado}">
                    ${formatoEstado(p.estado)}
                </span>
            </td>
            <td>
                <button class="btn btn-warning" onclick="editarPaquete(${p.id})">Editar</button>
                <button class="btn btn-success" onclick="marcarEntregado(${p.id})">Entregado</button>
            </td>
        </tr>
    `).join('');
}

// Generar reporte
async function generarReporte() {
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    
    if (!fechaInicio || !fechaFin) {
        alert('Selecciona ambas fechas');
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${API_URL}/reportes?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        
        if (response.ok) {
            const reporte = await response.json();
            mostrarReporte(reporte);
        }
    } catch (error) {
        console.error('Error generando reporte:', error);
    }
}

// Mostrar reporte
function mostrarReporte(reporte) {
    const contenido = document.getElementById('reporteContenido');
    
    let html = `
        <h3>Reporte de ${reporte.fecha_inicio} a ${reporte.fecha_fin}</h3>
        <div style="margin-top: 20px;">
            <h4>Resumen:</h4>
            <ul>
                <li>Total Paquetes: ${reporte.total_paquetes}</li>
                <li>Total Ingresos: $${reporte.total_ingresos.toFixed(2)}</li>
                <li>Paquetes Pendientes: ${reporte.pendientes}</li>
                <li>Paquetes Entregados: ${reporte.entregados}</li>
            </ul>
        </div>
        
        <h4 style="margin-top: 30px;">Por Cliente:</h4>
        <table class="table" style="margin-top: 10px;">
            <thead>
                <tr>
                    <th>Cliente</th>
                    <th>Paquetes</th>
                    <th>Total</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    reporte.por_cliente.forEach(cliente => {
        html += `
            <tr>
                <td>${cliente.nombre}</td>
                <td>${cliente.paquetes}</td>
                <td>$${cliente.total.toFixed(2)}</td>
                <td>${cliente.pagado ? 'Pagado' : 'Pendiente'}</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
        <button class="btn btn-primary" onclick="imprimirReporte()" style="margin-top: 20px;">Imprimir</button>
    `;
    
    contenido.innerHTML = html;
}

// Funciones auxiliares
function formatoMetodoPago(metodo) {
    const mapping = {
        'contado': 'Contado',
        'contraentrega': 'Contraentrega',
        'credito': 'Crédito',
        'pxp_nequi': 'PXP Nequi'
    };
    return mapping[metodo] || metodo;
}

function formatoEstado(estado) {
    const mapping = {
        'pendiente': 'Pendiente',
        'entregado': 'Entregado',
        'pagado': 'Pagado'
    };
    return mapping[estado] || estado;
}

function actualizarFecha() {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fecha = new Date().toLocaleDateString('es-ES', opciones);
    const elemento = document.querySelector('#fecha');
    if (elemento) elemento.textContent = fecha;
}

async function marcarEntregado(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/paquetes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ estado: 'entregado' })
        });
        
        if (response.ok) {
            cargarDatos();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function marcarPagado(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/pagos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ estado: 'pagado' })
        });
        
        if (response.ok) {
            cargarDatos();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function imprimirReporte() {
    window.print();
}
