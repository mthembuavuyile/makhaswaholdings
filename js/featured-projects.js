document.addEventListener("DOMContentLoaded", () => {
    'use strict';

    const categoriesList = [
        { id: 'building', name: 'Building Construction & Housing Developments' },
        { id: 'civil', name: 'Civil Works & Infrastructure' },
        { id: 'earthworks', name: 'Earthworks & Site Prep' },
        { id: 'roads', name: 'Road Construction & Surfacing' }
    ];

    const grid = document.getElementById('featured-projects-grid');
    if (!grid) return;

    let featuredProjects = [];

    const fetchPromises = categoriesList.map(cat =>
        fetch(`projects/${cat.id}.json`)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to fetch ${cat.id}`);
                return response.json();
            })
            .then(data => ({ catId: cat.id, catName: cat.name, data }))
            .catch(err => {
                console.warn(err);
                return null;
            })
    );

    Promise.all(fetchPromises).then(results => {
        results.forEach(result => {
            if (result && result.data && Array.isArray(result.data.images)) {
                result.data.images.forEach(img => {
                    if (img.featured) {
                        featuredProjects.push({
                            ...img,
                            categoryId: result.catId,
                            categoryName: result.catName
                        });
                    }
                });
            }
        });

        // Take up to 6 featured projects
        featuredProjects = featuredProjects.slice(0, 6);

        renderFeaturedProjects();
    });

    function renderFeaturedProjects() {
        grid.innerHTML = '';
        
        if (featuredProjects.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No featured projects available.</p>';
            return;
        }

        featuredProjects.forEach(project => {
            const card = document.createElement('a');
            card.href = `projects.html?filter=${project.categoryId}`;
            card.className = 'project-card';
            card.setAttribute('aria-label', `View ${project.categoryName} projects`);

            card.innerHTML = `
                <div class="project-skeleton"></div>
                <img src="${project.src}" alt="${project.alt || project.title}" loading="lazy" width="600" height="400" style="opacity: 0; transition: opacity 0.4s ease;">
                <div class="project-overlay">
                    <span>${project.categoryName}</span>
                    <h4>${project.title}</h4>
                </div>
            `;

            const imgEl = card.querySelector('img');
            const skeletonEl = card.querySelector('.project-skeleton');

            imgEl.onload = () => {
                if (skeletonEl) skeletonEl.style.display = 'none';
                imgEl.style.opacity = '1';
            };

            grid.appendChild(card);
        });
    }
});
