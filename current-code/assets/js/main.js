/**
 * CICR Official Website Main Interaction Script
 * Handles navigation, stats counters, project filters, telemetry ticker, and FAQs
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scroll Elevation
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Drawer Navigation
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('mobile-drawer-overlay');
  const drawerClose = document.getElementById('mobile-drawer-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // 3. Hero Telemetry Ticker Rotator
  const telemetryRotator = document.getElementById('telemetry-rotator');
  if (telemetryRotator) {
    const feeds = [
      'SYS: OPTIMAL // ROS2 HUMBLE CORE LOADED // ROOM 140 JIIT-128',
      'EXPEDITIONS: TECHFEST IIT BOMBAY & PLINTH PREPARATION IN PROGRESS',
      'INVENTORY PORTAL: ONLINE AT inventory.cicr.in // RESERVATIONS ACTIVE',
      'RECRUITMENT 2026-27: SCREENING OPEN FOR 1ST & 2ND YEAR APPLICANTS',
      'WORKSHOP: TECHTONIC 3.0 CURRICULUM FINALIZED // HANDS-ON BOTS'
    ];
    let feedIndex = 0;
    setInterval(() => {
      feedIndex = (feedIndex + 1) % feeds.length;
      telemetryRotator.style.opacity = '0';
      telemetryRotator.style.transform = 'translateY(5px)';
      setTimeout(() => {
        telemetryRotator.textContent = feeds[feedIndex];
        telemetryRotator.style.opacity = '1';
        telemetryRotator.style.transform = 'translateY(0)';
      }, 300);
    }, 4000);
  }

  // 4. Animated Counters for Metrics
  const metricNumbers = document.querySelectorAll('.metric-number');
  let counted = false;

  const countUp = (el, target, suffix = '') => {
    let current = 0;
    const increment = Math.ceil(target / 45);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = `${target}${suffix}`;
        clearInterval(timer);
      } else {
        el.textContent = `${current}${suffix}`;
      }
    }, 35);
  };

  const metricsSection = document.getElementById('metrics-strip');
  if (metricsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          metricNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'), 10) || 0;
            const suffix = num.getAttribute('data-suffix') || '';
            countUp(num, target, suffix);
          });
        }
      });
    }, { threshold: 0.3 });

    observer.observe(metricsSection);
  }

  // 5. Project Category Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 6. Interactive FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close other open faqs
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 7. Active Navigation Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        desktopLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // 8. Contact Form Simulation
  const contactForm = document.getElementById('cicr-contact-form');
  const formSuccess = document.getElementById('form-success-banner');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Transmitting...';
      submitBtn.disabled = true;

      setTimeout(() => {
        contactForm.reset();
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Transmitted Successfully!';
        if (formSuccess) {
          formSuccess.style.display = 'block';
        }
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          if (formSuccess) formSuccess.style.display = 'none';
        }, 4000);
      }, 1000);
    });
  }

  // 9. Back To Top
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

