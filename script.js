// Modern CV JavaScript - 2025
class CVApp {
  constructor() {
    this.currentLang = this.detectLanguage();
    this.init();
  }

  detectLanguage() {
    const path = window.location.pathname;
    return path.includes('index-en.html') || path.includes('/en') ? 'en' : 'es';
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

    // Accordion toggles
    document.querySelectorAll('.accordion-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => this.handleAccordionToggle(e));
    });

    // Accordion headers (make entire header clickable)
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', (e) => {
        // Don't trigger if clicking on the toggle button itself
        if (!e.target.classList.contains('accordion-toggle') && !e.target.closest('.accordion-toggle')) {
          const toggle = header.querySelector('.accordion-toggle');
          if (toggle) {
            this.handleAccordionToggle({ target: toggle });
          }
        }
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Download buttons
    document.querySelectorAll('.cv-button').forEach(btn => {
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

    console.log('🔄 Language toggle clicked');
    console.log('Current language:', this.currentLang);
    console.log('New language:', newLang);

    // Add transition effect
    document.body.style.opacity = '0.7';
    document.body.style.transform = 'scale(0.98)';

    setTimeout(() => {
      if (newLang === 'es') {
        // Switch to Spanish - always go to root index.html
        console.log('🌐 Switching to Spanish: /');
        window.location.href = '/';
      } else {
        // Switch to English - go to index-en.html
        console.log('🌐 Switching to English: /index-en.html');
        window.location.href = '/index-en.html';
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

        // Calculate position accounting for sticky navigation
        const navHeight = document.querySelector('.navigation')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - navHeight - 20; // 20px extra padding

        // Smooth scroll to position
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without jumping
        history.pushState(null, null, href);
      }
    }
  }

  handleKeydown(e) {
    // Escape key to close any open accordion sections
    if (e.key === 'Escape') {
      document.querySelectorAll('.accordion-section.active').forEach(section => {
        this.toggleAccordion(section, false);
        const toggle = section.querySelector('.accordion-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    }

    // Enter/Space on accordion toggles
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('accordion-toggle')) {
      e.preventDefault();
      this.handleAccordionToggle(e);
    }

    // Enter/Space on buttons (legacy support)
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

  handleAccordionToggle(e) {
    e.preventDefault();
    e.stopPropagation();

    const toggle = e.currentTarget;
    const section = toggle.closest('.accordion-section');
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

    // Toggle the section
    this.toggleAccordion(section, !isExpanded);

    // Update ARIA attributes
    toggle.setAttribute('aria-expanded', !isExpanded);

    // Add visual feedback
    toggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
      toggle.style.transform = '';
    }, 100);
  }

  toggleAccordion(section, expand) {
    const content = section.querySelector('.accordion-content');
    const toggle = section.querySelector('.accordion-toggle');

    if (expand) {
      section.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');

      // Calculate proper height for content
      const scrollHeight = content.scrollHeight;
      content.style.maxHeight = scrollHeight + 'px';

      // Animate content appearance
      this.animateAccordionContent(content, true);
    } else {
      section.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');

      // Reset height to 0 for smooth collapse
      content.style.maxHeight = '0px';

      // Animate content disappearance
      this.animateAccordionContent(content, false);
    }
  }

  animateAccordionContent(content, show) {
    const children = content.children;

    if (show) {
      // Show content with staggered animation
      Array.from(children).forEach((child, index) => {
        setTimeout(() => {
          child.style.opacity = '1';
          child.style.transform = 'translateY(0)';
        }, index * 50);
      });
    } else {
      // Hide content immediately
      Array.from(children).forEach(child => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(-10px)';
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
      profile: this.currentLang === 'es' ? 'Perfil Profesional - Haz clic para expandir' : 'Professional Profile - Click to expand',
      experience: this.currentLang === 'es' ? 'Experiencia Profesional - Haz clic para expandir' : 'Professional Experience - Click to expand',
      education: this.currentLang === 'es' ? 'Educación y Certificaciones - Haz clic para expandir' : 'Education & Certifications - Click to expand',
      skills: this.currentLang === 'es' ? 'Habilidades - Haz clic para expandir' : 'Skills - Click to expand',
      languages: this.currentLang === 'es' ? 'Idiomas - Haz clic para expandir' : 'Languages - Click to expand'
    };

    Object.entries(sections).forEach(([id, label]) => {
      const section = document.getElementById(id);
      if (section) {
        const heading = section.querySelector('.accordion-header');
        if (heading) {
          heading.setAttribute('aria-label', label);
        }

        // Update toggle button labels
        const toggle = section.querySelector('.accordion-toggle');
        if (toggle) {
          const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
          const toggleLabel = isExpanded
            ? (this.currentLang === 'es' ? 'Colapsar sección' : 'Collapse section')
            : (this.currentLang === 'es' ? 'Expandir sección' : 'Expand section');
          toggle.setAttribute('aria-label', toggleLabel);
        }
      }
    });
  }

  animateOnLoad() {
    // Animate elements on page load
    setTimeout(() => {
      document.querySelectorAll('.profile-image').forEach(img => {
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

    // Update language toggle button text
    this.updateLanguageButton();
  }

  updateLanguageButton() {
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      const buttonText = this.currentLang === 'es' ? 'English' : 'Español';
      langToggle.innerHTML = `<i class="fas fa-globe"></i> ${buttonText}`;
    }
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

// Service Worker registration removed for GitHub Pages compatibility

// Test image loading
document.addEventListener('DOMContentLoaded', () => {
  const profileImage = document.querySelector('.profile-image');
  if (profileImage) {
    const img = new Image();
    img.onload = () => {
      console.log('✅ Profile image loaded successfully');
    };
    img.onerror = () => {
      console.error('❌ Profile image failed to load');
    };
    img.src = profileImage.src;
  }
});