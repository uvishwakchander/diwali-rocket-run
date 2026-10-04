/**
 * Diwali Rocket Run: CDC2 Chennai to BDC14 Bangalore
 * High-Performance 3D Particle Systems Engine (Three.js WebGL)
 * 100% pre-allocated vertex buffers - ZERO runtime geometry/texture allocations.
 */

class ParticleSystem3D {
  constructor(scene) {
    this.scene = scene;

    // Pre-create shared particle textures ONCE
    this.particleTexture = this.createParticleTexture();
    this.sparkTexture = this.createSparkTexture();

    // 1. Exhaust particles pool
    this.maxExhaust = 160;
    this.exhaustParticles = [];
    this.initExhaustGeometry();

    // 2. Pre-allocated fireworks pool (No runtime allocations!)
    this.maxFireworks = 240;
    this.fireworkParticles = [];
    this.initFireworksGeometry();

    // 3. Collision debris sparks pool
    this.debrisMax = 60;
    this.debrisSparks = [];
    this.initDebrisGeometry();

    // 4. Victory confetti pool
    this.confettiMax = 150;
    this.confetti = [];
    this.initConfettiGeometry();
  }

  createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.35, 'rgba(255, 220, 100, 0.9)');
    grad.addColorStop(0.7, 'rgba(255, 120, 20, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    return new THREE.CanvasTexture(canvas);
  }

  createSparkTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.4, '#ffd700');
    grad.addColorStop(0.8, '#ff5400');
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  initExhaustGeometry() {
    this.exhaustGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.maxExhaust * 3);
    const colors = new Float32Array(this.maxExhaust * 3);

    this.exhaustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.exhaustGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.exhaustMat = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      map: this.particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.exhaustPoints = new THREE.Points(this.exhaustGeo, this.exhaustMat);
    this.exhaustPoints.frustumCulled = false;
    this.scene.add(this.exhaustPoints);
  }

  initFireworksGeometry() {
    this.fireworkGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.maxFireworks * 3);
    const colors = new Float32Array(this.maxFireworks * 3);

    this.fireworkGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.fireworkGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.fireworkMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      map: this.sparkTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.fireworkPoints = new THREE.Points(this.fireworkGeo, this.fireworkMat);
    this.fireworkPoints.frustumCulled = false;
    this.scene.add(this.fireworkPoints);
  }

  initDebrisGeometry() {
    this.debrisGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.debrisMax * 3);
    const colors = new Float32Array(this.debrisMax * 3);

    this.debrisGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.debrisGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.debrisMat = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      map: this.sparkTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.debrisPoints = new THREE.Points(this.debrisGeo, this.debrisMat);
    this.debrisPoints.frustumCulled = false;
    this.scene.add(this.debrisPoints);
  }

  initConfettiGeometry() {
    this.confettiGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.confettiMax * 3);
    const colors = new Float32Array(this.confettiMax * 3);

    this.confettiGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.confettiGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.confettiMat = new THREE.PointsMaterial({
      size: 2.0,
      vertexColors: true,
      map: this.sparkTexture,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    this.confettiPoints = new THREE.Points(this.confettiGeo, this.confettiMat);
    this.confettiPoints.frustumCulled = false;
    this.scene.add(this.confettiPoints);
  }

  emitExhaust(origin, velocityForward, isBoost = false, isSparkler = false) {
    const count = isBoost ? 4 : 2;

    for (let i = 0; i < count; i++) {
      if (this.exhaustParticles.length >= this.maxExhaust) {
        this.exhaustParticles.shift();
      }

      const spread = isBoost ? 0.35 : 0.2;
      const vx = (Math.random() - 0.5) * spread;
      const vy = (Math.random() - 0.5) * spread - 0.08;
      const vz = velocityForward * 0.4 + (Math.random() * 0.6 + 0.5);

      let r = 1.0, g = 0.5, b = 0.1;
      if (isBoost) {
        r = 0.1; g = 0.95; b = 0.85; // Cyan turbo
      } else if (isSparkler) {
        r = 1.0; g = 0.85; b = 0.4; // Gold sparkle
      }

      this.exhaustParticles.push({
        x: origin.x,
        y: origin.y,
        z: origin.z,
        vx, vy, vz,
        r, g, b,
        life: 1.0,
        decay: Math.random() * 0.04 + 0.03
      });
    }
  }

  spawnFirework(x, y, z) {
    const particleCount = 35;
    const defaultPalettes = [
      [[1, 0.8, 0], [1, 0.3, 0]],       // Gold & Saffron
      [[0.9, 0.1, 0.3], [1, 1, 1]],     // Crimson & White
      [[0.1, 0.9, 0.7], [0, 0.6, 1]],   // Peacock Cyan
      [[0.8, 0.2, 0.9], [1, 0.9, 0.3]]  // Violet & Gold
    ];
    const palette = defaultPalettes[Math.floor(Math.random() * defaultPalettes.length)];

    for (let i = 0; i < particleCount; i++) {
      if (this.fireworkParticles.length >= this.maxFireworks) {
        this.fireworkParticles.shift();
      }

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = Math.random() * 0.7 + 0.4;

      const c = palette[Math.floor(Math.random() * palette.length)];

      this.fireworkParticles.push({
        x, y, z,
        vx: speed * Math.sin(phi) * Math.cos(theta),
        vy: speed * Math.sin(phi) * Math.sin(theta),
        vz: speed * Math.cos(phi),
        r: c[0], g: c[1], b: c[2],
        life: 1.0,
        decay: Math.random() * 0.03 + 0.02
      });
    }
  }

  spawnCollisionSparks(origin) {
    const count = 25;
    for (let i = 0; i < count; i++) {
      if (this.debrisSparks.length >= this.debrisMax) {
        this.debrisSparks.shift();
      }

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.6 + 0.2;

      this.debrisSparks.push({
        x: origin.x,
        y: origin.y,
        z: origin.z,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 0.15,
        vz: (Math.random() - 0.5) * speed,
        r: 1.0,
        g: 0.5,
        b: 0.1,
        life: 1.0,
        decay: Math.random() * 0.05 + 0.04
      });
    }
  }

  spawnVictoryConfetti(origin) {
    const count = 8;
    const colors = [
      [1.0, 0.84, 0.0],
      [1.0, 0.45, 0.0],
      [0.85, 0.05, 0.2],
      [0.0, 0.95, 0.8]
    ];

    for (let i = 0; i < count; i++) {
      if (this.confetti.length >= this.confettiMax) {
        this.confetti.shift();
      }

      const c = colors[Math.floor(Math.random() * colors.length)];
      this.confetti.push({
        x: origin.x + (Math.random() - 0.5) * 30,
        y: origin.y + Math.random() * 16 + 4,
        z: origin.z + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.2 - 0.08,
        vz: (Math.random() - 0.5) * 0.2,
        r: c[0], g: c[1], b: c[2],
        life: 1.0,
        decay: 0.008,
        sway: Math.random() * Math.PI * 2
      });
    }
  }

  update(delta) {
    // 1. Update Exhaust
    const exPos = this.exhaustGeo.attributes.position.array;
    const exCol = this.exhaustGeo.attributes.color.array;

    for (let i = this.exhaustParticles.length - 1; i >= 0; i--) {
      const p = this.exhaustParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.exhaustParticles.splice(i, 1);
        continue;
      }

      exPos[i * 3] = p.x;
      exPos[i * 3 + 1] = p.y;
      exPos[i * 3 + 2] = p.z;

      exCol[i * 3] = p.r * p.life;
      exCol[i * 3 + 1] = p.g * p.life;
      exCol[i * 3 + 2] = p.b * p.life;
    }

    for (let i = this.exhaustParticles.length; i < this.maxExhaust; i++) {
      exPos[i * 3 + 1] = -9999;
    }

    this.exhaustGeo.attributes.position.needsUpdate = true;
    this.exhaustGeo.attributes.color.needsUpdate = true;

    // 2. Update Pre-allocated Fireworks
    const fwPos = this.fireworkGeo.attributes.position.array;
    const fwCol = this.fireworkGeo.attributes.color.array;

    for (let i = this.fireworkParticles.length - 1; i >= 0; i--) {
      const p = this.fireworkParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;
      p.vy -= 0.01; // Gravity
      p.life -= p.decay;

      if (p.life <= 0) {
        this.fireworkParticles.splice(i, 1);
        continue;
      }

      fwPos[i * 3] = p.x;
      fwPos[i * 3 + 1] = p.y;
      fwPos[i * 3 + 2] = p.z;

      fwCol[i * 3] = p.r * p.life;
      fwCol[i * 3 + 1] = p.g * p.life;
      fwCol[i * 3 + 2] = p.b * p.life;
    }

    for (let i = this.fireworkParticles.length; i < this.maxFireworks; i++) {
      fwPos[i * 3 + 1] = -9999;
    }

    this.fireworkGeo.attributes.position.needsUpdate = true;
    this.fireworkGeo.attributes.color.needsUpdate = true;

    // 3. Update Debris Sparks
    const debPos = this.debrisGeo.attributes.position.array;
    const debCol = this.debrisGeo.attributes.color.array;

    for (let i = this.debrisSparks.length - 1; i >= 0; i--) {
      const p = this.debrisSparks[i];
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;
      p.vy -= 0.02;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.debrisSparks.splice(i, 1);
        continue;
      }

      debPos[i * 3] = p.x;
      debPos[i * 3 + 1] = p.y;
      debPos[i * 3 + 2] = p.z;

      debCol[i * 3] = p.r * p.life;
      debCol[i * 3 + 1] = p.g * p.life;
      debCol[i * 3 + 2] = p.b * p.life;
    }

    for (let i = this.debrisSparks.length; i < this.debrisMax; i++) {
      debPos[i * 3 + 1] = -9999;
    }

    this.debrisGeo.attributes.position.needsUpdate = true;
    this.debrisGeo.attributes.color.needsUpdate = true;

    // 4. Update Confetti
    if (this.confetti.length > 0) {
      const cPos = this.confettiGeo.attributes.position.array;
      const cCol = this.confettiGeo.attributes.color.array;

      for (let i = this.confetti.length - 1; i >= 0; i--) {
        const p = this.confetti[i];
        p.sway += 0.05;
        p.x += p.vx + Math.sin(p.sway) * 0.08;
        p.y += p.vy;
        p.z += p.vz;
        p.life -= p.decay;

        if (p.life <= 0) {
          this.confetti.splice(i, 1);
          continue;
        }

        cPos[i * 3] = p.x;
        cPos[i * 3 + 1] = p.y;
        cPos[i * 3 + 2] = p.z;

        cCol[i * 3] = p.r * p.life;
        cCol[i * 3 + 1] = p.g * p.life;
        cCol[i * 3 + 2] = p.b * p.life;
      }

      for (let i = this.confetti.length; i < this.confettiMax; i++) {
        cPos[i * 3 + 1] = -9999;
      }

      this.confettiGeo.attributes.position.needsUpdate = true;
      this.confettiGeo.attributes.color.needsUpdate = true;
    }
  }
}
