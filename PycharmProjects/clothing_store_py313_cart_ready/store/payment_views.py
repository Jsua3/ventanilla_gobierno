"""
Vistas de pago con Stripe para Clothing Store
"""
import stripe
import json
import logging
import os
from decimal import Decimal
from django.conf import settings
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from cart.models import Cart, CartItem
from cart.utils import get_or_create_cart
from .models import Order, OrderItem, Product, StoreConfiguration
from .emails import send_order_confirmation_email, send_order_notification_to_company

# Configurar Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

# Configurar logging
logger = logging.getLogger('payment')
if not logger.hasHandlers():
    LOG_DIR = os.path.join(settings.BASE_DIR, 'logs')
    if not os.path.exists(LOG_DIR):
        os.makedirs(LOG_DIR)
    file_handler = logging.FileHandler(os.path.join(LOG_DIR, 'payment.log'))
    file_handler.setLevel(logging.DEBUG)
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)
    logger.setLevel(logging.DEBUG)


def get_store_context():
    """Obtener contexto global de la tienda"""
    try:
        config = StoreConfiguration.objects.first()
    except:
        config = None

    return {
        'config': config,
    }


def checkout(request):
    """Vista del checkout con formulario de envío"""
    context = get_store_context()

    # Obtener carrito del usuario usando la utilidad compartida
    cart = get_or_create_cart(request)
    cart_items = cart.items.all()

    # CAMBIO: Permitir checkout incluso si el carrito de BD está vacío
    # (puede haber diseños personalizados en localStorage que se procesarán en el cliente)
    # Solo redirigir si hay carrito pero completamente vacío (sin items de BD ni localStorage)
    # Por ahora, permitir que continúe el checkout

    # Calcular totales
    subtotal = sum(item.get_total_price() for item in cart_items)

    # Si no hay items en BD, el cliente debe tener al menos items en localStorage
    # o el total será 0 y Stripe rechazará el pago
    shipping = Decimal('5000.00')  # $5,000 COP envío
    tax = subtotal * Decimal('0.19')  # 19% IVA
    total = subtotal + shipping + tax

    context.update({
        'cart_items': cart_items,
        'subtotal': subtotal,
        'shipping': shipping,
        'tax': tax,
        'total': total,
        'stripe_public_key': settings.STRIPE_PUBLIC_KEY,
    })

    return render(request, 'store/checkout.html', context)


@require_POST
def create_payment_intent(request):
    """Crear Payment Intent de Stripe"""
    try:
        data = json.loads(request.body)

        # Obtener carrito usando la utilidad compartida
        cart = get_or_create_cart(request)
        cart_items = cart.items.all()

        # Calcular total
        subtotal = sum(item.get_total_price() for item in cart_items)
        shipping = Decimal('5000.00')
        tax = subtotal * Decimal('0.19')
        total = subtotal + shipping + tax

        # Convertir a centavos para Stripe (COP)
        amount = int(total * 100)

        # Crear Payment Intent
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='cop',  # Pesos colombianos
            metadata={
                'customer_name': data.get('customer_name'),
                'customer_email': data.get('customer_email'),
            }
        )

        return JsonResponse({
            'clientSecret': intent.client_secret
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@require_POST
def confirm_payment(request):
    """Confirmar pago y crear orden"""
    try:
        data = json.loads(request.body)
        payment_intent_id = data.get('payment_intent_id')

        # Verificar el Payment Intent con Stripe
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)

        if intent.status != 'succeeded':
            return JsonResponse({'error': 'Pago no completado'}, status=400)

        # Obtener carrito usando la utilidad compartida
        cart = get_or_create_cart(request)
        user = request.user if request.user.is_authenticated else None
        cart_items = cart.items.all()

        # Calcular totales
        subtotal = sum(item.get_total_price() for item in cart_items)
        shipping = Decimal('5000.00')
        tax = subtotal * Decimal('0.19')
        total = subtotal + shipping + tax

        # Crear orden
        # Nota: Para obtener el charge_id, necesitaríamos hacer una llamada adicional a Stripe
        # Por ahora, usamos el payment_intent_id como referencia principal
        order = Order.objects.create(
            user=user,
            customer_name=data.get('customer_name'),
            customer_email=data.get('customer_email'),
            customer_phone=data.get('customer_phone', ''),
            shipping_address=data.get('shipping_address'),
            shipping_city=data.get('shipping_city'),
            shipping_state=data.get('shipping_state'),
            shipping_zip=data.get('shipping_zip'),
            shipping_country='Colombia',
            stripe_payment_intent_id=payment_intent_id,
            stripe_charge_id=payment_intent_id,  # Usar el payment_intent_id como referencia
            subtotal=subtotal,
            shipping_cost=shipping,
            tax=tax,
            total=total,
            status='paid'
        )

        # Crear items de la orden
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name,
                size=item.size,
                color=item.color,
                price=item.product.get_final_price(),
                quantity=item.quantity
            )

            # Reducir stock del producto
            if item.product.stock >= item.quantity:
                item.product.stock -= item.quantity
                item.product.save()

        # Limpiar carrito
        cart_items.delete()

        # Enviar emails de confirmación
        # IMPORTANTE: Los emails se envían DESPUÉS de crear la orden
        # Si falla el email, la orden ya está creada (pago fue procesado)
        try:
            logger.info(f"[EMAILS] Iniciando envío de emails para orden {order.id}")
            logger.info(f"[EMAILS] Email cliente: {order.customer_email}")
            print(f"[PAGO] Iniciando envío de emails para orden {order.id}")
            print(f"[PAGO] Email cliente: {order.customer_email}")

            send_order_confirmation_email(order)
            send_order_notification_to_company(order)

            logger.info(f"[EMAILS] Emails enviados exitosamente para orden {order.id}")
            print(f"[PAGO] Emails enviados exitosamente para orden {order.id}")
        except Exception as email_error:
            logger.error(f"[EMAILS] ERROR al enviar emails: {str(email_error)}", exc_info=True)
            print(f"[PAGO] ERROR al enviar emails: {str(email_error)}")
            import traceback
            traceback.print_exc()
            # No falla la orden si el email falla - el pago ya se procesó

        return JsonResponse({
            'success': True,
            'order_number': order.order_number,
            'redirect_url': f'/order-confirmation/{order.order_number}/'
        })

    except Exception as e:
        logger.error(f"[PAGO] ERROR al procesar pago: {str(e)}", exc_info=True)
        print(f"[PAGO] ERROR al procesar pago: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=400)


def order_confirmation(request, order_number):
    """Vista de confirmación de orden"""
    context = get_store_context()
    order = get_object_or_404(Order, order_number=order_number)

    # Verificar que el usuario pueda ver esta orden
    if request.user.is_authenticated:
        if order.user != request.user:
            return redirect('store:index')

    context.update({
        'order': order,
    })

    return render(request, 'store/order_confirmation.html', context)


@csrf_exempt
@require_POST
def stripe_webhook(request):
    """Webhook para eventos de Stripe"""
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)

    # Manejar el evento
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        # Aquí puedes actualizar el estado de la orden si es necesario
        print(f"Payment Intent succeeded: {payment_intent['id']}")

    elif event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        # Manejar fallo en el pago
        print(f"Payment Intent failed: {payment_intent['id']}")

    return HttpResponse(status=200)
