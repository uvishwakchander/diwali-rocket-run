/**
 * Diwali Rocket Run: CDC2 Chennai to BDC14 Bangalore
 * 3D Procedural Models & High-Performance Asset Factory
 * Optimized with shared geometries, cached textures, and zero redundant PointLights.
 */

class ModelFactory {
  constructor() {
    // 1. Pre-generate and cache all canvas textures ONCE (no GPU texture creation during gameplay)
    this.wrapTexture = this.createFestiveWrapTexture();
    this.coinTexture = this.createCoinTexture();

    // 2. Pre-generate shared materials
    this.materials = this.initCommonMaterials();

    // 3. Pre-generate shared geometries for frequent entities
    this.sharedGeos = this.initSharedGeometries();
  }

  createFestiveWrapTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#b7094c';
    ctx.fillRect(0, 0, 128, 256);

    ctx.fillStyle = '#ffd700';
    for (let y = 15; y < 256; y += 35) {
      ctx.fillRect(0, y, 128, 7);
      for (let x = 8; x < 128; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x + 5, y + 3);
        ctx.lineTo(x, y + 12);
        ctx.lineTo(x - 5, y + 3);
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.fillStyle = '#007f5f';
    for (let y = 32; y < 256; y += 35) {
      ctx.fillRect(0, y, 128, 4);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  createCoinTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
    grad.addColorStop(0, '#fff3b0');
    grad.addColorStop(0.7, '#e0a96d');
    grad.addColorStop(1, '#99582a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(64, 64, 54, 0, Math.PI * 2);
    ctx.stroke();

    // Sacred Lotus
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(64, 64, 10, 24, 0, 0, Math.PI * 2);
    ctx.ellipse(64, 64, 10, 24, Math.PI / 4, 0, Math.PI * 2);
    ctx.ellipse(64, 64, 10, 24, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(64, 64, 12, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  initCommonMaterials() {
    return {
      goldMetal: new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.8,
        roughness: 0.3
      }),
      clayDiya: new THREE.MeshStandardMaterial({
        color: 0xc85a17,
        roughness: 0.85
      }),
      flameGlow: new THREE.MeshBasicMaterial({
        color: 0xffe066
      }),
      shieldEnergy: new THREE.MeshBasicMaterial({
        color: 0x00f5d4,
        transparent: true,
        opacity: 0.35,
        wireframe: true
      }),
      cloudDark: new THREE.MeshStandardMaterial({
        color: 0x22223b,
        roughness: 0.95,
        transparent: true,
        opacity: 0.9
      }),
      featherDark: new THREE.MeshStandardMaterial({
        color: 0x1d3557,
        roughness: 0.7
      }),
      beakYellow: new THREE.MeshStandardMaterial({
        color: 0xf4a261,
        roughness: 0.5
      }),
      wireMetal: new THREE.MeshStandardMaterial({
        color: 0x6c757d,
        metalness: 0.6,
        roughness: 0.4
      }),
      sparkArc: new THREE.MeshBasicMaterial({
        color: 0x00f5d4
      }),
      buildingConcrete: new THREE.MeshStandardMaterial({
        color: 0x1b263b,
        roughness: 0.8
      }),
      windowGlass: new THREE.MeshBasicMaterial({
        color: 0xffd166
      }),
      woodStick: new THREE.MeshStandardMaterial({
        color: 0x8b5a2b,
        roughness: 0.9
      }),
      coinMat: new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.85,
        roughness: 0.25,
        map: this.coinTexture
      }),
      nitroMat: new THREE.MeshStandardMaterial({
        color: 0x00f5d4,
        metalness: 0.6,
        roughness: 0.3,
        emissive: 0x005544
      })
    };
  }

  initSharedGeometries() {
    return {
      coinGeo: new THREE.CylinderGeometry(0.85, 0.85, 0.14, 16),
      coinRingGeo: new THREE.TorusGeometry(0.88, 0.05, 6, 16),
      cloudSphere1: new THREE.SphereGeometry(1.1, 7, 7),
      cloudSphere2: new THREE.SphereGeometry(0.9, 6, 6),
      birdBody: new THREE.ConeGeometry(0.35, 1.3, 6),
      birdBeak: new THREE.ConeGeometry(0.12, 0.45, 5),
      diyaBase: new THREE.CylinderGeometry(0.65, 0.35, 0.35, 12),
      diyaSpout: new THREE.ConeGeometry(0.32, 0.45, 8),
      diyaFlame: new THREE.ConeGeometry(0.2, 0.55, 8),
      diyaRing: new THREE.TorusGeometry(0.9, 0.04, 6, 16),
      nitroCyl: new THREE.CylinderGeometry(0.4, 0.4, 1.4, 12),
      nitroRing: new THREE.TorusGeometry(0.43, 0.05, 4, 12),
      nitroCap: new THREE.CylinderGeometry(0.2, 0.2, 0.3, 8),
      sparklerRod: new THREE.CylinderGeometry(0.04, 0.04, 1.8, 6),
      sparklerHead: new THREE.CylinderGeometry(0.12, 0.12, 1.1, 8),
      sparklerTip: new THREE.DodecahedronGeometry(0.22)
    };
  }

  // =========================================================================
  // PLAYER ROCKET (High fidelity, zero redundant sub-lights)
  // =========================================================================
  createPlayerRocket() {
    const rocketGroup = new THREE.Group();

    // 1. Rocket Cylindrical Body
    const bodyGeo = new THREE.CylinderGeometry(0.38, 0.42, 2.2, 12);
    const bodyMat = new THREE.MeshStandardMaterial({
      map: this.wrapTexture,
      roughness: 0.4,
      metalness: 0.2
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.rotation.x = Math.PI / 2;
    rocketGroup.add(bodyMesh);

    // 2. Conical Golden Nose Cone
    const noseGeo = new THREE.ConeGeometry(0.44, 1.1, 12);
    const noseMesh = new THREE.Mesh(noseGeo, this.materials.goldMetal);
    noseMesh.rotation.x = -Math.PI / 2;
    noseMesh.position.z = -1.6;
    rocketGroup.add(noseMesh);

    // 3. Wooden Guide Stick
    const stickGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.8, 6);
    const stickMesh = new THREE.Mesh(stickGeo, this.materials.woodStick);
    stickMesh.rotation.x = Math.PI / 2;
    stickMesh.position.set(0.3, -0.28, 1.3);
    rocketGroup.add(stickMesh);

    // 4. Tail Fins (4 fins via simple boxes for speed)
    for (let i = 0; i < 4; i++) {
      const finGeo = new THREE.BoxGeometry(0.04, 0.7, 0.7);
      const finMesh = new THREE.Mesh(finGeo, this.materials.goldMetal);
      finMesh.rotation.z = (Math.PI / 2) * i;
      finMesh.position.set(0, 0, 0.8);
      if (i % 2 === 0) finMesh.position.x = (i === 0 ? 0.42 : -0.42);
      else finMesh.position.y = (i === 1 ? 0.42 : -0.42);
      rocketGroup.add(finMesh);
    }

    // 5. Exhaust Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(0.25, 0.32, 0.35, 10);
    const nozzleMesh = new THREE.Mesh(nozzleGeo, this.materials.goldMetal);
    nozzleMesh.rotation.x = Math.PI / 2;
    nozzleMesh.position.z = 1.25;
    rocketGroup.add(nozzleMesh);

    // 6. Shield Energy Sphere
    const shieldGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const shieldMesh = new THREE.Mesh(shieldGeo, this.materials.shieldEnergy);
    shieldMesh.name = 'shieldMesh';
    shieldMesh.visible = false;
    rocketGroup.add(shieldMesh);

    // 7. Single player lighting (illuminates ground)
    const rocketLight = new THREE.PointLight(0xffb703, 1.2, 10);
    rocketLight.position.set(0, 0, 1.2);
    rocketGroup.add(rocketLight);

    rocketGroup.userData = { radius: 0.65 };
    return rocketGroup;
  }

  // =========================================================================
  // POWER-UPS (Reusing shared geometries and NO extra point lights)
  // =========================================================================

  createDiyaShield(isRoadside = false) {
    const diyaGroup = new THREE.Group();
    diyaGroup.userData = { type: 'diya', radius: 1.1 };

    const baseMesh = new THREE.Mesh(this.sharedGeos.diyaBase, this.materials.clayDiya);
    diyaGroup.add(baseMesh);

    const lipMesh = new THREE.Mesh(this.sharedGeos.diyaSpout, this.materials.clayDiya);
    lipMesh.rotation.x = Math.PI / 2;
    lipMesh.position.set(0, 0.1, -0.55);
    diyaGroup.add(lipMesh);

    const flameMesh = new THREE.Mesh(this.sharedGeos.diyaFlame, this.materials.flameGlow);
    flameMesh.position.set(0, 0.35, -0.35);
    diyaGroup.add(flameMesh);

    if (!isRoadside) {
      const ringMesh = new THREE.Mesh(this.sharedGeos.diyaRing, this.materials.goldMetal);
      ringMesh.rotation.x = Math.PI / 2;
      diyaGroup.add(ringMesh);
    }

    return diyaGroup;
  }

  createSparkler() {
    const sparklerGroup = new THREE.Group();
    sparklerGroup.userData = { type: 'sparkler', radius: 1.0 };

    const wireMesh = new THREE.Mesh(this.sharedGeos.sparklerRod, this.materials.wireMetal);
    sparklerGroup.add(wireMesh);

    const headMat = new THREE.MeshStandardMaterial({ color: 0x9e9e9e, roughness: 0.9 });
    const headMesh = new THREE.Mesh(this.sharedGeos.sparklerHead, headMat);
    headMesh.position.y = 0.35;
    sparklerGroup.add(headMesh);

    const tipMesh = new THREE.Mesh(this.sharedGeos.sparklerTip, this.materials.flameGlow);
    tipMesh.position.y = 0.95;
    sparklerGroup.add(tipMesh);

    const ringGeo = new THREE.TorusGeometry(0.55, 0.03, 4, 12);
    const ringMesh = new THREE.Mesh(ringGeo, this.materials.goldMetal);
    ringMesh.name = 'orbitRing';
    sparklerGroup.add(ringMesh);

    return sparklerGroup;
  }

  createLakshmiCoin() {
    const coinGroup = new THREE.Group();
    coinGroup.userData = { type: 'coin', radius: 0.9 };

    const coinMesh = new THREE.Mesh(this.sharedGeos.coinGeo, this.materials.coinMat);
    coinMesh.rotation.x = Math.PI / 2;
    coinGroup.add(coinMesh);

    const borderMesh = new THREE.Mesh(this.sharedGeos.coinRingGeo, this.materials.goldMetal);
    coinGroup.add(borderMesh);

    return coinGroup;
  }

  createNitroCanister() {
    const nitroGroup = new THREE.Group();
    nitroGroup.userData = { type: 'nitro', radius: 1.0 };

    const cylMesh = new THREE.Mesh(this.sharedGeos.nitroCyl, this.materials.nitroMat);
    nitroGroup.add(cylMesh);

    const ring1 = new THREE.Mesh(this.sharedGeos.nitroRing, this.materials.goldMetal);
    ring1.position.y = 0.35;
    const ring2 = new THREE.Mesh(this.sharedGeos.nitroRing, this.materials.goldMetal);
    ring2.position.y = -0.35;
    nitroGroup.add(ring1, ring2);

    const capMesh = new THREE.Mesh(this.sharedGeos.nitroCap, this.materials.goldMetal);
    capMesh.position.y = 0.8;
    nitroGroup.add(capMesh);

    return nitroGroup;
  }

  // =========================================================================
  // OBSTACLES (Optimized geometries and NO PointLights)
  // =========================================================================

  createRainCloud() {
    const cloudGroup = new THREE.Group();
    cloudGroup.userData = { type: 'cloud', radius: 2.2 };

    const s1 = new THREE.Mesh(this.sharedGeos.cloudSphere1, this.materials.cloudDark);
    s1.scale.set(1.4, 0.9, 1.2);

    const s2 = new THREE.Mesh(this.sharedGeos.cloudSphere2, this.materials.cloudDark);
    s2.scale.set(1.1, 0.8, 1.0);
    s2.position.set(-1.1, -0.2, 0.2);

    const s3 = new THREE.Mesh(this.sharedGeos.cloudSphere2, this.materials.cloudDark);
    s3.scale.set(1.2, 0.85, 1.1);
    s3.position.set(1.0, -0.1, -0.2);

    cloudGroup.add(s1, s2, s3);

    // Rain drop streaks (Lines)
    const rainCount = 10;
    const rainGeo = new THREE.BufferGeometry();
    const rainPos = new Float32Array(rainCount * 6);
    for (let i = 0; i < rainCount; i++) {
      const rx = (Math.random() - 0.5) * 2.8;
      const rz = (Math.random() - 0.5) * 1.6;
      const ry = -0.4 - Math.random() * 0.4;
      rainPos[i * 6] = rx;
      rainPos[i * 6 + 1] = ry;
      rainPos[i * 6 + 2] = rz;
      rainPos[i * 6 + 3] = rx;
      rainPos[i * 6 + 4] = ry - 1.5;
      rainPos[i * 6 + 5] = rz;
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
    const rainMat = new THREE.LineBasicMaterial({ color: 0x4cc9f0, transparent: true, opacity: 0.6 });
    const rainLines = new THREE.LineSegments(rainGeo, rainMat);
    cloudGroup.add(rainLines);

    return cloudGroup;
  }

  createBird() {
    const birdGroup = new THREE.Group();
    birdGroup.userData = { type: 'bird', radius: 1.1, wingPhase: Math.random() * Math.PI * 2 };

    const bodyMesh = new THREE.Mesh(this.sharedGeos.birdBody, this.materials.featherDark);
    bodyMesh.rotation.x = Math.PI / 2;
    birdGroup.add(bodyMesh);

    const beakMesh = new THREE.Mesh(this.sharedGeos.birdBeak, this.materials.beakYellow);
    beakMesh.rotation.x = -Math.PI / 2;
    beakMesh.position.z = -0.8;
    birdGroup.add(beakMesh);

    // Fast quad wings
    const wingGeo = new THREE.BoxGeometry(1.3, 0.04, 0.5);
    const leftWing = new THREE.Mesh(wingGeo, this.materials.featherDark);
    leftWing.name = 'leftWing';
    leftWing.position.set(0.7, 0, 0);
    birdGroup.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeo, this.materials.featherDark);
    rightWing.name = 'rightWing';
    rightWing.position.set(-0.7, 0, 0);
    birdGroup.add(rightWing);

    return birdGroup;
  }

  createBuildingTower(height = 14, width = 4) {
    const towerGroup = new THREE.Group();
    towerGroup.userData = { type: 'building', radius: 2.4, halfWidth: width / 2, halfHeight: height / 2 };

    const towerGeo = new THREE.BoxGeometry(width, height, 3.5);
    const towerMesh = new THREE.Mesh(towerGeo, this.materials.buildingConcrete);
    towerGroup.add(towerMesh);

    // Fast combined window rows
    const windowRows = Math.floor(height / 2.5);
    for (let r = 0; r < windowRows; r++) {
      const winGeo = new THREE.BoxGeometry(width * 0.8, 0.35, 3.6);
      const winMesh = new THREE.Mesh(winGeo, this.materials.windowGlass);
      winMesh.position.y = -height / 2 + 1.4 + r * 2.5;
      towerGroup.add(winMesh);
    }

    const antGeo = new THREE.CylinderGeometry(0.08, 0.12, 3.0, 5);
    const antMesh = new THREE.Mesh(antGeo, this.materials.wireMetal);
    antMesh.position.y = height / 2 + 1.5;
    towerGroup.add(antMesh);

    const beaconGeo = new THREE.SphereGeometry(0.2, 5, 5);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    beaconMesh.position.y = height / 2 + 3.1;
    towerGroup.add(beaconMesh);

    return towerGroup;
  }

  createElectricPylon(spanWidth = 28, height = 18) {
    const pylonGroup = new THREE.Group();
    pylonGroup.userData = { type: 'wire', radius: 2.2, height: height, spanWidth: spanWidth };

    // Lightweight lattice towers
    const towerGeo = new THREE.BoxGeometry(0.8, height, 0.8);
    const leftTower = new THREE.Mesh(towerGeo, this.materials.wireMetal);
    leftTower.position.set(-spanWidth / 2, height / 2, 0);
    const rightTower = new THREE.Mesh(towerGeo, this.materials.wireMetal);
    rightTower.position.set(spanWidth / 2, height / 2, 0);
    pylonGroup.add(leftTower, rightTower);

    // Fast straight crossbar & cables
    const cableY = height - 2.0;
    const cableGeo = new THREE.BoxGeometry(spanWidth, 0.12, 0.12);
    const cableMesh = new THREE.Mesh(cableGeo, this.materials.wireMetal);
    cableMesh.position.set(0, cableY, 0);
    pylonGroup.add(cableMesh);

    // Spark Hazard
    const sparkGeo = new THREE.DodecahedronGeometry(0.35);
    const sparkMesh = new THREE.Mesh(sparkGeo, this.materials.sparkArc);
    sparkMesh.name = 'electricSpark';
    sparkMesh.position.set(0, cableY, 0);
    pylonGroup.add(sparkMesh);

    return pylonGroup;
  }

  createWindGust() {
    const gustGroup = new THREE.Group();
    gustGroup.userData = { type: 'wind', radius: 2.4 };

    // Fast rings forming a vortex tunnel
    for (let i = 0; i < 4; i++) {
      const ringGeo = new THREE.TorusGeometry(1.2 + i * 0.4, 0.06, 4, 12);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.5 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.z = (i - 1.5) * 1.5;
      ring.rotation.z = i * 0.8;
      gustGroup.add(ring);
    }

    return gustGroup;
  }

  // =========================================================================
  // MILESTONES & LANDMARKS
  // =========================================================================

  createMilestoneGateway(cityName, landmarkSubtitle) {
    const archGroup = new THREE.Group();
    archGroup.userData = { type: 'milestoneArch', cityName };

    const archWidth = 32;
    const archHeight = 15;

    const pillarGeo = new THREE.CylinderGeometry(0.9, 1.2, archHeight, 8);
    const leftPillar = new THREE.Mesh(pillarGeo, this.materials.goldMetal);
    leftPillar.position.set(-archWidth / 2, archHeight / 2, 0);
    const rightPillar = new THREE.Mesh(pillarGeo, this.materials.goldMetal);
    rightPillar.position.set(archWidth / 2, archHeight / 2, 0);
    archGroup.add(leftPillar, rightPillar);

    const beamGeo = new THREE.BoxGeometry(archWidth + 3, 2.2, 1.8);
    const beamMesh = new THREE.Mesh(beamGeo, this.materials.goldMetal);
    beamMesh.position.set(0, archHeight, 0);
    archGroup.add(beamMesh);

    // Signboard
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 512;
    signCanvas.height = 128;
    const ctx = signCanvas.getContext('2d');

    ctx.fillStyle = '#480ca8';
    ctx.fillRect(0, 0, 512, 128);
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 8;
    ctx.strokeRect(6, 6, 500, 116);

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`✨ ${cityName.toUpperCase()} ✨`, 256, 58);

    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(landmarkSubtitle.toUpperCase(), 256, 100);

    const signTexture = new THREE.CanvasTexture(signCanvas);
    const signGeo = new THREE.PlaneGeometry(archWidth * 0.75, 4.0);
    const signMat = new THREE.MeshBasicMaterial({ map: signTexture, side: THREE.DoubleSide });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, archHeight + 2.4, 0);
    archGroup.add(sign);

    return archGroup;
  }

  createLandmarkProp(cityKey) {
    const propGroup = new THREE.Group();

    if (cityKey === 'vellore') {
      const wallGeo = new THREE.BoxGeometry(22, 10, 8);
      const wallMat = new THREE.MeshStandardMaterial({ color: 0x5a504b, roughness: 0.95 });
      const wall = new THREE.Mesh(wallGeo, wallMat);
      wall.position.y = 5;

      const towerGeo = new THREE.CylinderGeometry(4, 4.5, 14, 8);
      const tower = new THREE.Mesh(towerGeo, wallMat);
      tower.position.set(8, 7, 2);
      propGroup.add(wall, tower);
    } else if (cityKey === 'krishnagiri') {
      const rockMat = new THREE.MeshStandardMaterial({ color: 0x4a4441, roughness: 0.9 });
      for (let i = 0; i < 3; i++) {
        const rockGeo = new THREE.DodecahedronGeometry(8 + i * 3, 0);
        const rock = new THREE.Mesh(rockGeo, rockMat);
        rock.scale.set(1.4, 0.9, 1.2);
        rock.position.set(-6 + i * 8, 5 + i * 2, -i * 5);
        propGroup.add(rock);
      }
    } else if (cityKey === 'hosur') {
      const frameGeo = new THREE.BoxGeometry(18, 12, 5);
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x2b3a4a, metalness: 0.5, roughness: 0.5 });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      frame.position.y = 6;
      propGroup.add(frame);
    } else if (cityKey === 'bangalore') {
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x00b4d8,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x003355
      });
      const tower1 = new THREE.Mesh(new THREE.BoxGeometry(10, 36, 12), glassMat);
      tower1.position.set(-14, 18, 0);
      const tower2 = new THREE.Mesh(new THREE.BoxGeometry(10, 42, 12), glassMat);
      tower2.position.set(14, 21, 0);
      propGroup.add(tower1, tower2);
    }

    return propGroup;
  }
}
