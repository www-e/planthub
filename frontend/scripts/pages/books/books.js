// Books data with enhanced information and real images
const booksData = [
    {
        id: 1,
        title: "The Complete Guide to Indoor Plants",
        author: "Sarah Green",
        cover: "/assets/images/books/1.webp",
        tags: ["indoor", "beginner"],
        format: "pdf",
        downloadUrl: "#",
        description: "Master the art of indoor plant care with this comprehensive guide. Learn about light requirements, watering schedules, soil types, and troubleshooting common issues.",
        isbn: "978-1234567890",
        publishedYear: 2023,
        pages: 256,
        preview: "https://example.com/preview/indoor-plants"
    },
    {
        id: 2,
        title: "Sustainable Garden Design",
        author: "Michael Brown",
        cover: "/assets/images/books/2.webp",
        tags: ["sustainable", "design"],
        format: "ebook",
        downloadUrl: "#",
        description: "Create environmentally friendly gardens that thrive with minimal resources. Includes practical tips for water conservation, native plant selection, and organic pest control.",
        isbn: "978-0987654321",
        publishedYear: 2023,
        pages: 320,
        preview: "https://example.com/preview/sustainable-garden"
    },
    {
        id: 3,
        title: "Medicinal Plants Encyclopedia",
        author: "Dr. Emily Chen",
        cover: "/assets/images/books/3.webp",
        tags: ["medicinal", "reference"],
        format: "pdf",
        downloadUrl: "#",
        description: "An extensive guide to medicinal plants, their properties, and traditional uses. Features detailed botanical illustrations and scientific research.",
        isbn: "978-5678901234",
        publishedYear: 2022,
        pages: 450,
        preview: "https://example.com/preview/medicinal-plants"
    },
    {
        id: 4,
        title: "Urban Farming Basics",
        author: "James Wilson",
        cover: "/assets/images/books/4.webp",
        tags: ["urban", "beginner"],
        format: "ebook",
        downloadUrl: "#",
        description: "Transform any urban space into a productive garden. Covers container gardening, vertical growing systems, and small-space solutions.",
        isbn: "978-4321098765",
        publishedYear: 2023,
        pages: 280,
        preview: "https://example.com/preview/urban-farming"
    },
    {
        id: 5,
        title: "Desert Plants Care Guide",
        author: "Maria Rodriguez",
        cover: "/assets/images/books/5.webp",
        tags: ["desert", "care"],
        format: "article",
        downloadUrl: "#",
        description: "Expert guidance for growing and maintaining desert plants. Includes tips for succulent care, xeriscaping, and drought-resistant landscaping.",
        isbn: "978-8765432109",
        publishedYear: 2023,
        pages: 180,
        preview: "https://example.com/preview/desert-plants"
    },
    {
        id: 6,
        title: "Hydroponics for Beginners",
        author: "David Park",
        cover: "/assets/images/books/6.webp",
        tags: ["hydroponics", "beginner"],
        format: "pdf",
        downloadUrl: "#",
        description: "A comprehensive introduction to hydroponic growing systems. Learn about nutrient solutions, pH management, and system maintenance.",
        isbn: "978-2109876543",
        publishedYear: 2023,
        pages: 220,
        preview: "https://example.com/preview/hydroponics"
    }
];

// DOM Elements
const booksGrid = document.querySelector('.books-grid');
const searchInput = document.querySelector('.search-bar input');
const categoryFilter = document.getElementById('category-filter');
const formatFilter = document.getElementById('format-filter');

// Create book card element with lazy loading and intersection observer
function createBookCard(book) {
    return `
        <div class="book-card" data-id="${book.id}">
            <div class="book-cover-container">
                <img src="${book.cover}" alt="${book.title}" class="book-cover lazy" loading="lazy" onerror="this.onerror=null; this.style.backgroundColor='#f0f0f0'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.src='data:image/svg+xml;charset=UTF-8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\'><text x=\\'50%\\' y=\\'50%\\' text-anchor=\\'middle\\' dy=\\'.3em\\' fill=\\'%23999\\' font-size=\\'14\\'>${book.title}</text></svg>';">
                <div class="book-actions">
                    <button class="preview-btn" data-preview="${book.preview}">
                        <i class="fas fa-eye"></i>
                        Preview
                    </button>
                    <button class="download-btn" data-id="${book.id}">
                        <i class="fas fa-download"></i>
                        Download ${book.format.toUpperCase()}
                    </button>
                </div>
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">By ${book.author}</p>
                <p class="book-metadata">
                    <span class="book-year">${book.publishedYear}</span> •
                    <span class="book-pages">${book.pages} pages</span> •
                    <span class="book-isbn">ISBN: ${book.isbn}</span>
                </p>
                <p class="book-description">${book.description}</p>
                <div class="book-tags">
                    ${book.tags.map(tag => `<span class="book-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

// Render books with performance optimization
function renderBooks(books) {
    const fragment = document.createDocumentFragment();
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = books.map(book => createBookCard(book)).join('');
    
    while (tempContainer.firstChild) {
        fragment.appendChild(tempContainer.firstChild);
    }
    
    booksGrid.innerHTML = '';
    booksGrid.appendChild(fragment);

    // Initialize lazy loading for the newly added images
    const lazyImages = booksGrid.querySelectorAll('img.lazy');
    lazyImages.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Filter books with performance optimization
const filterBooks = debounce(() => {
    const searchTerm = searchInput.value.toLowerCase();
    const categoryValue = categoryFilter.value;
    const formatValue = formatFilter.value;

    const filteredBooks = booksData.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                            book.author.toLowerCase().includes(searchTerm) ||
                            book.description.toLowerCase().includes(searchTerm) ||
                            book.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        const matchesCategory = !categoryValue || book.tags.includes(categoryValue);
        const matchesFormat = !formatValue || book.format === formatValue;

        return matchesSearch && matchesCategory && matchesFormat;
    });

    renderBooks(filteredBooks);
}, 300);

// Event Listeners
searchInput.addEventListener('input', filterBooks);
categoryFilter.addEventListener('change', filterBooks);
formatFilter.addEventListener('change', filterBooks);

// Download functionality with progress indication
booksGrid.addEventListener('click', (e) => {
    const downloadBtn = e.target.closest('.download-btn');
    if (downloadBtn) {
        const bookId = downloadBtn.dataset.id;
        const book = booksData.find(b => b.id === parseInt(bookId));
        if (book) {
            downloadBtn.disabled = true;
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
            
            // Simulate download progress (replace with actual download logic)
            setTimeout(() => {
                downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded';
                setTimeout(() => {
                    downloadBtn.disabled = false;
                    downloadBtn.innerHTML = `<i class="fas fa-download"></i> Download ${book.format.toUpperCase()}`;
                }, 2000);
            }, 1500);
        }
    }
});

// Add preview functionality
document.addEventListener('click', (e) => {
    if (e.target.closest('.preview-btn')) {
        const previewUrl = e.target.closest('.preview-btn').dataset.preview;
        window.open(previewUrl, '_blank');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderBooks(booksData);
    
    // Update category filter options based on available tags
    const uniqueTags = [...new Set(booksData.flatMap(book => book.tags))].sort();
    categoryFilter.innerHTML = '<option value="">All Categories</option>' +
        uniqueTags.map(tag => `<option value="${tag}">${tag.charAt(0).toUpperCase() + tag.slice(1)}</option>`).join('');

    // Initialize lazy loading
    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    });
});
