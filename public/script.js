// script.js - Accessible accordion + smooth nav scrolling
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing accordion...');

  // Accordion headers - try multiple selectors to ensure we find them
  const headers = Array.from(document.querySelectorAll('.section-header, .cv-section .section-header'));
  console.log('Found headers:', headers.length);

  headers.forEach((header, index) => {
    console.log(`Processing header ${index}:`, header);

    // Try to find the content in multiple ways
    let content = header.nextElementSibling;

    // If next sibling doesn't work, try to find by ID
    if (!content || !content.classList.contains('section-content')) {
      const headerId = header.getAttribute('aria-controls');
      if (headerId) {
        content = document.getElementById(headerId);
        console.log('Found content by ID:', content);
      }
    }

    console.log(`Content for header ${index}:`, content);

    if (content && content.classList.contains('section-content')) {
      // Ensure proper ARIA attributes
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', 0);
      header.setAttribute('aria-expanded', 'false');

      // Reset content state
      content.classList.remove('open');
      content.style.maxHeight = null;

      // Toggle on click
      header.addEventListener('click', (e) => {
        console.log('Header clicked:', header);
        e.preventDefault();
        e.stopPropagation();
        toggleHeader(header, content);
      });

      // Toggle on Enter/Space
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleHeader(header, content);
        }
      });

      console.log(`Successfully initialized header ${index}`);
    } else {
      console.log('No matching content found for header:', header);
    }
  });

  function toggleHeader(header, content) {
    console.log('toggleHeader called with:', header, content);
    const isOpen = header.getAttribute('aria-expanded') === 'true';
    console.log('Current state - isOpen:', isOpen);

    if (isOpen) {
      console.log('Closing section...');
      header.setAttribute('aria-expanded', 'false');
      content.classList.remove('open');

      // Set initial height for smooth transition
      content.style.maxHeight = content.scrollHeight + 'px';

      // Use requestAnimationFrame for smooth animation
      requestAnimationFrame(() => {
        content.style.maxHeight = '0px';
      });
    } else {
      console.log('Opening section...');
      header.setAttribute('aria-expanded', 'true');
      content.classList.add('open');

      // Set initial height for smooth transition
      content.style.maxHeight = content.scrollHeight + 'px';

      // Listen for transition end to set final height
      content.addEventListener('transitionend', function te() {
        if (content.classList.contains('open')) {
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          content.style.maxHeight = null;
        }
        content.removeEventListener('transitionend', te);
      });
    }

    console.log('Toggle completed');
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