'use strict';

/**
 * Weiss Sport Advanced Scrollytelling System
 * Scroll-triggered animations and storytelling effects
 */

class ScrollyTelling {
  constructor() {
    this.sections = [];
    this.observers = [];
    this.isInitialized = false;
    this.scrollProgress = 0;
  }

  /**
   * Initialize scrollytelling system
   */
  init() {
    if (this.isInitialized) return;

    this.setupIntersectionObservers();
    this.setupScrollProgress();
    this.initRevealAnimations();
    this.initVideoBackgrounds();
    this.initProgressiveConstruction();
    this.initHorizontalTimeline();

    this.isInitialized = true;
    console.log('✅ Scrollytelling System initialized');
  }

  /**
   * Setup Intersection Observers for scroll-triggered animations
   */
  setupIntersectionObservers() {
    const observerOptions = {
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: '-50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');

          // Trigger custom events
          const event = new CustomEvent('section-visible', {
            detail: { section: entry.target }
          });
          document.dispatchEvent(event);
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, observerOptions);

    // Observe all scroll-triggered sections
    document.querySelectorAll('.scroll-trigger').forEach(section => {
      observer.observe(section);
    });

    this.observers.push(observer);
  }

  /**
   * Setup scroll progress tracking
   */
  setupScrollProgress() {
    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      this.scrollProgress = (window.scrollY / documentHeight) * 100;

      // Update progress indicators
      document.querySelectorAll('.scroll-progress-bar').forEach(bar => {
        bar.style.width = `${this.scrollProgress}%`;
      });
    });
  }

  /**
   * Initialize reveal-on-scroll animations
   */
  initRevealAnimations() {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-on-scroll, .reveal-scale, .manifesto-line').forEach(el => {
      revealObserver.observe(el);
    });

    this.observers.push(revealObserver);
  }

  /**
   * Initialize video backgrounds with scroll control
   */
  initVideoBackgrounds() {
    const videoSections = document.querySelectorAll('.video-scroll-section');

    videoSections.forEach(section => {
      const video = section.querySelector('video');
      if (!video) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.5 });

      observer.observe(section);
      this.observers.push(observer);
    });
  }

  /**
   * Progressive Product Construction Animation
   */
  initProgressiveConstruction() {
    const constructionSections = document.querySelectorAll('.construction-section');

    constructionSections.forEach(section => {
      const parts = section.querySelectorAll('.construction-part');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const rect = entry.target.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const progress = 1 - (rect.top / windowHeight);

            parts.forEach((part, index) => {
              const delay = index * 0.15;
              const partProgress = Math.max(0, Math.min(1, (progress - delay) / 0.3));

              if (partProgress > 0) {
                part.style.opacity = partProgress;
                part.style.transform = `translateY(${(1 - partProgress) * 50}px)`;
                part.classList.add('constructed');
              }
            });
          }
        });
      }, { threshold: Array.from({length: 100}, (_, i) => i / 100) });

      observer.observe(section);
      this.observers.push(observer);
    });
  }

  /**
   * Horizontal Timeline Scroll
   */
  initHorizontalTimeline() {
    const timeline = document.querySelector('.horizontal-timeline');
    if (!timeline) return;

    const timelineTrack = timeline.querySelector('.timeline-track');
    if (!timelineTrack) return;

    window.addEventListener('scroll', () => {
      const rect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = Math.max(0, Math.min(1,
          (windowHeight - rect.top) / (windowHeight + rect.height)
        ));

        const maxScroll = timelineTrack.scrollWidth - timeline.offsetWidth;
        timelineTrack.scrollLeft = progress * maxScroll;
      }
    });
  }

  /**
   * Create Text Sequence Animation
   */
  createTextSequence(containerId, texts, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const duration = options.duration || 800;
    let currentIndex = 0;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const interval = setInterval(() => {
            if (currentIndex >= texts.length) {
              clearInterval(interval);
              return;
            }

            container.textContent = texts[currentIndex];
            container.classList.add('text-fade-in');

            setTimeout(() => {
              container.classList.remove('text-fade-in');
            }, duration / 2);

            currentIndex++;
          }, duration);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(container);
    this.observers.push(observer);
  }

  /**
   * Parallax Background Effect
   */
  initParallaxBackgrounds() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');

    window.addEventListener('scroll', () => {
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.speed) || 0.5;
        const rect = el.getBoundingClientRect();
        const offset = window.scrollY * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    });
  }

  /**
   * Counter Animation
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
            element.textContent = Math.floor(current);
          }, 16);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(element);
    this.observers.push(observer);
  }

  /**
   * Cleanup observers
   */
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isInitialized = false;
  }
}

// Global instance
window.scrollyTelling = new ScrollyTelling();

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.scrollyTelling.init();
  });
} else {
  window.scrollyTelling.init();
}
