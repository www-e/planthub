document.addEventListener('DOMContentLoaded', () => {
    // Collapse functionality
    const filterSection = document.querySelector('.filter-section');
    const collapseButton = document.querySelector('.collapse-button');
    const buttonIcon = collapseButton.querySelector('i');
    const buttonText = collapseButton.querySelector('span');
    let isCollapsed = false;

    collapseButton.addEventListener('click', () => {
        isCollapsed = !isCollapsed;
        filterSection.classList.toggle('collapsed', isCollapsed);
        
        // Update button icon and text
        buttonIcon.classList.toggle('fa-chevron-up', !isCollapsed);
        buttonIcon.classList.toggle('fa-chevron-down', isCollapsed);
        buttonText.textContent = isCollapsed ? 'Show Filters' : 'Hide Filters';
        
        // Save state to localStorage
        localStorage.setItem('filterSectionCollapsed', isCollapsed);
    });

    // Restore collapse state from localStorage
    const savedCollapsedState = localStorage.getItem('filterSectionCollapsed');
    if (savedCollapsedState === 'true') {
        filterSection.classList.add('collapsed');
        buttonIcon.classList.remove('fa-chevron-up');
        buttonIcon.classList.add('fa-chevron-down');
        buttonText.textContent = 'Show Filters';
        isCollapsed = true;
    }

    // Quick filters functionality
    const quickFilters = document.querySelectorAll('.quick-filter');
    quickFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Remove active class from all filters
            quickFilters.forEach(f => f.classList.remove('active'));
            // Add active class to clicked filter
            filter.classList.add('active');
        });
    });

    // Reset filters
    const resetButton = document.querySelector('.filter-button.secondary');
    resetButton.addEventListener('click', () => {
        // Reset all inputs
        document.querySelectorAll('.filter-input').forEach(input => {
            if (input.type === 'number') {
                input.value = '';
            } else if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            } else {
                input.value = '';
            }
        });

        // Reset quick filters
        quickFilters.forEach(f => f.classList.remove('active'));
        quickFilters[0].classList.add('active');
    });
});
