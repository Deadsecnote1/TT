// Complete Enhanced Data Manager with Language Support
class DataManager {
    constructor() {
        this.data = {
            grades: {},
            subjects: {},
            resources: {},
            videos: {},
            settings: {}
        };
        this.initialize();
    }

    // Initialize with default data
    initialize() {
        const savedData = localStorage.getItem('teachingTorchData');
        if (savedData) {
            this.data = JSON.parse(savedData);
            // Migrate old data structure if needed
            this.migrateDataStructure();
        } else {
            this.setDefaultData();
        }
    }

    // Migrate old data structure to support languages
    migrateDataStructure() {
        let needsMigration = false;

        // Check if papers need migration (old structure to new)
        Object.keys(this.data.resources || {}).forEach(gradeId => {
            Object.keys(this.data.resources[gradeId] || {}).forEach(subjectId => {
                const resources = this.data.resources[gradeId][subjectId];
                
                // Migrate papers structure
                if (resources.papers) {
                    if (resources.papers.terms) {
                        Object.keys(resources.papers.terms).forEach(termKey => {
                            // If it's old structure (single object), convert to array
                            if (!Array.isArray(resources.papers.terms[termKey])) {
                                const oldPaper = resources.papers.terms[termKey];
                                resources.papers.terms[termKey] = [
                                    {
                                        ...oldPaper,
                                        id: Date.now().toString() + Math.random(),
                                        language: 'english', // Default language for old papers
                                        school: 'Unknown School'
                                    }
                                ];
                                needsMigration = true;
                            }
                        });
                    }
                    
                    if (resources.papers.chapters) {
                        Object.keys(resources.papers.chapters).forEach(chapterKey => {
                            // If it's old structure (single object), convert to array
                            if (!Array.isArray(resources.papers.chapters[chapterKey])) {
                                const oldPaper = resources.papers.chapters[chapterKey];
                                resources.papers.chapters[chapterKey] = [
                                    {
                                        ...oldPaper,
                                        id: Date.now().toString() + Math.random(),
                                        language: 'english', // Default language for old papers
                                        school: 'Unknown School'
                                    }
                                ];
                                needsMigration = true;
                            }
                        });
                    }
                }

                // Add language to notes if missing
                if (resources.notes) {
                    Object.keys(resources.notes).forEach(noteKey => {
                        if (!resources.notes[noteKey].language) {
                            resources.notes[noteKey].language = 'english';
                            needsMigration = true;
                        }
                    });
                }
            });
        });

        // Add language to videos if missing
        Object.keys(this.data.videos || {}).forEach(gradeId => {
            Object.keys(this.data.videos[gradeId] || {}).forEach(subjectId => {
                this.data.videos[gradeId][subjectId].forEach(video => {
                    if (!video.language) {
                        video.language = 'english';
                        needsMigration = true;
                    }
                });
            });
        });

        if (needsMigration) {
            this.save();
            this.logActivity('Data structure migrated to support languages');
        }
    }

    // Set default data structure
    setDefaultData() {
        this.data.grades = {
            'grade6': { name: 'Grade 6', display: 'Grade 6', active: true },
            'grade7': { name: 'Grade 7', display: 'Grade 7', active: true },
            'grade8': { name: 'Grade 8', display: 'Grade 8', active: true },
            'grade9': { name: 'Grade 9', display: 'Grade 9', active: true },
            'grade10': { name: 'Grade 10', display: 'Grade 10', active: true },
            'grade11': { name: 'Grade 11', display: 'Grade 11', active: true },
            'al': { name: 'Advanced Level', display: 'A/L', active: true }
        };

        this.data.subjects = {
            'mathematics': { 
                name: 'Mathematics', 
                icon: 'bi-calculator',
                grades: ['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11']
            },
            'science': { 
                name: 'Science', 
                icon: 'bi-flask',
                grades: ['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11']
            },
            'sinhala': { 
                name: 'Sinhala', 
                icon: 'bi-book',
                grades: ['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11']
            },
            'english': { 
                name: 'English', 
                icon: 'bi-globe',
                grades: ['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11']
            },
            'tamil': { 
                name: 'Tamil', 
                icon: 'bi-book-half',
                grades: ['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11']
            },
            'social-studies': { 
                name: 'Social Studies', 
                icon: 'bi-geo-alt',
                grades: ['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11']
            },
            'aesthetic': { 
                name: 'Aesthetic Subjects', 
                icon: 'bi-music-note',
                grades: ['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11']
            },
            'religion': { 
                name: 'Religion', 
                icon: 'bi-heart',
                grades: ['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11']
            },
            'health': { 
                name: 'Health & Physical Education', 
                icon: 'bi-heart-pulse',
                grades: ['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11']
            },
            'ict': { 
                name: 'ICT', 
                icon: 'bi-laptop',
                grades: ['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11']
            },
            'life-skills': { 
                name: 'Life Skills', 
                icon: 'bi-lightbulb',
                grades: ['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11']
            },
            // A/L Subjects
            'combined-maths': { 
                name: 'Combined Mathematics', 
                icon: 'bi-calculator-fill',
                grades: ['al']
            },
            'physics': { 
                name: 'Physics', 
                icon: 'bi-atom',
                grades: ['al']
            },
            'chemistry': { 
                name: 'Chemistry', 
                icon: 'bi-droplet',
                grades: ['al']
            },
            'biology': { 
                name: 'Biology', 
                icon: 'bi-tree',
                grades: ['al']
            },
            'economics': { 
                name: 'Economics', 
                icon: 'bi-graph-up',
                grades: ['al']
            },
            'business-studies': { 
                name: 'Business Studies', 
                icon: 'bi-briefcase',
                grades: ['al']
            },
            'accounting': { 
                name: 'Accounting', 
                icon: 'bi-calculator',
                grades: ['al']
            },
            'geography': { 
                name: 'Geography', 
                icon: 'bi-globe2',
                grades: ['al']
            },
            'history': { 
                name: 'History', 
                icon: 'bi-clock-history',
                grades: ['al']
            },
            'political-science': { 
                name: 'Political Science', 
                icon: 'bi-building',
                grades: ['al']
            }
        };

        this.data.resources = {};
        this.data.videos = {};
        this.data.settings = {
            siteName: 'Teaching Torch',
            adminPassword: 'admin123',
            lastUpdated: new Date().toISOString()
        };

        this.save();
    }

    // Save data to localStorage
    save() {
        localStorage.setItem('teachingTorchData', JSON.stringify(this.data));
        this.data.settings.lastUpdated = new Date().toISOString();
    }

    // Get all grades
    getGrades() {
        return this.data.grades;
    }

    // Get all subjects
    getSubjects() {
        return this.data.subjects;
    }

    // Get subjects for a specific grade
    getSubjectsForGrade(gradeId) {
        const subjects = {};
        Object.keys(this.data.subjects).forEach(subjectId => {
            const subject = this.data.subjects[subjectId];
            if (subject.grades.includes(gradeId)) {
                subjects[subjectId] = subject;
            }
        });
        return subjects;
    }

    // Add new grade
    addGrade(gradeId, gradeData) {
        this.data.grades[gradeId] = gradeData;
        this.save();
        this.logActivity(`Added new grade: ${gradeData.display}`);
    }

    // Add new subject
    addSubject(subjectId, subjectData) {
        this.data.subjects[subjectId] = subjectData;
        this.save();
        this.logActivity(`Added new subject: ${subjectData.name}`);
    }

    // Get resources for grade and subject with enhanced structure
    getResources(gradeId, subjectId) {
        if (!this.data.resources[gradeId]) {
            this.data.resources[gradeId] = {};
        }
        if (!this.data.resources[gradeId][subjectId]) {
            this.data.resources[gradeId][subjectId] = {
                textbooks: {},
                papers: { 
                    terms: {
                        term1: [],
                        term2: [],
                        term3: []
                    }, 
                    chapters: {} 
                },
                notes: {}
            };
        }
        return this.data.resources[gradeId][subjectId];
    }

    // Add textbook (existing method - language handled by medium)
    addTextbook(gradeId, subjectId, medium, fileData) {
        const resources = this.getResources(gradeId, subjectId);
        if (!resources.textbooks) resources.textbooks = {};
        
        resources.textbooks[medium] = {
            filename: fileData.filename,
            path: fileData.path,
            size: fileData.size,
            language: medium, // medium IS the language for textbooks
            uploadDate: new Date().toISOString()
        };
        
        this.save();
        this.logActivity(`Added ${medium} textbook for ${this.data.subjects[subjectId].name} - ${this.data.grades[gradeId].display}`);
    }

    // Enhanced Add Paper method with language support
    addPaper(gradeId, subjectId, paperType, paperCategory, fileData, schoolName = '', language = 'english') {
        const resources = this.getResources(gradeId, subjectId);
        if (!resources.papers) {
            resources.papers = { 
                terms: { term1: [], term2: [], term3: [] }, 
                chapters: {} 
            };
        }
        
        const paperInfo = {
            id: Date.now().toString() + Math.random(),
            filename: fileData.filename,
            path: fileData.path,
            size: fileData.size,
            school: schoolName,
            language: language,
            uploadDate: new Date().toISOString()
        };
        
        if (paperType === 'term') {
            if (!resources.papers.terms[paperCategory]) {
                resources.papers.terms[paperCategory] = [];
            }
            resources.papers.terms[paperCategory].push(paperInfo);
        } else if (paperType === 'chapter') {
            if (!resources.papers.chapters[paperCategory]) {
                resources.papers.chapters[paperCategory] = [];
            }
            resources.papers.chapters[paperCategory].push(paperInfo);
        }
        
        this.save();
        this.logActivity(`Added ${language} ${paperType} paper (${paperCategory}) from ${schoolName || 'Unknown School'} for ${this.data.subjects[subjectId].name} - ${this.data.grades[gradeId].display}`);
    }

    // Enhanced Add Notes method with language support
    addNotes(gradeId, subjectId, chapter, fileData, language = 'english') {
        const resources = this.getResources(gradeId, subjectId);
        if (!resources.notes) resources.notes = {};
        
        // Create unique key for notes with language
        const noteKey = `${chapter}_${language}`;
        
        resources.notes[noteKey] = {
            filename: fileData.filename,
            path: fileData.path,
            size: fileData.size,
            language: language,
            chapter: chapter,
            uploadDate: new Date().toISOString()
        };
        
        this.save();
        this.logActivity(`Added ${language} notes for ${chapter} - ${this.data.subjects[subjectId].name}`);
    }

    // Get videos for grade and subject
    getVideos(gradeId, subjectId) {
        if (!this.data.videos[gradeId]) {
            this.data.videos[gradeId] = {};
        }
        if (!this.data.videos[gradeId][subjectId]) {
            this.data.videos[gradeId][subjectId] = [];
        }
        return this.data.videos[gradeId][subjectId];
    }

    // Enhanced Add Video method with language support
    addVideo(gradeId, subjectId, videoData) {
        if (!this.data.videos[gradeId]) {
            this.data.videos[gradeId] = {};
        }
        if (!this.data.videos[gradeId][subjectId]) {
            this.data.videos[gradeId][subjectId] = [];
        }
        
        const video = {
            id: Date.now().toString(),
            title: videoData.title,
            url: videoData.url,
            chapter: videoData.chapter || '',
            description: videoData.description || '',
            language: videoData.language || 'english',
            addedDate: new Date().toISOString()
        };
        
        this.data.videos[gradeId][subjectId].push(video);
        this.save();
        this.logActivity(`Added ${video.language} video: ${videoData.title} for ${this.data.subjects[subjectId].name}`);
    }

    // Delete resource
    deleteResource(gradeId, subjectId, resourceType, resourceKey) {
        const resources = this.getResources(gradeId, subjectId);
        
        if (resourceType === 'textbook' && resources.textbooks) {
            delete resources.textbooks[resourceKey];
        } else if (resourceType === 'paper' && resources.papers) {
            if (resources.papers.terms[resourceKey]) {
                delete resources.papers.terms[resourceKey];
            } else if (resources.papers.chapters[resourceKey]) {
                delete resources.papers.chapters[resourceKey];
            }
        } else if (resourceType === 'notes' && resources.notes) {
            delete resources.notes[resourceKey];
        }
        
        this.save();
        this.logActivity(`Deleted ${resourceType}: ${resourceKey}`);
    }

    // Delete specific paper by ID
    deletePaper(gradeId, subjectId, paperType, paperCategory, paperId) {
        const resources = this.getResources(gradeId, subjectId);
        
        if (paperType === 'term' && resources.papers.terms[paperCategory]) {
            resources.papers.terms[paperCategory] = resources.papers.terms[paperCategory].filter(p => p.id !== paperId);
        } else if (paperType === 'chapter' && resources.papers.chapters[paperCategory]) {
            resources.papers.chapters[paperCategory] = resources.papers.chapters[paperCategory].filter(p => p.id !== paperId);
        }
        
        this.save();
        this.logActivity(`Deleted ${paperType} paper (${paperCategory}) with ID: ${paperId}`);
    }

    // Delete video
    deleteVideo(gradeId, subjectId, videoId) {
        if (this.data.videos[gradeId] && this.data.videos[gradeId][subjectId]) {
            this.data.videos[gradeId][subjectId] = this.data.videos[gradeId][subjectId].filter(v => v.id !== videoId);
            this.save();
            this.logActivity(`Deleted video with ID: ${videoId}`);
        }
    }

    // Delete note by key
    deleteNote(gradeId, subjectId, noteKey) {
        const resources = this.getResources(gradeId, subjectId);
        if (resources.notes && resources.notes[noteKey]) {
            delete resources.notes[noteKey];
            this.save();
            this.logActivity(`Deleted note: ${noteKey}`);
        }
    }

    // Get statistics with language breakdown
    getStats() {
        const stats = {
            totalGrades: Object.keys(this.data.grades).length,
            totalSubjects: Object.keys(this.data.subjects).length,
            totalResources: 0,
            totalVideos: 0,
            languageBreakdown: {
                sinhala: 0,
                tamil: 0,
                english: 0
            }
        };

        // Count resources with language tracking
        Object.keys(this.data.resources).forEach(gradeId => {
            Object.keys(this.data.resources[gradeId]).forEach(subjectId => {
                const resources = this.data.resources[gradeId][subjectId];
                
                // Count textbooks
                if (resources.textbooks) {
                    Object.keys(resources.textbooks).forEach(medium => {
                        stats.totalResources++;
                        if (stats.languageBreakdown[medium] !== undefined) {
                            stats.languageBreakdown[medium]++;
                        }
                    });
                }
                
                // Count papers with new structure
                if (resources.papers) {
                    if (resources.papers.terms) {
                        Object.keys(resources.papers.terms).forEach(term => {
                            const termPapers = resources.papers.terms[term];
                            if (Array.isArray(termPapers)) {
                                termPapers.forEach(paper => {
                                    stats.totalResources++;
                                    if (paper.language && stats.languageBreakdown[paper.language] !== undefined) {
                                        stats.languageBreakdown[paper.language]++;
                                    }
                                });
                            }
                        });
                    }
                    
                    if (resources.papers.chapters) {
                        Object.keys(resources.papers.chapters).forEach(chapter => {
                            const chapterPapers = resources.papers.chapters[chapter];
                            if (Array.isArray(chapterPapers)) {
                                chapterPapers.forEach(paper => {
                                    stats.totalResources++;
                                    if (paper.language && stats.languageBreakdown[paper.language] !== undefined) {
                                        stats.languageBreakdown[paper.language]++;
                                    }
                                });
                            }
                        });
                    }
                }
                
                // Count notes
                if (resources.notes) {
                    Object.keys(resources.notes).forEach(noteKey => {
                        const note = resources.notes[noteKey];
                        stats.totalResources++;
                        if (note.language && stats.languageBreakdown[note.language] !== undefined) {
                            stats.languageBreakdown[note.language]++;
                        }
                    });
                }
            });
        });

        // Count videos
        Object.keys(this.data.videos).forEach(gradeId => {
            Object.keys(this.data.videos[gradeId]).forEach(subjectId => {
                this.data.videos[gradeId][subjectId].forEach(video => {
                    stats.totalVideos++;
                    if (video.language && stats.languageBreakdown[video.language] !== undefined) {
                        stats.languageBreakdown[video.language]++;
                    }
                });
            });
        });

        return stats;
    }

    // Activity logging
    logActivity(message) {
        if (!this.data.settings.activities) {
            this.data.settings.activities = [];
        }
        
        this.data.settings.activities.unshift({
            message,
            timestamp: new Date().toISOString(),
            id: Date.now()
        });
        
        // Keep only last 50 activities
        if (this.data.settings.activities.length > 50) {
            this.data.settings.activities = this.data.settings.activities.slice(0, 50);
        }
        
        this.save();
    }

    // Get recent activities
    getRecentActivities(limit = 10) {
        if (!this.data.settings.activities) return [];
        return this.data.settings.activities.slice(0, limit);
    }

    // Export data
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `teaching-torch-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.logActivity('Data exported successfully');
    }

    // Import data
    importData(jsonData) {
        try {
            const importedData = JSON.parse(jsonData);
            
            // Validate data structure
            if (!importedData.grades || !importedData.subjects) {
                throw new Error('Invalid data format');
            }
            
            this.data = importedData;
            this.migrateDataStructure(); // Ensure imported data has correct structure
            this.save();
            this.logActivity('Data imported successfully');
            return true;
        } catch (error) {
            console.error('Import failed:', error);
            return false;
        }
    }

    // Generate grade pages data
    generateGradePageData(gradeId) {
        const grade = this.data.grades[gradeId];
        const subjects = this.getSubjectsForGrade(gradeId);
        const pageData = {
            grade: grade,
            subjects: {}
        };

        Object.keys(subjects).forEach(subjectId => {
            const subject = subjects[subjectId];
            const resources = this.getResources(gradeId, subjectId);
            const videos = this.getVideos(gradeId, subjectId);

            pageData.subjects[subjectId] = {
                ...subject,
                resources,
                videos
            };
        });

        return pageData;
    }

    // File upload simulation
    simulateFileUpload(file, path) {
        return new Promise((resolve) => {
            // Simulate upload delay
            setTimeout(() => {
                const fileData = {
                    filename: file.name,
                    path: `assets/downloads/${path}/${file.name}`,
                    size: file.size,
                    type: file.type
                };
                resolve(fileData);
            }, 1000 + Math.random() * 2000); // 1-3 second delay
        });
    }

    // Reset data to defaults (for fixing icon issues)
    resetToDefaults() {
        if (confirm('This will reset all data to default settings. All uploaded content will be lost. Continue?')) {
            localStorage.removeItem('teachingTorchData');
            this.setDefaultData();
            this.logActivity('System reset to defaults');
            location.reload();
        }
    }

    // Filter resources by language
    getResourcesByLanguage(gradeId, subjectId, language) {
        const resources = this.getResources(gradeId, subjectId);
        const videos = this.getVideos(gradeId, subjectId);
        
        const filtered = {
            textbooks: {},
            papers: { terms: {}, chapters: {} },
            notes: {},
            videos: []
        };

        // Filter textbooks
        if (language === 'all') {
            filtered.textbooks = resources.textbooks;
        } else {
            Object.keys(resources.textbooks).forEach(medium => {
                if (medium === language) {
                    filtered.textbooks[medium] = resources.textbooks[medium];
                }
            });
        }

        // Filter papers
        if (resources.papers) {
            // Filter term papers
            if (resources.papers.terms) {
                Object.keys(resources.papers.terms).forEach(termKey => {
                    const termPapers = resources.papers.terms[termKey];
                    if (Array.isArray(termPapers)) {
                        filtered.papers.terms[termKey] = language === 'all' 
                            ? termPapers 
                            : termPapers.filter(paper => paper.language === language);
                    }
                });
            }

            // Filter chapter papers
            if (resources.papers.chapters) {
                Object.keys(resources.papers.chapters).forEach(chapterKey => {
                    const chapterPapers = resources.papers.chapters[chapterKey];
                    if (Array.isArray(chapterPapers)) {
                        filtered.papers.chapters[chapterKey] = language === 'all' 
                            ? chapterPapers 
                            : chapterPapers.filter(paper => paper.language === language);
                    }
                });
            }
        }

        // Filter notes
        Object.keys(resources.notes).forEach(noteKey => {
            const note = resources.notes[noteKey];
            if (language === 'all' || note.language === language) {
                filtered.notes[noteKey] = note;
            }
        });

        // Filter videos
        filtered.videos = language === 'all' 
            ? videos 
            : videos.filter(video => video.language === language);

        return filtered;
    }

    // Get available languages for a specific subject
    getAvailableLanguages(gradeId, subjectId) {
        const resources = this.getResources(gradeId, subjectId);
        const videos = this.getVideos(gradeId, subjectId);
        const languages = new Set();

        // From textbooks
        Object.keys(resources.textbooks).forEach(medium => {
            languages.add(medium);
        });

        // From papers
        if (resources.papers) {
            if (resources.papers.terms) {
                Object.keys(resources.papers.terms).forEach(termKey => {
                    const termPapers = resources.papers.terms[termKey];
                    if (Array.isArray(termPapers)) {
                        termPapers.forEach(paper => {
                            if (paper.language) languages.add(paper.language);
                        });
                    }
                });
            }

            if (resources.papers.chapters) {
                Object.keys(resources.papers.chapters).forEach(chapterKey => {
                    const chapterPapers = resources.papers.chapters[chapterKey];
                    if (Array.isArray(chapterPapers)) {
                        chapterPapers.forEach(paper => {
                            if (paper.language) languages.add(paper.language);
                        });
                    }
                });
            }
        }

        // From notes
        Object.keys(resources.notes).forEach(noteKey => {
            const note = resources.notes[noteKey];
            if (note.language) languages.add(note.language);
        });

        // From videos
        videos.forEach(video => {
            if (video.language) languages.add(video.language);
        });

        return Array.from(languages);
    }
}

// Initialize global data manager
window.dataManager = new DataManager();