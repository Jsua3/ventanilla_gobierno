/* ============================================
   WARSTKI FOOTER JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // NEWSLETTER FORM SUBMISSION
    // ============================================
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterSuccess = document.getElementById('newsletterSuccess');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const email = document.getElementById('newsletterEmail').value;
            const interests = Array.from(document.querySelectorAll('input[name="interest"]:checked'))
                .map(cb => cb.value);
            const gdprConsent = document.querySelector('input[name="gdpr"]').checked;

            if (!gdprConsent) {
                alert('Por favor acepta la política de privacidad para continuar.');
                return;
            }

            // Simulate API call
            console.log('Newsletter subscription:', {
                email: email,
                interests: interests,
                gdpr: gdprConsent
            });

            // Show success message with animation
            newsletterForm.style.display = 'none';
            newsletterSuccess.style.display = 'block';

            // Add confetti effect
            createConfetti();

            // Optional: Send to backend
            // fetch('/api/newsletter/subscribe/', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'X-CSRFToken': getCookie('csrftoken')
            //     },
            //     body: JSON.stringify({
            //         email: email,
            //         interests: interests,
            //         gdpr: gdprConsent
            //     })
            // })
            // .then(response => response.json())
            // .then(data => {
            //     if (data.success) {
            //         newsletterForm.style.display = 'none';
            //         newsletterSuccess.style.display = 'block';
            //         createConfetti();
            //     }
            // })
            // .catch(error => {
            //     console.error('Error:', error);
            //     alert('Hubo un error al suscribirse. Por favor intenta de nuevo.');
            // });
        });
    }

    // ============================================
    // CONFETTI ANIMATION
    // ============================================
    function createConfetti() {
        const colors = ['#ff6347', '#ffa500', '#00ff00', '#00bfff', '#ff69b4'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.opacity = '1';
            confetti.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
            confetti.style.transition = 'all 3s ease-out';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '10000';
            confetti.style.borderRadius = '50%';

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.style.top = window.innerHeight + 'px';
                confetti.style.opacity = '0';
                confetti.style.transform = 'rotate(' + (Math.random() * 720) + 'deg)';
            }, 10);

            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
    }

    // ============================================
    // LANGUAGE SELECTOR
    // ============================================
    const languageSelector = document.getElementById('languageSelector');
    const languageDropdown = document.getElementById('languageDropdown');

    if (languageSelector && languageDropdown) {
        // Toggle dropdown on click for mobile
        languageSelector.addEventListener('click', function(e) {
            e.stopPropagation();
            const isVisible = languageDropdown.style.opacity === '1' && languageDropdown.style.visibility === 'visible';

            // Close all dropdowns first
            document.querySelectorAll('.selector-dropdown').forEach(dropdown => {
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
            });

            if (!isVisible) {
                languageDropdown.style.opacity = '1';
                languageDropdown.style.visibility = 'visible';
                languageDropdown.style.transform = 'translateY(0)';
            }
        });

        // Language selection
        languageDropdown.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const lang = this.getAttribute('data-lang');
                const langText = this.querySelector('span:last-child').textContent;

                // Update button text
                languageSelector.querySelector('span').textContent = lang.toUpperCase();

                // Update active state
                languageDropdown.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                this.classList.add('active');

                // Close dropdown
                languageDropdown.style.opacity = '0';
                languageDropdown.style.visibility = 'hidden';

                // Save preference
                localStorage.setItem('warstki_language', lang);

                console.log('Language changed to:', lang);

                // Optional: Reload page with language parameter
                // window.location.href = '/?lang=' + lang;
            });
        });
    }

    // ============================================
    // CURRENCY SELECTOR
    // ============================================
    const currencySelector = document.getElementById('currencySelector');
    const currencyDropdown = document.getElementById('currencyDropdown');

    if (currencySelector && currencyDropdown) {
        // Toggle dropdown on click for mobile
        currencySelector.addEventListener('click', function(e) {
            e.stopPropagation();
            const isVisible = currencyDropdown.style.opacity === '1' && currencyDropdown.style.visibility === 'visible';

            // Close all dropdowns first
            document.querySelectorAll('.selector-dropdown').forEach(dropdown => {
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
            });

            if (!isVisible) {
                currencyDropdown.style.opacity = '1';
                currencyDropdown.style.visibility = 'visible';
                currencyDropdown.style.transform = 'translateY(0)';
            }
        });

        // Currency selection
        currencyDropdown.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const currency = this.getAttribute('data-currency');
                const currencyText = currency.toUpperCase();

                // Update button text
                currencySelector.querySelector('span').textContent = currencyText;

                // Update active state
                currencyDropdown.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                this.classList.add('active');

                // Close dropdown
                currencyDropdown.style.opacity = '0';
                currencyDropdown.style.visibility = 'hidden';

                // Save preference
                localStorage.setItem('warstki_currency', currency);

                console.log('Currency changed to:', currency);

                // Optional: Update prices on page
                // updatePrices(currency);
            });
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.selector-group')) {
            document.querySelectorAll('.selector-dropdown').forEach(dropdown => {
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
            });
        }
    });

    // ============================================
    // ACCESSIBILITY BUTTON
    // ============================================
    const accessibilityBtn = document.getElementById('accessibilityBtn');

    if (accessibilityBtn) {
        accessibilityBtn.addEventListener('click', function() {
            // Show accessibility modal or menu
            showAccessibilityMenu();
        });
    }

    function showAccessibilityMenu() {
        // Create modal
        const modal = document.createElement('div');
        modal.id = 'accessibilityModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 1rem;
        `;

        modal.innerHTML = `
            <div style="background: white; border-radius: 20px; padding: 2rem; max-width: 500px; width: 100%; position: relative;">
                <button id="closeAccessibilityModal" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">
                    <i class="fas fa-times"></i>
                </button>

                <h2 style="margin-bottom: 1.5rem; color: #111; font-size: 1.8rem;">
                    <i class="fas fa-universal-access"></i> Accesibilidad
                </h2>

                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="padding: 1rem; background: #f9fafb; border-radius: 12px;">
                        <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                            <span style="font-weight: 600; color: #111;">Aumentar tamaño de texto</span>
                            <input type="checkbox" id="increaseFontSize" style="width: 20px; height: 20px;">
                        </label>
                    </div>

                    <div style="padding: 1rem; background: #f9fafb; border-radius: 12px;">
                        <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                            <span style="font-weight: 600; color: #111;">Alto contraste</span>
                            <input type="checkbox" id="highContrast" style="width: 20px; height: 20px;">
                        </label>
                    </div>

                    <div style="padding: 1rem; background: #f9fafb; border-radius: 12px;">
                        <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                            <span style="font-weight: 600; color: #111;">Reducir animaciones</span>
                            <input type="checkbox" id="reduceMotion" style="width: 20px; height: 20px;">
                        </label>
                    </div>

                    <button id="saveAccessibility" style="margin-top: 1rem; padding: 1rem; background: var(--orange); color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; font-size: 1rem;">
                        Guardar preferencias
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Load saved preferences
        if (localStorage.getItem('warstki_large_font') === 'true') {
            document.getElementById('increaseFontSize').checked = true;
        }
        if (localStorage.getItem('warstki_high_contrast') === 'true') {
            document.getElementById('highContrast').checked = true;
        }
        if (localStorage.getItem('warstki_reduce_motion') === 'true') {
            document.getElementById('reduceMotion').checked = true;
        }

        // Close modal
        document.getElementById('closeAccessibilityModal').addEventListener('click', function() {
            modal.remove();
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Save preferences
        document.getElementById('saveAccessibility').addEventListener('click', function() {
            const largeFont = document.getElementById('increaseFontSize').checked;
            const highContrast = document.getElementById('highContrast').checked;
            const reduceMotion = document.getElementById('reduceMotion').checked;

            // Save to localStorage
            localStorage.setItem('warstki_large_font', largeFont);
            localStorage.setItem('warstki_high_contrast', highContrast);
            localStorage.setItem('warstki_reduce_motion', reduceMotion);

            // Apply changes
            applyAccessibilityPreferences(largeFont, highContrast, reduceMotion);

            // Close modal
            modal.remove();

            // Show confirmation
            showNotification('Preferencias de accesibilidad guardadas correctamente');
        });
    }

    // ============================================
    // APPLY ACCESSIBILITY PREFERENCES
    // ============================================
    function applyAccessibilityPreferences(largeFont, highContrast, reduceMotion) {
        // Large font
        if (largeFont) {
            document.body.style.fontSize = '1.1em';
        } else {
            document.body.style.fontSize = '';
        }

        // High contrast
        if (highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }

        // Reduce motion
        if (reduceMotion) {
            document.body.classList.add('reduce-motion');
        } else {
            document.body.classList.remove('reduce-motion');
        }
    }

    // Load accessibility preferences on page load
    const savedLargeFont = localStorage.getItem('warstki_large_font') === 'true';
    const savedHighContrast = localStorage.getItem('warstki_high_contrast') === 'true';
    const savedReduceMotion = localStorage.getItem('warstki_reduce_motion') === 'true';
    applyAccessibilityPreferences(savedLargeFont, savedHighContrast, savedReduceMotion);

    // ============================================
    // NOTIFICATION HELPER
    // ============================================
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10001;
            font-weight: 600;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // ============================================
    // SOCIAL CARD ANIMATIONS
    // ============================================
    const socialCards = document.querySelectorAll('.social-card');

    socialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add hover effect with sound (optional)
            // playSound('hover');
        });
    });

    // ============================================
    // FOOTER LINKS HOVER EFFECTS
    // ============================================
    const footerLinks = document.querySelectorAll('.footer-links a');

    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(4px)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // ============================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe footer columns
    document.querySelectorAll('.footer-column').forEach(column => {
        column.style.opacity = '0';
        column.style.transform = 'translateY(30px)';
        column.style.transition = 'all 0.6s ease-out';
        observer.observe(column);
    });

    // ============================================
    // LOAD SAVED LANGUAGE AND CURRENCY
    // ============================================
    const savedLanguage = localStorage.getItem('warstki_language');
    const savedCurrency = localStorage.getItem('warstki_currency');

    if (savedLanguage && languageSelector) {
        languageSelector.querySelector('span').textContent = savedLanguage.toUpperCase();
        const activeLink = languageDropdown.querySelector(`a[data-lang="${savedLanguage}"]`);
        if (activeLink) {
            languageDropdown.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            activeLink.classList.add('active');
        }
    }

    if (savedCurrency && currencySelector) {
        currencySelector.querySelector('span').textContent = savedCurrency.toUpperCase();
        const activeLink = currencyDropdown.querySelector(`a[data-currency="${savedCurrency}"]`);
        if (activeLink) {
            currencyDropdown.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            activeLink.classList.add('active');
        }
    }

    // ============================================
    // CSRF TOKEN HELPER
    // ============================================
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // ============================================
    // SMOOTH SCROLL FOR FOOTER LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    console.log('✅ Warstki Footer JavaScript loaded successfully');
});
