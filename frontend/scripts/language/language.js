// Language management
const languageManager = {
    init() {
        const savedLanguage = localStorage.getItem('language') || 'en';
        this.setLanguage(savedLanguage);
        
        const languageSwitch = document.querySelector('.language-switch');
        if (!languageSwitch) {
            // If language switch is not found, wait and try again
            setTimeout(() => this.init(), 100);
            return;
        }
        
        // Set initial text
        languageSwitch.textContent = savedLanguage === 'en' ? 'En' : 'Ar';
        
        // Add click handler with ripple effect
        languageSwitch.addEventListener('click', (e) => {
            this.createRipple(e);
            this.toggleLanguage();
        });
        
        // Add hover effects
        languageSwitch.addEventListener('mouseover', () => this.handleHover(true));
        languageSwitch.addEventListener('mouseout', () => this.handleHover(false));
        
        // Set initial state
        if (savedLanguage === 'ar') {
            languageSwitch.classList.add('ar');
        }
    },

    createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - rect.left - size/2}px`;
        ripple.style.top = `${event.clientY - rect.top - size/2}px`;
        
        button.appendChild(ripple);
        
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    },
    
    handleHover(isHovering) {
        const languageSwitch = document.querySelector('.language-switch');
        if (isHovering) {
            languageSwitch.style.transform = 'scale(1.05)';
        } else {
            languageSwitch.style.transform = 'scale(1)';
        }
    },
    
    setLanguage(lang) {
        // Update HTML attributes
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        
        // Update language switch text
        const languageSwitch = document.querySelector('.language-switch');
        if (languageSwitch) {
            languageSwitch.textContent = lang === 'en' ? 'En' : 'Ar';
        }
        
        // Save to localStorage
        localStorage.setItem('language', lang);
        
        // Add smooth transition class
        document.documentElement.classList.add('language-transition');
        setTimeout(() => {
            document.documentElement.classList.remove('language-transition');
        }, 400);
        
        // Update translations
        this.updateTranslations(lang);
    },
    
    updateTranslations(lang) {
        const currentPage = this.getCurrentPage();
        const pageTranslations = translations[lang][currentPage];
        
        if (!pageTranslations) return;
        
        // Update page title
        document.title = pageTranslations.title;
        
        // Update all translatable elements
        Object.keys(pageTranslations).forEach(key => {
            if (key === 'title') return;
            
            const elements = document.querySelectorAll(`[data-translate="${key}"]`);
            elements.forEach(element => {
                if (element.tagName === 'INPUT') {
                    element.placeholder = pageTranslations[key];
                } else {
                    element.textContent = pageTranslations[key];
                }
            });
        });
    },
    
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('signin')) return 'signin';
        if (path.includes('signup')) return 'signup';
        if (path.includes('forgot-password')) return 'forgotPassword';
        return 'signin'; // Default
    },
    
    toggleLanguage() {
        const currentLanguage = document.documentElement.getAttribute('lang');
        const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';
        
        // Add rotation animation
        const languageSwitch = document.querySelector('.language-switch');
        languageSwitch.style.transform = `rotate(${currentLanguage === 'en' ? 180 : 0}deg)`;
        
        // Update language with transition
        this.setLanguage(newLanguage);
        
        // Toggle switch appearance with animation
        languageSwitch.classList.toggle('ar');
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    languageManager.init();
    
    // Add language transition styles
    const style = document.createElement('style');
    style.textContent = `
        .language-transition * {
            transition: transform 0.3s ease, margin 0.3s ease, padding 0.3s ease !important;
        }
    `;
    document.head.appendChild(style);
}); 