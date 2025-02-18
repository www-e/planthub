class PlantFilter {
    constructor() {
        this.filterContent = document.querySelector('.filter-content');
        this.filterToggle = document.querySelector('.filter-toggle');
        this.resetButton = document.querySelector('.reset-filters');
        this.applyButton = document.querySelector('.apply-filters');
        this.filterOptions = document.querySelectorAll('.filter-option input');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Toggle filter visibility
        this.filterToggle.addEventListener('click', () => {
            this.filterToggle.classList.toggle('expanded');
            this.filterContent.classList.toggle('expanded');
        });

        // Reset filters
        this.resetButton.addEventListener('click', () => {
            this.filterOptions.forEach(option => {
                option.checked = false;
            });
            this.applyFilters();
        });

        // Apply filters
        this.applyButton.addEventListener('click', () => {
            this.applyFilters();
        });

        // Individual filter changes
        this.filterOptions.forEach(option => {
            option.addEventListener('change', () => {
                // Optional: Apply filters immediately on each change
                // this.applyFilters();
            });
        });
    }

    getActiveFilters() {
        const activeFilters = {
            types: [],
            care: [],
            environment: [],
            size: []
        };

        this.filterOptions.forEach(option => {
            if (option.checked) {
                const category = option.getAttribute('data-category');
                const value = option.value;
                activeFilters[category].push(value);
            }
        });

        return activeFilters;
    }

    applyFilters() {
        const activeFilters = this.getActiveFilters();
        const plants = document.querySelectorAll('.plant-card');
        
        plants.forEach(plant => {
            const plantData = {
                type: plant.getAttribute('data-type'),
                care: plant.getAttribute('data-care'),
                environment: plant.getAttribute('data-environment'),
                size: plant.getAttribute('data-size')
            };

            const isVisible = this.matchesFilters(plantData, activeFilters);
            plant.style.display = isVisible ? 'block' : 'none';
        });

        // Dispatch custom event for other components
        const event = new CustomEvent('filtersApplied', {
            detail: { filters: activeFilters }
        });
        document.dispatchEvent(event);
    }

    matchesFilters(plantData, activeFilters) {
        // If no filters are active, show all plants
        const hasActiveFilters = Object.values(activeFilters).some(category => category.length > 0);
        if (!hasActiveFilters) return true;

        // Check each filter category
        for (const [category, values] of Object.entries(activeFilters)) {
            if (values.length > 0 && !values.includes(plantData[category])) {
                return false;
            }
        }

        return true;
    }
}

// Initialize filter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const plantFilter = new PlantFilter();
});
