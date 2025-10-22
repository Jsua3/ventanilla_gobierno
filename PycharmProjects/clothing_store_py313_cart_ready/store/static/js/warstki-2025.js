/**
 * WARSTKI® 2025 - Interactive Experience
 * Premium Athletic Wear E-commerce
 */

(function() {
  'use strict';

  // ============================================
  // THEME TOGGLE - Light/Dark Mode
  // ============================================
  class ThemeManager {
    constructor() {
      this.theme = localStorage.getItem('warstki-theme') || 'light';
      this.init();
    }

    init() {
      this.applyTheme();
      this.setupToggle();
    }

    applyTheme() {
      if (this.theme === 'dark') {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      this.updateToggleIcon();
    }

    toggle() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('warstki-theme', this.theme);

      // Smooth transition
      document.body.style.transition = 'background-color 0.4s, color 0.4s';
      this.applyTheme();

      setTimeout(() => {
        document.body.style.transition = '';
      }, 400);
    }

    updateToggleIcon() {
      const toggle = document.querySelector('.theme-toggle');
      if (toggle) {
        toggle.innerHTML = this.theme === 'dark'
          ? '<i class="fas fa-sun"></i>'
          : '<i class="fas fa-moon"></i>';
      }
    }

    setupToggle() {
      const toggle = document.querySelector('.theme-toggle');
      if (toggle) {
        toggle.addEventListener('click', () => this.toggle());
      }
    }
  }

  // ============================================
  // STICKY HEADER
  // ============================================
  class StickyHeader {
    constructor() {
      this.header = document.querySelector('.warstki-header');
      this.scrollThreshold = 100;
      this.init();
    }

    init() {
      if (!this.header) return;
      window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
      if (window.scrollY > this.scrollThreshold) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
    }
  }

  // ============================================
  // MEGA MENU
  // ============================================
  class MegaMenu {
    constructor() {
      this.triggers = document.querySelectorAll('.mega-menu-trigger');
      this.activeMenu = null;
      this.init();
    }

    init() {
      this.triggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', (e) => this.show(e.currentTarget));
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggle(e.currentTarget);
        });
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.mega-menu-trigger') && !e.target.closest('.mega-menu')) {
          this.hideAll();
        }
      });
    }

    show(trigger) {
      const menuId = trigger.dataset.menu;
      const menu = document.getElementById(menuId);

      if (menu) {
        this.hideAll();
        menu.classList.add('active');
        this.activeMenu = menu;
      }
    }

    toggle(trigger) {
      const menuId = trigger.dataset.menu;
      const menu = document.getElementById(menuId);

      if (menu) {
        if (menu.classList.contains('active')) {
          menu.classList.remove('active');
          this.activeMenu = null;
        } else {
          this.show(trigger);
        }
      }
    }

    hideAll() {
      document.querySelectorAll('.mega-menu').forEach(menu => {
        menu.classList.remove('active');
      });
      this.activeMenu = null;
    }
  }

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================
  class ScrollReveal {
    constructor() {
      this.elements = document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale');
      this.init();
    }

    init() {
      if (!this.elements.length) return;

      // Intersection Observer for performance
      const options = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Optionally unobserve after reveal
            // this.observer.unobserve(entry.target);
          }
        });
      }, options);

      this.elements.forEach(el => this.observer.observe(el));
    }
  }

  // ============================================
  // MANIFESTO SCROLLYTELLING
  // ============================================
  class ManifestoScroll {
    constructor() {
      this.section = document.querySelector('.manifesto-section');
      this.lines = document.querySelectorAll('.manifesto-line');
      this.init();
    }

    init() {
      if (!this.section || !this.lines.length) return;

      window.addEventListener('scroll', () => this.handleScroll());
      this.handleScroll(); // Initial check
    }

    handleScroll() {
      const sectionTop = this.section.offsetTop;
      const sectionHeight = this.section.offsetHeight;
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      // Calculate progress through section
      const progress = (scrollPosition - sectionTop) / sectionHeight;

      this.lines.forEach((line, index) => {
        const threshold = (index + 1) / (this.lines.length + 1);

        if (progress > threshold) {
          line.classList.add('active');
        } else {
          line.classList.remove('active');
        }
      });
    }
  }

  // ============================================
  // COUNTER ANIMATIONS
  // ============================================
  class CounterAnimation {
    constructor() {
      this.counters = document.querySelectorAll('[data-count]');
      this.init();
    }

    init() {
      if (!this.counters.length) return;

      const options = {
        threshold: 0.5
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            this.animateCounter(entry.target);
            entry.target.classList.add('counted');
          }
        });
      }, options);

      this.counters.forEach(counter => this.observer.observe(counter));
    }

    animateCounter(element) {
      const target = parseInt(element.dataset.count);
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current).toLocaleString();
        }
      }, 16);
    }
  }

  // ============================================
  // PARALLAX EFFECTS
  // ============================================
  class ParallaxEffect {
    constructor() {
      this.elements = document.querySelectorAll('.hero-parallax-bg img');
      this.init();
    }

    init() {
      if (!this.elements.length) return;

      window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
      const scrollY = window.scrollY;

      this.elements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }
  }

  // ============================================
  // PRODUCT CARD INTERACTIONS
  // ============================================
  class ProductCards {
    constructor() {
      this.cards = document.querySelectorAll('.product-card-warstki');
      this.init();
    }

    init() {
      this.cards.forEach(card => {
        // Mouse move 3D tilt effect
        card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
        card.addEventListener('mouseleave', () => this.resetCard(card));

        // Quick view button
        const quickViewBtn = card.querySelector('.quick-view-btn');
        if (quickViewBtn) {
          quickViewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showQuickView(card);
          });
        }

        // Add to cart button
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
          addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.addToCart(card);
          });
        }
      });
    }

    handleMouseMove(e, card) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * 8; // Increased tilt
      const rotateY = ((centerX - x) / centerX) * 8; // Increased tilt

      card.style.transform = `translateY(-20px) translateZ(30px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      card.style.transition = 'none'; // Disable transition during movement for smooth tracking
    }

    resetCard(card) {
      card.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      card.style.transform = '';
    }

    showQuickView(card) {
      const productId = card.dataset.productId;
      console.log('Quick view for product:', productId);
      // Implement quick view modal
      // You can create a modal that shows product details
    }

    addToCart(card) {
      const productId = card.dataset.productId;
      const productName = card.dataset.productName;
      const productPrice = card.dataset.productPrice;

      // Show animation
      const btn = card.querySelector('.add-to-cart-btn');
      btn.style.transform = 'scale(1.3) rotate(180deg)';

      setTimeout(() => {
        btn.style.transform = '';
        this.updateCartBadge();
        this.showNotification(`${productName} agregado al carrito`);
      }, 400);

      console.log('Add to cart:', { productId, productName, productPrice });
    }

    updateCartBadge() {
      const badge = document.querySelector('.cart-badge');
      if (badge) {
        const current = parseInt(badge.textContent) || 0;
        badge.textContent = current + 1;
        badge.style.animation = 'none';
        setTimeout(() => {
          badge.style.animation = 'bounce-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        }, 10);
      }
    }

    showNotification(message) {
      // Create toast notification
      const toast = document.createElement('div');
      toast.className = 'warstki-toast';
      toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
      `;
      toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 600;
        animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      `;

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        setTimeout(() => toast.remove(), 400);
      }, 3000);
    }
  }

  // ============================================
  // SEARCH FUNCTIONALITY
  // ============================================
  class SearchModal {
    constructor() {
      this.searchIcon = document.querySelector('.search-icon');
      this.init();
    }

    init() {
      if (!this.searchIcon) return;

      this.searchIcon.addEventListener('click', () => this.open());
    }

    open() {
      // Create search modal
      const modal = document.createElement('div');
      modal.className = 'search-modal';
      modal.innerHTML = `
        <div class="search-modal-overlay"></div>
        <div class="search-modal-content">
          <button class="search-modal-close">
            <i class="fas fa-times"></i>
          </button>
          <div class="search-modal-input-wrapper">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Buscar productos, categorías, deportes..." autofocus>
          </div>
          <div class="search-modal-results">
            <p class="search-hint">Escribe para buscar productos WARSTKI®</p>
          </div>
        </div>
      `;

      modal.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 10vh;
        animation: fadeIn 0.3s;
      `;

      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';

      // Close handlers
      modal.querySelector('.search-modal-close').addEventListener('click', () => this.close(modal));
      modal.querySelector('.search-modal-overlay').addEventListener('click', () => this.close(modal));

      // Search input handler
      const input = modal.querySelector('input');
      input.addEventListener('input', (e) => this.handleSearch(e.target.value, modal));
    }

    close(modal) {
      modal.style.animation = 'fadeOut 0.3s';
      setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
      }, 300);
    }

    handleSearch(query, modal) {
      if (query.length < 2) {
        modal.querySelector('.search-modal-results').innerHTML = `
          <p class="search-hint">Escribe para buscar productos WARSTKI®</p>
        `;
        return;
      }

      // Implement actual search
      console.log('Searching for:', query);
      // You would call your backend API here
    }
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  class SmoothScroll {
    constructor() {
      this.init();
    }

    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href !== '#' && href !== '#!') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          }
        });
      });
    }
  }

  // ============================================
  // MOBILE MENU
  // ============================================
  class MobileMenu {
    constructor() {
      this.hamburger = document.querySelector('.hamburger-menu');
      this.init();
    }

    init() {
      if (!this.hamburger) return;

      this.hamburger.addEventListener('click', () => this.toggle());
    }

    toggle() {
      const mobileNav = document.querySelector('.mobile-nav');
      if (mobileNav) {
        mobileNav.classList.toggle('active');
        this.hamburger.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
      }
    }
  }

  // ============================================
  // LAZY LOADING IMAGES
  // ============================================
  class LazyLoadImages {
    constructor() {
      this.images = document.querySelectorAll('img[data-src]');
      this.init();
    }

    init() {
      if (!this.images.length) return;

      const options = {
        threshold: 0,
        rootMargin: '50px'
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
          }
        });
      }, options);

      this.images.forEach(img => this.observer.observe(img));
    }

    loadImage(img) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      this.observer.unobserve(img);
    }
  }

  // ============================================
  // NEWSLETTER FORM
  // ============================================
  class NewsletterForm {
    constructor() {
      this.forms = document.querySelectorAll('.newsletter-form');
      this.init();
    }

    init() {
      this.forms.forEach(form => {
        form.addEventListener('submit', (e) => this.handleSubmit(e, form));
      });
    }

    handleSubmit(e, form) {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;

      // Show loading state
      const button = form.querySelector('button');
      const originalText = button.textContent;
      button.textContent = 'Enviando...';
      button.disabled = true;

      // Simulate API call
      setTimeout(() => {
        button.textContent = '¡Suscrito!';
        button.style.background = 'linear-gradient(135deg, #10b981, #059669)';

        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
          button.style.background = '';
          form.reset();
        }, 2000);
      }, 1000);

      console.log('Newsletter signup:', email);
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAll);
    } else {
      initAll();
    }
  }

  function initAll() {
    // Initialize all modules
    new ThemeManager();
    new StickyHeader();
    new MegaMenu();
    new ScrollReveal();
    new ManifestoScroll();
    new CounterAnimation();
    new ParallaxEffect();
    new ProductCards();
    new SearchModal();
    new SmoothScroll();
    new MobileMenu();
    new LazyLoadImages();
    new NewsletterForm();

    console.log('🏃‍♂️ WARSTKI® 2025 initialized');
  }

  // Start the application
  init();

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    .search-modal-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
    }

    .search-modal-content {
      position: relative;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-radius: 24px;
      padding: 2rem;
      max-width: 800px;
      width: 90%;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    body.dark-mode .search-modal-content {
      background: rgba(15, 15, 15, 0.4);
      border: 1px solid rgba(42, 42, 42, 0.2);
    }

    .search-modal-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: var(--bg-secondary);
      color: var(--text-primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
    }

    .search-modal-close:hover {
      background: #ef4444;
      color: white;
      transform: rotate(90deg);
    }

    .search-modal-input-wrapper {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-radius: 16px;
      border: 2px solid rgba(0, 71, 171, 0.2);
      transition: all 0.3s;
    }

    .search-modal-input-wrapper:focus-within {
      border-color: var(--warstki-blue);
      background: rgba(255, 255, 255, 0.5);
      box-shadow: 0 0 30px rgba(0, 71, 171, 0.2);
    }

    body.dark-mode .search-modal-input-wrapper {
      background: rgba(42, 42, 42, 0.3);
      border-color: rgba(255, 107, 53, 0.1);
    }

    body.dark-mode .search-modal-input-wrapper:focus-within {
      background: rgba(42, 42, 42, 0.5);
      border-color: var(--warstki-orange);
    }

    .search-modal-input-wrapper i {
      font-size: 1.5rem;
      color: var(--warstki-blue);
    }

    .search-modal-input-wrapper input {
      flex: 1;
      border: none;
      background: transparent;
      color: var(--text-primary);
      font-size: 1.2rem;
      outline: none;
    }

    .search-modal-results {
      margin-top: 2rem;
      min-height: 200px;
    }

    .search-hint {
      text-align: center;
      color: var(--text-secondary);
      font-size: 1.1rem;
      padding: 3rem;
    }
  `;
  document.head.appendChild(style);

})();
