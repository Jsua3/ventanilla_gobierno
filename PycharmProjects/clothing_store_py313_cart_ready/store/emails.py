"""
Sistema de correos electrónicos para Weiss Sport
Maneja el envío de correos de confirmación, notificaciones y más
"""

import logging
import os
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags

# Configurar logging para debugging
logger = logging.getLogger(__name__)

# Agregar logging a archivo
LOG_DIR = os.path.join(settings.BASE_DIR, 'logs')
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

file_handler = logging.FileHandler(os.path.join(LOG_DIR, 'emails.log'))
file_handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)
logger.setLevel(logging.DEBUG)


def send_order_confirmation_email(order):
    """
    Envía un correo de confirmación de pedido al cliente Y a la empresa

    Args:
        order: Instancia del modelo Order
    """
    try:
        logger.info(f"📧 Iniciando envío de correo de confirmación para pedido {order.id}")

        # Validar datos del orden
        if not order.customer_email:
            logger.error(f"❌ El orden {order.id} no tiene email del cliente")
            return False

        logger.info(f"   📬 Email del cliente: {order.customer_email}")
        logger.info(f"   🏢 Email de empresa: {settings.COMPANY_EMAIL}")

        # Contexto para la plantilla
        context = {
            'order': order,
            'order_number': f'#{order.id:06d}',
            'company_email': settings.COMPANY_EMAIL,
            'customer_name': order.customer_name,
            'total': order.total,
            'items': order.items.all(),
        }

        # Renderizar la plantilla HTML
        logger.info("   🎨 Renderizando plantilla HTML...")
        html_content = render_to_string('store/emails/order_confirmation.html', context)
        text_content = strip_tags(html_content)
        logger.info(f"   ✅ Plantilla renderizada ({len(html_content)} bytes)")

        # Crear el mensaje de correo
        subject = f'Confirmación de Pedido #{order.id:06d} - Weiss Sport'

        # OPCION 1: Enviar al cliente
        logger.info(f"   📤 Enviando a cliente: {order.customer_email}")
        email_cliente = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[order.customer_email]
        )
        email_cliente.attach_alternative(html_content, "text/html")
        result_cliente = email_cliente.send(fail_silently=False)
        logger.info(f"   ✅ Resultado cliente: {result_cliente} mensaje(s) enviado(s)")
        print(f'✅ Correo de confirmación enviado a {order.customer_email}')

        # OPCION 2: Enviar a la empresa también
        logger.info(f"   📤 Enviando copia a empresa: {settings.COMPANY_EMAIL}")
        email_empresa = EmailMultiAlternatives(
            subject=f'[COPIA] {subject}',
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.COMPANY_EMAIL]
        )
        email_empresa.attach_alternative(html_content, "text/html")
        result_empresa = email_empresa.send(fail_silently=False)
        logger.info(f"   ✅ Resultado empresa: {result_empresa} mensaje(s) enviado(s)")
        print(f'✅ Copia de confirmación enviada a {settings.COMPANY_EMAIL}')

        return True

    except Exception as e:
        logger.error(f'❌ Error al enviar correo de confirmación: {str(e)}', exc_info=True)
        print(f'❌ Error al enviar correo de confirmación: {str(e)}')
        import traceback
        traceback.print_exc()
        return False


def send_order_notification_to_company(order):
    """
    Envía una notificación de nuevo pedido al correo de la empresa

    Args:
        order: Instancia del modelo Order
    """
    try:
        logger.info(f"📧 Enviando notificación de nuevo pedido #{order.id} a empresa")

        context = {
            'order': order,
            'order_number': f'#{order.id:06d}',
            'customer_name': order.customer_name,
            'customer_email': order.customer_email,
            'customer_phone': order.customer_phone,
            'total': order.total,
            'items': order.items.all(),
        }

        logger.info("   🎨 Renderizando plantilla...")
        html_content = render_to_string('store/emails/order_notification_company.html', context)
        text_content = strip_tags(html_content)

        subject = f'Nuevo Pedido #{order.id:06d} - {order.customer_name}'
        logger.info(f"   📤 Enviando a: {settings.COMPANY_EMAIL}")
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.COMPANY_EMAIL]
        )

        email.attach_alternative(html_content, "text/html")
        result = email.send(fail_silently=False)
        logger.info(f"   ✅ Resultado: {result} mensaje(s) enviado(s)")
        print(f'✅ Notificación de pedido enviada a {settings.COMPANY_EMAIL}')
        return True

    except Exception as e:
        logger.error(f'❌ Error al enviar notificación a empresa: {str(e)}', exc_info=True)
        print(f'❌ Error al enviar notificación a empresa: {str(e)}')
        import traceback
        traceback.print_exc()
        return False


def send_order_shipped_email(order):
    """
    Envía un correo de envío al cliente Y a la empresa

    Args:
        order: Instancia del modelo Order
    """
    try:
        context = {
            'order': order,
            'order_number': f'#{order.id:06d}',
            'customer_name': order.customer_name,
        }

        html_content = render_to_string('store/emails/order_shipped.html', context)
        text_content = strip_tags(html_content)

        subject = f'Tu pedido ha sido enviado - Weiss Sport'

        # OPCION 1: Enviar al cliente
        email_cliente = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[order.customer_email]
        )
        email_cliente.attach_alternative(html_content, "text/html")
        email_cliente.send()
        print(f'✅ Correo de envío enviado a {order.customer_email}')

        # OPCION 2: Enviar a la empresa también
        email_empresa = EmailMultiAlternatives(
            subject=f'[PEDIDO ENVIADO] {order.order_number if hasattr(order, "order_number") else f"#{order.id:06d}"}',
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.COMPANY_EMAIL]
        )
        email_empresa.attach_alternative(html_content, "text/html")
        email_empresa.send()
        print(f'✅ Notificación de envío enviada a {settings.COMPANY_EMAIL}')

        return True

    except Exception as e:
        print(f'❌ Error al enviar correo de envío: {str(e)}')
        return False


def send_order_delivered_email(order):
    """
    Envía un correo de entrega al cliente Y a la empresa

    Args:
        order: Instancia del modelo Order
    """
    try:
        context = {
            'order': order,
            'order_number': f'#{order.id:06d}',
            'customer_name': order.customer_name,
        }

        html_content = render_to_string('store/emails/order_delivered.html', context)
        text_content = strip_tags(html_content)

        subject = f'Tu pedido ha sido entregado - Weiss Sport'

        # OPCION 1: Enviar al cliente
        email_cliente = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[order.customer_email]
        )
        email_cliente.attach_alternative(html_content, "text/html")
        email_cliente.send()
        print(f'✅ Correo de entrega enviado a {order.customer_email}')

        # OPCION 2: Enviar a la empresa también
        email_empresa = EmailMultiAlternatives(
            subject=f'[PEDIDO ENTREGADO] {order.order_number if hasattr(order, "order_number") else f"#{order.id:06d}"}',
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.COMPANY_EMAIL]
        )
        email_empresa.attach_alternative(html_content, "text/html")
        email_empresa.send()
        print(f'✅ Notificación de entrega enviada a {settings.COMPANY_EMAIL}')

        return True

    except Exception as e:
        print(f'❌ Error al enviar correo de entrega: {str(e)}')
        return False


def send_custom_email(recipient_email, subject, template_name, context=None):
    """
    Función genérica para enviar correos personalizados

    Args:
        recipient_email: Correo del destinatario
        subject: Asunto del correo
        template_name: Nombre de la plantilla (ej: 'store/emails/my_email.html')
        context: Diccionario con el contexto para la plantilla
    """
    try:
        if context is None:
            context = {}

        context['company_email'] = settings.COMPANY_EMAIL

        html_content = render_to_string(template_name, context)
        text_content = strip_tags(html_content)

        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient_email]
        )

        email.attach_alternative(html_content, "text/html")
        email.send()
        print(f'✅ Correo enviado a {recipient_email}')
        return True

    except Exception as e:
        print(f'❌ Error al enviar correo: {str(e)}')
        return False
