class CommunityManager {
    constructor() {
        this.mockPosts = [
            {
                id: 1,
                author: {
                    name: 'Sarah Green',
                    avatar: '/assets/images/users/user1.webp',
                    level: 'Expert Gardener'
                },
                title: 'Help! My Monstera leaves are turning yellow',
                content: 'I\'ve had my Monstera for 6 months and recently noticed some leaves turning yellow. I water it once a week and it gets bright indirect light. Any ideas what could be wrong?',
                tag: 'help',
                likes: 24,
                comments: [
                    {
                        author: {
                            name: 'Mike Wilson',
                            avatar: '/assets/images/users/user2.webp',
                            level: 'Plant Enthusiast'
                        },
                        content: 'Sounds like overwatering. Try letting the soil dry out between waterings.',
                        likes: 12,
                        timestamp: '2 hours ago'
                    },
                    {
                        author: {
                            name: 'Emma Davis',
                            avatar: '/assets/images/users/user3.webp',
                            level: 'Master Gardener'
                        },
                        content: 'Check the roots for any signs of rot. You might need to repot with fresh, well-draining soil.',
                        likes: 8,
                        timestamp: '1 hour ago'
                    },
                    {
                        author: {
                            name: 'Alex Thompson',
                            avatar: '/assets/images/users/user4.webp',
                            level: 'Plant Doctor'
                        },
                        content: 'I had the same issue. Also check if it\'s getting any cold drafts from windows or AC. Monsteras are sensitive to temperature changes.',
                        likes: 15,
                        timestamp: '30 minutes ago'
                    }
                ],
                timestamp: '3 hours ago'
            },
            {
                id: 2,
                author: {
                    name: 'John Smith',
                    avatar: '/assets/images/users/user5.webp',
                    level: 'Plant Parent'
                },
                title: 'My Snake Plant Collection',
                content: 'Just wanted to share my growing snake plant family! Started with one 2 years ago and now I have 8 different varieties.',
                tag: 'showcase',
                likes: 156,
                comments: [
                    {
                        author: {
                            name: 'Lisa Chen',
                            avatar: '/assets/images/users/user6.webp',
                            level: 'Plant Enthusiast'
                        },
                        content: 'They look amazing! Which variety is your favorite?',
                        likes: 6,
                        timestamp: '30 minutes ago'
                    }
                ],
                timestamp: '1 day ago'
            }
        ];

        this.initializeElements();
        this.initializeEventListeners();
        this.renderPosts();
    }

    initializeElements() {
        this.postsGrid = document.querySelector('.posts-grid');
        this.newPostBtn = document.querySelector('.new-post-btn');
        this.newPostModal = document.querySelector('.new-post-modal');
        this.closeModalBtn = document.querySelector('.close-modal');
        this.newPostForm = document.getElementById('new-post-form');
        this.searchInput = document.querySelector('.search-bar input');
        this.tagButtons = document.querySelectorAll('.tag-btn');
    }

    initializeEventListeners() {
        this.newPostBtn.addEventListener('click', () => this.showNewPostModal());
        this.closeModalBtn.addEventListener('click', () => this.hideNewPostModal());
        this.newPostForm.addEventListener('submit', (e) => this.handleNewPost(e));
        this.searchInput.addEventListener('input', debounce(() => this.filterPosts(), 300));
        this.tagButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handleTagFilter(btn));
        });
    }

    showNewPostModal() {
        this.newPostModal.classList.add('active');
    }

    hideNewPostModal() {
        this.newPostModal.classList.remove('active');
    }

    handleNewPost(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newPost = {
            id: this.mockPosts.length + 1,
            author: {
                name: 'Current User',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fm=webp&q=85',
                level: 'Plant Enthusiast'
            },
            title: formData.get('post-title'),
            content: formData.get('post-content'),
            tag: formData.get('post-tag'),
            likes: 0,
            comments: [],
            timestamp: 'Just now'
        };

        this.mockPosts.unshift(newPost);
        this.renderPosts();
        this.hideNewPostModal();
        e.target.reset();
    }

    handleTagFilter(btn) {
        this.tagButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterPosts();
    }

    filterPosts() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const activeTag = document.querySelector('.tag-btn.active').dataset.tag;

        const filteredPosts = this.mockPosts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchTerm) ||
                                post.content.toLowerCase().includes(searchTerm);
            const matchesTag = activeTag === 'all' || post.tag === activeTag;
            return matchesSearch && matchesTag;
        });

        this.renderPosts(filteredPosts);
    }

    createPostCard(post) {
        return `
            <div class="post-card" data-id="${post.id}">
                <div class="post-header">
                    <div class="author-info">
                        <img src="${post.author.avatar}" alt="${post.author.name}" class="author-avatar">
                        <div class="author-details">
                            <h3 class="author-name">${post.author.name}</h3>
                            <span class="author-level">${post.author.level}</span>
                        </div>
                    </div>
                    <span class="post-timestamp">${post.timestamp}</span>
                </div>
                <div class="post-content">
                    <h2 class="post-title">${post.title}</h2>
                    <p class="post-text">${post.content}</p>
                    <div class="post-tags">
                        <span class="post-tag ${post.tag}">${post.tag}</span>
                    </div>
                </div>
                <div class="post-actions">
                    <button class="like-btn ${post.liked ? 'liked' : ''}" data-id="${post.id}">
                        <i class="fas fa-heart"></i>
                        <span class="likes-count">${post.likes}</span>
                    </button>
                    <button class="comment-btn" data-id="${post.id}">
                        <i class="fas fa-comment"></i>
                        <span class="comments-count">${post.comments.length}</span>
                    </button>
                    <button class="share-btn">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
                <div class="comments-section">
                    ${post.comments.map(comment => this.createCommentElement(comment)).join('')}
                    <div class="add-comment">
                        <img src="/assets/images/users/user1.webp" 
                             alt="Current user" 
                             class="current-user-avatar">
                        <input type="text" placeholder="Add a comment..." class="comment-input">
                        <button class="send-comment-btn">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    createCommentElement(comment) {
        return `
            <div class="comment">
                <div class="comment-header">
                    <div class="comment-author">
                        <img src="${comment.author.avatar}" alt="${comment.author.name}" class="comment-avatar">
                        <div class="comment-author-details">
                            <span class="comment-author-name">${comment.author.name}</span>
                            <span class="comment-author-level">${comment.author.level}</span>
                        </div>
                    </div>
                    <span class="comment-timestamp">${comment.timestamp}</span>
                </div>
                <p class="comment-content">${comment.content}</p>
                <div class="comment-actions">
                    <button class="like-btn ${comment.liked ? 'liked' : ''}">
                        <i class="fas fa-heart"></i>
                        <span class="likes-count">${comment.likes}</span>
                    </button>
                    <button class="reply-btn">
                        <i class="fas fa-reply"></i>
                        Reply
                    </button>
                </div>
            </div>
        `;
    }

    renderPosts(posts = this.mockPosts) {
        this.postsGrid.innerHTML = posts.map(post => this.createPostCard(post)).join('');
        this.initializePostInteractions();
    }

    initializePostInteractions() {
        const likeBtns = document.querySelectorAll('.like-btn');
        const commentBtns = document.querySelectorAll('.comment-btn');
        const shareBtns = document.querySelectorAll('.share-btn');
        const commentInputs = document.querySelectorAll('.comment-input');
        const sendCommentBtns = document.querySelectorAll('.send-comment-btn');

        likeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleLike(btn));
        });

        commentBtns.forEach(btn => {
            btn.addEventListener('click', () => this.toggleComments(btn));
        });

        shareBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleShare(btn));
        });

        commentInputs.forEach((input, index) => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleNewComment(input, sendCommentBtns[index]);
                }
            });
        });

        sendCommentBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const input = btn.previousElementSibling;
                this.handleNewComment(input, btn);
            });
        });
    }

    handleLike(btn) {
        btn.classList.toggle('liked');
        const likesCount = btn.querySelector('.likes-count');
        const currentLikes = parseInt(likesCount.textContent);
        likesCount.textContent = btn.classList.contains('liked') ? currentLikes + 1 : currentLikes - 1;
    }

    toggleComments(btn) {
        const postCard = btn.closest('.post-card');
        const commentsSection = postCard.querySelector('.comments-section');
        commentsSection.classList.toggle('active');
    }

    handleShare(btn) {
        // Implement share functionality
        alert('Share functionality coming soon!');
    }

    handleNewComment(input, btn) {
        const comment = input.value.trim();
        if (comment) {
            const postCard = btn.closest('.post-card');
            const commentsSection = postCard.querySelector('.comments-section');
            const newComment = {
                author: {
                    name: 'Current User',
                    avatar: '/assets/images/users/user1.webp',
                    level: 'Plant Enthusiast'
                },
                content: comment,
                likes: 0,
                timestamp: 'Just now'
            };

            const commentElement = this.createCommentElement(newComment);
            commentsSection.insertAdjacentHTML('beforeend', commentElement);
            input.value = '';

            // Update comment count
            const commentCount = postCard.querySelector('.comments-count');
            commentCount.textContent = parseInt(commentCount.textContent) + 1;
        }
    }
}

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

// Initialize community manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const communityManager = new CommunityManager();
}); 