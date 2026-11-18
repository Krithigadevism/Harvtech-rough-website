/**
 * HARVTECH PRIVATE LIMITED - Official Web Application
 * Cinematic Scroll-Based 3D Homepage Story Animation
 * Theme: Mustard Yellow & Deep Black
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHomepageScrollVideo();
  initMultiAngleProductViewer();
  initGallery();
  initContactForm();
  initHeaderScroll();
});

/* ==========================================================================
   1. NAVIGATION & SPA ROUTER
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link, .spa-trigger');
  const pageViews = document.querySelectorAll('.page-view');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  function switchPage(targetPageId, scrollToTop = true) {
    pageViews.forEach(page => {
      page.classList.remove('active-page');
    });

    navLinks.forEach(link => {
      if (link.dataset.page === targetPageId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    const targetElement = document.getElementById(targetPageId);
    if (targetElement) {
      targetElement.classList.add('active-page');
      if (scrollToTop) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
    }

    if (history.pushState) {
      history.pushState(null, null, `#${targetPageId}`);
    } else {
      location.hash = `#${targetPageId}`;
    }

    playUiSound('nav');
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = link.getAttribute('data-page');
      if (pageId) {
        switchPage(pageId);
      }
    });
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      playUiSound('click');
    });
  }

  // Handle Book Demonstration buttons throughout site
  const demoButtons = document.querySelectorAll('.trigger-book-demo');
  demoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productName = btn.getAttribute('data-product') || 'Power Weeder';
      triggerBookDemonstration(productName);
    });
  });

  function handleHashRoute() {
    const hash = window.location.hash.replace('#', '');
    const validPages = ['home', 'products', 'gallery', 'contact-us'];
    if (validPages.includes(hash)) {
      switchPage(hash, false);
    } else {
      switchPage('home', false);
    }
  }

  window.addEventListener('popstate', handleHashRoute);
  handleHashRoute();
}

/**
 * Direct Redirection from "Book Demonstration" button to Contact Us Page
 */
function triggerBookDemonstration(productName) {
  const navContactLink = document.querySelector('.nav-link[data-page="contact-us"]');
  if (navContactLink) {
    navContactLink.click();
  }

  setTimeout(() => {
    const demoBanner = document.getElementById('demoRedirectBanner');
    const demoItemName = document.getElementById('demoItemName');
    const productDropdown = document.getElementById('demoProductSelect');
    const fullNameField = document.getElementById('demoName');

    if (demoBanner) {
      demoBanner.classList.add('visible');
    }
    if (demoItemName) {
      demoItemName.textContent = productName;
    }
    if (productDropdown) {
      if (productName.includes('Weeder')) {
        productDropdown.value = 'Power Weeder';
      } else if (productName.includes('Tiller')) {
        productDropdown.value = 'Tiller';
      } else if (productName.includes('Tractor')) {
        productDropdown.value = 'Mini Tractor';
      }
    }

    const formBox = document.getElementById('bookDemoSection');
    if (formBox) {
      formBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (fullNameField) {
      fullNameField.focus();
    }
  }, 200);
}

/* ==========================================================================
   2. HEADER SCROLL EFFECT
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   3. HOMEPAGE: CINEMATIC ULTRA-SMOOTH SINGLE-SCREEN SCROLL VIDEO
   - AI-Generated Video (homepage-story.mp4) bound to mouse scroll.
   - 60 FPS Linear Interpolation (Lerp) for buttery smooth playback.
   - Operates on a single screen with zero blank space.
   - Seamlessly rolls down into the Application of Harvtech section when finished.
   - Smoothly rewinds when scrolling back to the top.
   ========================================================================== */
function initHomepageScrollVideo() {
  const screen = document.getElementById('homeVideoScreen');
  const video = document.getElementById('homeScrollVideo');
  const homeSection = document.getElementById('home');

  if (!video || !screen) return;

  let videoDuration = 18.84;
  let targetTime = 0;
  let currentSmoothTime = 0;
  let isSeeking = false;

  video.muted = true;
  video.playsInline = true;

  video.addEventListener('loadedmetadata', () => {
    if (video.duration && !isNaN(video.duration) && video.duration > 0) {
      videoDuration = video.duration;
    }
  });

  video.addEventListener('canplay', () => {
    if (video.duration && !isNaN(video.duration) && video.duration > 0) {
      videoDuration = video.duration;
    }
  });

  // Prime the decoder
  video.load();
  try {
    video.currentTime = 0.001;
  } catch (e) {}

  function isHomeActive() {
    return homeSection && homeSection.classList.contains('active-page');
  }

  // Handle seek completion to keep pipeline flowing
  video.addEventListener('seeked', () => {
    isSeeking = false;
  });

  // 60FPS Smooth Interpolation Loop (Decouples scroll from video decoder)
  function smoothPlaybackLoop() {
    if (isHomeActive()) {
      const diff = targetTime - currentSmoothTime;
      // Exponential smoothing (lerp factor 0.16 gives silky momentum)
      if (Math.abs(diff) > 0.002) {
        currentSmoothTime += diff * 0.16;
        currentSmoothTime = Math.max(0, Math.min(videoDuration - 0.04, currentSmoothTime));

        if (!video.seeking && !isSeeking) {
          isSeeking = true;
          try {
            video.currentTime = currentSmoothTime;
          } catch (err) {
            isSeeking = false;
          }
        }
      }
    }
    requestAnimationFrame(smoothPlaybackLoop);
  }
  requestAnimationFrame(smoothPlaybackLoop);

  // Mouse Wheel Listener with normalized speed
  window.addEventListener('wheel', (e) => {
    if (!isHomeActive()) return;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const normalizedDelta = e.deltaMode === 1 ? e.deltaY * 28 : e.deltaY;

    // SCROLL DOWN:
    if (normalizedDelta > 0) {
      // If at the top and video is still progressing, advance smoothly & prevent premature page jumping
      if (scrollY <= 8 && targetTime < videoDuration - 0.22) {
        e.preventDefault();
        const deltaSec = Math.max(0.08, Math.min(0.75, (normalizedDelta / 220) * 0.42));
        targetTime = Math.min(videoDuration - 0.05, targetTime + deltaSec);
      }
      // Once video reaches the end, normal page scroll naturally descends to Application section
    } 
    // SCROLL UP:
    else if (normalizedDelta < 0) {
      // When user is scrolled back to the top of the screen, rewind video
      if (scrollY <= 8 && targetTime > 0.04) {
        e.preventDefault();
        const deltaSec = Math.max(0.08, Math.min(0.75, (Math.abs(normalizedDelta) / 220) * 0.42));
        targetTime = Math.max(0, targetTime - deltaSec);
      }
    }
  }, { passive: false });

  // Touch Swipe Support for Mobile
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isHomeActive() || !e.touches || e.touches.length === 0) return;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const currentY = e.touches[0].clientY;
    const diffY = touchStartY - currentY; // positive = swipe up (scroll down)

    if (diffY > 0) {
      if (scrollY <= 8 && targetTime < videoDuration - 0.22) {
        e.preventDefault();
        const deltaSec = Math.max(0.06, Math.min(0.5, (diffY / 120) * 0.32));
        targetTime = Math.min(videoDuration - 0.05, targetTime + deltaSec);
        touchStartY = currentY;
      }
    } else if (diffY < 0) {
      if (scrollY <= 8 && targetTime > 0.04) {
        e.preventDefault();
        const deltaSec = Math.max(0.06, Math.min(0.5, (Math.abs(diffY) / 120) * 0.32));
        targetTime = Math.max(0, targetTime - deltaSec);
        touchStartY = currentY;
      }
    }
  }, { passive: false });
}

/* ==========================================================================
   4. MULTI-ANGLE 360 PRODUCT VIEWER (Harvtech Electric Power Weeder)
   - Uses real 360 rotation video (weeder-360.mp4)
   - Continuous auto-spin loop with live degree angle telemetry
   - Drag / swipe interactive scrubbing for custom 360 inspection
   - Preset angle jump buttons (Front, Side, Rear, 360 Spin)
   ========================================================================== */
function initMultiAngleProductViewer() {
  const container = document.getElementById('weeder360Turntable');
  const video = document.getElementById('weeder360Video');
  const angleBtns = document.querySelectorAll('.angle-selector-bar .angle-btn');
  const btnToggleSpin = document.getElementById('btnToggleTurntable');
  const btnReset = document.getElementById('btnResetTurntable');
  const angleIndicator = document.getElementById('weederAngleDeg');

  if (!video || !container) return;

  let isAutoSpinning = true;
  let isDragging = false;
  let startX = 0;
  let startTime = 0;
  let videoDuration = 5.04;

  video.muted = true;
  video.playsInline = true;

  video.addEventListener('loadedmetadata', () => {
    if (video.duration && !isNaN(video.duration) && video.duration > 0) {
      videoDuration = video.duration;
    }
  });

  // Ensure autoplay starts smoothly
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {});
  }

  // Update live degree counter as video rotates
  video.addEventListener('timeupdate', () => {
    if (angleIndicator && videoDuration > 0) {
      const progress = (video.currentTime / videoDuration);
      const degrees = Math.round(progress * 360) % 360;
      angleIndicator.textContent = `${degrees}°`;
    }
  });

  // Play / Pause Toggle Button
  if (btnToggleSpin) {
    btnToggleSpin.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.play().then(() => {
          isAutoSpinning = true;
          btnToggleSpin.innerHTML = '<i class="fa-solid fa-pause"></i>';
          btnToggleSpin.classList.add('active');
        }).catch(() => {});
      } else {
        video.pause();
        isAutoSpinning = false;
        btnToggleSpin.innerHTML = '<i class="fa-solid fa-play"></i>';
        btnToggleSpin.classList.remove('active');
      }
      playUiSound('toggle');
    });
  }

  // Reset Button
  if (btnReset) {
    btnReset.addEventListener('click', (e) => {
      e.stopPropagation();
      video.currentTime = 0;
      video.play().then(() => {
        isAutoSpinning = true;
        if (btnToggleSpin) {
          btnToggleSpin.innerHTML = '<i class="fa-solid fa-pause"></i>';
          btnToggleSpin.classList.add('active');
        }
      }).catch(() => {});
      angleBtns.forEach(b => b.classList.toggle('active', b.dataset.angle === 'front'));
      playUiSound('click');
    });
  }

  // Interactive Drag-to-Rotate (Mouse)
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startTime = video.currentTime;
    video.pause();
    container.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging || videoDuration <= 0) return;
    const deltaX = e.clientX - startX;
    // Map ~320px of mouse drag to a full 360 rotation
    const timeDelta = (deltaX / 320) * videoDuration;
    let targetTime = (startTime + timeDelta) % videoDuration;
    if (targetTime < 0) targetTime += videoDuration;
    try {
      video.currentTime = targetTime;
    } catch (err) {}
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    container.style.cursor = 'grab';
    if (isAutoSpinning) {
      video.play().catch(() => {});
    }
  });

  // Interactive Touch Swipe (Mobile)
  container.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX;
      startTime = video.currentTime;
      video.pause();
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches || e.touches.length !== 1 || videoDuration <= 0) return;
    const deltaX = e.touches[0].clientX - startX;
    const timeDelta = (deltaX / 300) * videoDuration;
    let targetTime = (startTime + timeDelta) % videoDuration;
    if (targetTime < 0) targetTime += videoDuration;
    try {
      video.currentTime = targetTime;
    } catch (err) {}
  }, { passive: true });

  window.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    if (isAutoSpinning) {
      video.play().catch(() => {});
    }
  });

  // Angle Selector Preset Buttons (Front, Side, Rear, Full 360 Spin)
  angleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      angleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const preset = btn.getAttribute('data-angle');
      if (preset === 'front') {
        video.pause();
        isAutoSpinning = false;
        video.currentTime = 0;
        if (btnToggleSpin) btnToggleSpin.innerHTML = '<i class="fa-solid fa-play"></i>';
      } else if (preset === 'side') {
        video.pause();
        isAutoSpinning = false;
        video.currentTime = videoDuration * 0.25; // 90 degrees
        if (btnToggleSpin) btnToggleSpin.innerHTML = '<i class="fa-solid fa-play"></i>';
      } else if (preset === 'rear') {
        video.pause();
        isAutoSpinning = false;
        video.currentTime = videoDuration * 0.50; // 180 degrees
        if (btnToggleSpin) btnToggleSpin.innerHTML = '<i class="fa-solid fa-play"></i>';
      } else if (preset === 'perspective') {
        isAutoSpinning = true;
        video.play().catch(() => {});
        if (btnToggleSpin) btnToggleSpin.innerHTML = '<i class="fa-solid fa-pause"></i>';
      }
      playUiSound('click');
    });
  });
}

/* ==========================================================================
   5. GALLERY & LIGHTBOX
   ========================================================================== */
function initGallery() {
  const galleryCards = document.querySelectorAll('.visual-gallery-grid .gallery-card');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxTag = document.getElementById('lightboxTag');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (!galleryCards.length) return;

  // Build gallery items registry from DOM cards
  const galleryItems = Array.from(galleryCards).map((card, idx) => {
    return {
      index: idx,
      img: card.getAttribute('data-img'),
      tag: card.getAttribute('data-tag') || 'HARVTECH Milestone',
      title: card.getAttribute('data-title') || 'Visual Gallery',
      desc: card.getAttribute('data-desc') || ''
    };
  });

  let currentIndex = 0;

  function renderLightbox(index) {
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentIndex = index;

    const item = galleryItems[currentIndex];
    if (!item) return;

    if (lightboxImg) {
      lightboxImg.style.opacity = '0';
      lightboxImg.style.transform = 'scale(0.97)';
      setTimeout(() => {
        lightboxImg.src = item.img;
        lightboxImg.alt = item.title;
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      }, 120);
    }

    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxTag) lightboxTag.textContent = item.tag;
    if (lightboxDesc) lightboxDesc.textContent = item.desc;
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
    }
  }

  function openLightbox(index) {
    renderLightbox(index);
    if (lightboxModal) {
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // lock background scrolling
    }
    playUiSound('modal');
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function showPrev() {
    renderLightbox(currentIndex - 1);
    playUiSound('click');
  }

  function showNext() {
    renderLightbox(currentIndex + 1);
    playUiSound('click');
  }

  // Click card to open lightbox
  galleryCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      openLightbox(idx);
    });
  });

  // Next / Prev button events
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      showPrev();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      showNext();
    });
  }

  // Close handlers
  if (lightboxClose) {
    lightboxClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      // Close only if clicking the backdrop outside of container
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    } else if (e.key === 'ArrowRight') {
      showNext();
    }
  });

  // Touch swipe support in lightbox for mobile
  let touchStartX = 0;
  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
      }
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches.length > 0) {
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchStartX - touchEndX;
        if (Math.abs(diffX) > 45) {
          if (diffX > 0) {
            showNext(); // swipe left -> next
          } else {
            showPrev(); // swipe right -> prev
          }
        }
      }
    }, { passive: true });
  }
}

/* ==========================================================================
   6. CONTACT FORM & BOOK DEMONSTRATION SUBMISSION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('harvtechBookDemoForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('demoName')?.value.trim();
    const phone = document.getElementById('demoPhone')?.value.trim();
    const email = document.getElementById('demoEmail')?.value.trim();
    const location = document.getElementById('demoLocation')?.value.trim();
    const product = document.getElementById('demoProductSelect')?.value;
    const message = document.getElementById('demoMessage')?.value.trim();

    if (!name || !phone || !email || !location || !product) {
      showToast('⚠️ Please fill out all required fields marked with *.', 'warning');
      return;
    }

    if (phone.length < 8) {
      showToast('⚠️ Please enter a valid phone number (at least 8 digits).', 'warning');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      showToast('⚠️ Please enter a valid email address.', 'warning');
      return;
    }

    const submitBtn = form.querySelector('.btn-send-request');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <i class="fa-solid fa-circle-notch fa-spin"></i>
      <span>Transmitting Request...</span>
    `;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      const requests = JSON.parse(localStorage.getItem('harvtech_demo_requests') || '[]');
      const newRequest = {
        name,
        phone,
        email,
        location,
        product,
        message,
        id: 'HT-' + Date.now().toString().slice(-6),
        date: new Date().toLocaleString()
      };
      requests.push(newRequest);
      localStorage.setItem('harvtech_demo_requests', JSON.stringify(requests));

      showToast(`✅ Demonstration Request Registered (${newRequest.id})! Our Harvtech team will contact you at ${phone} to schedule your on-farm trial in ${location}.`, 'success');
      playUiSound('success');

      form.reset();
      const demoBanner = document.getElementById('demoRedirectBanner');
      if (demoBanner) demoBanner.classList.remove('visible');
    }, 1100);
  });

  const copyBtn = document.getElementById('btnCopyCompanyEmail');
  if (copyBtn) {
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText('harvtechllp@gmail.com').then(() => {
        showToast('📋 Copied email address (harvtechllp@gmail.com) to clipboard!', 'info');
        playUiSound('click');
      });
    });
  }
}

/**
 * Toast Notice System
 */
function showToast(message, type = 'info') {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  const iconMarkup = type === 'success' 
    ? '✓' 
    : type === 'warning' 
    ? '!' 
    : 'ℹ';

  toast.innerHTML = `
    <div class="toast-icon">${iconMarkup}</div>
    <div class="toast-text">${message}</div>
  `;

  toast.classList.add('show');

  if (window.toastTimeout) {
    clearTimeout(window.toastTimeout);
  }

  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 5500);
}

/* ==========================================================================
   7. CINEMATIC AUDIO INTERFACE & AMBIENT STORY SOUNDS
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initCinematicAudio() {
  const audioToggle = document.getElementById('cinematicAudioToggle');
  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      audioToggle.classList.toggle('active', soundEnabled);
      const label = audioToggle.querySelector('.pill-label');
      if (label) {
        label.textContent = soundEnabled ? 'AUDIO: LIVE' : 'AUDIO: MUTED';
      }
      if (soundEnabled) {
        playUiSound('click');
        showToast('🔊 Audio Interface Active', 'info');
      } else {
        showToast('🔇 Audio Interface Muted', 'info');
      }
    });
  }
}

function playStoryAmbientSound(soundType) {
  if (!soundEnabled) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (soundType === 'morning') {
      // Gentle warm chord
      osc.type = 'sine';
      osc.frequency.setValueAtTime(329.63, now); // E4
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.65);
    } else if (soundType === 'lock') {
      // Crisp mechanical battery lock click
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (soundType === 'motor') {
      // Electric BLDC motor acceleration ramp
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.45);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.52);
    } else if (soundType === 'finale') {
      // Triumphant chord
      playUiSound('success');
    }
  } catch (e) {}
}

function playUiSound(type) {
  if (!soundEnabled) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'nav') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(820, now + 0.12);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'click' || type === 'toggle') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.exponentialRampToValueAtTime(340, now + 0.05);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.07);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.36);
    }
  } catch (err) {}
}
