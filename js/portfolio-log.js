/* =====================================================
   MAKHASWA HOLDINGS — PORTFOLIO PROGRESS LOG
   Programmatically handles dataset generation, filters,
   progressive loading, and lightbox navigation for
   235 live project progress photos.
   ===================================================== */

(() => {
    'use strict';

    // ── Generate the image datasets programmatically ──
    const commercialData = [];
    const residentialData = [];
    const foundationData = [];
    const surveyingData = [];

    // 1. Commercial Building Construction (12 down to 1)
    for (let num = 12; num >= 1; num--) {
        let alt, title;

        if (num === 1) {
            alt = `Interior concrete staircase formwork and rebar reinforcement shuttering in progress on a commercial building site (Progress Log #${num}).`;
            title = `Staircase Formwork & Rebar Reinforcement - Log #${num}`;

        } else if (num === 2) {
            alt = `Interior concrete staircase timber formwork boxing with rebar reinforcement visible at base, enclosed by brick walls on a commercial site (Progress Log #${num}).`;
            title = `Interior Staircase Timber Boxing & Formwork - Log #${num}`;

        } else if (num === 3 || num === 4) {
            alt = `Completed multi-storey commercial brick building with recessed balconies and face-brick facade, post-construction (Progress Log #${num}).`;
            title = `Completed Commercial Brick Facade & Balconies - Log #${num}`;

        } else if (num === 5) {
            alt = `Aerial view of extended commercial building roofline and long-span brick wall construction across the site perimeter (Progress Log #${num}).`;
            title = `Roofline & Long-Span Perimeter Masonry - Log #${num}`;

        } else if (num === 6) {
            alt = `Interior concrete staircase nearing completion with face-brick side walls and open stairwell (Progress Log #${num}).`;
            title = `Interior Staircase Brickwork Completion - Log #${num}`;

        } else if (num === 7) {
            alt = `Reinforced concrete column with timber formwork casing and scaffold support poles on a commercial site (Progress Log #${num}).`;
            title = `Concrete Column Formwork & Scaffolding - Log #${num}`;

        } else if (num === 8) {
            alt = `Flat roof slab construction with steel mesh reinforcement laid across concrete soffit shuttering (Progress Log #${num}).`;
            title = `Roof Slab Steel Mesh & Soffit Shuttering - Log #${num}`;

        } else if (num === 9) {
            alt = `Long-span steel rebar beam reinforcement assembly and formwork preparation for elevated concrete slab (Progress Log #${num}).`;
            title = `Elevated Slab Rebar & Beam Formwork - Log #${num}`;

        } else if (num === 10) {
            alt = `Covered corridor and colonnade brickwork with plastered internal walls on a commercial building (Progress Log #${num}).`;
            title = `Commercial Colonnade & Corridor Masonry - Log #${num}`;

        } else if (num === 11) {
            alt = `Construction worker in full PPE securing vertical steel rebar column reinforcement on elevated scaffolding at a commercial building site (Progress Log #${num}).`;
            title = `Vertical Rebar Column Reinforcement - Log #${num}`;

        } else {
            // num === 12
            alt = `Workers laying steel mesh reinforcement on a flat concrete slab surface at roof level of a commercial building (Progress Log #${num}).`;
            title = `Roof Slab Mesh Laying & Concrete Preparation - Log #${num}`;
        }

        commercialData.push({
            src: `images/journal/building/commercial/building-construction-work (${num}).jpeg`,
            alt: alt,
            title: title,
            category: 'commercial',
            categoryName: 'Commercial Building'
        });
    }

    // 2. Residential Housing Construction (55 down to 1)
    for (let num = 55; num >= 1; num--) {
        let alt, title;

        // Pool of SEO caption variants — cycled by num to appear randomised
        const captionSets = [
            {
                alt: `Bricklaying crew constructing ground floor face-brick walls with scaffolding poles erected on a residential housing site (Progress Log #${num}).`,
                title: `Ground Floor Brickwork & Scaffolding Erection - Log #${num}`
            },
            {
                alt: `Single residential unit brick walls rising to window lintel level with door and window openings formed on site (Progress Log #${num}).`,
                title: `Residential Wall Openings & Lintel Level Masonry - Log #${num}`
            },
            {
                alt: `Multi-unit residential brick wall construction progressing across several stands with scaffold support poles installed (Progress Log #${num}).`,
                title: `Multi-Unit Residential Masonry Progress - Log #${num}`
            },
            {
                alt: `Overhead view of timber and steel roof structure framing on a low-cost residential housing development (Progress Log #${num}).`,
                title: `Residential Roof Structure Framing - Log #${num}`
            },
            {
                alt: `Near-complete single brick room with door and window openings plastered and ready for roof installation (Progress Log #${num}).`,
                title: `Near-Complete Brick Room & Openings - Log #${num}`
            },
            {
                alt: `Worker in PPE laying face-brick courses on a residential wall with mortar joints and scaffolding visible (Progress Log #${num}).`,
                title: `Face-Brick Laying & Mortar Coursework - Log #${num}`
            },
            {
                alt: `Aerial view of multiple low-rise residential brick wall units under simultaneous construction on a township housing project (Progress Log #${num}).`,
                title: `Township Housing Multi-Unit Construction Overview - Log #${num}`
            },
            {
                alt: `Residential brick walls approaching ring beam height with vertical scaffold poles and brick piers in place (Progress Log #${num}).`,
                title: `Ring Beam Level Masonry & Scaffold Setup - Log #${num}`
            },
            {
                alt: `Early-stage residential brickwork with foundation walls and scaffold poles positioned for wall construction (Progress Log #${num}).`,
                title: `Foundation Walls & Early Scaffold Positioning - Log #${num}`
            },
            {
                alt: `Geotagged progress photo of residential brick wall construction showing coursework and window opening formation (Progress Log #${num}).`,
                title: `Geotagged Residential Masonry Progress - Log #${num}`
            },
            {
                alt: `Advanced multi-unit residential brick walls with scaffolding nearing completion of superstructure on housing development (Progress Log #${num}).`,
                title: `Superstructure Completion & Multi-Unit Masonry - Log #${num}`
            },
            {
                alt: `Residential housing brick walls with concrete lintels installed over door and window openings, scaffolding retained (Progress Log #${num}).`,
                title: `Concrete Lintels & Residential Wall Openings - Log #${num}`
            },
        ];

        // Cycle through caption sets — avoids identical alt/title across 55 entries
        const caption = captionSets[num % captionSets.length];
        alt = caption.alt;
        title = caption.title;

        residentialData.push({
            src: `images/journal/building/residential/building-construction-work (${num}).jpeg`,
            alt: alt,
            title: title,
            category: 'residential',
            categoryName: 'Residential Building'
        });
    }

    // 3. Foundation Work: Concrete Casting (26 down to 1)
    for (let num = 26; num >= 1; num--) {
        let alt, title;
        if (num >= 18) {
            alt = `Civil engineering team pouring ready-mix concrete into foundation formwork and using mechanical vibrators for structural slab consolidation (Progress Log #${num}).`;
            title = `Concrete Slab Pouring & Formwork - Log #${num}`;
        } else if (num >= 9) {
            alt = `Precision leveling, surface floating, and finishing of the structural concrete floor slab on site (Progress Log #${num}).`;
            title = `Slab Leveling & Power Floating - Log #${num}`;
        } else {
            alt = `Curing structural concrete foundation plinth and inspecting load-bearing slab dimensions for compliance (Progress Log #${num}).`;
            title = `Concrete Curing & Quality Inspection - Log #${num}`;
        }
        foundationData.push({
            src: `images/journal/foundation/concrete-casting/foundation-work (${num}).jpeg`,
            alt: alt,
            title: title,
            category: 'foundation',
            categoryName: 'Foundation: Concrete Casting'
        });
    }

    // 3b. Foundation Work: Damp-Proofing & Reinforcement (38 down to 1)
    for (let num = 38; num >= 1; num--) {
        let alt, title;
        if (num >= 26) {
            alt = `Installing heavy-duty Damp Proof Course (DPC) plastic underlay membrane for sub-slab moisture protection (Progress Log #${num}).`;
            title = `Damp Proof Membrane (DPC) Installation - Log #${num}`;
        } else if (num >= 14) {
            alt = `Masonry specialists laying foundation plinth brickwork and placing reinforcing steel brickforce mesh (Progress Log #${num}).`;
            title = `Foundation Plinth Bricklaying - Log #${num}`;
        } else {
            alt = `Ironworkers tying high-tensile steel reinforcing rebar cages and mesh in excavated trenches (Progress Log #${num}).`;
            title = `Steel Rebar Reinforcement Tie-in - Log #${num}`;
        }
        foundationData.push({
            src: `images/journal/foundation/damp-proofing-and-reinforcement/foundation-work (${num}).jpeg`,
            alt: alt,
            title: title,
            category: 'foundation',
            categoryName: 'Foundation: Damp-proofing & Rebar'
        });
    }

    // 3c. Foundation Work: Earthworks & Platform Preparation (18 down to 1)
    for (let num = 18; num >= 1; num--) {
        let alt, title;
        if (num >= 12) {
            alt = `Bulk excavation, site clearing, and vegetation removal using heavy earthmoving machinery (Progress Log #${num}).`;
            title = `Bulk Excavation & Site Clearance - Log #${num}`;
        } else if (num >= 6) {
            alt = `Mechanical subgrade soil compaction and leveling to prepare a stable building platform to civil codes (Progress Log #${num}).`;
            title = `Subgrade Compaction & Platform Prep - Log #${num}`;
        } else {
            alt = `Excavated foundation trenches with structural profiles and line markings set up for geotechnical survey (Progress Log #${num}).`;
            title = `Foundation Trench Excavation - Log #${num}`;
        }
        foundationData.push({
            src: `images/journal/foundation/earthworks-and-platform-preparation/foundation-work (${num}).jpeg`,
            alt: alt,
            title: title,
            category: 'foundation',
            categoryName: 'Foundation: Earthworks & Prep'
        });
    }

    // 4. Surveying & Setup (12 down to 1)
    for (let num = 12; num >= 1; num--) {
        let alt, title;
        if (num === 1) {
            alt = "Makhaswa Holdings land surveyors mapping and marking boundary lines during initial site establishment.";
            title = "Initial Site Survey & Boundary Layout";
        } else if (num >= 2 && num <= 5) {
            alt = `Construction crew establishing site grids, profiles, and level datum lines (Progress Log #${num}).`;
            title = `Grid Layout & Levelling Benchmarks - Log #${num}`;
        } else if (num >= 6 && num <= 9) {
            alt = `Surveying equipment and pegging out coordinates for bulk excavation (Progress Log #${num}).`;
            title = `Bulk Excavation Surveying & Coordinates - Log #${num}`;
        } else {
            alt = `Final land surveying checks and site clearance verification before groundbreaking (Progress Log #${num}).`;
            title = `Pre-Excavation Site Layout Inspection - Log #${num}`;
        }
        surveyingData.push({
            src: `images/journal/surveying-and-setup/surveying-and-setup (${num}).jpeg`,
            alt: alt,
            title: title,
            category: 'surveying',
            categoryName: 'Surveying & Setup'
        });
    }

    // Combine in reverse chronological stage order (latest stages first)
    const IMAGES_DATA = [...commercialData, ...residentialData, ...foundationData, ...surveyingData];

    // ── State ──
    const ITEMS_PER_PAGE = 15;
    let currentDataset = IMAGES_DATA;
    let activeFilter = 'all';
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

        const totalItems = currentDataset.length;

        // Handle empty state
        if (totalItems === 0) {
            grid.innerHTML = '<div class="portfolio-empty-message" style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-light); font-weight: 600;">No progress photos found in this phase.</div>';
            if (countLabel) countLabel.textContent = '';
            updateLoadMoreButton();
            return;
        }

        const nextBatchSize = Math.min(ITEMS_PER_PAGE, totalItems - renderedCount);
        if (nextBatchSize <= 0) return;

        const batch = currentDataset.slice(renderedCount, renderedCount + nextBatchSize);
        batch.forEach((img, index) => {
            const globalIndex = renderedCount + index;
            const card = document.createElement('div');
            card.className = 'journal-card';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Open site progress entry log ${globalIndex + 1}`);

            card.innerHTML = `
                <div class="journal-card-media">
                    <img src="${img.src}" alt="${img.alt}" loading="lazy">
                </div>
                <div class="journal-card-footer">
                    <div class="journal-card-info">
                        <span class="journal-log-badge">LOG #${String(currentDataset.length - globalIndex).padStart(3, '0')}</span>
                        <span class="journal-cat-badge">${img.categoryName}</span>
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

        if (renderedCount < currentDataset.length) {
            const btn = document.createElement('button');
            btn.className = 'btn-load-more';
            btn.innerHTML = `
                <span>LOAD MORE UPDATES</span>
                <i data-lucide="arrow-down" width="16" height="16"></i>
            `;
            btn.addEventListener('click', () => {
                renderNextBatch();
            });
            loadMoreContainer.appendChild(btn);

            if (window.lucide) {
                window.lucide.createIcons();
            }
        } else if (currentDataset.length > 0) {
            const msg = document.createElement('div');
            msg.className = 'journal-end-message';
            msg.textContent = 'You have viewed all progress logs for this phase.';
            loadMoreContainer.appendChild(msg);
        }
    }

    // ── Category Filters Logic ──
    function setupFilters() {
        const filterContainer = document.getElementById('portfolio-filters');
        if (!filterContainer) return;

        filterContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;

            // Reset active states
            const buttons = filterContainer.querySelectorAll('.filter-btn');
            buttons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Apply filter value
            const filterValue = btn.getAttribute('data-filter');
            activeFilter = filterValue;

            if (activeFilter === 'all') {
                currentDataset = IMAGES_DATA;
            } else {
                currentDataset = IMAGES_DATA.filter(img => img.category === activeFilter);
            }

            // Reset and re-render grid
            if (grid) {
                grid.innerHTML = '';
            }
            renderedCount = 0;
            renderNextBatch();

            // Smooth scroll to top of grid
            if (grid) {
                const headerOffset = 100;
                const elementPosition = grid.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
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
        lightboxIndex = (lightboxIndex - 1 + currentDataset.length) % currentDataset.length;
        updateLightbox();
    }

    function showNext(e) {
        if (e) e.stopPropagation();
        lightboxIndex = (lightboxIndex + 1) % currentDataset.length;
        updateLightbox();
    }

    function updateLightbox() {
        if (!lbImg || !lbCap || !lbCounter) return;
        const img = currentDataset[lightboxIndex];

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

        const logId = String(currentDataset.length - lightboxIndex).padStart(3, '0');
        lbCap.innerHTML = `
            <div class="lightbox-caption-header">
                <span class="lightbox-log-badge">LOG #${logId}</span>
                <span class="lightbox-category">${img.categoryName}</span>
            </div>
            <p class="lightbox-caption-text">${img.title}</p>
        `;
        lbCounter.textContent = `${lightboxIndex + 1} / ${currentDataset.length}`;
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
    document.addEventListener('DOMContentLoaded', () => {
        setupFilters();
        renderNextBatch();
    });

    if (document.readyState !== 'loading') {
        setupFilters();
        renderNextBatch();
    }

})();
