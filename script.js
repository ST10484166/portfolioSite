// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Grid item tilt effect (only on home page)
const gridItems = document.querySelectorAll('.grid-item');

gridItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = '';
    });
});

// Form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // In production, this would send to your backend
        // For demo purposes, we'll just show a success message
        alert(`Thank you ${name}! We've received your message and will respond to ${email}.`);
        
        contactForm.reset();
    });
}

// Load header and footer, then set active navigation
async function loadComponents() {
    try {
        // Determine if we're in a subdirectory (like blog/)
        const currentPath = window.location.pathname;
        const pathPrefix = currentPath.includes('/blog/') ? '../' : '';

        // Load header
        const headerResponse = await fetch(pathPrefix + 'header.html');
        const headerHTML = await headerResponse.text();
        document.body.insertAdjacentHTML('afterbegin', headerHTML);

        // Load footer
        const footerResponse = await fetch(pathPrefix + 'footer.html');
        const footerHTML = await footerResponse.text();
        document.body.insertAdjacentHTML('beforeend', footerHTML);

        // Load related articles (blog pages only)
        const relatedContainer = document.getElementById('related-articles');
        if (relatedContainer) {
            const relatedResponse = await fetch('related-articles.html');
            const relatedHTML = await relatedResponse.text();
            relatedContainer.innerHTML = relatedHTML;

            // Hide the card that links to the current page
            const currentFile = window.location.pathname.split('/').pop();
            const cards = relatedContainer.querySelectorAll('.blog-card-link');
            cards.forEach(link => {
                if (link.getAttribute('href') === currentFile) {
                    link.closest('.blog-card').style.display = 'none';
                }
            });
        }

        // Set active navigation state
        setActiveNav();
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

// Determine which page we're on and set active class
function setActiveNav() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop().replace('.html', '') || 'index';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('data-page');

        // Handle index.html or root
        if ((currentPage === 'index' || currentPage === '') && linkPage === 'home') {
            link.classList.add('active');
        }
        // Handle blog pages (any page in /blog/ directory)
        else if (currentPath.includes('/blog/') && linkPage === 'blog') {
            link.classList.add('active');
        }
        // Handle other pages
        else if (currentPage === linkPage) {
            link.classList.add('active');
        }
        // Handle projects.html -> "Work" nav
        else if (currentPage === 'projects' && linkPage === 'projects') {
            link.classList.add('active');
        }
        // Handle about.html -> "Company" nav
        else if (currentPage === 'about' && linkPage === 'about') {
            link.classList.add('active');
        }
    });
}

// Smooth scroll for internal links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Category filtering for blog listing page
function initBlogFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;

            // Filter cards
            blogCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    initBlogFilters();
});