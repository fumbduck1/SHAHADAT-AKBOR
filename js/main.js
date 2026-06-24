/**
 * Shahadat Akbor - Professional Portfolio
 * JavaScript with GSAP Animations
 * 
 * Features:
 * - Mobile navigation with slide panel
 * - GSAP scroll animations (respects prefers-reduced-motion)
 * - Counter animations with IntersectionObserver
 * - Toast notifications
 * - Back-to-top button
 * - Magnetic button hover effects (throttled with rAF)
 * 
 * @see https://shahadatakbor.com
 */



// ========================================
// GSAP INITIALIZATION
// ========================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// ========================================
// DOM ELEMENTS
// ========================================
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const header = document.getElementById('header');
const navOverlay = document.getElementById('nav-overlay');

// Set initial ARIA states for nav toggle/close
if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
if (navClose) navClose.setAttribute('aria-expanded', 'false');

// ========================================
// MOBILE NAVIGATION
// ========================================

// Create overlay element if it doesn't exist
function createOverlay() {
    if (!document.getElementById('nav-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'nav-overlay';
        overlay.className = 'nav__overlay';
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', closeMenu);
    }
}

// Show menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        createOverlay();
        const overlay = document.getElementById('nav-overlay');
        if (overlay) overlay.classList.add('active');
        navMenu.classList.add('active');
        if (header) header.classList.add('nav-open');
        navToggle.setAttribute('aria-expanded', 'true');
        if (navClose) navClose.setAttribute('aria-expanded', 'true');
        navMenu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    });
}

// Close menu
function closeMenu() {
    const overlay = document.getElementById('nav-overlay');
    if (navMenu) navMenu.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    if (header) header.classList.remove('nav-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    if (navClose) navClose.setAttribute('aria-expanded', 'false');
    if (navMenu) navMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

if (navClose) {
    navClose.addEventListener('click', closeMenu);
}

// Close menu when clicking on nav links
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMenu();
        }
    }
});

// ========================================
// HERO ANIMATIONS
// ========================================

if (typeof gsap !== 'undefined') {
    // Hero entrance animation — NO opacity, only subtle slide
    const heroTimeline = gsap.timeline();
    
    const heroBadge = document.querySelector('.hero__badge');
    const heroTitle = document.querySelector('.hero__title');
    const heroSubtitle = document.querySelector('.hero__subtitle');
    const heroActions = document.querySelector('.hero__actions');
    const heroImage = document.querySelector('.hero__image-wrapper');
    
    if (heroBadge) heroTimeline.from(heroBadge, { y: 15, duration: 0.5, ease: 'power2.out' });
    if (heroTitle) heroTimeline.from(heroTitle, { y: 20, duration: 0.6, ease: 'power2.out' }, '-=0.3');
    if (heroSubtitle) heroTimeline.from(heroSubtitle, { y: 15, duration: 0.5, ease: 'power2.out' }, '-=0.3');
    if (heroActions) heroTimeline.from(heroActions, { y: 15, duration: 0.5, ease: 'power2.out' }, '-=0.3');
    if (heroImage) heroTimeline.from(heroImage, { y: 20, duration: 0.6, ease: 'power2.out' }, '-=0.4');
}

// ========================================
// SCROLL REVEAL ANIMATIONS (Seizure-Safe)
// ========================================
// No opacity animations — only subtle translate on scroll
// All elements remain visible at all times

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    const revealElements = document.querySelectorAll(
        '.bento__item, .skill-card, .achievement-card, ' +
        '.contact__item, .timeline__item, .about__card, .resume__section, ' +
        '.project-card, .hero__metric, .snapshot__card'
    );

    revealElements.forEach((element) => {
        // Only animate elements below the fold
        const rect = element.getBoundingClientRect();
        if (rect.top > window.innerHeight) {
            gsap.fromTo(element, 
                { y: 30 },
                {
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    },
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                }
            );
        }
    });

    // ========================================
    // COUNTER ANIMATIONS (Seizure-Safe)
    // ========================================

    const counterElements = document.querySelectorAll('[data-target]');

    counterElements.forEach((element, index) => {
        // Skip animation if user prefers reduced motion
        if (prefersReducedMotion) {
            const target = parseFloat(element.getAttribute('data-target'));
            const suffix = element.getAttribute('data-suffix') || '';
            const isDecimal = element.getAttribute('data-target').includes('.');
            element.textContent = isDecimal ? target.toFixed(1) + suffix : target.toLocaleString() + suffix;
            return;
        }
        const targetStr = element.getAttribute('data-target');
        const target = parseFloat(targetStr);
        const suffix = element.getAttribute('data-suffix') || '';
        const isDecimal = targetStr.includes('.');
        let hasAnimated = false;
        
        // Set initial display
        element.textContent = '0' + suffix;
        
        const animateCounter = () => {
            if (hasAnimated) return;
            hasAnimated = true;
            
            const obj = { val: 0 };
            gsap.to(obj, {
                val: target,
                duration: 2.5,
                delay: index * 0.15,
                ease: 'power2.out',
                onUpdate: function() {
                    if (isDecimal) {
                        element.textContent = obj.val.toFixed(1) + suffix;
                    } else {
                        element.textContent = Math.round(obj.val).toLocaleString() + suffix;
                    }
                },
                onComplete: function() {
                    if (isDecimal) {
                        element.textContent = target.toFixed(1) + suffix;
                    } else {
                        element.textContent = target.toLocaleString() + suffix;
                    }
                }
            });
        };

        // For hero metrics (visible on load), animate after short delay
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            // Element is in viewport on load — animate after hero loads
            gsap.delayedCall(0.8 + index * 0.15, animateCounter);
        } else {
            // Element is below fold — use ScrollTrigger
            ScrollTrigger.create({
                trigger: element,
                start: 'top 85%',
                once: true,
                onEnter: animateCounter
            });
        }
    });

    // ========================================
    // BENTO GRID ANIMATIONS (Seizure-Safe)
    // ========================================

    const bentoGrid = document.querySelector('.bento__grid');
    if (bentoGrid) {
        gsap.from('.bento__item', {
            scrollTrigger: {
                trigger: '.bento__grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 30,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out'
        });
    }

    // ========================================
    // PROJECT CARDS ANIMATION (Seizure-Safe)
    // ========================================

    const projectsGrid = document.querySelector('.projects__grid');
    if (projectsGrid) {
        gsap.from('.project-card', {
            scrollTrigger: {
                trigger: '.projects__grid',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 25,
            duration: 0.5,
            stagger: 0.15,
            ease: 'power2.out'
        });
    }

    // ========================================
    // SKILL CARDS ANIMATION (Seizure-Safe)
    // ========================================

    const skillsGrid = document.querySelector('.skills__grid');
    if (skillsGrid) {
        gsap.from('.skill-card', {
            scrollTrigger: {
                trigger: '.skills__grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 20,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out'
        });
    }

    // ========================================
    // ACHIEVEMENT CARDS ANIMATION (Seizure-Safe)
    // ========================================

    const achievementsGrid = document.querySelector('.achievements__grid');
    if (achievementsGrid) {
        gsap.from('.achievement-card', {
            scrollTrigger: {
                trigger: '.achievements__grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 20,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out'
        });
    }

    // ========================================
    // TIMELINE ANIMATION (Seizure-Safe)
    // ========================================

    const timeline = document.querySelector('.timeline');
    if (timeline) {
        gsap.from('.timeline__item', {
            scrollTrigger: {
                trigger: '.timeline',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            x: -20,
            duration: 0.5,
            stagger: 0.15,
            ease: 'power2.out'
        });
    }

    // ========================================
    // CONTACT ITEMS ANIMATION (Seizure-Safe)
    // ========================================

    const contactItems = document.querySelector('.contact__items');
    if (contactItems) {
        gsap.from('.contact__item', {
            scrollTrigger: {
                trigger: '.contact__items',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            x: -20,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out'
        });
    }

    // ========================================
    // PAGE HEADER ANIMATION (Seizure-Safe)
    // ========================================

    const pageHeaderTitle = document.querySelector('.page-header__title');
    const pageHeaderSubtitle = document.querySelector('.page-header__subtitle');
    
    if (pageHeaderTitle) {
        gsap.from(pageHeaderTitle, {
            y: 20,
            duration: 0.6,
            ease: 'power2.out'
        });
    }
    
    if (pageHeaderSubtitle) {
        gsap.from(pageHeaderSubtitle, {
            y: 15,
            duration: 0.5,
            ease: 'power2.out',
            delay: 0.15
        });
    }

    // ========================================
    // PARALLAX EFFECTS (Seizure-Safe)
    // ========================================

    const heroImageWrapper = document.querySelector('.hero__image-wrapper');
    if (heroImageWrapper) {
        gsap.to('.hero__image-wrapper', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: 50,
            ease: 'none'
        });
    }
}

// ========================================
// HEADER SCROLL EFFECT
// ========================================

// P5: CSS class toggle instead of GSAP layout-thrashing boxShadow changes
let lastScroll = 0;
let headerScrollTicking = false;
window.addEventListener('scroll', () => {
    if (headerScrollTicking) return;
    headerScrollTicking = true;
    requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;
        
    if (header || navMenu) {
        if (currentScroll > 100) {
            if (header) header.classList.add('scrolled');
            if (navMenu) navMenu.classList.add('scrolled');
        } else {
            if (header) header.classList.remove('scrolled');
            if (navMenu) navMenu.classList.remove('scrolled');
        }
    }
        
        lastScroll = currentScroll;
        headerScrollTicking = false;
    });
}, { passive: true }); // P6: passive listener for better scroll performance

// ========================================
// ACTIVE NAVIGATION LINK
// ========================================

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Set active on both slide panel links AND quick-access links
    const allNavLinks = document.querySelectorAll('.nav__link');
    allNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Run on page load
document.addEventListener('DOMContentLoaded', setActiveNavLink);

// ========================================
// NOTIFICATION SYSTEM
// ========================================

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    const messageSpan = document.createElement('span');
    messageSpan.className = 'notification__message';
    messageSpan.textContent = message;
    const closeBtnEl = document.createElement('button');
    closeBtnEl.className = 'notification__close';
    closeBtnEl.textContent = '\u00d7';
    closeBtnEl.setAttribute('aria-label', 'Close notification');
    notification.appendChild(messageSpan);
    notification.appendChild(closeBtnEl);
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 12px;
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: 'Space Grotesk', sans-serif;
        max-width: 90%;
    `;
    
    document.body.appendChild(notification);
    
    // Animate notification entrance
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(notification, 
            { x: 100, opacity: 0 }, 
            { x: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
        );
    }
    
    // Close button styles
    closeBtnEl.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        margin-left: 8px;
    `;
    
    closeBtnEl.addEventListener('click', () => {
        if (typeof gsap !== 'undefined') {
            gsap.to(notification, {
                x: 100,
                opacity: 0,
                duration: 0.3,
                onComplete: () => notification.remove()
            });
        } else {
            notification.remove();
        }
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            if (typeof gsap !== 'undefined') {
                gsap.to(notification, {
                    x: 100,
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => notification.remove()
                });
            } else {
                notification.remove();
            }
        }
    }, 5000);
}

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target && typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
            gsap.to(window, {
                scrollTo: { y: target, offsetY: 80 },
                duration: 1,
                ease: 'power3.inOut'
            });
        } else if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========================================
// LOADING STATE
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});

// ========================================
// KEYBOARD NAVIGATION
// ========================================

document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        closeMenu();
    }
});

// ========================================
// PROJECT MODAL ACCESSIBILITY
// ========================================

document.querySelectorAll('.project-modal').forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close');
    
    // Close on Escape key
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    });
    
    // Close button accessibility
    if (closeBtn) {
        closeBtn.setAttribute('aria-label', 'Close project details');
        closeBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Close when clicking outside modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    });
});

// Focus trap for modals
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const activeModal = document.querySelector('.project-modal.active');
    if (!activeModal) return;
    
    const focusable = activeModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;
    
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
});

// ========================================
// PRINT FUNCTIONALITY
// ========================================

function printResume() {
    window.print();
}

// ========================================
// BACK TO TOP BUTTON
// ========================================

function createBackToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '&#8593;';
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Back to top');
    button.setAttribute('role', 'button');
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: #0f172a;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 20px;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 999;
    `;
    
    document.body.appendChild(button);
    
    // Show/hide button based on scroll position
    let backToTopTicking = false;
    window.addEventListener('scroll', () => {
        if (backToTopTicking) return;
        backToTopTicking = true;
        requestAnimationFrame(() => {
            if (window.pageYOffset > 300) {
                button.style.display = 'flex';
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(button, 
                        { scale: 0 }, 
                        { scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
                    );
                }
            } else {
                if (typeof gsap !== 'undefined') {
                    gsap.to(button, {
                        scale: 0,
                        duration: 0.2,
                        onComplete: () => button.style.display = 'none'
                    });
                } else {
                    button.style.display = 'none';
                }
            }
            backToTopTicking = false;
        });
    });
    
    // Scroll to top when clicked
    button.addEventListener('click', () => {
        if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
            gsap.to(window, {
                scrollTo: { y: 0 },
                duration: 1,
                ease: 'power3.inOut'
            });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    
    // Hover effect
    button.addEventListener('mouseenter', () => {
        if (typeof gsap !== 'undefined') {
            gsap.to(button, {
                backgroundColor: '#1d4ed8',
                scale: 1.1,
                duration: 0.2
            });
        }
    });
    
    button.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
            gsap.to(button, {
                backgroundColor: '#0f172a',
                scale: 1,
                duration: 0.2
            });
        }
    });
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', createBackToTopButton);

// ========================================
// LAZY LOADING FOR IMAGES
// ========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// MAGNETIC BUTTONS (throttled with rAF)
// ========================================

document.querySelectorAll('.btn').forEach(button => {
    let magneticActive = false;
    
    button.addEventListener('mousemove', (e) => {
        if (magneticActive) return;
        magneticActive = true;
        requestAnimationFrame(() => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            if (typeof gsap !== 'undefined') {
                gsap.to(button, {
                    x: x * 0.2,
                    y: y * 0.2,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
            magneticActive = false;
        });
    });
    
    button.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        }
    });
});

// ========================================
// CONSOLE MESSAGE
// ========================================

console.log(`
╔══════════════════════════════════════════════════════════════╗
║  Shahadat Akbor - Professional Portfolio                    ║
║  Built with HTML, CSS & JavaScript + GSAP                   ║
║                                                              ║
║  Contact: shahadatakbor9@gmail.com                          ║
║  Phone: +8801839629328                                      ║
╚══════════════════════════════════════════════════════════════╝
`);