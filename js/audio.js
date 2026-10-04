/**
 * Diwali Rocket Run: CDC2 Chennai to BDC14 Bangalore
 * Web Audio API Procedural Sound Synthesizer
 * 100% self-contained audio generation (no external files needed)
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
    this.thrustNode = null;
    this.thrustGain = null;
    this.isThrusting = false;
    
    // Check saved mute preference
    const savedMute = localStorage.getItem('diwali_rocket_muted');
    if (savedMute === 'true') {
      this.isMuted = true;
    }
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.initContinuousThrust();
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.init();
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('diwali_rocket_muted', this.isMuted);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  /**
   * Continuous rocket thruster noise generator
   */
  initContinuousThrust() {
    if (!this.ctx) return;

    // Create white noise buffer for propellant hiss
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to make deep rocket rumble + sizzling propellant
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, this.ctx.currentTime);

    // Oscillator for base jet roar
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(65, this.ctx.currentTime);

    this.thrustGain = this.ctx.createGain();
    this.thrustGain.gain.setValueAtTime(0, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.thrustGain);
    osc.connect(this.thrustGain);
    this.thrustGain.connect(this.masterGain);

    whiteNoise.start();
    osc.start();

    this.thrustFilter = filter;
    this.thrustOsc = osc;
  }

  /**
   * Update thruster sound intensity
   */
  updateThrust(active, isBoost = false) {
    if (!this.ctx || !this.thrustGain) return;
    this.ensureContext();

    const now = this.ctx.currentTime;
    if (active) {
      const targetGain = isBoost ? 0.35 : 0.18;
      const targetFreq = isBoost ? 450 : 220;
      const targetOscFreq = isBoost ? 110 : 70;

      this.thrustGain.gain.linearRampToValueAtTime(targetGain, now + 0.08);
      this.thrustFilter.frequency.linearRampToValueAtTime(targetFreq, now + 0.08);
      this.thrustOsc.frequency.linearRampToValueAtTime(targetOscFreq, now + 0.08);
    } else {
      this.thrustGain.gain.linearRampToValueAtTime(0.02, now + 0.15);
      this.thrustFilter.frequency.linearRampToValueAtTime(140, now + 0.15);
    }
  }

  /**
   * Lakshmi Golden Coin pickup arpeggio chime
   */
  playCoinSound() {
    this.ensureContext();
    if (this.isMuted || !this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const startTime = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.05);

      gain.gain.setValueAtTime(0, startTime + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.2, startTime + idx * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + idx * 0.05 + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime + idx * 0.05);
      osc.stop(startTime + idx * 0.05 + 0.35);
    });
  }

  /**
   * Diya Shield activation sacred hum
   */
  playShieldSound() {
    this.ensureContext();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(220, now); // A3
    osc1.frequency.exponentialRampToValueAtTime(440, now + 0.6);

    osc2.frequency.setValueAtTime(330, now); // E4
    osc2.frequency.exponentialRampToValueAtTime(660, now + 0.6);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.25);
    osc2.stop(now + 1.25);
  }

  /**
   * Sparkler boost crackle sizzle
   */
  playSparklerSound() {
    this.ensureContext();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.5;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * (Math.random() > 0.85 ? 1 : 0.2);
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3500, now);
    filter.Q.setValueAtTime(3, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.55);
  }

  /**
   * Nitro Rocket hyper boost ignition
   */
  playNitroSound() {
    this.ensureContext();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.4);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.85);
  }

  /**
   * Obstacle collision thud & crash
   */
  playHitSound() {
    this.ensureContext();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  /**
   * Milestone crossed celebratory fanfare
   */
  playMilestoneSound() {
    this.ensureContext();
    if (this.isMuted || !this.ctx) return;

    const notes = [392.00, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0, now + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.45);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.5);
    });
  }

  /**
   * Victory grand celebration symphony upon reaching BDC14
   */
  playVictorySound() {
    this.ensureContext();
    if (this.isMuted || !this.ctx) return;

    const melody = [
      { f: 523.25, d: 0.2 }, // C5
      { f: 659.25, d: 0.2 }, // E5
      { f: 783.99, d: 0.2 }, // G5
      { f: 1046.50, d: 0.4 }, // C6
      { f: 880.00, d: 0.2 }, // A5
      { f: 1046.50, d: 0.6 } // C6 (hold)
    ];

    let timeOffset = this.ctx.currentTime;
    melody.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, timeOffset);

      gain.gain.setValueAtTime(0.25, timeOffset);
      gain.gain.exponentialRampToValueAtTime(0.001, timeOffset + note.d);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(timeOffset);
      osc.stop(timeOffset + note.d + 0.05);

      timeOffset += note.d * 0.85;
    });
  }

  /**
   * Game Over descending chime
   */
  playGameOverSound() {
    this.ensureContext();
    if (this.isMuted || !this.ctx) return;

    const notes = [440, 392, 349.23, 293.66]; // A4, G4, F4, D4
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);

      gain.gain.setValueAtTime(0.2, now + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.45);
    });
  }
}

window.soundEngine = new SoundEngine();
