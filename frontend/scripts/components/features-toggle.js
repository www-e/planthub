document.addEventListener('DOMContentLoaded', function() {
    const featuresSection = document.querySelector('.features-section');
    const featuresToggle = document.querySelector('.features-toggle');
    const featuresContent = document.querySelector('.features-content');

    // Set initial state
    if (window.innerWidth <= 768) {
        featuresContent.style.display = 'none';
        featuresContent.style.opacity = '0';
        featuresContent.style.maxHeight = '0';
    }

    // Toggle features section
    function toggleFeatures() {
        featuresSection.classList.toggle('expanded');
        
        if (featuresSection.classList.contains('expanded')) {
            featuresContent.style.display = 'flex';
            featuresContent.style.opacity = '1';
            featuresContent.style.maxHeight = featuresContent.scrollHeight + 'px';
            featuresToggle.querySelector('i').style.transform = 'rotate(180deg)';
        } else {
            featuresContent.style.opacity = '0';
            featuresContent.style.maxHeight = '0';
            featuresToggle.querySelector('i').style.transform = 'rotate(0deg)';
            setTimeout(() => {
                if (!featuresSection.classList.contains('expanded')) {
                    featuresContent.style.display = 'none';
                }
            }, 300);
        }
    }

    // Add click event to toggle button
    featuresToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleFeatures();
    });

    // Add click event to header
    featuresSection.querySelector('.features-header').addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            e.stopPropagation();
            toggleFeatures();
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            featuresContent.style.display = 'flex';
            featuresContent.style.opacity = '1';
            featuresContent.style.maxHeight = 'none';
            featuresToggle.querySelector('i').style.transform = 'rotate(0deg)';
            featuresSection.classList.remove('expanded');
        } else if (!featuresSection.classList.contains('expanded')) {
            featuresContent.style.display = 'none';
            featuresContent.style.opacity = '0';
            featuresContent.style.maxHeight = '0';
        }
    });

    // Add touch support for mobile
    if ('ontouchstart' in window) {
        featuresToggle.addEventListener('touchstart', function(e) {
            e.preventDefault();
            toggleFeatures();
        }, { passive: false });

        featuresSection.querySelector('.features-header').addEventListener('touchstart', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                toggleFeatures();
            }
        }, { passive: false });
    }
});
