from django.contrib import admin
from django.utils.html import format_html
from .models import Banner, Category, Product, StoreConfiguration, Video, Service, Order, OrderItem

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ['title', 'subtitle', 'order', 'is_active', 'image_preview']
    list_filter = ['is_active', 'created_at']
    list_editable = ['order', 'is_active']
    search_fields = ['title', 'subtitle']
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height: 50px;"/>', obj.image.url)
        return "Sin imagen"
    image_preview.short_description = "Vista previa"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent', 'is_featured', 'is_active', 'image_preview']
    list_filter = ['is_featured', 'is_active', 'parent']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_featured', 'is_active']
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height: 50px;"/>', obj.image.url)
        return "Sin imagen"
    image_preview.short_description = "Vista previa"


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'discount_price', 'stock', 
                   'is_featured', 'is_new', 'is_sale', 'is_active', 'image_preview']
    list_filter = ['category', 'gender', 'is_featured', 'is_new', 'is_sale', 'is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['price', 'discount_price', 'stock', 'is_featured', 'is_new', 'is_sale', 'is_active']
    readonly_fields = ['views']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('name', 'slug', 'category', 'description', 'gender')
        }),
        ('Precios y Stock', {
            'fields': ('price', 'discount_price', 'stock')
        }),
        ('Imágenes', {
            'fields': ('image_main', 'image_2', 'image_3', 'image_4')
        }),
        ('Variantes', {
            'fields': ('sizes', 'colors')
        }),
        ('Estado', {
            'fields': ('is_featured', 'is_new', 'is_sale', 'is_active', 'views')
        }),
    )
    
    def image_preview(self, obj):
        if obj.image_main:
            return format_html('<img src="{}" style="height: 50px;"/>', obj.image_main.url)
        return "Sin imagen"
    image_preview.short_description = "Vista previa"


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    """Admin para gestionar videos del carrusel"""
    list_display = ['title', 'order', 'is_active', 'video_preview', 'thumbnail_preview', 'created_at']
    list_filter = ['is_active', 'created_at']
    list_editable = ['order', 'is_active']
    search_fields = ['title', 'description']
    ordering = ['order', '-created_at']

    fieldsets = (
        ('Información del Video', {
            'fields': ('title', 'description')
        }),
        ('Archivos', {
            'fields': ('video_file', 'thumbnail'),
            'description': 'Sube el archivo de video (MP4 recomendado) y opcionalmente una miniatura.'
        }),
        ('Configuración', {
            'fields': ('order', 'is_active'),
            'description': 'Define el orden de aparición en el carrusel y si está activo.'
        }),
    )

    readonly_fields = ['created_at', 'updated_at']

    def video_preview(self, obj):
        """Preview del video en el admin"""
        if obj.video_file:
            return format_html(
                '<video width="150" height="100" controls>'
                '<source src="{}" type="video/mp4">'
                'Tu navegador no soporta el tag de video.'
                '</video>',
                obj.video_file.url
            )
        return "Sin video"
    video_preview.short_description = "Vista previa del video"

    def thumbnail_preview(self, obj):
        """Preview del thumbnail"""
        if obj.thumbnail:
            return format_html('<img src="{}" style="height: 50px;"/>', obj.thumbnail.url)
        return "Sin miniatura"
    thumbnail_preview.short_description = "Miniatura"

    class Media:
        css = {
            'all': ('admin/css/video_admin.css',)
        }


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    """Admin para gestionar los servicios de la empresa"""
    list_display = ['name', 'order', 'is_active', 'layout_reverse', 'image_preview', 'created_at']
    list_filter = ['is_active', 'created_at']
    list_editable = ['order', 'is_active', 'layout_reverse']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', 'name']

    fieldsets = (
        ('Información del Servicio', {
            'fields': ('name', 'slug', 'description', 'icon')
        }),
        ('Imagen', {
            'fields': ('image',),
            'description': 'Sube una imagen representativa del servicio (800x600px recomendado).'
        }),
        ('Características', {
            'fields': ('feature_1', 'feature_2', 'feature_3'),
            'description': 'Añade hasta 3 características principales del servicio.'
        }),
        ('Configuración', {
            'fields': ('order', 'is_active', 'layout_reverse'),
            'description': 'Define el orden, visibilidad y disposición de la imagen/texto.'
        }),
    )

    readonly_fields = ['created_at', 'updated_at']

    def image_preview(self, obj):
        """Preview de la imagen en el admin"""
        if obj.image:
            return format_html('<img src="{}" style="height: 50px;"/>', obj.image.url)
        return "Sin imagen"
    image_preview.short_description = "Vista previa"


@admin.register(StoreConfiguration)
class StoreConfigurationAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Información General', {
            'fields': ('store_name', 'logo', 'favicon')
        }),
        ('Contacto', {
            'fields': ('phone', 'email', 'address', 'whatsapp')
        }),
        ('Redes Sociales', {
            'fields': ('facebook', 'instagram', 'twitter')
        }),
        ('Información Legal', {
            'fields': ('about_us', 'shipping_info', 'return_policy')
        }),
        ('🎨 Personalización de Colores', {
            'fields': (
                'color_primary',
                'color_background',
                'color_cards',
                'color_navbar',
                'color_footer',
                'color_text',
                'color_text_secondary',
                'color_icons',
            ),
            'description': 'Personaliza los colores de la interfaz de tu tienda. Usa formato hexadecimal (#RRGGBB).'
        }),
        ('🔲 Opacidades', {
            'fields': (
                'opacity_background',
                'opacity_navbar',
                'opacity_footer',
                'opacity_cards',
            ),
            'description': 'Controla la transparencia de diferentes secciones (0-100%).'
        }),
        ('🖼️ Imágenes de Fondo y Secciones', {
            'fields': (
                'background_image',
                'background_blur_amount',
                'hero_background_image',
                'about_us_image',
                'men_separator_image',
                'women_separator_image',
            ),
            'description': 'Añade imágenes de fondo y separadoras. Las imágenes separadoras se mostrarán de lado a lado entre secciones.'
        }),
        ('📝 Títulos de Secciones - Página Principal', {
            'fields': (
                'section_title_hero',
                'section_subtitle_hero',
                'section_title_videos',
                'section_subtitle_videos',
                'section_title_new_products',
                'section_subtitle_new_products',
                'section_title_sports',
                'section_subtitle_sports',
                'section_title_sale',
                'section_subtitle_sale',
                'section_title_sustainability',
                'section_subtitle_sustainability',
                'section_title_custom',
                'section_subtitle_custom',
                'section_title_newsletter',
                'section_subtitle_newsletter',
            ),
            'description': 'Personaliza los títulos y subtítulos de cada sección de la página principal.',
            'classes': ('collapse',)
        }),
    )

    class Media:
        css = {
            'all': ('admin/css/color-picker.css',)
        }
        js = ('admin/js/color-picker.js',)

    def has_add_permission(self, request):
        # Solo permitir una configuración
        return not StoreConfiguration.objects.exists()


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'product_name', 'size', 'color', 'price', 'quantity', 'subtotal']
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'customer_name', 'customer_email', 'total', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['order_number', 'customer_name', 'customer_email', 'stripe_payment_intent_id']
    readonly_fields = ['order_number', 'created_at', 'updated_at', 'stripe_payment_intent_id',
                      'stripe_charge_id', 'subtotal', 'shipping_cost', 'tax', 'total']
    inlines = [OrderItemInline]

    fieldsets = (
        ('Información del Pedido', {
            'fields': ('order_number', 'status', 'created_at', 'updated_at')
        }),
        ('Información del Cliente', {
            'fields': ('customer_name', 'customer_email', 'customer_phone')
        }),
        ('Dirección de Envío', {
            'fields': ('shipping_address', 'shipping_city', 'shipping_state', 'shipping_zip', 'shipping_country')
        }),
        ('Información de Pago', {
            'fields': ('stripe_payment_intent_id', 'stripe_charge_id', 'subtotal', 'shipping_cost', 'tax', 'total')
        }),
        ('Notas', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
    )

    def has_add_permission(self, request):
        # No permitir crear órdenes manualmente desde admin
        return False
