document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = 'signin.html';
        return;
    }

    // Update username in the welcome message
    const usernameElement = document.querySelector('.username');
    if (usernameElement) {
        usernameElement.textContent = username;
    }

    // Handle sign out
    const signOutButton = document.querySelector('.sign-out');
    if (signOutButton) {
        signOutButton.addEventListener('click', () => {
            localStorage.removeItem('username');
            window.location.href = 'signin.html';
        });
    }

    // Add hover effects for action items
    const actionItems = document.querySelectorAll('.action-item');
    actionItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('i');
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        });

        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('i');
            icon.style.transform = '';
        });

        // Add touch effects for mobile
        item.addEventListener('touchstart', () => {
            item.style.transform = 'scale(0.98)';
        });

        item.addEventListener('touchend', () => {
            item.style.transform = '';
        });
    });

    // Camera button functionality
    document.querySelector('.camera-btn').addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        this.appendChild(ripple);

        // Position the ripple
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size/2}px`;
        ripple.style.top = `${e.clientY - rect.top - size/2}px`;

        // Remove ripple after animation
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });

        // TODO: Add your camera/file upload functionality here
        // For now, let's simulate a file input click
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.capture = 'environment'; // Use the back camera on mobile devices
        fileInput.click();

        fileInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                // TODO: Handle the selected image
                console.log('Image selected:', this.files[0]);
                // Here you can add code to upload the image or process it
            }
        });
    });
});
