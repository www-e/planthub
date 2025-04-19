document.addEventListener('DOMContentLoaded', () => {
    const uploadBox = document.getElementById('uploadBox');
    const plantImage = document.getElementById('plantImage');
    const uploadBtn = document.getElementById('uploadBtn');
    const plantName = document.getElementById('plantName');
    const plantType = document.getElementById('plantType');
    const plantingDate = document.getElementById('plantingDate');

    // Plant care data (this would typically come from a backend API)
    const plantCareData = {
        tomato: {
            wateringFrequency: 'Every 2-3 days',
            growthPeriod: 60, // days
            tips: [
                'Keep soil consistently moist but not waterlogged',
                'Provide at least 6-8 hours of sunlight daily',
                'Use a balanced fertilizer every 2 weeks',
                'Prune suckers to promote better fruit production'
            ]
        },
        lettuce: {
            wateringFrequency: 'Every 1-2 days',
            growthPeriod: 45,
            tips: [
                'Water in the morning to prevent disease',
                'Harvest outer leaves first for continuous growth',
                'Protect from extreme heat',
                'Use mulch to retain moisture'
            ]
        },
        herbs: {
            wateringFrequency: 'Every 2-3 days',
            growthPeriod: 30,
            tips: [
                'Allow soil to dry slightly between waterings',
                'Harvest regularly to promote growth',
                'Pinch back flowers to maintain flavor',
                'Provide good drainage'
            ]
        },
        flowers: {
            wateringFrequency: 'Every 2-4 days',
            growthPeriod: 90,
            tips: [
                'Water at the base to prevent disease',
                'Deadhead spent flowers',
                'Fertilize monthly during growing season',
                'Provide adequate spacing for air circulation'
            ]
        }
    };

    // Handle image upload
    uploadBox.addEventListener('click', () => {
        plantImage.click();
    });

    plantImage.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (e) => {
                uploadBox.style.backgroundImage = `url(${e.target.result})`;
                uploadBox.style.backgroundSize = 'cover';
                uploadBox.style.backgroundPosition = 'center';
                uploadBox.querySelector('.upload-placeholder').style.display = 'none';
                
                // Here you would typically send the image to your backend for analysis
                analyzePlantImage(file);
            };
            
            reader.readAsDataURL(file);
        }
    });

    // Handle form changes
    plantType.addEventListener('change', updateCareSchedule);
    plantingDate.addEventListener('change', updateCareSchedule);

    function updateCareSchedule() {
        const selectedType = plantType.value;
        const selectedDate = plantingDate.value;
        
        if (selectedType && selectedDate) {
            const careData = plantCareData[selectedType];
            const plantingDateObj = new Date(selectedDate);
            const harvestDate = new Date(plantingDateObj);
            harvestDate.setDate(harvestDate.getDate() + careData.growthPeriod);
            
            // Update watering schedule
            document.getElementById('wateringFrequency').textContent = careData.wateringFrequency;
            
            // Update harvest schedule
            document.getElementById('harvestDate').textContent = harvestDate.toLocaleDateString();
            
            // Calculate days remaining
            const today = new Date();
            const daysRemaining = Math.ceil((harvestDate - today) / (1000 * 60 * 60 * 24));
            document.getElementById('daysRemaining').textContent = `${daysRemaining} days`;
            
            // Update care tips
            updateCareTips(careData.tips);
        }
    }

    function updateCareTips(tips) {
        const tipsContainer = document.getElementById('careTips');
        tipsContainer.innerHTML = '';
        
        tips.forEach(tip => {
            const tipElement = document.createElement('div');
            tipElement.className = 'tip-item';
            tipElement.innerHTML = `
                <h4>Care Tip</h4>
                <p>${tip}</p>
            `;
            tipsContainer.appendChild(tipElement);
        });
    }

    // Simulated plant image analysis (to be replaced with actual API call)
    function analyzePlantImage(file) {
        // Here you would typically:
        // 1. Send the image to your backend
        // 2. Process the image using ML/AI
        // 3. Return plant identification and health status
        // 4. Update the UI with the results
        
        console.log('Analyzing plant image...');
        // Simulate API call delay
        setTimeout(() => {
            // This would be replaced with actual API response
            const mockResponse = {
                plantType: 'tomato',
                healthStatus: 'healthy',
                growthStage: 'vegetative'
            };
            
            // Update UI with results
            plantType.value = mockResponse.plantType;
            updateCareSchedule();
        }, 2000);
    }

    // Initialize date input with today's date
    plantingDate.valueAsDate = new Date();
}); 