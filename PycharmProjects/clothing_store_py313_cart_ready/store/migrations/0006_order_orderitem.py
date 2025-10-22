# Generated migration for Order and OrderItem models

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('store', '0005_storeconfiguration_hero_background_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('customer_name', models.CharField(max_length=200, verbose_name='Nombre del Cliente')),
                ('customer_email', models.EmailField(max_length=254, verbose_name='Email')),
                ('customer_phone', models.CharField(blank=True, max_length=20, verbose_name='Teléfono')),
                ('shipping_address', models.TextField(verbose_name='Dirección de Envío')),
                ('shipping_city', models.CharField(max_length=100, verbose_name='Ciudad')),
                ('shipping_state', models.CharField(blank=True, max_length=100, verbose_name='Departamento/Estado')),
                ('shipping_zip', models.CharField(blank=True, max_length=20, verbose_name='Código Postal')),
                ('shipping_country', models.CharField(default='Colombia', max_length=100, verbose_name='País')),
                ('stripe_payment_intent_id', models.CharField(blank=True, max_length=255, verbose_name='Stripe Payment Intent ID')),
                ('stripe_charge_id', models.CharField(blank=True, max_length=255, verbose_name='Stripe Charge ID')),
                ('subtotal', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Subtotal')),
                ('shipping_cost', models.DecimalField(decimal_places=2, default=0, max_digits=10, verbose_name='Costo de Envío')),
                ('tax', models.DecimalField(decimal_places=2, default=0, max_digits=10, verbose_name='Impuestos')),
                ('total', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Total')),
                ('status', models.CharField(choices=[('pending', 'Pendiente'), ('paid', 'Pagado'), ('processing', 'Procesando'), ('shipped', 'Enviado'), ('delivered', 'Entregado'), ('cancelled', 'Cancelado')], default='pending', max_length=20, verbose_name='Estado')),
                ('notes', models.TextField(blank=True, verbose_name='Notas')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Última Actualización')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='orders', to=settings.AUTH_USER_MODEL, verbose_name='Usuario')),
            ],
            options={
                'verbose_name': 'Pedido',
                'verbose_name_plural': 'Pedidos',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_name', models.CharField(max_length=200, verbose_name='Nombre del Producto')),
                ('product_image', models.URLField(blank=True, verbose_name='Imagen del Producto')),
                ('size', models.CharField(blank=True, max_length=10, verbose_name='Talla')),
                ('color', models.CharField(blank=True, max_length=50, verbose_name='Color')),
                ('price', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Precio Unitario')),
                ('quantity', models.IntegerField(validators=[django.core.validators.MinValueValidator(1)], verbose_name='Cantidad')),
                ('subtotal', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Subtotal')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='store.order', verbose_name='Pedido')),
                ('product', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='store.product', verbose_name='Producto')),
            ],
            options={
                'verbose_name': 'Item de Pedido',
                'verbose_name_plural': 'Items de Pedido',
            },
        ),
    ]
