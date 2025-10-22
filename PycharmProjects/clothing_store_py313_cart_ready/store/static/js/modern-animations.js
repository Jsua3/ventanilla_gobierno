/* ============================================
   ULTRA MODERN ANIMATIONS & INTERACTIONS
   Advanced JavaScript for Sports Store 2025
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // SMOOTH SCROLL REVEAL ANIMATIONS
    // ============================================

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-on-scroll');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ============================================
    // PARALLAX SCROLL EFFECT
    // ============================================

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');

        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // ============================================
    // HERO CAROUSEL ENHANCEMENT
    // ============================================

    const heroCarousel = document.querySelector('#heroCarousel');
    if (heroCarousel) {
        const carousel = new bootstrap.Carousel(heroCarousel, {
            interval: 6000,
            wrap: true,
            pause: false
        });

        // Add swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        heroCarousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        heroCarousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                carousel.next();
            }
            if (touchEndX > touchStartX + 50) {
                carousel.prev();
            }
        }
    }

    // ============================================
    // PRODUCT CARD 3D TILT EFFECT
    // ============================================

    const productCards = document.querySelectorAll('.ultra-product-card');

    productCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-15px)
                scale(1.03)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });

    // ============================================
    // CATEGORY CARDS MAGNETIC EFFECT
    // ============================================

    const categoryItems = document.querySelectorAll('.category-item');

    categoryItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            item.style.transform = `
                translate(${x * 0.1}px, ${y * 0.1}px)
                translateY(-15px)
            `;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translate(0, 0) translateY(0)';
        });
    });

    // ============================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // ANIMATED COUNTER FOR STATS
    // ============================================

    const animateCounter = (element, target, duration = 2000) => {
        let current = 0;
        const increment = target / (duration / 16);

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    };

    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const target = parseInt(entry.target.dataset.count);
                animateCounter(entry.target, target);
                entry.target.classList.add('counted');
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // ============================================
    // DYNAMIC CURSOR EFFECT (Desktop only)
    // ============================================

    if (window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);

        const cursorDot = document.createElement('div');
        cursorDot.classList.add('cursor-dot');
        document.body.appendChild(cursorDot);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Add hover effects
        const interactiveElements = document.querySelectorAll('a, button, .ultra-product-card, .category-item');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
            });
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
            });
        });
    }

    // ============================================
    // ADD TO CART ANIMATION
    // ============================================

    const addToCartButtons = document.querySelectorAll('.product-add-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Create particle effect
            for (let i = 0; i < 10; i++) {
                createParticle(e.clientX, e.clientY);
            }

            // Button animation
            button.style.transform = 'scale(0.8) rotate(90deg)';
            setTimeout(() => {
                button.style.transform = 'scale(1) rotate(0deg)';
                button.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-shopping-cart"></i>';
                }, 1500);
            }, 200);
        });
    });

    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.background = '#00D9FF';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '10000';
        particle.style.boxShadow = '0 0 10px #00D9FF';
        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 4;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        let posX = 0;
        let posY = 0;
        let opacity = 1;

        function animate() {
            posX += vx;
            posY += vy;
            opacity -= 0.02;

            particle.style.transform = `translate(${posX}px, ${posY}px)`;
            particle.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        }

        animate();
    }

    // ============================================
    // LAZY LOADING IMAGES WITH FADE IN
    // ============================================

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;

                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                    img.style.opacity = '0';

                    img.onload = () => {
                        img.style.transition = 'opacity 0.6s';
                        img.style.opacity = '1';
                    };
                }

                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });

    // ============================================
    // NEWSLETTER FORM ENHANCEMENT
    // ============================================

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const button = newsletterForm.querySelector('.newsletter-submit');
            const input = newsletterForm.querySelector('.newsletter-input');

            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.disabled = true;

            // Simulate API call
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-check"></i> ¡Suscrito!';
                input.value = '';

                setTimeout(() => {
                    button.innerHTML = 'Suscribirse';
                    button.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // ============================================
    // BACKGROUND GRADIENT ANIMATION
    // ============================================

    const createGradientAnimation = () => {
        const background = document.querySelector('.lg-background');
        if (!background) return;

        let hue = 0;

        setInterval(() => {
            hue = (hue + 0.5) % 360;
            background.style.filter = `hue-rotate(${hue}deg) saturate(1.2)`;
        }, 50);
    };

    // Uncomment to enable gradient animation
    // createGradientAnimation();

    // ============================================
    // PERFORMANCE OPTIMIZATION
    // ============================================

    // Debounce function for scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Optimize scroll events
    window.addEventListener('scroll', debounce(() => {
        // Scroll-based animations
        const scrolled = window.pageYOffset;
        const navbar = document.querySelector('.glass-navbar');

        if (navbar) {
            if (scrolled > 100) {
                navbar.style.background = 'rgba(0, 0, 0, 0.9)';
                navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
            } else {
                navbar.style.background = 'rgba(0, 0, 0, 0.6)';
                navbar.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.2)';
            }
        }
    }, 10));

    // ============================================
    // CONSOLE BRANDING
    // ============================================

    console.log('%c🏃‍♂️ Ultra Modern Sports Store 2025',
        'font-size: 20px; font-weight: bold; color: #00D9FF; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
    console.log('%cPowered by Advanced Liquid Glass Design',
        'font-size: 12px; color: #00A8CC;');

});

// ============================================
// CUSTOM CURSOR STYLES (injected dynamically)
// ============================================

const cursorStyles = document.createElement('style');
cursorStyles.textContent = `
    .custom-cursor {
        position: fixed;
        width: 40px;
        height: 40px;
        border: 2px solid rgba(0, 217, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transition: transform 0.2s, border-color 0.2s;
        transform: translate(-50%, -50%);
    }

    .cursor-dot {
        position: fixed;
        width: 6px;
        height: 6px;
        background: #00D9FF;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10001;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 10px rgba(0, 217, 255, 0.8);
    }

    .custom-cursor.cursor-hover {
        transform: translate(-50%, -50%) scale(1.5);
        border-color: #00D9FF;
        background: rgba(0, 217, 255, 0.1);
    }

    body {
        cursor: none;
    }

    @media (max-width: 768px) {
        body {
            cursor: default;
        }
        .custom-cursor,
        .cursor-dot {
            display: none;
        }
    }
`;
document.head.appendChild(cursorStyles);
