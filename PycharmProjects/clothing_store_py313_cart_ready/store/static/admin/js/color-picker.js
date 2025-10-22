/* Color Picker for Django Admin */

document.addEventListener('DOMContentLoaded', function() {
    // Lista de campos de color
    const colorFields = [
        'color_primary',
        'color_background',
        'color_cards',
        'color_navbar',
        'color_footer',
        'color_text',
        'color_text_secondary',
        'color_icons'
    ];

    colorFields.forEach(function(fieldName) {
        const input = document.getElementById('id_' + fieldName);
        if (input) {
            // Cambiar el tipo de input a color para navegadores compatibles
            const colorPicker = document.createElement('input');
            colorPicker.type = 'color';
            colorPicker.value = input.value || '#000000';
            colorPicker.style.width = '50px';
            colorPicker.style.height = '40px';
            colorPicker.style.border = '2px solid #ddd';
            colorPicker.style.borderRadius = '4px';
            colorPicker.style.cursor = 'pointer';
            colorPicker.style.marginLeft = '10px';

            // Sincronizar color picker con input de texto
            colorPicker.addEventListener('input', function() {
                input.value = colorPicker.value.toUpperCase();
            });

            // Sincronizar input de texto con color picker
            input.addEventListener('input', function() {
                if (/^#[0-9A-F]{6}$/i.test(input.value)) {
                    colorPicker.value = input.value;
                }
            });

            // Insertar el color picker después del input
            input.parentNode.insertBefore(colorPicker, input.nextSibling);

            // Agregar placeholder y estilo al input de texto
            input.placeholder = '#000000';
            input.style.textTransform = 'uppercase';
        }
    });

    // Validación en tiempo real para campos de color
    colorFields.forEach(function(fieldName) {
        const input = document.getElementById('id_' + fieldName);
        if (input) {
            input.addEventListener('blur', function() {
                const value = input.value.toUpperCase();
                if (value && !/^#[0-9A-F]{6}$/i.test(value)) {
                    alert('El color debe estar en formato hexadecimal: #RRGGBB (ejemplo: #00D9FF)');
                    input.focus();
                }
            });
        }
    });

    // Validación para campos de opacidad
    const opacityFields = ['opacity_background', 'opacity_navbar', 'opacity_footer', 'opacity_cards'];
    opacityFields.forEach(function(fieldName) {
        const input = document.getElementById('id_' + fieldName);
        if (input) {
            input.addEventListener('input', function() {
                const value = parseInt(input.value);
                if (value < 0) input.value = 0;
                if (value > 100) input.value = 100;
            });
        }
    });

    // Validación para blur amount
    const blurInput = document.getElementById('id_background_blur_amount');
    if (blurInput) {
        blurInput.addEventListener('input', function() {
            const value = parseInt(blurInput.value);
            if (value < 0) blurInput.value = 0;
            if (value > 50) blurInput.value = 50;
        });
    }
});
