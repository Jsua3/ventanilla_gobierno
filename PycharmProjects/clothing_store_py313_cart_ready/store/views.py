from django.shortcuts import render, get_object_or_404
from django.db.models import Q
from django.core.paginator import Paginator
from .models import Banner, Category, Product, StoreConfiguration, Video, Service, HeritageSliderItem

def get_store_context():
    """Obtener contexto global de la tienda"""
    try:
        config = StoreConfiguration.objects.first()
    except:
        config = None
    
    return {
        'config': config,
        'main_categories': Category.objects.filter(parent=None, is_active=True)
    }

def index(request):
    """Vista de la página principal"""
    context = get_store_context()
    context.update({
        'banners': Banner.objects.filter(is_active=True),
        'featured_products': Product.objects.filter(is_featured=True, is_active=True)[:8],
        'featured_men_products': Product.objects.filter(is_featured=True, is_active=True, gender='M')[:8],
        'featured_women_products': Product.objects.filter(is_featured=True, is_active=True, gender='F')[:8],
        'kids_products': Product.objects.filter(is_featured=True, is_active=True, gender='K')[:8],
        'all_products': Product.objects.filter(is_active=True)[:8],
        'new_products': Product.objects.filter(is_new=True, is_active=True)[:8],
        'sale_products': Product.objects.filter(is_sale=True, is_active=True)[:8],
        'featured_categories': Category.objects.filter(is_featured=True, is_active=True)[:6],
        'videos': Video.objects.filter(is_active=True),
        'heritage_slider_items': HeritageSliderItem.objects.filter(is_active=True).order_by('order'),
    })
    return render(request, 'store/index.html', context)

def product_list(request):
    """Vista del listado de productos"""
    context = get_store_context()
    
    products = Product.objects.filter(is_active=True)
    
    # Filtros
    category_slug = request.GET.get('category')
    gender = request.GET.get('gender')
    search = request.GET.get('search')
    sort = request.GET.get('sort')
    
    if category_slug:
        category = get_object_or_404(Category, slug=category_slug, is_active=True)
        products = products.filter(category=category)
        context['current_category'] = category
    
    if gender:
        products = products.filter(gender=gender)
        context['current_gender'] = gender
    
    if search:
        products = products.filter(
            Q(name__icontains=search) | 
            Q(description__icontains=search)
        )
        context['search_query'] = search
    
    # Ordenamiento
    if sort == 'price_low':
        products = products.order_by('price')
    elif sort == 'price_high':
        products = products.order_by('-price')
    elif sort == 'newest':
        products = products.order_by('-created_at')
    elif sort == 'name':
        products = products.order_by('name')
    
    # Paginación
    paginator = Paginator(products, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context.update({
        'products': page_obj,
        'categories': Category.objects.filter(is_active=True),
    })
    
    return render(request, 'store/product_list.html', context)

def product_detail(request, slug):
    """Vista del detalle del producto"""
    context = get_store_context()
    product = get_object_or_404(Product, slug=slug, is_active=True)
    
    # Incrementar vistas
    product.views += 1
    product.save()
    
    # Productos relacionados
    related_products = Product.objects.filter(
        category=product.category,
        is_active=True
    ).exclude(id=product.id)[:4]
    
    context.update({
        'product': product,
        'related_products': related_products,
        'sizes': product.sizes.split(',') if product.sizes else [],
        'colors': product.colors.split(',') if product.colors else [],
    })
    
    return render(request, 'store/product_detail.html', context)

def category_detail(request, slug):
    """Vista de categoría específica"""
    context = get_store_context()
    category = get_object_or_404(Category, slug=slug, is_active=True)
    products = Product.objects.filter(category=category, is_active=True)

    # Paginación
    paginator = Paginator(products, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context.update({
        'category': category,
        'products': page_obj,
    })

    return render(request, 'store/category_detail.html', context)

def immersive_demo(request):
    """Vista de demostración de experiencia inmersiva 3D"""
    context = get_store_context()
    return render(request, 'store/immersive_demo.html', context)

def servicios(request):
    """Vista de la página de servicios"""
    context = get_store_context()
    context['services'] = Service.objects.filter(is_active=True).order_by('order', 'name')
    return render(request, 'store/servicios.html', context)

def products_kids(request):
    """Vista de productos para niños"""
    context = get_store_context()

    products = Product.objects.filter(is_active=True, gender='K')

    # Filtros
    search = request.GET.get('search')
    sort = request.GET.get('sort')

    if search:
        products = products.filter(
            Q(name__icontains=search) |
            Q(description__icontains=search)
        )
        context['search_query'] = search

    # Ordenamiento
    if sort == 'price_low':
        products = products.order_by('price')
    elif sort == 'price_high':
        products = products.order_by('-price')
    elif sort == 'newest':
        products = products.order_by('-created_at')
    elif sort == 'name':
        products = products.order_by('name')

    # Paginación
    paginator = Paginator(products, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context.update({
        'products': page_obj,
        'categories': Category.objects.filter(is_active=True),
        'current_gender': 'K',
        'page_title': 'Niños',
    })

    return render(request, 'store/product_list.html', context)

def products_all(request):
    """Vista de todos los productos"""
    context = get_store_context()

    products = Product.objects.filter(is_active=True)

    # Filtros
    category_slug = request.GET.get('category')
    gender = request.GET.get('gender')
    search = request.GET.get('search')
    sort = request.GET.get('sort')

    if category_slug:
        category = get_object_or_404(Category, slug=category_slug, is_active=True)
        products = products.filter(category=category)
        context['current_category'] = category

    if gender:
        products = products.filter(gender=gender)
        context['current_gender'] = gender

    if search:
        products = products.filter(
            Q(name__icontains=search) |
            Q(description__icontains=search)
        )
        context['search_query'] = search

    # Ordenamiento
    if sort == 'price_low':
        products = products.order_by('price')
    elif sort == 'price_high':
        products = products.order_by('-price')
    elif sort == 'newest':
        products = products.order_by('-created_at')
    elif sort == 'name':
        products = products.order_by('name')

    # Paginación
    paginator = Paginator(products, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context.update({
        'products': page_obj,
        'categories': Category.objects.filter(is_active=True),
        'page_title': 'Todos los Productos',
    })

    return render(request, 'store/product_list.html', context)

def search(request):
    """Vista dedicada de búsqueda de productos"""
    context = get_store_context()
    search_query = request.GET.get('q', '').strip()

    if search_query:
        # Búsqueda en nombre y descripción
        products = Product.objects.filter(
            Q(name__icontains=search_query) |
            Q(description__icontains=search_query),
            is_active=True
        ).select_related('category').order_by('-created_at')

        context.update({
            'search_query': search_query,
            'products': products,
            'product_count': products.count(),
        })
    else:
        context.update({
            'products': Product.objects.none(),
            'product_count': 0,
        })

    return render(request, 'store/search_results.html', context)

# Las vistas del carrito ahora están en la app 'cart'
