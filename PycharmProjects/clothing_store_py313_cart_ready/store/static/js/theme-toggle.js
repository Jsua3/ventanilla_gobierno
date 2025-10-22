/**
 * Theme Toggle - Modo Claro/Oscuro
 * Maneja el cambio entre tema claro (fondo blanco) y oscuro (fondo negro)
 * Usa el botón existente en el header
 */

class ThemeToggle {
  constructor() {
    this.STORAGE_KEY = 'weiss-sport-theme';
    this.DARK_MODE_CLASS = 'dark-mode';
    this.toggleBtn = null;
    this.init();
  }

  init() {
    // Cargar preferencia guardada o usar preferencia del sistema
    const savedTheme = this.getSavedTheme();
    const systemPreference = this.getSystemPreference();
    const themeToUse = savedTheme || systemPreference;

    // Aplicar tema (sin transición en carga inicial)
    this.setTheme(themeToUse, true);

    // Escuchar cambios de preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.getSavedTheme()) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });

    // Buscar y configurar el botón toggle existente
    this.setupToggleButton();
  }

  getSavedTheme() {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  setTheme(theme, isInitial = false) {
    const isDarkMode = theme === 'dark';

    if (isDarkMode) {
      document.body.classList.add(this.DARK_MODE_CLASS);
    } else {
      document.body.classList.remove(this.DARK_MODE_CLASS);
    }

    // Guardar preferencia
    localStorage.setItem(this.STORAGE_KEY, theme);

    // Actualizar botón toggle
    this.updateToggleButton(isDarkMode);

    // Emitir evento personalizado
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme, isInitial } }));
  }

  toggleTheme() {
    const isDarkMode = document.body.classList.contains(this.DARK_MODE_CLASS);
    this.setTheme(isDarkMode ? 'light' : 'dark');
  }

  setupToggleButton() {
    // Buscar el botón existente en el header
    this.toggleBtn = document.querySelector('.theme-toggle');

    if (!this.toggleBtn) {
      console.warn('Theme toggle button not found in header');
      return;
    }

    // Agregar evento de click
    this.toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleTheme();
    });
  }

  updateToggleButton(isDarkMode) {
    if (!this.toggleBtn) {
      this.toggleBtn = document.querySelector('.theme-toggle');
    }

    if (this.toggleBtn) {
      // Actualizar el icono (Font Awesome)
      const icon = this.toggleBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-moon', 'fa-sun');
        icon.classList.add(isDarkMode ? 'fa-sun' : 'fa-moon');
      }

      // Actualizar el título (tooltip)
      this.toggleBtn.title = isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    }
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ThemeToggle();
  });
} else {
  new ThemeToggle();
}
