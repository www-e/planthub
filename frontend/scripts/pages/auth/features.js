// Features section management
document.addEventListener('DOMContentLoaded', () => {
    const featuresSection = document.querySelector('.features-section');
    const featuresToggle = document.querySelector('.features-toggle');
    const featureItems = document.querySelectorAll('.feature-item');

    // Initialize mobile state
    if (window.innerWidth <= 768) {
        featuresSection.classList.add('collapsed');
    }

    // Simple Features Toggle
    const featuresHeader = document.querySelector('.features-header');

    // Add click event to header
    featuresHeader.addEventListener('click', () => {
        featuresSection.classList.toggle('expanded');
    });

    // Add touch event for mobile
    featuresHeader.addEventListener('touchend', (e) => {
        e.preventDefault();
        featuresSection.classList.toggle('expanded');
    });

    // Feature items touch functionality
    featureItems.forEach(item => {
        // Track touch start position
        let touchStartY = 0;
        let touchStartX = 0;

        item.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            item.classList.add('active');
        }, { passive: false });

        item.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touchY = e.touches[0].clientY;
            const touchX = e.touches[0].clientX;
            
            // Calculate distance moved
            const deltaY = Math.abs(touchY - touchStartY);
            const deltaX = Math.abs(touchX - touchStartX);
            
            // If user has moved finger more than 10px, cancel the touch
            if (deltaY > 10 || deltaX > 10) {
                item.classList.remove('active');
            }
        }, { passive: false });

        item.addEventListener('touchend', (e) => {
            e.preventDefault();
            item.classList.remove('active');
            
            // Only trigger click if finger hasn't moved significantly
            const touch = e.changedTouches[0];
            const deltaY = Math.abs(touch.clientY - touchStartY);
            const deltaX = Math.abs(touch.clientX - touchStartX);
            
            if (deltaY < 10 && deltaX < 10) {
                // Trigger the feature item action
                handleFeatureClick(item);
            }
        }, { passive: false });

        // Also handle regular clicks for non-touch devices
        item.addEventListener('click', (e) => {
            e.preventDefault();
            handleFeatureClick(item);
        });
    });

    function handleFeatureClick(item) {
        // Add visual feedback
        item.classList.add('clicked');
        
        // Get feature name from heading
        const featureName = item.querySelector('h4').textContent;
        
        // Show feedback (you can customize this)
        const feedback = document.createElement('div');
        feedback.className = 'feature-feedback';
        feedback.textContent = `${featureName} selected`;
        item.appendChild(feedback);
        
        // Remove feedback after animation
        setTimeout(() => {
            feedback.remove();
            item.classList.remove('clicked');
        }, 1000);
    }

    // Add intersection observer for feature items
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'feature-entrance 0.5s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '20px'
    });

    // Observe all feature items
    document.querySelectorAll('.feature-item').forEach(item => {
        observer.observe(item);
    });

    // Add ripple effect to feature items
    document.querySelectorAll('.feature-item').forEach(item => {
        item.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            
            this.appendChild(ripple);
            
            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    });

    // Add hover effect to icons
    document.querySelectorAll('.feature-item i').forEach(icon => {
        icon.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.2) rotate(10deg)';
            this.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        });

        icon.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Persist features section state
    if (localStorage.getItem('featuresExpanded') === 'true' && window.innerWidth <= 768) {
        featuresSection.classList.remove('collapsed');
    }

    // Add mouse tracking for glow effect
    document.querySelectorAll('.feature-item').forEach(item => {
        item.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            this.style.setProperty('--mouse-x', `${x}%`);
            this.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // Add scroll-triggered animations
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '50px'
    });

    document.querySelectorAll('.feature-item').forEach(item => {
        animateOnScroll.observe(item);
    });

    // Add focus states for accessibility
    document.querySelectorAll('.feature-item').forEach(item => {
        item.setAttribute('tabindex', '0');
        
        item.addEventListener('focus', function() {
            this.style.outline = 'none';
            this.style.boxShadow = `0 0 0 2px var(--primary-color)`;
        });

        item.addEventListener('blur', function() {
            this.style.boxShadow = '';
        });

        // Handle keyboard interaction
        item.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
});
