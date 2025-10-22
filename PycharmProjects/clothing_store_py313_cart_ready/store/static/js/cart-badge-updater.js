/**
 * WARSTKI® Cart Integration
 * Integrates product pages with cart app API (database-persisted cart)
 */

(function() {
    'use strict';

    // Get CSRF token from Django cookies
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

    const csrftoken = getCookie('csrftoken');

    // Update cart badge with current item count from API
    async function updateCartBadge() {
        try {
            const response = await fetch('/api/cart', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                console.warn('Failed to fetch cart data');
                return;
            }

            const data = await response.json();

            if (data.ok && data.data && data.data.items) {
                const totalItems = data.data.items.reduce((sum, item) => sum + item.qty, 0);
                const badge = document.getElementById('cart-badge');

                if (badge) {
                    if (totalItems > 0) {
                        badge.textContent = totalItems;
                        badge.hidden = false;
                    } else {
                        badge.hidden = true;
                    }
                }
            }
        } catch (error) {
            console.error('Error updating cart badge:', error);
        }
    }

    // Add product to cart using API
    async function addProductToCart(productId, productName, price, imageUrl, qty = 1) {
        qty = Math.max(1, parseInt(qty) || 1);

        try {
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify({
                    product_id: productId,
                    qty: qty
                })
            });

            const data = await response.json();

            if (data.ok) {
                // Show success notification
                showNotification(`✓ ${productName} agregado al carrito`, 'success');

                // Update badge
                updateCartBadge();

                // Optional: Add animation to cart icon
                const cartIcon = document.querySelector('.cart-icon');
                if (cartIcon) {
                    cartIcon.classList.add('cart-bounce');
                    setTimeout(() => cartIcon.classList.remove('cart-bounce'), 500);
                }
            } else {
                showNotification('Error al agregar producto', 'error');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            showNotification('Error al conectar con el servidor', 'error');
        }
    }

    // Show notification toast
    function showNotification(message, type = 'success') {
        // Remove existing notification
        const existingNotif = document.querySelector('.warstki-notification');
        if (existingNotif) {
            existingNotif.remove();
        }

        const notification = document.createElement('div');
        notification.className = `warstki-notification warstki-notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-weight: 600;
            animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease-out';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }

    // Add CSS animations for notifications and cart icon
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }

        @keyframes cartBounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }

        .cart-icon.cart-bounce {
            animation: cartBounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
    `;
    document.head.appendChild(style);

    // Update badge on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateCartBadge);
    } else {
        updateCartBadge();
    }

    // Expose functions globally
    window.updateCartBadge = updateCartBadge;
    window.addProductToCart = addProductToCart;

    // Auto-update every 30 seconds
    setInterval(updateCartBadge, 30000);
})();
