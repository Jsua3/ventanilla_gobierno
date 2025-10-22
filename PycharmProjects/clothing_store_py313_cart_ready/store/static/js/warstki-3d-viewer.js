/**
 * Weiss Sport 3D Product Viewer
 * Three.js based 3D model viewer for products
 */

class Warstki3DViewer {
  constructor(container, options = {}) {
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    if (!this.container) {
      console.error('3D Viewer: Container not found');
      return;
    }

    this.options = {
      width: options.width || this.container.clientWidth,
      height: options.height || this.container.clientHeight || 500,
      modelColor: options.modelColor || 0x0047AB,
      backgroundColor: options.backgroundColor || 0x0F0F0F,
      autoRotate: options.autoRotate !== false,
      enableZoom: options.enableZoom !== false,
      hotspots: options.hotspots || [],
      // New options for external models
      modelPath: options.modelPath || null,  // Path to .glb/.gltf file
      modelScale: options.modelScale || 1,   // Scale factor for external model
      useBasicModel: options.useBasicModel !== false  // Use built-in model by default
    };

    this.init();
  }

  init() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
      console.error('Three.js not loaded. Loading from CDN...');
      this.loadThreeJS(() => this.setup());
      return;
    }
    this.setup();
  }

  loadThreeJS(callback) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => {
      // Load GLTFLoader for external models
      this.loadGLTFLoader(callback);
    };
    document.head.appendChild(script);
  }

  loadGLTFLoader(callback) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
    script.onload = callback;
    script.onerror = () => {
      console.warn('GLTFLoader not loaded, falling back to basic model');
      callback();
    };
    document.head.appendChild(script);
  }

  setup() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.options.backgroundColor);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.options.width / this.options.height,
      0.1,
      1000
    );
    this.camera.position.z = 5;
    this.camera.position.y = 1;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.options.width, this.options.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    // Lights
    this.setupLights();

    // Create 3D product model
    if (this.options.modelPath && !this.options.useBasicModel) {
      this.loadExternalModel(this.options.modelPath);
    } else {
      this.createProductModel();
    }

    // Controls
    this.setupControls();

    // Hotspots
    this.createHotspots();

    // Animation loop
    this.animate();

    // Handle resize
    window.addEventListener('resize', () => this.onResize());
  }

  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Directional light (main)
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7.5);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    // Rim light
    const rimLight = new THREE.DirectionalLight(0xFF6B35, 0.4);
    rimLight.position.set(-5, 3, -5);
    this.scene.add(rimLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x0047AB, 0.3);
    fillLight.position.set(0, -5, 5);
    this.scene.add(fillLight);
  }

  loadExternalModel(modelPath) {
    console.log('Loading external 3D model from:', modelPath);

    // Check if GLTFLoader is available
    if (typeof THREE.GLTFLoader === 'undefined') {
      console.error('GLTFLoader not available, falling back to basic model');
      this.createProductModel();
      return;
    }

    const loader = new THREE.GLTFLoader();

    loader.load(
      modelPath,
      // Success callback
      (gltf) => {
        console.log('✅ 3D Model loaded successfully');
        this.productModel = gltf.scene;

        // Apply scale
        this.productModel.scale.set(
          this.options.modelScale,
          this.options.modelScale,
          this.options.modelScale
        );

        // Center the model
        const box = new THREE.Box3().setFromObject(this.productModel);
        const center = box.getCenter(new THREE.Vector3());
        this.productModel.position.sub(center);

        // Enable shadows
        this.productModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // Apply color if specified
            if (this.options.modelColor && child.material) {
              child.material.color.setHex(this.options.modelColor);
            }
          }
        });

        this.scene.add(this.productModel);
        console.log('Model added to scene');
      },
      // Progress callback
      (xhr) => {
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        console.log(`Loading: ${Math.round(percentComplete)}%`);
      },
      // Error callback
      (error) => {
        console.error('Error loading 3D model:', error);
        console.log('Falling back to basic model');
        this.createProductModel();
      }
    );
  }

  createProductModel() {
    // Create a stylized shirt/jersey model
    const group = new THREE.Group();

    // Torso (main body)
    const torsoGeometry = new THREE.CylinderGeometry(0.8, 1, 1.8, 32);
    const torsoMaterial = new THREE.MeshPhongMaterial({
      color: this.options.modelColor,
      shininess: 30,
      specular: 0x555555
    });
    const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
    torso.castShadow = true;
    group.add(torso);

    // Sleeves (left and right)
    const sleeveGeometry = new THREE.CylinderGeometry(0.25, 0.2, 0.8, 16);
    const sleeveL = new THREE.Mesh(sleeveGeometry, torsoMaterial);
    sleeveL.position.set(-1, 0.3, 0);
    sleeveL.rotation.z = Math.PI / 6;
    sleeveL.castShadow = true;
    group.add(sleeveL);

    const sleeveR = new THREE.Mesh(sleeveGeometry, torsoMaterial);
    sleeveR.position.set(1, 0.3, 0);
    sleeveR.rotation.z = -Math.PI / 6;
    sleeveR.castShadow = true;
    group.add(sleeveR);

    // Collar
    const collarGeometry = new THREE.TorusGeometry(0.4, 0.08, 16, 32, Math.PI);
    const collarMaterial = new THREE.MeshPhongMaterial({
      color: 0xFF6B35,
      shininess: 50
    });
    const collar = new THREE.Mesh(collarGeometry, collarMaterial);
    collar.position.y = 0.9;
    collar.rotation.x = Math.PI;
    group.add(collar);

    // Logo area (placeholder)
    const logoGeometry = new THREE.CircleGeometry(0.2, 32);
    const logoMaterial = new THREE.MeshPhongMaterial({
      color: 0xFFFFFF,
      shininess: 80
    });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(0, 0.3, 0.81);
    group.add(logo);

    // Add accent stripes
    const stripeGeometry = new THREE.BoxGeometry(1.6, 0.05, 0.05);
    const stripeMaterial = new THREE.MeshPhongMaterial({
      color: 0xFF6B35
    });

    for (let i = 0; i < 3; i++) {
      const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
      stripe.position.set(0, -0.5 - (i * 0.2), 0.8);
      group.add(stripe);
    }

    // Add subtle glow effect
    const glowGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: this.options.modelColor,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glow);

    this.productModel = group;
    this.scene.add(group);
  }

  setupControls() {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    this.renderer.domElement.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    this.renderer.domElement.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      if (this.productModel) {
        this.productModel.rotation.y += deltaX * 0.01;
        this.productModel.rotation.x += deltaY * 0.01;
      }

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    this.renderer.domElement.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Zoom with mouse wheel
    if (this.options.enableZoom) {
      this.renderer.domElement.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY * 0.001;
        this.camera.position.z += delta;
        this.camera.position.z = Math.max(2, Math.min(10, this.camera.position.z));
      });
    }

    // Touch support
    let touchStartDistance = 0;

    this.renderer.domElement.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDistance = Math.sqrt(dx * dx + dy * dy);
      }
    });

    this.renderer.domElement.addEventListener('touchmove', (e) => {
      e.preventDefault();

      if (e.touches.length === 1 && this.productModel) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - previousMousePosition.x;
        const deltaY = touch.clientY - previousMousePosition.y;

        this.productModel.rotation.y += deltaX * 0.01;
        this.productModel.rotation.x += deltaY * 0.01;

        previousMousePosition = { x: touch.clientX, y: touch.clientY };
      } else if (e.touches.length === 2) {
        // Pinch to zoom
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const delta = (touchStartDistance - distance) * 0.01;

        this.camera.position.z += delta;
        this.camera.position.z = Math.max(2, Math.min(10, this.camera.position.z));

        touchStartDistance = distance;
      }
    }, { passive: false });
  }

  createHotspots() {
    this.hotspots = [];

    this.options.hotspots.forEach((hotspot, index) => {
      const geometry = new THREE.SphereGeometry(0.08, 16, 16);
      const material = new THREE.MeshBasicMaterial({
        color: 0xFF6B35,
        transparent: true,
        opacity: 0.8
      });
      const sphere = new THREE.Mesh(geometry, material);

      sphere.position.set(
        hotspot.position.x || 0,
        hotspot.position.y || 0,
        hotspot.position.z || 1
      );

      sphere.userData = {
        title: hotspot.title,
        description: hotspot.description,
        index: index
      };

      this.productModel.add(sphere);
      this.hotspots.push(sphere);

      // Pulsing animation
      sphere.userData.pulsePhase = Math.random() * Math.PI * 2;
    });

    // Raycaster for hotspot interaction
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.renderer.domElement.addEventListener('click', (e) => {
      this.onHotspotClick(e);
    });
  }

  onHotspotClick(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.hotspots);

    if (intersects.length > 0) {
      const hotspot = intersects[0].object.userData;
      this.showHotspotInfo(hotspot);
    }
  }

  showHotspotInfo(hotspot) {
    // Create or update info panel
    let panel = document.getElementById('hotspot-info-panel');

    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'hotspot-info-panel';
      panel.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 71, 171, 0.95);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 16px;
        max-width: 400px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(10px);
        z-index: 1000;
        animation: slideUp 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      `;
      this.container.appendChild(panel);
    }

    panel.innerHTML = `
      <button onclick="this.parentElement.remove()" style="position: absolute; top: 10px; right: 10px; background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; width: 30px; height: 30px;">&times;</button>
      <h3 style="margin: 0 0 0.5rem; font-size: 1.3rem; font-weight: 700;">${hotspot.title}</h3>
      <p style="margin: 0; font-size: 1rem; line-height: 1.6; opacity: 0.9;">${hotspot.description}</p>
    `;

    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (panel && panel.parentElement) {
        panel.style.animation = 'slideDown 0.3s ease-out';
        setTimeout(() => panel.remove(), 300);
      }
    }, 5000);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.productModel) {
      // Auto-rotate
      if (this.options.autoRotate) {
        this.productModel.rotation.y += 0.003;
      }

      // Hotspot pulsing animation
      this.hotspots.forEach(hotspot => {
        const scale = 1 + Math.sin(Date.now() * 0.003 + hotspot.userData.pulsePhase) * 0.2;
        hotspot.scale.set(scale, scale, scale);
      });
    }

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 500;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  changeColor(color) {
    if (this.productModel) {
      this.productModel.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material.color) {
          if (child.material.color.getHex() === this.options.modelColor) {
            child.material.color.setHex(color);
          }
        }
      });
      this.options.modelColor = color;
    }
  }

  destroy() {
    if (this.renderer) {
      this.renderer.domElement.remove();
      this.renderer.dispose();
    }
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
  }
`;
document.head.appendChild(style);

// Export for use
window.Warstki3DViewer = Warstki3DViewer;
