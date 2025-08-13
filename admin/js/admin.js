// Enhanced Admin Dashboard JavaScript with Papers Management
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!localStorage.getItem('adminLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    initializeAdmin();
});

function initializeAdmin() {
    setupNavigation();
    loadDashboard();
    setupEventListeners();
    populateDropdowns();
}

// Navigation setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.admin-sidebar .nav-link, [data-section]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            if (section) {
                showSection(section);
                updateActiveNav(this);
            }
        });
    });
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
        
        // Load section-specific data
        switch(sectionId) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'grades':
                loadGradesManagement();
                break;
            case 'subjects':
                loadSubjectsManagement();
                break;
            case 'textbooks':
                loadTextbooksManagement();
                break;
            case 'papers':
                loadPapersManagement();
                break;
            case 'videos':
                loadVideosManagement();
                break;
        }
    }
}

function updateActiveNav(activeLink) {
    document.querySelectorAll('.admin-sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    if (activeLink.classList.contains('nav-link')) {
        activeLink.classList.add('active');
    } else {
        const section = activeLink.getAttribute('data-section');
        const sidebarLink = document.querySelector(`.admin-sidebar .nav-link[data-section="${section}"]`);
        if (sidebarLink) {
            sidebarLink.classList.add('active');
        }
    }
}

// Dashboard functions
function loadDashboard() {
    const stats = window.dataManager.getStats();
    
    document.getElementById('totalGrades').textContent = stats.totalGrades;
    document.getElementById('totalSubjects').textContent = stats.totalSubjects;
    document.getElementById('totalResources').textContent = stats.totalResources;
    document.getElementById('totalVideos').textContent = stats.totalVideos;
    
    loadRecentActivity();
}

function loadRecentActivity() {
    const activities = window.dataManager.getRecentActivities(5);
    const container = document.getElementById('recentActivity');
    
    container.innerHTML = '';
    
    if (activities.length === 0) {
        container.innerHTML = '<div class="activity-item"><span>No recent activity</span></div>';
        return;
    }
    
    activities.forEach(activity => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        
        const timeAgo = getTimeAgo(new Date(activity.timestamp));
        
        item.innerHTML = `
            <i class="bi bi-clock text-info"></i>
            <span>${activity.message}</span>
            <small class="text-muted">${timeAgo}</small>
        `;
        
        container.appendChild(item);
    });
}

// Grades Management
function loadGradesManagement() {
    const grades = window.dataManager.getGrades();
    const tbody = document.getElementById('gradesTable');
    
    tbody.innerHTML = '';
    
    Object.keys(grades).forEach(gradeId => {
        const grade = grades[gradeId];
        const subjects = window.dataManager.getSubjectsForGrade(gradeId);
        const subjectCount = Object.keys(subjects).length;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${gradeId}</strong></td>
            <td>${grade.display}</td>
            <td><span class="badge bg-info">${subjectCount} subjects</span></td>
            <td>
                <span class="badge ${grade.active ? 'bg-success' : 'bg-secondary'}">
                    ${grade.active ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editGrade('${gradeId}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteGrade('${gradeId}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Subjects Management
function loadSubjectsManagement() {
    populateGradeCheckboxes();
    loadSubjectsList();
}

function populateGradeCheckboxes() {
    const grades = window.dataManager.getGrades();
    const container = document.getElementById('gradeCheckboxes');
    
    container.innerHTML = '';
    
    Object.keys(grades).forEach(gradeId => {
        const grade = grades[gradeId];
        const checkDiv = document.createElement('div');
        checkDiv.className = 'form-check';
        checkDiv.innerHTML = `
            <input class="form-check-input" type="checkbox" value="${gradeId}" id="grade_${gradeId}">
            <label class="form-check-label" for="grade_${gradeId}">
                ${grade.display}
            </label>
        `;
        container.appendChild(checkDiv);
    });
}

function loadSubjectsList() {
    const subjects = window.dataManager.getSubjects();
    const container = document.getElementById('subjectsList');
    
    container.innerHTML = '';
    
    Object.keys(subjects).forEach(subjectId => {
        const subject = subjects[subjectId];
        const item = document.createElement('div');
        item.className = 'subject-item';
        item.innerHTML = `
            <div>
                <i class="${subject.icon} me-2"></i>
                <strong>${subject.name}</strong>
                <br>
                <small class="text-muted">${subject.grades.length} grades</small>
            </div>
            <div>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteSubject('${subjectId}')">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

// Textbooks Management
function loadTextbooksManagement() {
    loadTextbooksList();
}

function loadTextbooksList() {
    const grades = window.dataManager.getGrades();
    const container = document.getElementById('textbooksList');
    
    container.innerHTML = '';
    
    Object.keys(grades).forEach(gradeId => {
        const grade = grades[gradeId];
        const subjects = window.dataManager.getSubjectsForGrade(gradeId);
        
        Object.keys(subjects).forEach(subjectId => {
            const subject = subjects[subjectId];
            const resources = window.dataManager.getResources(gradeId, subjectId);
            
            if (resources.textbooks && Object.keys(resources.textbooks).length > 0) {
                Object.keys(resources.textbooks).forEach(medium => {
                    const textbook = resources.textbooks[medium];
                    const item = document.createElement('div');
                    item.className = 'resource-item';
                    item.innerHTML = `
                        <div class="resource-info">
                            <h6>${subject.name} - ${medium} (${grade.display})</h6>
                            <small class="text-muted">${textbook.filename} • ${formatFileSize(textbook.size)}</small>
                        </div>
                        <div class="resource-actions">
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteTextbook('${gradeId}', '${subjectId}', '${medium}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    `;
                    container.appendChild(item);
                });
            }
        });
    });
    
    if (container.children.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No textbooks uploaded yet.</div>';
    }
}

// Enhanced Papers Management
function loadPapersManagement() {
    setupPapersManagement();
    loadPapersList();
}

function setupPapersManagement() {
    // Populate dropdowns
    populatePapersDropdowns();
    
    // Setup event listeners
    const paperTypeSelect = document.getElementById('paperType');
    if (paperTypeSelect) {
        paperTypeSelect.addEventListener('change', updatePaperCategories);
    }
    
    const paperGradeSelect = document.getElementById('paperGrade');
    if (paperGradeSelect) {
        paperGradeSelect.addEventListener('change', function() {
            populateSubjectDropdown('paperSubject', this.value);
        });
    }
    
    // Filter listeners
    ['filterGrade', 'filterSubject', 'filterType'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', filterPapers);
        }
    });
}

function populatePapersDropdowns() {
    const grades = window.dataManager.getGrades();
    
    // Populate grade dropdowns
    ['paperGrade', 'filterGrade'].forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        if (selectId === 'filterGrade') {
            select.innerHTML = '<option value="">All Grades</option>';
        } else {
            select.innerHTML = '<option value="">Select Grade</option>';
        }
        
        Object.keys(grades).forEach(gradeId => {
            const option = document.createElement('option');
            option.value = gradeId;
            option.textContent = grades[gradeId].display;
            select.appendChild(option);
        });
    });
    
    // Populate filter subjects
    const subjects = window.dataManager.getSubjects();
    const filterSubject = document.getElementById('filterSubject');
    if (filterSubject) {
        filterSubject.innerHTML = '<option value="">All Subjects</option>';
        Object.keys(subjects).forEach(subjectId => {
            const option = document.createElement('option');
            option.value = subjectId;
            option.textContent = subjects[subjectId].name;
            filterSubject.appendChild(option);
        });
    }
}

function updatePaperCategories() {
    const paperType = document.getElementById('paperType').value;
    const categorySelect = document.getElementById('paperCategory');
    
    if (!categorySelect) return;
    
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    
    if (paperType === 'term') {
        ['term1', 'term2', 'term3'].forEach(term => {
            const option = document.createElement('option');
            option.value = term;
            option.textContent = term.charAt(0).toUpperCase() + term.slice(1).replace(/(\d+)/, ' $1');
            categorySelect.appendChild(option);
        });
    } else if (paperType === 'chapter') {
        for (let i = 1; i <= 20; i++) {
            const option = document.createElement('option');
            option.value = `chapter${i}`;
            option.textContent = `Chapter ${i}`;
            categorySelect.appendChild(option);
        }
    }
}

async function handlePaperSubmission(e) {
    e.preventDefault();
    
    const formData = {
        gradeId: document.getElementById('paperGrade').value,
        subjectId: document.getElementById('paperSubject').value,
        paperType: document.getElementById('paperType').value,
        paperCategory: document.getElementById('paperCategory').value,
        schoolName: document.getElementById('schoolName').value,
        file: document.getElementById('paperFile').files[0]
    };
    
    // Validation
    if (!formData.gradeId || !formData.subjectId || !formData.paperType || !formData.paperCategory || !formData.file) {
        showAlert('Please fill in all required fields and select a file.', 'warning');
        return;
    }
    
    if (formData.file.type !== 'application/pdf') {
        showAlert('Please select a PDF file.', 'warning');
        return;
    }
    
    // Show loading state
    const btn = document.querySelector('#addPaperForm button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Uploading...';
    btn.disabled = true;
    
    try {
        const path = `${formData.gradeId}/${formData.subjectId}/papers`;
        const fileData = await window.dataManager.simulateFileUpload(formData.file, path);
        
        // Add paper using enhanced method
        window.dataManager.addPaper(
            formData.gradeId,
            formData.subjectId,
            formData.paperType,
            formData.paperCategory,
            fileData,
            formData.schoolName
        );
        
        showAlert('Paper uploaded successfully!', 'success');
        document.getElementById('addPaperForm').reset();
        loadPapersList();
        
    } catch (error) {
        showAlert('Upload failed. Please try again.', 'danger');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function loadPapersList() {
    const container = document.getElementById('papersList');
    if (!container) return;
    
    container.innerHTML = '';
    
    const grades = window.dataManager.getGrades();
    let hasAnyPapers = false;
    
    Object.keys(grades).forEach(gradeId => {
        const grade = grades[gradeId];
        const subjects = window.dataManager.getSubjectsForGrade(gradeId);
        
        const gradeGroup = document.createElement('div');
        gradeGroup.className = 'paper-group';
        gradeGroup.setAttribute('data-grade', gradeId);
        
        const gradeHeader = document.createElement('div');
        gradeHeader.className = 'paper-group-header';
        gradeHeader.innerHTML = `${grade.display} Papers`;
        gradeGroup.appendChild(gradeHeader);
        
        let gradeHasPapers = false;
        
        Object.keys(subjects).forEach(subjectId => {
            const subject = subjects[subjectId];
            const resources = window.dataManager.getResources(gradeId, subjectId);
            
            if (resources.papers && (
                (resources.papers.terms && Object.keys(resources.papers.terms).some(term => 
                    Array.isArray(resources.papers.terms[term]) && resources.papers.terms[term].length > 0)) ||
                (resources.papers.chapters && Object.keys(resources.papers.chapters).some(chapter => 
                    Array.isArray(resources.papers.chapters[chapter]) && resources.papers.chapters[chapter].length > 0))
            )) {
                gradeHasPapers = true;
                hasAnyPapers = true;
                
                const subjectSection = createSubjectSection(gradeId, subjectId, subject, resources.papers);
                gradeGroup.appendChild(subjectSection);
            }
        });
        
        if (gradeHasPapers) {
            container.appendChild(gradeGroup);
        }
    });
    
    if (!hasAnyPapers) {
        container.innerHTML = '<div class="no-papers"><i class="bi bi-file-earmark-text fs-1 text-muted"></i><p class="mt-2">No papers uploaded yet.</p></div>';
    }
}

function createSubjectSection(gradeId, subjectId, subject, papers) {
    const section = document.createElement('div');
    section.className = 'paper-category-section';
    section.setAttribute('data-subject', subjectId);
    
    // Subject header
    const subjectHeader = document.createElement('div');
    subjectHeader.className = 'paper-category-header';
    
    const totalPapers = countSubjectPapers(papers);
    subjectHeader.innerHTML = `
        <span><i class="${subject.icon} me-2"></i>${subject.name}</span>
        <span class="papers-count">${totalPapers} papers</span>
    `;
    section.appendChild(subjectHeader);
    
    // Term papers
    if (papers.terms) {
        Object.keys(papers.terms).forEach(termKey => {
            const termPapers = papers.terms[termKey];
            if (Array.isArray(termPapers) && termPapers.length > 0) {
                const termSection = createPaperCategorySection(gradeId, subjectId, 'term', termKey, termPapers);
                section.appendChild(termSection);
            }
        });
    }
    
    // Chapter papers
    if (papers.chapters) {
        Object.keys(papers.chapters).forEach(chapterKey => {
            const chapterPapers = papers.chapters[chapterKey];
            if (Array.isArray(chapterPapers) && chapterPapers.length > 0) {
                const chapterSection = createPaperCategorySection(gradeId, subjectId, 'chapter', chapterKey, chapterPapers);
                section.appendChild(chapterSection);
            }
        });
    }
    
    return section;
}

function createPaperCategorySection(gradeId, subjectId, paperType, categoryKey, papers) {
    const section = document.createElement('div');
    section.setAttribute('data-paper-type', paperType);
    
    // Category header
    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'paper-category-header';
    categoryHeader.style.backgroundColor = '#f8f9fa';
    categoryHeader.style.paddingLeft = '2.5rem';
    
    const categoryName = paperType === 'term' ? 
        categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1).replace(/(\d+)/, ' $1') :
        `Chapter ${categoryKey.replace('chapter', '')}`;
        
    categoryHeader.innerHTML = `
        <span>${categoryName}</span>
        <span class="papers-count">${papers.length} papers</span>
    `;
    section.appendChild(categoryHeader);
    
    // Papers list
    const papersList = document.createElement('div');
    papersList.className = 'paper-list';
    
    papers.forEach(paper => {
        const paperItem = createPaperItem(gradeId, subjectId, paperType, categoryKey, paper);
        papersList.appendChild(paperItem);
    });
    
    section.appendChild(papersList);
    return section;
}

function createPaperItem(gradeId, subjectId, paperType, categoryKey, paper) {
    const item = document.createElement('div');
    item.className = 'paper-item-enhanced';
    
    const uploadDate = new Date(paper.uploadDate).toLocaleDateString();
    const fileSize = formatFileSize(paper.size);
    
    item.innerHTML = `
        <div class="paper-info">
            <h6>${paper.filename}</h6>
            <div class="paper-meta">
                <span>Uploaded: ${uploadDate}</span> • 
                <span>Size: ${fileSize}</span>
                ${paper.school ? `<span class="school-badge">${paper.school}</span>` : ''}
            </div>
        </div>
        <div class="paper-actions">
            <a href="${paper.path}" class="btn btn-sm btn-outline-primary" download>
                <i class="bi bi-download"></i>
            </a>
            <button class="btn btn-sm btn-outline-danger" onclick="deletePaperItem('${gradeId}', '${subjectId}', '${paperType}', '${categoryKey}', '${paper.id}')">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
    
    return item;
}

function countSubjectPapers(papers) {
    let count = 0;
    
    if (papers.terms) {
        Object.keys(papers.terms).forEach(term => {
            if (Array.isArray(papers.terms[term])) {
                count += papers.terms[term].length;
            }
        });
    }
    
    if (papers.chapters) {
        Object.keys(papers.chapters).forEach(chapter => {
            if (Array.isArray(papers.chapters[chapter])) {
                count += papers.chapters[chapter].length;
            }
        });
    }
    
    return count;
}

function deletePaperItem(gradeId, subjectId, paperType, categoryKey, paperId) {
    if (confirm('Are you sure you want to delete this paper?')) {
        window.dataManager.deletePaper(gradeId, subjectId, paperType, categoryKey, paperId);
        showAlert('Paper deleted successfully!', 'success');
        loadPapersList();
    }
}

function filterPapers() {
    const filterGrade = document.getElementById('filterGrade')?.value || '';
    const filterSubject = document.getElementById('filterSubject')?.value || '';
    const filterType = document.getElementById('filterType')?.value || '';
    
    const gradeGroups = document.querySelectorAll('.paper-group');
    
    gradeGroups.forEach(group => {
        const gradeId = group.getAttribute('data-grade');
        let gradeVisible = !filterGrade || gradeId === filterGrade;
        
        if (!gradeVisible) {
            group.style.display = 'none';
            return;
        }
        
        const subjectSections = group.querySelectorAll('.paper-category-section');
        let hasVisibleSubjects = false;
        
        subjectSections.forEach(section => {
            const subjectId = section.getAttribute('data-subject');
            let subjectVisible = !filterSubject || subjectId === filterSubject;
            
            if (!subjectVisible) {
                section.style.display = 'none';
                return;
            }
            
            const paperTypeSections = section.querySelectorAll('[data-paper-type]');
            let hasVisibleTypes = false;
            
            paperTypeSections.forEach(typeSection => {
                const paperType = typeSection.getAttribute('data-paper-type');
                let typeVisible = !filterType || paperType === filterType;
                
                if (typeVisible) {
                    typeSection.style.display = 'block';
                    hasVisibleTypes = true;
                } else {
                    typeSection.style.display = 'none';
                }
            });
            
            if (hasVisibleTypes) {
                section.style.display = 'block';
                hasVisibleSubjects = true;
            } else {
                section.style.display = 'none';
            }
        });
        
        group.style.display = hasVisibleSubjects ? 'block' : 'none';
    });
}

// Videos Management
function loadVideosManagement() {
    // Similar to existing implementation
}

// Event Listeners
function setupEventListeners() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });

    // Add Subject Form
    const addSubjectForm = document.getElementById('addSubjectForm');
    if (addSubjectForm) {
        addSubjectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addSubject();
        });
    }

    // Add Textbook Form
    const addTextbookForm = document.getElementById('addTextbookForm');
    if (addTextbookForm) {
        addTextbookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addTextbook();
        });
    }

    // Add Paper Form
    const addPaperForm = document.getElementById('addPaperForm');
    if (addPaperForm) {
        addPaperForm.addEventListener('submit', handlePaperSubmission);
    }

    // Add Video Form
    const addVideoForm = document.getElementById('addVideoForm');
    if (addVideoForm) {
        addVideoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addVideo();
        });
    }

    // Export Data
    const exportDataBtn = document.getElementById('exportDataBtn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', function() {
            window.dataManager.exportData();
        });
    }

    // Import Data
    const importDataBtn = document.getElementById('importDataBtn');
    if (importDataBtn) {
        importDataBtn.addEventListener('click', function() {
            const file = document.getElementById('importDataFile').files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const success = window.dataManager.importData(e.target.result);
                    if (success) {
                        showAlert('Data imported successfully!', 'success');
                        location.reload();
                    } else {
                        showAlert('Failed to import data. Please check the file format.', 'danger');
                    }
                };
                reader.readAsText(file);
            }
        });
    }
}

// Populate dropdowns
function populateDropdowns() {
    const grades = window.dataManager.getGrades();
    
    // Populate grade dropdowns
    const gradeSelects = ['textbookGrade', 'videoGrade', 'paperGrade'];
    gradeSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Select Grade</option>';
            Object.keys(grades).forEach(gradeId => {
                const option = document.createElement('option');
                option.value = gradeId;
                option.textContent = grades[gradeId].display;
                select.appendChild(option);
            });
        }
    });

    // Setup grade change listeners for subject population
    const textbookGrade = document.getElementById('textbookGrade');
    if (textbookGrade) {
        textbookGrade.addEventListener('change', function() {
            populateSubjectDropdown('textbookSubject', this.value);
        });
    }

    const videoGrade = document.getElementById('videoGrade');
    if (videoGrade) {
        videoGrade.addEventListener('change', function() {
            populateSubjectDropdown('videoSubject', this.value);
        });
    }
}

function populateSubjectDropdown(selectId, gradeId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    select.innerHTML = '<option value="">Select Subject</option>';
    
    if (gradeId) {
        const subjects = window.dataManager.getSubjectsForGrade(gradeId);
        Object.keys(subjects).forEach(subjectId => {
            const option = document.createElement('option');
            option.value = subjectId;
            option.textContent = subjects[subjectId].name;
            select.appendChild(option);
        });
    }
}

// Form submission functions
function addSubject() {
    const name = document.getElementById('subjectName').value;
    const icon = document.getElementById('subjectIcon').value || 'bi-book';
    const gradeCheckboxes = document.querySelectorAll('#gradeCheckboxes input:checked');
    
    if (!name || gradeCheckboxes.length === 0) {
        showAlert('Please fill in all required fields.', 'warning');
        return;
    }
    
    const grades = Array.from(gradeCheckboxes).map(cb => cb.value);
    const subjectId = name.toLowerCase().replace(/\s+/g, '-');
    
    window.dataManager.addSubject(subjectId, {
        name: name,
        icon: icon.startsWith('bi-') ? icon : 'bi-' + icon,
        grades: grades
    });
    
    showAlert(`Subject "${name}" added successfully!`, 'success');
    document.getElementById('addSubjectForm').reset();
    loadSubjectsList();
    populateDropdowns();
}

async function addTextbook() {
    const gradeId = document.getElementById('textbookGrade').value;
    const subjectId = document.getElementById('textbookSubject').value;
    const medium = document.getElementById('textbookMedium').value;
    const file = document.getElementById('textbookFile').files[0];
    
    if (!gradeId || !subjectId || !medium || !file) {
        showAlert('Please fill in all fields and select a file.', 'warning');
        return;
    }
    
    if (file.type !== 'application/pdf') {
        showAlert('Please select a PDF file.', 'warning');
        return;
    }
    
    // Show progress
    const btn = document.querySelector('#addTextbookForm button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Uploading...';
    btn.disabled = true;
    
    try {
        const path = `${gradeId}/${subjectId}`;
        const fileData = await window.dataManager.simulateFileUpload(file, path);
        
        window.dataManager.addTextbook(gradeId, subjectId, medium, fileData);
        
        showAlert('Textbook uploaded successfully!', 'success');
        document.getElementById('addTextbookForm').reset();
        loadTextbooksList();
        
    } catch (error) {
        showAlert('Upload failed. Please try again.', 'danger');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function addVideo() {
    const gradeId = document.getElementById('videoGrade').value;
    const subjectId = document.getElementById('videoSubject').value;
    const title = document.getElementById('videoTitle').value;
    const url = document.getElementById('videoUrl').value;
    const chapter = document.getElementById('videoChapter').value;
    
    if (!gradeId || !subjectId || !title || !url) {
        showAlert('Please fill in all required fields.', 'warning');
        return;
    }
    
    // Validate YouTube URL
    if (!isValidYouTubeUrl(url)) {
        showAlert('Please enter a valid YouTube URL.', 'warning');
        return;
    }
    
    window.dataManager.addVideo(gradeId, subjectId, {
        title: title,
        url: url,
        chapter: chapter
    });
    
    showAlert('Video lesson added successfully!', 'success');
    document.getElementById('addVideoForm').reset();
}

// Utility functions
function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
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

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + ' min ago';
    if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + ' hours ago';
    return Math.floor(diffInSeconds / 86400) + ' days ago';
}

function isValidYouTubeUrl(url) {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return regex.test(url);
}

// Delete functions
function deleteSubject(subjectId) {
    if (confirm('Are you sure you want to delete this subject? This will remove all associated resources.')) {
        delete window.dataManager.data.subjects[subjectId];
        window.dataManager.save();
        window.dataManager.logActivity(`Deleted subject: ${subjectId}`);
        showAlert('Subject deleted successfully!', 'success');
        loadSubjectsList();
        populateDropdowns();
    }
}

function deleteTextbook(gradeId, subjectId, medium) {
    if (confirm('Are you sure you want to delete this textbook?')) {
        window.dataManager.deleteResource(gradeId, subjectId, 'textbook', medium);
        showAlert('Textbook deleted successfully!', 'success');
        loadTextbooksList();
    }
}

function editGrade(gradeId) {
    // Implementation for editing grades
    showAlert('Edit functionality coming soon!', 'info');
}

function deleteGrade(gradeId) {
    if (confirm('Are you sure you want to delete this grade? This will remove all associated content.')) {
        delete window.dataManager.data.grades[gradeId];
        window.dataManager.save();
        showAlert('Grade deleted successfully!', 'success');
        loadGradesManagement();
    }
}

// Reset function for fixing icon issues
function resetSystemData() {
    if (confirm('This will reset all data to default settings. All uploaded content will be lost. Continue?')) {
        window.dataManager.resetToDefaults();
        showAlert('System reset successfully!', 'success');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});