// script.js - Accessible accordion + smooth nav scrolling
document.addEventListener('DOMContentLoaded', () => {
  // Accordion headers
  const headers = Array.from(document.querySelectorAll('.section-header'));
  headers.forEach(header => {
    const content = header.nextElementSibling;

    if (content && content.classList.contains('section-content')) {
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', 0);
      header.setAttribute('aria-expanded', 'false');

      content.classList.remove('open');
      content.style.maxHeight = null;

      // Toggle on click
      header.addEventListener('click', () => toggleHeader(header, content));

      // Toggle on Enter/Space
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleHeader(header, content);
        }
      });
    }
  });

  function toggleHeader(header, content) {
    const isOpen = header.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      header.setAttribute('aria-expanded', 'false');
      content.classList.remove('open');
      content.style.maxHeight = content.scrollHeight + 'px';
      requestAnimationFrame(() => {
        content.style.maxHeight = '0px';
      });
    } else {
      header.setAttribute('aria-expanded', 'true');
      content.classList.add('open');
      content.style.maxHeight = content.scrollHeight + 'px';
      content.addEventListener('transitionend', function te() {
        if (content.classList.contains('open')) {
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          content.style.maxHeight = null;
        }
        content.removeEventListener('transitionend', te);
      });
    }
  }

  // Smooth scroll for nav links
  const navLinks = Array.from(document.querySelectorAll('.cv-nav a, .nav-link'));
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});