// Smooth Scroll Function
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupContactForm();
    animateCounters();
    setupServiceWorker();
    addAnimationObservers();
    setupPortfolioFilters();
});

// Setup Navigation
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu?.classList.remove('active');
        });
    });

    // Smooth nav on scroll
    let lastScrollTop = 0;
    const nav = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        if (scrollTop > 100) {
            nav?.classList.add('scrolled');
        } else {
            nav?.classList.remove('scrolled');
        }
    });
}

// Setup Contact Form
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            console.log('Formulario enviado:', Object.fromEntries(formData));
            showNotification('✅ Mensaje enviado correctamente!', 'success');
            contactForm.reset();
            
            // Simulación de envío
            setTimeout(() => {
                showNotification('📧 Nos pondremos en contacto pronto', 'info');
            }, 1500);
        });
    }
}

// Animate Counters
function animateCounters() {
    const stats = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const count = parseInt(target.dataset.count);
                let current = 0;
                const increment = count / 50;
                const duration = 2000;
                const steps = 50;
                const stepDuration = duration / steps;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= count) {
                        target.textContent = count.toLocaleString();
                        clearInterval(timer);
                    } else {
                        target.textContent = Math.floor(current).toLocaleString();
                    }
                }, stepDuration);

                observer.unobserve(target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}

// Enhanced Notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : '#3B82F6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        animation: slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        font-weight: 500;
        backdrop-filter: blur(10px);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3500);
}

// Add Animation Observers
function addAnimationObservers() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.8s ease-out`;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .portfolio-item, .stat-card').forEach(el => {
        observer.observe(el);
    });
}

// Setup Service Worker for PWA
function setupServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('✓ Service Worker registrado');
            })
            .catch(() => {
                console.log('Service Worker no disponible');
            });
    }
}

// Setup Portfolio Filters
function setupPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioProjects = document.querySelectorAll('.portfolio-project');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            // Filter projects
            portfolioProjects.forEach(project => {
                const category = project.dataset.category;
                
                if (filter === 'all' || filter === category) {
                    project.style.opacity = '0';
                    project.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'scale(1)';
                            project.style.transition = 'all 0.4s ease';
                        }, 10);
                    }, 10);
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });
}

// Add Mobile Menu Styles
const mobileMenuStyles = document.createElement('style');
mobileMenuStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .nav-menu {
        display: flex;
    }

    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 60px;
            right: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            flex-direction: column;
            gap: 1rem;
            padding: 2rem;
            width: 100%;
            border-radius: 0 0 20px 20px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .nav-menu.active {
            max-height: 500px;
        }

        .nav-link {
            padding: 0.75rem 0;
            font-size: 1.1rem;
        }
    }
`;
document.head.appendChild(mobileMenuStyles);

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) navMenu.classList.remove('active');
    }
});

// Parallax Effect
window.addEventListener('scroll', () => {
    const phoneScreen = document.querySelector('.phone-mockup');
    if (phoneScreen) {
        const scrollPosition = window.scrollY;
        phoneScreen.style.transform = `translateY(${scrollPosition * 0.3}px)`;
    }
});

// Dark Mode Detection (Optional)
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    console.log('🌙 Modo oscuro preferido (puede implementarse)');
}

// Console Easter Egg
console.log('%c🎨 Creative Studio - Diseño Digital Innovador', 'color: #4F46E5; font-size: 18px; font-weight: bold;');
console.log('%c✨ Hecho con creatividad y pasión por el diseño digital', 'color: #7C3AED; font-size: 12px;');
console.log('%c📱 Responsive, moderno y estilo iOS', 'color: #EC4899; font-size: 12px;');
