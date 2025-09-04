// CORRECT import paths for your folder structure
import '../css/globals.css';
import '../css/style.css';
import '../css/contact.css';
import '../css/community.css';
import '../css/blog.css'; 
import '../css/game.css';

// Year update for footer
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Mobile navigation toggle functionality
const toggle = document.getElementById('navToggle');
const menu = document.getElementById('mobileMenu');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden', open);
    toggle.setAttribute('aria-expanded', String(!open));
  });

  // Close mobile menu when clicking on links
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// Wait for DOM to be fully loaded before initializing page features
document.addEventListener('DOMContentLoaded', () => {
  
  // FAQ Toggle functionality for contact page
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      const content = item.querySelector('.faq-content');
      const icon = item.querySelector('.faq-icon');
      
      if (content && icon) {
        content.classList.toggle('hidden');
        icon.classList.toggle('rotate-180');
      }
    });
  });

  // Contact form submission handling
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show success state
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      
      submitBtn.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Message Sent!
      `;
      submitBtn.disabled = true;
      submitBtn.classList.add('success-state');
      
      this.reset();
      
      setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        submitBtn.classList.remove('success-state');
      }, 3000);
    });
  }

  // Newsletter signup (for community page)
  const newsletterForm = document.querySelector('.yl-newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = this.querySelector('.yl-newsletter-input');
      const submitBtn = this.querySelector('.yl-newsletter-btn');
      const originalHTML = submitBtn.innerHTML;
      
      submitBtn.innerHTML = 'Subscribed!';
      submitBtn.disabled = true;
      emailInput.value = '';
      
      setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
      }, 3000);
    });
  }

  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  .yl-btn {
    position: relative;
    overflow: hidden;
  }
  
  .success-state {
    background: linear-gradient(135deg, #22c55e, #16a34a) !important;
    box-shadow: 0 10px 28px rgba(34, 197, 94, 0.45) !important;
  }
`;
document.head.appendChild(style);
