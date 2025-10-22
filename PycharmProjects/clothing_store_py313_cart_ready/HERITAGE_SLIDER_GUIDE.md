# 🎬 Guía: Heritage Collection Slider - Personalizable desde Admin

## Descripción General

El **Heritage Collection Slider** es una sección personalizable que permite mostrar colecciones destacadas con videos, descripciones y llamadas a la acción. Está totalmente configurable desde el panel de administración de Django.

## 📍 Ubicación en la Página

La sección aparece en el **index** (página principal), entre el botón de "Catálogo Completo" y la sección "Nuestras Colecciones".

## ⚙️ Cómo Acceder desde el Admin

1. Ve a: `http://localhost:8000/admin/`
2. Busca **"Items Heritage Slider"** en la sección Store
3. Haz clic en **"Añadir"** para crear un nuevo item

## 📝 Campos Disponibles

### **1. Contenido Principal**
- **Título**: Texto principal del slide (ej: "La Excelencia")
- **Parte Destacada del Título**: Texto que aparecerá en color dorado (ej: "en Textiles")
- **Descripción**: Texto descriptivo detallado de la colección

### **2. Badge (Etiqueta Superior)**
- **Texto del Badge**: Pequeño etiqueta que aparece arriba (ej: "Colección Exclusiva")
- **Icono del Badge**: Clase de Font Awesome (ej: `fas fa-crown`)
  - Ejemplos útiles:
    - `fas fa-crown` - Corona
    - `fas fa-bolt` - Rayo
    - `fas fa-star` - Estrella
    - `fas fa-heart` - Corazón
    - `fas fa-zap` - Energía

### **3. Botón de Acción (CTA)**
- **Texto del Botón**: Lo que dirá el botón (ej: "Descubrir Colección")
- **URL del Botón**: URL a donde irá al hacer clic
  - Ejemplos:
    - `/productos/` - Todos los productos
    - `/productos/ninos/` - Productos para niños
    - `/productos/?is_new=true` - Productos nuevos
    - `/productos/?is_sale=true` - Ofertas

### **4. Multimedia - Video**
Puedes usar **CUALQUIERA** de estas opciones:

#### **Opción A: Video Local (Recomendado)**
- **Archivo de Video Local**: Sube un archivo MP4 o WebM
- El video se reproducirá en bucle sin sonido en la sección izquierda
- **Miniatura del Video**: Imagen que aparecerá mientras se carga (opcional)

#### **Opción B: Video Externo**
- **URL del Video**: Pega un enlace de YouTube o Vimeo
- Se mostrará un icono de play sobre el fondo

**Si no subes video**, aparecerá el icono principal configurado en "Estilos Visuales"

### **5. Estilos Visuales**
- **Color Gradient 1, 2, 3**: Tres colores en formato hexadecimal (#RRGGBB)
  - Ejemplos de colores:
    - `#2d5016` - Verde oscuro
    - `#0047AB` - Azul oscuro
    - `#8B6914` - Dorado
    - `#FF6B35` - Naranja
    - `#1a1a1a` - Negro
    - `#ffffff` - Blanco
- **Icono Principal**: Clase Font Awesome que se muestra si no hay video
  - Ejemplos útiles:
    - `fas fa-shirt` - Camiseta
    - `fas fa-person-running` - Persona corriendo
    - `fas fa-shoe-prints` - Zapatos
    - `fas fa-dumbbell` - Pesa
    - `fas fa-microchip` - Chip/Tecnología

### **6. Configuración**
- **Orden**: Número que define la posición en el slider (0, 1, 2...)
- **Activo**: Marca si quieres que se muestre o no

## 🎨 Ejemplos de Configuración

### Ejemplo 1: Colección Premium
```
Título: La Excelencia
Parte Destacada: en Textiles
Descripción: Prendas elaboradas con los mejores materiales...
Badge: Colección Exclusiva
Icono Badge: fas fa-crown
CTA Texto: Descubrir Colección
CTA URL: /productos/
Colores: #2d5016, #3d6b1f, #5a9a3d (Verdes)
Icono: fas fa-shirt
```

### Ejemplo 2: Con Video Local
```
Título: Summer Collection 2024
Video Local: [Carga un MP4]
Miniatura: [Carga una imagen JPG]
[Configurar el resto igual que arriba]
```

### Ejemplo 3: Con Video de YouTube
```
Título: Nuestro Deporte
Video URL: https://www.youtube.com/watch?v=ejemplo
[Configurar el resto igual que arriba]
```

## 🎯 Cambiar el Orden de los Items

1. Ve a la lista de "Items Heritage Slider"
2. Edita el campo **"Orden"** directamente
3. Los items aparecerán en orden ascendente (0, 1, 2...)

## 🔄 Dinámico vs Hardcoded

**Antes:** Los items estaban hardcodeados en HTML con 3 items fijos
**Ahora:** Los items se cargan dinámicamente de la base de datos

- Si creas **0 items activos**: La sección NO aparecerá
- Si creas **1 item activo**: El slider mostrará solo ese item
- Si creas **10 items activos**: El slider funcionará con todos (¡los indicadores se adaptan!)

## 📱 Responsive

El slider se adapta automáticamente a:
- Desktop (imagen + texto lado a lado)
- Tablet (responsive)
- Mobile (texto encima, iconos grandes)

## 🎬 Soporte de Multimedia

### Formatos de Video Soportados
- **MP4** (recomendado)
- **WebM**
- **YouTube/Vimeo** (URLs)

### Características del Video
- ✅ Reproducción automática
- ✅ Sin sonido (muted)
- ✅ En bucle infinito
- ✅ Rellena toda el área de la imagen

## 💡 Consejos

1. **Mantén las descripciones cortas**: 2-3 oraciones máximo
2. **Usa colores contrastantes**: Los gradientes deben verse bien en modo claro y oscuro
3. **Videos ligeros**: Usa MP4 comprimidos para mejor rendimiento
4. **Iconos legibles**: Elige iconos que se vean bien en grande
5. **URLs correctas**: Verifica que los enlaces CTAs funcionen

## 🔍 Previsualización en Admin

En la lista de items, verás:
- 📹 Vista previa del video (si existe)
- 🖼️ Miniatura (si existe)
- ✅ Estado activo/inactivo
- 📅 Fecha de creación

## ❓ Preguntas Frecuentes

### P: ¿Puedo tener más de 3 items?
**R:** Sí, sin límite. El slider se adapta dinámicamente.

### P: ¿Puedo usar tanto video local como URL?
**R:** No. Usa SOLO uno. Si hay archivo local, la URL se ignora.

### P: ¿Qué tamaño deben tener los videos?
**R:** Recomendamos máximo 30-50 MB en MP4 comprimido.

### P: ¿Cómo cambio el tiempo de auto-play?
**R:** En el archivo `index.html`, busca `autoPlayInterval` y cambia el valor en milisegundos (actualmente 6000 = 6 segundos).

### P: ¿El slider funciona en modo oscuro?
**R:** Sí, los colores y estilos se adaptan automáticamente.

## 🚀 Próximas Funcionalidades (Futuro)

- [ ] Soporte para imágenes estáticas (como alternativa a video)
- [ ] Embed directo de YouTube/Vimeo sin URL
- [ ] Presets de colores predefinidos
- [ ] Animaciones configurables

---

## 📞 Soporte

Si encuentras problemas:
1. Verifica que los campos requeridos estén completos
2. Asegúrate de que el item esté marcado como **"Activo"**
3. Comprueba que los iconos Font Awesome sean válidos
4. Vacía el caché del navegador (Ctrl+Shift+Del)

¡Listo! Disfruta personalizando tu Heritage Slider. 🎉
