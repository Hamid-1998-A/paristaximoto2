/**
 * TaxiMoto Paris — Main JS
 */

// ============================================================
// NAVBAR SCROLL EFFECT
// ============================================================
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.navbar-toggle');
const navMenu = document.querySelector('.navbar-nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
});

// Mobile menu toggle
navToggle?.addEventListener('click', () => {
  navMenu?.classList.toggle('open');
  document.body.style.overflow = navMenu?.classList.contains('open') ? 'hidden' : '';
});

// Close menu on nav link click
document.querySelectorAll('.navbar-nav a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ============================================================
// ACTIVE NAV LINK ON SCROLL
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar-nav a[href^="#"]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => observer.observe(s));

// ============================================================
// FAQ ACCORDION
// ============================================================
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));

    // Open clicked (unless it was already open)
    if (!isOpen) item.classList.add('open');
  });
});

// ============================================================
// CONTACT FORM
// ============================================================
const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = contactForm.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Envoi...';

  // Simulate send (replace with real API call / EmailJS / Formspree)
  setTimeout(() => {
    btn.textContent = originalText;
    btn.disabled = false;

    const success = document.getElementById('form-success');
    if (success) {
      success.classList.add('visible');
      contactForm.reset();
      setTimeout(() => success.classList.remove('visible'), 6000);
    }
  }, 1500);
});

// ============================================================
// NEWSLETTER FORM
// ============================================================
const newsletterForm = document.getElementById('newsletter-form');
newsletterForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = newsletterForm.querySelector('input');
  if (input?.value) {
    input.value = '';
    input.placeholder = '✓ Merci pour votre inscription !';
    setTimeout(() => { input.placeholder = 'Votre email...'; }, 3000);
  }
});

// ============================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============================================================
// COUNTER ANIMATION
// ============================================================
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const increment = target / 60;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 25);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number[data-target]').forEach(el => {
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats').forEach(el => counterObserver.observe(el));

// ============================================================
// FLOATING PHONE TOOLTIP
// ============================================================
const floatingBtn = document.querySelector('.floating-phone-btn');
const tooltip = document.querySelector('.floating-tooltip');

floatingBtn?.addEventListener('mouseenter', () => {
  tooltip?.classList.add('visible');
});

floatingBtn?.addEventListener('mouseleave', () => {
  tooltip?.classList.remove('visible');
});
