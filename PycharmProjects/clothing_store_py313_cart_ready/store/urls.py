from django.urls import path
from . import views, cart_views, payment_views

app_name = 'store'

urlpatterns = [
    # Páginas principales
    path('', views.index, name='index'),
    path('servicios/', views.servicios, name='servicios'),
    path('productos/', views.product_list, name='product_list'),
    path('niños/', views.products_kids, name='products_kids'),
    path('todos/', views.products_all, name='products_all'),
    path('buscar/', views.search, name='search'),
    path('producto/<slug:slug>/', views.product_detail, name='product_detail'),
    path('categoria/<slug:slug>/', views.category_detail, name='category_detail'),

    # Experiencia inmersiva 3D
    path('experiencia-3d/', views.immersive_demo, name='immersive_demo'),

    # APIs del carrito
    path('api/cart/add/', cart_views.cart_add, name='cart_add'),
    path('api/cart/validate/', cart_views.validate_cart, name='cart_validate'),
    path('api/send-receipt/', cart_views.send_receipt, name='send_receipt'),

    # Pago con Stripe
    path('checkout/', payment_views.checkout, name='checkout'),
    path('api/create-payment-intent/', payment_views.create_payment_intent, name='create_payment_intent'),
    path('api/confirm-payment/', payment_views.confirm_payment, name='confirm_payment'),
    path('order-confirmation/<str:order_number>/', payment_views.order_confirmation, name='order_confirmation'),
    path('webhook/stripe/', payment_views.stripe_webhook, name='stripe_webhook'),
]
