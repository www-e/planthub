document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.querySelector('input[type="email"]').value;
        const password = document.querySelector('input[type="password"]').value;

        // Check credentials (replace with actual authentication later)
        if (email === 'omar@omar' && password === 'omar') {
            const username = email.split('@')[0]; // Gets 'omar' from 'omar'
            localStorage.setItem('username', username);
            
            // Redirect to home page
            window.location.href = '/frontend/pages/home/home.html';
        } else {
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = 'Invalid email or password';
            
            // Remove any existing error message
            const existingError = document.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            // Insert error message after the form
            form.parentNode.insertBefore(errorDiv, form.nextSibling);
        }
    });
});
