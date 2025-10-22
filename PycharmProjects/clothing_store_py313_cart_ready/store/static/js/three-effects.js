'use strict';

/**
 * Weiss Sport 3D & Immersive Effects System
 * Three.js Implementation for Product Visualization
 */

class ThreeEffects {
  constructor() {
    this.scenes = new Map();
    this.isInitialized = false;
    this.mousePosition = { x: 0, y: 0 };
    this.targetRotation = { x: 0, y: 0 };
    this.currentRotation = { x: 0, y: 0 };
  }

  /**
   * Initialize Three.js library
   */
  async init() {
    if (this.isInitialized) return;

    try {
      // Check if Three.js is already loaded
      if (typeof THREE === 'undefined') {
        console.log('⏳ Three.js no está cargado. Asegúrate de incluir three.min.js en tu template.');
        return false;
      }

      // Setup global mouse tracking for parallax effects
      this.setupMouseTracking();

      this.isInitialized = true;
      console.log('✅ Three.js Effects System initialized');
      return true;
    } catch (error) {
      console.error('❌ Error initializing Three.js:', error);
      return false;
    }
  }

  /**
   * Show error message in container
   */
  showErrorMessage(container, message) {
    container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: rgba(0,0,0,0.8); color: white; padding: 2rem; text-align: center; border-radius: 20px;">
        <div>
          <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; color: #f39c12;"></i>
          <p style="font-size: 1.1rem; margin: 0;">${message}</p>
        </div>
      </div>
    `;
  }

  /**
   * Check if Three.js is available
   */
  isThreeAvailable() {
    return typeof THREE !== 'undefined';
  }

  /**
   * Setup mouse tracking for parallax effects
   */
  setupMouseTracking() {
    document.addEventListener('mousemove', (e) => {
      this.mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  /**
   * Create Hero 3D Product (T-Shirt rotating) - OPTIMIZED (CON SOPORTE GLB)
   */
  async createHero3DProduct(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('❌ Container not found:', containerId);
      return;
    }

    if (typeof THREE === 'undefined') {
      console.error('❌ Three.js no está cargado. Incluye three.min.js en tu template.');
      this.showErrorMessage(container, 'Three.js no está disponible. Por favor, recarga la página.');
      return;
    }

    // OPTIMIZED: Add loading indicator
    container.innerHTML = `
      <div class="three-loading-indicator" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: white; z-index: 100;">
        <div class="spinner" style="width: 50px; height: 50px; border: 4px solid rgba(74, 144, 226, 0.3); border-top-color: #4a90e2; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
        <p style="font-size: 0.9rem; opacity: 0.8;">Cargando experiencia 3D...</p>
      </div>
      <style>
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    `;

    // Check container dimensions
    const width = container.offsetWidth || window.innerWidth;
    const height = container.offsetHeight || window.innerHeight;

    console.log(`📐 Container dimensions: ${width}x${height}`);

    if (width === 0 || height === 0) {
      console.warn('⚠️ Container has zero dimensions, using fallback');
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    // OPTIMIZED: Reduce antialiasing quality for better performance
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio <= 1 // Only enable antialiasing on low-res screens
    });

    renderer.setSize(width, height);
    // OPTIMIZED: Cap pixel ratio to 2 for better performance
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    console.log('✅ Hero 3D renderer created and appended');

    // OPTIMIZED: Simplified lighting setup (fewer lights = better performance)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0x4a90e2, 0.3);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);

    // NUEVO: Try to load GLB model first, fallback to basic geometry
    let tshirt;
    const modelPath = options.modelPath || '/static/models/t_shirt.glb';

    console.log('🎯 Intentando cargar modelo GLB para Hero:', modelPath);
    const glbModel = await this.loadGLBModel(modelPath);

    if (glbModel) {
      console.log('✅ Usando modelo GLB externo en Hero');
      tshirt = glbModel;
      // Scale if needed
      if (options.modelScale) {
        tshirt.scale.set(options.modelScale, options.modelScale, options.modelScale);
      }
    } else {
      console.log('⚠️ Usando modelo básico de geometría en Hero');
      tshirt = this.createTShirtGeometry();
    }

    // DON'T change material - keep textures as created!
    let meshCount = 0;
    tshirt.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshCount++;
      }
    });

    scene.add(tshirt);
    console.log(`✅ T-Shirt added to scene with ${meshCount} meshes:`, tshirt);
    console.log('📍 T-Shirt position:', tshirt.position);
    console.log('📍 Camera position:', camera.position);

    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    // Force initial render
    renderer.render(scene, camera);
    console.log('✅ Initial render completed');

    // OPTIMIZED: Remove loading indicator after first render
    setTimeout(() => {
      const loadingIndicator = container.querySelector('.three-loading-indicator');
      if (loadingIndicator) {
        loadingIndicator.style.opacity = '0';
        loadingIndicator.style.transition = 'opacity 0.5s';
        setTimeout(() => loadingIndicator.remove(), 500);
      }
    }, 500);

    // Animation loop
    let autoRotate = true;
    const animate = () => {
      requestAnimationFrame(animate);

      if (autoRotate) {
        tshirt.rotation.y += 0.005;
      }

      // Mouse parallax effect
      const targetX = this.mousePosition.x * 0.3;
      const targetY = this.mousePosition.y * 0.3;

      this.currentRotation.x += (targetY - this.currentRotation.x) * 0.05;
      this.currentRotation.y += (targetX - this.currentRotation.y) * 0.05;

      tshirt.rotation.x = this.currentRotation.x;
      tshirt.rotation.y += this.currentRotation.y * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
      const newWidth = container.offsetWidth || window.innerWidth;
      const newHeight = container.offsetHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });

    // Store scene for later reference
    this.scenes.set(containerId, { scene, camera, renderer, mesh: tshirt });

    console.log('✅ Hero 3D Product initialized successfully');
    return { scene, camera, renderer, tshirt };
  }

  /**
   * Load external GLB model (NUEVO - Para cargar t_shirt.glb)
   */
  async loadGLBModel(modelPath) {
    return new Promise((resolve, reject) => {
      // Check if GLTFLoader is available
      if (typeof THREE.GLTFLoader === 'undefined') {
        console.warn('⚠️ GLTFLoader no disponible, usando modelo básico');
        resolve(null);
        return;
      }

      const loader = new THREE.GLTFLoader();

      console.log('📦 Cargando modelo 3D desde:', modelPath);

      loader.load(
        modelPath,
        // Success
        (gltf) => {
          console.log('✅ Modelo GLB cargado exitosamente');
          const model = gltf.scene;

          // Center the model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);

          // Enable shadows
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          resolve(model);
        },
        // Progress
        (xhr) => {
          const percent = (xhr.loaded / xhr.total * 100).toFixed(0);
          console.log(`📊 Cargando modelo: ${percent}%`);
        },
        // Error
        (error) => {
          console.error('❌ Error cargando modelo GLB:', error);
          resolve(null); // Resolve with null to fallback to basic model
        }
      );
    });
  }

  /**
   * Create T-Shirt geometry (ENHANCED VERSION - Realistic with textures)
   */
  createTShirtGeometry() {
    const group = new THREE.Group();

    // Create fabric texture procedurally
    const fabricTexture = this.createFabricTexture();

    // Create a temporary material with fabric texture
    const tempMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      map: fabricTexture
    });

    // ENHANCED: Body with realistic torso shape
    const bodyGeometry = new THREE.BoxGeometry(1.8, 2.2, 0.4, 8, 12, 4);

    // Deform geometry to create realistic torso/shirt shape
    const bodyPositions = bodyGeometry.attributes.position;
    for (let i = 0; i < bodyPositions.count; i++) {
      const x = bodyPositions.getX(i);
      const y = bodyPositions.getY(i);
      const z = bodyPositions.getZ(i);

      // Normalize y to 0-1 range (0 = bottom, 1 = top)
      const yNorm = (y + 1.1) / 2.2;

      // Create torso shape: wider at shoulders, narrower at waist, slightly wider at hips
      let widthFactor = 1.0;
      if (yNorm > 0.7) {
        // Shoulders area - wider
        widthFactor = 1.0 + (yNorm - 0.7) * 0.3;
      } else if (yNorm > 0.4) {
        // Chest to waist - gradually narrower
        widthFactor = 0.85 + (yNorm - 0.4) * 0.5;
      } else {
        // Waist to hips - slightly wider again
        widthFactor = 0.85 + (0.4 - yNorm) * 0.15;
      }

      // Apply width factor to x positions
      const newX = x * widthFactor;

      // Add depth variation (more curved front, flatter back)
      let depthFactor = 1.0;
      if (z > 0) {
        // Front is more curved
        depthFactor = 1.0 + Math.abs(x / 0.9) * 0.3 * (1 - yNorm * 0.5);
      }

      const newZ = z * depthFactor;

      // Add subtle wrinkles
      const wrinkle = Math.sin(y * 4) * 0.015 + Math.sin(x * 5) * 0.012;

      bodyPositions.setX(i, newX);
      bodyPositions.setZ(i, newZ + wrinkle);
    }
    bodyGeometry.computeVertexNormals();

    const body = new THREE.Mesh(bodyGeometry, tempMaterial);
    body.name = 'body';
    group.add(body);

    // ENHANCED: Sleeves with better shape (tapered cylinders with more segments)
    const sleeveGeometry = new THREE.CylinderGeometry(0.28, 0.35, 0.8, 12, 4);

    // Add natural sleeve wrinkles
    const sleevePositions = sleeveGeometry.attributes.position;
    for (let i = 0; i < sleevePositions.count; i++) {
      const y = sleevePositions.getY(i);
      const angle = Math.atan2(sleevePositions.getZ(i), sleevePositions.getX(i));
      const wrinkle = Math.sin(angle * 4) * Math.abs(y) * 0.02;
      const currentR = Math.sqrt(
        Math.pow(sleevePositions.getX(i), 2) +
        Math.pow(sleevePositions.getZ(i), 2)
      );
      const newR = currentR + wrinkle;
      sleevePositions.setX(i, Math.cos(angle) * newR);
      sleevePositions.setZ(i, Math.sin(angle) * newR);
    }
    sleeveGeometry.computeVertexNormals();

    const leftSleeve = new THREE.Mesh(sleeveGeometry, tempMaterial);
    leftSleeve.rotation.z = Math.PI / 2;
    leftSleeve.position.set(-1.15, 0.65, 0);
    leftSleeve.name = 'leftSleeve';
    group.add(leftSleeve);

    const rightSleeve = new THREE.Mesh(sleeveGeometry, tempMaterial);
    rightSleeve.rotation.z = -Math.PI / 2;
    rightSleeve.position.set(1.15, 0.65, 0);
    rightSleeve.name = 'rightSleeve';
    group.add(rightSleeve);

    // ENHANCED: Collar (more detailed with better shape)
    const collarGeometry = new THREE.TorusGeometry(0.38, 0.1, 10, 20, Math.PI);
    const collar = new THREE.Mesh(collarGeometry, tempMaterial);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 1.15;
    collar.name = 'collar';
    group.add(collar);

    // NEW: Add stitching/seams
    this.addStitching(group, body, leftSleeve, rightSleeve, collar);

    console.log('✅ Enhanced T-Shirt geometry created with', group.children.length, 'parts (REALISTIC)');

    return group;
  }

  /**
   * Create procedural fabric texture
   */
  createFabricTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base fabric color
    ctx.fillStyle = '#e8e8e8';
    ctx.fillRect(0, 0, 512, 512);

    // Add more visible fabric weave pattern
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)'; // Increased from 0.03 to 0.12
    ctx.lineWidth = 1;

    // Horizontal threads
    for (let i = 0; i < 512; i += 3) { // Every 3px instead of 4px for denser pattern
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    // Vertical threads
    for (let i = 0; i < 512; i += 3) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
    }

    // Add more noticeable noise for fabric texture
    const imageData = ctx.getImageData(0, 0, 512, 512);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 25; // Increased from 10 to 25
      imageData.data[i] += noise;     // R
      imageData.data[i + 1] += noise; // G
      imageData.data[i + 2] += noise; // B
    }
    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3); // Increased from 2 to 3 for more visible pattern

    return texture;
  }

  /**
   * Add stitching/seams to the shirt
   */
  addStitching(group, body, leftSleeve, rightSleeve, collar) {
    const stitchMaterial = new THREE.LineBasicMaterial({
      color: 0x333333,
      linewidth: 2,
      opacity: 0.6,
      transparent: true
    });

    // Shoulder seam - left
    const leftShoulderPoints = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      leftShoulderPoints.push(new THREE.Vector3(
        -0.9 + t * 0.05,
        1.0 + Math.sin(t * Math.PI) * 0.05,
        0.16
      ));
    }
    const leftShoulderGeometry = new THREE.BufferGeometry().setFromPoints(leftShoulderPoints);
    const leftShoulderStitch = new THREE.Line(leftShoulderGeometry, stitchMaterial);
    group.add(leftShoulderStitch);

    // Shoulder seam - right
    const rightShoulderPoints = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      rightShoulderPoints.push(new THREE.Vector3(
        0.9 - t * 0.05,
        1.0 + Math.sin(t * Math.PI) * 0.05,
        0.16
      ));
    }
    const rightShoulderGeometry = new THREE.BufferGeometry().setFromPoints(rightShoulderPoints);
    const rightShoulderStitch = new THREE.Line(rightShoulderGeometry, stitchMaterial);
    group.add(rightShoulderStitch);

    // Side seams
    const sideSeamPoints = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      const y = 1.0 - t * 2.0;
      sideSeamPoints.push(new THREE.Vector3(0.91, y, 0.16));
    }
    const sideSeamGeometry = new THREE.BufferGeometry().setFromPoints(sideSeamPoints);
    const leftSideStitch = new THREE.Line(sideSeamGeometry, stitchMaterial);
    group.add(leftSideStitch);

    const rightSideStitch = leftSideStitch.clone();
    rightSideStitch.position.x = -1.82;
    group.add(rightSideStitch);

    // Collar stitching (circular)
    const collarStitchPoints = [];
    for (let i = 0; i <= 40; i++) {
      const angle = (i / 40) * Math.PI;
      const radius = 0.48;
      collarStitchPoints.push(new THREE.Vector3(
        Math.sin(angle) * radius,
        1.18,
        Math.cos(angle) * radius
      ));
    }
    const collarStitchGeometry = new THREE.BufferGeometry().setFromPoints(collarStitchPoints);
    const collarStitch = new THREE.Line(collarStitchGeometry, stitchMaterial);
    group.add(collarStitch);

    // Hem stitching (bottom)
    const hemPoints = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      const x = -0.9 + t * 1.8;
      hemPoints.push(new THREE.Vector3(x, -1.08, 0.16));
    }
    const hemGeometry = new THREE.BufferGeometry().setFromPoints(hemPoints);
    const hemStitch = new THREE.Line(hemGeometry, stitchMaterial);
    group.add(hemStitch);

    console.log('✅ Stitching added to shirt');
  }

  /**
   * Create Interactive Product Configurator - OPTIMIZED (CON SOPORTE GLB)
   */
  async createProductConfigurator(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('❌ Container not found:', containerId);
      return;
    }

    if (typeof THREE === 'undefined') {
      console.error('❌ Three.js no está cargado.');
      this.showErrorMessage(container, 'Three.js no está disponible.');
      return;
    }

    // OPTIMIZED: Add loading indicator
    container.innerHTML = `
      <div class="three-loading-indicator" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: white; z-index: 100;">
        <div class="spinner" style="width: 40px; height: 40px; border: 3px solid rgba(74, 144, 226, 0.3); border-top-color: #4a90e2; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 0.5rem;"></div>
        <p style="font-size: 0.85rem; opacity: 0.7;">Cargando modelo 3D...</p>
      </div>
    `;

    // Check container dimensions
    const width = container.offsetWidth || 600;
    const height = container.offsetHeight || 600;

    console.log(`📐 Configurator dimensions: ${width}x${height}`);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);

    // OPTIMIZED: Reduce antialiasing for better performance
    const renderer = new THREE.WebGLRenderer({
      antialias: window.devicePixelRatio <= 1
    });

    renderer.setSize(width, height);
    // OPTIMIZED: Cap pixel ratio
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    console.log('✅ Configurator renderer created');

    // OPTIMIZED: Simplified lighting (DirectionalLight is cheaper than SpotLight)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // NUEVO: Try to load GLB model first, fallback to basic geometry
    let product;
    const modelPath = options.modelPath || '/static/models/t_shirt.glb';

    console.log('🎯 Intentando cargar modelo GLB:', modelPath);
    const glbModel = await this.loadGLBModel(modelPath);

    if (glbModel) {
      console.log('✅ Usando modelo GLB externo');
      product = glbModel;
      // Scale if needed
      if (options.modelScale) {
        product.scale.set(options.modelScale, options.modelScale, options.modelScale);
      }
    } else {
      console.log('⚠️ Usando modelo básico de geometría');
      product = this.createTShirtGeometry();
    }

    // Count meshes but DON'T change material color (keep white for texture visibility)
    let meshCount = 0;
    product.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshCount++;
        // Keep materials as created - they already have textures with white base color
      }
    });

    scene.add(product);
    console.log(`✅ Product added to configurator scene with ${meshCount} meshes:`, product);
    console.log('📍 Product position:', product.position);
    console.log('📍 Camera position:', camera.position);

    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);

    // Force initial render
    renderer.render(scene, camera);
    console.log('✅ Initial configurator render completed');

    // OPTIMIZED: Remove loading indicator after first render
    setTimeout(() => {
      const loadingIndicator = container.querySelector('.three-loading-indicator');
      if (loadingIndicator) {
        loadingIndicator.style.opacity = '0';
        loadingIndicator.style.transition = 'opacity 0.5s';
        setTimeout(() => loadingIndicator.remove(), 500);
      }
    }, 300);

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let zoom = 1;

    renderer.domElement.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    renderer.domElement.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        product.rotation.y += deltaX * 0.01;
        product.rotation.x += deltaY * 0.01;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    renderer.domElement.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Zoom with scroll
    renderer.domElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      zoom += e.deltaY * -0.001;
      zoom = Math.min(Math.max(0.5, zoom), 2);
      camera.position.z = 6 / zoom;
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
      const newWidth = container.offsetWidth || 600;
      const newHeight = container.offsetHeight || 600;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });

    // Store reference
    this.scenes.set(containerId, { scene, camera, renderer, product });

    console.log('✅ Product Configurator initialized successfully');

    // Logo/texture system
    let logoPlane = null;
    let logoTexture = null;

    // Return API for color changes and logo management
    return {
      changeColor: (color) => {
        // Convert color hex to RGB values
        const r = (color >> 16) & 255;
        const g = (color >> 8) & 255;
        const b = color & 255;
        const colorHex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

        product.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material && child.material.map) {
            // For meshes with textures, we need to recreate the fabric texture with the new color
            if (child.name === 'body' || child.name === 'leftSleeve' || child.name === 'rightSleeve' || child.name === 'collar') {
              // Create colored fabric texture
              const canvas = document.createElement('canvas');
              canvas.width = 512;
              canvas.height = 512;
              const ctx = canvas.getContext('2d');

              // Base fabric color - use the selected color
              ctx.fillStyle = colorHex;
              ctx.fillRect(0, 0, 512, 512);

              // Add more visible fabric weave pattern
              ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
              ctx.lineWidth = 1;

              // Horizontal threads
              for (let i = 0; i < 512; i += 3) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(512, i);
                ctx.stroke();
              }

              // Vertical threads
              for (let i = 0; i < 512; i += 3) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, 512);
                ctx.stroke();
              }

              // Add more noticeable noise for fabric texture
              const imageData = ctx.getImageData(0, 0, 512, 512);
              for (let i = 0; i < imageData.data.length; i += 4) {
                const noise = (Math.random() - 0.5) * 25;
                imageData.data[i] += noise;     // R
                imageData.data[i + 1] += noise; // G
                imageData.data[i + 2] += noise; // B
              }
              ctx.putImageData(imageData, 0, 0);

              // If this is the body mesh with a logo, redraw logo on top
              if (child.name === 'body' && child.userData.hasLogo && logoTexture) {
                const logoImg = logoTexture.image;
                const logoSize = 300;
                const logoX = (512 - logoSize) / 2;
                const logoY = 130; // Position slightly above center (scaled for 512px canvas)

                ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
              }

              // Create new texture from canvas
              const newTexture = new THREE.CanvasTexture(canvas);
              newTexture.wrapS = THREE.RepeatWrapping;
              newTexture.wrapT = THREE.RepeatWrapping;
              newTexture.repeat.set(3, 3);
              newTexture.needsUpdate = true;

              // Update material
              child.material.map = newTexture;
              child.material.color.setHex(0xffffff); // Keep white so texture shows its true colors
              child.material.needsUpdate = true;
            }
          }
        });

        console.log(`✅ Color changed to ${colorHex}`);
      },
      setView: (view) => {
        switch(view) {
          case 'front':
            camera.position.set(0, 0, 6);
            camera.lookAt(0, 0, 0);
            break;
          case 'back':
            camera.position.set(0, 0, -6);
            camera.lookAt(0, 0, 0);
            break;
          case 'left':
            camera.position.set(-6, 0, 0);
            camera.lookAt(0, 0, 0);
            break;
          case 'right':
            camera.position.set(6, 0, 0);
            camera.lookAt(0, 0, 0);
            break;
        }
      },
      addLogo: (imageUrl) => {
        return new Promise((resolve, reject) => {
          const loader = new THREE.TextureLoader();
          loader.load(
            imageUrl,
            (texture) => {
              // Remove existing logo if any
              if (logoPlane) {
                scene.remove(logoPlane);
                if (logoTexture) logoTexture.dispose();
              }

              logoTexture = texture;
              logoTexture.needsUpdate = true;

              // ENHANCED: Instead of floating plane, attach logo to shirt body mesh
              const bodyMesh = product.getObjectByName('body');

              if (bodyMesh) {
                // Clone the current material and add logo as a texture overlay
                const logoMaterial = bodyMesh.material.clone();

                // Create a canvas to combine fabric texture and logo
                const canvas = document.createElement('canvas');
                canvas.width = 1024;
                canvas.height = 1024;
                const ctx = canvas.getContext('2d');

                // Draw base fabric texture
                if (logoMaterial.map) {
                  const fabricImg = logoMaterial.map.image;
                  ctx.drawImage(fabricImg, 0, 0, 1024, 1024);
                } else {
                  ctx.fillStyle = '#' + logoMaterial.color.getHexString();
                  ctx.fillRect(0, 0, 1024, 1024);
                }

                // Draw logo on top (centered, scaled appropriately)
                const logoImg = texture.image;
                const logoSize = 300;
                const logoX = (1024 - logoSize) / 2;
                const logoY = 250; // Position slightly above center

                ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

                // Create new texture from combined canvas
                const combinedTexture = new THREE.CanvasTexture(canvas);
                combinedTexture.needsUpdate = true;

                // Apply to body mesh
                logoMaterial.map = combinedTexture;
                logoMaterial.needsUpdate = true;
                bodyMesh.material = logoMaterial;

                // Store reference for removal and initialize transform
                bodyMesh.userData.hasLogo = true;
                bodyMesh.userData.originalMaterial = bodyMesh.material;
                bodyMesh.userData.logoTransform = {
                  scale: 1,
                  rotation: 0,
                  positionX: 0,
                  positionY: 0.2
                };

                console.log('✅ Logo integrated onto shirt surface');
                resolve(bodyMesh);
              } else {
                // Fallback: use floating plane if body mesh not found
                const logoGeometry = new THREE.PlaneGeometry(1, 1);
                const logoMaterial = new THREE.MeshBasicMaterial({
                  map: logoTexture,
                  transparent: true,
                  side: THREE.DoubleSide,
                  depthTest: true,
                  depthWrite: false
                });

                logoPlane = new THREE.Mesh(logoGeometry, logoMaterial);
                logoPlane.position.set(0, 0.2, 0.16);
                logoPlane.name = 'customLogo';

                scene.add(logoPlane);
                console.log('⚠️ Logo added as floating plane (body mesh not found)');
                resolve(logoPlane);
              }
            },
            undefined,
            (error) => {
              console.error('❌ Error loading logo:', error);
              reject(error);
            }
          );
        });
      },
      removeLogo: () => {
        // Check if logo is on body mesh
        const bodyMesh = product.getObjectByName('body');
        if (bodyMesh && bodyMesh.userData.hasLogo) {
          // Restore fabric texture without logo
          const fabricTexture = this.createFabricTexture();
          const newMaterial = new THREE.MeshLambertMaterial({
            color: bodyMesh.material.color.clone(),
            map: fabricTexture
          });
          bodyMesh.material = newMaterial;
          bodyMesh.userData.hasLogo = false;
          delete bodyMesh.userData.originalMaterial;
          console.log('✅ Logo removed from shirt surface');
        }

        // Also remove floating plane if it exists
        if (logoPlane) {
          scene.remove(logoPlane);
          if (logoTexture) {
            logoTexture.dispose();
            logoTexture = null;
          }
          logoPlane.geometry.dispose();
          logoPlane.material.dispose();
          logoPlane = null;
          console.log('✅ Floating logo plane removed');
        }
      },
      updateLogoTransform: (options) => {
        // Check if logo is integrated in body mesh (not floating plane)
        const bodyMesh = product.getObjectByName('body');
        if (bodyMesh && bodyMesh.userData.hasLogo && logoTexture) {
          // Store transform parameters in userData
          if (!bodyMesh.userData.logoTransform) {
            bodyMesh.userData.logoTransform = {
              scale: 1,
              rotation: 0,
              positionX: 0,
              positionY: 0.2
            };
          }

          // Update transform values
          if (options.scale !== undefined) {
            bodyMesh.userData.logoTransform.scale = options.scale;
          }
          if (options.rotation !== undefined) {
            bodyMesh.userData.logoTransform.rotation = options.rotation;
          }
          if (options.positionX !== undefined) {
            bodyMesh.userData.logoTransform.positionX = options.positionX;
          }
          if (options.positionY !== undefined) {
            bodyMesh.userData.logoTransform.positionY = options.positionY;
          }

          // Recreate texture with transformed logo
          const transform = bodyMesh.userData.logoTransform;
          const canvas = document.createElement('canvas');
          canvas.width = 512;
          canvas.height = 512;
          const ctx = canvas.getContext('2d');

          // Get current color from material
          const currentColor = '#' + bodyMesh.material.color.getHexString();

          // Draw base fabric texture with current color
          ctx.fillStyle = currentColor;
          ctx.fillRect(0, 0, 512, 512);

          // Add more visible fabric weave pattern
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
          ctx.lineWidth = 1;

          for (let i = 0; i < 512; i += 3) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(512, i);
            ctx.stroke();
          }

          for (let i = 0; i < 512; i += 3) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 512);
            ctx.stroke();
          }

          // Add more noticeable noise
          const imageData = ctx.getImageData(0, 0, 512, 512);
          for (let i = 0; i < imageData.data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 25;
            imageData.data[i] += noise;
            imageData.data[i + 1] += noise;
            imageData.data[i + 2] += noise;
          }
          ctx.putImageData(imageData, 0, 0);

          // Draw logo with transformations
          ctx.save();

          // Calculate logo position and size
          const baseLogoSize = 300;
          const logoSize = baseLogoSize * transform.scale;
          const centerX = 256; // Center of 512px canvas
          const centerY = 256 - (transform.positionY * 200); // Convert -1 to 1 range to pixels

          // Translate to logo center
          ctx.translate(centerX + (transform.positionX * 200), centerY);

          // Rotate
          ctx.rotate(transform.rotation);

          // Draw logo centered on transform point
          ctx.drawImage(
            logoTexture.image,
            -logoSize / 2,
            -logoSize / 2,
            logoSize,
            logoSize
          );

          ctx.restore();

          // Update texture
          const newTexture = new THREE.CanvasTexture(canvas);
          newTexture.wrapS = THREE.RepeatWrapping;
          newTexture.wrapT = THREE.RepeatWrapping;
          newTexture.repeat.set(3, 3);
          newTexture.needsUpdate = true;

          bodyMesh.material.map = newTexture;
          bodyMesh.material.needsUpdate = true;

          console.log('✅ Logo transform updated:', transform);
        } else if (logoPlane) {
          // Fallback for floating plane (old system)
          if (options.scale !== undefined) {
            logoPlane.scale.set(options.scale, options.scale, 1);
          }

          if (options.rotation !== undefined) {
            logoPlane.rotation.z = options.rotation;
          }

          if (options.positionX !== undefined || options.positionY !== undefined) {
            if (options.positionX !== undefined) {
              logoPlane.position.x = options.positionX;
            }
            if (options.positionY !== undefined) {
              logoPlane.position.y = options.positionY;
            }
          }
        }
      },
      getLogoPlane: () => logoPlane,
      captureScreenshot: () => {
        // Render the scene
        renderer.render(scene, camera);

        // Get canvas data as image
        const dataURL = renderer.domElement.toDataURL('image/png');
        console.log('✅ Screenshot captured');
        return dataURL;
      },
      getCustomizationData: () => {
        const data = {
          color: null,
          logo: null
        };

        // Get current color
        product.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            data.color = '#' + child.material.color.getHexString();
            return;
          }
        });

        // Get logo data if exists
        if (logoPlane) {
          data.logo = {
            scale: logoPlane.scale.x,
            rotation: logoPlane.rotation.z,
            positionX: logoPlane.position.x,
            positionY: logoPlane.position.y,
            texture: logoTexture ? true : false
          };
        }

        return data;
      }
    };
  }

  /**
   * Create Fabric Layer Explosion Animation
   */
  createFabricExplosion(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('❌ Container not found:', containerId);
      return;
    }

    if (typeof THREE === 'undefined') {
      console.error('❌ Three.js no está cargado.');
      this.showErrorMessage(container, 'Three.js no está disponible.');
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    // Create fabric layers
    const layers = [];
    const layerColors = [0xff6b35, 0x004e89, 0xf7931e, 0x1a1a1a, 0xe0e0e0];
    const layerNames = ['Outer Shield', 'Moisture Control', 'Thermal Layer', 'Compression', 'Skin Contact'];

    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.PlaneGeometry(3, 3);
      const material = new THREE.MeshStandardMaterial({
        color: layerColors[i],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });

      const layer = new THREE.Mesh(geometry, material);
      layer.position.z = i * 0.1;
      layer.userData.name = layerNames[i];
      layer.userData.initialZ = i * 0.1;
      layers.push(layer);
      scene.add(layer);
    }

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    camera.position.z = 5;

    let explosionProgress = 0;
    let isExploded = false;

    const animate = () => {
      requestAnimationFrame(animate);

      layers.forEach((layer, index) => {
        if (isExploded) {
          const targetZ = layer.userData.initialZ + (index * 2);
          layer.position.z += (targetZ - layer.position.z) * 0.05;
        } else {
          layer.position.z += (layer.userData.initialZ - layer.position.z) * 0.05;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Store reference
    this.scenes.set(containerId, { scene, camera, renderer, layers });

    return {
      explode: () => { isExploded = true; },
      implode: () => { isExploded = false; },
      toggle: () => { isExploded = !isExploded; }
    };
  }
}

// Initialize global instance
window.threeEffects = new ThreeEffects();

// FIXED: Wait for Three.js to load before initializing
// This prevents "THREE is not defined" errors
function waitForThreeJS() {
  if (typeof THREE !== 'undefined') {
    console.log('✅ Three.js detected, initializing effects system...');
    window.threeEffects.init();
  } else {
    console.log('⏳ Waiting for Three.js to load...');
    // Try again after a short delay
    setTimeout(waitForThreeJS, 100);
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    waitForThreeJS();
  });
} else {
  waitForThreeJS();
}
