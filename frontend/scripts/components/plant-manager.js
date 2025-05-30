class PlantManager {
    constructor() {
        this.mockPlantData = [
            {
                id: 1,
                name: 'Snake Plant (Sansevieria)',
                type: 'indoor',
                care: 'easy',
                environment: 'low-light',
                size: 'medium',
                water: 'Low Water',
                description: 'Known for its upright sword-like leaves, the snake plant is perfect for beginners. Tolerates low light and infrequent watering.',
                image: '/assets/images/plants/snake-plant.webp',
                careDetails: {
                    water: {
                        frequency: 'Every 2-3 weeks',
                        notes: 'Allow soil to dry completely between waterings. Reduce watering in winter.'
                    },
                    light: {
                        level: 'Low to bright indirect',
                        notes: 'Can tolerate low light but grows faster in brighter conditions.'
                    },
                    soil: {
                        type: 'Well-draining potting mix',
                        ph: '6.0-7.5'
                    },
                    temperature: {
                        ideal: '70-90°F (21-32°C)',
                        min: '50°F (10°C)'
                    },
                    humidity: {
                        level: 'Low to average',
                        notes: 'Tolerates dry air well'
                    },
                    fertilizer: {
                        frequency: 'Every 6-8 weeks during growing season',
                        type: 'Balanced liquid fertilizer'
                    },
                    pruning: {
                        frequency: 'Rarely needed',
                        notes: 'Remove damaged leaves at base'
                    },
                    propagation: {
                        methods: ['Division', 'Leaf cuttings'],
                        difficulty: 'Easy'
                    }
                },
                seasonalCare: {
                    spring: 'Increase watering frequency, start fertilizing',
                    summer: 'Maintain regular watering, protect from intense direct sun',
                    fall: 'Reduce watering and fertilizing',
                    winter: 'Minimal watering, stop fertilizing'
                },
                commonIssues: [
                    {
                        problem: 'Yellow leaves',
                        cause: 'Overwatering',
                        solution: 'Reduce watering frequency and ensure good drainage'
                    },
                    {
                        problem: 'Brown leaf tips',
                        cause: 'Fluoride sensitivity',
                        solution: 'Use filtered water or let tap water sit for 24 hours'
                    }
                ],
                toxicity: {
                    humans: 'Mildly toxic if ingested',
                    pets: 'Toxic to cats and dogs'
                }
            },
            {
                name: 'Monstera Deliciosa',
                type: 'indoor',
                care: 'moderate',
                environment: 'bright-indirect',
                size: 'large',
                water: 'Medium Water',
                description: 'Also known as the Swiss cheese plant, prized for its large, heart-shaped leaves with unique holes. Perfect for making a bold statement.',
                image: '/assets/images/plants/monstera-deliciosa.webp'
            },
            {
                name: 'Peace Lily',
                type: 'indoor',
                care: 'easy',
                environment: 'low-light',
                size: 'medium',
                water: 'Medium Water',
                description: 'Known for its elegant white flowers and glossy leaves. Great air-purifying plant that thrives in low to moderate light.',
                image: '/assets/images/plants/peace-lily.webp'
            },
            {
                name: 'Spider Plant',
                type: 'indoor',
                care: 'easy',
                environment: 'bright-indirect',
                size: 'medium',
                water: 'Medium Water',
                description: 'Features cascading green and white leaves. Produces baby plants that can be propagated. Perfect for hanging baskets.',
                image: '/assets/images/plants/spider-plant.webp'
            },
            {
                name: 'Pothos',
                type: 'indoor',
                care: 'easy',
                environment: 'low-light',
                size: 'medium',
                water: 'Low Water',
                description: 'Fast-growing vine with heart-shaped leaves. Available in various colors. Extremely adaptable and easy to propagate.',
                image: '/assets/images/plants/pothos.webp'
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

        // Create plant details modal
        this.detailsModal = document.createElement('div');
        this.detailsModal.className = 'plant-details-modal';
        document.body.appendChild(this.detailsModal);
    }

    initializeEventListeners() {
        this.addPlantBtn.addEventListener('click', () => this.showUploadOptions());
        this.uploadModal.addEventListener('click', (e) => {
            if (e.target === this.uploadModal) {
                this.hideUploadModal();
            }
        });
        this.detailsModal.addEventListener('click', (e) => {
            if (e.target === this.detailsModal) {
                this.hideDetailsModal();
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
            image: '/assets/images/plants/default-plant.jpg'
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
        card.dataset.id = plantData.id;

        card.innerHTML = `
            <div class="plant-image-container">
                <img src="${plantData.image}" 
                     alt="${plantData.name}" 
                     class="plant-image"
                     onerror="this.onerror=null; this.src='/assets/images/plants/placeholder.webp';">
                <div class="plant-quick-info">
                    <span class="water-level">
                        <i class="fas fa-tint"></i>
                        ${plantData.water}
                    </span>
                    <span class="care-level ${plantData.care}">
                        <i class="fas fa-seedling"></i>
                        ${plantData.care.charAt(0).toUpperCase() + plantData.care.slice(1)} Care
                    </span>
                </div>
            </div>
            <div class="plant-info">
                <h3 class="plant-name">${plantData.name}</h3>
                <p class="plant-description">${plantData.description}</p>
                <div class="plant-attributes">
                    <span class="attribute">
                        <i class="fas fa-sun"></i>
                        ${plantData.environment}
                    </span>
                    <span class="attribute">
                        <i class="fas fa-ruler-vertical"></i>
                        ${plantData.size}
                    </span>
                </div>
                <button class="view-details-btn" data-id="${plantData.id}">
                    <i class="fas fa-info-circle"></i>
                    View Details
                </button>
            </div>
        `;

        // Add click event for viewing details
        const detailsBtn = card.querySelector('.view-details-btn');
        detailsBtn.addEventListener('click', () => this.showPlantDetails(plantData));

        this.plantsGrid.appendChild(card);
    }

    showPlantDetails(plant) {
        this.detailsModal.innerHTML = `
            <div class="plant-details-content">
                <button class="close-modal">
                    <i class="fas fa-times"></i>
                </button>
                <div class="details-header">
                    <img src="${plant.image}" alt="${plant.name}" class="details-image">
                    <div class="details-title">
                        <h2>${plant.name}</h2>
                        <p class="details-description">${plant.description}</p>
                    </div>
                </div>
                
                <div class="care-instructions">
                    <h3>Care Instructions</h3>
                    <div class="care-grid">
                        <div class="care-item">
                            <i class="fas fa-tint"></i>
                            <h4>Watering</h4>
                            <p>${plant.careDetails.water.frequency}</p>
                            <small>${plant.careDetails.water.notes}</small>
                        </div>
                        <div class="care-item">
                            <i class="fas fa-sun"></i>
                            <h4>Light</h4>
                            <p>${plant.careDetails.light.level}</p>
                            <small>${plant.careDetails.light.notes}</small>
                        </div>
                        <div class="care-item">
                            <i class="fas fa-thermometer-half"></i>
                            <h4>Temperature</h4>
                            <p>${plant.careDetails.temperature.ideal}</p>
                            <small>Minimum: ${plant.careDetails.temperature.min}</small>
                        </div>
                        <div class="care-item">
                            <i class="fas fa-cloud"></i>
                            <h4>Humidity</h4>
                            <p>${plant.careDetails.humidity.level}</p>
                            <small>${plant.careDetails.humidity.notes}</small>
                        </div>
                    </div>
                </div>

                <div class="seasonal-care">
                    <h3>Seasonal Care</h3>
                    <div class="seasons-grid">
                        <div class="season">
                            <i class="fas fa-flower"></i>
                            <h4>Spring</h4>
                            <p>${plant.seasonalCare.spring}</p>
                        </div>
                        <div class="season">
                            <i class="fas fa-sun"></i>
                            <h4>Summer</h4>
                            <p>${plant.seasonalCare.summer}</p>
                        </div>
                        <div class="season">
                            <i class="fas fa-leaf"></i>
                            <h4>Fall</h4>
                            <p>${plant.seasonalCare.fall}</p>
                        </div>
                        <div class="season">
                            <i class="fas fa-snowflake"></i>
                            <h4>Winter</h4>
                            <p>${plant.seasonalCare.winter}</p>
                        </div>
                    </div>
                </div>

                <div class="common-issues">
                    <h3>Common Issues</h3>
                    <div class="issues-list">
                        ${plant.commonIssues.map(issue => `
                            <div class="issue">
                                <h4>${issue.problem}</h4>
                                <p><strong>Cause:</strong> ${issue.cause}</p>
                                <p><strong>Solution:</strong> ${issue.solution}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="toxicity-warning">
                    <h3>Toxicity</h3>
                    <div class="toxicity-info">
                        <p><i class="fas fa-user"></i> <strong>Humans:</strong> ${plant.toxicity.humans}</p>
                        <p><i class="fas fa-paw"></i> <strong>Pets:</strong> ${plant.toxicity.pets}</p>
                    </div>
                </div>
            </div>
        `;

        const closeBtn = this.detailsModal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => this.hideDetailsModal());

        this.detailsModal.classList.add('active');
    }

    hideDetailsModal() {
        this.detailsModal.classList.remove('active');
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
