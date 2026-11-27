/**
 * HARVTECH PRIVATE LIMITED - Official Web Application
 * Cinematic Scroll-Based 3D Homepage Story Animation
 * Theme: Mustard Yellow & Deep Black
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHomepageScrollAnimation();
  initMultiAngleProductViewer();
  initTcoCalculator();
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
  const floatingMenuBtn = document.getElementById('floatingMenuBtn');
  const sideMenuPanel = document.getElementById('sideMenuPanel');
  const sideMenuBackdrop = document.getElementById('sideMenuBackdrop');
  const sideMenuCloseBtn = document.getElementById('sideMenuCloseBtn');

  function openSideMenu() {
    if (sideMenuPanel) sideMenuPanel.classList.add('open');
    if (sideMenuBackdrop) sideMenuBackdrop.classList.add('open');
    if (floatingMenuBtn) floatingMenuBtn.classList.add('active');
    playUiSound('toggle');
  }

  function closeSideMenu() {
    if (sideMenuPanel) sideMenuPanel.classList.remove('open');
    if (sideMenuBackdrop) sideMenuBackdrop.classList.remove('open');
    if (floatingMenuBtn) floatingMenuBtn.classList.remove('active');
  }

  if (floatingMenuBtn) {
    floatingMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (sideMenuPanel && sideMenuPanel.classList.contains('open')) {
        closeSideMenu();
      } else {
        openSideMenu();
      }
    });
  }

  if (sideMenuCloseBtn) {
    sideMenuCloseBtn.addEventListener('click', closeSideMenu);
  }

  if (sideMenuBackdrop) {
    sideMenuBackdrop.addEventListener('click', closeSideMenu);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideMenuPanel && sideMenuPanel.classList.contains('open')) {
      closeSideMenu();
    }
  });

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
        window.scrollTo(0, 0);
      }
    }

    closeSideMenu();

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
      const pageId = link.getAttribute('data-page') || link.closest('[data-page]')?.getAttribute('data-page');
      if (pageId) {
        switchPage(pageId);
      }
    });
  });

  // Handle Book Demonstration buttons throughout site
  const demoButtons = document.querySelectorAll('.trigger-book-demo');
  demoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productName = btn.getAttribute('data-product') || 'Smart Electric Weeder';
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
        productDropdown.value = 'Smart Electric Weeder';
      } else if (productName.includes('Mini-Tractor') || productName.includes('Mini Tractor')) {
        productDropdown.value = '25 HP Mini-Tractor';
      } else if (productName.includes('Tractor')) {
        productDropdown.value = 'Electric Tractor';
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
   3. HOMEPAGE: CINEMATIC ZERO-STUTTER WEBP SCROLL SCRUB ANIMATION
   - 236 Highly Compressed WebP frames (40.2% smaller file size).
   - Silky smooth scrub animation tied to mouse wheel and touch swipe.
   - Strictly locked on the video screen until 100% completed.
   - Smooth frame-by-frame 60FPS / 120FPS GPU Canvas rendering with lerp damping.
   - Seamlessly releases and scrolls to "About Harvtech" once finished.
   - Smoothly rewinds in reverse when scrolling back to the top.
   ========================================================================== */
function initHomepageScrollAnimation() {
  const screen = document.getElementById('homeVideoScreen');
  const canvas = document.getElementById('homeScrollCanvas');
  const scrollPrompt = document.getElementById('heroScrollPrompt');
  const homeSection = document.getElementById('home');

  if (!canvas || !screen) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  const TOTAL_FRAMES = 236;
  const frames = new Array(TOTAL_FRAMES);
  const loadedMap = new Array(TOTAL_FRAMES).fill(false);

  let targetFrame = 0;
  let currentFrame = 0;
  let lastDrawnFrame = -1;
  let firstFrameRendered = false;

  function isHomeActive() {
    return homeSection && homeSection.classList.contains('active-page');
  }

  // Preloader for individual WebP frame
  function preloadFrame(index) {
    if (frames[index]) return frames[index];
    const img = new Image();
    const frameNum = String(index + 1).padStart(4, '0');
    img.src = `css/assets/frames/frame_${frameNum}.webp`;
    img.onload = () => {
      loadedMap[index] = true;
      if (index === 0 && !firstFrameRendered) {
        firstFrameRendered = true;
        drawFrame(0);
      }
    };
    frames[index] = img;
    return img;
  }

  // Preload frame 0 immediately for instant first-paint
  preloadFrame(0);

  // Staged progressive preloader: Priority load initial frames, then pipeline the rest
  function loadAllFrames() {
    // Stage 1: Load first 32 frames immediately for instant responsiveness
    for (let i = 0; i < Math.min(32, TOTAL_FRAMES); i++) {
      preloadFrame(i);
    }
    // Stage 2: Stream remaining frames in background batches
    let nextIndex = 32;
    function loadNextBatch() {
      const batchEnd = Math.min(nextIndex + 16, TOTAL_FRAMES);
      for (let i = nextIndex; i < batchEnd; i++) {
        preloadFrame(i);
      }
      nextIndex = batchEnd;
      if (nextIndex < TOTAL_FRAMES) {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(loadNextBatch, { timeout: 120 });
        } else {
          setTimeout(loadNextBatch, 40);
        }
      }
    }
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadNextBatch, { timeout: 100 });
    } else {
      setTimeout(loadNextBatch, 50);
    }
  }
  loadAllFrames();

  // High-DPI Canvas Resize with crisp cover scaling
  function resizeCanvas() {
    if (!canvas || !screen) return;
    const rect = screen.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    lastDrawnFrame = -1;
    drawFrame(Math.round(currentFrame));
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();

  // Instantaneous GPU frame draw with cover fitting (zero latency, zero black bars)
  function drawFrame(index) {
    if (!ctx || !canvas.width || !canvas.height) return;
    index = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));

    let img = frames[index];
    if (!loadedMap[index] || !img || !img.complete || !img.naturalWidth) {
      // Instant fallback to nearest loaded frame to guarantee zero flicker
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        if (index - offset >= 0 && loadedMap[index - offset]) {
          img = frames[index - offset];
          break;
        }
        if (index + offset < TOTAL_FRAMES && loadedMap[index + offset]) {
          img = frames[index + offset];
          break;
        }
      }
    }

    if (!img || !img.complete || !img.naturalWidth) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const cRatio = cw / ch;
    const iRatio = img.naturalWidth / img.naturalHeight;
    let dw, dh, dx, dy;

    if (cRatio > iRatio) {
      dw = cw;
      dh = cw / iRatio;
      dx = 0;
      dy = (ch - dh) / 2;
    } else {
      dh = ch;
      dw = ch * iRatio;
      dx = (cw - dw) / 2;
      dy = 0;
    }

    ctx.fillStyle = '#0a0b0e';
    ctx.fillRect(0, 0, cw, ch);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, dx, dy, dw, dh);
    lastDrawnFrame = index;
  }

  // Mouse Wheel Scrubbing with Strict Screen Locking & Silky Micro-Stepping
  window.addEventListener('wheel', (e) => {
    if (!isHomeActive()) return;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const rawDelta = e.deltaMode === 1 ? e.deltaY * 28 : e.deltaY;

    // SCROLL DOWN (forward scrub):
    if (rawDelta > 0) {
      // If at top of the page and video is NOT finished, lock screen and scrub forward
      if (scrollY <= 10 && targetFrame < TOTAL_FRAMES - 1) {
        e.preventDefault();
        // Calibrate step for buttery smooth scrub (supports both delicate trackpads & mouse wheels)
        const step = Math.max(0.6, Math.min(7, Math.abs(rawDelta) / 20));
        targetFrame = Math.min(TOTAL_FRAMES - 1, targetFrame + step);

        if (scrollPrompt && targetFrame > 6) {
          scrollPrompt.classList.add('fade-out');
        }
      }
      // Once targetFrame reaches TOTAL_FRAMES - 1, the video is 100% finished!
      // Subsequent scroll down rolls down smoothly into the rest of the page!
    }
    // SCROLL UP (reverse scrub):
    else if (rawDelta < 0) {
      // If user has scrolled back up to top and video is not at start, rewind it smoothly
      if (scrollY <= 10 && targetFrame > 0) {
        e.preventDefault();
        const step = Math.max(0.6, Math.min(7, Math.abs(rawDelta) / 20));
        targetFrame = Math.max(0, targetFrame - step);

        if (scrollPrompt && targetFrame <= 6) {
          scrollPrompt.classList.remove('fade-out');
        }
      }
    }
  }, { passive: false });

  // Mobile Touch Swipe Handling with Strict Screen Locking
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
    const diffY = touchStartY - currentY; // positive = swipe up (scroll forward)

    if (diffY > 0) {
      if (scrollY <= 10 && targetFrame < TOTAL_FRAMES - 1) {
        e.preventDefault();
        const step = Math.max(0.6, Math.min(6, diffY / 12));
        targetFrame = Math.min(TOTAL_FRAMES - 1, targetFrame + step);
        touchStartY = currentY;

        if (scrollPrompt && targetFrame > 6) {
          scrollPrompt.classList.add('fade-out');
        }
      }
    } else if (diffY < 0) {
      if (scrollY <= 10 && targetFrame > 0) {
        e.preventDefault();
        const step = Math.max(0.6, Math.min(6, Math.abs(diffY) / 12));
        targetFrame = Math.max(0, targetFrame - step);
        touchStartY = currentY;

        if (scrollPrompt && targetFrame <= 6) {
          scrollPrompt.classList.remove('fade-out');
        }
      }
    }
  }, { passive: false });

  // 60FPS / 120FPS GPU Continuous Interpolation Loop (Exponential Lerp Damping)
  function animationLoop() {
    if (isHomeActive()) {
      const diff = targetFrame - currentFrame;
      if (Math.abs(diff) > 0.01) {
        // Silky exponential damping (lerp factor 0.18 gives responsive, frictionless scrub)
        currentFrame += diff * 0.18;
        const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrame)));
        if (frameIndex !== lastDrawnFrame) {
          drawFrame(frameIndex);
        }
      }
    }
    requestAnimationFrame(animationLoop);
  }
  requestAnimationFrame(animationLoop);
}

// Backwards-compatibility alias
function initHomepageScrollVideo() {
  initHomepageScrollAnimation();
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

  // Floating WhatsApp Bot Click Sound
  const waBtn = document.getElementById('whatsappChatBtn');
  if (waBtn) {
    waBtn.addEventListener('click', () => {
      playUiSound('click');
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

/* ==========================================================================
   INTERACTIVE TOTAL COST OF OWNERSHIP & SAVINGS CALCULATOR
   - Real-time updates based on annual operating hours slider (100 - 1500 hrs)
   - Baseline diesel toggle (5.5 HP @ ₹78/hr vs 9 HP @ ₹98/hr)
   - HarvTech Electric running cost @ ₹15/hr
   - 50% Government Subsidy on ₹1.13 lakh machine price (Subsidized cost = ₹56,500)
   - Visual vertical bar chart animation matching Reference Image 1
   - Formats currency in Indian numbering (e.g. ₹37,800)
   ========================================================================== */
function initTcoCalculator() {
  const slider = document.getElementById('calcHoursSlider');
  const hoursNum = document.getElementById('calcHoursNumber');
  const chartHoursBadge = document.getElementById('chartHoursBadge');
  const baselineBtns = document.querySelectorAll('.baseline-pill-btn');
  
  const valDieselCost = document.getElementById('valDieselCost');
  const valElectricCost = document.getElementById('valElectricCost');
  const barDieselFill = document.getElementById('barDieselFill');
  const barElectricFill = document.getElementById('barElectricFill');

  const statHourlySavings = document.getElementById('statHourlySavings');
  const statAnnualSavings = document.getElementById('statAnnualSavings');
  const statPaybackPeriod = document.getElementById('statPaybackPeriod');
  const statBaselineName = document.getElementById('statBaselineName');
  const bannerSavingsAmount = document.getElementById('bannerSavingsAmount');

  if (!slider) return;

  let currentDieselRate = 78; // Conventional 5.5 HP diesel baseline by default (₹78/hr)
  let currentBaselineName = '5.5 HP Diesel';
  const ELECTRIC_RATE = 15; // HarvTech Electric: ₹15/hr
  const MACHINE_SUBSIDIZED_PRICE = 56500; // 50% of ₹1,13,000

  function formatInr(val) {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  }

  function updateCalculator() {
    const hours = parseInt(slider.value, 10) || 600;

    // Update displayed hours
    if (hoursNum) hoursNum.textContent = hours.toLocaleString('en-IN');
    if (chartHoursBadge) chartHoursBadge.textContent = hours.toLocaleString('en-IN');

    // Calculations
    const dieselTotal = hours * currentDieselRate;
    const electricTotal = hours * ELECTRIC_RATE;
    const annualSavings = dieselTotal - electricTotal;
    const hourlySavings = currentDieselRate - ELECTRIC_RATE;
    const savingsPercent = Math.round((annualSavings / dieselTotal) * 100);

    // Payback in months: Subsidized price / Annual savings * 12
    const paybackMonths = Math.max(1, (MACHINE_SUBSIDIZED_PRICE / annualSavings) * 12);
    const paybackDisplay = paybackMonths < 12 
      ? `~${paybackMonths.toFixed(1)} Months` 
      : `~${(paybackMonths / 12).toFixed(1)} Years (${Math.round(paybackMonths)} Mo)`;

    // Update values above bars
    if (valDieselCost) valDieselCost.textContent = formatInr(dieselTotal);
    if (valElectricCost) valElectricCost.textContent = formatInr(electricTotal);

    // Dynamic bar heights (proportional, with min height so labels fit nicely)
    const maxCost = Math.max(dieselTotal, electricTotal, 1);
    const dieselBarPct = Math.max(15, Math.min(100, (dieselTotal / maxCost) * 100));
    const electricBarPct = Math.max(12, Math.min(100, (electricTotal / maxCost) * 100));

    if (barDieselFill) barDieselFill.style.height = `${dieselBarPct}%`;
    if (barElectricFill) barElectricFill.style.height = `${electricBarPct}%`;

    // Update Stat Cards (Image 2 metrics)
    if (statHourlySavings) statHourlySavings.textContent = `${formatInr(hourlySavings)} / hr`;
    if (statAnnualSavings) statAnnualSavings.textContent = `${formatInr(annualSavings)} / yr`;
    if (statPaybackPeriod) statPaybackPeriod.textContent = paybackDisplay;
    if (statBaselineName) statBaselineName.textContent = currentBaselineName;

    // Update bottom banner callout
    if (bannerSavingsAmount) {
      bannerSavingsAmount.textContent = `Save ${formatInr(annualSavings)} / year (~${savingsPercent}% savings)`;
    }

    // Dynamic slider fill background
    const min = parseFloat(slider.min) || 100;
    const max = parseFloat(slider.max) || 1500;
    const percent = ((hours - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(90deg, #e5a910 ${percent}%, #2a2d36 ${percent}%)`;
  }

  slider.addEventListener('input', updateCalculator);

  // Handle baseline toggle buttons
  baselineBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      baselineBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentDieselRate = parseFloat(btn.dataset.rate) || 78;
      currentBaselineName = btn.dataset.baseline === 'diesel9' ? '9 HP Diesel' : '5.5 HP Diesel';
      playUiSound('toggle');
      updateCalculator();
    });
  });

  // Initial calculation
  updateCalculator();
}
