class PlantManager {
    constructor() {
        this.mockPlantData = [
            {
                name: 'Snake Plant',
                type: 'indoor',
                care: 'easy',
                environment: 'low-light',
                size: 'small',
                water: 'Low Water',
                image: '../../assets/images/plants/snake-plant.jpg'
            },
            {
                name: 'Monstera Deliciosa',
                type: 'indoor',
                care: 'moderate',
                environment: 'bright-indirect',
                size: 'large',
                water: 'Medium Water',
                image: '../../assets/images/plants/monstera.jpg'
            },
            {
                name: 'Succulent Garden',
                type: 'succulent',
                care: 'easy',
                environment: 'full-sun',
                size: 'small',
                water: 'Low Water',
                image: '../../assets/images/plants/succulent.jpg'
            }
        ];
        
        this.initializeElements();
        this.initializeEventListeners();
    }

    initializeElements() {
        this.addPlantBtn = document.querySelector('.add-plant-btn');
        this.plantsGrid = document.querySelector('.plants-grid');
        this.uploadModal = document.createElement('div');
        this.uploadModal.className = 'upload-modal';
        document.body.appendChild(this.uploadModal);
    }

    initializeEventListeners() {
        this.addPlantBtn.addEventListener('click', () => this.showUploadOptions());
        this.uploadModal.addEventListener('click', (e) => {
            if (e.target === this.uploadModal) {
                this.hideUploadModal();
            }
        });

        // Add sample plants
        this.mockPlantData.forEach(plant => this.addPlantCard(plant));
    }

    showUploadOptions() {
        this.uploadModal.innerHTML = `
            <div class="upload-options">
                <button class="upload-option" data-type="camera">
                    <i class="fas fa-camera"></i>
                    Take a Photo
                </button>
                <button class="upload-option" data-type="gallery">
                    <i class="fas fa-image"></i>
                    Choose from Gallery
                </button>
            </div>
        `;

        const options = this.uploadModal.querySelectorAll('.upload-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                this.handleImageUpload(option.dataset.type);
            });
        });

        this.uploadModal.classList.add('active');
    }

    hideUploadModal() {
        this.uploadModal.classList.remove('active');
    }

    handleImageUpload(type) {
        // Simulate image upload
        this.hideUploadModal();
        
        // Generate random plant data
        const plantTypes = ['indoor', 'outdoor', 'succulent'];
        const careLevels = ['easy', 'moderate', 'expert'];
        const environments = ['low-light', 'bright-indirect', 'full-sun'];
        const sizes = ['small', 'medium', 'large'];
        const waters = ['Low Water', 'Medium Water', 'High Water'];
        
        const randomPlant = {
            name: 'New Plant ' + Math.floor(Math.random() * 1000),
            type: plantTypes[Math.floor(Math.random() * plantTypes.length)],
            care: careLevels[Math.floor(Math.random() * careLevels.length)],
            environment: environments[Math.floor(Math.random() * environments.length)],
            size: sizes[Math.floor(Math.random() * sizes.length)],
            water: waters[Math.floor(Math.random() * waters.length)],
            image: '../../assets/images/plants/default-plant.jpg'
        };

        this.addPlantCard(randomPlant);
        this.showSuccessMessage('Plant added successfully!');
    }

    addPlantCard(plantData) {
        const card = document.createElement('div');
        card.className = 'plant-card';
        card.dataset.type = plantData.type;
        card.dataset.care = plantData.care;
        card.dataset.environment = plantData.environment;
        card.dataset.size = plantData.size;

        card.innerHTML = `
            <div class="plant-image-container">
                <img src="${plantData.image}" alt="${plantData.name}" class="plant-image">
            </div>
            <div class="plant-info">
                <h3 class="plant-name">${plantData.name}</h3>
                <div class="plant-details">
                    <span class="detail-item">
                        <i class="fas fa-seedling"></i>
                        ${plantData.type.charAt(0).toUpperCase() + plantData.type.slice(1)}
                    </span>
                    <span class="detail-item">
                        <i class="fas fa-tint"></i>
                        ${plantData.water}
                    </span>
                    <span class="detail-item">
                        <i class="fas fa-sun"></i>
                        ${plantData.environment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                    <span class="detail-item">
                        <i class="fas fa-ruler-vertical"></i>
                        ${plantData.size.charAt(0).toUpperCase() + plantData.size.slice(1)}
                    </span>
                </div>
                <div class="plant-actions">
                    <button class="action-btn" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" title="Water">
                        <i class="fas fa-tint"></i>
                    </button>
                    <button class="action-btn" title="View Details">
                        <i class="fas fa-info-circle"></i>
                    </button>
                    <button class="action-btn" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

        // Add event listeners for action buttons
        const actionButtons = card.querySelectorAll('.action-btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = button.title.toLowerCase();
                this.handlePlantAction(action, card);
            });
        });

        this.plantsGrid.appendChild(card);
    }

    handlePlantAction(action, card) {
        switch (action) {
            case 'edit':
                // Implement edit functionality
                break;
            case 'water':
                this.showSuccessMessage('Plant watered successfully!');
                break;
            case 'view details':
                // Implement view details functionality
                break;
            case 'delete':
                if (confirm('Are you sure you want to delete this plant?')) {
                    card.remove();
                    this.showSuccessMessage('Plant deleted successfully!');
                }
                break;
        }
    }

    showSuccessMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'success-message';
        messageElement.innerHTML = `
            <i class="fas fa-check-circle"></i>
            ${message}
        `;
        document.body.appendChild(messageElement);

        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }
}

// Initialize plant manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const plantManager = new PlantManager();
});
