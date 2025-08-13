// Teaching Torch - Simple Main Scripts (No PWA features)
document.addEventListener('DOMContentLoaded', function() {
    initializeMainFeatures();
});

function initializeMainFeatures() {
    // Smooth scroll for anchor links
    setupSmoothScroll();
    
    // Grade card hover effects
    setupGradeCardEffects();
    
    // Search functionality
    initializeSearch();
    
    // Form handling
    setupForms();
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
        // Mouse enter effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.transition = 'all 0.3s ease';
            this.style.boxShadow = '0 15px 35px rgba(46, 125, 50, 0.2)';
        });
        
        // Mouse leave effect
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
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
        const cardContainer = card.closest('.col-md-4, .col-sm-6');
        
        if (cardText.includes(searchTerm)) {
            if (cardContainer) {
                cardContainer.style.display = 'block';
                card.style.opacity = '1';
            }
            hasResults = true;
        } else {
            if (cardContainer) {
                cardContainer.style.display = 'none';
                card.style.opacity = '0.5';
            }
        }
    });
    
    // Show search results
    showSearchResults(hasResults, searchTerm);
}

function resetSearch() {
    const gradeCards = document.querySelectorAll('.grade-card');
    gradeCards.forEach(card => {
        const cardContainer = card.closest('.col-md-4, .col-sm-6');
        if (cardContainer) {
            cardContainer.style.display = 'block';
        }
        card.style.opacity = '1';
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
            <div class="alert alert-info">
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
        showAlert('File size must be less than 50MB', 'warning');
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

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 90px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
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
});

// Export functions for global use
window.TeachingTorch = {
    showAlert,
    trackEvent,
    trackDownload,
    trackVideoView,
    formatFileSize,
    debounce
};