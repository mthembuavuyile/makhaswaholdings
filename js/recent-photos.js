/* =====================================================
   MAKHASWA HOLDINGS — SITE JOURNAL LOGIC
   Programmatically handles the generation, load-more,
   and lightbox navigation of site progress photos.
   ===================================================== */

(() => {
    'use strict';

    // ── Generate the image dataset programmatically ──
    const TOTAL_IMAGES = 49;
    const IMAGES_DATA = [];

    // Reverse order (newest WhatsApp upload at the top)
    for (let i = TOTAL_IMAGES; i >= 1; i--) {
        IMAGES_DATA.push({
            src: `newimages/whatsapp (${i}).jpeg`,
            alt: `Live project photo update showing excavation, building works, piping, road construction, or machinery in action on one of our South African sites (Photo ${i})`,
            title: `Progress Update - Photo ${i}`,
            category: 'Site Operations'
        });
    }

    // ── Configuration ──
    const ITEMS_PER_PAGE = 12;
    let renderedCount = 0;
    let lightboxIndex = 0;

    // ── DOM References ──
    const grid = document.getElementById('recent-grid');
    const loadMoreContainer = document.getElementById('recent-pagination');
    const countLabel = document.getElementById('recent-count');
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbCap = document.getElementById('lightbox-caption');
    const lbCounter = document.getElementById('lightbox-counter');
    const lbClose = document.getElementById('lightbox-close-btn');
    const lbPrev = document.getElementById('lightbox-prev-btn');
    const lbNext = document.getElementById('lightbox-next-btn');

    // ── Intersection Observer for Fade-In Animation ──
    const observerOptions = { threshold: 0.05 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // ── Render Function ──
    function renderNextBatch() {
        if (!grid) return;

        const totalItems = IMAGES_DATA.length;
        const nextBatchSize = Math.min(ITEMS_PER_PAGE, totalItems - renderedCount);
        if (nextBatchSize <= 0) return;

        const batch = IMAGES_DATA.slice(renderedCount, renderedCount + nextBatchSize);
        batch.forEach((img, index) => {
            const globalIndex = renderedCount + index;
            const card = document.createElement('div');
            card.className = 'journal-card';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Open site journal entry LOG-${TOTAL_IMAGES - globalIndex}`);

            card.innerHTML = `
                <div class="journal-card-media">
                    <img src="${img.src}" alt="${img.alt}" loading="lazy">
                </div>
                <div class="journal-card-footer">
                    <div class="journal-card-info">
                        <span class="journal-log-badge">LOG #${String(TOTAL_IMAGES - globalIndex).padStart(3, '0')}</span>
                        <span class="journal-cat-badge">${img.category}</span>
                    </div>
                    <div class="journal-card-action">
                        <i data-lucide="maximize-2" class="journal-zoom-icon"></i>
                    </div>
                </div>
            `;

            // Click and keypress logic for launching Lightbox
            card.addEventListener('click', () => openLightbox(globalIndex));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(globalIndex);
                }
            });

            grid.appendChild(card);
            observer.observe(card);
        });

        renderedCount += nextBatchSize;

        // Re-initialize Lucide Icons
        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Update count label
        if (countLabel) {
            countLabel.textContent = `Showing 1–${renderedCount} of ${totalItems} updates`;
        }

        // Update the Load More button
        updateLoadMoreButton();
    }

    // ── Load More Button Builder ──
    function updateLoadMoreButton() {
        if (!loadMoreContainer) return;
        loadMoreContainer.innerHTML = '';

        if (renderedCount < IMAGES_DATA.length) {
            const btn = document.createElement('button');
            btn.className = 'btn-load-more';
            btn.innerHTML = `
                <span>LOAD MORE ENTRIES</span>
                <i data-lucide="arrow-down" width="16" height="16"></i>
            `;
            btn.addEventListener('click', () => {
                renderNextBatch();
            });
            loadMoreContainer.appendChild(btn);

            if (window.lucide) {
                window.lucide.createIcons();
            }
        } else {
            const msg = document.createElement('div');
            msg.className = 'journal-end-message';
            msg.textContent = 'You have viewed all site journal updates.';
            loadMoreContainer.appendChild(msg);
        }
    }

    // ── Lightbox Logic ──
    function openLightbox(index) {
        if (!lightbox) return;
        lightboxIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        if (lbImg) lbImg.focus();
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    function showPrev(e) {
        if (e) e.stopPropagation();
        lightboxIndex = (lightboxIndex - 1 + IMAGES_DATA.length) % IMAGES_DATA.length;
        updateLightbox();
    }

    function showNext(e) {
        if (e) e.stopPropagation();
        lightboxIndex = (lightboxIndex + 1) % IMAGES_DATA.length;
        updateLightbox();
    }

    function updateLightbox() {
        if (!lbImg || !lbCap || !lbCounter) return;
        const img = IMAGES_DATA[lightboxIndex];
        
        // Hide image while loading next to prevent flash of old image
        lbImg.style.opacity = '0';
        
        // Set image source
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        
        // Once image loads, fade it in
        lbImg.onload = () => {
            lbImg.style.opacity = '1';
        };
        
        // If image is already cached/loaded
        if (lbImg.complete) {
            lbImg.style.opacity = '1';
        }

        const logId = String(TOTAL_IMAGES - lightboxIndex).padStart(3, '0');
        lbCap.innerHTML = `
            <div class="lightbox-caption-header">
                <span class="lightbox-log-badge">LOG #${logId}</span>
                <span class="lightbox-category">${img.category}</span>
            </div>
            <p class="lightbox-caption-text">${img.title}</p>
        `;
        lbCounter.textContent = `${lightboxIndex + 1} / ${IMAGES_DATA.length}`;
    }

    // ── Setup Lightbox Listeners ──
    if (lightbox) {
        if (lbClose) lbClose.addEventListener('click', closeLightbox);
        if (lbPrev) lbPrev.addEventListener('click', showPrev);
        if (lbNext) lbNext.addEventListener('click', showNext);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            else if (e.key === 'ArrowLeft') showPrev();
            else if (e.key === 'ArrowRight') showNext();
        });

        // Swipe support for mobile
        let touchStartX = 0;
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].screenX - touchStartX;
            const threshold = 55;
            if (Math.abs(dx) > threshold) {
                dx < 0 ? showNext() : showPrev();
            }
        }, { passive: true });
    }

    // ── Initialize ──
    document.addEventListener('DOMContentLoaded', renderNextBatch);
    if (document.readyState !== 'loading') renderNextBatch();

})();
