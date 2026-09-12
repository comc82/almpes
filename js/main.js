/**
 * ALMPES Contact Center — Main JavaScript Bundle
 * Vanilla ES6+ — Modern, Performant & Accessible
 */

(function () {
  'use strict';

  // 0. Async Font Loading: activate Google Fonts stylesheet (media="print" while loading)
  const fontsLink = document.querySelector('link[rel="stylesheet"][media="print"][href*="fonts.googleapis.com"]');
  if (fontsLink) {
    fontsLink.media = 'all';
  }

  // 1. Dynamic Copyright Year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Navigation Drawer (Mobile / Hamburger)
  const navToggle = document.querySelector('.nav-toggle');
  const navDrawer = document.querySelector('.nav-drawer');
  const navOverlay = document.querySelector('.nav-overlay');
  const navClose = document.querySelector('.nav-close');

  function setDrawer(open) {
    if (navDrawer) {
      navDrawer.classList.toggle('open', open);
      if (open) {
        navDrawer.removeAttribute('inert');
        navDrawer.setAttribute('aria-hidden', 'false');
        if (navClose) navClose.focus();
      } else {
        navDrawer.setAttribute('inert', '');
        navDrawer.setAttribute('aria-hidden', 'true');
        if (navToggle) navToggle.focus();
      }
    }
    if (navOverlay) navOverlay.classList.toggle('open', open);
    if (navToggle) navToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-locked', open);
  }

  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', () => setDrawer(!navDrawer.classList.contains('open')));
    if (navClose) navClose.addEventListener('click', () => setDrawer(false));
    if (navOverlay) navOverlay.addEventListener('click', () => setDrawer(false));

    navDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (!link.parentElement.classList.contains('has-sub')) {
          setDrawer(false);
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setDrawer(false);
    });
  }

  // Sub-menus accordion in mobile drawer
  document.querySelectorAll('.has-sub > a').forEach((item) => {
    item.addEventListener('click', (e) => {
      const parent = item.parentElement;
      if (parent.classList.contains('open')) {
        parent.classList.remove('open');
        return;
      }
      e.preventDefault();
      parent.classList.add('open');
    });
  });

  // 3. Header Scrolled State
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    let tick = false;
    function updateHeader() {
      siteHeader.classList.toggle('scrolled', (window.scrollY || window.pageYOffset) > 8);
      tick = false;
    }
    window.addEventListener('scroll', () => {
      if (!tick) {
        requestAnimationFrame(updateHeader);
        tick = true;
      }
    }, { passive: true });
    updateHeader();
  }

  // 4. Reveal Animations on Scroll
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach((el) => revealObserver.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  // 5. Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.length > 1) {
        let target = null;
        try {
          target = document.querySelector(href);
        } catch (err) {
          return;
        }
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  // 6. Number Counter Animations (Stats & Case Studies)
  const counterElements = document.querySelectorAll('.counter-value');
  if (counterElements.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetNum = parseInt(el.getAttribute('data-target'), 10);
          if (isNaN(targetNum)) return;
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 1600; // ms
          const stepTime = 25;
          const totalSteps = duration / stepTime;
          const stepVal = targetNum / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += stepVal;
            if (current >= targetNum) {
              current = targetNum;
              clearInterval(timer);
            }
            el.textContent = prefix + Math.floor(current).toLocaleString('es-PE') + suffix;
          }, stepTime);

          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.35 });

    counterElements.forEach((el) => counterObserver.observe(el));
  }

  // 7. Certificate Modal (ISO Preview)
  const certModal = document.getElementById('cert-modal');
  const certModalImg = certModal && certModal.querySelector('.modal-img');
  const certModalClose = certModal && certModal.querySelector('.modal-close');

  if (certModal && certModalImg) {
    function closeCertModal() {
      certModal.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.cert-view').forEach((btn) => {
      btn.addEventListener('click', () => {
        const certSrc = btn.getAttribute('data-cert');
        if (certSrc) {
          certModalImg.src = certSrc;
          certModal.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) closeCertModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certModal.classList.contains('open')) {
        closeCertModal();
      }
    });
  }

  // 8. FAQ Accordion Component
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length) {
    faqItems.forEach((item) => {
      const questionBtn = item.querySelector('.faq-question');
      if (questionBtn) {
        questionBtn.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');
          // Close other open FAQ items for clean single accordion
          faqItems.forEach((other) => {
            if (other !== item) {
              other.classList.remove('open');
              const btn = other.querySelector('.faq-question');
              if (btn) btn.setAttribute('aria-expanded', 'false');
            }
          });
          item.classList.toggle('open', !isOpen);
          questionBtn.setAttribute('aria-expanded', String(!isOpen));
        });
      }
    });
  }

  // 9. Video Modal Component (Preview & Play)
  const videoModal = document.getElementById('video-modal');
  const videoModalClose = videoModal && videoModal.querySelector('.video-modal-close');
  const videoModalIframe = videoModal && videoModal.querySelector('iframe');
  const videoTriggerBtns = document.querySelectorAll('[data-video-modal-trigger]');

  function openVideoModal(videoUrl) {
    if (!videoModal) return;
    if (videoModalIframe && videoUrl) {
      videoModalIframe.src = videoUrl;
    }
    videoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    if (!videoModal) return;
    videoModal.classList.remove('open');
    if (videoModalIframe) {
      videoModalIframe.src = '';
    }
    document.body.style.overflow = '';
  }

  if (videoTriggerBtns.length) {
    videoTriggerBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const videoSrc = btn.getAttribute('data-video-src') || 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
        openVideoModal(videoSrc);
      });
    });
  }

  if (videoModal) {
    if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('open')) {
        closeVideoModal();
      }
    });
  }

  // 10. Job Vacancy Auto-Select in trabaja.html
  const vacancyApplyBtns = document.querySelectorAll('.vacante-apply-btn');
  const jobAreaSelect = document.getElementById('area');
  if (vacancyApplyBtns.length && jobAreaSelect) {
    vacancyApplyBtns.forEach((btn) => {
      btn.addEventListener('click', function (e) {
        const targetArea = this.getAttribute('data-area');
        if (targetArea) {
          // Preselect matching option
          for (let i = 0; i < jobAreaSelect.options.length; i++) {
            if (jobAreaSelect.options[i].value === targetArea || jobAreaSelect.options[i].text.toLowerCase().includes(targetArea.toLowerCase())) {
              jobAreaSelect.selectedIndex = i;
              break;
            }
          }
          const formSec = document.getElementById('postula') || document.getElementById('jobs-form');
          if (formSec) {
            e.preventDefault();
            const top = formSec.getBoundingClientRect().top + window.pageYOffset - 90;
            window.scrollTo({ top, behavior: 'smooth' });
            setTimeout(() => {
              const nameInput = document.getElementById('nombre');
              if (nameInput) nameInput.focus();
            }, 600);
          }
        }
      });
    });
  }

  // 11. Expanding Collection Slider for Services
  const expandingCollection = document.querySelector('.expanding-collection');
  if (expandingCollection && typeof Swiper !== 'undefined') {
    const updateCoverScale = function (slideEl) {
      const cover = slideEl.querySelector('.expanding-collection-cover');
      const content = slideEl.querySelector('.expanding-collection-content');
      if (cover && content) {
        const coverW = cover.offsetWidth;
        const coverH = cover.offsetHeight;
        slideEl.style.setProperty('--expanding-collection-cover-height', coverH + 'px');
        const contentW = content.offsetWidth;
        const contentH = content.offsetHeight;
        slideEl.style.setProperty('--expanding-collection-scale-x', (coverW / contentW * 0.95).toFixed(4));
        slideEl.style.setProperty('--expanding-collection-scale-y', (coverH / contentH * 0.95).toFixed(4));
      }
    };

    const swiperInstance = new Swiper(expandingCollection.querySelector('.swiper'), {
      speed: 600,
      resistanceRatio: 0,
      initialSlide: 1,
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 28,
      on: {
        init: function (sw) {
          sw.slides.forEach((s) => {
            const img = s.querySelector('.expanding-collection-cover img');
            if (img && !img.complete) {
              img.addEventListener('load', () => updateCoverScale(s));
            }
            updateCoverScale(s);
          });
          requestAnimationFrame(() => {
            expandingCollection.classList.add('expanding-collection-initialized');
          });

          sw.slides.forEach((slide) => {
            const container = slide.querySelector('.expanding-collection-container');
            const cover = slide.querySelector('.expanding-collection-cover');
            const content = slide.querySelector('.expanding-collection-content');

            if (cover) {
              cover.addEventListener('click', () => {
                if (content && slide.classList.contains('swiper-slide-active')) {
                  container.classList.toggle('expanding-collection-opened');
                }
              });
            }
            if (container) {
              container.addEventListener('mouseenter', () => {
                container.ecHovered = true;
                if (slide.classList.contains('swiper-slide-active')) {
                  container.classList.add('expanding-collection-opened');
                }
              });
              container.addEventListener('mouseleave', () => {
                container.ecHovered = false;
                container.classList.remove('expanding-collection-opened');
              });
            }
          });
        },
        slideChange: function (sw) {
          const opened = sw.wrapperEl.querySelector('.expanding-collection-opened');
          if (opened) opened.classList.remove('expanding-collection-opened');
          const activeSlide = sw.slides[sw.activeIndex];
          const activeContainer = activeSlide ? activeSlide.querySelector('.expanding-collection-container') : null;
          if (activeContainer && activeContainer.ecHovered) {
            activeContainer.classList.add('expanding-collection-opened');
          }
        },
        resize: function (sw) {
          expandingCollection.classList.remove('expanding-collection-initialized');
          sw.slides.forEach(updateCoverScale);
          expandingCollection.classList.add('expanding-collection-initialized');
        }
      }
    });

    let autoSlideInterval = null;
    const stopAutoSlide = () => {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    };
    const canHover = window.matchMedia('(hover: hover)').matches;

    expandingCollection.querySelectorAll('.ec-hover-zone').forEach((zone) => {
      const isNext = zone.classList.contains('ec-hover-zone--next');
      zone.addEventListener('pointerenter', (e) => {
        if (!canHover || (e.pointerType && e.pointerType !== 'mouse')) return;
        const dir = isNext ? 1 : -1;
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
          if (swiperInstance && !swiperInstance.destroyed) {
            if (dir > 0) swiperInstance.slideNext();
            else swiperInstance.slidePrev();
          } else {
            stopAutoSlide();
          }
        }, 1100);
      });
      zone.addEventListener('pointerleave', stopAutoSlide);
      zone.addEventListener('click', () => {
        stopAutoSlide();
        if (isNext) swiperInstance.slideNext();
        else swiperInstance.slidePrev();
      });
    });
  }

  // 12. Sede Sliders (Nosotros)
  document.querySelectorAll('.sede-slider').forEach((slider) => {
    const sliderKey = slider.getAttribute('data-slider');
    const slides = slider.querySelectorAll('.sede-slide');
    const dotsContainer = document.querySelector(`.sede-dots[data-slider="${sliderKey}"]`);

    if (slides.length && dotsContainer) {
      let currentIndex = 0;
      slides.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = 'sede-dot' + (idx === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
      });

      let autoSlideTimer = setInterval(() => {
        goToSlide((currentIndex + 1) % slides.length);
      }, 4000);

      const sedeImg = slider.closest('.sede-img');
      if (sedeImg) {
        sedeImg.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
        sedeImg.addEventListener('mouseleave', () => {
          autoSlideTimer = setInterval(() => {
            goToSlide((currentIndex + 1) % slides.length);
          }, 4000);
        });
      }

      function goToSlide(idx) {
        if (idx === currentIndex) return;
        currentIndex = idx;
        slider.style.transform = `translateX(-${100 * currentIndex}%)`;
        dotsContainer.querySelectorAll('.sede-dot').forEach((d, i) => {
          d.classList.toggle('active', i === currentIndex);
        });
      }
    }
  });

  // 13. Form Handling & Privacy Validation
  const nowTimestamp = Date.now();
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  document.querySelectorAll('.form-ts').forEach((ts) => {
    ts.value = String(nowTimestamp);
  });

  const allowedDocMimes = ['application/pdf'];
  const allowedDocExts = ['.pdf'];

  function validateCvFile(input) {
    if (!input.files || !input.files.length) return { valid: true };
    const file = input.files[0];
    if (file.size > 5242880) {
      return { valid: false, msg: 'El archivo pesa más de 5 MB. Por favor elige uno más liviano.' };
    }
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (allowedDocExts.indexOf(ext) === -1) {
      return { valid: false, msg: 'Formato no válido. Sube tu CV en PDF.' };
    }
    if (file.type && allowedDocMimes.indexOf(file.type) === -1) {
      return { valid: false, msg: 'Tipo de archivo no permitido. Solo se aceptan archivos PDF.' };
    }
    return { valid: true };
  }

  function setFieldError(el, message) {
    const fieldWrap = el.closest('.field');
    if (fieldWrap) {
      fieldWrap.classList.add('field--error');
      const msgEl = fieldWrap.querySelector('.field-msg');
      if (msgEl) msgEl.textContent = message;
    }
  }

  function clearFieldError(el) {
    const fieldWrap = el.closest('.field');
    if (fieldWrap) {
      fieldWrap.classList.remove('field--error');
      const msgEl = fieldWrap.querySelector('.field-msg');
      if (msgEl) msgEl.textContent = '';
    }
  }

  function setFormError(form, message) {
    const errEl = form.querySelector('.form-error');
    if (errEl) errEl.textContent = message;
  }

  const formTimestamps = {};

  function setupForm(formId, customValidation) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.querySelectorAll('input, textarea, select').forEach((inp) => {
      inp.addEventListener('input', () => clearFieldError(inp));
      inp.addEventListener('change', () => clearFieldError(inp));
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      setFormError(form, '');

      const now = Date.now();
      if (formTimestamps[formId] && now - formTimestamps[formId] < 3000) {
        setFormError(form, 'Por favor espera unos segundos antes de enviar nuevamente.');
        return;
      }

      // Honeypot check
      const honeypot = form.querySelector('[name="_formsubmit_honeypot"]');
      if (honeypot && honeypot.value) {
        form.innerHTML = '<p style="text-align:center;color:var(--accent);font-weight:600;padding:24px;">¡Gracias! Tu mensaje ha sido recibido con éxito.</p>';
        return;
      }

      // Quick bot check
      const tsEl = form.querySelector('.form-ts');
      if (tsEl && tsEl.value && now - parseInt(tsEl.value, 10) < 1800) {
        setFormError(form, 'Por favor completa el formulario antes de enviarlo.');
        return;
      }

      let isValid = true;
      customValidation(form, {
        set: (input, msg) => {
          setFieldError(input, msg);
          isValid = false;
        },
        clear: clearFieldError
      });

      // Privacy Checkbox validation
      const privacyCheck = form.querySelector('input[name="privacidad"]');
      if (privacyCheck && !privacyCheck.checked) {
        setFieldError(privacyCheck, 'Debes aceptar las políticas de privacidad y tratamiento de datos para continuar.');
        isValid = false;
      }

      if (!isValid) {
        setFormError(form, 'Por favor revisa los campos marcados en rojo.');
        return;
      }

      // Sanitize text inputs
      form.querySelectorAll('input[type="text"], textarea').forEach((inp) => {
        if (!inp.name.startsWith('_') && typeof inp.value === 'string') {
          inp.value = inp.value
            .replace(/<[^>]*>/g, '')
            .replace(/["'`;\\]/g, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .trim();
        }
      });

      // CV file check
      const fileInput = form.querySelector('input[type="file"]');
      if (fileInput && fileInput.files && fileInput.files.length) {
        const fileCheck = validateCvFile(fileInput);
        if (!fileCheck.valid) {
          setFieldError(fileInput, fileCheck.msg);
          setFormError(form, 'Por favor corrige el archivo adjunto.');
          return;
        }
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }

      formTimestamps[formId] = Date.now();
      const formData = new FormData(form);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', form.action, true);

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
          form.innerHTML = '<div style="text-align:center;padding:32px 16px;"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3A7D5C" stroke-width="2" style="margin:0 auto 16px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><h3 style="margin-bottom:8px;color:var(--fg);">¡Solicitud Enviada con Éxito!</h3><p style="color:var(--muted);font-size:15px;max-width:400px;margin:0 auto;">Gracias por contactar a ALMPES Contact Center. Un ejecutivo comercial se comunicará contigo a la brevedad.</p></div>';
        } else {
          setFormError(form, 'No se pudo enviar. Por favor verifica tu conexión y vuelve a intentar.');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.original || 'Enviar';
          }
        }
      };

      xhr.onerror = function () {
        setFormError(form, 'Error de conexión. Revisa tu red y vuelve a intentar.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.original || 'Enviar';
        }
      };

      xhr.send(formData);
    });
  }

  // Store original button text
  document.querySelectorAll('button[type="submit"]').forEach((btn) => {
    btn.dataset.original = btn.textContent;
  });

  // Setup Contact Form
  setupForm('contact-form', (form, helper) => {
    const nombre = form.querySelector('#nombre');
    if (nombre && !nombre.value.trim()) {
      helper.set(nombre, 'Por favor ingresa tu nombre completo.');
    } else if (nombre && nombre.value.trim().length < 2) {
      helper.set(nombre, 'El nombre debe tener al menos 2 caracteres.');
    }

    const empresa = form.querySelector('#empresa');
    if (empresa && empresa.value.trim().length > 100) {
      helper.set(empresa, 'El nombre de la empresa es demasiado largo.');
    }

    const correo = form.querySelector('#correo');
    if (correo && !correo.value.trim()) {
      helper.set(correo, 'Necesitamos tu correo electrónico de contacto.');
    } else if (correo && !isValidEmail(correo.value)) {
      helper.set(correo, 'Por favor ingresa un correo electrónico válido.');
    }

    const servicio = form.querySelector('#servicio');
    if (servicio && !servicio.value) {
      helper.set(servicio, 'Selecciona el servicio de tu interés.');
    }

    const mensaje = form.querySelector('#mensaje');
    if (mensaje && !mensaje.value.trim()) {
      helper.set(mensaje, 'Por favor cuéntanos brevemente qué necesitas.');
    } else if (mensaje && mensaje.value.trim().length < 10) {
      helper.set(mensaje, 'El mensaje es muy corto (mínimo 10 caracteres).');
    }
  });

  // Setup Jobs Form
  setupForm('jobs-form', (form, helper) => {
    const nombre = form.querySelector('#nombre');
    if (nombre && !nombre.value.trim()) {
      helper.set(nombre, 'Por favor ingresa tu nombre completo.');
    } else if (nombre && nombre.value.trim().length < 2) {
      helper.set(nombre, 'El nombre debe tener al menos 2 caracteres.');
    }

    const telefono = form.querySelector('#telefono');
    if (telefono && telefono.value.trim()) {
      if (!/^[\d\s\-+]{7,15}$/.test(telefono.value.trim())) {
        helper.set(telefono, 'Ingresa un número telefónico válido (solo números).');
      }
    } else if (telefono) {
      helper.set(telefono, 'Ingresa tu número de teléfono o celular para contactarte.');
    }

    const correo = form.querySelector('#correo');
    if (correo && !correo.value.trim()) {
      helper.set(correo, 'Ingresa tu correo electrónico.');
    } else if (correo && !isValidEmail(correo.value)) {
      helper.set(correo, 'Por favor ingresa un correo electrónico válido.');
    }

    const area = form.querySelector('#area');
    if (area && !area.value) {
      helper.set(area, 'Selecciona el área o puesto al que postulas.');
    }

    const cvFile = form.querySelector('#cv-file');
    if (cvFile && cvFile.files && cvFile.files.length) {
      const fileRes = validateCvFile(cvFile);
      if (!fileRes.valid) helper.set(cvFile, fileRes.msg);
    }
  });

  // 11. Hero Rotating Text (Atento-style slide)
  var rotateWords = document.querySelectorAll('.hero-rotate-word');
  if (rotateWords.length > 1) {
    var currentIdx = 0;
    setInterval(function () {
      var current = rotateWords[currentIdx];
      var nextIdx = (currentIdx + 1) % rotateWords.length;
      var next = rotateWords[nextIdx];
      current.classList.remove('hero-rotate-word--active');
      current.classList.add('hero-rotate-word--exit');
      next.classList.add('hero-rotate-word--active');
      setTimeout(function () {
        current.classList.remove('hero-rotate-word--exit');
      }, 500);
      currentIdx = nextIdx;
    }, 2200);
  }

  // 12. Hero Parallax Opacity on Scroll
  var heroTextStack = document.querySelector('.hero-text-stack');
  if (heroTextStack) {
    var heroSection = document.querySelector('.hero');
    function updateHeroParallax() {
      if (!heroSection) return;
      var rect = heroSection.getBoundingClientRect();
      var vh = window.innerHeight;
      var visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
      var ratio = visible / rect.height;
      if (ratio < 0.65) {
        heroTextStack.classList.add('hero-text-stack--faded');
      } else {
        heroTextStack.classList.remove('hero-text-stack--faded');
      }
    }
    window.addEventListener('scroll', updateHeroParallax, { passive: true });
    updateHeroParallax();
  }

  // 13. Service Carousel (Campos/Servicios/Outbound, etc.)
  const svcTrack = document.querySelector('.svc-carousel-track');
  if (svcTrack) {
    const svcWrap = svcTrack.closest('.svc-carousel');
    const svcPrev = svcWrap.querySelector('.svc-carousel-prev');
    const svcNext = svcWrap.querySelector('.svc-carousel-next');
    const svcCards = svcTrack.querySelectorAll('.svc-other-card, .service-card');
    const svcStep = () => svcCards[0] ? svcCards[0].offsetWidth + 24 : 300;
    const svcUpdate = () => {
      svcPrev.disabled = svcTrack.scrollLeft <= 0;
      svcNext.disabled = svcTrack.scrollLeft >= svcTrack.scrollWidth - svcTrack.clientWidth - 1;
    };
    svcPrev.addEventListener('click', () => svcTrack.scrollBy({ left: -svcStep(), behavior: 'smooth' }));
    svcNext.addEventListener('click', () => svcTrack.scrollBy({ left: svcStep(), behavior: 'smooth' }));
    svcTrack.addEventListener('scroll', svcUpdate, { passive: true });
    svcUpdate();
    window.addEventListener('resize', svcUpdate);
  }

})();