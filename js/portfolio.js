/* =====================================================
   MAKHASWA HOLDINGS — PORTFOLIO.JS
   Handles dynamic loading, rendering, filtering,
   and lightbox display of projects.
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const jsonUrl = 'projects/data.json';

    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch projects data: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const mainGrid = document.getElementById('projects-grid');
            if (mainGrid) {
                renderMainGrid(data, mainGrid);
                setupFilters();
                setupLightbox();
                checkURLFilter();
            }
        })
        .catch(err => {
            console.error('Error loading portfolio:', err);
        });
});

/**
 * Renders all projects in the main grid
 */
function renderMainGrid(data, grid) {
    grid.innerHTML = '';
    const categories = data.categories;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    Object.keys(categories).forEach(catId => {
        const cat = categories[catId];
        cat.images.forEach(img => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('data-category', catId);
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `View image: ${img.title}`);
            
            // Set initial style for IntersectionObserver fade-in
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

            card.innerHTML = `
                <img src="${img.src}" alt="${img.alt}" loading="lazy" width="600" height="400">
                <div class="project-overlay">
                    <span>${cat.title}</span>
                    <h4>${img.title}</h4>
                </div>
            `;
            
            grid.appendChild(card);
            observer.observe(card);
        });
    });
}

/**
 * Sets up event listeners for category filter buttons
 */
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button classes
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            const projectCards = document.querySelectorAll('.projects-grid .project-card');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'block';
                    // Frame delay to trigger CSS transition opacity
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    // Wait for the opacity animation (250ms) before changing display to none
                    setTimeout(() => {
                        if (card.style.opacity === '0') {
                            card.style.display = 'none';
                        }
                    }, 250);
                }
            });
        });
    });
}

/**
 * Checks for a '?filter=' query parameter in the URL and triggers filter
 */
function checkURLFilter() {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam) {
        const targetBtn = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
        if (targetBtn) {
            // Slight delay to allow DOM/IntersectionObserver rendering to align
            setTimeout(() => {
                targetBtn.click();
            }, 100);
        }
    }
}

/**
 * Sets up the premium lightbox modal with dynamic visibility filtering
 */
function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCap = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close-btn');
    const prevBtn = document.getElementById('lightbox-prev-btn');
    const nextBtn = document.getElementById('lightbox-next-btn');

    if (!lightbox || !lightboxImg || !lightboxCap) return;

    let currentIndex = 0;
    let visibleImages = [];

    // Open Lightbox
    const openLightbox = (index, imagesList) => {
        currentIndex = index;
        visibleImages = imagesList;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    };

    // Close Lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Previous Image
    const showPrev = (e) => {
        if (e) e.stopPropagation();
        if (visibleImages.length === 0) return;
        currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
        updateLightboxImage();
    };

    // Next Image
    const showNext = (e) => {
        if (e) e.stopPropagation();
        if (visibleImages.length === 0) return;
        currentIndex = (currentIndex + 1) % visibleImages.length;
        updateLightboxImage();
    };

    // Update Image in Lightbox
    const updateLightboxImage = () => {
        const currentImg = visibleImages[currentIndex];
        lightboxImg.src = currentImg.src;
        lightboxImg.alt = currentImg.alt;
        lightboxCap.innerHTML = `
            <strong style="color: var(--gold); text-transform: uppercase; letter-spacing: 1px; display: block; font-size: 11px; margin-bottom: 6px;">
                ${currentImg.category}
            </strong>
            ${currentImg.title}
        `;
    };

    // Card click events (setup delegation or card list query)
    document.getElementById('projects-grid').addEventListener('click', (e) => {
        const card = e.target.closest('.project-card');
        if (!card) return;

        // Query only visible cards at the moment of click
        const visibleCards = Array.from(document.querySelectorAll('.project-card'))
            .filter(c => c.style.display !== 'none');

        const imagesList = visibleCards.map(c => {
            const imgEl = c.querySelector('img');
            const catEl = c.querySelector('.project-overlay span');
            const titleEl = c.querySelector('.project-overlay h4');
            return {
                src: imgEl.src,
                alt: imgEl.alt,
                category: catEl ? catEl.textContent : '',
                title: titleEl ? titleEl.textContent : ''
            };
        });

        const index = visibleCards.indexOf(card);
        if (index !== -1) {
            openLightbox(index, imagesList);
        }
    });

    // Support keyboard activation (Enter key)
    document.getElementById('projects-grid').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const card = e.target.closest('.project-card');
            if (card) {
                card.click();
            }
        }
    });

    // Button controls
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    // Background click to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        } else if (e.key === 'ArrowRight') {
            showNext();
        }
    });

    // Touch Swipe navigation for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            showNext();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            showPrev();
        }
    };
}
