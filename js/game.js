/**
 * Diwali Rocket Run: CDC2 Chennai to BDC14 Bangalore
 * Master Game Director & 3D Flight Experience
 */

class Game {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    this.container = document.getElementById('game-container');

    // Game States: 'START', 'PLAYING', 'PAUSED', 'GAMEOVER', 'VICTORY'
    this.state = 'START';

    // Route & Journey configuration
    // 350 km scaled to ~1 minute (60 seconds) arcade flight
    this.totalKm = 350;
    this.zScale = 6.85; // 350 km * 6.85 = ~2400 units (~60 seconds at 40 units/s)
    this.totalZ = this.totalKm * this.zScale;

    this.milestones = [
      { km: 0, name: 'CDC2 Chennai', key: 'chennai', z: 0 },
      { km: 140, name: 'Vellore', key: 'vellore', z: -140 * this.zScale },
      { km: 250, name: 'Krishnagiri', key: 'krishnagiri', z: -250 * this.zScale },
      { km: 310, name: 'Hosur', key: 'hosur', z: -310 * this.zScale },
      { km: 350, name: 'BDC14 Bangalore', key: 'bangalore', z: -350 * this.zScale }
    ];

    // Score & Telemetry
    this.score = 0;
    this.coins = 0;
    this.distanceTraveled = 0;
    this.startTime = 0;
    this.elapsedTime = 0;
    this.currentCityIndex = 0;

    // Camera shake
    this.shakeIntensity = 0;

    // Inputs
    this.input = {
      thrust: false,
      dive: false,
      moveLeft: false,
      moveRight: false
    };

    this.initThree();
    this.initEntities();
    this.initUI();
    this.initInputs();
    this.loadLeaderboard();

    // Start render loop
    this.clock = new THREE.Clock();
    requestAnimationFrame(this.loop.bind(this));
  }

  initThree() {
    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(65, aspect, 0.1, 800);
    this.camera.position.set(0, 8, 12);

    // 3. Renderer (High-performance optimized)
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      precision: 'mediump'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // Cap pixelRatio to 1.25 to prevent 4K/Retina fillrate bottleneck while maintaining crisp rendering
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // Handle Resize
    window.addEventListener('resize', this.onResize.bind(this));
  }

  initEntities() {
    this.particles = new ParticleSystem3D(this.scene);
    this.modelFactory = new ModelFactory();
    this.world = new World3D(this.scene, this.modelFactory);
    this.player = new PlayerRocket(this.scene, this.modelFactory, this.particles);
    this.entities = new EntityManager3D(this.scene, this.modelFactory, this.player, this.particles);

    // Pre-spawn Milestone Gateway Arches in the 3D world
    this.milestones.slice(1).forEach((m) => {
      this.world.spawnMilestoneGateway(m.name, m.key, m.z);
    });
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // =========================================================================
  // USER INTERFACE & HUD
  // =========================================================================
  initUI() {
    this.hudOverlay = document.getElementById('hud-overlay');
    this.routeFill = document.getElementById('route-fill');
    this.rocketMarker = document.getElementById('rocket-marker');
    this.fuelFill = document.getElementById('fuel-fill');
    this.scoreVal = document.getElementById('score-val');
    this.coinVal = document.getElementById('coin-val');
    this.speedVal = document.getElementById('speed-val');
    this.distanceVal = document.getElementById('distance-val');
    this.milestoneToast = document.getElementById('milestone-toast');
    this.toastCity = document.getElementById('toast-city');
    this.damageFlash = document.getElementById('damage-flash');
    this.boostOverlay = document.getElementById('boost-speed-lines');
    this.powerupsBar = document.getElementById('active-powerups-bar');

    // Modals
    this.startModal = document.getElementById('start-modal');
    this.pauseModal = document.getElementById('pause-modal');
    this.gameOverModal = document.getElementById('gameover-modal');
    this.victoryModal = document.getElementById('victory-modal');
    this.leaderboardModal = document.getElementById('leaderboard-modal');
    this.instructionsModal = document.getElementById('instructions-modal');

    // Buttons
    document.getElementById('btn-start').addEventListener('click', () => this.startGame());
    document.getElementById('btn-pause').addEventListener('click', () => this.togglePause());
    document.getElementById('btn-resume').addEventListener('click', () => this.togglePause());
    document.getElementById('btn-restart').addEventListener('click', () => this.restartGame());
    document.getElementById('btn-retry').addEventListener('click', () => this.restartGame());
    document.getElementById('btn-replay').addEventListener('click', () => this.restartGame());
    document.getElementById('btn-audio').addEventListener('click', () => this.toggleAudio());
    document.getElementById('btn-leaderboard').addEventListener('click', () => this.showLeaderboard());
    document.getElementById('btn-close-leaderboard').addEventListener('click', () => this.hideLeaderboard());

    const btnRefreshLb = document.getElementById('btn-refresh-leaderboard');
    if (btnRefreshLb) {
      btnRefreshLb.addEventListener('click', () => this.fetchGlobalLeaderboard(true));
    }

    const btnHelp = document.getElementById('btn-help');
    if (btnHelp) {
      btnHelp.addEventListener('click', () => this.showInstructions());
    }
    const btnPauseHelp = document.getElementById('btn-pause-help');
    if (btnPauseHelp) {
      btnPauseHelp.addEventListener('click', () => this.showInstructions());
    }
    const btnCloseHelp = document.getElementById('btn-close-instructions');
    if (btnCloseHelp) {
      btnCloseHelp.addEventListener('click', () => this.hideInstructions());
    }

    // High Score Submission
    document.getElementById('btn-save-score').addEventListener('click', () => this.saveHighScore());
    document.getElementById('btn-save-victory').addEventListener('click', () => this.saveHighScore(true));
  }

  // =========================================================================
  // INPUT CONTROLS (Keyboard, Mouse, Touch)
  // =========================================================================
  initInputs() {
    // Keyboard
    window.addEventListener('keydown', (e) => {
      window.soundEngine.ensureContext();

      // If user is typing in a text input (e.g. Pilot Name in victory/game-over screen), DO NOT intercept!
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        if (e.key === 'Enter') {
          if (e.target.id === 'player-name-vic') {
            this.saveHighScore(true);
          } else if (e.target.id === 'player-name-go') {
            this.saveHighScore(false);
          }
        }
        return; // Allow typing W, A, S, D, Space, numbers, etc. freely!
      }

      if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
        this.input.thrust = true;
        e.preventDefault();
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        this.input.dive = true;
        e.preventDefault();
      }
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        this.input.moveLeft = true;
        e.preventDefault();
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        this.input.moveRight = true;
        e.preventDefault();
      }
      if (e.code === 'KeyP' || e.code === 'Escape') {
        this.togglePause();
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
        this.input.thrust = false;
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        this.input.dive = false;
      }
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        this.input.moveLeft = false;
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        this.input.moveRight = false;
      }
    });

    // Mouse Steering
    window.addEventListener('mousemove', (e) => {
      if (this.state !== 'PLAYING') return;
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      if (normX < -0.2) {
        this.input.moveLeft = true;
        this.input.moveRight = false;
      } else if (normX > 0.2) {
        this.input.moveRight = true;
        this.input.moveLeft = false;
      } else {
        this.input.moveLeft = false;
        this.input.moveRight = false;
      }
    });

    window.addEventListener('mousedown', (e) => {
      if (this.state === 'PLAYING') {
        this.input.thrust = true;
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.state === 'PLAYING') {
        this.input.thrust = false;
      }
    });

    // Mobile Touch Controls
    const touchBase = document.getElementById('touch-joystick-base');
    const touchThumb = document.getElementById('touch-joystick-thumb');
    const btnThrust = document.getElementById('touch-thrust-btn');

    if (touchBase && touchThumb) {
      let touchStartX = 0;
      let touchStartY = 0;

      touchBase.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        e.preventDefault();
      }, { passive: false });

      touchBase.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;
        const dist = Math.min(40, Math.sqrt(dx * dx + dy * dy));
        const angle = Math.atan2(dy, dx);

        touchThumb.style.transform = `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px))`;

        this.input.moveLeft = dx < -12;
        this.input.moveRight = dx > 12;
        this.input.dive = dy > 18;
        if (dy < -18) this.input.thrust = true;

        e.preventDefault();
      }, { passive: false });

      const resetJoystick = () => {
        touchThumb.style.transform = 'translate(-50%, -50%)';
        this.input.moveLeft = false;
        this.input.moveRight = false;
        this.input.dive = false;
      };

      touchBase.addEventListener('touchend', resetJoystick);
      touchBase.addEventListener('touchcancel', resetJoystick);
    }

    if (btnThrust) {
      btnThrust.addEventListener('touchstart', (e) => {
        this.input.thrust = true;
        e.preventDefault();
      }, { passive: false });
      btnThrust.addEventListener('touchend', (e) => {
        this.input.thrust = false;
        e.preventDefault();
      }, { passive: false });
    }
  }

  // =========================================================================
  // GAME STATE MANAGEMENT
  // =========================================================================
  startGame() {
    window.soundEngine.ensureContext();
    this.startModal.classList.add('hidden');
    this.restartGame();
    this.state = 'PLAYING';
  }

  restartGame() {
    this.state = 'PLAYING';
    this.player.reset();
    this.world.reset(); // Crucial: Repositions road segments, lanterns, and stars back to start line!
    this.entities.reset();

    this.score = 0;
    this.coins = 0;
    this.distanceTraveled = 0;
    this.startTime = Date.now();
    this.currentCityIndex = 0;

    // Reset modals
    this.startModal.classList.add('hidden');
    this.pauseModal.classList.add('hidden');
    this.gameOverModal.classList.add('hidden');
    this.victoryModal.classList.add('hidden');
    this.leaderboardModal.classList.add('hidden');
    if (this.instructionsModal) this.instructionsModal.classList.add('hidden');

    this.updateHUD();
    this.updateMilestoneNodes(0);
  }

  showInstructions() {
    if (this.instructionsModal) {
      this.instructionsModal.classList.remove('hidden');
    }
  }

  hideInstructions() {
    if (this.instructionsModal) {
      this.instructionsModal.classList.add('hidden');
    }
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      this.pauseModal.classList.remove('hidden');
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      this.pauseModal.classList.add('hidden');
    }
  }

  toggleAudio() {
    const isMuted = window.soundEngine.toggleMute();
    const btn = document.getElementById('btn-audio');
    btn.innerHTML = isMuted ? '🔇' : '🔊';
  }

  triggerDamageFX() {
    this.damageFlash.style.opacity = '1';
    this.shakeIntensity = 1.2;
    setTimeout(() => {
      this.damageFlash.style.opacity = '0';
    }, 200);
  }

  // =========================================================================
  // MAIN GAME LOOP
  // =========================================================================
  loop() {
    requestAnimationFrame(this.loop.bind(this));

    const delta = Math.min(this.clock.getDelta(), 0.08);

    if (this.state === 'PLAYING') {
      this.update(delta);
    } else if (this.state === 'VICTORY') {
      // Cinematic victory rotation around BDC14
      this.updateVictoryCinematic(delta);
    }

    this.render();
  }

  update(delta) {
    // 1. Update Player
    this.player.update(this.input, delta);

    // 2. Audio thruster loop
    window.soundEngine.updateThrust(this.input.thrust && this.player.fuel > 0, this.player.isNitroActive || this.player.isSparklerActive);

    // 3. Update Entities & Collisions
    this.entities.update(
      delta,
      (type) => this.onCollect(type),
      (type) => this.onHit(type)
    );

    // 4. Update World (Parallax highway & sky)
    this.world.update(this.player.position.z, delta);

    // 5. Update Particles
    this.particles.update(delta);

    // 6. Distance & Score Tracking
    const rawDistanceKm = Math.abs(this.player.position.z) / this.zScale;
    this.distanceTraveled = Math.min(this.totalKm, rawDistanceKm);

    const multiplier = this.player.isSparklerActive ? 2 : 1;
    this.score += Math.floor(this.player.currentSpeed * delta * 2 * multiplier);

    // 7. Check Milestones
    this.checkMilestones();

    // 8. Check Game Over Conditions
    if (this.player.isDead) {
      this.gameOver('Structural damage sustained from obstacles!');
    } else if (this.player.fuel <= 0 && this.player.position.y <= this.player.minY + 0.1) {
      this.gameOver('Fuel depleted before reaching destination!');
    }

    // 9. Check Win Condition
    if (this.distanceTraveled >= this.totalKm) {
      this.triggerVictory();
    }

    // 10. Update HUD telemetry
    this.updateHUD();

    // 11. Camera Follow Behind Rocket (3rd person chase cam)
    this.updateCamera(delta);
  }

  updateCamera(delta) {
    const targetX = this.player.position.x * 0.72;
    const targetY = this.player.position.y + 3.2;
    const targetZ = this.player.position.z + 10.2;

    // Smooth lerp
    this.camera.position.x += (targetX - this.camera.position.x) * 0.12;
    this.camera.position.y += (targetY - this.camera.position.y) * 0.12;
    this.camera.position.z += (targetZ - this.camera.position.z) * 0.15;

    // Camera shake
    if (this.shakeIntensity > 0) {
      this.camera.position.x += (Math.random() - 0.5) * this.shakeIntensity;
      this.camera.position.y += (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeIntensity *= 0.88;
      if (this.shakeIntensity < 0.02) this.shakeIntensity = 0;
    }

    // Dynamic FOV for high-speed thrill
    const targetFOV = (this.player.isNitroActive || this.player.isSparklerActive) ? 78 : 65;
    this.camera.fov += (targetFOV - this.camera.fov) * 0.1;
    this.camera.updateProjectionMatrix();

    // Look slightly ahead of rocket
    this.camera.lookAt(
      this.player.position.x * 0.4,
      this.player.position.y + 0.6,
      this.player.position.z - 16
    );

    // Boost screen lines
    if (this.boostOverlay) {
      this.boostOverlay.style.opacity = (this.player.isNitroActive || this.player.isSparklerActive) ? '1' : '0';
    }
  }

  // =========================================================================
  // EVENTS & GAMEPLAY TRIGGERS
  // =========================================================================
  onCollect(type) {
    if (type === 'coin') {
      this.coins++;
      this.score += 250;
      window.soundEngine.playCoinSound();
    } else if (type === 'diya') {
      window.soundEngine.playShieldSound();
    } else if (type === 'sparkler') {
      window.soundEngine.playSparklerSound();
    } else if (type === 'nitro') {
      window.soundEngine.playNitroSound();
    }
  }

  onHit(type) {
    window.soundEngine.playHitSound();
    this.triggerDamageFX();
  }

  checkMilestones() {
    for (let i = this.currentCityIndex + 1; i < this.milestones.length; i++) {
      if (this.distanceTraveled >= this.milestones[i].km) {
        this.currentCityIndex = i;
        this.showMilestoneToast(this.milestones[i].name);
        this.updateMilestoneNodes(i);
        window.soundEngine.playMilestoneSound();

        // Celebratory aerial fireworks
        this.particles.spawnFirework(
          this.player.position.x + (Math.random() - 0.5) * 30,
          25 + Math.random() * 15,
          this.player.position.z - 50
        );
        break;
      }
    }
  }

  showMilestoneToast(cityName) {
    this.toastCity.innerText = `CROSSING ${cityName.toUpperCase()}`;
    this.milestoneToast.classList.add('active');
    setTimeout(() => {
      this.milestoneToast.classList.remove('active');
    }, 3200);
  }

  updateMilestoneNodes(currentIdx) {
    const nodes = document.querySelectorAll('.milestone-node');
    nodes.forEach((node, idx) => {
      node.classList.remove('completed', 'current');
      if (idx < currentIdx) {
        node.classList.add('completed');
      } else if (idx === currentIdx) {
        node.classList.add('current');
      }
    });
  }

  updateHUD() {
    // Route progress
    const pct = Math.min(100, (this.distanceTraveled / this.totalKm) * 100);
    this.routeFill.style.width = `${pct}%`;
    this.rocketMarker.style.left = `${pct}%`;

    // Fuel Gauge
    this.fuelFill.style.width = `${Math.max(0, this.player.fuel)}%`;
    if (this.player.fuel < 25) {
      this.fuelFill.classList.add('warning');
    } else {
      this.fuelFill.classList.remove('warning');
    }

    // Health Hearts & Shield badge
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((h, idx) => {
      if (idx < this.player.health) {
        h.classList.remove('lost');
      } else {
        h.classList.add('lost');
      }
    });

    const shieldBadge = document.getElementById('shield-status');
    if (shieldBadge) {
      shieldBadge.style.display = this.player.isShielded ? 'inline-flex' : 'none';
    }

    // Telemetry labels
    this.scoreVal.innerText = this.score;
    this.coinVal.innerText = this.coins;
    this.speedVal.innerText = Math.round(this.player.currentSpeed * 2.8);
    this.distanceVal.innerText = `${Math.round(this.distanceTraveled)} / ${this.totalKm}`;

    // Active power-up pills
    this.updatePowerupPills();
  }

  updatePowerupPills() {
    let pillsHTML = '';
    if (this.player.isShielded) {
      pillsHTML += `<div class="powerup-pill">🪔 Diya Shield (${Math.ceil(this.player.shieldTimer)}s)</div>`;
    }
    if (this.player.isSparklerActive) {
      pillsHTML += `<div class="powerup-pill">✨ Sparkler 2X (${Math.ceil(this.player.sparklerTimer)}s)</div>`;
    }
    if (this.player.isNitroActive) {
      pillsHTML += `<div class="powerup-pill">🚀 Nitro Boost (${Math.ceil(this.player.nitroTimer)}s)</div>`;
    }
    this.powerupsBar.innerHTML = pillsHTML;
  }

  // =========================================================================
  // GAME OVER & VICTORY
  // =========================================================================
  gameOver(reason) {
    this.state = 'GAMEOVER';
    window.soundEngine.updateThrust(false);
    window.soundEngine.playGameOverSound();

    document.getElementById('gameover-reason').innerText = reason;
    document.getElementById('stat-go-distance').innerText = `${Math.round(this.distanceTraveled)} km (${this.milestones[this.currentCityIndex].name})`;
    document.getElementById('stat-go-coins').innerText = this.coins;
    document.getElementById('stat-go-score').innerText = this.score;

    this.gameOverModal.classList.remove('hidden');
  }

  triggerVictory() {
    this.state = 'VICTORY';
    window.soundEngine.updateThrust(false);
    window.soundEngine.playVictorySound();

    // Calculate Bonuses
    const completionSeconds = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));
    const timeBonus = Math.max(500, 3000 - completionSeconds * 10);
    const fuelBonus = Math.round(this.player.fuel * 25);
    const finalScore = this.score + timeBonus + fuelBonus;

    document.getElementById('stat-vic-time').innerText = `${completionSeconds}s (+${timeBonus})`;
    document.getElementById('stat-vic-fuel').innerText = `${Math.round(this.player.fuel)}% (+${fuelBonus})`;
    document.getElementById('stat-vic-coins').innerText = `${this.coins} (x250)`;
    document.getElementById('stat-vic-score').innerText = finalScore;
    this.finalVictoryScore = finalScore;

    this.victoryModal.classList.remove('hidden');
  }

  updateVictoryCinematic(delta) {
    this.particles.update(delta);

    // Continuous grand fireworks & marigold confetti
    if (Math.random() > 0.88) {
      this.particles.spawnFirework(
        this.player.position.x + (Math.random() - 0.5) * 60,
        25 + Math.random() * 25,
        this.player.position.z - 40 - Math.random() * 40
      );
    }
    this.particles.spawnVictoryConfetti(this.player.position);

    // Camera celebratory orbit
    const time = Date.now() * 0.0008;
    this.camera.position.x = this.player.position.x + Math.sin(time) * 16;
    this.camera.position.z = this.player.position.z + Math.cos(time) * 16;
    this.camera.position.y = this.player.position.y + 6;
    this.camera.lookAt(this.player.position);
  }

  // =========================================================================
  // GLOBAL LEADERBOARD & SESSION TELEMETRY
  // =========================================================================
  loadLeaderboard() {
    // 1. Initial cached or fallback leaderboard
    const cached = localStorage.getItem('diwali_rocket_global_cache');
    const local = localStorage.getItem('diwali_rocket_leaderboard');
    if (cached) {
      try { this.leaderboard = JSON.parse(cached); } catch (e) { this.leaderboard = []; }
    } else if (local) {
      try { this.leaderboard = JSON.parse(local); } catch (e) { this.leaderboard = []; }
    } else {
      this.leaderboard = [
        { rank: 1, name: 'Diwali Rider', score: 18500, city: 'BDC14 Bangalore', date: 'Diwali Eve' },
        { rank: 2, name: 'Chennai Express', score: 14200, city: 'Hosur', date: 'Diwali Eve' },
        { rank: 3, name: 'Rocket Raja', score: 11600, city: 'Krishnagiri', date: 'Diwali Eve' },
        { rank: 4, name: 'Festive Flyer', score: 9800, city: 'Vellore', date: 'Diwali Eve' },
        { rank: 5, name: 'Sparkler Ace', score: 7500, city: 'CDC2 Chennai', date: 'Diwali Eve' }
      ];
    }

    // 2. Asynchronously fetch latest global leaderboard from cloud Web App
    this.fetchGlobalLeaderboard(false);
  }

  async fetchGlobalLeaderboard(forceRefresh = false) {
    const statusEl = document.getElementById('leaderboard-sync-status');
    const apiUrl = window.GAME_CONFIG && window.GAME_CONFIG.API_URL;

    if (!apiUrl || !apiUrl.trim()) {
      if (statusEl) {
        statusEl.innerHTML = '<span>💾 Local Champions (Connect Google Sheets for Global Sync)</span>';
      }
      this.renderLeaderboardUI();
      return;
    }

    if (statusEl) {
      statusEl.innerHTML = '<span>🔄 Syncing with Global Database...</span>';
    }

    try {
      const limit = (window.GAME_CONFIG && window.GAME_CONFIG.LEADERBOARD_LIMIT) || 1000;
      const url = `${apiUrl}?action=get_leaderboard&limit=${limit}&t=${Date.now()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data && data.champions && Array.isArray(data.champions) && data.champions.length > 0) {
        this.leaderboard = data.champions;
        localStorage.setItem('diwali_rocket_global_cache', JSON.stringify(this.leaderboard));
        if (statusEl) {
          statusEl.innerHTML = `<span>⚡ Live Worldwide Leaderboard (Top ${data.champions.length})</span>`;
        }
      }
    } catch (err) {
      console.warn('Could not fetch global leaderboard, using cached data:', err);
      if (statusEl) {
        statusEl.innerHTML = '<span>⚠️ Showing Cached / Local Champions</span>';
      }
    }

    this.renderLeaderboardUI();
  }

  async saveHighScore(isVictory = false) {
    const inputId = isVictory ? 'player-name-vic' : 'player-name-go';
    const statusId = isVictory ? 'score-save-status-vic' : 'score-save-status-go';
    const btnId = isVictory ? 'btn-save-victory' : 'btn-save-score';

    const nameInput = document.getElementById(inputId);
    const statusEl = document.getElementById(statusId);
    const saveBtn = document.getElementById(btnId);

    const playerName = (nameInput && nameInput.value.trim()) || (window.GAME_CONFIG && window.GAME_CONFIG.DEFAULT_NAME) || 'Festive Pilot';
    const scoreToSave = isVictory ? (this.finalVictoryScore || this.score) : this.score;
    const flightSeconds = Math.max(1, Math.round((Date.now() - (this.startTime || Date.now())) / 1000));
    const currentCityName = this.milestones[this.currentCityIndex] ? this.milestones[this.currentCityIndex].name : 'CDC2 Chennai';
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const platform = isMobile ? 'Mobile' : 'Desktop';

    if (statusEl) {
      statusEl.innerText = '⏳ Recording flight telemetry & saving score...';
      statusEl.className = 'score-save-status';
    }
    if (saveBtn) saveBtn.disabled = true;
    if (nameInput) nameInput.disabled = true;

    // 1. Immediately record in local storage so user never loses their score
    const localEntry = {
      name: playerName,
      score: scoreToSave,
      city: currentCityName,
      date: new Date().toLocaleDateString()
    };
    this.leaderboard.push(localEntry);
    this.leaderboard.sort((a, b) => b.score - a.score);
    const limit = (window.GAME_CONFIG && window.GAME_CONFIG.LEADERBOARD_LIMIT) || 1000;
    this.leaderboard = this.leaderboard.slice(0, limit);
    localStorage.setItem('diwali_rocket_leaderboard', JSON.stringify(this.leaderboard));

    // 2. Transmit session telemetry & global high score to cloud backend
    const apiUrl = window.GAME_CONFIG && window.GAME_CONFIG.API_URL;
    if (apiUrl && apiUrl.trim()) {
      try {
        const queryParams = new URLSearchParams({
          action: 'submit_score',
          pilot: playerName,
          score: scoreToSave.toString(),
          status: isVictory ? 'VICTORY' : 'CRASH',
          milestone: currentCityName,
          distanceKm: Math.round(this.distanceTraveled).toString(),
          coins: this.coins.toString(),
          flightTime: flightSeconds.toString(),
          fuelRemaining: Math.round(this.player.fuel).toString(),
          device: platform,
          limit: limit.toString()
        });

        // Use GET parameter transmission to prevent CORS issues with Google Apps Script
        await fetch(`${apiUrl}?${queryParams.toString()}`, { mode: 'no-cors' });

        if (statusEl) {
          statusEl.innerText = '🎉 Champion score & telemetry saved to Global Database!';
        }
      } catch (err) {
        console.warn('Telemetry cloud submission notice:', err);
        if (statusEl) {
          statusEl.innerText = '✅ Score saved locally! (Will sync when online)';
        }
      }
    } else {
      if (statusEl) {
        statusEl.innerText = '✅ Score saved to local leaderboard!';
      }
    }

    // Refresh and display leaderboard modal after brief pause
    setTimeout(() => {
      this.showLeaderboard();
    }, 900);
  }

  showLeaderboard() {
    this.fetchGlobalLeaderboard(false);
    this.renderLeaderboardUI();
    this.leaderboardModal.classList.remove('hidden');
  }

  hideLeaderboard() {
    this.leaderboardModal.classList.add('hidden');
  }

  renderLeaderboardUI() {
    const list = document.getElementById('leaderboard-list');
    if (!list) return;

    if (!this.leaderboard || this.leaderboard.length === 0) {
      list.innerHTML = '<div style="padding: 20px; color: #aaa;">No champions recorded yet. Be the first!</div>';
      return;
    }

    list.innerHTML = this.leaderboard.map((item, idx) => {
      const rank = item.rank || (idx + 1);
      let rankDisplay = `#${rank}`;
      if (rank === 1) rankDisplay = '🥇';
      else if (rank === 2) rankDisplay = '🥈';
      else if (rank === 3) rankDisplay = '🥉';

      const pilotName = item.name || item.pilot || 'Festive Pilot';
      const city = item.city || item.milestone || 'CDC2 Chennai';
      const dateText = item.date ? ` • ${item.date}` : '';

      return `
        <div class="leaderboard-entry">
          <div class="lb-left">
            <span class="lb-rank">${rankDisplay}</span>
            <div class="lb-details">
              <span class="lb-name">${pilotName}</span>
              <span class="lb-city">${city}${dateText}</span>
            </div>
          </div>
          <span class="lb-score">${item.score} pts</span>
        </div>
      `;
    }).join('');
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate game on load
window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});
