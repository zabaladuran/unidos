// Configuración
const API_URL = 'http://localhost:5000/api'; // Cambiar según entorno

// Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Guardar token
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            
            // Redirigir
            messageDiv.classList.add('success');
            messageDiv.textContent = 'Login exitoso, redirigiendo...';
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            messageDiv.classList.add('error');
            messageDiv.textContent = data.message || 'Error en login';
        }
    } catch (error) {
        messageDiv.classList.add('error');
        messageDiv.textContent = 'Error de conexión: ' + error.message;
    }
});
