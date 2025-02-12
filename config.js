// Determine if we're running on GitHub Pages
const isGitHubPages = window.location.hostname.includes('github.io');

// Set the base URL accordingly
const baseURL = isGitHubPages ? '/planthub' : '';

// Function to get complete URLs
function getPageUrl(path) {
    // Remove leading slash if it exists to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${baseURL}/${cleanPath}`;
}

// Export for use in other files
window.siteConfig = {
    getPageUrl: getPageUrl,
    baseURL: baseURL
};
