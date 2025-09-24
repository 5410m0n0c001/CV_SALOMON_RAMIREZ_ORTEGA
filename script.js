// Modern CV JavaScript - 2025
class CVApp {
  constructor() {
    this.currentLang = this.detectLanguage();
    this.init();
  }

  detectLanguage() {
    return window.location.pathname.includes('/en') ? 'en' : 'es';
  }

  init() {
    this.setupEventListeners();
    this.setupIntersectionObserver();
    this.setupSmoothScrolling();
    this.setupAccessibility();
    this.animateOnLoad();
  }

  setupEventListeners() {
    // Language toggle
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      langToggle.addEventListener('click', () => this.toggleLanguage());
    }

    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Download buttons
    document.querySelectorAll('.download-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleDownload(e));
    });
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, options);

    // Observe sections
    document.querySelectorAll('.section').forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(section);
    });
  }

  setupSmoothScrolling() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  setupAccessibility() {
    // Add ARIA labels dynamically
    this.updateAriaLabels();

    // Focus management
    document.addEventListener('focusin', (e) => {
      e.target.setAttribute('data-focus-visible', '');
    });

    document.addEventListener('focusout', (e) => {
      e.target.removeAttribute('data-focus-visible');
    });
  }

  toggleLanguage() {
    const newLang = this.currentLang === 'es' ? 'en' : 'es';
    const currentPath = window.location.pathname;
    const isOnEnglishPage = currentPath.includes('/en') || currentPath.endsWith('-en.html');
    
    // Add transition effect
    document.body.style.opacity = '0.7';
    document.body.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
      if (newLang === 'es') {
        // Switch to Spanish
        if (isOnEnglishPage) {
          window.location.href = window.location.origin + window.location.pathname.replace('-en.html', '.html').replace('/en', '/');
        } else {
          window.location.href = window.location.origin + window.location.pathname.replace('index-en.html', 'index.html');
        }
      } else {
        // Switch to English
        if (isOnEnglishPage) {
          window.location.href = window.location.origin + window.location.pathname.replace('.html', '-en.html');
        } else {
          window.location.href = window.location.origin + window.location.pathname.replace('index.html', 'index-en.html');
        }
      }
    }, 200);
  }

  handleNavClick(e) {
    const link = e.currentTarget;
    const href = link.getAttribute('href');
    
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        // Add active state
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Smooth scroll
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Update URL without jumping
        history.pushState(null, null, href);
      }
    }
  }

  handleKeydown(e) {
    // Escape key to close any open sections
    if (e.key === 'Escape') {
      document.querySelectorAll('.section.expanded').forEach(section => {
        this.toggleSection(section, false);
      });
    }

    // Enter/Space on buttons
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('toggle-btn')) {
      e.preventDefault();
      this.toggleSection(e.target.closest('.section'));
    }
  }

  handleDownload(e) {
    const link = e.currentTarget;
    
    // Add download animation
    link.style.transform = 'scale(0.95)';
    setTimeout(() => {
      link.style.transform = '';
    }, 150);

    // Track download (if analytics available)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'download', {
        event_category: 'cv',
        event_label: link.href.includes('spanish') ? 'spanish' : 'english'
      });
    }
  }

  toggleSection(section, force) {
    const content = section.querySelector('.content');
    const isExpanded = force !== undefined ? force : !section.classList.contains('expanded');

    if (isExpanded) {
      section.classList.add('expanded');
      content.style.maxHeight = content.scrollHeight + 'px';
    } else {
      section.classList.remove('expanded');
      content.style.maxHeight = '0';
    }
  }

  updateAriaLabels() {
    // Update ARIA labels based on current language
    const sections = {
      profile: this.currentLang === 'es' ? 'Perfil Profesional' : 'Professional Profile',
      experience: this.currentLang === 'es' ? 'Experiencia Profesional' : 'Professional Experience',
      education: this.currentLang === 'es' ? 'Educación y Certificaciones' : 'Education & Certifications',
      skills: this.currentLang === 'es' ? 'Habilidades' : 'Skills',
      languages: this.currentLang === 'es' ? 'Idiomas' : 'Languages'
    };

    Object.entries(sections).forEach(([id, label]) => {
      const section = document.getElementById(id);
      if (section) {
        const heading = section.querySelector('h2');
        if (heading) {
          heading.setAttribute('aria-label', label);
        }
      }
    });
  }

  animateOnLoad() {
    // Animate elements on page load
    setTimeout(() => {
      document.querySelectorAll('.profile-img').forEach(img => {
        img.style.transform = 'scale(1)';
        img.style.opacity = '1';
      });
    }, 100);

    setTimeout(() => {
      document.querySelectorAll('.contact-link').forEach((link, index) => {
        setTimeout(() => {
          link.style.transform = 'translateY(0)';
          link.style.opacity = '1';
        }, index * 100);
      });
    }, 300);
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
    };
  }
}

// Performance monitoring
class PerformanceMonitor {
  static measurePageLoad() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
          
          // Log performance metrics
          console.log('📊 Performance Metrics:');
          console.log(`⏱️ Page Load Time: ${loadTime}ms`);
          console.log(`📈 DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`);
          console.log(`🎨 First Paint: ${PerformanceMonitor.getFirstPaint()}ms`);
        }, 0);
      });
    }
  }

  static getFirstPaint() {
    if ('performance' in window) {
      const paintEntries = performance.getEntriesByType('paint');
      const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
      return firstPaint ? firstPaint.startTime : 0;
    }
    return 0;
  }
}

// Error handling
window.addEventListener('error', (e) => {
  console.error('🚨 JavaScript Error:', e.error);
  // Could send to error reporting service
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('🚨 Unhandled Promise Rejection:', e.reason);
  // Could send to error reporting service
});

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CVApp();
    PerformanceMonitor.measurePageLoad();
  });
} else {
  new CVApp();
  PerformanceMonitor.measurePageLoad();
}

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ Service Worker registered:', registration);
      })
      .catch(error => {
        console.log('❌ Service Worker registration failed:', error);
      });
  });
}