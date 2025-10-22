from django import template

register = template.Library()

@register.filter
def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    if not hex_color or not hex_color.startswith('#'):
        return "0, 0, 0"

    hex_color = hex_color.lstrip('#')
    if len(hex_color) == 6:
        r = int(hex_color[0:2], 16)
        g = int(hex_color[2:4], 16)
        b = int(hex_color[4:6], 16)
        return f"{r}, {g}, {b}"
    return "0, 0, 0"

@register.filter
def opacity_to_decimal(opacity):
    """Convert opacity percentage (0-100) to decimal (0-1)"""
    try:
        return float(opacity) / 100
    except (ValueError, TypeError):
        return 1.0
