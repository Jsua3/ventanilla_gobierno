'use strict';

/**
 * WEISS ENHANCEMENTS
 * JavaScript adaptado de home.jsx para Django templates
 */

class WeissEnhancements {
  constructor() {
    this.videoCarousel = null;
    this.isCarouselPaused = false;
    this.carouselAnimationFrame = null;
  }

  /**
   * Inicializar todas las mejoras
   */
  init() {
    this.initVideoCarousel();
    this.initGlowEffects();
    this.initServiceCards();
    this.initProductCards();
    this.initScrollAnimations();

    console.log('✅ WEISS Enhancements initialized');
  }

  /**
   * Carrusel de Videos Auto-Scroll (Adaptado de home.jsx)
   */
  initVideoCarousel() {
    const carousel = document.getElementById('video-carousel');
    if (!carousel) return;

    this.videoCarousel = carousel;
    const speed = 1.2; // Velocidad del scroll (píxeles por frame)

    // Duplicar elementos para loop infinito seamless
    const children = Array.from(carousel.children);
    if (children.length === 0) return;

    children.forEach(child => {
      const clone = child.cloneNode(true);
      carousel.appendChild(clone);
    });

    // Función de scroll loop
    const scrollLoop = () => {
      if (!this.isCarouselPaused) {
        carousel.scrollLeft += speed;

        // Reset cuando llega a la mitad (donde están los duplicados)
        if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
          carousel.scrollLeft = 0;
        }
      }

      this.carouselAnimationFrame = requestAnimationFrame(scrollLoop);
    };

    // Pausar en hover
    carousel.addEventListener('mouseenter', () => {
      this.isCarouselPaused = true;
    });

    carousel.addEventListener('mouseleave', () => {
      this.isCarouselPaused = false;
    });

    // Iniciar animación
    scrollLoop();

    console.log('✅ Video carousel initialized');
  }

  /**
   * Efectos Glow en títulos
   */
  initGlowEffects() {
    const glowElements = document.querySelectorAll('.glow-text, .glow-title');

    glowElements.forEach(element => {
      element.addEventListener('mouseenter', function() {
        this.style.textShadow = `
          0 0 30px rgba(255, 255, 255, 1),
          0 0 60px rgba(255, 255, 255, 0.8),
          0 0 90px rgba(255, 255, 255, 0.6)
        `;
      });

      element.addEventListener('mouseleave', function() {
        this.style.textShadow = '';
      });
    });
  }

  /**
   * Animaciones de Service Cards
   */
  initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach((card, index) => {
      // Animación de entrada escalonada
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';

      setTimeout(() => {
        card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);

      // Efecto de hover mejorado
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
      });

      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  /**
   * Mejoras en Product Cards
   */
  initProductCards() {
    const productCards = document.querySelectorAll('.product-card, .product-card-enhanced');

    productCards.forEach((card, index) => {
      // Animación de entrada
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';

      setTimeout(() => {
        card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 80);

      // Efecto parallax en imagen al hover
      const image = card.querySelector('img');
      if (image) {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = (y - centerY) / 20;
          const rotateY = (centerX - x) / 20;

          image.style.transform = `scale(1.1) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
          image.style.transform = 'scale(1) rotateX(0) rotateY(0)';
        });
      }
    });
  }

  /**
   * Animaciones al hacer scroll (Intersection Observer)
   */
  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          entry.target.style.opacity = '1';
        }
      });
    }, observerOptions);

    // Observar elementos con clase .scroll-animate
    document.querySelectorAll('.scroll-animate').forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }

  /**
   * Animación de contador (para estadísticas)
   */
  animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
          }, 16);

          observer.unobserve(element);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(element);
  }

  /**
   * Efecto Parallax en Hero
   */
  initHeroParallax() {
    const hero = document.querySelector('.hero-weiss');
    if (!hero) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
  }

  /**
   * Smooth Scroll para enlaces internos
   */
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Animación de badges (pulso)
   */
  initBadgeAnimations() {
    const badges = document.querySelectorAll('.badge-new, .badge-sale');

    badges.forEach((badge, index) => {
      badge.style.animationDelay = `${index * 0.2}s`;
    });
  }

  /**
   * Preload de videos para mejor performance
   */
  preloadVideos() {
    const videos = document.querySelectorAll('.video-item video');

    videos.forEach((video, index) => {
      // Cargar videos visibles primero
      if (index < 3) {
        video.load();
      } else {
        // Lazy load para el resto
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              video.load();
              observer.unobserve(video);
            }
          });
        });

        observer.observe(video);
      }
    });
  }

  /**
   * Cleanup (para SPA o si necesitas destruir)
   */
  destroy() {
    if (this.carouselAnimationFrame) {
      cancelAnimationFrame(this.carouselAnimationFrame);
    }

    console.log('WEISS Enhancements destroyed');
  }
}

// Crear instancia global
window.weissEnhancements = new WeissEnhancements();

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.weissEnhancements.init();
  });
} else {
  window.weissEnhancements.init();
}

// Utilidades adicionales para templates
window.WeissUtils = {
  /**
   * Formatear precio en pesos colombianos
   */
  formatPrice: (price) => {
    return '$' + parseInt(price).toLocaleString('es-CO');
  },

  /**
   * Calcular precio con descuento
   */
  calculateDiscount: (price, percentage) => {
    return price - (price * percentage / 100);
  },

  /**
   * Abrir WhatsApp
   */
  openWhatsApp: (number, message = '') => {
    const url = `https://wa.me/${number}${message ? '?text=' + encodeURIComponent(message) : ''}`;
    window.open(url, '_blank');
  },

  /**
   * Compartir en redes sociales
   */
  share: (platform, url, text) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  }
};
