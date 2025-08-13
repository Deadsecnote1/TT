// Enhanced Contact Page Scripts
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    setupFormValidation();
    setupFormEnhancements();
});

function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission();
    });
}

function setupFormValidation() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    // Message length validation
    if (field.id === 'message' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters long.';
    }
    
    // Name validation
    if (field.id === 'name' && value && value.length < 2) {
        isValid = false;
        errorMessage = 'Name must be at least 2 characters long.';
    }
    
    // Subject validation
    if (field.id === 'subject' && value && value.length < 3) {
        isValid = false;
        errorMessage = 'Subject must be at least 3 characters long.';
    }
    
    // Update field appearance
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        removeErrorMessage(field);
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        showErrorMessage(field, errorMessage);
    }
    
    return isValid;
}

function showErrorMessage(field, message) {
    removeErrorMessage(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function removeErrorMessage(field) {
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
}

function handleFormSubmission() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Add additional data
    data.timestamp = new Date().toISOString();
    data.userAgent = navigator.userAgent;
    data.referrer = document.referrer;
    
    // Validate all fields
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showAlert('Please correct the errors in the form.', 'danger');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
        // Store the message locally (in a real app, send to server)
        storeMessage(data);
        
        // Show success message
        showAlert('Thank you for your message! We will get back to you soon.', 'success');
        
        // Reset form
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
        
        // Track submission
        if (window.TeachingTorch?.trackEvent) {
            window.TeachingTorch.trackEvent('contact_form_submit', {
                category: data.category,
                grade: data.grade,
                has_newsletter: data.newsletter === 'on'
            });
        }
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
    }, 2000); // Simulate network delay
}

function storeMessage(data) {
    // Store messages in localStorage (in production, send to server)
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push(data);
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    
    console.log('Message stored:', data);
}

function setupFormEnhancements() {
    // Character count for message field
    const messageField = document.getElementById('message');
    if (messageField) {
        const charCount = document.createElement('small');
        charCount.className = 'form-text text-muted';
        charCount.id = 'messageCharCount';
        messageField.parentNode.appendChild(charCount);
        
        function updateCharCount() {
            const length = messageField.value.length;
            const maxLength = 1000;
            charCount.textContent = `${length}/${maxLength} characters`;
            
            if (length > maxLength * 0.9) {
                charCount.classList.add('text-warning');
            } else {
                charCount.classList.remove('text-warning');
            }
        }
        
        messageField.addEventListener('input', updateCharCount);
        messageField.setAttribute('maxlength', '1000');
        updateCharCount();
    }
    
    // Auto-expand textarea
    if (messageField) {
        messageField.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
    
    // Grade-based subject suggestions
    const gradeSelect = document.getElementById('grade');
    const subjectInput = document.getElementById('subject');
    
    if (gradeSelect && subjectInput) {
        gradeSelect.addEventListener('change', function() {
            const grade = this.value;
            if (grade && grade !== 'teacher' && grade !== 'parent' && grade !== 'other') {
                subjectInput.placeholder = `Question about ${grade} resources`;
            } else {
                subjectInput.placeholder = 'Brief subject of your message';
            }
        });
    }
    
    // Category-based message templates
    const categorySelect = document.getElementById('category');
    if (categorySelect && messageField) {
        categorySelect.addEventListener('change', function() {
            const category = this.value;
            const templates = {
                'feedback': 'I would like to provide feedback about...',
                'suggestion': 'I suggest that you consider...',
                'technical': 'I am experiencing a technical issue with...',
                'content': 'I would like to request content for...',
                'collaboration': 'I am interested in collaborating with Teaching Torch...'
            };
            
            if (templates[category] && !messageField.value.trim()) {
                messageField.value = templates[category];
                messageField.focus();
                messageField.setSelectionRange(templates[category].length, templates[category].length);
            }
        });
    }
    
    // Form progress indicator
    setupFormProgress();
    
    // Save form data locally (draft)
    setupFormDraft();
}

function setupFormProgress() {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('input[required], textarea[required]');
    const totalFields = requiredFields.length;
    
    // Create progress indicator
    const progressContainer = document.createElement('div');
    progressContainer.className = 'form-progress mb-3';
    progressContainer.innerHTML = `
        <small class="text-muted">Form completion: <span id="progressText">0%</span></small>
        <div class="progress" style="height: 4px;">
            <div class="progress-bar" id="progressBar" style="width: 0%"></div>
        </div>
    `;
    
    const formHeader = document.querySelector('.form-header');
    formHeader.appendChild(progressContainer);
    
    function updateProgress() {
        let filledFields = 0;
        
        requiredFields.forEach(field => {
            if (field.value.trim()) {
                filledFields++;
            }
        });
        
        const percentage = Math.round((filledFields / totalFields) * 100);
        document.getElementById('progressText').textContent = `${percentage}%`;
        document.getElementById('progressBar').style.width = `${percentage}%`;
        
        // Change color based on completion
        const progressBar = document.getElementById('progressBar');
        if (percentage < 50) {
            progressBar.className = 'progress-bar bg-danger';
        } else if (percentage < 80) {
            progressBar.className = 'progress-bar bg-warning';
        } else {
            progressBar.className = 'progress-bar bg-success';
        }
    }
    
    requiredFields.forEach(field => {
        field.addEventListener('input', updateProgress);
    });
    
    updateProgress();
}

function setupFormDraft() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    const draftKey = 'contactFormDraft';
    
    // Load saved draft
    function loadDraft() {
        const draft = localStorage.getItem(draftKey);
        if (draft) {
            try {
                const data = JSON.parse(draft);
                Object.keys(data).forEach(key => {
                    const field = document.getElementById(key);
                    if (field) {
                        field.value = data[key];
                        if (field.type === 'checkbox') {
                            field.checked = data[key];
                        }
                    }
                });
                
                // Show draft loaded message
                showAlert('Previously saved draft loaded.', 'info');
            } catch (e) {
                console.error('Error loading draft:', e);
            }
        }
    }
    
    // Save draft
    function saveDraft() {
        const data = {};
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                data[input.id] = input.checked;
            } else {
                data[input.id] = input.value;
            }
        });
        
        localStorage.setItem(draftKey, JSON.stringify(data));
    }
    
    // Auto-save every 30 seconds
    setInterval(saveDraft, 30000);
    
    // Save on input change
    inputs.forEach(input => {
        input.addEventListener('input', debounce(saveDraft, 1000));
    });
    
    // Clear draft on successful submission
    form.addEventListener('submit', function() {
        setTimeout(() => {
            localStorage.removeItem(draftKey);
        }, 3000);
    });
    
    // Load draft on page load
    loadDraft();
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 90px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        <i class="bi bi-${getAlertIcon(type)} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function getAlertIcon(type) {
    const icons = {
        'success': 'check-circle',
        'danger': 'exclamation-triangle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
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

// Export for testing
window.ContactForm = {
    validateField,
    handleFormSubmission,
    storeMessage,
    showAlert
};