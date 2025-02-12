// Function to set active navigation items based on current page
function setActiveNavigationItems() {
    const currentPath = window.location.pathname;
    
    // Get all navigation items from both app bar and drawer
    const appBarNavItems = document.querySelectorAll('.app-bar-nav .nav-item');
    const drawerNavItems = document.querySelectorAll('.drawer-nav .nav-item');
    
    // Function to check if a link matches current path
    const isActivePath = (href) => {
        if (!href) return false;
        // Extract the page name from both paths (e.g., 'home.html' from the full path)
        const linkPath = href.split('/').pop();
        const currentPageName = currentPath.split('/').pop();
        
        // Handle the case when we're at root or index
        if (!currentPageName || currentPageName === '' || currentPageName === 'index.html') {
            return linkPath === 'home.html';
        }
        
        return linkPath.toLowerCase() === currentPageName.toLowerCase();
    };

    // Remove all active classes first
    appBarNavItems.forEach(item => item.classList.remove('active'));
    drawerNavItems.forEach(item => item.classList.remove('active'));

    // Set active class based on current path
    appBarNavItems.forEach(item => {
        const href = item.getAttribute('href');
        if (isActivePath(href)) {
            item.classList.add('active');
        }
    });

    drawerNavItems.forEach(item => {
        const href = item.getAttribute('href');
        if (isActivePath(href)) {
            item.classList.add('active');
        }
    });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Slight delay to ensure components are loaded
    setTimeout(setActiveNavigationItems, 100);
});

// Update active state when using browser navigation
window.addEventListener('popstate', setActiveNavigationItems);

// Also update when the drawer is opened (in case of dynamic loading)
document.addEventListener('drawerOpened', setActiveNavigationItems);
