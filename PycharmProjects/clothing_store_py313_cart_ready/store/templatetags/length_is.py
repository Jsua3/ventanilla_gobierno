from django import template

register = template.Library()


@register.filter(name='length_is')
def length_is(value, arg):
    """
    Returns True if the value's length is the argument, False otherwise.
    Usage: {% if items|length_is:5 %}
    """
    try:
        return len(value) == int(arg)
    except (ValueError, TypeError, AttributeError):
        return False
