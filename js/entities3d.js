/**
 * Diwali Rocket Run: CDC2 Chennai to BDC14 Bangalore
 * Player 3D Rocket Controller, Obstacle Spawner & Collision Engine
 */

class PlayerRocket {
  constructor(scene, modelFactory, particleSystem) {
    this.scene = scene;
    this.modelFactory = modelFactory;
    this.particles = particleSystem;

    this.mesh = this.modelFactory.createPlayerRocket();
    this.scene.add(this.mesh);

    // Initial position
    this.reset();
  }

  reset() {
    this.mesh.position.set(0, 5, 0);
    this.mesh.rotation.set(0, 0, 0);

    // Physics
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    this.baseSpeed = 40;
    this.currentSpeed = this.baseSpeed;
    this.gravity = 18;
    this.thrustPower = 28;

    // Flight boundaries
    this.minX = -10.5;
    this.maxX = 10.5;
    this.minY = 1.4;
    this.maxY = 15.5;

    // Player Status
    this.maxHealth = 3;
    this.health = 3;
    this.fuel = 100.0;
    this.isDead = false;

    // Power-up Buffs
    this.shieldTimer = 0;
    this.sparklerTimer = 0;
    this.nitroTimer = 0;
    this.invulnerableTimer = 0;

    // Shield mesh ref
    this.shieldMesh = this.mesh.getObjectByName('shieldMesh');
    if (this.shieldMesh) this.shieldMesh.visible = false;
  }

  get position() {
    return this.mesh.position;
  }

  get isShielded() {
    return this.shieldTimer > 0;
  }

  get isSparklerActive() {
    return this.sparklerTimer > 0;
  }

  get isNitroActive() {
    return this.nitroTimer > 0;
  }

  /**
   * Main flight update
   */
  update(input, delta) {
    if (this.isDead) return;

    // 1. Buff Timers
    if (this.shieldTimer > 0) {
      this.shieldTimer -= delta;
      if (this.shieldMesh) {
        this.shieldMesh.visible = true;
        this.shieldMesh.rotation.y += delta * 2;
        this.shieldMesh.rotation.x += delta * 1.5;
      }
    } else {
      if (this.shieldMesh) this.shieldMesh.visible = false;
    }

    if (this.sparklerTimer > 0) {
      this.sparklerTimer -= delta;
    }

    if (this.nitroTimer > 0) {
      this.nitroTimer -= delta;
      this.currentSpeed = 70; // Turbo speed
    } else if (this.sparklerTimer > 0) {
      this.currentSpeed = 52; // Boost speed
    } else {
      this.currentSpeed = this.baseSpeed;
    }

    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= delta;
      // Blink rocket mesh
      this.mesh.visible = Math.floor(this.invulnerableTimer * 12) % 2 === 0;
    } else {
      this.mesh.visible = true;
    }

    // 2. Generous Fuel Consumption (Cruising: ~0.4%/s, Active Thrust: ~1.0%/s)
    if (this.nitroTimer <= 0) {
      const fuelDrain = input.thrust ? 0.10 : 0.04;
      this.fuel = Math.max(0, this.fuel - fuelDrain * delta * 10);
    }

    // 3. Vertical Flight Dynamics
    if (this.fuel > 0 && input.thrust) {
      this.vy += this.thrustPower * delta;
    } else {
      this.vy -= this.gravity * delta;
    }

    if (input.dive) {
      this.vy -= this.thrustPower * 0.7 * delta;
    }

    // Dampen vertical velocity
    this.vy *= 0.94;
    this.mesh.position.y += this.vy * delta;

    // Floor and Ceiling clamps
    if (this.mesh.position.y < this.minY) {
      this.mesh.position.y = this.minY;
      this.vy = 0;
    }
    if (this.mesh.position.y > this.maxY) {
      this.mesh.position.y = this.maxY;
      this.vy = 0;
    }

    // 4. Horizontal Steering & Banking
    const steerSpeed = 22;
    if (input.moveLeft) {
      this.vx = -steerSpeed;
    } else if (input.moveRight) {
      this.vx = steerSpeed;
    } else {
      this.vx *= 0.85; // Decay
    }

    this.mesh.position.x += this.vx * delta;
    this.mesh.position.x = Math.max(this.minX, Math.min(this.maxX, this.mesh.position.x));

    // 5. Forward Movement (Along -Z)
    this.mesh.position.z -= this.currentSpeed * delta;

    // 6. Smooth Rotations & Aerodynamic Banking
    const targetRoll = (-this.vx / steerSpeed) * 0.55; // Roll on turn
    const targetPitch = (this.vy / this.thrustPower) * 0.35; // Pitch on climb/dive

    this.mesh.rotation.z += (targetRoll - this.mesh.rotation.z) * 0.15;
    this.mesh.rotation.x += (targetPitch - this.mesh.rotation.x) * 0.15;

    // 7. Emit Exhaust Particles from Nozzle
    if (this.fuel > 0 || this.currentSpeed > 10) {
      const nozzlePos = new THREE.Vector3(0, -0.1, 1.3).applyMatrix4(this.mesh.matrixWorld);
      this.particles.emitExhaust(
        nozzlePos,
        this.currentSpeed * delta,
        this.isNitroActive,
        this.isSparklerActive
      );
    }
  }

  takeDamage() {
    if (this.isShielded || this.invulnerableTimer > 0 || this.isDead) return false;

    this.health--;
    this.invulnerableTimer = 2.0; // 2 seconds iframe
    this.particles.spawnCollisionSparks(this.mesh.position);

    if (this.health <= 0) {
      this.isDead = true;
    }
    return true;
  }

  applyShield(duration = 8.0) {
    this.shieldTimer = duration;
  }

  applySparkler(duration = 6.0) {
    this.sparklerTimer = duration;
  }

  applyNitro(duration = 5.0) {
    this.nitroTimer = duration;
    this.fuel = Math.min(100, this.fuel + 40); // Refill 40% fuel
  }
}

/**
 * Manages Spawning, Animation, and Collisions of Obstacles & Collectibles
 */
class EntityManager3D {
  constructor(scene, modelFactory, player, particles) {
    this.scene = scene;
    this.modelFactory = modelFactory;
    this.player = player;
    this.particles = particles;

    this.obstacles = [];
    this.collectibles = [];

    // Next spawn distance trigger
    this.nextSpawnZ = -60;
    this.spawnInterval = 24; // Spawns every 24 units for lively 1-minute sprint
  }

  reset() {
    this.obstacles.forEach((obs) => {
      this.scene.remove(obs.mesh);
    });
    this.collectibles.forEach((col) => {
      this.scene.remove(col.mesh);
    });

    this.obstacles = [];
    this.collectibles = [];
    this.nextSpawnZ = -60;
  }

  update(delta, onCollectCoin, onHitObstacle) {
    // 1. Procedural Spawning ahead of player
    if (this.player.position.z < this.nextSpawnZ) {
      this.spawnWave(this.nextSpawnZ - 60);
      this.nextSpawnZ -= this.spawnInterval;
    }

    // 2. Update Obstacles (Animations & Collision)
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];

      // Bird wing flap animation
      if (obs.type === 'bird') {
        obs.mesh.userData.wingPhase += delta * 14;
        const wingAngle = Math.sin(obs.mesh.userData.wingPhase) * 0.55;
        const leftWing = obs.mesh.getObjectByName('leftWing');
        const rightWing = obs.mesh.getObjectByName('rightWing');
        if (leftWing) leftWing.rotation.z = wingAngle;
        if (rightWing) rightWing.rotation.z = -wingAngle;

        // Undulating flight path
        obs.mesh.position.x += Math.sin(obs.mesh.userData.wingPhase * 0.4) * 0.08;
      }

      // Wind gust rotation
      if (obs.type === 'wind') {
        obs.mesh.rotation.z += delta * 4;
      }

      // Cloud lightning pulse
      if (obs.type === 'cloud') {
        const lightning = obs.mesh.getObjectByName('lightning');
        if (lightning && Math.random() > 0.96) {
          lightning.intensity = 3.5;
        } else if (lightning) {
          lightning.intensity *= 0.85;
        }
      }

      // Despawn behind player
      if (obs.mesh.position.z > this.player.position.z + 20) {
        this.scene.remove(obs.mesh);
        this.obstacles.splice(i, 1);
        continue;
      }

      // Collision Detection
      const pPos = this.player.position;
      const oPos = obs.mesh.position;

      // Distance check
      const dx = pPos.x - oPos.x;
      const dy = pPos.y - oPos.y;
      const dz = pPos.z - oPos.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      const hitRadius = (this.player.mesh.userData.radius || 0.65) + (obs.mesh.userData.radius || 1.2);

      if (dist < hitRadius) {
        // Wind applies turbulence buffeting
        if (obs.type === 'wind') {
          this.player.vy += (Math.random() - 0.5) * 15;
          this.player.vx += (Math.random() - 0.5) * 20;
        } else {
          // Dangerous obstacle hit
          const damaged = this.player.takeDamage();
          if (damaged) {
            onHitObstacle(obs.type);
          }
        }
      }
    }

    // 3. Update Collectibles (Spin & Collision)
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const col = this.collectibles[i];

      // Idle spin & bob
      col.mesh.rotation.y += delta * 2.5;
      col.mesh.position.y += Math.sin(Date.now() * 0.004 + col.mesh.id) * 0.015;

      // Despawn behind player
      if (col.mesh.position.z > this.player.position.z + 20) {
        this.scene.remove(col.mesh);
        this.collectibles.splice(i, 1);
        continue;
      }

      // Collision check
      const pPos = this.player.position;
      const cPos = col.mesh.position;
      const dx = pPos.x - cPos.x;
      const dy = pPos.y - cPos.y;
      const dz = pPos.z - cPos.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      const collectRadius = 1.6;

      if (dist < collectRadius) {
        // Collect Power-up
        this.handlePickup(col.type);
        onCollectCoin(col.type);

        this.particles.spawnCollisionSparks(cPos); // Golden pickup burst
        this.scene.remove(col.mesh);
        this.collectibles.splice(i, 1);
      }
    }
  }

  handlePickup(type) {
    if (type === 'coin') {
      this.player.fuel = Math.min(100, this.player.fuel + 5); // +5% Auspicious Fuel top-up per coin!
    } else if (type === 'diya') {
      this.player.applyShield(8.0);
    } else if (type === 'sparkler') {
      this.player.applySparkler(6.0);
    } else if (type === 'nitro') {
      this.player.applyNitro(5.0);
    }
  }

  /**
   * Spawn a wave of obstacles and power-ups at target Z
   */
  spawnWave(targetZ) {
    const lanes = [-7, 0, 7];
    const altitudes = [3.5, 7.5, 11.5];

    // Pick 1 or 2 lanes for obstacles
    const obstacleTypes = ['cloud', 'bird', 'building', 'wire', 'wind'];
    const chosenObs = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

    const obsLane = lanes[Math.floor(Math.random() * lanes.length)];
    const obsAlt = altitudes[Math.floor(Math.random() * altitudes.length)];

    let obsMesh = null;
    if (chosenObs === 'cloud') {
      obsMesh = this.modelFactory.createRainCloud();
      obsMesh.position.set(obsLane, obsAlt, targetZ);
    } else if (chosenObs === 'bird') {
      obsMesh = this.modelFactory.createBird();
      obsMesh.position.set(obsLane, obsAlt, targetZ);
    } else if (chosenObs === 'building') {
      obsMesh = this.modelFactory.createBuildingTower(14, 4);
      obsMesh.position.set(obsLane, 7, targetZ);
    } else if (chosenObs === 'wire') {
      obsMesh = this.modelFactory.createElectricPylon(28, 16);
      obsMesh.position.set(0, 0, targetZ);
    } else if (chosenObs === 'wind') {
      obsMesh = this.modelFactory.createWindGust();
      obsMesh.position.set(obsLane, obsAlt, targetZ);
    }

    if (obsMesh) {
      this.scene.add(obsMesh);
      this.obstacles.push({ type: chosenObs, mesh: obsMesh });
    }

    // Power-up spawner: Generous Nitro/Fuel refills (35%) + Shields (20%) + Sparklers (20%) + Coins (25%)
    const pRoll = Math.random();
    let pType = 'coin';
    if (pRoll > 0.65) pType = 'nitro';       // 35% chance: Nitro Fuel Refill
    else if (pRoll > 0.45) pType = 'diya';    // 20% chance: Diya Shield
    else if (pRoll > 0.25) pType = 'sparkler';// 20% chance: Sparkler 2x
    // else 25% chance: Lakshmi Coin

    let colMesh = null;
    if (pType === 'coin') colMesh = this.modelFactory.createLakshmiCoin();
    else if (pType === 'diya') colMesh = this.modelFactory.createDiyaShield();
    else if (pType === 'sparkler') colMesh = this.modelFactory.createSparkler();
    else if (pType === 'nitro') colMesh = this.modelFactory.createNitroCanister();

    // Place in an open lane
    const openLanes = lanes.filter(l => l !== obsLane);
    const colLane = openLanes.length > 0 ? openLanes[Math.floor(Math.random() * openLanes.length)] : 0;
    const colAlt = altitudes[Math.floor(Math.random() * altitudes.length)];

    if (colMesh) {
      colMesh.position.set(colLane, colAlt, targetZ - 10);
      this.scene.add(colMesh);
      this.collectibles.push({ type: pType, mesh: colMesh });
    }
  }
}
