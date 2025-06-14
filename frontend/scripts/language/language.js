// Language management
window.languageManager = {
    init() {
        const savedLanguage = localStorage.getItem('language') || 'en';
        this.setLanguage(savedLanguage);
        
        // Initialize all language switch buttons
        this.initMainLanguageSwitch();
        this.initDropdownLanguageSwitch();
        this.initDrawerLanguageSwitch();
    },
    
    initMainLanguageSwitch() {
        const languageSwitch = document.querySelector('.language-switch');
        if (!languageSwitch) {
            // If language switch is not found, wait and try again
            setTimeout(() => this.initMainLanguageSwitch(), 100);
            return;
        }
        
        const savedLanguage = localStorage.getItem('language') || 'en';
        
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
    
    initDropdownLanguageSwitch() {
        const dropdownLanguageSwitch = document.querySelector('.dropdown-language-switch');
        if (!dropdownLanguageSwitch) {
            // If not found, wait and try again (for async loading)
            setTimeout(() => this.initDropdownLanguageSwitch(), 100);
            return;
        }
        
        // Remove any existing event listeners
        const newDropdown = dropdownLanguageSwitch.cloneNode(true);
        dropdownLanguageSwitch.parentNode.replaceChild(newDropdown, dropdownLanguageSwitch);
        
        // Add click handler
        newDropdown.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleLanguage();
        });
        
        console.log('Dropdown language switch initialized');
    },
    
    initDrawerLanguageSwitch() {
        const drawerLanguageSwitch = document.querySelector('.drawer-language-switch');
        if (!drawerLanguageSwitch) {
            // If not found, wait and try again (for async loading)
            setTimeout(() => this.initDrawerLanguageSwitch(), 100);
            return;
        }
        
        // Remove any existing event listeners
        const newDrawer = drawerLanguageSwitch.cloneNode(true);
        drawerLanguageSwitch.parentNode.replaceChild(newDrawer, drawerLanguageSwitch);
        
        // Add click handler
        newDrawer.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleLanguage();
            
            // Close the drawer after language change
            const drawer = document.querySelector('.mobile-drawer');
            const overlay = document.querySelector('.drawer-overlay');
            if (drawer && overlay) {
                drawer.classList.remove('open');
                overlay.classList.remove('visible');
            }
        });
        
        console.log('Drawer language switch initialized');
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
        // Update HTML attributes for language only, not direction
        document.documentElement.setAttribute('lang', lang);
        // We're not changing direction anymore as per user request
        // document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        
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
        console.log('Updating translations for the entire page to:', lang);
        
        if (!translations || !translations[lang]) {
            console.error(`No translations found for language: ${lang}`);
            return;
        }
        
        const currentPage = this.getCurrentPage();
        console.log('Current page detected as:', currentPage);
        
        const pageTranslations = translations[lang][currentPage];
        const commonTranslations = translations[lang].common;
        
        if (!pageTranslations && !commonTranslations) {
            console.error('No translations found for this page or common elements');
            return;
        }
        
        // Update page title if available
        if (pageTranslations && pageTranslations.title) {
            document.title = pageTranslations.title;
        }
        
        // First apply common translations to all pages
        if (commonTranslations) {
            console.log('Applying common translations');
            Object.keys(commonTranslations).forEach(key => {
                if (key === 'title') return;
                
                const elements = document.querySelectorAll(`[data-translate="${key}"]`);
                console.log(`Found ${elements.length} elements for key: ${key}`);
                elements.forEach(element => {
                    if (element.tagName === 'INPUT') {
                        element.placeholder = commonTranslations[key];
                    } else {
                        element.textContent = commonTranslations[key];
                    }
                });
            });
        }
        
        // Then apply page-specific translations (these will override common translations if there's a conflict)
        if (pageTranslations) {
            console.log('Applying page-specific translations');
            Object.keys(pageTranslations).forEach(key => {
                if (key === 'title') return;
                
                const elements = document.querySelectorAll(`[data-translate="${key}"]`);
                console.log(`Found ${elements.length} elements for key: ${key}`);
                elements.forEach(element => {
                    if (element.tagName === 'INPUT') {
                        element.placeholder = pageTranslations[key];
                    } else {
                        element.textContent = pageTranslations[key];
                    }
                });
            });
        }
        
        // Also update appbar and drawer components if they exist
        this.updateComponentTranslations(lang, 'app-bar-placeholder');
        this.updateComponentTranslations(lang, 'drawer-placeholder');
    },
    
    getCurrentPage() {
        const path = window.location.pathname;
        // Auth pages
        if (path.includes('signin')) return 'signin';
        if (path.includes('signup')) return 'signup';
        if (path.includes('forgot-password')) return 'forgotPassword';
        
        // Main pages
        if (path.includes('home')) return 'home';
        if (path.includes('my-plants')) return 'myPlants';
        if (path.includes('books')) return 'books';
        if (path.includes('agenda')) return 'agenda';
        if (path.includes('schedule')) return 'schedule';
        if (path.includes('community')) return 'community';
        
        // Common translations for components
        if (path.includes('appbar') || path.includes('drawer')) return 'common';
        
        // Default to home if we're on a page we don't recognize
        return path.includes('auth') ? 'signin' : 'home';
    },
    
    updateComponentTranslations(lang, componentId) {
        console.log(`Updating translations for component: ${componentId} to ${lang}`);
        
        if (!translations || !translations[lang]) {
            console.error(`No translations found for language: ${lang}`);
            return;
        }
        
        // Get the component element
        const componentElement = document.getElementById(componentId);
        if (!componentElement) {
            console.error(`Component not found: ${componentId}`);
            return;
        }
        
        // Apply common translations to this component
        const commonTranslations = translations[lang].common;
        if (commonTranslations) {
            Object.keys(commonTranslations).forEach(key => {
                if (key === 'title') return;
                
                const elements = componentElement.querySelectorAll(`[data-translate="${key}"]`);
                elements.forEach(element => {
                    if (element.tagName === 'INPUT') {
                        element.placeholder = commonTranslations[key];
                    } else {
                        element.textContent = commonTranslations[key];
                        if (key == 'hello') {
                            element.innerHTML+='<span class="username">Omar</span>'
                        }
                    }
                });
            });
        }
    },
    
    toggleLanguage() {
        console.log('Toggle language called');
        
        // Check if translations object exists
        if (typeof translations === 'undefined') {
            console.error('Translations object is not defined!');
            return;
        }
        
        const currentLanguage = document.documentElement.getAttribute('lang') || 'en';
        console.log('Current language:', currentLanguage);
        
        const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';
        console.log('New language:', newLanguage);
        
        // Add rotation animation
        const languageSwitch = document.querySelector('.language-switch');
        if (languageSwitch) {
            languageSwitch.style.transform = `rotate(${currentLanguage === 'en' ? 180 : 0}deg)`;
            // Toggle switch appearance with animation
            languageSwitch.classList.toggle('ar');
        }
        
        // Update language with transition
        this.setLanguage(newLanguage);
        
        // Update component translations without page reload
        this.updateComponentTranslations(newLanguage, 'app-bar-placeholder');
        this.updateComponentTranslations(newLanguage, 'drawer-placeholder');
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.languageManager.init();
    
    // Add language transition styles
    const style = document.createElement('style');
    style.textContent = `
        .language-transition * {
            transition: transform 0.3s ease, margin 0.3s ease, padding 0.3s ease !important;
        }
    `;
    document.head.appendChild(style);
}); 