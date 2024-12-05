// Theme management
const themeManager = {
    init() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        const themeSwitch = document.querySelector('.theme-switch');
        if (themeSwitch) {
            // Add click handler with ripple effect
            themeSwitch.addEventListener('click', (e) => {
                this.createRipple(e);
                this.toggleTheme();
            });
            
            // Add hover effects
            themeSwitch.addEventListener('mouseover', () => this.handleHover(true));
            themeSwitch.addEventListener('mouseout', () => this.handleHover(false));
            
            // Set initial state
            if (savedTheme === 'dark') {
                themeSwitch.classList.add('dark');
            }
        }
        
        // Initialize animations
        this.initializeStars();
        this.initializeClouds();
    },
    
    createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - radius;
        const y = event.clientY - rect.top - radius;

        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        // Remove existing ripples
        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }

        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => ripple.remove(), 600);
    },
    
    handleHover(isHovering) {
        const themeSwitch = document.querySelector('.theme-switch');
        if (isHovering) {
            // Add hover effects
            themeSwitch.style.transform = 'scale(1.05)';
            this.pulseIcon();
        } else {
            // Remove hover effects
            themeSwitch.style.transform = 'scale(1)';
        }
    },
    
    pulseIcon() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const icon = currentTheme === 'light' ? 
            document.querySelector('.sun-icon') : 
            document.querySelector('.moon-icon');
            
        if (icon) {
            icon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                icon.style.transform = '';
            }, 200);
        }
    },
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Add smooth transition class
        document.documentElement.classList.add('theme-transition');
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 400);
    },
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Add rotation animation
        const themeSwitch = document.querySelector('.theme-switch');
        themeSwitch.style.transform = `rotate(${currentTheme === 'light' ? 180 : 0}deg)`;
        
        // Update theme with transition
        this.setTheme(newTheme);
        
        // Toggle switch appearance with animation
        themeSwitch.classList.toggle('dark');
        
        // Reinitialize animations
        setTimeout(() => {
            this.initializeStars();
            this.initializeClouds();
        }, 200);
    },
    
    initializeStars() {
        const starsContainer = document.querySelector('.stars');
        if (!starsContainer) return;
        
        // Clear existing stars
        starsContainer.innerHTML = '';
        
        // More stars in light theme
        const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
        const baseStars = window.innerWidth < 768 ? 40 : 70;
        const numberOfStars = isLightTheme ? baseStars * 1.5 : baseStars;
        
        for (let i = 0; i < numberOfStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Position
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            
            // Size (smaller on mobile)
            const maxSize = window.innerWidth < 768 ? 2 : 3;
            const size = 1 + Math.random() * maxSize;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // Animation
            star.style.animationDuration = `${2 + Math.random() * 3}s`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            
            // Slightly different opacity ranges for light/dark themes
            const minOpacity = isLightTheme ? 0.3 : 0.1;
            const maxOpacity = isLightTheme ? 1 : 0.8;
            star.style.setProperty('--max-opacity', maxOpacity);
            star.style.setProperty('--min-opacity', minOpacity);
            
            starsContainer.appendChild(star);
        }
    },
    
    initializeClouds() {
        const clouds = document.querySelectorAll('.cloud');
        const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
        
        clouds.forEach((cloud, index) => {
            // Randomize cloud sizes with larger ranges
            const baseWidth = 100 + Math.random() * 60;
            const width = window.innerWidth < 768 ? baseWidth * 0.8 : baseWidth;
            cloud.style.width = `${width}px`;
            
            // Adjust height proportionally
            const height = width * 0.35;
            cloud.style.height = `${height}px`;
            
            // Calculate animation duration based on size
            const baseDuration = 20 + (width / 10);
            const duration = baseDuration + (index * 2);
            cloud.style.animationDuration = `${duration}s`;
            
            // Set different delays for more natural movement
            const delay = Math.random() * -duration;
            cloud.style.animationDelay = `${delay}s`;
            
            // Adjust opacity and blur based on theme
            if (isLightTheme) {
                const baseOpacity = 0.85 + Math.random() * 0.1;
                cloud.style.opacity = baseOpacity;
                cloud.style.filter = `blur(${3 + Math.random() * 2}px)`;
            } else {
                const baseOpacity = 0.6 + Math.random() * 0.1;
                cloud.style.opacity = baseOpacity;
                cloud.style.filter = `blur(${2 + Math.random() * 2}px)`;
            }
            
            // Add subtle transform for more natural appearance
            const rotate = -5 + Math.random() * 10;
            cloud.style.transform = `rotate(${rotate}deg)`;
        });
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    themeManager.init();
    
    // Add theme transition styles
    const style = document.createElement('style');
    style.textContent = `
        .theme-transition * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
        }
    `;
    document.head.appendChild(style);
    
    // Reinitialize on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            themeManager.initializeStars();
            themeManager.initializeClouds();
        }, 250);
    });
});
