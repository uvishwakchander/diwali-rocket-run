/**
 * Diwali Rocket Run: CDC2 Chennai to BDC14 Bangalore
 * 3D Highway Corridor & Milestone Environment Manager (Optimized)
 */

class World3D {
  constructor(scene, modelFactory) {
    this.scene = scene;
    this.modelFactory = modelFactory;

    // Road segments pool
    this.roadSegments = [];
    this.segmentLength = 60;
    this.numSegments = 8;
    this.roadWidth = 24;

    // Sky lanterns
    this.lanterns = [];

    // Milestone gateway & props trackers
    this.spawnedMilestones = {};
    this.activeMilestoneMeshes = [];

    this.initSkyAndLighting();
    this.initHighwayCorridor();
    this.initSkyLanterns();
  }

  initSkyAndLighting() {
    // 1. Atmosphere: Background & Fog
    this.scene.background = new THREE.Color(0x08031a);
    this.scene.fog = new THREE.FogExp2(0x0e0826, 0.007);

    // Single hemispheric ambient light
    const hemiLight = new THREE.HemisphereLight(0x7209b7, 0x1b263b, 0.7);
    this.scene.add(hemiLight);

    // Single directional moonlight
    const moonDirLight = new THREE.DirectionalLight(0xa0c4ff, 0.9);
    moonDirLight.position.set(30, 80, -50);
    this.scene.add(moonDirLight);

    // 2. Starfield (600 stars - optimized)
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0) * 0.5;
      const r = 260;

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.cos(phi) + 20;
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const sparkle = Math.random();
      if (sparkle > 0.7) {
        starColors[i * 3] = 1.0;
        starColors[i * 3 + 1] = 0.85;
        starColors[i * 3 + 2] = 0.4; // Gold star
      } else {
        starColors[i * 3] = 0.8;
        starColors[i * 3 + 1] = 0.9;
        starColors[i * 3 + 2] = 1.0;
      }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.9
    });
    this.starPoints = new THREE.Points(starGeo, starMat);
    this.scene.add(this.starPoints);

    // 3. Glowing Full Moon
    const moonGeo = new THREE.SphereGeometry(14, 12, 12);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xfff3b0 });
    this.moonMesh = new THREE.Mesh(moonGeo, moonMat);
    this.moonMesh.position.set(70, 95, -240);
    this.scene.add(this.moonMesh);

    // Moon Glow halo
    const haloGeo = new THREE.RingGeometry(14, 22, 16);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xffe6a7,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const moonHalo = new THREE.Mesh(haloGeo, haloMat);
    moonHalo.position.set(70, 95, -239);
    moonHalo.lookAt(0, 0, 0);
    this.scene.add(moonHalo);
  }

  initSkyLanterns() {
    // 20 floating lanterns using glowing basic material (zero extra point lights)
    const lanternCount = 20;
    const bodyGeo = new THREE.CylinderGeometry(0.5, 0.4, 0.9, 6);
    const matOrange = new THREE.MeshBasicMaterial({ color: 0xff5400 });
    const matYellow = new THREE.MeshBasicMaterial({ color: 0xffb703 });

    for (let i = 0; i < lanternCount; i++) {
      const lantern = new THREE.Mesh(bodyGeo, Math.random() > 0.5 ? matOrange : matYellow);
      lantern.position.set(
        (Math.random() - 0.5) * 80,
        15 + Math.random() * 25,
        -Math.random() * 300
      );

      lantern.userData = {
        swaySpeed: Math.random() * 1.5 + 0.8,
        driftSpeedY: Math.random() * 0.4 + 0.2,
        phase: Math.random() * Math.PI * 2
      };

      this.scene.add(lantern);
      this.lanterns.push(lantern);
    }
  }

  initHighwayCorridor() {
    for (let i = 0; i < this.numSegments; i++) {
      const segment = this.createSegment();
      segment.position.z = -i * this.segmentLength;
      this.scene.add(segment);
      this.roadSegments.push(segment);
    }
  }

  createSegment() {
    const group = new THREE.Group();

    // 1. Asphalt Road Bed
    const roadGeo = new THREE.PlaneGeometry(this.roadWidth, this.segmentLength);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x141824,
      roughness: 0.9,
      metalness: 0.1
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    group.add(roadMesh);

    // 2. Highway Lane Markings (Dashed Center Line & Golden Borders)
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const dashCount = 5;
    for (let d = 0; d < dashCount; d++) {
      const dashGeo = new THREE.PlaneGeometry(0.4, 4);
      const dashMesh = new THREE.Mesh(dashGeo, lineMat);
      dashMesh.rotation.x = -Math.PI / 2;
      dashMesh.position.set(0, 0.02, -this.segmentLength / 2 + d * (this.segmentLength / dashCount) + 2);
      group.add(dashMesh);
    }

    // Side Borders
    const borderGeo = new THREE.PlaneGeometry(0.3, this.segmentLength);
    const leftBorder = new THREE.Mesh(borderGeo, lineMat);
    leftBorder.rotation.x = -Math.PI / 2;
    leftBorder.position.set(-this.roadWidth / 2 + 0.5, 0.02, 0);
    const rightBorder = new THREE.Mesh(borderGeo, lineMat);
    rightBorder.rotation.x = -Math.PI / 2;
    rightBorder.position.set(this.roadWidth / 2 - 0.5, 0.02, 0);
    group.add(leftBorder, rightBorder);

    // 3. Streetlights with Glowing Bulbs (BasicMaterial)
    const poleGeo = new THREE.CylinderGeometry(0.12, 0.16, 9, 5);
    const armGeo = new THREE.BoxGeometry(2.5, 0.15, 0.15);
    const poleMat = this.modelFactory.materials.wireMetal;
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xffe066 });

    [-this.roadWidth / 2 - 1.2, this.roadWidth / 2 + 1.2].forEach((xSide) => {
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(xSide, 4.5, -this.segmentLength / 2 + 10);

      const arm = new THREE.Mesh(armGeo, poleMat);
      arm.position.set(xSide > 0 ? -1.0 : 1.0, 4.2, 0);
      pole.add(arm);

      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.25, 4, 4), lampMat);
      bulb.position.set(xSide > 0 ? -2.0 : 2.0, 4.1, 0);
      pole.add(bulb);

      group.add(pole);
    });

    // 4. Roadside Festive Clay Diyas (Lightweight, no point lights)
    for (let z = -this.segmentLength / 2 + 6; z < this.segmentLength / 2; z += 18) {
      const leftDiya = this.modelFactory.createDiyaShield(true);
      leftDiya.scale.set(0.35, 0.35, 0.35);
      leftDiya.position.set(-this.roadWidth / 2 + 0.8, 0.2, z);

      const rightDiya = this.modelFactory.createDiyaShield(true);
      rightDiya.scale.set(0.35, 0.35, 0.35);
      rightDiya.position.set(this.roadWidth / 2 - 0.8, 0.2, z);

      group.add(leftDiya, rightDiya);
    }

    return group;
  }

  spawnMilestoneGateway(cityName, landmarkKey, distanceZ) {
    if (this.spawnedMilestones[cityName]) return;
    this.spawnedMilestones[cityName] = true;

    const subtitles = {
      'Vellore': 'Historic Fort City',
      'Krishnagiri': 'Granite Gateway of Hills',
      'Hosur': 'Industrial Border Gateway',
      'Bangalore': 'BDC14 Tech Campus Finale'
    };

    const arch = this.modelFactory.createMilestoneGateway(cityName, subtitles[cityName] || 'Diwali Celebration');
    arch.position.set(0, 0, distanceZ);
    this.scene.add(arch);
    this.activeMilestoneMeshes.push(arch);

    if (landmarkKey) {
      const prop = this.modelFactory.createLandmarkProp(landmarkKey);
      prop.position.set(22, 0, distanceZ + 10);
      this.scene.add(prop);
      this.activeMilestoneMeshes.push(prop);
    }
  }

  /**
   * Reset world environment and reposition road segments back to start line (z = 0)
   */
  reset() {
    // Reset all road segments to initial sequence: z = 0, -60, -120, etc.
    for (let i = 0; i < this.numSegments; i++) {
      this.roadSegments[i].position.z = -i * this.segmentLength;
    }

    // Reset starfield and moon positions
    if (this.starPoints) {
      this.starPoints.position.z = 0;
    }
    if (this.moonMesh) {
      this.moonMesh.position.z = -240;
    }

    // Re-scatter lanterns across the starting corridor
    this.lanterns.forEach((lantern) => {
      lantern.position.set(
        (Math.random() - 0.5) * 80,
        15 + Math.random() * 25,
        -Math.random() * 300
      );
    });
  }

  update(rocketZ, delta) {
    // 1. Recycle road segments ahead of player
    this.roadSegments.forEach((segment) => {
      if (segment.position.z > rocketZ + this.segmentLength) {
        segment.position.z -= this.numSegments * this.segmentLength;
      }
    });

    // 2. Starfield & Moon subtle parallax follow
    if (this.starPoints) {
      this.starPoints.position.z = rocketZ * 0.85;
    }
    if (this.moonMesh) {
      this.moonMesh.position.z = rocketZ - 240;
    }

    // 3. Update floating sky lanterns
    this.lanterns.forEach((lantern) => {
      const u = lantern.userData;
      u.phase += delta * u.swaySpeed;
      lantern.position.y += delta * u.driftSpeedY;
      lantern.position.x += Math.sin(u.phase) * 0.05;

      if (lantern.position.z > rocketZ + 20) {
        lantern.position.z = rocketZ - 260 - Math.random() * 50;
        lantern.position.y = 12 + Math.random() * 20;
      }
    });
  }
}
