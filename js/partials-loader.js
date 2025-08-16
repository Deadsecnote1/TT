// Enhanced Partials Loader - NO NOTIFICATIONS
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
                
                if (elementId === 'navbar-placeholder') {
                    this.initializeNavbarAfterLoad();
                }
            }
        } catch (error) {
            console.warn(`Error loading partial ${elementId}:`, error);
        }
    }

    static adjustPaths(element, pathPrefix) {
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
        
        setTimeout(() => {
            this.setActiveNav();
        }, 100);
    }

    static initializeNavbarAfterLoad() {
        this.initializeLanguageFilter();
        this.initializeThemeToggle();
    }

    static initializeLanguageFilter() {
        const currentLang = localStorage.getItem('selectedLanguage') || 'english';
        localStorage.setItem('selectedLanguage', currentLang);
        
        this.updateLanguageDisplay(currentLang);
        
        document.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                const selectedLang = this.getAttribute('data-lang');
                PartialsLoader.setLanguage(selectedLang);
            });
        });
        
        setTimeout(() => {
            this.applyLanguageFilter(currentLang);
        }, 500);
    }

    static setLanguage(language) {
        localStorage.setItem('selectedLanguage', language);
        this.updateLanguageDisplay(language);
        this.applyLanguageFilter(language);
        
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: language } 
        }));
        
        // NO NOTIFICATION - Removed showLanguageChangeNotification
    }

    static updateLanguageDisplay(language) {
        const currentLanguageSpan = document.getElementById('currentLanguage');
        const languageNames = {
            'sinhala': 'සිංහල',
            'tamil': 'தমිழ්',
            'english': 'English'
        };
        
        if (currentLanguageSpan) {
            currentLanguageSpan.textContent = languageNames[language] || 'English';
        }
        
        document.querySelectorAll('.language-option').forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-lang') === language) {
                option.classList.add('active');
            }
        });
    }

    static applyLanguageFilter(language) {
        document.querySelectorAll('.textbook-medium-card').forEach(card => {
            const cardClasses = card.className.toLowerCase();
            if (cardClasses.includes(language)) {
                card.style.display = 'block';
                card.style.opacity = '1';
            } else {
                card.style.display = 'none';
            }
        });
        
        document.querySelectorAll('[data-language]').forEach(item => {
            const itemLang = item.getAttribute('data-language');
            if (itemLang === language) {
                item.style.display = '';
                item.style.opacity = '1';
            } else {
                item.style.display = 'none';
            }
        });
        
        document.querySelectorAll('.note-card').forEach(card => {
            const cardLang = card.getAttribute('data-language');
            if (cardLang === language || (cardLang === null && language === 'english')) {
                card.style.display = 'flex';
                card.style.opacity = '1';
            } else {
                card.style.display = 'none';
            }
        });
        
        document.querySelectorAll('.video-card').forEach(card => {
            const cardLang = card.getAttribute('data-language');
            if (cardLang === language || (cardLang === null && language === 'english')) {
                card.style.display = 'block';
                card.style.opacity = '1';
            } else {
                card.style.display = 'none';
            }
        });
        
        document.querySelectorAll('.paper-item-enhanced, .paper-item').forEach(item => {
            const itemLang = item.getAttribute('data-language');
            if (itemLang === language || (itemLang === null && language === 'english')) {
                item.style.display = 'flex';
                item.style.opacity = '1';
            } else {
                item.style.display = 'none';
            }
        });
        
        this.hideEmptySections();
        
        if (typeof updateResourceCounts === 'function') {
            updateResourceCounts();
        }
        
        if (typeof applyLanguageFilterToSubject === 'function') {
            applyLanguageFilterToSubject(language);
        }
    }

    static hideEmptySections() {
        document.querySelectorAll('.subject-section').forEach(section => {
            const visibleItems = section.querySelectorAll(`
                .textbook-medium-card:not([style*="display: none"]), 
                .note-card:not([style*="display: none"]), 
                .video-card:not([style*="display: none"]), 
                .paper-item-enhanced:not([style*="display: none"]),
                .paper-item:not([style*="display: none"])
            `);
            
            if (visibleItems.length === 0) {
                section.style.display = 'none';
            } else {
                section.style.display = 'block';
            }
        });
        
        document.querySelectorAll('.paper-category-section').forEach(section => {
            const visiblePapers = section.querySelectorAll('.paper-item-enhanced:not([style*="display: none"])');
            if (visiblePapers.length === 0) {
                section.style.display = 'none';
            } else {
                section.style.display = 'block';
            }
        });

        const allVisibleContent = document.querySelectorAll(`
            .textbook-medium-card:not([style*="display: none"]), 
            .note-card:not([style*="display: none"]), 
            .video-card:not([style*="display: none"]), 
            .paper-item-enhanced:not([style*="display: none"]),
            .paper-item:not([style*="display: none"])
        `);

        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
            if (allVisibleContent.length === 0) {
                emptyState.style.display = 'block';
            } else {
                emptyState.style.display = 'none';
            }
        }
    }

    static initializeThemeToggle() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme, false); // false = no notification on load
        
        const themeToggleBtn = document.getElementById('themeToggle');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', function() {
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                PartialsLoader.setTheme(newTheme, true); // true = show notification only when user clicks
            });
        }
    }

    static setTheme(theme, showNotification = false) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.className = 'bi bi-sun-fill';
            } else {
                themeIcon.className = 'bi bi-moon-fill';
            }
        }
        
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: theme } 
        }));
        
        // Only log to console, no visual notification
        if (showNotification) {
            console.log(`${theme === 'dark' ? 'Dark' : 'Light'} mode activated`);
        }
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

    static observeContentChanges() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    const currentLang = localStorage.getItem('selectedLanguage') || 'english';
                    setTimeout(() => PartialsLoader.applyLanguageFilter(currentLang), 100);
                }
            });
        });
        
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            observer.observe(mainContent, { childList: true, subtree: true });
        }
    }
}

// Auto-load partials when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    PartialsLoader.loadAllPartials();
    
    PartialsLoader.observeContentChanges();
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'english';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    localStorage.setItem('selectedLanguage', savedLanguage);
});

// Apply language filter when page loads
window.addEventListener('load', function() {
    const currentLang = localStorage.getItem('selectedLanguage') || 'english';
    setTimeout(() => {
        PartialsLoader.applyLanguageFilter(currentLang);
    }, 1000);
});

// Export for global use
window.PartialsLoader = PartialsLoader;

// Export functions for global use
window.LanguageFilter = {
    setLanguage: (lang) => PartialsLoader.setLanguage(lang),
    applyLanguageFilter: (lang) => PartialsLoader.applyLanguageFilter(lang),
    getCurrentLanguage: () => localStorage.getItem('selectedLanguage') || 'english'
};

window.ThemeManager = {
    setTheme: (theme) => PartialsLoader.setTheme(theme, false), // No notification for programmatic changes
    getCurrentTheme: () => document.documentElement.getAttribute('data-theme') || 'light'
};