async function loadComponent(componentPath, placeholderId) {
  try {
    const response = await fetch(componentPath);
    const parser = new DOMParser();
    const doc = parser.parseFromString(await response.text(), 'text/html');
    const template = doc.querySelector('template');
    
    if (template) {
      document.getElementById(placeholderId).appendChild(
        template.content.cloneNode(true)
      );
      
      // After component is loaded, initialize language functionality
      if (window.languageManager) {
        // Initialize language buttons
        if (placeholderId === 'app-bar-placeholder') {
          window.languageManager.initDropdownLanguageSwitch();
        } else if (placeholderId === 'drawer-placeholder') {
          window.languageManager.initDrawerLanguageSwitch();
        }
        
        // Apply translations to the newly loaded component
        const currentLang = localStorage.getItem('language') || 'en';
        window.languageManager.updateComponentTranslations(currentLang, placeholderId);
      }
    }
  } catch (error) {
    console.error(`Error loading ${componentPath}:`, error);
  }
}

// Load components when page loads
window.addEventListener('DOMContentLoaded', () => {
  loadComponent('../appbar/appbar.html', 'app-bar-placeholder');
  loadComponent('../drawer/drawer.html', 'drawer-placeholder');
});