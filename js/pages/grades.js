// Enhanced Grade Pages Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    initializeGradeFeatures();
});

function initializeGradeFeatures() {
    // Resource Filter Functionality
    setupResourceFilters();
    
    // Download tracking
    setupDownloadTracking();
    
    // Video tracking
    setupVideoTracking();
    
    // Search functionality
    setupGradePageSearch();
    
    // Interactive enhancements
    setupInteractiveFeatures();
    
    // Print functionality
    setupPrintFeatures();
}

function setupResourceFilters() {
    const filterButtons = document.querySelectorAll('.resource-filter .btn');
    const resourceCards = document.querySelectorAll('[data-category]');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards with animation
            filterResources(resourceCards, filter);
            
            // Track filter usage
            window.TeachingTorch?.trackEvent('resource_filter', {
                filter_type: filter,
                page: window.location.pathname
            });
        });
    });
}

function filterResources(resourceCards, filter) {
    resourceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || cardCategory === filter;
        
        if (shouldShow) {
            card.style.display = 'block';
            card.classList.remove('fade-out');
            card.classList.add('fade-in');
        } else {
            card.classList.add('fade-out');
            setTimeout(() => {
                card.style.display = 'none';
                card.classList.remove('fade-out');
            }, 300);
        }
    });
    
    // Update resource count
    setTimeout(() => {
        updateResourceCount(filter);
    }, 350);
}

function updateResourceCount(filter) {
    const visibleCards = document.querySelectorAll('[data-category]:not([style*="display: none"])');
    const countElement = document.getElementById('resourceCount');
    
    if (countElement) {
        const count = visibleCards.length;
        const filterText = filter === 'all' ? 'All Resources' : filter.charAt(0).toUpperCase() + filter.slice(1);
        countElement.textContent = `${filterText}: ${count} items`;
    }
}

function setupDownloadTracking() {
    const downloadLinks = document.querySelectorAll('a[download], a[href$=".pdf"]');
    
    downloadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const filename = this.getAttribute('href').split('/').pop();
            const grade = extractGradeFromPath();
            const subject = extractSubjectFromCard(this);
            
            // Track download
            window.TeachingTorch?.trackDownload(filename, 'pdf', grade, subject);
            
            // Show download feedback
            showDownloadFeedback(this, filename);
            
            console.log(`Downloaded: ${filename}`);
        });
    });
}

function setupVideoTracking() {
    const videoLinks = document.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]');
    
    videoLinks.forEach(link => {
        link.addEventListener('click', function() {
            const videoTitle = this.closest('.video-card')?.querySelector('h6')?.textContent || 'Unknown Video';
            const grade = extractGradeFromPath();
            const subject = extractSubjectFromCard(this);
            
            // Track video view
            window.TeachingTorch?.trackVideoView(videoTitle, grade, subject);
            
            console.log(`Opened video: ${videoTitle}`);
        });
    });
}

function setupGradePageSearch() {
    // Create search input if it doesn't exist
    let searchInput = document.getElementById('gradeSearch');
    
    if (!searchInput) {
        searchInput = createSearchInput();
    }
    
    if (searchInput) {
        const debouncedSearch = window.TeachingTorch?.debounce(performGradeSearch, 300) || performGradeSearch;
        searchInput.addEventListener('input', function() {
            debouncedSearch(this.value);
        });
    }
}

function createSearchInput() {
    const container = document.querySelector('.container');
    if (!container) return null;
    
    const searchDiv = document.createElement('div');
    searchDiv.className = 'search-container mb-4';
    searchDiv.innerHTML = `
        <div class="input-group">
            <span class="input-group-text">
                <i class="bi bi-search"></i>
            </span>
            <input type="text" id="gradeSearch" class="form-control" placeholder="Search resources, subjects, or chapters...">
            <button class="btn btn-outline-secondary" type="button" id="clearSearch">
                <i class="bi bi-x"></i>
            </button>
        </div>
    `;
    
    // Insert after the header or at the beginning of container
    const firstChild = container.querySelector('section, .row, .subject-section');
    if (firstChild) {
        container.insertBefore(searchDiv, firstChild);
    } else {
        container.appendChild(searchDiv);
    }
    
    // Setup clear button
    const clearButton = document.getElementById('clearSearch');
    const searchInput = document.getElementById('gradeSearch');
    
    clearButton.addEventListener('click', function() {
        searchInput.value = '';
        performGradeSearch('');
    });
    
    return searchInput;
}

function performGradeSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    const subjects = document.querySelectorAll('.subject-section');
    const resourceCards = document.querySelectorAll('.resource-card, .note-card, .video-card');
    
    if (searchTerm.length === 0) {
        // Show all
        subjects.forEach(section => section.style.display = 'block');
        resourceCards.forEach(card => card.style.display = 'flex');
        hideSearchResults();
        return;
    }
    
    let hasResults = false;
    
    subjects.forEach(section => {
        const sectionText = section.textContent.toLowerCase();
        const sectionCards = section.querySelectorAll('.resource-card, .note-card, .video-card');
        let sectionHasResults = false;
        
        sectionCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            if (cardText.includes(searchTerm)) {
                card.style.display = 'flex';
                sectionHasResults = true;
                hasResults = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        section.style.display = sectionHasResults ? 'block' : 'none';
    });
    
    showGradeSearchResults(hasResults, searchTerm);
}

function showGradeSearchResults(hasResults, searchTerm) {
    let resultsDiv = document.getElementById('gradeSearchResults');
    
    if (!resultsDiv) {
        resultsDiv = document.createElement('div');
        resultsDiv.id = 'gradeSearchResults';
        resultsDiv.className = 'search-results mb-3';
        
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.appendChild(resultsDiv);
        }
    }
    
    if (!hasResults) {
        resultsDiv.innerHTML = `
            <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle me-2"></i>
                No resources found for "${searchTerm}". Try different keywords.
            </div>
        `;
    } else {
        resultsDiv.innerHTML = `
            <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                Showing results for "${searchTerm}"
            </div>
        `;
    }
}

function hideSearchResults() {
    const resultsDiv = document.getElementById('gradeSearchResults');
    if (resultsDiv) {
        resultsDiv.innerHTML = '';
    }
}

function setupInteractiveFeatures() {
    // Enhanced hover effects
    setupEnhancedHoverEffects();
    
    // Keyboard navigation
    setupKeyboardNavigation();
    
    // Copy link functionality
    setupCopyLinkFeature();
    
    // Resource preview
    setupResourcePreview();
}

function setupEnhancedHoverEffects() {
    const cards = document.querySelectorAll('.resource-card, .note-card, .video-card, .subject-section');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Add subtle glow
            if (this.classList.contains('resource-card')) {
                this.style.boxShadow = '0 20px 40px rgba(46, 125, 50, 0.15)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        });
    });
}

function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + F for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.getElementById('gradeSearch');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
        
        // Escape to clear search
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('gradeSearch');
            if (searchInput && searchInput.value) {
                searchInput.value = '';
                performGradeSearch('');
            }
        }
        
        // Number keys for quick filter
        if (e.altKey && e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const filterButtons = document.querySelectorAll('.resource-filter .btn');
            const index = parseInt(e.key) - 1;
            if (filterButtons[index]) {
                filterButtons[index].click();
            }
        }
    });
}

function setupCopyLinkFeature() {
    const downloadLinks = document.querySelectorAll('a[download]');
    
    downloadLinks.forEach(link => {
        // Add context menu for copying link
        link.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(this.href).then(() => {
                    window.TeachingTorch?.showAlert('Link copied to clipboard!', 'success');
                });
            }
        });
    });
}

function setupResourcePreview() {
    const resourceItems = document.querySelectorAll('.download-item, .paper-item');
    
    resourceItems.forEach(item => {
        const link = item.querySelector('a[download]');
        if (link && link.href.endsWith('.pdf')) {
            // Add preview button
            const previewBtn = document.createElement('button');
            previewBtn.className = 'btn btn-sm btn-outline-info ms-2';
            previewBtn.innerHTML = '<i class="bi bi-eye"></i>';
            previewBtn.title = 'Preview PDF';
            
            previewBtn.addEventListener('click', function() {
                openPDFPreview(link.href);
            });
            
            link.parentNode.appendChild(previewBtn);
        }
    });
}

function openPDFPreview(pdfUrl) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">PDF Preview</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-0">
                    <embed src="${pdfUrl}" type="application/pdf" width="100%" height="600px">
                </div>
                <div class="modal-footer">
                    <a href="${pdfUrl}" class="btn btn-primary" download>
                        <i class="bi bi-download me-2"></i>Download
                    </a>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

function setupPrintFeatures() {
    // Add print button
    const container = document.querySelector('.container');
    if (container) {
        const printBtn = document.createElement('button');
        printBtn.className = 'btn btn-outline-secondary btn-sm position-fixed';
        printBtn.style.cssText = 'top: 100px; right: 20px; z-index: 1000;';
        printBtn.innerHTML = '<i class="bi bi-printer me-1"></i>Print';
        printBtn.title = 'Print this page';
        
        printBtn.addEventListener('click', function() {
            window.print();
        });
        
        document.body.appendChild(printBtn);
    }
}

// Utility functions specific to grade pages
function extractGradeFromPath() {
    const path = window.location.pathname;
    const gradeMatch = path.match(/grade(\d+|al)/);
    return gradeMatch ? gradeMatch[0] : 'unknown';
}

function extractSubjectFromCard(element) {
    const subjectSection = element.closest('.subject-section');
    if (subjectSection) {
        const subjectHeader = subjectSection.querySelector('.subject-header h3');
        return subjectHeader ? subjectHeader.textContent.trim() : 'unknown';
    }
    return 'unknown';
}

function showDownloadFeedback(element, filename) {
    const feedback = document.createElement('div');
    feedback.className = 'download-feedback';
    feedback.innerHTML = '<i class="bi bi-check-circle text-success"></i>';
    feedback.style.cssText = 'position: absolute; top: -10px; right: -10px; z-index: 10;';
    
    element.style.position = 'relative';
    element.appendChild(feedback);
    
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.remove();
        }
    }, 2000);
}

// Export for debugging and testing
window.GradePageFeatures = {
    filterResources,
    performGradeSearch,
    extractGradeFromPath,
    extractSubjectFromCard
};