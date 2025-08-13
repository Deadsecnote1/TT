// Simple Partials Loader (No PWA features)
class PartialsLoader {
    static async loadPartial(elementId, partialPath, pathPrefix = '') {
        const fullPath = pathPrefix + partialPath;
        
        try {
            const response = await fetch(fullPath);
            
            if (!response.ok) {
                console.warn(`Could not load ${fullPath}`);
                return;
            }
            
            const html = await response.text();
            const element = document.getElementById(elementId);
            
            if (element) {
                element.innerHTML = html;
                this.adjustPaths(element, pathPrefix);
            }
        } catch (error) {
            console.warn(`Error loading partial ${elementId}:`, error);
        }
    }

    static adjustPaths(element, pathPrefix) {
        // Adjust relative paths based on page depth
        const links = element.querySelectorAll('a[href]');
        const images = element.querySelectorAll('img[src]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
                if (pathPrefix && !href.startsWith(pathPrefix)) {
                    const newHref = pathPrefix + href;
                    link.setAttribute('href', newHref);
                }
            }
        });

        images.forEach(img => {
            const src = img.getAttribute('src');
            if (!src.startsWith('http') && !src.startsWith('data:') && pathPrefix && !src.startsWith(pathPrefix)) {
                const newSrc = pathPrefix + src;
                img.setAttribute('src', newSrc);
            }
        });
    }

    static getPathPrefix() {
        const path = window.location.pathname;
        
        // Determine prefix based on current location
        if (path.includes('/pages/grades/')) {
            return '../../../';
        } else if (path.includes('/pages/')) {
            return '../';
        } else if (path.includes('/admin/')) {
            return '../';
        } else {
            return '';
        }
    }

    static async loadAllPartials(customPrefix = null) {
        const pathPrefix = customPrefix || this.getPathPrefix();
        
        const partials = [
            { id: 'navbar-placeholder', path: 'partials/navbar.html' },
            { id: 'footer-placeholder', path: 'partials/footer.html' }
        ];

        const promises = partials.map(partial => 
            this.loadPartial(partial.id, partial.path, pathPrefix)
        );

        await Promise.all(promises);
        
        // Set active nav after loading
        setTimeout(() => {
            this.setActiveNav();
        }, 100);
    }

    static setActiveNav() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            if (!linkHref) return;
            
            const linkPage = linkHref.split('/').pop();
            
            // Handle different page matching scenarios
            if (linkPage === currentPage || 
                (currentPage === '' && linkPage === 'index.html') ||
                (currentPage === 'index.html' && linkPage === 'index.html') ||
                (currentPath.includes('/grades/') && linkHref.includes('index.html') && link.textContent.trim() === 'Home') ||
                (currentPath.includes('/about') && linkHref.includes('about.html')) ||
                (currentPath.includes('/contact') && linkHref.includes('contact.html'))) {
                link.classList.add('active');
            }
        });
    }
}

// Auto-load partials when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    PartialsLoader.loadAllPartials();
});

// Export for global use
window.PartialsLoader = PartialsLoader;