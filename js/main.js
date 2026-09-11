/**
 * TEMPLE FIT GYM — MAIN INTERACTIVE SCRIPT
 * Modern, Dependency-Free Vanilla JavaScript
 * Proprietor: Gopal Periyasamy | Contact: 9884557280
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. NAVBAR BACKGROUND CHANGE ON SCROLL
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  const handleNavbarScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('bg-dark-950', 'shadow-xl', 'border-zinc-800');
      navbar.classList.remove('bg-dark-950/70', 'border-white/5');
    } else {
      navbar.classList.remove('bg-dark-950', 'shadow-xl', 'border-zinc-800');
      navbar.classList.add('bg-dark-950/70', 'border-white/5');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();


  /* --------------------------------------------------------------------------
     2. MOBILE HAMBURGER MENU TOGGLE
     -------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    const toggleMobileMenu = () => {
      const isClosed = mobileMenu.classList.contains('hidden');
      if (isClosed) {
        mobileMenu.classList.remove('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        if (hamburgerIcon) {
          hamburgerIcon.classList.remove('fa-bars-staggered');
          hamburgerIcon.classList.add('fa-xmark');
        }
      } else {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        if (hamburgerIcon) {
          hamburgerIcon.classList.remove('fa-xmark');
          hamburgerIcon.classList.add('fa-bars-staggered');
        }
      }
    };

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        if (hamburgerIcon) {
          hamburgerIcon.classList.remove('fa-xmark');
          hamburgerIcon.classList.add('fa-bars-staggered');
        }
      });
    });
  }


  /* --------------------------------------------------------------------------
     3. SMOOTH SCROLLING WITH NAVBAR OFFSET
     -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  /* --------------------------------------------------------------------------
     4. SCROLL-TRIGGERED FADE-IN REVEAL ANIMATIONS
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach(el => el.classList.add('active'));
  }


  /* --------------------------------------------------------------------------
     5. PLAN SELECTION & AUTOMATIC CONTACT FORM SYNC
     -------------------------------------------------------------------------- */
  const pricingCards = document.querySelectorAll('.pricing-card');

  pricingCards.forEach(card => {
    const selectBtn = card.querySelector('.plan-select-btn');
    const planName = card.getAttribute('data-plan');

    const selectPlan = () => {
      pricingCards.forEach(c => {
        c.classList.remove('active-plan', 'border-2', 'border-brand');
        c.classList.add('border-zinc-800');
        const btn = c.querySelector('.plan-select-btn');
        if (btn) {
          const isAnnual = c.getAttribute('data-plan').includes('1 Year');
          btn.textContent = isAnnual ? 'Join 1-Year Plan' : 'Select Plan';
          btn.classList.remove('bg-gradient-to-r', 'from-brand', 'to-brand-hover', 'shadow-glow-orange');
          btn.classList.add('bg-zinc-900');
        }
      });

      card.classList.add('active-plan', 'border-2', 'border-brand');
      card.classList.remove('border-zinc-800');
      if (selectBtn) {
        selectBtn.textContent = 'Selected Plan ✓';
        selectBtn.classList.remove('bg-zinc-900');
        selectBtn.classList.add('bg-gradient-to-r', 'from-brand', 'to-brand-hover', 'shadow-glow-orange');
      }

      // Pre-select plan in contact form dropdown
      const interestSelect = document.getElementById('contact-interest');
      if (interestSelect && planName) {
        for (let option of interestSelect.options) {
          if (option.value.toLowerCase().includes(planName.toLowerCase()) || planName.toLowerCase().includes(option.value.toLowerCase())) {
            interestSelect.value = option.value;
            break;
          }
        }
      }
    };

    card.addEventListener('click', selectPlan);
  });


  /* --------------------------------------------------------------------------
     6. TRAINER PROFILE POPUP MODAL
     -------------------------------------------------------------------------- */
  const trainerCards = document.querySelectorAll('.trainer-card');
  const trainerModal = document.getElementById('trainer-modal');
  const trainerModalClose = document.getElementById('trainer-modal-close');
  const trainerModalBackdrop = document.getElementById('trainer-modal-backdrop');
  const modalBookTrainerBtn = document.getElementById('modal-book-trainer-btn');

  const modalTrainerImg = document.getElementById('modal-trainer-img');
  const modalTrainerName = document.getElementById('modal-trainer-name');
  const modalTrainerTitle = document.getElementById('modal-trainer-title');
  const modalTrainerExp = document.getElementById('modal-trainer-exp');
  const modalTrainerBio = document.getElementById('modal-trainer-bio');
  const modalTrainerSpecialties = document.getElementById('modal-trainer-specialties');
  const modalTrainerCerts = document.getElementById('modal-trainer-certs');

  const openTrainerModal = (card) => {
    if (!trainerModal) return;
    if (modalTrainerImg) modalTrainerImg.src = card.getAttribute('data-image') || '';
    if (modalTrainerName) modalTrainerName.textContent = card.getAttribute('data-name') || '';
    if (modalTrainerTitle) modalTrainerTitle.textContent = card.getAttribute('data-title') || '';
    if (modalTrainerExp) modalTrainerExp.textContent = card.getAttribute('data-exp') || '';
    if (modalTrainerBio) modalTrainerBio.textContent = card.getAttribute('data-bio') || '';
    if (modalTrainerSpecialties) modalTrainerSpecialties.textContent = card.getAttribute('data-specialties') || '';
    if (modalTrainerCerts) modalTrainerCerts.textContent = card.getAttribute('data-certs') || '';

    trainerModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  };

  const closeTrainerModal = () => {
    if (!trainerModal) return;
    trainerModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  };

  trainerCards.forEach(card => {
    const viewBtn = card.querySelector('.view-trainer-btn');
    if (viewBtn) {
      viewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openTrainerModal(card);
      });
    }
    card.addEventListener('click', () => openTrainerModal(card));
  });

  if (trainerModalClose) trainerModalClose.addEventListener('click', closeTrainerModal);
  if (trainerModalBackdrop) trainerModalBackdrop.addEventListener('click', closeTrainerModal);
  if (modalBookTrainerBtn) modalBookTrainerBtn.addEventListener('click', closeTrainerModal);


  /* --------------------------------------------------------------------------
     7. GALLERY LIGHTBOX MODAL WITH KEYBOARD NAVIGATION
     -------------------------------------------------------------------------- */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentGalleryIndex = 0;

  const showLightboxImage = (index) => {
    if (!galleryItems.length || !lightboxImg) return;
    currentGalleryIndex = (index + galleryItems.length) % galleryItems.length;
    const currentItem = galleryItems[currentGalleryIndex];
    const highResUrl = currentItem.getAttribute('data-img') || '';
    const title = currentItem.getAttribute('data-title') || '';
    const category = currentItem.getAttribute('data-category') || '';

    lightboxImg.src = highResUrl;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCategory) lightboxCategory.textContent = category;
  };

  const openLightbox = (index) => {
    if (!lightboxModal) return;
    showLightboxImage(index);
    lightboxModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightboxImage(currentGalleryIndex - 1);
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightboxImage(currentGalleryIndex + 1);
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Keyboard accessibility
  window.addEventListener('keydown', (e) => {
    if (lightboxModal && !lightboxModal.classList.contains('hidden')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showLightboxImage(currentGalleryIndex - 1);
      if (e.key === 'ArrowRight') showLightboxImage(currentGalleryIndex + 1);
    } else if (trainerModal && !trainerModal.classList.contains('hidden')) {
      if (e.key === 'Escape') closeTrainerModal();
    }
  });


  /* --------------------------------------------------------------------------
     8. TESTIMONIALS CAROUSEL
     -------------------------------------------------------------------------- */
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  let currentSlide = 0;
  let slideInterval;

  const setSlide = (index) => {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, idx) => {
      if (idx === currentSlide) {
        slide.classList.remove('hidden');
      } else {
        slide.classList.add('hidden');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('w-8', 'bg-brand');
        dot.classList.remove('w-2', 'bg-zinc-700');
      } else {
        dot.classList.remove('w-8', 'bg-brand');
        dot.classList.add('w-2', 'bg-zinc-700');
      }
    });
  };

  const nextSlide = () => setSlide(currentSlide + 1);
  const prevSlide = () => setSlide(currentSlide - 1);

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.getAttribute('data-index') || '0', 10);
      setSlide(slideIndex);
    });
  });

  const startSlideTimer = () => {
    slideInterval = setInterval(nextSlide, 6000);
  };
  const stopSlideTimer = () => {
    clearInterval(slideInterval);
  };

  const carouselContainer = document.getElementById('testimonial-carousel');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopSlideTimer);
    carouselContainer.addEventListener('mouseleave', startSlideTimer);
    startSlideTimer();
  }


  /* --------------------------------------------------------------------------
     9. FAQ ACCORDION INTERACTION
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const toggle = item.querySelector('.faq-toggle');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (toggle && content) {
      toggle.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');

        faqItems.forEach(otherItem => {
          const otherContent = otherItem.querySelector('.faq-content');
          const otherIcon = otherItem.querySelector('.faq-icon');
          if (otherContent) otherContent.classList.add('hidden');
          if (otherIcon) otherIcon.classList.remove('rotate-180');
        });

        if (!isOpen) {
          content.classList.remove('hidden');
          if (icon) icon.classList.add('rotate-180');
        }
      });
    }
  });


  /* --------------------------------------------------------------------------
     10. CONTACT FORM VALIDATION & SUCCESS TOAST
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  const toast = document.getElementById('toast-success');
  const toastClose = document.getElementById('toast-close-btn');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Full Name Validation
      if (!nameInput || !nameInput.value.trim() || nameInput.value.trim().length < 2) {
        if (nameError) nameError.classList.remove('hidden');
        if (nameInput) nameInput.classList.add('border-red-500');
        isValid = false;
      } else {
        if (nameError) nameError.classList.add('hidden');
        if (nameInput) nameInput.classList.remove('border-red-500');
      }

      // Email Address Validation
      if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
        if (emailError) emailError.classList.remove('hidden');
        if (emailInput) emailInput.classList.add('border-red-500');
        isValid = false;
      } else {
        if (emailError) emailError.classList.add('hidden');
        if (emailInput) emailInput.classList.remove('border-red-500');
      }

      // Message Field Validation
      if (!messageInput || !messageInput.value.trim() || messageInput.value.trim().length < 10) {
        if (messageError) messageError.classList.remove('hidden');
        if (messageInput) messageInput.classList.add('border-red-500');
        isValid = false;
      } else {
        if (messageError) messageError.classList.add('hidden');
        if (messageInput) messageInput.classList.remove('border-red-500');
      }

      // Successful Client-Side Validation
      if (isValid && toast) {
        toast.classList.remove('hidden');

        setTimeout(() => {
          toast.classList.add('hidden');
        }, 5000);

        contactForm.reset();
      }
    });
  }

  if (toastClose && toast) {
    toastClose.addEventListener('click', () => {
      toast.classList.add('hidden');
    });
  }

  /* --------------------------------------------------------------------------
     11. DYNAMIC 3D CARD TILT INTERACTION (Red & Black Athletic Physics)
     -------------------------------------------------------------------------- */
  const tiltCards = document.querySelectorAll('.card-3d-tilt');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation angles
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)';
    });
  });

});

