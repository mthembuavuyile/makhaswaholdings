/* =====================================================
   MAKHASWA HOLDINGS — RECENT-PHOTOS.JS
   Programmatically handles the generation, pagination,
   and lightbox navigation of the 49 site progress photos.
   ===================================================== */

(() => {
    'use strict';

    // ── Generate the image dataset programmatically ──
    const TOTAL_IMAGES = 49;
    const IMAGES_DATA = [];

    for (let i = 1; i <= TOTAL_IMAGES; i++) {
        IMAGES_DATA.push({
            src: `newimages/whatsapp (${i}).jpeg`,
            alt: `Live project photo update showing excavation, building works, piping, road construction, or machinery in action on one of our South African sites (Photo ${i})`,
            title: `Progress Update - Photo ${i}`,
            category: 'Site Operations'
        });
    }

    // ── Configuration ──
    const ITEMS_PER_PAGE = 12;
    let currentPage = 1;
    let lightboxIndex = 0;

    // ── DOM References ──
    const grid = document.getElementById('recent-grid');
    const pagination = document.getElementById('recent-pagination');
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
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // ── Render Function ──
    function render() {
        if (!grid) return;

        const totalItems = IMAGES_DATA.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const pageItems = IMAGES_DATA.slice(start, start + ITEMS_PER_PAGE);

        // Update count label
        if (countLabel) {
            countLabel.textContent = `Showing ${start + 1}–${Math.min(start + pageItems.length, totalItems)} of ${totalItems} updates`;
        }

        // Clear grid and render cards
        grid.innerHTML = '';
        pageItems.forEach((img, index) => {
            const globalIndex = start + index;
            const card = document.createElement('div');
            card.className = 'recent-item';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Open site photo ${globalIndex + 1}`);

            // CSS animation initialization styles (will be triggered by observer)
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            card.innerHTML = `
                <img src="${img.src}" alt="${img.alt}" loading="lazy">
                <div class="recent-item-overlay">
                    <span>${img.category}</span>
                    <h4>${img.title}</h4>
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

        // Build pagination buttons
        buildPagination(totalPages);
    }

    // ── Pagination Builder ──
    function buildPagination(totalPages) {
        if (!pagination) return;
        pagination.innerHTML = '';
        if (totalPages <= 1) return;

        const makeButton = (label, page, isIcon = false) => {
            const btn = document.createElement('button');
            btn.className = 'page-btn' + (page === currentPage ? ' active' : '');
            btn.setAttribute('aria-label', isIcon ? label : `Go to page ${page}`);
            if (page === currentPage) btn.setAttribute('aria-current', 'page');
            btn.innerHTML = label;
            btn.disabled = (page < 1 || page > totalPages);
            btn.addEventListener('click', () => {
                currentPage = page;
                render();
                grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            return btn;
        };

        // Previous button
        const prevSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
        const prevBtn = makeButton(prevSVG, currentPage - 1, true);
        prevBtn.disabled = (currentPage === 1);
        pagination.appendChild(prevBtn);

        // Page numbers range
        const pageRange = getPageRange(currentPage, totalPages);
        pageRange.forEach(p => {
            if (p === '…') {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '…';
                ellipsis.style.cssText = 'padding: 0 6px; color: var(--text-muted); align-self: center; font-size: 14px;';
                pagination.appendChild(ellipsis);
            } else {
                pagination.appendChild(makeButton(p, p));
            }
        });

        // Next button
        const nextSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
        const nextBtn = makeButton(nextSVG, currentPage + 1, true);
        nextBtn.disabled = (currentPage === totalPages);
        pagination.appendChild(nextBtn);
    }

    // Helper for generating page number array with ellipses
    function getPageRange(current, total) {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        const pages = [];
        pages.push(1);
        if (current > 3) pages.push('…');
        const start = Math.max(2, current - 1);
        const end = Math.min(total - 1, current + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (current < total - 2) pages.push('…');
        pages.push(total);
        return pages;
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
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lbCap.innerHTML = `
            <strong style="color: var(--gold); text-transform: uppercase; letter-spacing: 1px; display: block; font-size: 11px; margin-bottom: 6px;">
                ${img.category}
            </strong>
            ${img.title}
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
    document.addEventListener('DOMContentLoaded', render);
    if (document.readyState !== 'loading') render();

})();
