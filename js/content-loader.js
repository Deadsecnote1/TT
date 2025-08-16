// Content Loader - Complete Fixed Version
class ContentLoader {
    constructor() {
        this.dataManager = window.dataManager;
    }

    // Load content for grade overview page
    loadGradeOverview(gradeId) {
        const pageData = this.dataManager.generateGradePageData(gradeId);
        return this.generateGradeOverviewHTML(pageData);
    }

    // Load content for textbooks page
    loadTextbooksPage(gradeId) {
        const pageData = this.dataManager.generateGradePageData(gradeId);
        return this.generateTextbooksHTML(pageData);
    }

    // Load content for papers page
    loadPapersPage(gradeId) {
        const pageData = this.dataManager.generateGradePageData(gradeId);
        return this.generatePapersHTML(pageData);
    }

    // Load content for notes page
    loadNotesPage(gradeId) {
        const pageData = this.dataManager.generateGradePageData(gradeId);
        return this.generateNotesHTML(pageData);
    }

    // Load content for videos page
    loadVideosPage(gradeId) {
        const pageData = this.dataManager.generateGradePageData(gradeId);
        return this.generateVideosHTML(pageData);
    }

    // Generate HTML for grade overview - NO GRADE NUMBER
    generateGradeOverviewHTML(pageData) {
        const grade = pageData.grade;
        const subjects = pageData.subjects;
        
        let html = `
            <header class="grade-header">
                <div class="container text-center">
                    <h1 class="display-4 fw-bold">${grade.display} Resources</h1>
                    <p class="lead">Complete study materials in all three mediums</p>
                </div>
            </header>

            <section class="py-5">
                <div class="container">
                    <div class="row g-4 mb-5">
                        <div class="col-md-3">
                            <a href="textbooks.html" class="resource-type-card textbooks">
                                <div class="resource-type-icon">
                                    <i class="bi bi-book"></i>
                                </div>
                                <h5>Textbooks</h5>
                                <p>All subjects in 3 mediums</p>
                                <span class="resource-count">${this.countTextbooks(subjects)} files</span>
                            </a>
                        </div>
                        <div class="col-md-3">
                            <a href="papers.html" class="resource-type-card papers">
                                <div class="resource-type-icon">
                                    <i class="bi bi-file-earmark-text"></i>
                                </div>
                                <h5>Exam Papers</h5>
                                <p>Term & chapter papers</p>
                                <span class="resource-count">${this.countPapers(subjects)} files</span>
                            </a>
                        </div>
                        <div class="col-md-3">
                            <a href="notes.html" class="resource-type-card notes">
                                <div class="resource-type-icon">
                                    <i class="bi bi-sticky"></i>
                                </div>
                                <h5>Short Notes</h5>
                                <p>Chapter-wise summaries</p>
                                <span class="resource-count">${this.countNotes(subjects)} files</span>
                            </a>
                        </div>
                        <div class="col-md-3">
                            <a href="videos.html" class="resource-type-card videos">
                                <div class="resource-type-icon">
                                    <i class="bi bi-youtube"></i>
                                </div>
                                <h5>Video Lessons</h5>
                                <p>YouTube tutorials</p>
                                <span class="resource-count">${this.countVideos(subjects)} videos</span>
                            </a>
                        </div>
                    </div>

                    <h3 class="mb-4">Available Subjects</h3>
                    <div class="row g-4">`;

        Object.keys(subjects).forEach(subjectId => {
            const subject = subjects[subjectId];
            html += `
                <div class="col-md-4 col-lg-3">
                    <div class="subject-overview-card">
                        <div class="subject-icon">
                            <i class="${subject.icon}"></i>
                        </div>
                        <h6>${subject.name}</h6>
                        <div class="subject-stats">
                            <small>${this.getSubjectResourceCount(subject)} resources</small>
                        </div>
                    </div>
                </div>`;
        });

        html += `
                    </div>
                </div>
            </section>`;

        return html;
    }

    // Generate HTML for textbooks page - NO GRADE NUMBER
    generateTextbooksHTML(pageData) {
        const grade = pageData.grade;
        const subjects = pageData.subjects;

        let html = `
            <header class="grade-header">
                <div class="container text-center">
                    <h1 class="display-4 fw-bold">${grade.display} Textbooks</h1>
                    <p class="lead">Download textbooks in Sinhala, Tamil, and English</p>
                </div>
            </header>

            <section class="py-3 bg-light">
                <div class="container">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb mb-0">
                            <li class="breadcrumb-item"><a href="../../../index.html">Home</a></li>
                            <li class="breadcrumb-item"><a href="index.html">${grade.display}</a></li>
                            <li class="breadcrumb-item active">Textbooks</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section class="py-5">
                <div class="container">`;

        Object.keys(subjects).forEach(subjectId => {
            const subject = subjects[subjectId];
            const resources = subject.resources;

            html += `
                <div class="subject-section mb-5">
                    <div class="subject-header">
                        <div class="subject-icon-large">
                            <i class="${subject.icon}"></i>
                        </div>
                        <h3>${subject.name}</h3>
                    </div>

                    <div class="row">
                        <div class="col-md-4">
                            <div class="textbook-medium-card sinhala">
                                <h5><i class="bi bi-download me-2"></i>සිංහල</h5>
                                ${this.generateTextbookDownload(resources.textbooks?.sinhala, 'Sinhala')}
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="textbook-medium-card tamil">
                                <h5><i class="bi bi-download me-2"></i>தமிழ்</h5>
                                ${this.generateTextbookDownload(resources.textbooks?.tamil, 'Tamil')}
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="textbook-medium-card english">
                                <h5><i class="bi bi-download me-2"></i>English</h5>
                                ${this.generateTextbookDownload(resources.textbooks?.english, 'English')}
                            </div>
                        </div>
                    </div>
                </div>`;
        });

        html += `
                </div>
            </section>`;

        return html;
    }

    // Generate HTML for papers page - NO GRADE NUMBER
    generatePapersHTML(pageData) {
        const grade = pageData.grade;
        const subjects = pageData.subjects;

        let html = `
            <header class="grade-header">
                <div class="container text-center">
                    <h1 class="display-4 fw-bold">${grade.display} Exam Papers</h1>
                    <p class="lead">Past papers for practice and preparation</p>
                </div>
            </header>

            <section class="py-3 bg-light">
                <div class="container">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb mb-0">
                            <li class="breadcrumb-item"><a href="../../../index.html">Home</a></li>
                            <li class="breadcrumb-item"><a href="index.html">${grade.display}</a></li>
                            <li class="breadcrumb-item active">Exam Papers</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section class="py-5">
                <div class="container">`;

        Object.keys(subjects).forEach(subjectId => {
            const subject = subjects[subjectId];
            const papers = subject.resources.papers;

            html += `
                <div class="subject-section mb-5">
                    <div class="subject-header">
                        <div class="subject-icon-large">
                            <i class="${subject.icon}"></i>
                        </div>
                        <h3>${subject.name}</h3>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="paper-type-card term-papers">
                                <h5><i class="bi bi-calendar me-2"></i>Term Papers</h5>
                                ${this.generateTermPapers(papers?.terms)}
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="paper-type-card chapter-papers">
                                <h5><i class="bi bi-journal-text me-2"></i>Chapter Papers</h5>
                                ${this.generateChapterPapers(papers?.chapters)}
                            </div>
                        </div>
                    </div>
                </div>`;
        });

        html += `
                </div>
            </section>`;

        return html;
    }

    // Generate HTML for notes page - NO GRADE NUMBER
    generateNotesHTML(pageData) {
        const grade = pageData.grade;
        const subjects = pageData.subjects;

        let html = `
            <header class="grade-header">
                <div class="container text-center">
                    <h1 class="display-4 fw-bold">${grade.display} Short Notes</h1>
                    <p class="lead">Quick reference notes for all chapters</p>
                </div>
            </header>

            <section class="py-3 bg-light">
                <div class="container">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb mb-0">
                            <li class="breadcrumb-item"><a href="../../../index.html">Home</a></li>
                            <li class="breadcrumb-item"><a href="index.html">${grade.display}</a></li>
                            <li class="breadcrumb-item active">Short Notes</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section class="py-5">
                <div class="container">`;

        Object.keys(subjects).forEach(subjectId => {
            const subject = subjects[subjectId];
            const notes = subject.resources.notes;

            html += `
                <div class="subject-section mb-5">
                    <div class="subject-header">
                        <div class="subject-icon-large">
                            <i class="${subject.icon}"></i>
                        </div>
                        <h3>${subject.name}</h3>
                    </div>

                    <div class="notes-grid">
                        ${this.generateNotesGrid(notes)}
                    </div>
                </div>`;
        });

        html += `
                </div>
            </section>`;

        return html;
    }

    // Generate HTML for videos page - NO GRADE NUMBER
    generateVideosHTML(pageData) {
        const grade = pageData.grade;
        const subjects = pageData.subjects;

        let html = `
            <header class="grade-header">
                <div class="container text-center">
                    <h1 class="display-4 fw-bold">${grade.display} Video Lessons</h1>
                    <p class="lead">Educational videos and tutorials</p>
                </div>
            </header>

            <section class="py-3 bg-light">
                <div class="container">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb mb-0">
                            <li class="breadcrumb-item"><a href="../../../index.html">Home</a></li>
                            <li class="breadcrumb-item"><a href="index.html">${grade.display}</a></li>
                            <li class="breadcrumb-item active">Video Lessons</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section class="py-5">
                <div class="container">`;

        Object.keys(subjects).forEach(subjectId => {
            const subject = subjects[subjectId];
            const videos = subject.videos;

            html += `
                <div class="subject-section mb-5">
                    <div class="subject-header">
                        <div class="subject-icon-large">
                            <i class="${subject.icon}"></i>
                        </div>
                        <h3>${subject.name}</h3>
                    </div>

                    <div class="videos-grid">
                        ${this.generateVideosGrid(videos)}
                    </div>
                </div>`;
        });

        html += `
                </div>
            </section>`;

        return html;
    }

    // Helper method for textbook downloads
    generateTextbookDownload(textbook, medium) {
        if (!textbook) {
            return `<p class="text-muted">No ${medium} textbook available</p>`;
        }

        return `
            <div class="download-item">
                <div class="download-info">
                    <h6>${textbook.filename}</h6>
                    <small class="text-muted">${this.formatFileSize(textbook.size)}</small>
                </div>
                <a href="../../../${textbook.path}" class="btn btn-primary btn-sm" download>
                    <i class="bi bi-download me-1"></i>Download
                </a>
            </div>`;
    }

    // Generate term papers with correct structure for arrays
    generateTermPapers(termPapers) {
        if (!termPapers || Object.keys(termPapers).length === 0) {
            return '<p class="text-muted">No term papers available</p>';
        }

        let html = '';
        Object.keys(termPapers).forEach(termKey => {
            const papers = termPapers[termKey];
            
            // Handle both array and single object structures
            if (Array.isArray(papers) && papers.length > 0) {
                // New structure: array of papers
                papers.forEach(paper => {
                    html += `
                        <div class="paper-item" data-language="${paper.language || 'english'}">
                            <span>${this.formatTermName(termKey)}</span>
                            <a href="../../../${paper.path}" class="btn btn-sm btn-outline-primary" download>
                                <i class="bi bi-download"></i>
                            </a>
                        </div>`;
                });
            } else if (papers && typeof papers === 'object' && papers.path) {
                // Old structure: single paper object
                html += `
                    <div class="paper-item" data-language="${papers.language || 'english'}">
                        <span>${this.formatTermName(termKey)}</span>
                        <a href="../../../${papers.path}" class="btn btn-sm btn-outline-primary" download>
                            <i class="bi bi-download"></i>
                        </a>
                    </div>`;
            }
        });

        return html || '<p class="text-muted">No term papers available</p>';
    }

    // Generate chapter papers with correct structure for arrays
    generateChapterPapers(chapterPapers) {
        if (!chapterPapers || Object.keys(chapterPapers).length === 0) {
            return '<p class="text-muted">No chapter papers available</p>';
        }

        let html = '';
        Object.keys(chapterPapers).forEach(chapterKey => {
            const papers = chapterPapers[chapterKey];
            
            // Handle both array and single object structures
            if (Array.isArray(papers) && papers.length > 0) {
                // New structure: array of papers
                papers.forEach(paper => {
                    html += `
                        <div class="paper-item" data-language="${paper.language || 'english'}">
                            <span>${this.formatChapterName(chapterKey)}</span>
                            <a href="../../../${paper.path}" class="btn btn-sm btn-outline-primary" download>
                                <i class="bi bi-download"></i>
                            </a>
                        </div>`;
                });
            } else if (papers && typeof papers === 'object' && papers.path) {
                // Old structure: single paper object
                html += `
                    <div class="paper-item" data-language="${papers.language || 'english'}">
                        <span>${this.formatChapterName(chapterKey)}</span>
                        <a href="../../../${papers.path}" class="btn btn-sm btn-outline-primary" download>
                            <i class="bi bi-download"></i>
                        </a>
                    </div>`;
            }
        });

        return html || '<p class="text-muted">No chapter papers available</p>';
    }

    generateNotesGrid(notes) {
        if (!notes || Object.keys(notes).length === 0) {
            return '<p class="text-muted">No notes available</p>';
        }

        let html = '';
        Object.keys(notes).forEach(noteKey => {
            const note = notes[noteKey];
            html += `
                <div class="note-card" data-language="${note.language || 'english'}">
                    <div class="note-icon">
                        <i class="bi bi-file-pdf"></i>
                    </div>
                    <div class="note-content">
                        <h6>${this.formatChapterName(noteKey)}</h6>
                        <small class="text-muted">${this.formatFileSize(note.size)}</small>
                    </div>
                    <a href="../../../${note.path}" class="btn btn-primary btn-sm" download>
                        <i class="bi bi-download"></i>
                    </a>
                </div>`;
        });

        return html;
    }

    generateVideosGrid(videos) {
        if (!videos || videos.length === 0) {
            return '<p class="text-muted">No video lessons available</p>';
        }

        let html = '';
        videos.forEach(video => {
            const videoId = this.extractYouTubeId(video.url);
            const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;

            html += `
                <div class="video-card" data-language="${video.language || 'english'}">
                    <div class="video-thumbnail">
                        ${thumbnail ? `<img src="${thumbnail}" alt="${video.title}">` : '<div class="placeholder-thumbnail"><i class="bi bi-play-circle"></i></div>'}
                        <div class="play-overlay">
                            <i class="bi bi-play-circle-fill"></i>
                        </div>
                    </div>
                    <div class="video-content">
                        <h6>${video.title}</h6>
                        ${video.chapter ? `<small class="text-muted">${video.chapter}</small>` : ''}
                    </div>
                    <a href="${video.url}" class="btn btn-danger btn-sm" target="_blank">
                        <i class="bi bi-youtube me-1"></i>Watch
                    </a>
                </div>`;
        });

        return html;
    }

    // Utility methods
    countTextbooks(subjects) {
        let count = 0;
        Object.keys(subjects).forEach(subjectId => {
            const textbooks = subjects[subjectId].resources.textbooks;
            if (textbooks) {
                count += Object.keys(textbooks).length;
            }
        });
        return count;
    }

    countPapers(subjects) {
        let count = 0;
        Object.keys(subjects).forEach(subjectId => {
            const papers = subjects[subjectId].resources.papers;
            if (papers) {
                if (papers.terms) {
                    Object.keys(papers.terms).forEach(term => {
                        const termPapers = papers.terms[term];
                        if (Array.isArray(termPapers)) {
                            count += termPapers.length;
                        } else if (termPapers && typeof termPapers === 'object') {
                            count += 1;
                        }
                    });
                }
                if (papers.chapters) {
                    Object.keys(papers.chapters).forEach(chapter => {
                        const chapterPapers = papers.chapters[chapter];
                        if (Array.isArray(chapterPapers)) {
                            count += chapterPapers.length;
                        } else if (chapterPapers && typeof chapterPapers === 'object') {
                            count += 1;
                        }
                    });
                }
            }
        });
        return count;
    }

    countNotes(subjects) {
        let count = 0;
        Object.keys(subjects).forEach(subjectId => {
            const notes = subjects[subjectId].resources.notes;
            if (notes) {
                count += Object.keys(notes).length;
            }
        });
        return count;
    }

    countVideos(subjects) {
        let count = 0;
        Object.keys(subjects).forEach(subjectId => {
            const videos = subjects[subjectId].videos;
            if (videos) {
                count += videos.length;
            }
        });
        return count;
    }

    getSubjectResourceCount(subject) {
        let count = 0;
        if (subject.resources.textbooks) count += Object.keys(subject.resources.textbooks).length;
        if (subject.resources.papers) {
            if (subject.resources.papers.terms) {
                Object.keys(subject.resources.papers.terms).forEach(term => {
                    const termPapers = subject.resources.papers.terms[term];
                    if (Array.isArray(termPapers)) {
                        count += termPapers.length;
                    } else if (termPapers && typeof termPapers === 'object') {
                        count += 1;
                    }
                });
            }
            if (subject.resources.papers.chapters) {
                Object.keys(subject.resources.papers.chapters).forEach(chapter => {
                    const chapterPapers = subject.resources.papers.chapters[chapter];
                    if (Array.isArray(chapterPapers)) {
                        count += chapterPapers.length;
                    } else if (chapterPapers && typeof chapterPapers === 'object') {
                        count += 1;
                    }
                });
            }
        }
        if (subject.resources.notes) count += Object.keys(subject.resources.notes).length;
        if (subject.videos) count += subject.videos.length;
        return count;
    }

    formatFileSize(bytes) {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatTermName(termKey) {
        const termNames = {
            'term1': '1st Term',
            'term2': '2nd Term',
            'term3': '3rd Term'
        };
        return termNames[termKey] || termKey.charAt(0).toUpperCase() + termKey.slice(1);
    }

    formatChapterName(chapterKey) {
        if (chapterKey.startsWith('ch')) {
            const chapterNum = chapterKey.replace('ch', '');
            return `Chapter ${chapterNum}`;
        }
        return chapterKey.charAt(0).toUpperCase() + chapterKey.slice(1).replace('-', ' ');
    }

    extractYouTubeId(url) {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([^&\n?#]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }
}

// Initialize global content loader
window.contentLoader = new ContentLoader();