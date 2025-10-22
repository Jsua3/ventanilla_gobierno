/**
 * WARSTKI® Custom Product Configurator
 * Interactive design tool for custom athletic wear
 */

class WarstskiConfigurator {
  constructor(container) {
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    if (!this.container) {
      console.error('Configurator: Container not found');
      return;
    }

    this.state = {
      productType: 'jersey',
      gender: 'M',
      sport: 'RUNNING',
      fitType: 'PERFORMANCE',
      baseColor: '#0047AB',
      accentColor: '#FF6B35',
      logoUrl: null,
      logoPosition: 'center',
      customText: '',
      textColor: '#FFFFFF',
      pattern: 'solid',
      quantity: 1
    };

    this.init();
  }

  init() {
    this.render();
    this.setup3DViewer();
    this.attachEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="warstki-configurator">
        <!-- Preview Section -->
        <div class="configurator-preview">
          <div id="configurator-3d-view" class="preview-3d"></div>

          <div class="preview-controls">
            <button class="preview-control-btn" onclick="configurator.rotate3D('left')">
              <i class="fas fa-undo"></i>
            </button>
            <button class="preview-control-btn" onclick="configurator.rotate3D('right')">
              <i class="fas fa-redo"></i>
            </button>
            <button class="preview-control-btn" onclick="configurator.reset3D()">
              <i class="fas fa-sync"></i>
            </button>
          </div>

          <div class="preview-info">
            <h3>Vista Previa en Tiempo Real</h3>
            <p>Arrastra para rotar • Scroll para zoom</p>
          </div>
        </div>

        <!-- Configuration Panel -->
        <div class="configurator-panel">
          <div class="configurator-header">
            <h2><i class="fas fa-palette"></i> WARSTKI® Custom</h2>
            <p>Diseña tu propia ropa deportiva profesional</p>
          </div>

          <div class="configurator-steps">
            <!-- Step 1: Product Type -->
            <div class="config-step active" data-step="1">
              <div class="step-header">
                <span class="step-number">1</span>
                <h3>Tipo de Producto</h3>
              </div>
              <div class="step-content">
                <div class="option-grid">
                  <div class="option-card ${this.state.productType === 'jersey' ? 'selected' : ''}" data-value="jersey">
                    <i class="fas fa-tshirt"></i>
                    <span>Jersey/Camiseta</span>
                  </div>
                  <div class="option-card ${this.state.productType === 'short' ? 'selected' : ''}" data-value="short">
                    <i class="fas fa-running"></i>
                    <span>Short/Pantaloneta</span>
                  </div>
                  <div class="option-card ${this.state.productType === 'tight' ? 'selected' : ''}" data-value="tight">
                    <i class="fas fa-user"></i>
                    <span>Tight/Malla</span>
                  </div>
                  <div class="option-card ${this.state.productType === 'jacket' ? 'selected' : ''}" data-value="jacket">
                    <i class="fas fa-vest"></i>
                    <span>Chaqueta</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Sport & Fit -->
            <div class="config-step" data-step="2">
              <div class="step-header">
                <span class="step-number">2</span>
                <h3>Deporte y Ajuste</h3>
              </div>
              <div class="step-content">
                <div class="form-group">
                  <label>Deporte</label>
                  <select class="config-select" id="sport-select">
                    <option value="RUNNING">Running</option>
                    <option value="CYCLING">Ciclismo</option>
                    <option value="FITNESS">Fitness</option>
                    <option value="TRAINING">Training</option>
                    <option value="TRIATHLON">Triatlón</option>
                    <option value="OUTDOOR">Outdoor</option>
                    <option value="SWIMMING">Natación</option>
                    <option value="YOGA">Yoga</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Tipo de Ajuste</label>
                  <div class="option-grid small">
                    <div class="option-card ${this.state.fitType === 'PERFORMANCE' ? 'selected' : ''}" data-value="PERFORMANCE">
                      <span>Performance</span>
                      <small>Ajustado</small>
                    </div>
                    <div class="option-card ${this.state.fitType === 'REGULAR' ? 'selected' : ''}" data-value="REGULAR">
                      <span>Regular</span>
                      <small>Estándar</small>
                    </div>
                    <div class="option-card ${this.state.fitType === 'COMFORT' ? 'selected' : ''}" data-value="COMFORT">
                      <span>Comfort</span>
                      <small>Holgado</small>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label>Género</label>
                  <div class="option-grid small">
                    <div class="option-card ${this.state.gender === 'M' ? 'selected' : ''}" data-value="M">
                      <i class="fas fa-mars"></i>
                      <span>Hombre</span>
                    </div>
                    <div class="option-card ${this.state.gender === 'F' ? 'selected' : ''}" data-value="F">
                      <i class="fas fa-venus"></i>
                      <span>Mujer</span>
                    </div>
                    <div class="option-card ${this.state.gender === 'U' ? 'selected' : ''}" data-value="U">
                      <i class="fas fa-user"></i>
                      <span>Unisex</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: Colors -->
            <div class="config-step" data-step="3">
              <div class="step-header">
                <span class="step-number">3</span>
                <h3>Colores</h3>
              </div>
              <div class="step-content">
                <div class="form-group">
                  <label>Color Base</label>
                  <div class="color-palette">
                    ${this.generateColorPalette('base')}
                  </div>
                  <input type="color" id="base-color-custom" value="${this.state.baseColor}" class="color-picker-custom">
                </div>

                <div class="form-group">
                  <label>Color de Acento</label>
                  <div class="color-palette">
                    ${this.generateColorPalette('accent')}
                  </div>
                  <input type="color" id="accent-color-custom" value="${this.state.accentColor}" class="color-picker-custom">
                </div>

                <div class="form-group">
                  <label>Patrón</label>
                  <div class="option-grid small">
                    <div class="option-card ${this.state.pattern === 'solid' ? 'selected' : ''}" data-value="solid">
                      <div class="pattern-preview solid"></div>
                      <span>Sólido</span>
                    </div>
                    <div class="option-card ${this.state.pattern === 'stripes' ? 'selected' : ''}" data-value="stripes">
                      <div class="pattern-preview stripes"></div>
                      <span>Rayas</span>
                    </div>
                    <div class="option-card ${this.state.pattern === 'gradient' ? 'selected' : ''}" data-value="gradient">
                      <div class="pattern-preview gradient"></div>
                      <span>Gradiente</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 4: Logo & Text -->
            <div class="config-step" data-step="4">
              <div class="step-header">
                <span class="step-number">4</span>
                <h3>Logo y Texto</h3>
              </div>
              <div class="step-content">
                <div class="form-group">
                  <label>Logo del Equipo</label>
                  <div class="logo-upload-area" id="logo-upload">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Arrastra tu logo aquí o haz click para seleccionar</p>
                    <small>PNG, SVG o JPG. Máx 2MB. Mín 500x500px</small>
                    <input type="file" id="logo-file-input" accept="image/*" style="display: none;">
                  </div>
                  <div id="logo-preview" class="logo-preview" style="display: none;">
                    <img src="" alt="Logo preview">
                    <button class="remove-logo-btn" onclick="configurator.removeLogo()">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label>Posición del Logo</label>
                  <div class="option-grid small">
                    <div class="option-card ${this.state.logoPosition === 'center' ? 'selected' : ''}" data-value="center">
                      <span>Centro</span>
                    </div>
                    <div class="option-card ${this.state.logoPosition === 'left' ? 'selected' : ''}" data-value="left">
                      <span>Izquierda</span>
                    </div>
                    <div class="option-card ${this.state.logoPosition === 'right' ? 'selected' : ''}" data-value="right">
                      <span>Derecha</span>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label>Texto Personalizado (Nombre/Número)</label>
                  <input type="text" id="custom-text-input" class="config-input" placeholder="Ej: RODRÍGUEZ 10" maxlength="20">
                </div>

                <div class="form-group">
                  <label>Color del Texto</label>
                  <div class="color-palette">
                    <div class="color-swatch" style="background: #FFFFFF;" data-color="#FFFFFF"></div>
                    <div class="color-swatch" style="background: #000000;" data-color="#000000"></div>
                    <div class="color-swatch" style="background: #0047AB;" data-color="#0047AB"></div>
                    <div class="color-swatch" style="background: #FF6B35;" data-color="#FF6B35"></div>
                    <div class="color-swatch" style="background: #00D084;" data-color="#00D084"></div>
                    <div class="color-swatch" style="background: #FFD700;" data-color="#FFD700"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 5: Quantity & Summary -->
            <div class="config-step" data-step="5">
              <div class="step-header">
                <span class="step-number">5</span>
                <h3>Cantidad y Resumen</h3>
              </div>
              <div class="step-content">
                <div class="form-group">
                  <label>Cantidad (Sin mínimo)</label>
                  <div class="quantity-selector">
                    <button class="qty-btn" onclick="configurator.changeQuantity(-1)">-</button>
                    <input type="number" id="quantity-input" value="${this.state.quantity}" min="1" max="999">
                    <button class="qty-btn" onclick="configurator.changeQuantity(1)">+</button>
                  </div>
                  <small class="quantity-note">
                    <i class="fas fa-info-circle"></i>
                    Descuentos por volumen: 10+ unidades -10%, 50+ unidades -20%
                  </small>
                </div>

                <div class="design-summary">
                  <h4>Resumen de tu Diseño</h4>
                  <ul>
                    <li><strong>Producto:</strong> <span id="summary-product">Jersey</span></li>
                    <li><strong>Deporte:</strong> <span id="summary-sport">Running</span></li>
                    <li><strong>Ajuste:</strong> <span id="summary-fit">Performance</span></li>
                    <li><strong>Género:</strong> <span id="summary-gender">Hombre</span></li>
                    <li><strong>Colores:</strong> <span id="summary-colors">Base + Acento</span></li>
                    <li><strong>Logo:</strong> <span id="summary-logo">No incluido</span></li>
                    <li><strong>Texto:</strong> <span id="summary-text">Sin personalización</span></li>
                  </ul>
                </div>

                <div class="timeline-info">
                  <h4>Timeline de Producción</h4>
                  <div class="timeline-steps">
                    <div class="timeline-step">
                      <div class="timeline-icon"><i class="fas fa-pencil-ruler"></i></div>
                      <div class="timeline-content">
                        <strong>Día 1-3</strong>
                        <p>Propuesta de diseño</p>
                      </div>
                    </div>
                    <div class="timeline-step">
                      <div class="timeline-icon"><i class="fas fa-check-circle"></i></div>
                      <div class="timeline-content">
                        <strong>Día 4-5</strong>
                        <p>Revisión y ajustes</p>
                      </div>
                    </div>
                    <div class="timeline-step">
                      <div class="timeline-icon"><i class="fas fa-industry"></i></div>
                      <div class="timeline-content">
                        <strong>Semana 1-3</strong>
                        <p>Producción</p>
                      </div>
                    </div>
                    <div class="timeline-step">
                      <div class="timeline-icon"><i class="fas fa-shipping-fast"></i></div>
                      <div class="timeline-content">
                        <strong>Semana 4</strong>
                        <p>Envío</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="configurator-navigation">
            <button class="btn-config btn-prev" id="prev-btn" style="display: none;">
              <i class="fas fa-arrow-left"></i> Anterior
            </button>
            <div class="step-indicators">
              <span class="step-dot active"></span>
              <span class="step-dot"></span>
              <span class="step-dot"></span>
              <span class="step-dot"></span>
              <span class="step-dot"></span>
            </div>
            <button class="btn-config btn-next" id="next-btn">
              Siguiente <i class="fas fa-arrow-right"></i>
            </button>
          </div>

          <!-- Action Buttons -->
          <div class="configurator-actions">
            <button class="btn-warstki-secondary" onclick="configurator.saveDesign()">
              <i class="fas fa-save"></i> Guardar Diseño
            </button>
            <button class="btn-warstki-primary" onclick="configurator.requestQuote()">
              <i class="fas fa-paper-plane"></i> Solicitar Cotización
            </button>
          </div>
        </div>
      </div>
    `;

    this.addConfiguratorStyles();
  }

  generateColorPalette(type) {
    const colors = type === 'base'
      ? ['#0047AB', '#FF6B35', '#00D084', '#1A1A1A', '#FFFFFF', '#FFD700', '#8B0000', '#4B0082']
      : ['#FF6B35', '#0047AB', '#FFD700', '#00D084', '#FFFFFF', '#000000', '#FF1744', '#00BCD4'];

    return colors.map(color => `
      <div class="color-swatch ${this.state[type + 'Color'] === color ? 'selected' : ''}"
           style="background: ${color};"
           data-color="${color}"
           data-type="${type}"></div>
    `).join('');
  }

  attachEventListeners() {
    // Product type selection
    document.querySelectorAll('[data-step="1"] .option-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('[data-step="1"] .option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.state.productType = card.dataset.value;
        this.update3DModel();
      });
    });

    // Sport selection
    document.getElementById('sport-select').addEventListener('change', (e) => {
      this.state.sport = e.target.value;
      this.updateSummary();
    });

    // Fit type
    document.querySelectorAll('[data-step="2"] .option-grid .option-card').forEach(card => {
      card.addEventListener('click', () => {
        const parent = card.closest('.option-grid');
        parent.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        if (card.closest('.form-group').querySelector('label').textContent.includes('Ajuste')) {
          this.state.fitType = card.dataset.value;
        } else if (card.closest('.form-group').querySelector('label').textContent.includes('Género')) {
          this.state.gender = card.dataset.value;
        }
        this.updateSummary();
      });
    });

    // Color selection
    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        const type = swatch.dataset.type;
        const color = swatch.dataset.color;

        if (type) {
          this.state[type + 'Color'] = color;
          document.querySelectorAll(`[data-type="${type}"]`).forEach(s => s.classList.remove('selected'));
          swatch.classList.add('selected');
          this.update3DModel();
        } else {
          // Text color
          this.state.textColor = color;
          document.querySelectorAll('.color-palette .color-swatch').forEach(s => s.classList.remove('selected'));
          swatch.classList.add('selected');
        }
      });
    });

    // Custom color pickers
    document.getElementById('base-color-custom').addEventListener('change', (e) => {
      this.state.baseColor = e.target.value;
      this.update3DModel();
    });

    document.getElementById('accent-color-custom').addEventListener('change', (e) => {
      this.state.accentColor = e.target.value;
      this.update3DModel();
    });

    // Pattern selection
    document.querySelectorAll('[data-step="3"] .option-card').forEach(card => {
      card.addEventListener('click', () => {
        if (card.dataset.value) {
          document.querySelectorAll('[data-step="3"] .option-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          this.state.pattern = card.dataset.value;
          this.update3DModel();
        }
      });
    });

    // Logo upload
    const logoUpload = document.getElementById('logo-upload');
    const logoFileInput = document.getElementById('logo-file-input');

    logoUpload.addEventListener('click', () => logoFileInput.click());
    logoUpload.addEventListener('dragover', (e) => {
      e.preventDefault();
      logoUpload.classList.add('dragover');
    });
    logoUpload.addEventListener('dragleave', () => {
      logoUpload.classList.remove('dragover');
    });
    logoUpload.addEventListener('drop', (e) => {
      e.preventDefault();
      logoUpload.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        this.handleLogoUpload(file);
      }
    });

    logoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.handleLogoUpload(file);
      }
    });

    // Logo position
    document.querySelectorAll('[data-step="4"] .option-card').forEach(card => {
      card.addEventListener('click', () => {
        if (card.dataset.value && card.closest('.form-group').querySelector('label').textContent.includes('Posición')) {
          document.querySelectorAll('[data-step="4"] .option-grid .option-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          this.state.logoPosition = card.dataset.value;
          this.update3DModel();
        }
      });
    });

    // Custom text
    document.getElementById('custom-text-input').addEventListener('input', (e) => {
      this.state.customText = e.target.value;
      this.updateSummary();
    });

    // Quantity
    document.getElementById('quantity-input').addEventListener('change', (e) => {
      this.state.quantity = Math.max(1, parseInt(e.target.value) || 1);
      e.target.value = this.state.quantity;
    });

    // Navigation
    document.getElementById('next-btn').addEventListener('click', () => this.nextStep());
    document.getElementById('prev-btn').addEventListener('click', () => this.prevStep());
  }

  setup3DViewer() {
    const container = document.getElementById('configurator-3d-view');

    if (typeof Warstki3DViewer !== 'undefined') {
      this.viewer = new Warstki3DViewer(container, {
        modelColor: parseInt(this.state.baseColor.replace('#', '0x')),
        autoRotate: true,
        hotspots: [
          {
            position: { x: 0, y: 0.5, z: 0.9 },
            title: 'Tecnología UV Protection',
            description: 'Factor 50+ de protección contra rayos UV'
          },
          {
            position: { x: 0.8, y: 0.3, z: 0.5 },
            title: 'Costuras Planas',
            description: 'Sin rozaduras, máxima comodidad'
          },
          {
            position: { x: 0, y: -0.5, z: 0.9 },
            title: 'Tejido Transpirable',
            description: 'Gestión avanzada de humedad'
          }
        ]
      });
    } else {
      container.innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--text-secondary);">Cargando vista 3D...</p>';
    }
  }

  update3DModel() {
    if (this.viewer) {
      const color = parseInt(this.state.baseColor.replace('#', '0x'));
      this.viewer.changeColor(color);
    }
  }

  handleLogoUpload(file) {
    if (file.size > 2 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.state.logoUrl = e.target.result;

      const preview = document.getElementById('logo-preview');
      preview.querySelector('img').src = e.target.result;
      preview.style.display = 'block';
      document.getElementById('logo-upload').style.display = 'none';

      this.updateSummary();
    };
    reader.readAsDataURL(file);
  }

  removeLogo() {
    this.state.logoUrl = null;
    document.getElementById('logo-preview').style.display = 'none';
    document.getElementById('logo-upload').style.display = 'flex';
    document.getElementById('logo-file-input').value = '';
    this.updateSummary();
  }

  changeQuantity(delta) {
    this.state.quantity = Math.max(1, this.state.quantity + delta);
    document.getElementById('quantity-input').value = this.state.quantity;
  }

  nextStep() {
    const currentStep = document.querySelector('.config-step.active');
    const stepNumber = parseInt(currentStep.dataset.step);

    if (stepNumber < 5) {
      currentStep.classList.remove('active');
      document.querySelector(`[data-step="${stepNumber + 1}"]`).classList.add('active');

      // Update navigation
      document.getElementById('prev-btn').style.display = 'block';
      if (stepNumber + 1 === 5) {
        document.getElementById('next-btn').style.display = 'none';
      }

      // Update indicators
      document.querySelectorAll('.step-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index <= stepNumber);
      });

      // Update summary
      this.updateSummary();
    }
  }

  prevStep() {
    const currentStep = document.querySelector('.config-step.active');
    const stepNumber = parseInt(currentStep.dataset.step);

    if (stepNumber > 1) {
      currentStep.classList.remove('active');
      document.querySelector(`[data-step="${stepNumber - 1}"]`).classList.add('active');

      // Update navigation
      document.getElementById('next-btn').style.display = 'block';
      if (stepNumber - 1 === 1) {
        document.getElementById('prev-btn').style.display = 'none';
      }

      // Update indicators
      document.querySelectorAll('.step-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index < stepNumber - 1);
      });
    }
  }

  updateSummary() {
    const productNames = {
      jersey: 'Jersey/Camiseta',
      short: 'Short/Pantaloneta',
      tight: 'Tight/Malla',
      jacket: 'Chaqueta'
    };

    const sportNames = {
      RUNNING: 'Running',
      CYCLING: 'Ciclismo',
      FITNESS: 'Fitness',
      TRAINING: 'Training',
      TRIATHLON: 'Triatlón',
      OUTDOOR: 'Outdoor',
      SWIMMING: 'Natación',
      YOGA: 'Yoga'
    };

    const fitNames = {
      PERFORMANCE: 'Performance Fit',
      REGULAR: 'Regular Fit',
      COMFORT: 'Comfort Fit'
    };

    const genderNames = {
      M: 'Hombre',
      F: 'Mujer',
      U: 'Unisex'
    };

    document.getElementById('summary-product').textContent = productNames[this.state.productType];
    document.getElementById('summary-sport').textContent = sportNames[this.state.sport];
    document.getElementById('summary-fit').textContent = fitNames[this.state.fitType];
    document.getElementById('summary-gender').textContent = genderNames[this.state.gender];
    document.getElementById('summary-colors').innerHTML = `
      <span style="display: inline-block; width: 20px; height: 20px; background: ${this.state.baseColor}; border-radius: 4px; vertical-align: middle;"></span>
      +
      <span style="display: inline-block; width: 20px; height: 20px; background: ${this.state.accentColor}; border-radius: 4px; vertical-align: middle;"></span>
    `;
    document.getElementById('summary-logo').textContent = this.state.logoUrl ? 'Incluido' : 'No incluido';
    document.getElementById('summary-text').textContent = this.state.customText || 'Sin personalización';
  }

  saveDesign() {
    const design = { ...this.state, timestamp: new Date().toISOString() };
    localStorage.setItem('warstki_custom_design', JSON.stringify(design));

    this.showNotification('Diseño guardado exitosamente', 'success');
  }

  requestQuote() {
    const design = { ...this.state };

    // Here you would send this to your backend
    console.log('Requesting quote for:', design);

    this.showNotification('Cotización enviada. Te contactaremos en 24 horas.', 'success');

    // Optional: redirect to contact page or show contact form
  }

  rotate3D(direction) {
    if (this.viewer && this.viewer.productModel) {
      const rotation = direction === 'left' ? -Math.PI / 4 : Math.PI / 4;
      this.viewer.productModel.rotation.y += rotation;
    }
  }

  reset3D() {
    if (this.viewer && this.viewer.productModel) {
      this.viewer.productModel.rotation.set(0, 0, 0);
      this.viewer.camera.position.set(0, 1, 5);
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `warstki-notification ${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    `;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : '#0047AB'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 600;
      animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.4s ease-out';
      setTimeout(() => notification.remove(), 400);
    }, 3000);
  }

  addConfiguratorStyles() {
    if (document.getElementById('configurator-styles')) return;

    const style = document.createElement('style');
    style.id = 'configurator-styles';
    style.textContent = `
      .warstki-configurator {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        max-width: 1600px;
        margin: 0 auto;
        padding: 2rem;
      }

      .configurator-preview {
        position: sticky;
        top: 100px;
        height: fit-content;
      }

      .preview-3d {
        width: 100%;
        height: 600px;
        background: var(--bg-secondary);
        border-radius: var(--card-radius);
        border: 1px solid var(--border-color);
        position: relative;
        overflow: hidden;
      }

      .preview-controls {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 1rem;
      }

      .preview-control-btn {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
      }

      .preview-control-btn:hover {
        background: var(--warstki-blue);
        color: white;
        transform: scale(1.1);
      }

      .preview-info {
        text-align: center;
        margin-top: 1rem;
        color: var(--text-secondary);
      }

      .preview-info h3 {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
      }

      .configurator-panel {
        background: var(--bg-secondary);
        border-radius: var(--card-radius);
        border: 1px solid var(--border-color);
        padding: 2rem;
      }

      .configurator-header {
        margin-bottom: 2rem;
      }

      .configurator-header h2 {
        font-size: 2rem;
        font-weight: 900;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
      }

      .configurator-header p {
        color: var(--text-secondary);
        font-size: 1.1rem;
      }

      .config-step {
        display: none;
      }

      .config-step.active {
        display: block;
        animation: fadeInUp 0.4s;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .step-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid var(--border-color);
      }

      .step-number {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--warstki-blue), var(--warstki-orange));
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1.2rem;
      }

      .step-header h3 {
        font-size: 1.5rem;
        margin: 0;
        color: var(--text-primary);
      }

      .step-content {
        padding: 1rem 0;
      }

      .option-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }

      .option-grid.small {
        grid-template-columns: repeat(3, 1fr);
      }

      .option-card {
        padding: 1.5rem;
        background: var(--bg-primary);
        border: 2px solid var(--border-color);
        border-radius: 12px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
      }

      .option-card:hover {
        border-color: var(--warstki-blue);
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 71, 171, 0.2);
      }

      .option-card.selected {
        border-color: var(--warstki-blue);
        background: linear-gradient(135deg, rgba(0, 71, 171, 0.1), rgba(255, 107, 53, 0.05));
      }

      .option-card i {
        font-size: 2rem;
        margin-bottom: 0.75rem;
        color: var(--warstki-blue);
        display: block;
      }

      .option-card span {
        display: block;
        font-weight: 600;
        color: var(--text-primary);
      }

      .option-card small {
        display: block;
        margin-top: 0.25rem;
        color: var(--text-secondary);
        font-size: 0.85rem;
      }

      .form-group {
        margin-bottom: 2rem;
      }

      .form-group label {
        display: block;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--text-primary);
        font-size: 1rem;
      }

      .config-select,
      .config-input {
        width: 100%;
        padding: 0.9rem 1.2rem;
        background: var(--bg-primary);
        border: 2px solid var(--border-color);
        border-radius: 12px;
        color: var(--text-primary);
        font-size: 1rem;
        font-family: var(--font-body);
        transition: all 0.3s;
      }

      .config-select:focus,
      .config-input:focus {
        outline: none;
        border-color: var(--warstki-blue);
        box-shadow: 0 0 20px rgba(0, 71, 171, 0.2);
      }

      .color-palette {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .color-swatch {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 3px solid var(--border-color);
        cursor: pointer;
        transition: all 0.3s;
        position: relative;
      }

      .color-swatch:hover {
        transform: scale(1.15);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      }

      .color-swatch.selected {
        border-color: var(--warstki-orange);
        box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.3);
      }

      .color-swatch.selected::after {
        content: '✓';
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 1.5rem;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      }

      .color-picker-custom {
        margin-top: 0.75rem;
        width: 100%;
        height: 50px;
        border: 2px solid var(--border-color);
        border-radius: 12px;
        cursor: pointer;
      }

      .pattern-preview {
        width: 100%;
        height: 60px;
        border-radius: 8px;
        margin-bottom: 0.5rem;
      }

      .pattern-preview.solid {
        background: var(--warstki-blue);
      }

      .pattern-preview.stripes {
        background: repeating-linear-gradient(
          45deg,
          var(--warstki-blue),
          var(--warstki-blue) 10px,
          var(--warstki-orange) 10px,
          var(--warstki-orange) 20px
        );
      }

      .pattern-preview.gradient {
        background: linear-gradient(135deg, var(--warstki-blue), var(--warstki-orange));
      }

      .logo-upload-area {
        border: 2px dashed var(--border-color);
        border-radius: 12px;
        padding: 3rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
        background: var(--bg-primary);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .logo-upload-area:hover,
      .logo-upload-area.dragover {
        border-color: var(--warstki-blue);
        background: rgba(0, 71, 171, 0.05);
      }

      .logo-upload-area i {
        font-size: 3rem;
        color: var(--warstki-blue);
      }

      .logo-upload-area p {
        margin: 0;
        color: var(--text-primary);
        font-weight: 600;
      }

      .logo-upload-area small {
        color: var(--text-secondary);
      }

      .logo-preview {
        position: relative;
        padding: 1rem;
        background: var(--bg-primary);
        border: 2px solid var(--border-color);
        border-radius: 12px;
      }

      .logo-preview img {
        max-width: 100%;
        max-height: 200px;
        display: block;
        margin: 0 auto;
      }

      .remove-logo-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background: #ef4444;
        border: none;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
      }

      .remove-logo-btn:hover {
        background: #dc2626;
        transform: scale(1.1);
      }

      .quantity-selector {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .qty-btn {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        background: var(--bg-primary);
        border: 2px solid var(--border-color);
        color: var(--text-primary);
        font-size: 1.5rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
      }

      .qty-btn:hover {
        background: var(--warstki-blue);
        color: white;
        border-color: var(--warstki-blue);
      }

      #quantity-input {
        flex: 1;
        text-align: center;
        font-size: 1.5rem;
        font-weight: 700;
      }

      .quantity-note {
        display: block;
        margin-top: 0.75rem;
        color: var(--warstki-green);
        font-size: 0.9rem;
      }

      .design-summary {
        background: var(--bg-primary);
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 2rem;
      }

      .design-summary h4 {
        margin-bottom: 1rem;
        color: var(--text-primary);
      }

      .design-summary ul {
        list-style: none;
        padding: 0;
      }

      .design-summary li {
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
      }

      .design-summary li:last-child {
        border-bottom: none;
      }

      .timeline-info {
        background: linear-gradient(135deg, rgba(0, 71, 171, 0.1), rgba(255, 107, 53, 0.05));
        padding: 1.5rem;
        border-radius: 12px;
      }

      .timeline-info h4 {
        margin-bottom: 1.5rem;
        color: var(--text-primary);
      }

      .timeline-steps {
        display: grid;
        gap: 1rem;
      }

      .timeline-step {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .timeline-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--warstki-blue), var(--warstki-orange));
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        flex-shrink: 0;
      }

      .timeline-content strong {
        display: block;
        color: var(--text-primary);
        margin-bottom: 0.25rem;
      }

      .timeline-content p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
      }

      .configurator-navigation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 3rem;
        padding-top: 2rem;
        border-top: 2px solid var(--border-color);
      }

      .step-indicators {
        display: flex;
        gap: 0.5rem;
      }

      .step-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--border-color);
        transition: all 0.3s;
      }

      .step-dot.active {
        background: var(--warstki-blue);
        transform: scale(1.3);
      }

      .btn-config {
        padding: 1rem 2rem;
        border-radius: 12px;
        border: none;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .btn-prev {
        background: var(--bg-primary);
        color: var(--text-primary);
        border: 2px solid var(--border-color);
      }

      .btn-prev:hover {
        background: var(--bg-secondary);
      }

      .btn-next {
        background: linear-gradient(135deg, var(--warstki-blue), #0056D2);
        color: white;
      }

      .btn-next:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(0, 71, 171, 0.4);
      }

      .configurator-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
      }

      .configurator-actions button {
        flex: 1;
      }

      @media (max-width: 1200px) {
        .warstki-configurator {
          grid-template-columns: 1fr;
        }

        .configurator-preview {
          position: relative;
          top: 0;
        }

        .preview-3d {
          height: 400px;
        }
      }

      @media (max-width: 768px) {
        .option-grid {
          grid-template-columns: 1fr;
        }

        .option-grid.small {
          grid-template-columns: repeat(2, 1fr);
        }

        .configurator-navigation {
          flex-direction: column;
          gap: 1rem;
        }

        .configurator-actions {
          flex-direction: column;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Make available globally
window.WarstskiConfigurator = WarstskiConfigurator;
