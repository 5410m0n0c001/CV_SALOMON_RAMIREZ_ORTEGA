// CV Interactive JavaScript
class CVApp {
    constructor() {
        this.currentLanguage = 'es';
        this.observers = new Set();
        this.eventListeners = new Map();
        this.init();
    }

    init() {
        try {
            this.setupEventListeners();
            this.initializeSections();
            this.setupSmoothScroll();
            this.addAnimationClasses();
        } catch (error) {
            console.error('Error initializing CV App:', error);
            this.handleInitializationError(error);
        }
    }

    handleInitializationError(error) {
        // Fallback functionality if initialization fails
        console.warn('CV App initialization failed, using fallback mode');
        // Ensure basic functionality works even if advanced features fail
        this.setupBasicFunctionality();
    }

    setupBasicFunctionality() {
        // Basic section toggling without advanced features
        const sectionHeaders = document.querySelectorAll('.section-header');
        sectionHeaders.forEach(header => {
            if (header && header.nextElementSibling) {
                header.style.cursor = 'pointer';
                header.addEventListener('click', (e) => {
                    const content = header.nextElementSibling;
                    if (content) {
                        content.style.display = content.style.display === 'none' ? 'block' : 'none';
                    }
                });
            }
        });
    }

    setupEventListeners() {
        try {
            // Language toggle with error handling
            const langToggle = document.getElementById('lang-toggle');
            if (langToggle) {
                const langToggleHandler = (e) => {
                    try {
                        e.preventDefault();
                        this.toggleLanguage();
                    } catch (error) {
                        console.error('Error in language toggle:', error);
                    }
                };
                langToggle.addEventListener('click', langToggleHandler);
                this.eventListeners.set('langToggle', langToggleHandler);
            }

            // Section toggles with null checks
            const sectionHeaders = document.querySelectorAll('.section-header');
            sectionHeaders.forEach((header, index) => {
                if (header && header.nextElementSibling) {
                    const sectionToggleHandler = (e) => {
                        try {
                            e.preventDefault();
                            this.toggleSection(e.target);
                        } catch (error) {
                            console.error('Error toggling section:', error);
                        }
                    };
                    header.addEventListener('click', sectionToggleHandler);
                    this.eventListeners.set(`sectionHeader_${index}`, sectionToggleHandler);
                }
            });

            // Navigation links with error handling
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach((link, index) => {
                if (link) {
                    const navClickHandler = (e) => {
                        try {
                            e.preventDefault();
                            this.handleNavigation(e);
                        } catch (error) {
                            console.error('Error in navigation:', error);
                        }
                    };
                    link.addEventListener('click', navClickHandler);
                    this.eventListeners.set(`navLink_${index}`, navClickHandler);
                }
            });

            // Keyboard navigation with error handling
            const keyboardHandler = (e) => {
                try {
                    this.handleKeyboard(e);
                } catch (error) {
                    console.error('Error in keyboard navigation:', error);
                }
            };
            document.addEventListener('keydown', keyboardHandler);
            this.eventListeners.set('keyboard', keyboardHandler);

            // Window resize with debouncing and error handling
            const resizeHandler = this.debounce(() => {
                try {
                    this.handleResize();
                } catch (error) {
                    console.error('Error in resize handler:', error);
                }
            }, 250);
            window.addEventListener('resize', resizeHandler);
            this.eventListeners.set('resize', resizeHandler);

        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    initializeSections() {
        // Start with profile section open - detect language and use appropriate ID
        const currentUrl = window.location.href;
        const isEnglish = currentUrl.includes('index-en.html');
        const profileId = isEnglish ? 'profile-en-content' : 'profile-es-content';
        const profileSection = document.getElementById(profileId);
        if (profileSection) {
            this.openSection(profileSection);
        }
    }

    setupSmoothScroll() {
        // Smooth scroll for navigation links
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const headerHeight = document.querySelector('.cv-header').offsetHeight +
                                       document.querySelector('.download-section').offsetHeight +
                                       document.querySelector('.cv-nav').offsetHeight + 40;

                    const targetPosition = targetElement.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    addAnimationClasses() {
        // Add fade-in animation to sections on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        const sections = document.querySelectorAll('.cv-section');
        sections.forEach(section => observer.observe(section));
    }

    toggleSection(target) {
        try {
            // Find the section header and content with null checks
            const header = target?.closest('.section-header');
            const content = header?.nextElementSibling;

            if (!header || !content) {
                console.warn('Section header or content not found');
                return;
            }

            const isOpen = content.classList.contains('show');
            const toggleIcon = header.querySelector('.toggle-icon');

            if (isOpen) {
                this.closeSection(content, toggleIcon);
            } else {
                this.openSection(content, toggleIcon);
            }
        } catch (error) {
            console.error('Error toggling section:', error);
        }
    }

    openSection(content, toggleIcon = null) {
        try {
            if (!content) {
                console.warn('Content element not provided to openSection');
                return;
            }

            content.classList.add('show');

            // Use a slight delay to ensure content is fully rendered
            setTimeout(() => {
                if (content && content.scrollHeight) {
                    const scrollHeight = content.scrollHeight;
                    content.style.maxHeight = (scrollHeight + 50) + 'px'; // Add extra padding

                    // Double-check after a longer delay for complex content like Skills
                    setTimeout(() => {
                        this.ensureContentVisible(content);
                    }, 100);
                }
            }, 10);

            if (toggleIcon) {
                toggleIcon.style.transform = 'rotate(180deg)';
            }

            // Add active class to header
            const header = content.previousElementSibling;
            if (header) {
                header.classList.add('active');
            }
        } catch (error) {
            console.error('Error opening section:', error);
        }
    }

    closeSection(content, toggleIcon = null) {
        try {
            if (!content) {
                console.warn('Content element not provided to closeSection');
                return;
            }

            content.classList.remove('show');
            content.style.maxHeight = '0';

            if (toggleIcon) {
                toggleIcon.style.transform = 'rotate(0deg)';
            }

            // Remove active class from header
            const header = content.previousElementSibling;
            if (header) {
                header.classList.remove('active');
            }
        } catch (error) {
            console.error('Error closing section:', error);
        }
    }

    toggleLanguage() {
        const langToggle = document.getElementById('lang-toggle');
        if (!langToggle) return;

        if (this.currentLanguage === 'es') {
            this.currentLanguage = 'en';
            langToggle.textContent = 'Español';
            this.switchToEnglish();
        } else {
            this.currentLanguage = 'es';
            langToggle.textContent = 'English';
            this.switchToSpanish();
        }

        // Save language preference
        localStorage.setItem('cv-language', this.currentLanguage);

        // Add animation effect
        langToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            langToggle.style.transform = 'scale(1)';
        }, 150);
    }

    switchToEnglish() {
        // Redirect to English version
        const currentUrl = window.location.href;
        if (!currentUrl.includes('index-en.html')) {
            const englishUrl = currentUrl.replace('index.html', 'index-en.html');
            window.location.href = englishUrl;
        }
    }

    switchToSpanish() {
        // Redirect to Spanish version
        const currentUrl = window.location.href;
        if (!currentUrl.includes('index.html') || currentUrl.includes('index-en.html')) {
            const spanishUrl = currentUrl.replace('index-en.html', 'index.html');
            window.location.href = spanishUrl;
        }
    }

    handleNavigation(e) {
        e.preventDefault();
        const href = e.target.getAttribute('href') || e.target.closest('a').getAttribute('href');

        if (href && href.startsWith('#')) {
            const sectionId = href.substring(1);
            // Determine the correct content ID based on the section ID
            const currentUrl = window.location.href;
            const isEnglish = currentUrl.includes('index-en.html');
            const contentId = isEnglish ?
                sectionId.replace('-en', '-en-content') :
                sectionId.replace('-es', '-es-content');

            const targetElement = document.getElementById(contentId);

            if (targetElement) {
                // Close all other sections first
                const allSections = document.querySelectorAll('.section-content');
                allSections.forEach(section => {
                    if (section !== targetElement) {
                        this.closeSection(section);
                    }
                });

                // Open the target section
                this.openSection(targetElement);

                // Smooth scroll to section
                const headerHeight = document.querySelector('.cv-header').offsetHeight +
                                   document.querySelector('.download-section').offsetHeight +
                                   document.querySelector('.cv-nav').offsetHeight + 40;

                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }

    handleKeyboard(e) {
        // Handle keyboard navigation
        if (e.key === 'Enter' || e.key === ' ') {
            const focused = document.activeElement;
            if (focused.classList.contains('section-header')) {
                e.preventDefault();
                this.toggleSection(focused);
            }
        }

        // Handle escape key to close sections
        if (e.key === 'Escape') {
            const openSections = document.querySelectorAll('.section-content.show');
            openSections.forEach(section => {
                this.closeSection(section);
            });
        }
    }

    handleResize() {
        // Recalculate max-height for open sections on resize
        const openSections = document.querySelectorAll('.section-content.show');
        openSections.forEach(section => {
            section.style.maxHeight = (section.scrollHeight + 50) + 'px';
        });
    }

    // Utility method to ensure content is fully visible
    ensureContentVisible(content) {
        if (content && content.classList.contains('show')) {
            const scrollHeight = content.scrollHeight;
            const currentMaxHeight = parseInt(content.style.maxHeight) || 0;

            // If content is larger than current max-height, update it
            if (scrollHeight > currentMaxHeight) {
                content.style.maxHeight = (scrollHeight + 50) + 'px';
            }
        }
    }

    downloadPDF(language) {
        try {
            // PDF download functionality with error handling
            const pdfFiles = {
                spanish: 'SalomónRamírezOrtega.CV.2.0.pdf_2025_9_8 (1).pdf',
                english: 'SALOMON_RAMIREZ_ORTEGA_CV_ENG.PDF'
            };

            const fileName = pdfFiles[language];
            if (!fileName) {
                console.error('PDF file not found for language:', language);
                this.showErrorNotification('Archivo PDF no encontrado');
                return;
            }

            // Check if file exists (basic check)
            if (typeof fetch !== 'undefined') {
                fetch(fileName, { method: 'HEAD' })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`PDF file not accessible: ${response.status}`);
                        }
                        this.performDownload(fileName, language);
                    })
                    .catch(error => {
                        console.error('Error checking PDF file:', error);
                        // Fallback to direct download
                        this.performDownload(fileName, language);
                    });
            } else {
                // Fallback for browsers without fetch
                this.performDownload(fileName, language);
            }
        } catch (error) {
            console.error('Error in downloadPDF:', error);
            this.showErrorNotification('Error al descargar el archivo');
        }
    }

    performDownload(fileName, language) {
        try {
            // Create download link with security considerations
            const link = document.createElement('a');
            link.href = fileName;
            link.download = fileName;
            link.style.display = 'none';
            link.rel = 'noopener noreferrer';

            // Add to DOM, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show download feedback
            this.showDownloadFeedback(language);
        } catch (error) {
            console.error('Error performing download:', error);
            this.showErrorNotification('Error al iniciar la descarga');
        }
    }

    showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    showDownloadFeedback(language) {
        // Create and show download notification
        const notification = document.createElement('div');
        notification.className = 'download-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>Descargando CV en ${language === 'spanish' ? 'Español' : 'Inglés'}...</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Utility methods
    debounce(func, wait) {
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Cleanup method for proper memory management
    cleanup() {
        try {
            // Clear all observers
            this.observers.forEach(observer => {
                if (observer && typeof observer.disconnect === 'function') {
                    observer.disconnect();
                }
            });
            this.observers.clear();

            // Remove all event listeners
            this.eventListeners.forEach((handler, key) => {
                // Remove from appropriate elements based on key
                if (key === 'keyboard') {
                    document.removeEventListener('keydown', handler);
                } else if (key === 'resize') {
                    window.removeEventListener('resize', handler);
                } else if (key.startsWith('sectionHeader_')) {
                    // Section headers are already handled by the Map cleanup
                } else if (key.startsWith('navLink_')) {
                    // Navigation links are already handled by the Map cleanup
                }
            });
            this.eventListeners.clear();

            console.log('CV App cleaned up successfully');
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    }

    // Safe external link handler
    openExternalLink(url, target = '_blank') {
        try {
            if (!url || typeof url !== 'string') {
                console.error('Invalid URL provided to openExternalLink');
                return;
            }

            // Validate URL format
            const urlPattern = /^https?:\/\/.+/i;
            if (!urlPattern.test(url)) {
                console.error('Invalid URL format:', url);
                return;
            }

            // Create link with security attributes
            const link = document.createElement('a');
            link.href = url;
            link.target = target;
            link.rel = 'noopener noreferrer';
            link.style.display = 'none';

            // Add to DOM, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Error opening external link:', error);
            // Fallback: try opening in same window
            try {
                window.location.href = url;
            } catch (fallbackError) {
                console.error('Fallback navigation also failed:', fallbackError);
            }
        }
    }
}

// Initialize the CV app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        const cvApp = new CVApp();

        // Make CV app globally available for cleanup
        window.cvApp = cvApp;

        // Make downloadPDF function globally available with error handling
        window.downloadPDF = (language) => {
            try {
                cvApp.downloadPDF(language);
            } catch (error) {
                console.error('Error in global downloadPDF function:', error);
            }
        };

        // Make external link handler globally available
        window.openExternalLink = (url, target = '_blank') => {
            try {
                cvApp.openExternalLink(url, target);
            } catch (error) {
                console.error('Error in global openExternalLink function:', error);
            }
        };

        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            .download-notification, .error-notification {
                font-weight: 500;
                font-size: 0.9rem;
            }

            .notification-content i {
                font-size: 1.1rem;
            }
        `;
        document.head.appendChild(style);

        console.log('CV Interactive App initialized successfully!');
    } catch (error) {
        console.error('Error initializing CV App:', error);
    }
});

// Cleanup method for proper memory management
window.addEventListener('beforeunload', () => {
    // Clean up observers and event listeners
    if (window.cvApp) {
        window.cvApp.cleanup();
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CVApp;
}