document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.querySelector('.menu-button');
    const drawer = document.querySelector('.mobile-drawer');
    const drawerClose = document.querySelector('.drawer-close');
    const drawerOverlay = document.querySelector('.drawer-overlay');
    const drawerProfile = document.querySelector('.drawer-profile');
    const profileMenu = document.querySelector('.drawer-profile-menu');

    // Function to open drawer
    const openDrawer = () => {
        drawer.classList.add('open');
        drawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when drawer is open
    };

    // Function to close drawer
    const closeDrawer = () => {
        drawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
        document.body.style.overflow = ''; // Restore scrolling
        // Close profile menu when drawer closes
        drawerProfile.classList.remove('open');
        profileMenu.classList.remove('open');
    };

    // Function to toggle profile menu
    const toggleProfileMenu = (e) => {
        e.stopPropagation(); // Prevent drawer from closing
        drawerProfile.classList.toggle('open');
        profileMenu.classList.toggle('open');
    };

    // Event listeners
    menuButton.addEventListener('click', openDrawer);
    drawerClose.addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);
    drawerProfile.addEventListener('click', toggleProfileMenu);

    // Close profile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!drawerProfile.contains(e.target)) {
            drawerProfile.classList.remove('open');
            profileMenu.classList.remove('open');
        }
    });

    // Close drawer and profile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDrawer();
            drawerProfile.classList.remove('open');
            profileMenu.classList.remove('open');
        }
    });

    // Handle drawer links
    const drawerLinks = drawer.querySelectorAll('.nav-item');
    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active class from all links
            drawerLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            link.classList.add('active');
            // Close drawer after link click
            closeDrawer();
        });
    });

    // Handle profile menu items
    const menuItems = profileMenu.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent menu toggle
            // Close drawer after menu item click
            closeDrawer();
        });
    });
});
