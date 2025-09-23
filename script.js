// CV Interactive JavaScript
class CVApp {
    constructor() {
        this.currentLanguage = 'es';
        this.observers = new Set();
        this.eventListeners = new Map();
        this.init();
    }

    // Enhanced asset loading with fallback
    loadAssetWithFallback(primarySrc, fallbackSrc, element) {
        const img = new Image();

        img.onload = () => {
            element.src = primarySrc;
        };

        img.onerror = () => {
            console.warn(`Failed to load asset: ${primarySrc}, trying fallback: ${fallbackSrc}`);
            element.src = fallbackSrc;
        };

        img.src = primarySrc;
    }

    init() {
        try {
            this.initializeAssets();
            this.setupEventListeners();
            this.initializeSections();
            this.initializeLanguageButton();
            this.setupSmoothScroll();
            this.addAnimationClasses();
        } catch (error) {
            console.error('Error initializing CV App:', error);
            this.handleInitializationError(error);
        }
    }

    initializeAssets() {
        try {
            // Initialize profile image with fallback
            const profileImage = document.querySelector('.profile-image img');
            if (profileImage) {
                const primarySrc = 'alex.png';
                const fallbackSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjNGE5MGUyIiByeD0iNzUiLz4KPHRleHQgeD0iNzUiIHk9Ijc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0OCIgZm9udC1mYW1pbHk9IkFyaWFsIj5TUjwvdGV4dD4KPC9zdmc+';

                this.loadAssetWithFallback(primarySrc, fallbackSrc, profileImage);
            }
        } catch (error) {
            console.error('Error initializing assets:', error);
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
        try {
            // Start with profile section open - detect language and use appropriate ID
            const currentUrl = window.location.href;
            const isEnglish = currentUrl.includes('index-en.html');
            const profileId = isEnglish ? 'profile-en-content' : 'profile-es-content';
            const profileSection = document.getElementById(profileId);

            if (profileSection) {
                // Ensure only profile section is open initially
                this.closeAllSections();

                // Only open profile section if it's not already open
                if (!profileSection.classList.contains('show')) {
                    this.openSection(profileSection);
                }
            }

            // Set up ARIA attributes for all section headers
            const sectionHeaders = document.querySelectorAll('.section-header');
            sectionHeaders.forEach(header => {
                const content = header.nextElementSibling;
                if (content) {
                    // Set initial ARIA attributes
                    const isExpanded = content.classList.contains('show');
                    header.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
                    header.setAttribute('aria-controls', content.id);
                    content.setAttribute('aria-labelledby', header.querySelector('h2').id || 'section-title');
                }
            });
        } catch (error) {
            console.error('Error initializing sections:', error);
        }
    }

    initializeLanguageButton() {
        try {
            const langToggle = document.getElementById('lang-toggle');
            if (!langToggle) return;

            // Set correct button text based on current page
            const currentPath = window.location.pathname;
            const isEnglish = currentPath.includes('index-en.html') || currentPath.endsWith('/en');

            // Button should show the target language (what you'll switch TO)
            langToggle.textContent = isEnglish ? 'Español' : 'English';

            // Update current language for internal tracking
            this.currentLanguage = isEnglish ? 'en' : 'es';

        } catch (error) {
            console.error('Error initializing language button:', error);
        }
    }

    // Helper method to close all sections
    closeAllSections() {
        const allSections = document.querySelectorAll('.section-content');
        allSections.forEach(section => {
            this.closeSection(section);
        });
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
            let header;
            let content;

            // If target is the header itself, use it directly
            if (target.classList.contains('section-header')) {
                header = target;
                content = target.nextElementSibling;
            } else {
                // Otherwise, find the closest section header
                header = target.closest('.section-header');
                content = header?.nextElementSibling;
            }

            if (!header || !content) {
                console.warn('Section header or content not found');
                return;
            }

            const isOpen = content.classList.contains('show');

            if (isOpen) {
                // Close this section only
                this.closeSection(content);
            } else {
                // Close all other sections first, then open this one
                this.closeAllSections();
                this.openSection(content);
            }
        } catch (error) {
            console.error('Error toggling section:', error);
            // Fallback: try basic toggle
            this.basicToggle(target);
        }
    }

    basicToggle(target) {
        // Simple fallback toggle without animations
        let content;
        if (target.classList.contains('section-header')) {
            content = target.nextElementSibling;
        } else {
            const header = target.closest('.section-header');
            content = header?.nextElementSibling;
        }

        if (content) {
            const isVisible = content.style.display !== 'none';
            content.style.display = isVisible ? 'none' : 'block';
            content.style.maxHeight = isVisible ? '0' : 'none';
        }
    }

    openSection(content, toggleIcon = null) {
        try {
            if (!content) {
                console.warn('Content element not provided to openSection');
                return;
            }

            content.classList.add('show');

            // Use requestAnimationFrame for better performance
            requestAnimationFrame(() => {
                if (content && content.scrollHeight > 0) {
                    const scrollHeight = content.scrollHeight;
                    content.style.maxHeight = (scrollHeight + 50) + 'px'; // Add extra padding

                    // Double-check after content is fully rendered
                    setTimeout(() => {
                        this.ensureContentVisible(content);
                    }, 50);
                } else {
                    // Fallback for content without scrollHeight
                    content.style.maxHeight = '2000px';
                }
            });

            if (toggleIcon) {
                toggleIcon.style.transform = 'rotate(180deg)';
                toggleIcon.setAttribute('aria-expanded', 'true');
            }

            // Add active class to header and update ARIA attributes
            const header = content.previousElementSibling;
            if (header) {
                header.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            }
        } catch (error) {
            console.error('Error opening section:', error);
            // Fallback: basic show
            content.style.display = 'block';
            content.style.maxHeight = '2000px';
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
                toggleIcon.setAttribute('aria-expanded', 'false');
            }

            // Remove active class from header and update ARIA attributes
            const header = content.previousElementSibling;
            if (header) {
                header.classList.remove('active');
                header.setAttribute('aria-expanded', 'false');
            }
        } catch (error) {
            console.error('Error closing section:', error);
            // Fallback: basic hide
            content.style.display = 'none';
            content.style.maxHeight = '0';
        }
    }

    toggleLanguage() {
        const langToggle = document.getElementById('lang-toggle');
        if (!langToggle) return;

        // Determine current page and target language
        const currentPath = window.location.pathname;
        const isCurrentlyEnglish = currentPath.includes('/en') || currentPath.includes('index-en.html');

        // Navigate to target language page
        if (isCurrentlyEnglish) {
            // Currently on English page, switch to Spanish
            window.location.href = '/';
        } else {
            // Currently on Spanish page, switch to English
            window.location.href = '/en';
        }
    }

    switchToEnglish() {
        // Redirect to English version for static deployment
        window.location.href = './index-en.html';
    }

    switchToSpanish() {
        // Redirect to Spanish version for static deployment
        window.location.href = './index.html';
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
            // Sanitize input to prevent XSS
            const sanitizedLanguage = String(language).toLowerCase().trim();
            if (!['spanish', 'english'].includes(sanitizedLanguage)) {
                console.error('Invalid language parameter:', language);
                this.showErrorNotification('Parámetro de idioma inválido');
                return;
            }

            // PDF download functionality with error handling
            const pdfFiles = {
                spanish: this.getAssetPath('SalomónRamírezOrtega.CV.2.0.pdf_2025_9_8 (1).pdf'),
                english: this.getAssetPath('SALOMON_RAMIREZ_ORTEGA_CV_ENG.PDF')
            };

            const fileName = pdfFiles[sanitizedLanguage];
            if (!fileName) {
                console.error('PDF file not found for language:', sanitizedLanguage);
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

    // Utility methods with performance optimizations and error handling
    debounce(func, wait) {
        if (typeof func !== 'function') {
            console.error('debounce: func must be a function');
            return func;
        }

        let timeout;
        return function executedFunction(...args) {
            try {
                const later = () => {
                    clearTimeout(timeout);
                    func.apply(this, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            } catch (error) {
                console.error('Error in debounced function:', error);
            }
        };
    }

    throttle(func, limit) {
        if (typeof func !== 'function') {
            console.error('throttle: func must be a function');
            return func;
        }

        let inThrottle;
        return function() {
            try {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            } catch (error) {
                console.error('Error in throttled function:', error);
            }
        }
    }

    // Performance monitoring with error handling
    measurePerformance(name, fn) {
        if (typeof name !== 'string' || typeof fn !== 'function') {
            console.error('measurePerformance: name must be a string and fn must be a function');
            return fn();
        }

        try {
            const start = performance.now();
            const result = fn();
            const end = performance.now();
            const duration = end - start;
            console.log(`${name} took ${duration.toFixed(2)} milliseconds`);

            // Warn if performance is poor
            if (duration > 100) {
                console.warn(`Performance warning: ${name} took ${duration.toFixed(2)}ms`);
            }

            return result;
        } catch (error) {
            console.error(`Error measuring performance for ${name}:`, error);
            return fn(); // Fallback to running the function without measurement
        }
    }

    // Lazy loading for non-critical features with error handling
    lazyLoadFeature(featureName, featureFn) {
        if (typeof featureName !== 'string' || typeof featureFn !== 'function') {
            console.error('lazyLoadFeature: featureName must be a string and featureFn must be a function');
            return;
        }

        try {
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            try {
                                featureFn();
                            } catch (error) {
                                console.error(`Error in lazy-loaded feature ${featureName}:`, error);
                            }
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    rootMargin: '50px' // Load 50px before element comes into view
                });

                const target = document.querySelector(`[data-lazy-${featureName}]`);
                if (target) {
                    observer.observe(target);
                } else {
                    console.warn(`Lazy load target [data-lazy-${featureName}] not found`);
                }
            } else {
                // Fallback for older browsers
                console.log(`IntersectionObserver not supported, running ${featureName} immediately`);
                featureFn();
            }
        } catch (error) {
            console.error(`Error setting up lazy loading for ${featureName}:`, error);
            // Fallback: run the feature immediately
            featureFn();
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

    // Safe external link handler with cross-browser compatibility
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

            // Cross-browser compatible way to open links
            const link = document.createElement('a');
            link.href = url;
            link.target = target;

            // Add security attributes for modern browsers
            if ('rel' in link) {
                link.rel = 'noopener noreferrer';
            }

            link.style.display = 'none';

            // Add to DOM, click, and remove
            document.body.appendChild(link);

            // Use click() method with fallback for older browsers
            if (link.click) {
                link.click();
            } else {
                // Fallback for very old browsers
                const event = document.createEvent('MouseEvents');
                event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                link.dispatchEvent(event);
            }

            document.body.removeChild(link);

        } catch (error) {
            console.error('Error opening external link:', error);
            // Fallback: try opening in same window
            try {
                if (window.location && window.location.href) {
                    window.location.href = url;
                }
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