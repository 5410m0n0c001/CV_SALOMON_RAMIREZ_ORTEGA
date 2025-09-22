// CV Interactive JavaScript
class CVApp {
    constructor() {
        this.currentLanguage = 'es';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeSections();
        this.setupSmoothScroll();
        this.addAnimationClasses();
    }

    setupEventListeners() {
        // Language toggle
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }

        // Section toggles
        const sectionHeaders = document.querySelectorAll('.section-header');
        sectionHeaders.forEach(header => {
            header.addEventListener('click', (e) => this.toggleSection(e.target));
        });

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    initializeSections() {
        // Start with profile section open
        const profileSection = document.getElementById('profile-content');
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
        // Find the section header and content
        const header = target.closest('.section-header');
        const content = header.nextElementSibling;

        if (!header || !content) return;

        const isOpen = content.classList.contains('show');
        const toggleIcon = header.querySelector('.toggle-icon');

        if (isOpen) {
            this.closeSection(content, toggleIcon);
        } else {
            this.openSection(content, toggleIcon);
        }
    }

    openSection(content, toggleIcon = null) {
        content.classList.add('show');
        content.style.maxHeight = content.scrollHeight + 'px';

        if (toggleIcon) {
            toggleIcon.style.transform = 'rotate(180deg)';
        }

        // Add active class to header
        const header = content.previousElementSibling;
        if (header) {
            header.classList.add('active');
        }
    }

    closeSection(content, toggleIcon = null) {
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
        // This would typically load the English version
        // For now, we'll just update the interface text
        console.log('Switching to English version');
    }

    switchToSpanish() {
        // This would typically load the Spanish version
        // For now, we'll just update the interface text
        console.log('Switching to Spanish version');
    }

    handleNavigation(e) {
        e.preventDefault();
        const href = e.target.getAttribute('href') || e.target.closest('a').getAttribute('href');

        if (href && href.startsWith('#')) {
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

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
            section.style.maxHeight = section.scrollHeight + 'px';
        });
    }

    downloadPDF(language) {
        // PDF download functionality
        const pdfFiles = {
            spanish: 'SalomónRamírezOrtega.CV.2.0.pdf_2025_9_8 (1).pdf',
            english: 'SALOMON_RAMIREZ_ORTEGA_CV_ENG.PDF'
        };

        const fileName = pdfFiles[language];
        if (!fileName) {
            console.error('PDF file not found for language:', language);
            return;
        }

        // Create download link
        const link = document.createElement('a');
        link.href = fileName;
        link.download = fileName;
        link.style.display = 'none';

        // Add to DOM, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Show download feedback
        this.showDownloadFeedback(language);
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
}

// Initialize the CV app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const cvApp = new CVApp();

    // Make downloadPDF function globally available
    window.downloadPDF = (language) => cvApp.downloadPDF(language);

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
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

        .download-notification {
            font-weight: 500;
            font-size: 0.9rem;
        }

        .notification-content i {
            font-size: 1.1rem;
        }
    `;
    document.head.appendChild(style);

    console.log('CV Interactive App initialized successfully!');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CVApp;
}