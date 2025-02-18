document.addEventListener('DOMContentLoaded', function() {
    const featuresSection = document.querySelector('.features-section');
    const featuresToggle = document.querySelector('.features-toggle');
    const featuresContent = document.querySelector('.features-content');

    // Set initial state
    if (window.innerWidth <= 768) {
        featuresContent.style.display = 'none';
    }

    featuresToggle.addEventListener('click', function() {
        featuresSection.classList.toggle('expanded');
        
        if (featuresSection.classList.contains('expanded')) {
            featuresContent.style.display = 'flex';
            featuresContent.style.opacity = '1';
            featuresContent.style.maxHeight = featuresContent.scrollHeight + 'px';
        } else {
            featuresContent.style.opacity = '0';
            featuresContent.style.maxHeight = '0';
            setTimeout(() => {
                if (!featuresSection.classList.contains('expanded')) {
                    featuresContent.style.display = 'none';
                }
            }, 300);
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            featuresContent.style.display = 'flex';
            featuresContent.style.opacity = '1';
            featuresContent.style.maxHeight = 'none';
        } else if (!featuresSection.classList.contains('expanded')) {
            featuresContent.style.display = 'none';
            featuresContent.style.opacity = '0';
            featuresContent.style.maxHeight = '0';
        }
    });
});
