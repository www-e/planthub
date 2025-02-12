document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.auth-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;

        // Basic validation
        if (email && password) {
            // In a real app, you would validate credentials here
            const username = email.split('@')[0];
            localStorage.setItem('username', username);
            
            try {
                if (typeof window.siteConfig === 'undefined') {
                    console.error('Site configuration not loaded');
                    return;
                }
                // Redirect to home page using the configuration
                const homePath = 'frontend/pages/home/home.html';
                window.location.href = window.siteConfig.getPageUrl(homePath);
            } catch (error) {
                console.error('Navigation error:', error);
            }
        } else {
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = 'Please fill in all fields';
            this.appendChild(errorDiv);
            
            // Remove error message after 3 seconds
            setTimeout(() => {
                errorDiv.remove();
            }, 3000);
        }
    });
});
