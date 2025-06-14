class PlantManager {
  constructor() {
    this.apiBaseUrl = "https://planthub.mhmud.com/";
    this.mockPlantData = []; // Will be filled by API
    this.initializeElements();
    this.fetchAndRenderPlants();
    this.initializeEventListeners();
  }

  initializeElements() {
    this.addPlantBtn = document.querySelector(".add-plant-btn");
    this.plantsGrid = document.querySelector(".plants-grid");
    this.uploadModal = document.createElement("div");
    this.uploadModal.className = "upload-modal";
    document.body.appendChild(this.uploadModal);

    // Create plant details modal
    this.detailsModal = document.createElement("div");
    this.detailsModal.className = "plant-details-modal";
    document.body.appendChild(this.detailsModal);
  }

  async fetchAndRenderPlants() {
    try {
      const response = await fetch(this.apiBaseUrl + "api/plant/plantsinfo");
      const result = await response.json();
      if (result.status === "success" && Array.isArray(result.data)) {
        this.mockPlantData = result.data;
        this.renderPlants(this.mockPlantData);
      } else {
        this.showErrorMessage("Failed to load plants.");
      }
    } catch (error) {
      this.showErrorMessage("Error fetching plants.");
    }
  }

  renderPlants(plants) {
    this.plantsGrid.innerHTML = "";
    plants.forEach((plant) => this.addPlantCard(plant));
  }

  initializeEventListeners() {
    this.addPlantBtn.addEventListener("click", () => this.showUploadOptions());
    this.uploadModal.addEventListener("click", (e) => {
      if (e.target === this.uploadModal) {
        this.hideUploadModal();
      }
    });
    this.detailsModal.addEventListener("click", (e) => {
      if (e.target === this.detailsModal) {
        this.hideDetailsModal();
      }
    });

    // Listen for filter changes
    document.addEventListener("filtersApplied", (e) => {
      this.applyFiltersToPlants(e.detail.filters);
    });
  }

  applyFiltersToPlants(filters) {
    // Only filter by type, care, environment, size if present in API data
    const filtered = this.mockPlantData.filter((plant) => {
      // If no filters, show all
      const hasActive = Object.values(filters).some((arr) => arr.length > 0);
      if (!hasActive) return true;

      // For demo, only filter by name/category if available
      let match = true;
      if (filters.types.length > 0) {
        match =
          match &&
          filters.types.some(
            (type) =>
              (plant.type && plant.type === type) ||
              (plant.category && plant.category === type) ||
              (plant.category_id && String(plant.category_id) === type)
          );
      }
      // You can expand this logic if your API returns more fields
      return match;
    });
    this.renderPlants(filtered);
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

    const options = this.uploadModal.querySelectorAll(".upload-option");
    options.forEach((option) => {
      option.addEventListener("click", () => {
        this.handleImageUpload(option.dataset.type);
      });
    });

    this.uploadModal.classList.add("active");
  }

  hideUploadModal() {
    this.uploadModal.classList.remove("active");
  }

  handleImageUpload(type) {
    // Simulate image upload
    this.hideUploadModal();
    this.showSuccessMessage("Plant added successfully! (Demo only)");
  }

  addPlantCard(plantData) {
    const card = document.createElement("div");
    card.className = "plant-card";
    card.dataset.type = plantData.type || "";
    card.dataset.care = plantData.care || "";
    card.dataset.environment = plantData.environment || "";
    card.dataset.size = plantData.size || "";
    card.dataset.id = plantData.id;

    card.innerHTML = `
            <div class="plant-image-container">
                <img src="https://planthub.mhmud.com/storage/${
                  plantData.image
                }" 
                     alt="${plantData.name}" 
                     class="plant-image"
                     onerror="this.onerror=null; this.src='/assets/images/plants/placeholder.webp';">
                <div class="plant-quick-info">
                    <span class="water-level">
                        <i class="fas fa-calendar"></i>
                        ${plantData.season ? plantData.season : ""}
                    </span>
                </div>
            </div>
            <div class="plant-info">
                <h3 class="plant-name">${plantData.name}</h3>
                <p class="plant-description">${plantData.description}</p>
                <div class="plant-attributes">
                    <span class="attribute">
                        <i class="fas fa-tag"></i>
                        Category: ${plantData.category.name || "-"}
                    </span>
                </div>
                <button class="view-details-btn" data-id="${plantData.id}">
                    <i class="fas fa-info-circle"></i>
                    View Details
                </button>
            </div>
        `;

    // Add click event for viewing details
    const detailsBtn = card.querySelector(".view-details-btn");
    detailsBtn.addEventListener("click", () =>
      this.showPlantDetails(plantData)
    );

    this.plantsGrid.appendChild(card);
  }

  showPlantDetails(plant) {
    this.detailsModal.innerHTML = `
            <div class="plant-details-content">
                <button class="close-modal">
                    <i class="fas fa-times"></i>
                </button>
                <div class="details-header">
                    <img src="https://planthub.mhmud.com/storage/${
                      plant.image
                    }" alt="${plant.name}" class="details-image">
                    <div class="details-title">
                        <h2>${plant.name}</h2>
                        <p class="details-description">${plant.description}</p>
                        <p><strong>Season:</strong> ${plant.season || "-"}</p>
                        <p><strong>Category:</strong> ${
                          plant.category.name || "-"
                        }</p>
                    </div>
                </div>
            </div>
        `;

    const closeBtn = this.detailsModal.querySelector(".close-modal");
    closeBtn.addEventListener("click", () => this.hideDetailsModal());

    this.detailsModal.classList.add("active");
  }

  hideDetailsModal() {
    this.detailsModal.classList.remove("active");
  }

  showSuccessMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.className = "success-message";
    messageElement.innerHTML = `
            <i class="fas fa-check-circle"></i>
            ${message}
        `;
    document.body.appendChild(messageElement);

    setTimeout(() => {
      messageElement.remove();
    }, 3000);
  }

  showErrorMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.className = "error-message";
    messageElement.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            ${message}
        `;
    document.body.appendChild(messageElement);

    setTimeout(() => {
      messageElement.remove();
    }, 4000);
  }
}

// Initialize plant manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const plantManager = new PlantManager();
});
