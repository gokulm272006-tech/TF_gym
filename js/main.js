/**
 * TEMPLE FIT GYM — PROFESSIONAL JAVASCRIPT ENGINE
 * Production-Ready, Dependency-Free Vanilla JavaScript
 * Proprietor: Gopal Periyasamy | Contact: 9884557280
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. NAVBAR BACKGROUND CHANGE & ACTIVE SECTION INDICATOR ON SCROLL
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleNavbarScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('bg-[#0a0a0a]', 'shadow-2xl', 'border-white/10');
      navbar.classList.remove('bg-transparent', 'border-transparent');
    } else {
      navbar.classList.remove('bg-[#0a0a0a]', 'shadow-2xl', 'border-white/10');
      navbar.classList.add('bg-transparent', 'border-transparent');
    }

    // ScrollSpy: Update active nav link
    const scrollPosition = window.scrollY + 120;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active', 'text-white');
            link.classList.remove('text-zinc-400');
          } else {
            link.classList.remove('active', 'text-white');
            link.classList.add('text-zinc-400');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();


  /* --------------------------------------------------------------------------
     2. MOBILE DRAWER MENU (Hamburger Toggle & Auto-Close)
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
     3. SMOOTH SCROLLING WITH STICKY NAVBAR OFFSET
     -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 76;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  /* --------------------------------------------------------------------------
     4. SCROLL-TRIGGERED REVEAL ANIMATIONS
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
    }, { root: null, threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }


  /* --------------------------------------------------------------------------
     5. QUICK BMI CHECK CALCULATOR (Validation, Dynamic Gauging & CTAs)
     -------------------------------------------------------------------------- */
  const bmiHeightInput = document.getElementById('bmi-height');
  const bmiWeightInput = document.getElementById('bmi-weight');
  const btnCalcBmi = document.getElementById('btn-calc-bmi');
  const btnResetBmi = document.getElementById('btn-reset-bmi');

  const bmiHeightError = document.getElementById('bmi-height-error');
  const bmiWeightError = document.getElementById('bmi-weight-error');

  const bmiResultContainer = document.getElementById('bmi-result-container');
  const bmiValueDisplay = document.getElementById('bmi-value');
  const bmiCategoryBadge = document.getElementById('bmi-category-badge');
  const bmiCategoryTitle = document.getElementById('bmi-category-title');
  const bmiDescription = document.getElementById('bmi-description');
  const bmiGaugeProgress = document.getElementById('bmi-gauge-circle');
  const bmiScalePin = document.getElementById('bmi-scale-pin');
  const bmiWhatsappCta = document.getElementById('bmi-whatsapp-cta');
  const bmiLiveRegion = document.getElementById('bmi-live-region');

  // Scale category label elements
  const bmiLblUnder = document.getElementById('bmi-lbl-under');
  const bmiLblNormal = document.getElementById('bmi-lbl-normal');
  const bmiLblOver = document.getElementById('bmi-lbl-over');
  const bmiLblObese = document.getElementById('bmi-lbl-obese');

  // Gauge circumference: 2 * PI * r (r=45 => 282.74)
  const GAUGE_CIRCUMFERENCE = 282.74;

  const calculateBMI = () => {
    let isValid = true;

    // Reset error messages
    if (bmiHeightError) bmiHeightError.classList.add('hidden');
    if (bmiWeightError) bmiWeightError.classList.add('hidden');
    if (bmiHeightInput) bmiHeightInput.classList.remove('border-red-500');
    if (bmiWeightInput) bmiWeightInput.classList.remove('border-red-500');

    const heightVal = parseFloat(bmiHeightInput ? bmiHeightInput.value : '');
    const weightVal = parseFloat(bmiWeightInput ? bmiWeightInput.value : '');

    // Height Validation (50 cm to 250 cm)
    if (isNaN(heightVal) || heightVal < 50 || heightVal > 250) {
      if (bmiHeightError) {
        bmiHeightError.textContent = 'Please enter a valid height (50 - 250 cm).';
        bmiHeightError.classList.remove('hidden');
      }
      if (bmiHeightInput) bmiHeightInput.classList.add('border-red-500');
      isValid = false;
    }

    // Weight Validation (10 kg to 300 kg)
    if (isNaN(weightVal) || weightVal < 10 || weightVal > 300) {
      if (bmiWeightError) {
        bmiWeightError.textContent = 'Please enter a valid weight (10 - 300 kg).';
        bmiWeightError.classList.remove('hidden');
      }
      if (bmiWeightInput) bmiWeightInput.classList.add('border-red-500');
      isValid = false;
    }

    if (!isValid) {
      if (bmiResultContainer) bmiResultContainer.classList.add('hidden');
      return;
    }

    // Height in meters & mathematical BMI formula
    const heightInMeters = heightVal / 100;
    const rawBmi = weightVal / (heightInMeters * heightInMeters);
    const bmi = parseFloat(rawBmi.toFixed(1));

    // Category determination & visual indicators
    let category = '';
    let categoryClass = '';
    let gaugeColor = '';
    let desc = '';
    let pinPercentage = 0;

    // Reset label highlight styles
    const defaultLabelClass = 'text-zinc-500 font-bold transition-colors duration-300';
    if (bmiLblUnder) bmiLblUnder.className = defaultLabelClass;
    if (bmiLblNormal) bmiLblNormal.className = defaultLabelClass;
    if (bmiLblOver) bmiLblOver.className = defaultLabelClass;
    if (bmiLblObese) bmiLblObese.className = defaultLabelClass;

    if (bmi < 18.5) {
      category = 'Underweight';
      categoryClass = 'bg-sky-500/20 text-sky-400 border-sky-500/40';
      gaugeColor = '#38bdf8';
      desc = 'Your BMI is below the standard healthy range. Coach Gopal can customize a high-protein nutrition and progressive strength routine to safely build lean muscle mass.';
      // Underweight segment [0%, 25%]: map BMI 10.0 to 18.5 safely inside [4%, 21%]
      const ratio = Math.max(0, Math.min(1, (bmi - 10) / (18.5 - 10)));
      pinPercentage = 4 + (ratio * 17);
      if (bmiLblUnder) {
        bmiLblUnder.className = 'text-sky-400 font-bold drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] transition-colors duration-300';
      }
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      category = 'Normal Weight';
      categoryClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      gaugeColor = '#10b981';
      desc = 'Great news! Your BMI is within the healthy range (18.5 – 24.9). Maintain your conditioning with our cardio zone and sculpted hypertrophy routines.';
      // Normal Weight segment [25%, 50%]: map BMI 18.5 to 24.9 safely inside [28%, 47%]
      const ratio = Math.max(0, Math.min(1, (bmi - 18.5) / (24.9 - 18.5)));
      pinPercentage = 28 + (ratio * 19);
      if (bmiLblNormal) {
        bmiLblNormal.className = 'text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-colors duration-300';
      }
    } else if (bmi >= 25.0 && bmi <= 29.9) {
      category = 'Overweight';
      categoryClass = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      gaugeColor = '#f59e0b';
      desc = 'Your BMI is slightly above the standard range. Our air-conditioned cardio training and metabolic fat-burn circuits will help you shed weight while retaining strength.';
      // Overweight segment [50%, 75%]: map BMI 25.0 to 29.9 safely inside [53%, 72%]
      const ratio = Math.max(0, Math.min(1, (bmi - 25.0) / (29.9 - 25.0)));
      pinPercentage = 53 + (ratio * 19);
      if (bmiLblOver) {
        bmiLblOver.className = 'text-amber-400 font-bold drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-colors duration-300';
      }
    } else {
      category = 'Obesity';
      categoryClass = 'bg-red-500/20 text-red-400 border-red-500/40';
      gaugeColor = '#ef4444';
      desc = 'Your BMI indicates obesity. Step into Temple Fit Gym for a dedicated, respectful coaching plan combining steady-state cardio, core conditioning, and sustainable diet discipline.';
      // Obesity segment [75%, 100%]: map BMI 30.0 to 40.0+ safely inside [78%, 96%]
      const ratio = Math.max(0, Math.min(1, (bmi - 30.0) / (40.0 - 30.0)));
      pinPercentage = 78 + (ratio * 18);
      if (bmiLblObese) {
        bmiLblObese.className = 'text-red-400 font-bold drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-colors duration-300';
      }
    }

    // Populate Results UI
    if (bmiValueDisplay) {
      bmiValueDisplay.textContent = bmi;
      bmiValueDisplay.style.color = gaugeColor;
    }
    if (bmiCategoryTitle) {
      bmiCategoryTitle.textContent = category;
      bmiCategoryTitle.style.color = gaugeColor;
    }

    if (bmiCategoryBadge) {
      bmiCategoryBadge.className = `px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${categoryClass}`;
      bmiCategoryBadge.textContent = category;
    }

    if (bmiDescription) bmiDescription.textContent = desc;

    // Animate Circular Gauge
    if (bmiGaugeProgress) {
      bmiGaugeProgress.style.stroke = gaugeColor;
      // Map BMI 15 to 40 across gauge circumference
      const clampedBmi = Math.min(Math.max(bmi, 15), 40);
      const ratio = (clampedBmi - 15) / 25; // 0 to 1
      const offset = GAUGE_CIRCUMFERENCE - (ratio * GAUGE_CIRCUMFERENCE);
      bmiGaugeProgress.style.strokeDashoffset = offset;
    }

    // Animate Linear Pin with Active Color and Subtle Glow
    if (bmiScalePin) {
      bmiScalePin.style.left = `${pinPercentage.toFixed(1)}%`;
      bmiScalePin.style.backgroundColor = gaugeColor;
      bmiScalePin.style.boxShadow = `0 0 14px ${gaugeColor}, 0 2px 6px rgba(0,0,0,0.6)`;
    }

    // Update WhatsApp CTA prefilled text with the user's BMI
    if (bmiWhatsappCta) {
      const msg = encodeURIComponent(`Hi Coach Gopal, I just checked my BMI on the Temple Fit Gym website. My BMI is ${bmi} (${category}). I want to know how to get started!`);
      bmiWhatsappCta.href = `https://wa.me/919884557280?text=${msg}`;
    }

    // Accessible live region announcement
    if (bmiLiveRegion) {
      bmiLiveRegion.textContent = `Your calculated BMI is ${bmi}, which is classified as ${category}. Healthy BMI range is 18.5 to 24.9.`;
    }

    // Show Result Container with smooth fade
    if (bmiResultContainer) {
      bmiResultContainer.classList.remove('hidden');
      bmiResultContainer.classList.add('animate-scale-up');
      bmiResultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const resetBMI = () => {
    if (bmiHeightInput) {
      bmiHeightInput.value = '170';
      bmiHeightInput.classList.remove('border-red-500');
    }
    if (bmiWeightInput) {
      bmiWeightInput.value = '70';
      bmiWeightInput.classList.remove('border-red-500');
    }
    if (bmiHeightError) bmiHeightError.classList.add('hidden');
    if (bmiWeightError) bmiWeightError.classList.add('hidden');
    if (bmiResultContainer) bmiResultContainer.classList.add('hidden');
    if (bmiGaugeProgress) bmiGaugeProgress.style.strokeDashoffset = GAUGE_CIRCUMFERENCE;
    if (bmiScalePin) {
      bmiScalePin.style.left = '33.1%';
      bmiScalePin.style.backgroundColor = '#10b981';
      bmiScalePin.style.boxShadow = '0 0 14px #10b981, 0 2px 6px rgba(0,0,0,0.6)';
    }
    const defaultLabelClass = 'text-zinc-500 font-bold transition-colors duration-300';
    if (bmiLblUnder) bmiLblUnder.className = defaultLabelClass;
    if (bmiLblNormal) bmiLblNormal.className = defaultLabelClass;
    if (bmiLblOver) bmiLblOver.className = defaultLabelClass;
    if (bmiLblObese) bmiLblObese.className = defaultLabelClass;
  };

  if (btnCalcBmi) {
    btnCalcBmi.addEventListener('click', calculateBMI);
  }

  if (btnResetBmi) {
    btnResetBmi.addEventListener('click', resetBMI);
  }

  // Enter key support for BMI form
  [bmiHeightInput, bmiWeightInput].forEach(input => {
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          calculateBMI();
        }
      });
    }
  });


  /* --------------------------------------------------------------------------
     6. MEMBERSHIP PLANS INTERACTION & FORM SYNC
     -------------------------------------------------------------------------- */
  const pricingCards = document.querySelectorAll('.pricing-card');
  const planSelectButtons = document.querySelectorAll('.plan-select-btn');
  const interestSelect = document.getElementById('contact-interest');

  const selectPlan = (selectedCard) => {
    pricingCards.forEach(card => {
      card.classList.remove('active-plan');
      const btn = card.querySelector('.plan-select-btn');
      if (btn) {
        btn.textContent = 'Select Plan';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
      }
    });

    selectedCard.classList.add('active-plan');
    const activeBtn = selectedCard.querySelector('.plan-select-btn');
    if (activeBtn) {
      activeBtn.textContent = 'Selected Plan ✓';
      activeBtn.classList.remove('btn-secondary');
      activeBtn.classList.add('btn-primary');
    }

    const planName = selectedCard.getAttribute('data-plan');
    if (interestSelect && planName) {
      for (let i = 0; i < interestSelect.options.length; i++) {
        if (interestSelect.options[i].value === planName) {
          interestSelect.selectedIndex = i;
          break;
        }
      }
    }
  };

  pricingCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
        selectPlan(card);
      }
    });
  });

  planSelectButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentCard = btn.closest('.pricing-card');
      if (parentCard) {
        selectPlan(parentCard);
        // Scroll to contact form
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          const navHeight = navbar ? navbar.offsetHeight : 76;
          window.scrollTo({
            top: contactSection.offsetTop - navHeight,
            behavior: 'smooth'
          });
        }
      }
    });
  });


  /* --------------------------------------------------------------------------
     7. TRAINER PROFILE POPUP MODAL
     -------------------------------------------------------------------------- */
  const trainerModal = document.getElementById('trainer-modal');
  const trainerModalBackdrop = document.getElementById('trainer-modal-backdrop');
  const trainerModalClose = document.getElementById('trainer-modal-close');
  const trainerCards = document.querySelectorAll('.trainer-card');

  const modalImg = document.getElementById('modal-trainer-img');
  const modalName = document.getElementById('modal-trainer-name');
  const modalTitle = document.getElementById('modal-trainer-title');
  const modalExp = document.getElementById('modal-trainer-exp');
  const modalBio = document.getElementById('modal-trainer-bio');
  const modalSpecialties = document.getElementById('modal-trainer-specialties');
  const modalCerts = document.getElementById('modal-trainer-certs');
  const modalBookBtn = document.getElementById('modal-book-trainer-btn');

  const openTrainerModal = (card) => {
    if (!trainerModal) return;
    const name = card.getAttribute('data-name') || '';
    const title = card.getAttribute('data-title') || '';
    const exp = card.getAttribute('data-exp') || '';
    const img = card.getAttribute('data-image') || '';
    const bio = card.getAttribute('data-bio') || '';
    const specialties = card.getAttribute('data-specialties') || '';
    const certs = card.getAttribute('data-certs') || '';

    if (modalImg) modalImg.src = img;
    if (modalName) modalName.textContent = name;
    if (modalTitle) modalTitle.textContent = title;
    if (modalExp) modalExp.textContent = exp;
    if (modalBio) modalBio.textContent = bio;
    if (modalSpecialties) modalSpecialties.textContent = specialties;
    if (modalCerts) modalCerts.textContent = certs;

    if (modalBookBtn) {
      modalBookBtn.href = `https://wa.me/919884557280?text=Hi%20Temple%20Fit%20Gym,%20I%20am%20interested%20in%20training%20with%20${encodeURIComponent(name)}.`;
    }

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


  /* --------------------------------------------------------------------------
     8. GALLERY LIGHTBOX MODAL WITH KEYBOARD NAVIGATION
     -------------------------------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentGalleryIndex = 0;
  const galleryData = Array.from(galleryItems).map(item => ({
    src: item.getAttribute('data-img') || '',
    title: item.getAttribute('data-title') || '',
    category: item.getAttribute('data-category') || ''
  }));

  const showLightboxImage = (index) => {
    if (index < 0) index = galleryData.length - 1;
    if (index >= galleryData.length) index = 0;
    currentGalleryIndex = index;

    const data = galleryData[currentGalleryIndex];
    if (lightboxImg) lightboxImg.src = data.src;
    if (lightboxTitle) lightboxTitle.textContent = data.title;
    if (lightboxCategory) lightboxCategory.textContent = data.category;
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
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    showLightboxImage(currentGalleryIndex - 1);
  });
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    showLightboxImage(currentGalleryIndex + 1);
  });

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Global Keyboard shortcuts (Escape, ArrowLeft, ArrowRight)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeTrainerModal();
    }
    if (lightboxModal && !lightboxModal.classList.contains('hidden')) {
      if (e.key === 'ArrowLeft') showLightboxImage(currentGalleryIndex - 1);
      if (e.key === 'ArrowRight') showLightboxImage(currentGalleryIndex + 1);
    }
  });


  /* --------------------------------------------------------------------------
     9. TESTIMONIALS CAROUSEL (Prev, Next, Dots & Auto-Slide)
     -------------------------------------------------------------------------- */
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const carouselPrev = document.getElementById('carousel-prev');
  const carouselNext = document.getElementById('carousel-next');
  const carouselDots = document.querySelectorAll('.carousel-dot');

  let currentSlide = 0;
  let carouselTimer = null;

  const showSlide = (index) => {
    if (testimonialSlides.length === 0) return;
    if (index < 0) index = testimonialSlides.length - 1;
    if (index >= testimonialSlides.length) index = 0;
    currentSlide = index;

    testimonialSlides.forEach((slide, idx) => {
      if (idx === currentSlide) {
        slide.classList.remove('hidden');
        slide.classList.add('flex', 'animate-scale-up');
      } else {
        slide.classList.add('hidden');
        slide.classList.remove('flex', 'animate-scale-up');
      }
    });

    carouselDots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('w-8', 'bg-red-500');
        dot.classList.remove('w-2.5', 'bg-zinc-700');
      } else {
        dot.classList.remove('w-8', 'bg-red-500');
        dot.classList.add('w-2.5', 'bg-zinc-700');
      }
    });
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    carouselTimer = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 6000);
  };

  const stopAutoSlide = () => {
    if (carouselTimer) clearInterval(carouselTimer);
  };

  if (carouselPrev) {
    carouselPrev.addEventListener('click', () => {
      stopAutoSlide();
      showSlide(currentSlide - 1);
      startAutoSlide();
    });
  }

  if (carouselNext) {
    carouselNext.addEventListener('click', () => {
      stopAutoSlide();
      showSlide(currentSlide + 1);
      startAutoSlide();
    });
  }

  carouselDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      stopAutoSlide();
      showSlide(idx);
      startAutoSlide();
    });
  });

  if (testimonialSlides.length > 0) {
    showSlide(0);
    startAutoSlide();
  }


  /* --------------------------------------------------------------------------
     10. FAQ ACCORDION (Smooth Single-Open Toggle)
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const toggleBtn = item.querySelector('.faq-toggle');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (toggleBtn && content) {
      toggleBtn.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');

        // Close other FAQ items for a clean single-open accordion UX
        faqItems.forEach(otherItem => {
          const otherContent = otherItem.querySelector('.faq-content');
          const otherIcon = otherItem.querySelector('.faq-icon');
          if (otherContent && otherContent !== content) {
            otherContent.classList.add('hidden');
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
          }
        });

        if (isOpen) {
          content.classList.add('hidden');
          if (icon) icon.style.transform = 'rotate(0deg)';
          toggleBtn.setAttribute('aria-expanded', 'false');
        } else {
          content.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
          toggleBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });


  /* --------------------------------------------------------------------------
     11. CONTACT FORM VALIDATION & SUCCESS TOAST
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
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
      if (!messageInput || !messageInput.value.trim() || messageInput.value.trim().length < 6) {
        if (messageError) messageError.classList.remove('hidden');
        if (messageInput) messageInput.classList.add('border-red-500');
        isValid = false;
      } else {
        if (messageError) messageError.classList.add('hidden');
        if (messageInput) messageInput.classList.remove('border-red-500');
      }

      // Successful Client-Side Validation
      if (isValid) {
        if (toast) {
          toast.classList.remove('hidden');
          setTimeout(() => {
            toast.classList.add('hidden');
          }, 5000);
        }
        contactForm.reset();
      }
    });
  }

  if (toastClose && toast) {
    toastClose.addEventListener('click', () => {
      toast.classList.add('hidden');
    });
  }

});
