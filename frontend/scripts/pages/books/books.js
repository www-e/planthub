// Sample books data - Replace with actual API call in production
const booksData = [
    {
        id: 1,
        title: "The Complete Guide to Indoor Plants",
        author: "Sarah Green",
        cover: "../../assets/images/books/indoor-plants.jpg",
        tags: ["indoor", "beginner"],
        format: "pdf",
        downloadUrl: "#",
        description: "Master the art of indoor plant care with this comprehensive guide."
    },
    {
        id: 2,
        title: "Sustainable Garden Design",
        author: "Michael Brown",
        cover: "../../assets/images/books/sustainable-garden.jpg",
        tags: ["sustainable", "design"],
        format: "ebook",
        downloadUrl: "#",
        description: "Learn how to create environmentally friendly and beautiful gardens."
    },
    {
        id: 3,
        title: "Medicinal Plants Encyclopedia",
        author: "Dr. Emily Chen",
        cover: "../../assets/images/books/medicinal.jpg",
        tags: ["medicinal", "reference"],
        format: "pdf",
        downloadUrl: "#",
        description: "A comprehensive guide to medicinal plants and their properties."
    },
    {
        id: 4,
        title: "Urban Farming Basics",
        author: "James Wilson",
        cover: "../../assets/images/books/urban-farming.jpg",
        tags: ["urban", "beginner"],
        format: "ebook",
        downloadUrl: "#",
        description: "Start your own urban farm with this practical guide."
    },
    {
        id: 5,
        title: "Desert Plants Care Guide",
        author: "Maria Rodriguez",
        cover: "../../assets/images/books/desert-plants.jpg",
        tags: ["desert", "care"],
        format: "article",
        downloadUrl: "#",
        description: "Expert tips for growing and maintaining desert plants."
    },
    {
        id: 6,
        title: "Hydroponics for Beginners",
        author: "David Park",
        cover: "../../assets/images/books/hydroponics.jpg",
        tags: ["hydroponics", "beginner"],
        format: "pdf",
        downloadUrl: "#",
        description: "Start your hydroponic garden with this step-by-step guide."
    },
    {
        id: 7,
        title: "Plant Photography Guide",
        author: "Lisa Chen",
        cover: "../../assets/images/books/photography.jpg",
        tags: ["photography", "art"],
        format: "ebook",
        downloadUrl: "#",
        description: "Capture stunning plant photos with professional techniques."
    },
    {
        id: 8,
        title: "Rare Plants Collection",
        author: "Dr. Robert Smith",
        cover: "../../assets/images/books/rare-plants.jpg",
        tags: ["rare", "collection"],
        format: "pdf",
        downloadUrl: "#",
        description: "Discover the world's most unique and rare plant species."
    },
    {
        id: 9,
        title: "Vertical Gardening Solutions",
        author: "Anna White",
        cover: "../../assets/images/books/vertical.jpg",
        tags: ["vertical", "space-saving"],
        format: "article",
        downloadUrl: "#",
        description: "Maximize your space with vertical gardening techniques."
    },
    {
        id: 10,
        title: "Plant Disease Prevention",
        author: "Dr. Mark Johnson",
        cover: "../../assets/images/books/disease.jpg",
        tags: ["health", "care"],
        format: "pdf",
        downloadUrl: "#",
        description: "Identify and prevent common plant diseases."
    },
    {
        id: 11,
        title: "Bonsai Mastery",
        author: "Kenji Tanaka",
        cover: "../../assets/images/books/bonsai.jpg",
        tags: ["bonsai", "art"],
        format: "ebook",
        downloadUrl: "#",
        description: "Master the ancient art of bonsai cultivation."
    },
    {
        id: 12,
        title: "Organic Fertilizers Guide",
        author: "Emma Davis",
        cover: "../../assets/images/books/fertilizers.jpg",
        tags: ["organic", "sustainable"],
        format: "article",
        downloadUrl: "#",
        description: "Create and use natural fertilizers for healthier plants."
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
            <img src="${book.cover}" alt="${book.title}" class="book-cover lazy" loading="lazy">
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">By ${book.author}</p>
                <p class="book-description">${book.description}</p>
                <div class="book-tags">
                    ${book.tags.map(tag => `<span class="book-tag">${tag}</span>`).join('')}
                </div>
                <div class="book-actions">
                    <button class="download-btn" data-id="${book.id}">
                        <i class="fas fa-download"></i>
                        Download ${book.format.toUpperCase()}
                    </button>
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderBooks(booksData);
    
    // Update category filter options based on available tags
    const uniqueTags = [...new Set(booksData.flatMap(book => book.tags))].sort();
    categoryFilter.innerHTML = '<option value="">All Categories</option>' +
        uniqueTags.map(tag => `<option value="${tag}">${tag.charAt(0).toUpperCase() + tag.slice(1)}</option>`).join('');
});
