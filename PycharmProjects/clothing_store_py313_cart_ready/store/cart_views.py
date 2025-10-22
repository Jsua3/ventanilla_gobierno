from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
from .models import Product, StoreConfiguration
import json
from decimal import Decimal
from datetime import datetime

@csrf_exempt
@require_http_methods(["POST"])
def cart_add(request):
    """Añadir producto al carrito (devuelve info del producto)"""
    try:
        data = json.loads(request.body)
        product_id = data.get('id')
        size = data.get('size', '')
        color = data.get('color', '')

        product = Product.objects.get(id=product_id, is_active=True)

        return JsonResponse({
            'success': True,
            'product': {
                'id': product.id,
                'name': product.name,
                'price': float(product.get_final_price()),
                'image': product.image_main.url if product.image_main else '',
                'size': size,
                'color': color,
            }
        })
    except Product.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Producto no encontrado'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def send_receipt(request):
    """Enviar recibo por email"""
    try:
        data = json.loads(request.body)

        # Extraer datos
        name = data.get('name')
        email = data.get('email')
        address = data.get('address')
        country = data.get('country')
        city = data.get('city')
        method = data.get('method')
        total = data.get('total')
        order_id = data.get('orderId')
        items = data.get('items', [])

        # Obtener configuración de la tienda
        config = StoreConfiguration.objects.first()
        store_name = config.store_name if config else 'WARSTKI®'
        store_email = config.email if config else settings.DEFAULT_FROM_EMAIL

        # Crear mensaje de email
        items_text = '\n'.join([
            f"  - {item['name']} x{item['qty']} = ${item['price'] * item['qty']:,.0f}"
            for item in items
        ])

        email_body = f"""
¡Gracias por tu compra en {store_name}!

DETALLES DEL PEDIDO:
ID de Orden: {order_id}
Fecha: {datetime.now().strftime('%d/%m/%Y %H:%M')}

INFORMACIÓN DEL CLIENTE:
Nombre: {name}
Email: {email}
Dirección: {address}
Ciudad: {city}
País: {country}

MÉTODO DE PAGO: {method}

PRODUCTOS:
{items_text}

TOTAL: ${total:,.0f}

Este recibo es válido como comprobante de pago.

---
{store_name}
El deporte está en nuestro ADN 💪
"""

        # Enviar email al cliente
        try:
            send_mail(
                subject=f'Recibo de compra - {order_id}',
                message=email_body,
                from_email=store_email,
                recipient_list=[email],
                fail_silently=False,
            )

            # También enviar copia a la tienda
            send_mail(
                subject=f'Nueva venta - {order_id}',
                message=f'Nueva venta realizada:\n\n{email_body}',
                from_email=store_email,
                recipient_list=[store_email],
                fail_silently=True,
            )

            email_sent = True
        except Exception as email_error:
            print(f"Error enviando email: {email_error}")
            email_sent = False

        return JsonResponse({
            'ok': True,
            'orderId': order_id,
            'emailSent': email_sent
        })

    except Exception as e:
        return JsonResponse({'ok': False, 'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def validate_cart(request):
    """Validar productos del carrito"""
    try:
        data = json.loads(request.body)
        cart_items = data.get('items', [])

        validated_items = []
        for item in cart_items:
            try:
                product = Product.objects.get(id=item['id'], is_active=True)
                validated_items.append({
                    'id': product.id,
                    'name': product.name,
                    'price': float(product.get_final_price()),
                    'image': product.image_main.url if product.image_main else '',
                    'stock': product.stock,
                    'qty': item['qty']
                })
            except Product.DoesNotExist:
                continue

        return JsonResponse({
            'success': True,
            'items': validated_items
        })

    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)
