document.addEventListener('DOMContentLoaded', () => {
    // Password visibility toggle
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Form validation and submission
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            validateForm(this);
        });
    });

    // Input animation
    const inputs = document.querySelectorAll('.input-group input');
    inputs.forEach(input => {
        // Add focus animation
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            if (input.value.length > 0) {
                input.parentElement.classList.add('filled');
            } else {
                input.parentElement.classList.remove('filled');
            }
        });
    });

    // Initialize features list animations
    initializeFeaturesList();
    initializeMobileFormHandling();
});

// Form validation
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        removeError(input);
        
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
            return;
        }

        if (input.type === 'email' && !isValidEmail(input.value)) {
            showError(input, 'Please enter a valid email address');
            isValid = false;
            return;
        }

        if (input.type === 'password') {
            if (input.value.length < 8) {
                showError(input, 'Password must be at least 8 characters long');
                isValid = false;
                return;
            }
        }
    });

    // Check if passwords match in signup form
    if (form.closest('.signup-page')) {
        const password = form.querySelector('input[type="password"]');
        const confirmPassword = form.querySelectorAll('input[type="password"]')[1];
        
        if (password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Passwords do not match');
            isValid = false;
        }
    }

    if (isValid) {
        showSuccessAnimation(form);
    }
}

function showError(input, message) {
    const inputGroup = input.parentElement;
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    if (!inputGroup.querySelector('.error-message')) {
        inputGroup.appendChild(errorDiv);
    }
    
    inputGroup.classList.add('error');
    
    // Shake animation
    inputGroup.classList.add('shake');
    setTimeout(() => {
        inputGroup.classList.remove('shake');
    }, 500);
}

function removeError(input) {
    const inputGroup = input.parentElement;
    const errorMessage = inputGroup.querySelector('.error-message');
    
    if (errorMessage) {
        errorMessage.remove();
    }
    
    inputGroup.classList.remove('error');
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSuccessAnimation(form) {
    const submitButton = form.querySelector('.submit-btn');
    const originalText = submitButton.textContent;
    
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
    
    setTimeout(() => {
        submitButton.innerHTML = '<i class="fas fa-check"></i>';
        
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    }, 1500);
}

// Feature list animations with touch support
function initializeFeaturesList() {
    const featureItems = document.querySelectorAll('.features-list li');
    
    featureItems.forEach((item, index) => {
        // Add staggered animation delay
        item.style.animationDelay = `${(index + 1) * 0.1}s`;
        
        // Handle mouse events
        item.addEventListener('mouseenter', () => animateFeatureIcon(item, true));
        item.addEventListener('mouseleave', () => animateFeatureIcon(item, false));
        
        // Handle touch events
        item.addEventListener('touchstart', (e) => {
            e.preventDefault();
            animateFeatureIcon(item, true);
        });
        
        item.addEventListener('touchend', () => {
            animateFeatureIcon(item, false);
        });
    });
}

function animateFeatureIcon(item, active) {
    const icon = item.querySelector('i');
    if (active) {
        icon.style.transform = 'scale(1.2) rotate(5deg)';
        item.style.transform = 'translateX(10px)';
    } else {
        icon.style.transform = 'scale(1) rotate(0deg)';
        item.style.transform = 'translateX(0)';
    }
}

// Improve mobile form handling
function initializeMobileFormHandling() {
    const inputs = document.querySelectorAll('input');
    const form = document.querySelector('.auth-form');
    
    // Add visual feedback for touch devices
    inputs.forEach(input => {
        input.addEventListener('touchstart', () => {
            input.style.backgroundColor = 'rgba(46, 204, 113, 0.05)';
        });
        
        input.addEventListener('touchend', () => {
            input.style.backgroundColor = '';
        });
    });

    // Handle virtual keyboard
    if (window.innerWidth <= 768) {
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        });
    }
}
