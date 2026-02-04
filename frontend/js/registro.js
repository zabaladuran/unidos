// Configuración
const API_URL = 'http://localhost:5000/api';

// Registro
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const rol = document.getElementById('rol').value;
    const messageDiv = document.getElementById('message');
    
    // Validaciones
    if (password !== confirmPassword) {
        messageDiv.classList.add('error');
        messageDiv.textContent = 'Las contraseñas no coinciden';
        return;
    }
    
    if (password.length < 6) {
        messageDiv.classList.add('error');
        messageDiv.textContent = 'La contraseña debe tener al menos 6 caracteres';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, email, password, rol })
        });
        
        const data = await response.json();
        
        if (data.success) {
            messageDiv.classList.add('success');
            messageDiv.textContent = 'Registro exitoso, redirigiendo a login...';
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            messageDiv.classList.add('error');
            messageDiv.textContent = data.message || 'Error en registro';
        }
    } catch (error) {
        messageDiv.classList.add('error');
        messageDiv.textContent = 'Error de conexión: ' + error.message;
    }
});
