// Enhanced Homepage Script with Dark Mode & Language Filter Support
document.addEventListener('DOMContentLoaded', function() {
    initializeHomepage();
});

function initializeHomepage() {
    // Initialize theme from saved preference
    initializeThemeOnHomepage();
    
    // Initialize language filter
    initializeLanguageOnHomepage();
    
    // Setup main homepage features
    setupSmoothScroll();
    setupGradeCardEffects();
    initializeSearch();
    setupForms();
    
    // Listen for theme and language changes
    setupEventListeners();
}

function initializeThemeOnHomepage() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
    
    // Update theme icon if it exists
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.className = savedTheme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    }
}

function initializeLanguageOnHomepage() {
    // Set English as default if no language is stored
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'english';
    localStorage.setItem('selectedLanguage', savedLanguage);
    
    // Update language display
    const currentLanguageSpan = document.getElementById('currentLanguage');
    if (currentLanguageSpan) {
        const languageNames = {
            'sinhala': 'සිංහල',
            'tamil': 'தமிழ්',
            'english': 'English'
        };
        currentLanguageSpan.textContent = languageNames[savedLanguage] || 'English';
    }
    
    // Set active language option
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === savedLanguage) {
            option.classList.add('active');
        }
    });
}

function setupEventListeners() {
    // Listen for theme changes
    window.addEventListener('themeChanged', function(e) {
        const theme = e.detail.theme;
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
    });
    
    // Listen for language changes
    window.addEventListener('languageChanged', function(e) {
        const language = e.detail.language;
        applyLanguageFilterToHomepage(language);
    });
}

function applyLanguageFilterToHomepage(language) {
    // Since homepage doesn't have language-specific content,
    // we just store the preference for other pages
    localStorage.setItem('selectedLanguage', language);
    
    // Show notification that language preference is saved
    showNotification(`Language preference saved: ${getLanguageDisplayName(language)}`, 'info');
}

function getLanguageDisplayName(language) {
    const names = {
        'sinhala': 'සිංහල (Sinhala)',
        'tamil': 'தமිழ් (Tamil)',
        'english': 'English'
    };
    return names[language] || 'English';
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function setupGradeCardEffects() {
    const gradeCards = document.querySelectorAll('.grade-card, .feature-card');
    
    gradeCards.forEach(card => {
        // Enhanced hover effects that work with both themes
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.transition = 'all 0.3s ease';
            
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            if (currentTheme === 'dark') {
                this.style.boxShadow = '0 15px 35px rgba(255, 255, 255, 0.1)';
            } else {
                this.style.boxShadow = '0 15px 35px rgba(46, 125, 50, 0.2)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            if (currentTheme === 'dark') {
                this.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
            } else {
                this.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
            }
        });
        
        // Click effect
        card.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-8px) scale(0.98)';
        });
        
        card.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
    });
}

function initializeSearch() {
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(this.value);
            }, 300);
        });
        
        // Add keyboard shortcut for search (Ctrl/Cmd + K)
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
                searchInput.select();
            }
        });
    }
}

function performSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (searchTerm.length < 2) {
        resetSearch();
        return;
    }
    
    // Search through grade cards
    const gradeCards = document.querySelectorAll('.grade-card');
    let hasResults = false;
    
    gradeCards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        const cardContainer = card.closest('.col-md-4, .col-sm-6, .col-md-6');
        
        if (cardText.includes(searchTerm)) {
            if (cardContainer) {
                cardContainer.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'scale(1.05)';
                card.style.border = '2px solid var(--primary)';
            }
            hasResults = true;
        } else {
            if (cardContainer) {
                cardContainer.style.display = 'none';
            }
        }
    });
    
    // Show search results
    showSearchResults(hasResults, searchTerm);
}

function resetSearch() {
    const gradeCards = document.querySelectorAll('.grade-card');
    gradeCards.forEach(card => {
        const cardContainer = card.closest('.col-md-4, .col-sm-6, .col-md-6');
        if (cardContainer) {
            cardContainer.style.display = 'block';
        }
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        card.style.border = 'none';
    });
    
    hideSearchResults();
}

function showSearchResults(hasResults, searchTerm) {
    let resultsDiv = document.getElementById('searchResults');
    
    if (!resultsDiv) {
        resultsDiv = document.createElement('div');
        resultsDiv.id = 'searchResults';
        resultsDiv.className = 'search-results mt-3';
        
        const gradesSection = document.getElementById('grades');
        if (gradesSection) {
            gradesSection.appendChild(resultsDiv);
        }
    }
    
    if (!hasResults) {
        resultsDiv.innerHTML = `
            <div class="alert alert-warning">
                <i class="bi bi-search me-2"></i>
                No results found for "${searchTerm}". Try searching for grade numbers or subjects.
            </div>
        `;
    } else {
        resultsDiv.innerHTML = `
            <div class="alert alert-success">
                <i class="bi bi-check-circle me-2"></i>
                Search results for "${searchTerm}"
            </div>
        `;
    }
}

function hideSearchResults() {
    const resultsDiv = document.getElementById('searchResults');
    if (resultsDiv) {
        resultsDiv.remove();
    }
}

function setupForms() {
    // Handle form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
    
    // Handle file uploads
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', handleFileUpload);
    });
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
        
        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error text-danger small mt-1';
    errorDiv.textContent = message;
    
    field.classList.add('is-invalid');
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const input = event.target;
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    // File size validation
    if (file.size > maxSize) {
        showNotification('File size must be less than 50MB', 'warning');
        input.value = '';
        return;
    }
    
    // Show file info
    showFileInfo(input, file);
}

function showFileInfo(input, file) {
    const fileInfo = document.createElement('div');
    fileInfo.className = 'file-info mt-2 p-2 bg-light rounded';
    fileInfo.innerHTML = `
        <small class="text-muted">
            <i class="bi bi-file-earmark me-1"></i>
            ${file.name} (${formatFileSize(file.size)})
        </small>
    `;
    
    // Remove existing file info
    const existingInfo = input.parentNode.querySelector('.file-info');
    if (existingInfo) {
        existingInfo.remove();
    }
    
    input.parentNode.appendChild(fileInfo);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 90px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${getAlertIcon(type)}
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function getAlertIcon(type) {
    const icons = {
        'success': '<i class="bi bi-check-circle me-2"></i>',
        'danger': '<i class="bi bi-exclamation-triangle me-2"></i>',
        'warning': '<i class="bi bi-exclamation-triangle me-2"></i>',
        'info': '<i class="bi bi-info-circle me-2"></i>'
    };
    return icons[type] || '<i class="bi bi-info-circle me-2"></i>';
}

// Utility functions
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

// Track events (simplified)
function trackEvent(eventName, properties = {}) {
    console.log('Event tracked:', eventName, properties);
}

// Download tracking
function trackDownload(filename, fileType, grade, subject) {
    trackEvent('file_download', {
        filename: filename,
        file_type: fileType,
        grade: grade,
        subject: subject
    });
}

// Video tracking
function trackVideoView(videoTitle, grade, subject) {
    trackEvent('video_view', {
        video_title: videoTitle,
        grade: grade,
        subject: subject
    });
}

// Handle external links
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href) {
        // Track downloads
        if (link.hasAttribute('download') || link.href.endsWith('.pdf')) {
            const filename = link.href.split('/').pop();
            console.log(`Download tracked: ${filename}`);
            trackDownload(filename, 'pdf', 'homepage', 'general');
        }
        
        // Track external links
        if (link.hostname !== window.location.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'danger');
});

// Theme transition effects
function addThemeTransitions() {
    const style = document.createElement('style');
    style.textContent = `
        * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
        }
        
        .grade-card, .feature-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease !important;
        }
        
        .navbar {
            transition: background-color 0.3s ease !important;
        }
    `;
    document.head.appendChild(style);
}

// Initialize theme transitions
addThemeTransitions();

// Export functions for global use
window.TeachingTorch = {
    showNotification,
    trackEvent,
    trackDownload,
    trackVideoView,
    formatFileSize,
    debounce,
    initializeThemeOnHomepage,
    initializeLanguageOnHomepage
};

// Apply initial theme and language settings immediately
const savedTheme = localStorage.getItem('theme') || 'light';
const savedLanguage = localStorage.getItem('selectedLanguage') || 'english';

// Set initial theme
document.documentElement.setAttribute('data-theme', savedTheme);
document.body.setAttribute('data-theme', savedTheme);

// Store language preference
localStorage.setItem('selectedLanguage', savedLanguage);