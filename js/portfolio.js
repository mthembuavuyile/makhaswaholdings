/* =====================================================
   MAKHASWA HOLDINGS — PORTFOLIO.JS
   Handles dynamic loading, rendering, and filtering
   of projects from projects/data.json.
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const prefix = getPathPrefix();
    const jsonUrl = prefix ? 'data.json' : 'projects/data.json';

    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch projects data: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // 1. Determine if we are on the main portfolio page (projects.html)
            const mainGrid = document.getElementById('projects-grid');
            if (mainGrid) {
                renderMainGrid(data, mainGrid);
                setupFilters();
            }

            // 2. Determine if we are on a category landing page
            const categoryGallery = document.getElementById('category-gallery');
            if (categoryGallery) {
                const categoryId = categoryGallery.getAttribute('data-category');
                renderCategoryGallery(data, categoryGallery, categoryId, prefix);
            }
        })
        .catch(err => {
            console.error('Error loading portfolio:', err);
        });
});

/**
 * Helper to determine path prefix (../ for files in /projects/)
 */
function getPathPrefix() {
    const path = window.location.pathname;
    if (path.toLowerCase().includes('/projects/')) {
        return '../';
    }
    return '';
}

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
            const card = document.createElement('a');
            card.href = `projects/${cat.slug}`;
            card.className = 'project-card';
            card.setAttribute('data-category', catId);
            
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
 * Renders the 9 specific images for a given category landing page
 */
function renderCategoryGallery(data, gallery, categoryId, prefix) {
    gallery.innerHTML = '';
    const cat = data.categories[categoryId];
    
    if (!cat) {
        console.error(`Category data not found for: ${categoryId}`);
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cat.images.forEach(img => {
        const item = document.createElement('div');
        item.className = 'project-gallery-item';
        
        // Set initial style for IntersectionObserver fade-in
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        // Prepend path prefix to the image source (e.g. '../')
        const imgSrc = prefix + img.src;

        item.innerHTML = `
            <img src="${imgSrc}" alt="${img.alt}" loading="lazy" width="600" height="400">
        `;
        
        gallery.appendChild(item);
        observer.observe(item);
    });
}
