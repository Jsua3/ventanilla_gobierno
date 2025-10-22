from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator

class Banner(models.Model):
    """Modelo para los banners/sliders de la página principal"""
    title = models.CharField(max_length=200, verbose_name="Título")
    subtitle = models.CharField(max_length=300, blank=True, verbose_name="Subtítulo")
    image = models.ImageField(upload_to='banners/', verbose_name="Imagen")
    link = models.URLField(blank=True, verbose_name="Enlace")
    button_text = models.CharField(max_length=50, default="Ver más", verbose_name="Texto del botón")
    order = models.IntegerField(default=0, verbose_name="Orden")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']
        verbose_name = "Banner"
        verbose_name_plural = "Banners"

    def __str__(self):
        return self.title


class Category(models.Model):
    """Modelo para las categorías de productos"""
    name = models.CharField(max_length=100, verbose_name="Nombre")
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True, verbose_name="Descripción")
    image = models.ImageField(upload_to='categories/', blank=True, verbose_name="Imagen")
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, 
                              related_name='subcategories', verbose_name="Categoría padre")
    is_featured = models.BooleanField(default=False, verbose_name="Destacada")
    is_active = models.BooleanField(default=True, verbose_name="Activa")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    """Modelo para los productos"""
    GENDER_CHOICES = [
        ('M', 'Hombre'),
        ('F', 'Mujer'),
        ('K', 'Niños'),
        ('U', 'Unisex'),
    ]

    FIT_CHOICES = [
        ('PERFORMANCE', 'Performance Fit'),
        ('REGULAR', 'Regular Fit'),
        ('COMFORT', 'Comfort Fit'),
    ]

    SPORT_CHOICES = [
        ('RUNNING', 'Running'),
        ('CYCLING', 'Ciclismo'),
        ('FITNESS', 'Fitness'),
        ('TRAINING', 'Training'),
        ('TRIATHLON', 'Triatlón'),
        ('OUTDOOR', 'Outdoor'),
        ('SWIMMING', 'Natación'),
        ('YOGA', 'Yoga'),
    ]

    name = models.CharField(max_length=200, verbose_name="Nombre")
    slug = models.SlugField(unique=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE,
                                related_name='products', verbose_name="Categoría")
    description = models.TextField(verbose_name="Descripción")
    price = models.DecimalField(max_digits=10, decimal_places=2,
                                validators=[MinValueValidator(0)], verbose_name="Precio")
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                        validators=[MinValueValidator(0)],
                                        verbose_name="Precio con descuento")
    image_main = models.ImageField(upload_to='products/', verbose_name="Imagen principal")
    image_2 = models.ImageField(upload_to='products/', blank=True, verbose_name="Imagen 2")
    image_3 = models.ImageField(upload_to='products/', blank=True, verbose_name="Imagen 3")
    image_4 = models.ImageField(upload_to='products/', blank=True, verbose_name="Imagen 4")

    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='U', verbose_name="Género")
    sizes = models.CharField(max_length=100, help_text="Ej: S,M,L,XL", verbose_name="Tallas disponibles")
    colors = models.CharField(max_length=200, help_text="Ej: Rojo,Azul,Negro", verbose_name="Colores disponibles")

    # WARSTKI specific fields
    fit_type = models.CharField(max_length=20, choices=FIT_CHOICES, default='REGULAR', verbose_name="Tipo de Ajuste")
    sport = models.CharField(max_length=20, choices=SPORT_CHOICES, default='TRAINING', verbose_name="Deporte")
    weight_grams = models.IntegerField(null=True, blank=True, verbose_name="Peso (gramos)")
    uv_protection = models.IntegerField(null=True, blank=True, verbose_name="Factor UV",
                                       validators=[MinValueValidator(0), MaxValueValidator(100)])
    composition = models.CharField(max_length=300, blank=True, verbose_name="Composición",
                                  help_text="Ej: 85% Poliéster, 15% Spandex")

    stock = models.IntegerField(default=0, validators=[MinValueValidator(0)], verbose_name="Stock")
    is_featured = models.BooleanField(default=False, verbose_name="Destacado")
    is_new = models.BooleanField(default=True, verbose_name="Nuevo")
    is_sale = models.BooleanField(default=False, verbose_name="En oferta")
    is_active = models.BooleanField(default=True, verbose_name="Activo")

    views = models.IntegerField(default=0, verbose_name="Vistas")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Producto"
        verbose_name_plural = "Productos"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def get_discount_percentage(self):
        if self.discount_price:
            discount = (self.price - self.discount_price) / self.price * 100
            return round(discount)
        return 0

    def get_final_price(self):
        if self.discount_price:
            return self.discount_price
        return self.price

    def __str__(self):
        return self.name


class StoreConfiguration(models.Model):
    """Configuración general de la tienda"""
    store_name = models.CharField(max_length=100, default="WARSTKI®", verbose_name="Nombre de la tienda")
    logo = models.ImageField(upload_to='config/', blank=True, verbose_name="Logo")
    favicon = models.ImageField(upload_to='config/', blank=True, verbose_name="Favicon")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Teléfono")
    email = models.EmailField(blank=True, verbose_name="Email")
    address = models.TextField(blank=True, verbose_name="Dirección")
    facebook = models.URLField(blank=True, verbose_name="Facebook")
    instagram = models.URLField(blank=True, verbose_name="Instagram")
    twitter = models.URLField(blank=True, verbose_name="Twitter")
    tiktok = models.URLField(blank=True, verbose_name="TikTok")
    youtube = models.URLField(blank=True, verbose_name="YouTube")
    whatsapp = models.CharField(max_length=20, blank=True, verbose_name="WhatsApp")
    about_us = models.TextField(blank=True, verbose_name="Sobre nosotros",
                                default="El deporte está en nuestro ADN. Ropa diseñada para los deportistas más exigentes que están en busca de su mejor compañero para la aventura.")
    shipping_info = models.TextField(blank=True, verbose_name="Información de envío")
    return_policy = models.TextField(blank=True, verbose_name="Política de devoluciones")

    # WARSTKI branding
    slogan = models.CharField(max_length=300, blank=True, verbose_name="Slogan",
                             default="Ropa diseñada para los deportistas más exigentes")
    manifesto_text = models.TextField(blank=True, verbose_name="Texto Manifiesto",
                                     default="El deporte está en nuestro ADN\nExcelencia en cada puntada\nTecnología que no te limita, te impulsa")

    # Personalización de colores
    color_primary = models.CharField(max_length=7, default="#00D9FF", verbose_name="Color Principal (Botones, Acentos)",
                                     help_text="Formato hexadecimal: #00D9FF")
    color_background = models.CharField(max_length=7, default="#000000", verbose_name="Color de Fondo Principal",
                                       help_text="Formato hexadecimal: #000000")
    color_cards = models.CharField(max_length=7, default="#1F1F1F", verbose_name="Color de Tarjetas y Secciones",
                                  help_text="Formato hexadecimal: #1F1F1F")
    color_text = models.CharField(max_length=7, default="#FFFFFF", verbose_name="Color de Texto",
                                 help_text="Formato hexadecimal: #FFFFFF")
    color_text_secondary = models.CharField(max_length=7, default="#FFFFFF", verbose_name="Color de Texto Secundario",
                                           help_text="Formato hexadecimal: #FFFFFF")
    color_navbar = models.CharField(max_length=7, default="#000000", verbose_name="Color del Header/Navbar",
                                   help_text="Formato hexadecimal: #000000")
    color_footer = models.CharField(max_length=7, default="#000000", verbose_name="Color del Footer",
                                   help_text="Formato hexadecimal: #000000")
    color_icons = models.CharField(max_length=7, default="#00D9FF", verbose_name="Color de Iconos",
                                  help_text="Formato hexadecimal: #00D9FF")

    # Opacidades (0-100)
    opacity_background = models.IntegerField(default=100, validators=[MinValueValidator(0), MaxValueValidator(100)],
                                            verbose_name="Opacidad del Fondo (%)", help_text="0-100")
    opacity_cards = models.IntegerField(default=20, validators=[MinValueValidator(0), MaxValueValidator(100)],
                                       verbose_name="Opacidad de Tarjetas (%)", help_text="0-100")
    opacity_navbar = models.IntegerField(default=60, validators=[MinValueValidator(0), MaxValueValidator(100)],
                                        verbose_name="Opacidad del Navbar (%)", help_text="0-100")
    opacity_footer = models.IntegerField(default=60, validators=[MinValueValidator(0), MaxValueValidator(100)],
                                        verbose_name="Opacidad del Footer (%)", help_text="0-100")

    # Imagen de fondo
    background_image = models.ImageField(upload_to='config/', blank=True, verbose_name="Imagen de Fondo",
                                        help_text="Imagen de fondo con efecto blur al hacer scroll")
    background_blur_amount = models.IntegerField(default=20, validators=[MinValueValidator(0), MaxValueValidator(50)],
                                                 verbose_name="Cantidad de Blur (px)", help_text="0-50 píxeles")

    # Imagen de fondo para sección Nueva Colección
    hero_background_image = models.ImageField(upload_to='config/hero/', blank=True,
                                             verbose_name="Imagen de Fondo - Nueva Colección",
                                             help_text="Imagen de fondo para la sección principal/hero de Nueva Colección")

    # Imagen para sección Quiénes Somos
    about_us_image = models.ImageField(upload_to='config/about/', blank=True,
                                      verbose_name="Imagen - Quiénes Somos",
                                      help_text="Imagen para la sección 'Quiénes Somos' (taller, equipo, producción)")

    # Imágenes separadoras de secciones
    men_separator_image = models.ImageField(upload_to='config/separators/', blank=True,
                                           verbose_name="Imagen Separadora - Sección Hombres",
                                           help_text="Imagen de ancho completo que separa la sección de productos destacados de hombre")
    women_separator_image = models.ImageField(upload_to='config/separators/', blank=True,
                                             verbose_name="Imagen Separadora - Sección Mujeres",
                                             help_text="Imagen de ancho completo que separa la sección de productos destacados de mujer")

    # Títulos de secciones de la página principal
    section_title_hero = models.CharField(max_length=200, blank=True, verbose_name="Título Hero",
                                         default="NUEVA COLECCIÓN",
                                         help_text="Título principal del hero")
    section_subtitle_hero = models.CharField(max_length=200, blank=True, verbose_name="Subtítulo Hero",
                                            default="NEW ERA",
                                            help_text="Subtítulo destacado del hero")
    section_title_videos = models.CharField(max_length=200, blank=True, verbose_name="Título Sección Videos",
                                           default="Experiencia WARSTKI",
                                           help_text="Título de la sección de videos")
    section_subtitle_videos = models.TextField(blank=True, verbose_name="Subtítulo Sección Videos",
                                              default="Vive la energía de nuestro deporte: donde la tecnología, la pasión y el diseño se mezclan para dar vida a cada prenda.",
                                              help_text="Descripción de la sección de videos")
    section_title_new_products = models.CharField(max_length=200, blank=True, verbose_name="Título Productos Nuevos",
                                                  default="Nueva Colección NEW ERA",
                                                  help_text="Título de la sección de productos nuevos")
    section_subtitle_new_products = models.TextField(blank=True, verbose_name="Subtítulo Productos Nuevos",
                                                    default="Lo último en tecnología deportiva italiana. Rendimiento que supera marcas que cobran el doble.",
                                                    help_text="Descripción de productos nuevos")
    section_title_sports = models.CharField(max_length=200, blank=True, verbose_name="Título Sección Deportes",
                                           default="Encuentra Tu Deporte",
                                           help_text="Título de la sección de categorías deportivas")
    section_subtitle_sports = models.TextField(blank=True, verbose_name="Subtítulo Sección Deportes",
                                              default="Ropa técnica especializada para cada disciplina deportiva",
                                              help_text="Descripción de la sección de deportes")
    section_title_sale = models.CharField(max_length=200, blank=True, verbose_name="Título Ofertas",
                                         default="Ofertas Especiales",
                                         help_text="Título de la sección de ofertas")
    section_subtitle_sale = models.TextField(blank=True, verbose_name="Subtítulo Ofertas",
                                            default="Descuentos increíbles en tu ropa técnica favorita",
                                            help_text="Descripción de la sección de ofertas")
    section_title_sustainability = models.CharField(max_length=200, blank=True, verbose_name="Título Sostenibilidad",
                                                   default="Compromiso Sostenible",
                                                   help_text="Título de la sección de sostenibilidad")
    section_subtitle_sustainability = models.TextField(blank=True, verbose_name="Subtítulo Sostenibilidad",
                                                      default="Materiales con químicos seguros para personas y el ambiente. Porque el planeta también es nuestro campo de juego.",
                                                      help_text="Descripción de sostenibilidad")
    section_title_custom = models.CharField(max_length=200, blank=True, verbose_name="Título Custom",
                                           default="WARSTKI Custom",
                                           help_text="Título de la sección de personalización")
    section_subtitle_custom = models.TextField(blank=True, verbose_name="Subtítulo Custom",
                                              default="Diseña tu propia ropa deportiva con colores y logos personalizados",
                                              help_text="Descripción de personalización")
    section_title_newsletter = models.CharField(max_length=200, blank=True, verbose_name="Título Newsletter",
                                               default="Únete a la Comunidad WARSTKI",
                                               help_text="Título del newsletter")
    section_subtitle_newsletter = models.TextField(blank=True, verbose_name="Subtítulo Newsletter",
                                                  default="Recibe ofertas exclusivas, lanzamientos y consejos de entrenamiento",
                                                  help_text="Descripción del newsletter")

    class Meta:
        verbose_name = "Configuración de la Tienda"
        verbose_name_plural = "Configuración de la Tienda"

    def __str__(self):
        return self.store_name

    def save(self, *args, **kwargs):
        # Asegurar que solo exista una configuración
        self.pk = 1
        super().save(*args, **kwargs)


class Video(models.Model):
    """Modelo para videos del carrusel de experiencia"""
    title = models.CharField(max_length=200, verbose_name="Título")
    description = models.TextField(blank=True, verbose_name="Descripción")
    video_file = models.FileField(upload_to='videos/', verbose_name="Archivo de Video",
                                  help_text="Formatos recomendados: MP4, WebM")
    thumbnail = models.ImageField(upload_to='video_thumbnails/', blank=True,
                                 verbose_name="Miniatura",
                                 help_text="Imagen de previsualización del video")
    order = models.IntegerField(default=0, verbose_name="Orden",
                               help_text="Los videos se mostrarán en orden ascendente")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = "Video"
        verbose_name_plural = "Videos"

    def __str__(self):
        return self.title


class Service(models.Model):
    """Modelo para gestionar los servicios de la empresa"""
    name = models.CharField(max_length=200, verbose_name="Nombre del Servicio")
    slug = models.SlugField(max_length=200, unique=True, blank=True, verbose_name="Slug")
    description = models.TextField(verbose_name="Descripción",
                                   help_text="Descripción detallada del servicio")
    icon = models.CharField(max_length=50, verbose_name="Ícono Font Awesome",
                           default="fas fa-concierge-bell",
                           help_text="Clase de Font Awesome (ej: 'fas fa-cut', 'fas fa-scissors')")
    image = models.ImageField(upload_to='services/', verbose_name="Imagen del Servicio",
                             help_text="Imagen representativa del servicio (recomendado: 800x600px)")

    # Características del servicio (hasta 3)
    feature_1 = models.CharField(max_length=200, blank=True, verbose_name="Característica 1")
    feature_2 = models.CharField(max_length=200, blank=True, verbose_name="Característica 2")
    feature_3 = models.CharField(max_length=200, blank=True, verbose_name="Característica 3")

    # Orden y visibilidad
    order = models.IntegerField(default=0, verbose_name="Orden",
                               help_text="Los servicios se mostrarán en orden ascendente")
    is_active = models.BooleanField(default=True, verbose_name="Activo")

    # Layout alternado (izquierda/derecha)
    layout_reverse = models.BooleanField(default=False, verbose_name="Invertir Layout",
                                        help_text="Marcar para mostrar la imagen a la izquierda y texto a la derecha")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = "Servicio"
        verbose_name_plural = "Servicios"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Auto-generar slug si no existe
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Order(models.Model):
    """Modelo para pedidos/órdenes de compra"""
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('paid', 'Pagado'),
        ('processing', 'Procesando'),
        ('shipped', 'Enviado'),
        ('delivered', 'Entregado'),
        ('cancelled', 'Cancelado'),
    ]

    # Información del cliente
    customer_name = models.CharField(max_length=200, verbose_name="Nombre del Cliente")
    customer_email = models.EmailField(verbose_name="Email")
    customer_phone = models.CharField(max_length=20, blank=True, verbose_name="Teléfono")

    # Dirección de envío
    shipping_address = models.TextField(verbose_name="Dirección de Envío")
    shipping_city = models.CharField(max_length=100, verbose_name="Ciudad")
    shipping_state = models.CharField(max_length=100, blank=True, verbose_name="Departamento/Estado")
    shipping_zip = models.CharField(max_length=20, blank=True, verbose_name="Código Postal")
    shipping_country = models.CharField(max_length=100, default="Colombia", verbose_name="País")

    # Información de pago
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True, verbose_name="Stripe Payment Intent ID")
    stripe_charge_id = models.CharField(max_length=255, blank=True, verbose_name="Stripe Charge ID")

    # Montos
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Subtotal")
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Costo de Envío")
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Impuestos")
    total = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Total")

    # Estado
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Estado")

    # Notas
    notes = models.TextField(blank=True, verbose_name="Notas")

    # Fechas
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Última Actualización")

    # Usuario (opcional, para órdenes de usuarios autenticados)
    user = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True,
                            related_name='orders', verbose_name="Usuario")

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Pedido"
        verbose_name_plural = "Pedidos"

    @property
    def order_number(self):
        """Genera un número de pedido formateado"""
        from datetime import datetime
        date_str = self.created_at.strftime('%Y%m%d') if self.created_at else datetime.now().strftime('%Y%m%d')
        return f"ORD-{date_str}-{self.id:04d}"

    def __str__(self):
        return f"{self.order_number} - {self.customer_name}"


class OrderItem(models.Model):
    """Items individuales de cada pedido"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', verbose_name="Pedido")
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, verbose_name="Producto")

    # Guardamos info del producto en caso de que se elimine
    product_name = models.CharField(max_length=200, verbose_name="Nombre del Producto")
    product_image = models.URLField(blank=True, verbose_name="Imagen del Producto")

    # Variantes seleccionadas
    size = models.CharField(max_length=10, blank=True, verbose_name="Talla")
    color = models.CharField(max_length=50, blank=True, verbose_name="Color")

    # Precio y cantidad
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio Unitario")
    quantity = models.IntegerField(validators=[MinValueValidator(1)], verbose_name="Cantidad")

    # Subtotal calculado
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Subtotal")

    class Meta:
        verbose_name = "Item de Pedido"
        verbose_name_plural = "Items de Pedido"

    def save(self, *args, **kwargs):
        # Calcular subtotal automáticamente
        self.subtotal = self.price * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product_name} x{self.quantity} - ${self.subtotal}"
