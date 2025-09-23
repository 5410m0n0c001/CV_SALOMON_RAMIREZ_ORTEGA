// CV Interactive JavaScript - Simplified for static deployment
class CVApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeSections();
        this.initializeLanguageButton();
        this.setupSmoothScroll();
    }

    setupEventListeners() {
        // Language toggle
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleLanguage();
            });
        }

        // Section toggles
        const sectionHeaders = document.querySelectorAll('.section-header');
        sectionHeaders.forEach(header => {
            if (header && header.nextElementSibling) {
                header.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleSection(e.target);
                });
            }
        });

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleNavigation(e);
                });
            }
        });
    }

    initializeSections() {
        // Start with profile section open
        const currentUrl = window.location.href;
        const isEnglish = currentUrl.includes('index-en.html');
        const profileId = isEnglish ? 'profile-en-content' : 'profile-es-content';
        const profileSection = document.getElementById(profileId);

        if (profileSection) {
            this.closeAllSections();
            if (!profileSection.classList.contains('show')) {
                this.openSection(profileSection);
            }
        }
    }

    initializeLanguageButton() {
        const langToggle = document.getElementById('lang-toggle');
        if (!langToggle) {
            console.warn('Language toggle button not found');
            return;
        }

        try {
            // Set correct button text based on current page
            const currentPath = window.location.pathname;
            const currentUrl = window.location.href;
            const isEnglish = currentPath.includes('index-en.html') ||
                            currentPath.endsWith('/en') ||
                            currentUrl.includes('/en');

            // Set appropriate text and aria-label
            if (isEnglish) {
                langToggle.textContent = 'Español';
                langToggle.setAttribute('aria-label', 'Cambiar a versión en español');
            } else {
                langToggle.textContent = 'English';
                langToggle.setAttribute('aria-label', 'Switch to English version');
            }

            console.log('Language button initialized:', langToggle.textContent);
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
        // Find the section header and content
        let header;
        let content;

        if (target.classList.contains('section-header')) {
            header = target;
            content = target.nextElementSibling;
        } else {
            header = target.closest('.section-header');
            content = header?.nextElementSibling;
        }

        if (!header || !content) {
            return;
        }

        const isOpen = content.classList.contains('show');

        if (isOpen) {
            this.closeSection(content);
        } else {
            // Store the currently focused element for later restoration
            const currentlyFocused = document.activeElement;
            if (currentlyFocused && currentlyFocused !== header) {
                currentlyFocused.setAttribute('data-previously-focused', 'true');
            }

            this.closeAllSections();
            this.openSection(content);

            // Ensure the header stays focused for screen readers
            header.focus();
        }
    }

    openSection(content) {
        if (!content) return;

        content.classList.add('show');
        content.style.maxHeight = (content.scrollHeight + 50) + 'px';

        // Update header state
        const header = content.previousElementSibling;
        if (header) {
            header.classList.add('active');
            header.setAttribute('aria-expanded', 'true');
        }
    }

    closeSection(content) {
        if (!content) return;

        content.classList.remove('show');
        content.style.maxHeight = '0';

        // Update header state
        const header = content.previousElementSibling;
        if (header) {
            header.classList.remove('active');
            header.setAttribute('aria-expanded', 'false');
        }
    }

    toggleLanguage() {
        const langToggle = document.getElementById('lang-toggle');
        if (!langToggle) {
            console.error('Language toggle button not found');
            return;
        }

        try {
            // Determine current page and target language
            const currentPath = window.location.pathname;
            const currentUrl = window.location.href;
            const isCurrentlyEnglish = currentPath.includes('/en') ||
                                     currentPath.includes('index-en.html') ||
                                     currentUrl.includes('/en');

            // Navigate to target language page
            if (isCurrentlyEnglish) {
                // Currently on English page, switch to Spanish
                window.location.href = '/';
            } else {
                // Currently on Spanish page, switch to English
                window.location.href = '/en';
            }
        } catch (error) {
            console.error('Error toggling language:', error);
            // Fallback: try to determine language from URL
            if (window.location.href.includes('/en') || window.location.pathname.includes('index-en.html')) {
                window.location.href = '/';
            } else {
                window.location.href = '/en';
            }
        }
    }


    handleNavigation(e) {
        e.preventDefault();
        const href = e.target.getAttribute('href') || e.target.closest('a').getAttribute('href');

        if (href && href.startsWith('#')) {
            const sectionId = href.substring(1);
            const currentUrl = window.location.href;
            const isEnglish = currentUrl.includes('index-en.html');
            const contentId = isEnglish ?
                sectionId.replace('-en', '-en-content') :
                sectionId.replace('-es', '-es-content');

            const targetElement = document.getElementById(contentId);

            if (targetElement) {
                this.closeAllSections();
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
        if (e.key === 'Enter' || e.key === ' ') {
            const focused = document.activeElement;
            if (focused.classList.contains('section-header')) {
                e.preventDefault();
                this.toggleSection(focused);
            }
        }

        if (e.key === 'Escape') {
            const openSections = document.querySelectorAll('.section-content.show');
            openSections.forEach(section => {
                this.closeSection(section);
            });

            // Return focus to the previously focused element or main content
            const previouslyFocused = document.querySelector('[data-previously-focused]');
            if (previouslyFocused) {
                previouslyFocused.focus();
                previouslyFocused.removeAttribute('data-previously-focused');
            } else {
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.focus();
                }
            }
        }

        // Arrow key navigation for sections
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const focused = document.activeElement;
            if (focused.classList.contains('section-header')) {
                e.preventDefault();
                const allHeaders = Array.from(document.querySelectorAll('.section-header'));
                const currentIndex = allHeaders.indexOf(focused);
                let nextIndex;

                if (e.key === 'ArrowDown') {
                    nextIndex = (currentIndex + 1) % allHeaders.length;
                } else {
                    nextIndex = currentIndex === 0 ? allHeaders.length - 1 : currentIndex - 1;
                }

                allHeaders[nextIndex].focus();
            }
        }
    }

    handleResize() {
        const openSections = document.querySelectorAll('.section-content.show');
        openSections.forEach(section => {
            section.style.maxHeight = (section.scrollHeight + 50) + 'px';
        });
    }

    downloadPDF(language) {
        try {
            const sanitizedLanguage = String(language).toLowerCase().trim();
            if (!['spanish', 'english'].includes(sanitizedLanguage)) {
                console.error('Invalid language parameter:', language);
                this.showNotification('Error: Invalid language specified', 'error');
                return;
            }

            const pdfFiles = {
                spanish: 'SalomónRamírezOrtega.CV.2.0.pdf_2025_9_8 (1).pdf',
                english: 'SALOMON_RAMIREZ_ORTEGA_CV_ENG.PDF'
            };

            const fileName = pdfFiles[sanitizedLanguage];
            if (!fileName) {
                console.error('PDF file not found for language:', sanitizedLanguage);
                this.showNotification('Error: PDF file not found', 'error');
                return;
            }

            // Check if file exists by trying to fetch it first
            fetch(fileName, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        this.performDownload(fileName, sanitizedLanguage);
                    } else {
                        throw new Error('File not accessible');
                    }
                })
                .catch(error => {
                    console.error('Error accessing PDF file:', error);
                    this.showNotification('Error: Unable to access PDF file', 'error');
                });

        } catch (error) {
            console.error('Error in downloadPDF:', error);
            this.showNotification('Error: Download failed', 'error');
        }
    }

    performDownload(fileName, language) {
        try {
            const link = document.createElement('a');
            link.href = fileName;
            link.download = fileName;
            link.style.display = 'none';
            link.rel = 'noopener noreferrer';

            // Add to DOM, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show success notification
            const languageName = language === 'spanish' ? 'Español' : 'English';
            this.showNotification(`CV en ${languageName} descargado exitosamente`, 'success');

        } catch (error) {
            console.error('Error performing download:', error);
            this.showNotification('Error: Download failed', 'error');
        }
    }

    showNotification(message, type = 'info') {
        try {
            // Remove existing notifications
            const existingNotifications = document.querySelectorAll('.download-notification');
            existingNotifications.forEach(notification => notification.remove());

            // Create notification element
            const notification = document.createElement('div');
            notification.className = `download-notification notification-${type}`;
            notification.setAttribute('role', 'alert');
            notification.setAttribute('aria-live', 'polite');
            notification.textContent = message;

            // Style the notification
            Object.assign(notification.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '15px 20px',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                zIndex: '10000',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                transform: 'translateX(100%)',
                transition: 'transform 0.3s ease-in-out',
                maxWidth: '300px',
                wordWrap: 'break-word'
            });

            // Set background color based on type
            switch (type) {
                case 'success':
                    notification.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
                    break;
                case 'error':
                    notification.style.background = 'linear-gradient(135deg, #dc3545, #e74c3c)';
                    break;
                default:
                    notification.style.background = 'linear-gradient(135deg, #4a90e2, #357abd)';
            }

            document.body.appendChild(notification);

            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);

            // Auto remove after 5 seconds
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 5000);

        } catch (error) {
            console.error('Error showing notification:', error);
        }
    }
}

// Initialize the CV app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const cvApp = new CVApp();

    // Make downloadPDF function globally available
    window.downloadPDF = (language) => {
        cvApp.downloadPDF(language);
    };
});