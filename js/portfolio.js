/* =====================================================
   MAKHASWA HOLDINGS — PORTFOLIO.JS
   Handles dynamic loading, rendering, progressive filtering,
   pagination, and lightbox display of 200+ projects/journal images.
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    'use strict';

    const jsonUrl = 'projects/data.json';
    const ITEMS_PER_PAGE = 15;

    // State variables
    let allImages = [];       // Complete consolidated dataset
    let currentDataset = [];  // Filtered subset currently active
    let renderedCount = 0;    // Number of images currently rendered in grid
    let lightboxIndex = 0;    // Current active index in the lightbox

    // DOM Elements
    const grid = document.getElementById('projects-grid');
    const paginationContainer = document.getElementById('projects-pagination');
    const countLabel = document.getElementById('projects-count');
    const filterWrapper = document.querySelector('.portfolio-filter-wrapper');

    // Lightbox DOM Elements
    let lightbox = null;
    let lbImg = null;
    let lbCap = null;
    let lbCounter = null;
    let lbClose = null;
    let lbPrev = null;
    let lbNext = null;

    // Fetch and initialize
    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch projects data: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (!grid) return;

            // Flatten JSON data into allImages array
            const categories = data.categories;
            Object.keys(categories).forEach(catId => {
                const cat = categories[catId];
                cat.images.forEach(img => {
                    allImages.push({
                        src: img.src,
                        alt: img.alt,
                        title: img.title,
                        categoryId: catId,
                        categoryName: cat.title
                    });
                });
            });

            // Set default dataset
            currentDataset = allImages;

            // Setup components
            setupLightbox();
            setupFilters();
            checkURLFilter();
            renderNextBatch();
        })
        .catch(err => {
            console.error('Error loading portfolio:', err);
        });

    // Intersection Observer for fade-in animation
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

    // Render next batch of items
    function renderNextBatch() {
        if (!grid) return;

        const totalItems = currentDataset.length;

        // Handle empty state
        if (totalItems === 0) {
            grid.innerHTML = '<div class="portfolio-empty-message" style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-light); font-weight: 600;">No projects found in this category.</div>';
            if (countLabel) countLabel.textContent = '';
            updatePaginationControls();
            return;
        }

        const nextBatchSize = Math.min(ITEMS_PER_PAGE, totalItems - renderedCount);
        if (nextBatchSize <= 0) return;

        const batch = currentDataset.slice(renderedCount, renderedCount + nextBatchSize);
        batch.forEach((img, index) => {
            const globalIndex = renderedCount + index;
            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Open project image: ${img.title}`);
            
            // Set initial styles for fade-in
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';

            card.innerHTML = `
                <img src="${img.src}" alt="${img.alt}" loading="lazy" width="600" height="400">
                <div class="project-overlay">
                    <span>${img.categoryName}</span>
                    <h4>${img.title}</h4>
                </div>
            `;

            // Click and keyboard logic
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

        // Re-initialize Lucide Icons if loaded
        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Update count label
        if (countLabel) {
            countLabel.textContent = `Showing 1–${renderedCount} of ${totalItems} projects`;
        }

        updatePaginationControls();
    }

    // Load More pagination controls builder
    function updatePaginationControls() {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';

        if (renderedCount < currentDataset.length) {
            const btn = document.createElement('button');
            btn.className = 'btn-load-more';
            btn.innerHTML = `
                <span>LOAD MORE PROJECTS</span>
                <i data-lucide="arrow-down" width="16" height="16"></i>
            `;
            btn.addEventListener('click', () => {
                renderNextBatch();
            });
            paginationContainer.appendChild(btn);

            if (window.lucide) {
                window.lucide.createIcons();
            }
        } else if (currentDataset.length > 0) {
            const msg = document.createElement('div');
            msg.className = 'journal-end-message';
            msg.textContent = 'You have viewed all projects in this category.';
            paginationContainer.appendChild(msg);
        }
    }

    // Category filters logic
    function setupFilters() {
        if (!filterWrapper) return;

        filterWrapper.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;

            // Reset active states
            const buttons = filterWrapper.querySelectorAll('.filter-btn');
            buttons.forEach(b => {
                b.classList.remove('active');
                b.removeAttribute('aria-selected');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Apply filter value
            const filterValue = btn.getAttribute('data-filter');
            
            if (filterValue === 'all') {
                currentDataset = allImages;
            } else {
                currentDataset = allImages.filter(img => img.categoryId === filterValue);
            }

            // Reset grid & count
            if (grid) {
                grid.innerHTML = '';
            }
            renderedCount = 0;
            renderNextBatch();

            // Smooth scroll to top of grid
            if (grid) {
                const headerOffset = 120;
                const elementPosition = grid.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Check for '?filter=' in the URL
    function checkURLFilter() {
        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter');
        if (filterParam && filterWrapper) {
            const targetBtn = filterWrapper.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
            if (targetBtn) {
                setTimeout(() => {
                    targetBtn.click();
                }, 100);
            }
        }
    }

    // Lightbox modal setup
    function setupLightbox() {
        lightbox = document.getElementById('lightbox');
        lbImg = document.getElementById('lightbox-img');
        lbCap = document.getElementById('lightbox-caption');
        lbCounter = document.getElementById('lightbox-counter');
        lbClose = document.getElementById('lightbox-close-btn');
        lbPrev = document.getElementById('lightbox-prev-btn');
        lbNext = document.getElementById('lightbox-next-btn');

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
    }

    // Lightbox controls
    function openLightbox(index) {
        if (!lightbox) return;
        lightboxIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
        if (lbImg) lbImg.focus();
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scrolling
    }

    function showPrev(e) {
        if (e) e.stopPropagation();
        lightboxIndex = (lightboxIndex - 1 + renderedCount) % renderedCount;
        updateLightbox();
    }

    function showNext(e) {
        if (e) e.stopPropagation();
        lightboxIndex = (lightboxIndex + 1) % renderedCount;
        updateLightbox();
    }

    function updateLightbox() {
        if (!lbImg || !lbCap || !lbCounter) return;
        const img = currentDataset[lightboxIndex];

        // Hide image while loading next to prevent flash
        lbImg.style.opacity = '0';

        // Load image
        lbImg.src = img.src;
        lbImg.alt = img.alt;

        lbImg.onload = () => {
            lbImg.style.opacity = '1';
        };

        if (lbImg.complete) {
            lbImg.style.opacity = '1';
        }

        // Setup badge and title
        lbCap.innerHTML = `
            <div class="lightbox-caption-header">
                <span class="lightbox-log-badge">PROJECT</span>
                <span class="lightbox-category">${img.categoryName}</span>
            </div>
            <p class="lightbox-caption-text">${img.title}</p>
        `;
        lbCounter.textContent = `${lightboxIndex + 1} / ${renderedCount}`;
    }

});
